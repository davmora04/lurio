import type { MetadataRoute } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { defaultLocale } from "@/lib/i18n";
import { brandColors } from "@/lib/brand";

// Adapted from 02. MARCA/Lurio_Web_Developer_Handoff_v1.0/03_Favicons/site.webmanifest
// (icon paths now point to /icons/).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: getDictionary(defaultLocale).meta.description,
    start_url: "/",
    icons: [
      { src: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: brandColors.midnightInk,
    background_color: brandColors.parchment,
    display: "standalone",
  };
}
