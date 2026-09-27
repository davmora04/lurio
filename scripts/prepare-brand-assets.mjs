// Copies and derives the web assets used by the landing page from the
// approved brand packages in "02. MARCA". Originals are never modified.
//
// Why some assets are derived instead of copied verbatim:
// - The supplied web images (hero-architecture*, abstract-curves*) are crops of
//   brand boards that contain unapproved copy baked into the pixels
//   ("New markets. A brighter tomorrow.", "A more connected world ahead.", …).
//   We extract only the clean photographic / graphic regions.
// - The OG image shows clipped letters from the next board panel on its right
//   edge; we trim that strip and restore 1200×630.
// - Every logo lockup includes the tagline, which becomes illegible at header
//   size, so the header uses the wordmark region of the same artwork.
//
// Run with: npm run assets
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const handoff = path.join(root, "02. MARCA", "Lurio_Web_Developer_Handoff_v1.0");
const out = (...p) => path.join(root, "frontend", ...p);

const crops = [
  {
    // Wordmark only (no tagline) for the header — region of the approved artwork.
    src: path.join(handoff, "01_Logos", "Lurio_Wordmark_Primary.png"),
    region: { left: 121, top: 116, width: 694, height: 129 },
    dest: out("public", "brand", "lurio-wordmark-primary.png"),
    format: "png",
  },
  {
    // Full lockup with tagline for the dark footer. Its background is exactly
    // Midnight Ink (#0B1224), so it sits seamlessly on the footer.
    src: path.join(handoff, "01_Logos", "Lurio_Wordmark_Reversed.png"),
    region: { left: 105, top: 104, width: 722, height: 212 },
    dest: out("public", "brand", "lurio-lockup-reversed.png"),
    format: "png",
  },
  {
    // Architectural passage from the hero board, without the embedded copy.
    src: path.join(handoff, "02_Web_Images", "hero-architecture-source.jpg"),
    region: { left: 455, top: 0, width: 645, height: 650 },
    dest: out("public", "images", "hero-architecture-passage.jpg"),
    format: "jpeg",
  },
  {
    // "Aperture" panel from the graphic-language board, text-free region.
    src: path.join(handoff, "02_Web_Images", "abstract-curves-source.jpg"),
    region: { left: 306, top: 66, width: 282, height: 252 },
    dest: out("public", "images", "abstract-curves-aperture.jpg"),
    format: "jpeg",
  },
  {
    // Ink / parchment arc panel from the graphic-language board, text-free region.
    src: path.join(handoff, "02_Web_Images", "abstract-curves-source.jpg"),
    region: { left: 919, top: 66, width: 229, height: 226 },
    dest: out("public", "images", "abstract-curves-arc.jpg"),
    format: "jpeg",
  },
  {
    // Social preview without the clipped letters on the right edge.
    src: path.join(handoff, "02_Web_Images", "lurio-og-1200x630.jpg"),
    region: { left: 0, top: 21, width: 1118, height: 587 },
    resize: { width: 1200, height: 630 },
    dest: out("public", "images", "lurio-og-1200x630-web.jpg"),
    format: "jpeg",
  },
];

const copies = [
  ["03_Favicons/favicon.ico", "public/favicon.ico"],
  ["03_Favicons/favicon-16x16.png", "public/icons/favicon-16x16.png"],
  ["03_Favicons/favicon-32x32.png", "public/icons/favicon-32x32.png"],
  ["03_Favicons/favicon-48x48.png", "public/icons/favicon-48x48.png"],
  ["03_Favicons/apple-touch-icon.png", "public/icons/apple-touch-icon.png"],
  ["03_Favicons/android-chrome-192x192.png", "public/icons/android-chrome-192x192.png"],
  ["03_Favicons/android-chrome-512x512.png", "public/icons/android-chrome-512x512.png"],
];

for (const crop of crops) {
  await mkdir(path.dirname(crop.dest), { recursive: true });
  let img = sharp(crop.src).extract(crop.region);
  if (crop.resize) img = img.resize({ ...crop.resize, fit: "fill", kernel: "lanczos3" });
  img = crop.format === "png" ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 92, mozjpeg: true });
  await img.toFile(crop.dest);
  console.log("derived", path.relative(root, crop.dest));
}

for (const [from, to] of copies) {
  await mkdir(path.dirname(out(to)), { recursive: true });
  await copyFile(path.join(handoff, from), out(to));
  console.log("copied ", to);
}
