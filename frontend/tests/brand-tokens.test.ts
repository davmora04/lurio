import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { brandColors } from "@/lib/brand";

const root = path.resolve(import.meta.dirname, "../..");
const handoffTokens = JSON.parse(
  readFileSync(
    path.join(root, "02. MARCA", "Lurio_Web_Developer_Handoff_v1.0", "04_Design_System", "brand-tokens.json"),
    "utf8",
  ),
).brand.colors as Record<string, string>;
const css = readFileSync(path.join(root, "frontend", "app", "globals.css"), "utf8");

const cssNames: Record<keyof typeof brandColors, string> = {
  midnightInk: "ink",
  charcoal: "charcoal",
  amethystViolet: "amethyst",
  orchidGrey: "orchid",
  parchment: "parchment",
  roseBeige: "rose",
  white: "white",
};

describe("brand tokens", () => {
  it("lib/brand.ts matches the handoff brand-tokens.json", () => {
    expect(brandColors).toEqual(handoffTokens);
  });

  it("the Tailwind @theme colors match the handoff tokens", () => {
    for (const [key, cssName] of Object.entries(cssNames)) {
      const match = css.match(new RegExp(`--color-${cssName}:\\s*(#[0-9a-f]{6})`, "i"));
      expect(match?.[1].toUpperCase(), cssName).toBe(handoffTokens[key].toUpperCase());
    }
  });
});
