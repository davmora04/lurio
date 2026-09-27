import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { Container, Eyebrow, buttonClass } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import { localeMeta, locales } from "@/lib/i18n";
import "./globals.css";

// URLs outside /en and /es never reach a language layout, so this page is bilingual.
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: `${getDictionary("en").notFound.metaTitle} · ${getDictionary("es").notFound.metaTitle}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="min-h-dvh bg-parchment">
        <main className="flex min-h-dvh flex-col">
          <Container className="w-full py-8">
            <Link href="/" aria-label="Lurio" className="-m-2 inline-block p-2">
              <Wordmark className="w-[8.5rem]" />
            </Link>
          </Container>
          <Container className="grid w-full flex-1 content-center gap-16 pb-24 md:grid-cols-2">
            {locales.map((locale, index) => {
              const t = getDictionary(locale).notFound;
              const Heading = index === 0 ? "h1" : "h2";
              return (
                <section key={locale} lang={localeMeta[locale].htmlLang}>
                  <Eyebrow>404 · {localeMeta[locale].label}</Eyebrow>
                  <Heading className="mt-5 text-display-2">{t.title}</Heading>
                  <p className="mt-5 max-w-md text-charcoal">{t.body}</p>
                  <Link href={`/${locale}`} className={buttonClass("primary", "mt-8")}>
                    {t.back}
                  </Link>
                </section>
              );
            })}
          </Container>
        </main>
      </body>
    </html>
  );
}
