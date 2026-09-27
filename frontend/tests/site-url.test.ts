import { describe, expect, it } from "vitest";
import { getSiteUrl, isIndexingAllowed } from "@/lib/site-url";

describe("site URL and indexing", () => {
  it("ignores missing or invalid URLs", () => {
    expect(getSiteUrl({})).toBeNull();
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "lurio" })).toBeNull();
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://lurio.co" })?.origin).toBe("https://lurio.co");
  });

  it("only allows indexing when explicitly enabled on an https production URL", () => {
    const prod = { NEXT_PUBLIC_SITE_URL: "https://lurio.co", SITE_INDEXING: "true" };
    expect(isIndexingAllowed(prod)).toBe(true);
    expect(isIndexingAllowed({ ...prod, SITE_INDEXING: undefined })).toBe(false);
    expect(isIndexingAllowed({ ...prod, NEXT_PUBLIC_SITE_URL: "http://lurio.co" })).toBe(false);
    expect(isIndexingAllowed({ ...prod, VERCEL_ENV: "preview" })).toBe(false);
    expect(isIndexingAllowed({ ...prod, VERCEL_ENV: "production" })).toBe(true);
  });
});
