import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { ContactForm } from "../contact-form";
import { Container, Eyebrow } from "../ui";

export function Contact({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark relative bg-ink py-12 text-white md:py-20">
      {/* Target for "Assess your entry options": same position, pre-selects the assessment interest. */}
      <span id="assessment-inquiry" aria-hidden="true" className="absolute top-0" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <Eyebrow tone="dark">{t.contact.eyebrow}</Eyebrow>
            <h2 id="contact-title" className="mt-5 text-display-1 lg:text-display-2">
              {t.contact.title}
            </h2>
            <p className="mt-8 max-w-[28rem] text-lede text-parchment/85">{t.contact.body}</p>
          </div>
          <div className="lg:col-span-7">
            <ContactForm lang={lang} t={t.form} />
          </div>
        </div>
      </Container>
    </section>
  );
}
