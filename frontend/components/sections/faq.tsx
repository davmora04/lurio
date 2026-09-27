import type { Dictionary } from "@/content/dictionaries";
import { Container, Eyebrow } from "../ui";

export function Faq({ t: faq }: { t: Dictionary["faq"] }) {
  return (
    <section aria-labelledby="faq-title" className="bg-parchment py-12 md:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-4">
            <Eyebrow>{faq.eyebrow}</Eyebrow>
            <h2 id="faq-title" className="mt-5 text-display-2">
              {faq.title}
            </h2>
          </div>
          <div className="lg:col-span-8">
            {faq.items.map((item) => (
              <details key={item.question} className="reveal group border-b border-ink/15 first:border-t">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-snug [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="relative mt-2 size-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-ink after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:bg-ink after:transition-transform after:duration-200 group-open:after:scale-y-0"
                  />
                </summary>
                <p className="max-w-2xl pb-7 text-charcoal">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
