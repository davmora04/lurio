import localFont from "next/font/local";

// Checked-in Latin variable fonts cover the site's English and Spanish content.
export const playfair = localFont({
  src: "../fonts/playfair-display-latin.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});
