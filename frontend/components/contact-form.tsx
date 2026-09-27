"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { submitContact } from "@/app/actions";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import {
  FIELD_LIMITS,
  INTERESTS,
  LIMITS,
  hasErrors,
  normalizeContact,
  validateContact,
  type ErrorCode,
  type FieldErrors,
  type FieldName,
  type Interest,
} from "@backend/contracts/schema";
import { initialContactState } from "@backend/contracts/state";
import { cx } from "@/lib/cx";
import type { Locale } from "@/lib/i18n";
import { buttonClass } from "./ui";

type FormText = Dictionary["form"];

const FIELD_ORDER: FieldName[] = ["name", "email", "company", "interest", "message"];

/** Translates an error code for a field, filling in {min} / {max}. */
function errorMessage(t: FormText, field: FieldName, code: ErrorCode | undefined): string | undefined {
  if (!code) return undefined;
  const messages = t.errors[field as keyof FormText["errors"]] as Partial<Record<ErrorCode, string>> | undefined;
  const template = messages?.[code] ?? messages?.required ?? code;
  const limits = FIELD_LIMITS[field];
  return template.replace("{min}", String(limits.min ?? "")).replace("{max}", String(limits.max ?? ""));
}

// The "Assess your entry options" CTA links to #assessment-inquiry; the general CTAs
// link to #contact. The last of those hashes decides the pre-selected interest.
let hashInterest: Interest | null = null;

function interestFromHash(): Interest | null {
  const hash = window.location.hash;
  if (hash === "#assessment-inquiry") return "assessment";
  if (hash === "#contact") return "expansion";
  return null;
}

function subscribeToHash(onChange: () => void) {
  const handler = () => {
    const next = interestFromHash();
    if (next && next !== hashInterest) {
      hashInterest = next;
      onChange();
    }
  };
  window.addEventListener("hashchange", handler);
  return () => window.removeEventListener("hashchange", handler);
}

function getHashInterest(): Interest {
  hashInterest ??= interestFromHash() ?? "expansion";
  return hashInterest;
}

