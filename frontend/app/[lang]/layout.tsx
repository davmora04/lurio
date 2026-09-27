import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { brandColors } from "@/lib/brand";
import { isLocale, localeMeta, locales, type Locale } from "@/lib/i18n";
import { getSiteUrl, isIndexingAllowed } from "@/lib/site-url";
import "../globals.css";

// Self-hosted at build time by next/font (both families are SIL Open Font License).
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();
const indexable = isIndexingAllowed();

// Every language is prerendered; unsupported values are rejected below with notFound().
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    // Without a confirmed URL, Next.js falls back to the Vercel deployment URL (or localhost).
    metadataBase: siteUrl ?? undefined,
    title: meta.title,
    description: meta.description,
    applicationName: site.name,
    alternates: siteUrl
      ? {
          canonical: `/${lang}`,
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
            // "/" negotiates the visitor's language.
            "x-default": "/",
          },
        }
      : undefined,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: meta.socialTitle,
      description: meta.socialDescription,
      url: `/${lang}`,
      locale: localeMeta[lang].ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeMeta[l].ogLocale),
      images: [{ ...site.ogImage, alt: meta.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.socialTitle,
      description: meta.socialDescription,
      images: [site.ogImage.url],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: brandColors.midnightInk,
  colorScheme: "light",
};

function OrganizationJsonLd({ lang }: { lang: Locale }) {
  // Only facts confirmed in the brand documents; rendered once the domain is configured.
  if (!siteUrl) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: new URL(`/${lang}`, siteUrl).toString(),
    logo: new URL("/brand/lurio-wordmark-primary.png", siteUrl).toString(),
    description: getDictionary(lang).meta.description,
    areaServed: { "@type": "Country", name: site.areaServed },
    ...(site.linkedInUrl ? { sameAs: [site.linkedInUrl] } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={localeMeta[lang].htmlLang}
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-dvh bg-white">
        <OrganizationJsonLd lang={lang} />
        {children}
      </body>
    </html>
  );
}
