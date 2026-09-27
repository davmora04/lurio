// Delivers a validated inquiry to the configured destination. A submission counts as
// received only when the destination answers with a 2xx status.
//
// Supported destinations (configure one; see .env.example and README):
// - webhook: CONTACT_WEBHOOK_URL — JSON POST to a CRM, automation tool or inbox relay.
// - resend:  RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL — email via Resend's REST API.
// - dev-log: CONTACT_DEV_LOG=true — development only; logs to the server console.

import { INTERESTS, type ContactFields } from "../contracts/schema";

export type DeliveryConfig =
  | { kind: "webhook"; url: string; secret?: string }
  | { kind: "resend"; apiKey: string; to: string[]; from: string }
  | { kind: "dev-log" };

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export type Submission = ContactFields & { submittedAt: string };

type Env = Record<string, string | undefined>;

const TIMEOUT_MS = 10_000;

export function getDeliveryConfig(env: Env = process.env): DeliveryConfig | null {
  const webhook = env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const url = new URL(webhook);
      // Plain http is only accepted for local testing.
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      if (url.protocol === "https:" || (url.protocol === "http:" && (local || env.NODE_ENV !== "production"))) {
        return { kind: "webhook", url: url.toString(), secret: env.CONTACT_WEBHOOK_SECRET?.trim() || undefined };
      }
    } catch {
      // Invalid URL: fall through to the other providers.
    }
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const from = env.CONTACT_FROM_EMAIL?.trim();
  if (apiKey && to.length > 0 && from) return { kind: "resend", apiKey, to, from };

  if (env.CONTACT_DEV_LOG === "true" && env.NODE_ENV === "development") return { kind: "dev-log" };

  return null;
}

function subjectFor(s: Submission): string {
  return `Lurio website inquiry — ${INTERESTS[s.interest]} — ${s.company}`.slice(0, 200);
}

function plainText(s: Submission): string {
  return [
    `Interest: ${INTERESTS[s.interest]}`,
    `Name: ${s.name}`,
    `Work email: ${s.email}`,
    `Company: ${s.company}`,
    `Site language: ${s.locale}`,
    `Submitted: ${s.submittedAt}`,
    "",
    s.message,
  ].join("\n");
}

export async function deliverInquiry(
  submission: Submission,
  config: DeliveryConfig | null,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  if (!config) return { ok: false, reason: "not_configured" };

  if (config.kind === "dev-log") {
    console.info("[contact] CONTACT_DEV_LOG inquiry (not delivered anywhere):\n" + plainText(submission));
    return { ok: true };
  }

  const request: { url: string; init: RequestInit } =
    config.kind === "webhook"
      ? {
          url: config.url,
          init: {
            headers: {
              "Content-Type": "application/json",
              ...(config.secret ? { Authorization: `Bearer ${config.secret}` } : {}),
            },
            body: JSON.stringify({
              source: "lurio-website",
              interest: submission.interest,
              interestLabel: INTERESTS[submission.interest],
              name: submission.name,
              email: submission.email,
              company: submission.company,
              message: submission.message,
              locale: submission.locale,
              submittedAt: submission.submittedAt,
            }),
          },
        }
      : {
          url: "https://api.resend.com/emails",
          init: {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
            body: JSON.stringify({
              from: config.from,
              to: config.to,
              reply_to: submission.email,
              subject: subjectFor(submission),
              text: plainText(submission),
            }),
          },
        };

  try {
    const response = await fetchImpl(request.url, {
      ...request.init,
      method: "POST",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (response.ok) return { ok: true };
    console.error(`[contact] ${config.kind} delivery rejected with HTTP ${response.status}`);
    return { ok: false, reason: "failed" };
  } catch (error) {
    console.error(`[contact] ${config.kind} delivery failed:`, error instanceof Error ? error.message : error);
    return { ok: false, reason: "failed" };
  }
}
