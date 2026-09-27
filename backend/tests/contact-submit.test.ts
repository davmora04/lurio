import { beforeEach, describe, expect, it, vi } from "vitest";
import { GUARD, RecentSet, SlidingWindowLimiter } from "@backend/contact/guard";
import { processContact, type SubmitContext } from "@backend/contact/submit";

const NOW = 1_800_000_000_000;

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const fields = {
    name: "Ana Pérez",
    email: "ana@company.com",
    company: "Example Industrial",
    interest: "expansion",
    message: "We are planning our first Colombia operation.",
    website: "",
    startedAt: String(NOW - 20_000),
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

let ctx: SubmitContext;
let fetchImpl: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));
  ctx = {
    clientKey: "203.0.113.7",
    now: NOW,
    delivery: { kind: "webhook", url: "https://h.example/x" },
    fetchImpl: fetchImpl as unknown as typeof fetch,
    limiter: new SlidingWindowLimiter(GUARD.rateLimit.max, GUARD.rateLimit.windowMs),
    delivered: new RecentSet(GUARD.duplicateWindowMs),
  };
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("processContact", () => {
  it("delivers a valid inquiry and reports success only after the destination confirms", async () => {
    expect(await processContact(form(), ctx)).toEqual({ status: "success" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("returns field errors and the submitted values without delivering", async () => {
    const result = await processContact(form({ email: "nope" }), ctx);
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.errors.email).toBe("invalid");
      expect(result.values.name).toBe("Ana Pérez");
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("drops honeypot submissions without delivering", async () => {
    const result = await processContact(form({ website: "https://spam.example" }), ctx);
    expect(result).toMatchObject({ status: "error", reason: "failed" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects submissions made faster than a person could fill the form", async () => {
    const result = await processContact(form({ startedAt: String(NOW - 800) }), ctx);
    expect(result).toMatchObject({ status: "error", reason: "too_fast" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("suppresses an identical inquiry that was already delivered", async () => {
    await processContact(form(), ctx);
    expect(await processContact(form({ message: "We are planning  our first Colombia operation." }), ctx)).toEqual({
      status: "duplicate",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rate-limits repeated attempts from the same client", async () => {
    for (let i = 0; i < GUARD.rateLimit.max; i++) {
      expect((await processContact(form({ message: `Different inquiry number ${i}` }), ctx)).status).toBe("success");
    }
    expect(await processContact(form({ message: "One more different inquiry" }), ctx)).toMatchObject({
      status: "error",
      reason: "rate_limited",
    });
  });

  it("reports the form as unavailable when no destination is configured", async () => {
    const result = await processContact(form(), { ...ctx, delivery: null });
    expect(result).toMatchObject({ status: "error", reason: "unavailable" });
  });

  it("does not claim success when the destination fails, and allows a retry", async () => {
    fetchImpl.mockResolvedValueOnce(new Response(null, { status: 503 }));
    expect(await processContact(form(), ctx)).toMatchObject({ status: "error", reason: "failed" });
    expect(await processContact(form(), ctx)).toEqual({ status: "success" });
  });
});
