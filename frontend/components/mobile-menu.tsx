"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { cx } from "@/lib/cx";
import { LocaleSwitcher } from "./locale-switcher";
import { buttonClass } from "./ui";

type NavLink = { label: string; href: string };

// Matches the `nav` breakpoint in app/globals.css (72rem).
const DESKTOP_QUERY = "(min-width: 72rem)";

export function MobileMenu({
  links,
  cta,
  labels,
  lang,
}: {
  links: NavLink[];
  cta: NavLink;
  labels: { menu: string; nav: string; language: string };
  lang: Locale;
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    // Restore scrolling synchronously so an anchor's default navigation can scroll.
    document.documentElement.style.overflow = "";
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      // Keep focus inside the toggle + panel while the menu covers the page.
      const focusables = [
        toggleRef.current,
        ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
      ].filter((el): el is HTMLElement => el !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = () => desktop.matches && close(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  return (
    <div className="nav:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => (open ? close(false) : setOpen(true))}
        className="-mr-2 inline-flex min-h-11 items-center gap-3 rounded-pill px-3 text-sm font-medium text-ink"
      >
        {/* The label stays constant; aria-expanded announces the state. */}
        <span>{labels.menu}</span>
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span
            className={cx(
              "absolute left-0 block h-px w-5 bg-ink transition-transform duration-200",
              open ? "top-1.5 rotate-45" : "top-0.5",
            )}
          />
          <span
            className={cx(
              "absolute left-0 block h-px w-5 bg-ink transition-transform duration-200",
              open ? "top-1.5 -rotate-45" : "top-2.5",
            )}
          />
        </span>
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-parchment"
      >
        <div className="flex min-h-full flex-col justify-between px-5 pb-10 pt-6 sm:px-8">
          <nav aria-label={labels.nav}>
            <ul>
              {links.map((link) => (
                <li key={link.href} className="border-b border-ink/10">
                  <a
                    href={link.href}
                    onClick={() => close(false)}
                    className="block py-4 font-display text-[1.75rem] leading-tight text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10">
            <LocaleSwitcher current={lang} label={labels.language} size="lg" />
            <a href={cta.href} onClick={() => close(false)} className={buttonClass("primary", "mt-4 w-full")}>
              {cta.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
