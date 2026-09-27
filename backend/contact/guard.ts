// Lightweight abuse protection for the contact form: honeypot, minimum fill time,
// per-client rate limit and duplicate suppression.
//
// The rate limiter and duplicate cache live in process memory. That is enough for a
// single long-running server; on serverless platforms each instance keeps its own
// counters, so treat it as a first line of defence and add a shared store or a
// bot-protection service (e.g. Vercel BotID, Cloudflare Turnstile) if spam appears.

export const GUARD = {
  /** Submissions faster than this after the form rendered are treated as automated. */
  minFillMs: 3_000,
  /** Timestamps older than this are ignored rather than trusted. */
  maxFillMs: 24 * 60 * 60 * 1000,
  rateLimit: { max: 5, windowMs: 10 * 60 * 1000 },
  duplicateWindowMs: 30 * 60 * 1000,
} as const;

export type GuardVerdict = "ok" | "honeypot" | "too_fast" | "rate_limited";

export function checkHoneypot(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * `startedAt` is set by the browser after hydration. It is absent when JavaScript is
 * disabled, in which case the timing check is skipped instead of blocking the visitor.
 */
export function isTooFast(startedAt: unknown, now: number): boolean {
  const started = Number(startedAt);
  if (!startedAt || !Number.isFinite(started)) return false;
  const elapsed = now - started;
  if (elapsed < 0 || elapsed > GUARD.maxFillMs) return false;
  return elapsed < GUARD.minFillMs;
}

export class SlidingWindowLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  /** Records an attempt and returns false when the key is over its limit. */
  attempt(key: string, now: number): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    this.prune(now);
    return true;
  }

  private prune(now: number) {
    if (this.hits.size < 5_000) return;
    for (const [key, times] of this.hits) {
      if (times.every((t) => now - t >= this.windowMs)) this.hits.delete(key);
    }
  }
}

export class RecentSet {
  private seen = new Map<string, number>();

  constructor(private readonly windowMs: number) {}

  has(key: string, now: number): boolean {
    const at = this.seen.get(key);
    return at !== undefined && now - at < this.windowMs;
  }

  add(key: string, now: number) {
    this.seen.set(key, now);
    if (this.seen.size > 5_000) {
      for (const [k, at] of this.seen) if (now - at >= this.windowMs) this.seen.delete(k);
    }
  }
}
