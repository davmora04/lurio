import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";

// One entry per language, each declaring its alternates (hreflang).
// Add /insights and /privacy here once they exist.
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];
  const url = (locale: string) => new URL(`/${locale}`, siteUrl).toString();
  const languages = Object.fromEntries(locales.map((locale) => [locale, url(locale)]));
  return locales.map((locale) => ({
    url: url(locale),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
