import Link from "next/link";
import { lang } from "next/root-params";
import { Wordmark } from "@/components/logo";
import { Container, Eyebrow, buttonClass } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";

// Shown when notFound() is called inside a language (e.g. an unknown path under /es).
export default async function NotFound() {
  const current = await lang();
  const locale = isLocale(current) ? current : defaultLocale;
  const t = getDictionary(locale);

  return (
    <main className="flex min-h-dvh flex-col bg-parchment">
      <title>{t.notFound.metaTitle}</title>
      <Container className="w-full py-8">
        <Link href={`/${locale}`} aria-label={t.common.home} className="-m-2 inline-block p-2">
          <Wordmark className="w-[8.5rem]" />
        </Link>
      </Container>
      <Container className="flex w-full flex-1 flex-col justify-center pb-24">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-display-1">{t.notFound.title}</h1>
        <p className="mt-6 max-w-xl text-lede text-charcoal">{t.notFound.body}</p>
        <Link href={`/${locale}`} className={buttonClass("primary", "mt-10 self-start")}>
          {t.notFound.back}
        </Link>
      </Container>
    </main>
  );
}
