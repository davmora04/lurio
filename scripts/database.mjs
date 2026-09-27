import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

// Match Next's environment loading, including frontend/.env.local.
nextEnv.loadEnvConfig(fileURLToPath(new URL("../frontend/", import.meta.url)), true);
const command = process.argv[2];
if (!["migrate", "check"].includes(command)) {
  console.error("Use npm run db:migrate or npm run db:check.");
  process.exit(1);
}
if (!process.env.DATABASE_URL?.trim()) {
  console.error("Missing DATABASE_URL. Set it in frontend/.env.local or the process environment.");
  process.exit(1);
}

try {
  const sql = neon(process.env.DATABASE_URL.trim(), {
    fetchOptions: { signal: AbortSignal.timeout(20_000) },
  });
  if (command === "migrate") {
    const migration = await readFile(new URL("../backend/db/migrations/001_contact_requests.sql", import.meta.url), "utf8");
    await sql.query(migration);
    console.log("Contact table created (existing data preserved).");
  }
  await sql`SELECT id, name, email, company, interest, message, locale, created_at, status, notification_status
    FROM public.contact_requests LIMIT 0`;
  console.log("Database connection and contact schema verified. No contact data read or written by this check.");
} catch {
  // Driver errors can contain connection details; do not print them.
  console.error("Database operation failed. Check Neon credentials, connectivity and schema; run db:migrate before db:check.");
  process.exitCode = 1;
}
