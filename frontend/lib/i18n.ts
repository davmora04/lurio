// Supported locales and locale negotiation. Framework-free and safe to import anywhere.

import { defaultLocale, isLocale, type Locale } from "@backend/contracts/locale";
export { locales, defaultLocale, isLocale, type Locale } from "@backend/contracts/locale";

/** Cookie set by the language switcher so "/" remembers an explicit choice. */
export const LOCALE_COOKIE = "lurio-locale";

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  en: { label: "English", htmlLang: "en", ogLocale: "en_US" },
  es: { label: "Español", htmlLang: "es", ogLocale: "es_CO" },
};

/**
 * Picks the best supported locale from an Accept-Language header, honouring q-values
 * and matching by primary language ("es-CO" → "es").
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.lang && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  return ranked.map((entry) => entry.lang).find(isLocale) ?? null;
}

/** Explicit choice (cookie) wins, then the browser's languages, then the default. */
export function negotiateLocale(cookieValue: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  return matchAcceptLanguage(acceptLanguage) ?? defaultLocale;
}

/** Returns the locale prefix of a pathname, if any ("/es/foo" → "es"). */
export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}
