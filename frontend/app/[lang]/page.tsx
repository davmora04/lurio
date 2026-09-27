import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { insightsFor } from "@/content/insights";
import { anchors } from "@/content/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, type NavLink } from "@/components/site-header";
import { About } from "@/components/sections/about";
import { Assessment } from "@/components/sections/assessment";
import { Contact } from "@/components/sections/contact";

import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Insights } from "@/components/sections/insights";
import { Journey } from "@/components/sections/journey";

import { Problem } from "@/components/sections/problem";
import { WhyLurio } from "@/components/sections/why-lurio";
import { isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const posts = insightsFor(lang);

  // Insights joins the navigation only when there is published content to link to.
  const links: NavLink[] = [
    { label: t.nav.approach, href: anchors.approach },
    { label: t.nav.howWeHelp, href: anchors.howWeHelp },
    { label: t.nav.whyLurio, href: anchors.whyLurio },
    ...(posts.length > 0 ? [{ label: t.nav.insights, href: anchors.insights }] : []),
    { label: t.nav.about, href: anchors.about },
    { label: t.nav.contact, href: anchors.contact },
  ];

  return (
    <>
      <div id="top" />
      <a
        href={anchors.main}
        className="sr-only z-50 bg-white px-4 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.common.skipToContent}
      </a>
      <SiteHeader lang={lang} links={links} t={t} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero t={t} />
        <Problem t={t.problem} />
        <Assessment t={t.assessment} cta={t.ctas.assess} />
        <Journey t={t.journey} />
        <WhyLurio t={t.whyLurio} ecosystem={t.ecosystem} />
        <About t={t.about} />
        <Insights lang={lang} t={t.insights} posts={posts} />
        <Faq t={t.faq} />
        <Contact lang={lang} t={t} />
      </main>
      <SiteFooter lang={lang} links={links} t={t} />
    </>
  );
}

