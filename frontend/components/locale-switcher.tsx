"use client";

import type { MouseEvent } from "react";
import { LOCALE_COOKIE, localeMeta, locales, type Locale } from "@/lib/i18n";
import { cx } from "@/lib/cx";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remembers the choice for "/" and keeps the current section in the other language. */
function selectLocale(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  const link = event.currentTarget;
  link.href = `/${locale}${window.location.hash}`;
}

/** EN / ES links. Remembers the choice for "/" and keeps the current section. */
export function LocaleSwitcher({
  current,
  label,
  className,
  size = "sm",
  tone = "light",
}: {
  current: Locale;
  label: string;
  className?: string;
  size?: "sm" | "lg";
  tone?: "light" | "dark";
}) {
  return (
    <nav aria-label={label} className={className}>
      <ul className={cx("flex items-center", size === "lg" ? "gap-5 text-base" : "gap-3 text-sm")}>
        {locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <a
                href={`/${locale}`}
                hrefLang={localeMeta[locale].htmlLang}
                lang={localeMeta[locale].htmlLang}
                aria-label={localeMeta[locale].label}
                aria-current={active ? "true" : undefined}
                onClick={(event) => selectLocale(event, locale)}
                className={cx(
                  "inline-flex min-h-11 items-center font-semibold uppercase tracking-[0.14em] underline-offset-[6px] transition-colors duration-200",
                  tone === "light"
                    ? active
                      ? "text-ink underline decoration-amethyst decoration-2"
                      : "text-charcoal hover:text-ink"
                    : active
                      ? "text-white underline decoration-orchid decoration-2"
                      : "text-parchment/75 hover:text-white",
                )}
              >
                {locale}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
