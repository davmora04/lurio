import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { Container, Eyebrow } from "../ui";

export function About({ t: about }: { t: Dictionary["about"] }) {
  const [control, pieces] = about.promise;
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-ink/10 bg-white py-12 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 id="about-title" className="mt-5 text-display-2">
              {about.title}
            </h2>
          </div>
          <div className="reveal space-y-4 text-base text-charcoal lg:col-span-6 lg:col-start-7 lg:pt-6">
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
          {about.founders.map((founder, index) => (
            <article
              key={founder.email}
              aria-labelledby={`founder-${index}`}
              className="grid min-w-0 gap-6 border-t-2 border-amethyst bg-parchment p-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:p-8 md:grid-cols-1 xl:grid-cols-[10rem_minmax(0,1fr)]"
            >
              <Image
                src={founder.portrait.src}
                width={founder.portrait.width}
                height={founder.portrait.height}
                alt={founder.name}
                sizes="(min-width: 1280px) 160px, (min-width: 768px) 160px, (min-width: 640px) 128px, 160px"
                className="aspect-square w-40 rounded-tr-[2rem] object-cover object-top sm:w-32 md:w-40"
              />
              <div className="flex min-w-0 flex-col">
                <p className="eyebrow text-amethyst">{founder.role}</p>
                <h3 id={`founder-${index}`} className="mt-3 font-display text-3xl leading-tight text-ink">
                  {founder.name}
                </h3>
                <p className="mt-4 max-w-xl leading-relaxed text-charcoal">{founder.bio}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-1 pt-5 text-sm">
                  <a
                    href={`mailto:${founder.email}`}
                    className="inline-flex min-h-11 min-w-0 items-center break-all font-medium text-ink underline decoration-amethyst/40 underline-offset-4 hover:text-amethyst"
                  >
                    {founder.email}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <blockquote className="reveal mt-8 border-l-2 border-amethyst pl-6">
          <p className="max-w-5xl font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.08] tracking-tight">
            {control} <span className="text-amethyst">{pieces}</span>
          </p>
          <footer className="eyebrow mt-4 text-charcoal">{about.promiseLabel}</footer>
        </blockquote>
      </Container>
    </section>
  );
}
