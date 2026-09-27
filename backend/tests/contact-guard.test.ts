import { describe, expect, it } from "vitest";
import { GUARD, RecentSet, SlidingWindowLimiter, checkHoneypot, isTooFast } from "@backend/contact/guard";

describe("abuse checks", () => {
  it("flags a filled honeypot only", () => {
    expect(checkHoneypot("http://spam.example")).toBe(true);
    expect(checkHoneypot("   ")).toBe(false);
    expect(checkHoneypot(null)).toBe(false);
  });

  it("flags submissions faster than the minimum fill time", () => {
    const now = 1_000_000;
    expect(isTooFast(String(now - 500), now)).toBe(true);
    expect(isTooFast(String(now - GUARD.minFillMs), now)).toBe(false);
  });

  it("does not block when the timestamp is missing, invalid, future or stale", () => {
    const now = 1_000_000_000;
    expect(isTooFast(null, now)).toBe(false);
    expect(isTooFast("", now)).toBe(false);
    expect(isTooFast("abc", now)).toBe(false);
    expect(isTooFast(String(now + 10_000), now)).toBe(false);
    expect(isTooFast(String(now - GUARD.maxFillMs - 1), now)).toBe(false);
  });
});

describe("SlidingWindowLimiter", () => {
  it("allows up to the limit per key within the window, then recovers", () => {
    const limiter = new SlidingWindowLimiter(2, 1000);
    expect(limiter.attempt("ip", 0)).toBe(true);
    expect(limiter.attempt("ip", 10)).toBe(true);
    expect(limiter.attempt("ip", 20)).toBe(false);
    expect(limiter.attempt("other", 20)).toBe(true);
    expect(limiter.attempt("ip", 1011)).toBe(true);
  });
});

describe("RecentSet", () => {
  it("remembers keys for the configured window", () => {
    const set = new RecentSet(1000);
    set.add("k", 0);
    expect(set.has("k", 999)).toBe(true);
    expect(set.has("k", 1000)).toBe(false);
  });
});
