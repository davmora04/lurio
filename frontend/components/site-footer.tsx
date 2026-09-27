import type { Dictionary } from "@/content/dictionaries";
import { anchors, site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { LocaleSwitcher } from "./locale-switcher";
import { LockupReversed } from "./logo";
import type { NavLink } from "./site-header";
import { Container } from "./ui";

const linkClass = "text-parchment/90 underline-offset-4 hover:text-white hover:underline";

export function SiteFooter({ lang, links, t }: { lang: Locale; links: NavLink[]; t: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t border-white/10 bg-ink text-white">
      <Container className="py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href={anchors.top} aria-label={t.common.backToTop} className="-m-2 inline-block p-2">
              <LockupReversed className="w-[13.5rem] md:w-[15rem]" />
            </a>
            <p className="mt-6 text-sm text-parchment/80">{t.footer.descriptor}</p>
          </div>

          <nav aria-label={t.common.footerNav} className="md:col-span-3 md:col-start-7">
            <p className="eyebrow text-orchid">{t.footer.explore}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow text-orchid">{t.footer.conversation}</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={anchors.contact} className={linkClass}>
                  {t.ctas.discuss}
                </a>
              </li>
              <li>
                <a href={anchors.assessmentInquiry} className={linkClass}>
                  {t.ctas.assess}
                </a>
              </li>
              {site.linkedInUrl && (
                <li>
                  <a href={site.linkedInUrl} rel="noopener" className={linkClass}>
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-parchment/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · {t.footer.tagline}
          </p>
          <div className="flex items-center gap-6">
            {site.privacyPolicyPath && (
              <a href={`/${lang}${site.privacyPolicyPath}`} className="underline-offset-4 hover:text-white hover:underline">
                {t.footer.privacy}
              </a>
            )}
            <LocaleSwitcher current={lang} label={t.common.language} tone="dark" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
