// Site-wide, language-independent facts. Only confirmed information belongs here — see
// 02. MARCA/Lurio_Web_Developer_Handoff_v1.0/05_Website_Copy/CONTENT_STATUS.md.
// Translatable text lives in content/dictionaries/.

export const site = {
  name: "Lurio",
  areaServed: "Colombia",
  ogImage: { url: "/images/lurio-og-1200x630-web.jpg", width: 1200, height: 630 },
  // Pending confirmation by the founders. Leave null until confirmed:
  // links and structured data only render when a value is present.
  linkedInUrl: null as string | null,
  /** Path of the privacy notice, without locale prefix (e.g. "/privacy"). */
  privacyPolicyPath: null as string | null,
};

/** In-page anchors shared by every language. */
export const anchors = {
  top: "#top",
  main: "#main",
  approach: "#approach",
  howWeHelp: "#how-we-help",
  whyLurio: "#why-lurio",
  assessment: "#assessment",
  about: "#about",
  insights: "#insights",
  contact: "#contact",
  // Same position as #contact; pre-selects the Market Entry Assessment interest.
  assessmentInquiry: "#assessment-inquiry",
} as const;

export const media = {
  hero: { src: "/images/hero-architecture-passage.jpg", width: 645, height: 650 },
  aperture: { src: "/images/abstract-curves-aperture.jpg", width: 282, height: 252 },
  arc: { src: "/images/abstract-curves-arc.jpg", width: 229, height: 226 },
} as const;
