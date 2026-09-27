import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitContact } from "@/app/actions";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.99" }),
}));

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("CONTACT_WEBHOOK_URL", "https://example.test/inquiries");
  vi.stubEnv("CONTACT_WEBHOOK_SECRET", "");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("CONTACT_DEV_LOG", "");
});

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function inquiry(email: string) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "  Ana  Perez ", email, company: "Example", message: "Planning our Colombia expansion.",
    interest: "assessment", locale: "es", startedAt: String(Date.now() - 10_000),
  })) data.set(key, value);
  return data;
}

describe("frontend contact action connected to backend", () => {
  it("delivers a normalized bilingual inquiry through the backend", async () => {
    const send = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", send);
    expect(await submitContact({ status: "idle" }, inquiry("ACTION@EXAMPLE.COM"))).toEqual({ status: "success" });
    const [, request] = send.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(request.body as string)).toMatchObject({
      name: "Ana Perez", email: "action@example.com", locale: "es", interest: "assessment",
    });
  });

  it("returns backend validation errors without contacting a destination", async () => {
    const send = vi.fn(); vi.stubGlobal("fetch", send);
    expect(await submitContact({ status: "idle" }, inquiry("invalid"))).toMatchObject({
      status: "invalid", errors: { email: "invalid" },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("preserves the unavailable state when delivery is not configured", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    const send = vi.fn(); vi.stubGlobal("fetch", send);
    expect(await submitContact({ status: "idle" }, inquiry("unconfigured@example.com"))).toMatchObject({
      status: "error", reason: "unavailable",
    });
    expect(send).not.toHaveBeenCalled();
  });
});
