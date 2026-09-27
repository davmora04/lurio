// Orchestrates a contact submission: normalize → abuse checks → validate → deliver.
// Framework-free so it can be unit tested; frontend/app/actions.ts wires
// in the request context.

import { createHash } from "node:crypto";
import { deliverInquiry, getDeliveryConfig, type DeliveryConfig } from "./delivery";
import { GUARD, RecentSet, SlidingWindowLimiter, checkHoneypot, isTooFast } from "./guard";
import { hasErrors, normalizeContact, validateContact, type ContactFields } from "../contracts/schema";
import type { ContactState } from "../contracts/state";
import { getContactStore, type ContactStore } from "./storage";

export type { ContactState } from "../contracts/state";

export type SubmitContext = {
  clientKey: string;
  now: number;
  delivery: DeliveryConfig | null;
  fetchImpl?: typeof fetch;
  limiter: SlidingWindowLimiter;
  delivered: RecentSet;
  store?: ContactStore | null;
};

// Shared across requests within one server instance.
const limiter = new SlidingWindowLimiter(GUARD.rateLimit.max, GUARD.rateLimit.windowMs);
const delivered = new RecentSet(GUARD.duplicateWindowMs);

export function defaultContext(clientKey: string): SubmitContext {
  return { clientKey, now: Date.now(), delivery: getDeliveryConfig(), store: getContactStore(), limiter, delivered };
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

  const submission = { ...values, submittedAt: new Date(ctx.now).toISOString() };
  if (ctx.store) {
    let id: string;
    try {
      id = await ctx.store.save(submission, ctx.delivery !== null);
    } catch {
      console.error("[contact] Database save failed");
      return { status: "error", reason: "failed", values };
    }
    // Receipt means durable storage. Notification failure must not prompt a resubmission.
    ctx.delivered.add(key, ctx.now);
    if (ctx.delivery) {
      const notification = await deliverInquiry(submission, ctx.delivery, ctx.fetchImpl);
      try {
        await ctx.store.markNotification(id, notification.ok ? "sent" : "failed");
      } catch {
        console.error("[contact] Notification status update failed");
      }
    }
    return { status: "success" };
  }

  const result = await deliverInquiry(
    submission,
    ctx.delivery,
    ctx.fetchImpl,
  );

  if (!result.ok) {
    return { status: "error", reason: result.reason === "not_configured" ? "unavailable" : "failed", values };
  }

  ctx.delivered.add(key, ctx.now);
  return { status: "success" };
}
