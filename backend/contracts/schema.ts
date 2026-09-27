// Contact form fields, limits and validation. Shared by the client (instant feedback)
// and the server (authoritative check) — never trust the client result alone.
// Validation returns error codes; the UI translates them (content/dictionaries).

import { defaultLocale, isLocale, type Locale } from "./locale";

/** Internal labels used in the delivered inquiry (the team reads English). */
export const INTERESTS = {
  expansion: "Colombia expansion",
  assessment: "Market Entry Assessment",
} as const;

export type Interest = keyof typeof INTERESTS;

export const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  messageMin: 10,
  messageMax: 3000,
} as const;

export type ContactFields = {
  name: string;
  email: string;
  company: string;
  interest: Interest;
  message: string;
  /** Language the visitor used on the site. */
  locale: Locale;
};

export type FieldName = "name" | "email" | "company" | "interest" | "message";
export type ErrorCode = "required" | "invalid" | "tooShort" | "tooLong";
export type FieldErrors = Partial<Record<FieldName, ErrorCode>>;

// Pragmatic address check; the destination inbox is the real verification.
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
// Control characters except tab / newline / carriage return.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(CONTROL_CHARS, "") : "";
}

function singleLine(value: unknown): string {
  return text(value).replace(/\s+/g, " ").trim();
}

export function isInterest(value: unknown): value is Interest {
  return typeof value === "string" && Object.hasOwn(INTERESTS, value);
}

/** Normalizes untrusted input (FormData values or plain objects) into typed fields. */
export function normalizeContact(input: Record<string, unknown>): ContactFields {
  return {
    name: singleLine(input.name),
    email: singleLine(input.email).toLowerCase(),
    company: singleLine(input.company),
    interest: isInterest(input.interest) ? input.interest : "expansion",
    message: text(input.message).replace(/\r\n?/g, "\n").trim(),
    locale: isLocale(input.locale) ? input.locale : defaultLocale,
  };
}

export function validateContact(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.name) errors.name = "required";
  else if (fields.name.length > LIMITS.name) errors.name = "tooLong";

  if (!fields.email) errors.email = "required";
  else if (fields.email.length > LIMITS.email || !EMAIL_PATTERN.test(fields.email)) errors.email = "invalid";

  if (!fields.company) errors.company = "required";
  else if (fields.company.length > LIMITS.company) errors.company = "tooLong";

  if (!fields.message) errors.message = "required";
  else if (fields.message.length < LIMITS.messageMin) errors.message = "tooShort";
  else if (fields.message.length > LIMITS.messageMax) errors.message = "tooLong";

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Limits to interpolate into translated error messages ({min} / {max}). */
export const FIELD_LIMITS: Record<FieldName, { min?: number; max?: number }> = {
  name: { max: LIMITS.name },
  email: { max: LIMITS.email },
  company: { max: LIMITS.company },
  interest: {},
  message: { min: LIMITS.messageMin, max: LIMITS.messageMax },
};
