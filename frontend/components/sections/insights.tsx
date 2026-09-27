import type { Dictionary } from "@/content/dictionaries";
import type { Insight } from "@/content/insights";
import { localeMeta, type Locale } from "@/lib/i18n";
import { Container, Eyebrow } from "../ui";

/** Renders only when the language has published entries in content/insights.ts. */
export function Insights({ lang, t, posts }: { lang: Locale; t: Dictionary["insights"]; posts: Insight[] }) {
  if (posts.length === 0) return null;
  const dateFormat = new Intl.DateTimeFormat(localeMeta[lang].htmlLang, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section id="insights" aria-labelledby="insights-title" className="bg-white py-20 md:py-28">
      <Container>
        <div className="reveal max-w-4xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 id="insights-title" className="mt-5 text-display-2">
            {t.title}
          </h2>
        </div>
        <ul className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((item) => (
            <li key={item.slug} className="reveal bg-white">
              <a href={item.href} className="group flex h-full flex-col gap-4 p-7 hover:bg-parchment">
                <span className="eyebrow text-amethyst">{item.category}</span>
                <h3 className="font-display text-2xl leading-snug group-hover:underline group-hover:decoration-amethyst group-hover:decoration-1 group-hover:underline-offset-4">
                  {item.title}
                </h3>
                <p className="text-charcoal">{item.summary}</p>
                <time dateTime={item.publishedAt} className="mt-auto text-sm text-charcoal">
                  {dateFormat.format(new Date(item.publishedAt))}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
