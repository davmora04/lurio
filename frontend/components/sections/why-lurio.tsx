import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { media } from "@/content/site";
import { Container, Eyebrow } from "../ui";

export function WhyLurio({ t, ecosystem }: { t: Dictionary["whyLurio"]; ecosystem: Dictionary["ecosystem"] }) {
  return (
    <section id="why-lurio" aria-labelledby="why-lurio-title" className="on-dark bg-ink py-12 text-white md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
            <h2 id="why-lurio-title" className="mt-4 text-display-2">{ecosystem.title}</h2>
            <p className="mt-5 text-parchment/85">{ecosystem.body}</p>
            <div className="mt-7 flex items-center gap-6 border-t border-white/15 pt-6">
              <Image src={media.aperture.src} alt="" width={112} height={100} sizes="112px" className="hidden rounded-tr-[45%] sm:block" />
              <p className="text-sm leading-relaxed text-parchment/85">{t.idealClient.body}</p>
            </div>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:gap-x-8 lg:self-center">
            {t.reasons.map((r, i) => <li key={r.title} className="border-t border-white/20 pt-4"><span className="text-xs tabular-nums tracking-widest text-orchid">0{i + 1}</span><h3 className="mt-3 font-display text-2xl leading-snug">{r.title}</h3><p className="mt-3 text-sm leading-relaxed text-parchment/85">{r.body}</p></li>)}
          </ol>
        </div>
      </Container>
    </section>
  );
}
