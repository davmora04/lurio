import type { Dictionary } from "@/content/dictionaries";
import { anchors } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { LocaleSwitcher } from "./locale-switcher";
import { Wordmark } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { Container, buttonClass } from "./ui";

export type NavLink = { label: string; href: string };

export function SiteHeader({ lang, links, t }: { lang: Locale; links: NavLink[]; t: Dictionary }) {
  const cta = { label: t.ctas.nav, href: anchors.contact };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur-md">
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        {/* Clear space around the wordmark is at least its cap height (Brand Book p.15). */}
        <a href={anchors.top} className="-m-2 shrink-0 p-2" aria-label={t.common.backToTop}>
          <Wordmark className="w-[7.75rem] nav:w-[8.5rem]" />
        </a>

        <div className="hidden items-center gap-7 nav:flex xl:gap-9">
          <nav aria-label={t.common.primaryNav}>
            <ul className="flex items-center gap-7 xl:gap-9">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="whitespace-nowrap text-sm font-medium text-charcoal underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:decoration-amethyst"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleSwitcher current={lang} label={t.common.language} />
          <a href={cta.href} className={buttonClass("primary", "min-h-11 whitespace-nowrap px-5 text-sm")}>
            {cta.label}
          </a>
        </div>

        <MobileMenu
          links={links}
          cta={cta}
          labels={{ menu: t.common.menu, nav: t.common.mobileNav, language: t.common.language }}
          lang={lang}
        />
      </Container>
    </header>
  );
}
