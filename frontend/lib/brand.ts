// Official Lurio colors for places CSS cannot reach (manifest, viewport, metadata).
// Mirrors brand-tokens.json from the Web Developer Handoff and the @theme block in
// app/globals.css; tests/brand-tokens.test.ts fails if they drift apart.
export const brandColors = {
  midnightInk: "#0B1224",
  charcoal: "#2A3346",
  amethystViolet: "#5B3F8C",
  orchidGrey: "#A89DB1",
  parchment: "#F4EDE6",
  roseBeige: "#C9A292",
  white: "#FFFFFF",
} as const;
