import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexingAllowed } from "@/lib/site-url";

// Crawlers are only invited in on the confirmed production deployment
// (NEXT_PUBLIC_SITE_URL + SITE_INDEXING=true). Everything else is disallowed.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  if (!isIndexingAllowed() || !siteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
