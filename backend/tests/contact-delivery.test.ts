import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverInquiry, getDeliveryConfig, type Submission } from "@backend/contact/delivery";

const submission: Submission = {
  name: "Ana Pérez",
  email: "ana@company.com",
  company: "Example Industrial",
  interest: "assessment",
  message: "We won a contract in Colombia.",
  locale: "es",
  submittedAt: "2026-09-27T12:00:00.000Z",
};

afterEach(() => vi.restoreAllMocks());

describe("getDeliveryConfig", () => {
  it("returns null when nothing is configured", () => {
    expect(getDeliveryConfig({ NODE_ENV: "production" })).toBeNull();
  });

  it("prefers an https webhook", () => {
    expect(
      getDeliveryConfig({ NODE_ENV: "production", CONTACT_WEBHOOK_URL: "https://hooks.example.com/x", RESEND_API_KEY: "k" }),
    ).toEqual({ kind: "webhook", url: "https://hooks.example.com/x", secret: undefined });
  });

  it("rejects plain-http webhooks in production unless they point to localhost", () => {
    expect(getDeliveryConfig({ NODE_ENV: "production", CONTACT_WEBHOOK_URL: "http://hooks.example.com/x" })).toBeNull();
    expect(getDeliveryConfig({ NODE_ENV: "production", CONTACT_WEBHOOK_URL: "http://localhost:4000/x" })?.kind).toBe(
      "webhook",
    );
    expect(getDeliveryConfig({ NODE_ENV: "production", CONTACT_WEBHOOK_URL: "not a url" })).toBeNull();
  });

  it("requires all three Resend variables", () => {
    const base = { NODE_ENV: "production", RESEND_API_KEY: "re_123", CONTACT_FROM_EMAIL: "Lurio <web@lurio.co>" };
    expect(getDeliveryConfig(base)).toBeNull();
    expect(getDeliveryConfig({ ...base, CONTACT_TO_EMAIL: "a@lurio.co, b@lurio.co" })).toEqual({
      kind: "resend",
      apiKey: "re_123",
      from: "Lurio <web@lurio.co>",
      to: ["a@lurio.co", "b@lurio.co"],
    });
  });

  it("only enables the dev log in development", () => {
    expect(getDeliveryConfig({ NODE_ENV: "development", CONTACT_DEV_LOG: "true" })).toEqual({ kind: "dev-log" });
    expect(getDeliveryConfig({ NODE_ENV: "production", CONTACT_DEV_LOG: "true" })).toBeNull();
  });
});

describe("deliverInquiry", () => {
  it("reports not_configured without calling anything", async () => {
    const fetchImpl = vi.fn();
    expect(await deliverInquiry(submission, null, fetchImpl)).toEqual({ ok: false, reason: "not_configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts JSON to the webhook with the bearer secret and succeeds on 2xx", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 202 }));
    const result = await deliverInquiry(
      submission,
      { kind: "webhook", url: "https://h.example/x", secret: "s3cret" },
      fetchImpl,
    );
    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://h.example/x");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer s3cret");
    expect(JSON.parse(init.body as string)).toMatchObject({ email: "ana@company.com", interest: "assessment", locale: "es" });
  });

  it("sends a Resend email with reply-to set to the visitor", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    await deliverInquiry(
      submission,
      { kind: "resend", apiKey: "re_1", to: ["team@lurio.co"], from: "web@lurio.co" },
      fetchImpl,
    );
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(init.body as string)).toMatchObject({ to: ["team@lurio.co"], reply_to: "ana@company.com" });
  });

  it("fails on non-2xx responses and network errors", async () => {
    const config = { kind: "webhook", url: "https://h.example/x" } as const;
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await deliverInquiry(submission, config, vi.fn(async () => new Response(null, { status: 500 })))).toEqual({
      ok: false,
      reason: "failed",
    });
    expect(
      await deliverInquiry(submission, config, vi.fn(async () => Promise.reject(new Error("ECONNREFUSED")))),
    ).toEqual({ ok: false, reason: "failed" });
  });
});
