import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { anchors, media } from "@/content/site";
import { ButtonLink, Container, Eyebrow } from "../ui";

export function Hero({ t }: { t: Dictionary }) {
  const { hero } = t;
  const index = hero.title.lastIndexOf(" ");
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden bg-white">
      <Container>
        <div className="grid items-center gap-8 py-10 md:gap-12 md:py-14 lg:grid-cols-[1.2fr_1fr] lg:py-16">
          <div>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 id="hero-title" className="mt-5 max-w-[12ch] text-display-1 text-ink">
              {hero.title.slice(0, index)} <span className="text-amethyst">{hero.title.slice(index + 1)}</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lede text-charcoal">{hero.body[0]}</p>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:items-start">
              <ButtonLink href={anchors.contact}>{t.ctas.discuss}</ButtonLink>
              <a href={anchors.assessment} className="inline-flex min-h-11 items-center justify-center gap-3 text-center text-sm font-semibold text-amethyst underline decoration-amethyst/30 underline-offset-4 hover:decoration-amethyst sm:justify-start">
                {t.ctas.assess}<span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[480px] lg:ml-auto lg:mr-0">
            <div className="relative aspect-[5/3] overflow-hidden rounded-tl-[35%] bg-parchment md:aspect-[1/1.05]">
              <Image src={media.hero.src} alt={hero.imageAlt} fill preload quality={90}
                sizes="(min-width: 768px) 480px, calc(100vw - 40px)" className="object-cover object-[50%_60%]" />
            </div>
            <p className="border-l-2 border-amethyst py-3 pl-4 text-sm leading-relaxed text-charcoal">{hero.body[1]}</p>
          </div>
        </div>
        <ol aria-label={hero.stagesLabel} className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-ink/15 py-6 text-sm font-medium text-charcoal md:grid-cols-4">
          {hero.stages.map((stage, i) => <li key={stage} className="flex items-baseline gap-3"><span className="text-xs tabular-nums text-amethyst">0{i + 1}</span>{stage}</li>)}
        </ol>
      </Container>
    </section>
  );
}
