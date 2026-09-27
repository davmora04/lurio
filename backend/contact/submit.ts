// Orchestrates a contact submission: normalize → abuse checks → validate → deliver.
// Framework-free so it can be unit tested; frontend/app/actions.ts wires
// in the request context.

import { createHash } from "node:crypto";
import { deliverInquiry, getDeliveryConfig, type DeliveryConfig } from "./delivery";
import { GUARD, RecentSet, SlidingWindowLimiter, checkHoneypot, isTooFast } from "./guard";
import { hasErrors, normalizeContact, validateContact, type ContactFields } from "../contracts/schema";
import type { ContactState } from "../contracts/state";

export type { ContactState } from "../contracts/state";

export type SubmitContext = {
  clientKey: string;
  now: number;
  delivery: DeliveryConfig | null;
  fetchImpl?: typeof fetch;
  limiter: SlidingWindowLimiter;
  delivered: RecentSet;
};

// Shared across requests within one server instance.
const limiter = new SlidingWindowLimiter(GUARD.rateLimit.max, GUARD.rateLimit.windowMs);
const delivered = new RecentSet(GUARD.duplicateWindowMs);

export function defaultContext(clientKey: string): SubmitContext {
  return { clientKey, now: Date.now(), delivery: getDeliveryConfig(), limiter, delivered };
}

function fingerprint(fields: ContactFields): string {
  return createHash("sha256")
    .update([fields.email, fields.company.toLowerCase(), fields.message.replace(/\s+/g, " ")].join("\u0000"))
    .digest("hex");
}

export async function processContact(formData: FormData, ctx: SubmitContext): Promise<ContactState> {
  const raw = Object.fromEntries(
    ["name", "email", "company", "interest", "message", "locale", "website", "startedAt"].map((k) => [k, formData.get(k)]),
  );
  const values = normalizeContact(raw);

  // Bots that fill the hidden field get a generic failure and nothing is delivered.
  if (checkHoneypot(raw.website)) return { status: "error", reason: "failed", values };
  if (isTooFast(raw.startedAt, ctx.now)) return { status: "error", reason: "too_fast", values };

  const errors = validateContact(values);
  if (hasErrors(errors)) return { status: "invalid", errors, values };

  const key = fingerprint(values);
  if (ctx.delivered.has(key, ctx.now)) return { status: "duplicate" };

  if (!ctx.limiter.attempt(ctx.clientKey, ctx.now)) return { status: "error", reason: "rate_limited", values };

  const result = await deliverInquiry(
    { ...values, submittedAt: new Date(ctx.now).toISOString() },
    ctx.delivery,
    ctx.fetchImpl,
  );

  if (!result.ok) {
    return { status: "error", reason: result.reason === "not_configured" ? "unavailable" : "failed", values };
  }

  ctx.delivered.add(key, ctx.now);
  return { status: "success" };
}