export function ContactForm({ lang, t }: { lang: Locale; t: FormText }) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [dismissedSuccess, setDismissedSuccess] = useState<typeof state | null>(null);
  const preselected = useSyncExternalStore(subscribeToHash, getHashInterest, () => "expansion" as Interest);

  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const values = state.status === "invalid" || state.status === "error" ? state.values : undefined;
  const errorCodes: FieldErrors = hasErrors(clientErrors)
    ? clientErrors
    : state.status === "invalid"
      ? state.errors
      : {};
  const errors = Object.fromEntries(
    FIELD_ORDER.map((field) => [field, errorMessage(t, field, errorCodes[field])]),
  ) as Partial<Record<FieldName, string>>;
  const showSuccess = state.status === "success" && dismissedSuccess !== state;

  // Start the fill timer once the form is interactive, and again after each result.
  useEffect(() => {
    startedAt.current = Date.now();
  }, [state, showSuccess]);

  // Move focus to the outcome so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (state.status === "invalid") focusFirstInvalid(formRef.current, state.errors);
    else if (state.status === "success") successRef.current?.focus();
    else if (state.status === "error" || state.status === "duplicate") statusRef.current?.focus();
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const found = validateContact(normalizeContact(data));
    setClientErrors(found);
    if (hasErrors(found)) {
      event.preventDefault();
      focusFirstInvalid(event.currentTarget, found);
      return;
    }
    // Written at submit time: React builds the action's FormData after onSubmit runs,
    // and re-renders would otherwise reset a React-managed hidden value.
    if (startedAtRef.current && startedAt.current) startedAtRef.current.value = String(startedAt.current);
  }

  if (showSuccess) {
    return (
      <div className="on-light bg-white p-7 text-ink sm:p-10" role="status">
        <h3 ref={successRef} tabIndex={-1} className="text-display-3 outline-none">
          {t.success.title}
        </h3>
        <p className="mt-4 text-charcoal">{t.success.body}</p>
        <button type="button" onClick={() => setDismissedSuccess(state)} className={buttonClass("outline", "mt-8")}>
          {t.success.again}
        </button>
      </div>
    );
  }

  const statusMessage =
    state.status === "error" ? t.status[state.reason] : state.status === "duplicate" ? t.status.duplicate : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-title"
      className="on-light relative bg-white p-6 text-ink sm:p-10"
    >
      <p className="text-sm text-charcoal">{t.requiredNote}</p>
      <input type="hidden" name="locale" value={lang} />

      <div
        ref={statusRef}
        tabIndex={-1}
        role={state.status === "error" ? "alert" : "status"}
        className={cx(
          "outline-none",
          statusMessage && "mt-5 border-l-2 bg-parchment px-4 py-3 text-sm",
          statusMessage && (state.status === "error" ? "border-error text-error" : "border-amethyst text-ink"),
        )}
      >
        {statusMessage}
      </div>

      <div className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Field name="name" label={t.labels.name} error={errors.name} errorPrefix={t.errorPrefix}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            defaultValue={values?.name}
            {...fieldA11y("name", errors.name)}
            className={inputClass(errors.name)}
          />
        </Field>

        <Field name="email" label={t.labels.email} error={errors.email} errorPrefix={t.errorPrefix}>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            required
            defaultValue={values?.email}
            {...fieldA11y("email", errors.email)}
            className={inputClass(errors.email)}
          />
        </Field>

        <Field name="company" label={t.labels.company} error={errors.company} errorPrefix={t.errorPrefix}>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            required
            defaultValue={values?.company}
            {...fieldA11y("company", errors.company)}
            className={inputClass(errors.company)}
          />
        </Field>

        <Field name="interest" label={t.labels.interest} error={errors.interest} errorPrefix={t.errorPrefix}>
          <select
            key={preselected}
            id="contact-interest"
            name="interest"
            required
            defaultValue={values?.interest ?? preselected}
            {...fieldA11y("interest", errors.interest)}
            className={cx(inputClass(errors.interest), "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230B1224' stroke-width='1.5'/%3E%3C/svg%3E\")",
            }}
          >
            {(Object.keys(INTERESTS) as Interest[]).map((value) => (
              <option key={value} value={value}>
                {t.interests[value]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          name="message"
          label={t.labels.message}
          error={errors.message}
          errorPrefix={t.errorPrefix}
          className="sm:col-span-2"
        >
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            minLength={LIMITS.messageMin}
            maxLength={LIMITS.messageMax}
            required
            defaultValue={values?.message}
            placeholder={t.messagePlaceholder}
            {...fieldA11y("message", errors.message)}
            className={cx(inputClass(errors.message), "min-h-36 resize-y")}
          />
        </Field>
      </div>

      {/* Abuse protection: a field people never see, and the time taken to fill the form. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto size-px overflow-hidden">
        <label htmlFor="contact-website">{t.honeypotLabel}</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" />

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={pending} className={buttonClass("primary", "disabled:cursor-wait disabled:opacity-70")}>
          {pending ? t.sending : t.submit}
        </button>
        {site.privacyPolicyPath && (
          <p className="text-sm text-charcoal">
            {t.privacy.before}
            <a href={`/${lang}${site.privacyPolicyPath}`} className="underline underline-offset-4">
              {t.privacy.link}
            </a>
            {t.privacy.after}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  error,
  errorPrefix,
  className,
  children,
}: {
  name: FieldName;
  label: string;
  error?: string;
  errorPrefix: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`contact-${name}`} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`contact-${name}-error`} className="mt-2 text-sm text-error">
          <span className="sr-only">{errorPrefix}</span>
          {error}
        </p>
      )}
    </div>
  );
}

function fieldA11y(name: FieldName, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `contact-${name}-error` : undefined,
  } as const;
}

function inputClass(error?: string) {
  return cx(
    "block w-full rounded-card border bg-white px-4 py-3 text-base text-ink transition-colors duration-200 placeholder:text-charcoal/70 hover:border-ink/50 focus:border-amethyst",
    error ? "border-error" : "border-ink/25",
  );
}

function focusFirstInvalid(form: HTMLFormElement | null, errors: FieldErrors) {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) form?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
}
