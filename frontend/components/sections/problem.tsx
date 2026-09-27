import type { Dictionary } from "@/content/dictionaries";
import { Container, Eyebrow } from "../ui";

export function Problem({ t }: { t: Dictionary["problem"] }) {
  return (
    <section id="approach" aria-labelledby="approach-title" className="bg-parchment py-12 md:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <div><Eyebrow>{t.eyebrow}</Eyebrow><h2 id="approach-title" className="mt-4 max-w-xl text-display-2">{t.title}</h2></div>
          <div className="space-y-4 text-charcoal lg:self-end">{t.body.map(p => <p key={p}>{p}</p>)}</div>
        </div>
        <div className="mt-8 flex flex-col gap-5 border-t border-ink/15 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <ul aria-label={t.disciplinesLabel} className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-charcoal">{t.disciplines.map(d => <li key={d}>{d}</li>)}</ul>
          <p className="font-display text-2xl text-amethyst">{t.resolution}</p>
        </div>
      </Container>
    </section>
  );
}
