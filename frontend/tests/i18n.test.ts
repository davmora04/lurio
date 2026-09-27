import { describe, expect, it } from "vitest";
import { en } from "@/content/dictionaries/en";
import { es } from "@/content/dictionaries/es";
import { localeFromPath, matchAcceptLanguage, negotiateLocale } from "@/lib/i18n";

/** Lists every leaf path of an object, with array lengths, so both languages can be compared. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([key, v]) => shape(v, path ? `${path}.${key}` : key));
  return [path];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("dictionaries", () => {
  it("Spanish has exactly the same keys and list lengths as English", () => {
    expect(shape(es)).toEqual(shape(en));
  });

  it("has no empty strings", () => {
    for (const dict of [en, es]) expect(strings(dict).filter((s) => s.trim() === "")).toEqual([]);
  });

  it("keeps the same {min}/{max} placeholders in error messages", () => {
    const placeholders = (s: string) => s.match(/\{(min|max)\}/g) ?? [];
    const enErrors = strings(en.form.errors).map(placeholders);
    const esErrors = strings(es.form.errors).map(placeholders);
    expect(esErrors).toEqual(enErrors);
  });

  it("does not translate the tagline", () => {
    expect(es.footer.tagline).toBe("Keep Expansion Moving");
  });
});

describe("locale negotiation", () => {
  it("matches Accept-Language by q-value and primary language", () => {
    expect(matchAcceptLanguage("es-CO,es;q=0.9,en;q=0.8")).toBe("es");
    expect(matchAcceptLanguage("en-US,en;q=0.9,es;q=0.8")).toBe("en");
    expect(matchAcceptLanguage("fr-FR,fr;q=0.9,es;q=0.5")).toBe("es");
    expect(matchAcceptLanguage("en;q=0.2, es;q=0.7")).toBe("es");
    expect(matchAcceptLanguage("fr,de")).toBeNull();
    expect(matchAcceptLanguage(null)).toBeNull();
  });

  it("prefers the explicit cookie, then the browser, then English", () => {
    expect(negotiateLocale("en", "es-CO")).toBe("en");
    expect(negotiateLocale("xx", "es-CO")).toBe("es");
    expect(negotiateLocale(undefined, "fr")).toBe("en");
  });

  it("reads the locale prefix from a path", () => {
    expect(localeFromPath("/es")).toBe("es");
    expect(localeFromPath("/en/insights")).toBe("en");
    expect(localeFromPath("/")).toBeNull();
    expect(localeFromPath("/esp")).toBeNull();
  });
});
