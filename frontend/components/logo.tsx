import Image from "next/image";
import { cx } from "@/lib/cx";

// Approved LURIO artwork (full R), taken from the handoff's 01_Logos PNGs by
// scripts/prepare-brand-assets.mjs. Served unoptimized so the artwork is never
// re-compressed; never recolor these with CSS filters.

/** Wordmark without tagline, for the header (tagline is illegible at this size). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/lurio-wordmark-primary.png"
      alt="Lurio"
      width={694}
      height={129}
      unoptimized
      // Above the fold on every page: never lazy-load it.
      loading="eager"
      className={cx("h-auto", className)}
    />
  );
}

/** Reversed lockup with tagline, for Midnight Ink grounds (its background is #0B1224). */
export function LockupReversed({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/lurio-lockup-reversed.png"
      alt="Lurio — Keep Expansion Moving"
      width={722}
      height={212}
      unoptimized
      className={cx("h-auto", className)}
    />
  );
}
