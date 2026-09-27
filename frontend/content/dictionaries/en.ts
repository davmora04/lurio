// English copy (primary brand voice). Source of truth:
// 02. MARCA/Lurio_Web_Developer_Handoff_v1.0/05_Website_Copy/WEBSITE_COPY.md
// Lines marked "deck" come from Lurio_Pitch_Deck_v2_Organized.pptx and lines marked
// "brand book" from Lurio_Brand_Book_v1.0.pdf; everything must respect CONTENT_STATUS.md
// (no client logos, testimonials, quantified claims or regulated-service claims).
// es.ts must keep exactly the same shape (enforced by the Dictionary type and a test).

export const en = {
  meta: {
    title: "Lurio | Colombia Market Entry & Expansion Advisory",
    description:
      "Lurio helps international companies enter and expand in Colombia by aligning strategy, local specialists and coordinated execution around one business objective.",
    socialTitle: "Lurio | Keep Expansion Moving",
    socialDescription: "Client-side market entry and expansion advisory for international companies entering Colombia.",
    ogImageAlt: "Lurio — Keep your expansion moving. Market Entry & Expansion Advisory · Colombia.",
  },

  common: {
    skipToContent: "Skip to content",
    backToTop: "Lurio — back to top",
    home: "Lurio — home",
    menu: "Menu",
    primaryNav: "Primary",
    mobileNav: "Mobile",
    footerNav: "Footer",
    language: "Language",
  },

  ctas: {
    discuss: "Discuss your Colombia expansion",
    assess: "Assess your entry options",
    explore: "Explore how Lurio works",
    nav: "Discuss your expansion",
  },

  nav: {
    approach: "Approach",
    howWeHelp: "How We Help",
    whyLurio: "Why Lurio",
    about: "Who we are",
    contact: "Contact",
    insights: "Insights",
  },

  hero: {
    // Non-breaking space keeps "·" at the end of the line if the eyebrow wraps.
    eyebrow: "Market Entry & Expansion Advisory · Colombia",
    title: "Keep your expansion moving.",
    body: [
      "We help international companies enter and operate in Colombia — aligning strategy, local specialists and execution.",
      "Your advisors, ours, or both. One coordinated expansion."
],
    imageAlt: "Contemporary architectural passage framing a city and mountain horizon at dusk.",
    stagesLabel: "How Lurio engagements progress",
    stages: ["Assess", "Enter", "Launch", "Operate & Expand"],
  },

  problem: {
    eyebrow: "The expansion problem",
    title: "One expansion. Too many disconnected advisors.",
    body: [
      "Legal, tax, accounting, banking, people and operating decisions are often handled by different specialists. For management, however, they are not separate projects. They are one expansion.",
      "Lurio works on the client's side to keep the bigger picture connected — translating specialist input into business decisions, coordinating workstreams and making the next step clear.",
    ],
    disciplinesLabel: "Specialist fronts in a market entry",
    disciplines: ["Legal", "Tax", "Accounting", "Banking", "People", "Operations"],
    managementLabel: "For management",
    resolution: "One expansion.",
  },

  ecosystem: {
    eyebrow: "An open ecosystem",
    title: "Your advisors, ours, or both.",
    body: "Lurio maintains a curated network of local specialists, but the expansion is built around your needs — not our affiliations. If you already have advisors you trust, we work with them. If you need local expertise, we help assemble the right team.",
  },

  journey: {
    eyebrow: "How we help",
    title: "From market-entry decision to local execution.",
    // deck: "How Lurio helps" slide.
    intro:
      "The journey is flexible. Clients may enter at different stages depending on what is already clear and what still needs to be structured.",
    steps: [
      {
        stage: "Assess",
        offer: "Colombia Market Entry Assessment",
        body: "Understand what entering Colombia would actually require for your business: viable entry models, critical decisions, risks, workstreams, indicative timelines and an execution roadmap.",
      },
      {
        stage: "Enter",
        offer: "Market & Operating Strategy",
        body: "Define how to sell, contract, structure and operate locally, supported by the specialist advice the model requires.",
      },
      {
        stage: "Launch",
        offer: "Operational Launch Management",
        body: "Coordinate entity/setup, legal, tax, accounting, banking, payroll, immigration, local partners and other relevant workstreams through launch.",
      },
      {
        stage: "Operate & Expand",
        offer: "Ongoing Expansion Advisory",
        body: "Maintain executive visibility, coordinate evolving local needs and support management as the operation grows.",
      },
    ],
    // Publication rule from WEBSITE_COPY.md / CONTENT_STATUS.md, phrased for visitors.
    boundary:
      "Lurio coordinates specialist disciplines — it is not a law firm, accounting firm, recruitment agency or EOR.",
    // brand book: executive update structure; deck: "Reporting cadence" slide.
    reporting: {
      title: "Executive visibility without local overwhelm.",
      body: "Lurio updates should make decisions easier — not create more reading for HQ.",
      steps: ["What changed", "Why it matters", "Our recommendation", "What happens next"],
    },
  },

  whyLurio: {
    eyebrow: "Why Lurio",
    title: "Client-side thinking. Local capability. Hands-on accountability.",
    reasons: [
      {
        title: "Client-side perspective",
        body: "We start with what your business is trying to accomplish — not with a discipline we need to sell.",
      },
      {
        title: "Open orchestration",
        body: "Use your existing specialists, Lurio's ecosystem, or a combination of both.",
      },
      {
        title: "Executive translation",
        body: "We help management understand what specialist advice means for timing, cost, operating choices and next decisions.",
      },
      {
        title: "Hands-on accountability",
        body: "We follow up, connect dependencies, surface roadblocks and keep the work moving.",
      },
    ],
    idealClient: {
      label: "Who we work with",
      title: "Built for companies serious about building a presence — not simply outsourcing a task.",
      body: "Lurio is particularly relevant when an international company is entering Colombia for the first time, needs several local specialists, wants HQ visibility and control, and does not yet have a mature local operating infrastructure.",
    },
  },

  assessment: {
    eyebrow: "A practical place to start",
    title: "Colombia Market Entry Assessment",
    body: "Before committing to an entity, provider or operating structure, understand the decisions that should shape the entry. Lurio develops a focused, decision-ready view of the options and turns it into an execution roadmap.",
    coversLabel: "What it brings into view",
    // From the "01 — Assess" description in WEBSITE_COPY.md.
    covers: [
      "Viable entry models",
      "Critical decisions",
      "Risks",
      "Workstreams",
      "Indicative timelines",
      "Execution roadmap",
    ],
  },

  about: {
    eyebrow: "About",
    title: "Who we are",
    body: [
      "Lurio was created to give international companies a more coherent way to enter and operate in unfamiliar markets. Beginning in Colombia, we combine cross-border business understanding, local relationships and a flexible specialist ecosystem to support management from entry decisions through execution.",
      "Lurio is founder-led and designed to remain close to the client while building the methods, intelligence and ecosystem required to scale across Latin America.",
    ],
    // brand book: approved brand promise (two sentences; the second is highlighted).
    promise: ["You stay in control.", "We make the local pieces work together."],
    promiseLabel: "The Lurio promise",
    founders: [
      {
        name: "Juan Diego Guzmán",
        role: "Founder",
        bio: "Lawyer from Universidad Icesi, with postgraduate specialization in Commercial and Information Technology Law. Graduate of Universidad Externado de Colombia.",
        email: "juan.guzman@galo.legal",
        portrait: { src: "/images/team/juan-diego-guzman.avif", width: 688, height: 754 },
      },
      {
        name: "Nathalia Saavedra",
        role: "Cofounder",
        // Education verified against Icesi's 2022 Professional Development Week bio
        // and confirmed by the founder. LinkedIn was not publicly readable.
        bio: "Industrial engineer from Universidad Icesi, with a master's degree in Finance and Investment Management from the University of Liverpool, United Kingdom.",
        email: "nathalia@lurio.co",
        portrait: { src: "/images/team/nathalia-saavedra.jpg", width: 400, height: 400 },
      },
    ],
  },

  // Addition to the handoff IA, answering the objections the brand strategy names
  // (lawyer vs. Lurio, existing advisors, geography). Every answer restates approved copy.
  faq: {
    eyebrow: "Common questions",
    title: "Before we talk.",
    items: [
      {
        question: "Is Lurio a law firm or an accounting firm?",
        answer:
          "No. Lurio coordinates specialist disciplines — legal, tax, accounting, banking, payroll, immigration and others — around your business objective. It does not present itself as the law firm, accounting firm, recruitment agency or EOR.",
      },
      {
        question: "Can we keep the advisors we already work with?",
        answer:
          "Yes. Your advisors, ours, or both. If you already have advisors you trust, we work with them. If you need local expertise, we help assemble the right team.",
      },
      {
        question: "Where does Lurio work today?",
        answer:
          "Colombia is where we work today. Building the methods, intelligence and ecosystem to support expansion across Latin America is our longer-term ambition.",
      },
      {
        question: "Where does an engagement usually start?",
        answer:
          "Often with a Colombia Market Entry Assessment: a focused, decision-ready view of your entry options and an execution roadmap. The journey is flexible, so clients may also start at a later stage depending on what is already clear.",
      },
    ],
  },

  insights: {
    eyebrow: "Insights",
    title: "Make better expansion decisions before they become expensive ones.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Considering Colombia?",
    body: "Let's understand what entering it would actually require for your business.",
  },

  form: {
    requiredNote: "All fields are required.",
    labels: {
      name: "Name",
      email: "Work email",
      company: "Company",
      interest: "What would you like to discuss?",
      message: "Message",
    },
    interests: {
      expansion: "Our Colombia expansion",
      assessment: "Market Entry Assessment",
    },
    messagePlaceholder: "What is driving Colombia for you, and what timing are you working with?",
    submit: "Send message",
    sending: "Sending…",
    errorPrefix: "Error: ",
    honeypotLabel: "Leave this field empty",
    // {min} / {max} are replaced with the limits in lib/contact/schema.ts.
    errors: {
      name: { required: "Enter your name.", tooLong: "Use {max} characters or fewer." },
      email: { required: "Enter your work email.", invalid: "Enter a valid email address, like name@company.com." },
      company: { required: "Enter your company name.", tooLong: "Use {max} characters or fewer." },
      message: {
        required: "Tell us briefly what you have in mind.",
        tooShort: "Add a little more detail (at least {min} characters).",
        tooLong: "Keep your message under {max} characters.",
      },
    },
    status: {
      unavailable: "Our contact form isn't accepting messages right now. Please try again later.",
      failed: "We couldn't send your message. Please try again in a few minutes.",
      rate_limited: "You've sent several messages in a short time. Please wait a few minutes before trying again.",
      too_fast: "That was quick — please review your message and send it again.",
      duplicate: "We've already received this message — there's no need to send it again.",
    },
    success: {
      title: "Thank you. Your message has reached Lurio.",
      body: "We'll reply to the work email you provided.",
      again: "Send another message",
    },
    privacy: { before: "Read how we handle your details in our ", link: "privacy notice", after: "." },
  },

  footer: {
    // The tagline is not translated (Brand Book: avoid literal translations of the tagline).
    tagline: "Keep Expansion Moving",
    descriptor: "Market Entry & Expansion Advisory · Colombia",
    explore: "Explore",
    conversation: "Start a conversation",
    privacy: "Privacy",
  },

  notFound: {
    metaTitle: "Page not found | Lurio",
    title: "This page isn't here.",
    body: "The link may be out of date. The rest of the site will get you where you need to go.",
    back: "Back to the homepage",
  },
};

export type Dictionary = typeof en;
