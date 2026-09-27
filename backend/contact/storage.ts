import { neon } from "@neondatabase/serverless";
import type { Submission } from "./delivery";

export type NotificationStatus = "sent" | "failed";
export interface ContactStore {
  save(submission: Submission, notify: boolean): Promise<string>;
  markNotification(id: string, status: NotificationStatus): Promise<void>;
}

/** Created lazily: invalid credentials are handled as a submission failure, never exposed. */
export function getContactStore(url = process.env.DATABASE_URL): ContactStore | null {
  if (!url?.trim()) return null;
  const query = () => neon(url.trim(), { fetchOptions: { signal: AbortSignal.timeout(10_000) } });
  return {
    async save(s, notify) {
      const sql = query();
      const rows = await sql`
        INSERT INTO contact_requests (name, email, company, interest, message, locale, created_at, notification_status)
        VALUES (${s.name}, ${s.email}, ${s.company}, ${s.interest}, ${s.message}, ${s.locale},
          ${s.submittedAt}, ${notify ? "pending" : "not_configured"})
        RETURNING id
      `;
      if (!rows[0]?.id) throw new Error("Contact insert returned no identifier");
      return String(rows[0].id);
    },
    async markNotification(id, status) {
      const sql = query();
      await sql`UPDATE contact_requests SET notification_status = ${status} WHERE id = ${id}::uuid`;
    },
  };
}
