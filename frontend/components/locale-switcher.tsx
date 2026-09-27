"use client";

import Link from "next/link";
import { LOCALE_COOKIE, localeMeta, locales, type Locale } from "@/lib/i18n";
import { cx } from "@/lib/cx";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remembers the choice for future visits to "/". */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/** Client navigation preserves the viewport without replaying an old anchor. */
export function LocaleSwitcher({
  current,
  label,
  className,
  size = "sm",
  tone = "light",
  onLocaleChange,
}: {
  current: Locale;
  label: string;
  className?: string;
  size?: "sm" | "lg";
  tone?: "light" | "dark";
  onLocaleChange?: () => void;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ul className={cx("flex items-center", size === "lg" ? "gap-5 text-base" : "gap-3 text-sm")}>
        {locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <Link
                href={`/${locale}`}
                scroll={false}
                hrefLang={localeMeta[locale].htmlLang}
                lang={localeMeta[locale].htmlLang}
                aria-label={localeMeta[locale].label}
                aria-current={active ? "true" : undefined}
                onNavigate={(event) => {
                  if (active) {
                    event.preventDefault();
                    return;
                  }
                  rememberLocale(locale);
                  onLocaleChange?.();
                }}
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
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
