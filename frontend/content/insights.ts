// Published Insights, per language. The section and its nav link stay hidden while a
// language has no entries — do not add placeholder articles. Suggested launch topics
// (WEBSITE_COPY.md):
// 1. Do you actually need a Colombian entity to sell into Colombia?
// 2. What U.S. B2B companies often underestimate when entering Colombia
// 3. Distributor vs. direct contracting vs. local entity: how to frame the decision
// 4. Why market-entry projects stall between legal advice and operational launch

import type { Locale } from "@/lib/i18n";

export type Insight = {
  slug: string;
  locale: Locale;
  category: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-10-15". */
  publishedAt: string;
  /** Absolute URL or site path where the full article lives. */
  href: string;
};

export const insights: Insight[] = [];

export function insightsFor(locale: Locale): Insight[] {
  return insights.filter((item) => item.locale === locale);
}
