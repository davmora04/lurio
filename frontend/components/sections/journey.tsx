import type { Dictionary } from "@/content/dictionaries";
import { Container, Eyebrow } from "../ui";

export function Journey({ t: journey }: { t: Dictionary["journey"] }) {
  return (
    <section id="how-we-help" aria-labelledby="how-we-help-title" className="bg-white py-12 md:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <Eyebrow>{journey.eyebrow}</Eyebrow>
            <h2 id="how-we-help-title" className="mt-5 text-display-2">
              {journey.title}
            </h2>
          </div>
          <p className="reveal text-base text-charcoal lg:col-span-4 lg:col-start-9 lg:self-end">{journey.intro}</p>
        </div>

        {/* Substantial numbered panels rather than a thin process line (COMPONENT_SPEC §5). */}
        <ol className="mt-8 grid gap-px bg-ink/12 md:grid-cols-2 xl:grid-cols-4">
          {journey.steps.map((step, index) => (
            <li
              key={step.stage}
              className="reveal group relative flex flex-col bg-parchment p-7 transition-colors duration-300 hover:bg-white sm:p-7 lg:p-6"
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="eyebrow text-amethyst">{step.stage}</span>
                <span
                  aria-hidden="true"
                  className="font-display text-4xl leading-none text-ink/15 transition-colors duration-300 group-hover:text-amethyst/40"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 max-w-[28rem] font-display text-2xl leading-tight">{step.offer}</h3>
              <p className="mt-3 max-w-[34rem] text-sm leading-relaxed text-charcoal">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="reveal mt-5 max-w-3xl border-l-2 border-amethyst pl-5 text-sm text-charcoal">{journey.boundary}</p>

        {/* Executive update structure from the Brand Book. */}
        <div className="reveal mt-10 grid gap-6 border-t border-ink/10 pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h3 className="text-display-3">{journey.reporting.title}</h3>
            <p className="mt-4 text-charcoal">{journey.reporting.body}</p>
          </div>
          <ol className="grid grid-cols-2 gap-px bg-ink/10 lg:col-span-8 xl:grid-cols-4">
            {journey.reporting.steps.map((step, index) => (
              <li key={step} className="flex min-h-24 flex-col justify-between gap-6 bg-white p-5">
                <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-amethyst">0{index + 1}</span>
                <span className="font-display text-xl leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
