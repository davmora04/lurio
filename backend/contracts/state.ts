// Result of a contact submission, shared by the Server Action and the client form.
// Kept free of server-only imports so it can be bundled for the browser.
import type { ContactFields, FieldErrors } from "./schema";

export type ContactErrorReason = "unavailable" | "failed" | "rate_limited" | "too_fast";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; values: ContactFields }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "error"; reason: ContactErrorReason; values: ContactFields };

export const initialContactState: ContactState = { status: "idle" };
