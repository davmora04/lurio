import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { anchors, media } from "@/content/site";
import { ButtonLink, Container, Eyebrow } from "../ui";

export function Assessment({ t: assessment, cta }: { t: Dictionary["assessment"]; cta: string }) {
  return (
    <section id="assessment" aria-labelledby="assessment-title" className="bg-white py-12 md:py-20">
      <Container>
        <div className="on-dark reveal relative overflow-hidden bg-ink text-white">
          {/* Arc panel from the graphic-language board, anchored to the corner. */}
          <div className="pointer-events-none absolute right-0 top-0 hidden aspect-[229/226] w-[clamp(9rem,18vw,15rem)] overflow-hidden rounded-bl-[100%] md:block">
            <Image src={media.arc.src} alt="" fill quality={90} sizes="15rem" className="object-cover" />
          </div>

          <div className="relative grid gap-8 p-6 sm:p-10 md:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
            <div className="lg:col-span-7">
              <Eyebrow tone="dark">{assessment.eyebrow}</Eyebrow>
              <h2 id="assessment-title" className="mt-5 text-display-2 md:pr-40 lg:pr-0">
                {assessment.title}
              </h2>
              <p className="mt-6 max-w-[36rem] text-base leading-relaxed text-parchment/85">{assessment.body}</p>
              <ButtonLink href={anchors.assessmentInquiry} variant="light" className="mt-6">
                {cta}
              </ButtonLink>
            </div>

            <div className="lg:col-span-5 lg:self-end">
              <h3 className="eyebrow text-orchid">{assessment.coversLabel}</h3>
              <ul className="mt-5 grid grid-cols-1 gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {assessment.covers.map((item) => (
                  <li key={item} className="bg-ink py-4 pr-4 font-display text-lg leading-snug min-[26rem]:odd:pr-6 min-[26rem]:even:pl-6 lg:odd:pr-4 lg:even:pl-0 xl:odd:pr-6 xl:even:pl-6">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
