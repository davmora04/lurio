import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("mx-auto box-content max-w-content px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  // Amethyst passes contrast only on light grounds; Orchid carries the accent on Ink.
  return <p className={cx("eyebrow", tone === "light" ? "text-amethyst" : "text-orchid", className)}>{children}</p>;
}

type ButtonVariant = "primary" | "outline" | "light" | "outline-light";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-amethyst",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  light: "bg-white text-ink hover:bg-parchment",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white hover:text-ink",
};

export const buttonBase =
  "inline-flex min-h-12 items-center justify-center rounded-pill px-6 py-3 text-center text-[0.9375rem] font-medium leading-tight transition-colors duration-200 ease-calm max-[22rem]:px-4 max-[22rem]:text-sm";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <a href={href} className={cx(buttonBase, buttonStyles[variant], className)}>
      {children}
    </a>
  );
}

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cx(buttonBase, buttonStyles[variant], className);
}
