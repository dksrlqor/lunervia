/* LUNERVIA i18n — English. Not a literal translation: written as
   native product copy. Structure follows ko.ts (Dict). */

import type { Dict } from "./ko";

export const en: Dict = {
  misc: {
    skip: "Skip to content",
    menu: "Open menu",
    close: "Close",
    langLabel: "Switch language",
    backHome: "Back home",
    externalNote: "Opens in a new tab",
  },

  nav: {
    about: "About",
    services: "Services",
    work: "Work",
    modules: "Modules",
    contact: "Contact",
  },

  hero: {
    eyebrow: "LUNERVIA — SOFTWARE STUDIO",
    status: "Available for projects",
    titleLines: ["Your ideas,", "made **real**."],
    sub: "Planning, design, build, launch. Not mockups — working software.",
    ctaContact: "Start a project",
    ctaWork: "View work",
    moonAlt: "A crescent moon formed by particles",
  },

  services: {
    label: "SERVICES",
    title: "What Lunervia does",
    lead: "Everything a service needs to actually ship — from planning to production.",
    items: [
      {
        tag: "WEB",
        name: "Web service development",
        desc: "From idea to a deployed service — auth, data, and everything between.",
      },
      {
        tag: "ARCHITECTURE",
        name: "Frontend architecture",
        desc: "Component structure and state design that stays maintainable.",
      },
      {
        tag: "UI/UX",
        name: "UI/UX redesign",
        desc: "Screens people struggle with, redesigned into screens people don't.",
      },
      {
        tag: "LANDING",
        name: "Landing pages",
        desc: "Structure, copy, and load speed — built to convert.",
      },
      {
        tag: "BRAND",
        name: "Brand experience",
        desc: "One consistent brand surface, from logo to website.",
      },
      {
        tag: "AI",
        name: "AI workflow integration",
        desc: "Repetitive work, replaced with AI pipelines.",
      },
    ],
  },

  work: {
    label: "WORK",
    title: "Proof, shipped.",
    lead: "Services in production and real client work.",
    featuredName: "Badajwo — Take My Letter",
    featuredStatus: "Live · takemyletter.site",
    featuredDesc:
      "A pixel-art letterbox for anonymous handwritten letters. Planned, designed, and built end to end — frontend to Supabase backend.",
    featuredRole: "Product · UX · Frontend · Backend",
    featuredCta: "See the project",
    visitCta: "Open the service",
    labName: "Lunervia Lab",
    labStatus: "In progress",
    labDesc: "Experiments, UI research, prototypes.",
    moreCta: "View all work",
  },

  process: {
    label: "PROCESS",
    title: "How we build",
    lead: "Five steps. Each output feeds the next step.",
    steps: [
      { name: "Plan", en: "PLAN", desc: "Scope and goals, fixed in writing." },
      { name: "UX flow", en: "FLOW", desc: "Screen flow comes before visuals." },
      { name: "UI design", en: "DESIGN", desc: "Screens assembled from tokens and components." },
      { name: "Build", en: "BUILD", desc: "Frontend and backend, built and verified by us." },
      { name: "Launch", en: "LAUNCH", desc: "Ship, measure, list the next improvements." },
    ],
  },

  whyInvite: {
    label: "WHY LUNERVIA",
    titleLines: ["Why Lunervia", "**exists**"],
    lead: "From the meaning of the name to what building Badajwo taught us — a slightly long letter from the person who builds here.",
    cta: "Read the story",
  },

  contact: {
    label: "CONTACT",
    title: "Let's build.",
    lead: "Instagram DM is the fastest channel. New builds, renewals, monthly modules — any stage works.",
    channels: [
      { name: "Instagram", handle: "@lunerviasoft", meta: "Official · DM us", href: "https://www.instagram.com/lunerviasoft/" },
      { name: "Instagram", handle: "@_dksrlqor", meta: "Founder, direct", href: "https://www.instagram.com/_dksrlqor/" },
      { name: "TikTok", handle: "@_dksrlqor", meta: "Behind the scenes", href: "https://www.tiktok.com/@_dksrlqor" },
      { name: "Email", handle: "Coming soon", meta: "Opening soon", href: "" },
    ],
    cta: "DM on Instagram",
  },

  footer: {
    tagline: "Lunervia — the road to the moon.",
    sub: "A software studio that turns ideas into working services.",
    explore: "Explore",
    connect: "Connect",
    rights: "All rights reserved.",
    top: "Back to top",
  },

  modulesHub: {
    label: "MODULES",
    title: "Monthly modules",
    lead: "Subscription development with a fixed monthly scope. The project ends — the site keeps improving.",
    included: "What's included",
    target: "Who it's for",
    priceNote: "Pricing is set with the scope, after a consultation. Online payment isn't open yet.",
    recommended: "Recommended",
    relatedTitle: "Document product",
    relatedDesc: "Service Builder Module — a document module that turns general AI into a working system.",
    relatedCta: "View product",
  },

  checkout: {
    label: "CHECKOUT",
    title: "It starts with a conversation",
    lead: "Online payment isn't open yet. Requests come in by Instagram DM; work starts once the scope is confirmed.",
    planLabel: "Selected module",
    billingLabel: "Billing",
    billingValue: "Monthly · set after consultation",
    steps: [
      "Send the module name via Instagram DM.",
      "We review your site or idea, then fix scope and price.",
      "We agree on the first month's list and start.",
    ],
    cta: "Request via DM",
    invalidTitle: "No module selected",
    invalidDesc: "Pick a plan on the modules page first.",
    backToModules: "Go to modules",
  },

  serviceBuilder: {
    eyebrow: "LUNERVIA MODULE · SERIES 01",
    titleLines: ["Not copy-paste prompts —", "a **work system** for AI."],
    sub: "Drop it into ChatGPT, Claude, Gemini, or Cursor and anyone gets a consistent-quality service diagnosis. Beginners just fill in the blanks.",
    ctaSample: "See a sample result",
    ctaGet: "Get the package",
    chips: ["ChatGPT", "Claude", "Gemini", "Cursor", "Mobile"],
    problem: {
      label: "PROBLEM",
      title: "AI is smart, but the output changes every time.",
      lead: "What you need isn't one well-written sentence — it's a workflow that repeats the same quality.",
      cards: [
        { t: "Rewriting every time", d: "You have to write the prompt from scratch on every ask." },
        { t: "Inconsistent quality", d: "The same question returns different depth and format each time." },
        { t: "No priorities", d: "It never tells you what to fix first." },
        { t: "Hard to hand to dev", d: "Turning the diagnosis into real development work is daunting." },
      ],
    },
    solution: {
      label: "SOLUTION",
      title: "Analyze → Judge → Output → Review, in one flow.",
      lead: "Service diagnosis is bundled into a fixed four-step workflow, so anyone gets the same structured result.",
      steps: [
        { name: "Analyze", desc: "It analyzes the service's purpose and users first." },
        { name: "Judge", desc: "It sorts 3–5 core issues by evidence and priority." },
        { name: "Output", desc: "It organizes design, copy, feature, and mobile-UX fixes in a fixed format." },
        { name: "Review", desc: "It scores the result quality against a 12-point rubric." },
      ],
    },
    sample: {
      label: "SAMPLE OUTPUT",
      title: "Sample diagnosis",
      intro: 'Example input: "A neighborhood bakery pickup-booking web app (mobile-first, run by one person)." Below is the output format the module actually produces.',
      blocks: [
        {
          t: "1 · Analyze",
          d: "The goal is 'pickup booking conversion'; the main users are regulars ordering quickly on mobile. The core path is menu → time slot → payment confirmation.",
          lines: [],
        },
        {
          t: "2 · Judge (prioritized issues)",
          d: "",
          lines: [
            "[High] Picking a pickup time takes 3 steps, causing drop-off — shorten it to a single-screen slot picker.",
            "[High] Price and stock only appear right before payment — show them at the list stage.",
            "[Medium] The CTA 'Confirm' is vague — make it specific: 'Book pickup at this time.'",
          ],
        },
        {
          t: "3 · Output (fixes · fixed format)",
          d: "For each issue it lays out 'symptom → fix → expected effect → effort' in one line, ready to drop straight into a task list.",
          lines: [],
        },
        {
          t: "4 · Review (12-point rubric)",
          d: "Scores 12 items — clarity, priority, feasibility, and more — on a 5-point scale. Example result: average 4.1 / 5, with 2 items flagged for improvement.",
          lines: [],
        },
      ],
      note: "Actual results vary with your input and the AI model and version. It's a first-pass judgment that assumes human review.",
    },
    inside: {
      label: "WHAT'S INSIDE",
      title: "What's in the package",
      lead: "Not an app or a login — a document-style package (zip · Notion) you paste and use right away.",
      items: [
        { t: "Core module", d: "The work-system core, shared across every AI." },
        { t: "Per-platform prompts", d: "Separate versions for ChatGPT · Claude · Gemini · Cursor · Mobile." },
        { t: "Input & output templates", d: "6 input templates / 6 output templates." },
        { t: "12-point review rubric", d: "A checklist to score your own results." },
        { t: "Dev hand-off prompt", d: "Turns the diagnosis straight into Cursor work orders." },
        { t: "Usage & tuning guide", d: "A guide even first-time users can follow." },
        { t: "Safety & limits guide", d: "Where to trust it, and what a human should verify." },
        { t: "3 sample in/outputs", d: "Samples showing exactly how results look." },
      ],
    },
    audience: {
      label: "FOR WHOM",
      title: "Who it's for",
      items: [
        "Solo founders · indie developers",
        "Students · aspiring founders",
        "Small teams · startups",
        "Freelancers · marketers",
        "Developers",
      ],
    },
    compare: {
      label: "DIFFERENCE",
      title: "How is it different from free prompts?",
      colHead: "Category",
      colFree: "Free prompts",
      colMod: "Service Builder Module",
      rows: [
        { name: "Form", free: "A sentence or two", mod: "Analyze · judge · output · review system" },
        { name: "Consistency", free: "Different every time", mod: "Fixed output structure" },
        { name: "Depth", free: "Fragmented answers", mod: "Priorities · work orders · QA, all connected" },
        { name: "Environment", free: "Usually one place", mod: "ChatGPT · Claude · Gemini · Cursor · Mobile" },
        { name: "Quality check", free: "None", mod: "Includes a 12-point rubric" },
      ],
    },
    pricing: {
      label: "PRICING",
      title: "Buy once, keep using it",
      lead: "A specialization layer that makes your existing AI work better. Before hiring an expert, produce a low-cost first draft.",
      badge: "Recommended",
      note: "The official checkout page is in preparation. For now, so you can try it first, inquire via Instagram → we'll send the package by bank transfer.",
      plans: [
        {
          id: "starter",
          name: "Starter",
          tag: "Personal · AI beginners & students",
          price: "₩14,900",
          features: ["Core module", "Key platform prompts", "Basic templates & samples"],
          cta: "Get Starter",
        },
        {
          id: "pro",
          name: "Pro",
          tag: "Personal/team · practitioners & small teams",
          price: "₩39,000",
          features: [
            "All input & output templates",
            "12-point review rubric",
            "Dev hand-off prompt",
            "All sample in/outputs",
          ],
          cta: "Get Pro",
        },
        {
          id: "custom",
          name: "Custom",
          tag: "For companies",
          price: "Contact us",
          features: ["Tailored to your domain & brand tone", "Customization", "Onboarding support"],
          cta: "Contact us",
        },
      ],
    },
    notice: {
      label: "BEFORE YOU BUY",
      title: "An honest heads-up before you buy",
      items: [
        "It's a specialization layer that runs on top of general AI like ChatGPT, Claude, or Gemini. (The AI itself is not included.)",
        "It's a document-style package you paste and use — not an app or a login.",
        "AI results are a first draft; important decisions should be reviewed by a person.",
        "Legal, medical, investment, and security judgments require expert confirmation.",
        "Never enter personal data, API keys, or passwords.",
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          q: "Isn't this just a prompt collection?",
          a: "No. It's a work system that bundles analyze · judge · output · review, with a fixed output format so anyone gets consistent quality — and it even includes a rubric that scores the result.",
        },
        {
          q: "Which AI can I use it with?",
          a: "It includes versions for ChatGPT, Claude, Gemini, Cursor, and mobile ChatGPT.",
        },
        { q: "Do I need to know AI well?", a: "No. Just fill in the blanks in the input template and send it." },
        {
          q: "Are results always accurate?",
          a: "It's a first-pass judgment. Results can vary by model and version, so it's designed to assume human review.",
        },
        {
          q: "Does it replace experts?",
          a: "No. It's a tool for making a low-cost first draft before you hire an expert.",
        },
        {
          q: "Can I get a refund?",
          a: "As digital content, it follows the sales channel's policy and applicable law.",
        },
      ],
    },
    buy: {
      label: "GET THE MODULE",
      title: "How to get it",
      body: "The official checkout page is in preparation, so automatic downloads aren't available yet. If you'd like to try it first, send us a DM on Instagram. After we confirm, we'll send the package (zip · Notion) by bank transfer.",
      steps: [
        "Tell us your plan via Instagram DM.",
        "We confirm the plan and share bank-transfer details.",
        "After payment is confirmed, we send the package (zip · Notion).",
      ],
      note: "Please don't send personal data, API keys, or passwords. As digital content, refunds follow the sales channel's policy and applicable law.",
      cta: "Inquire via Instagram DM",
    },
    final: { title: "Stop hunting for the perfect prompt —\nget consistent results." },
  },

  workPage: {
    label: "WORK",
    title: "Proof, shipped.",
    lead: "Services in production, experiments, client work — all of it real.",
    badajwo: {
      status: "Live · takemyletter.site",
      name: "Badajwo — Take My Letter",
      desc: "A pixel-art letterbox for anonymous handwritten letters. Post your letterbox link on an Instagram story and anyone can write to you — anonymously or by name. Planned, designed, built, and operated end to end by Lunervia.",
      stackLabel: "STACK",
      stack: ["React 18", "Vite", "Tailwind CSS", "Supabase", "Framer Motion"],
      featuresLabel: "What we built",
      features: [
        "An anonymous letterbox behind a single link",
        "One-time letter links that live for 24 hours",
        "4 letter-paper templates (pixel · romantic · vintage · photo frame)",
        "Auto-generated Instagram story share images",
        "A record-player BGM",
        "Admin dashboard and report handling",
      ],
      role: "Product · UX · Frontend · Backend",
      cta: "Open the service",
      petHint: "Try petting the cat",
    },
    cards: [
      { tag: "LAB", name: "Lunervia Lab", status: "In progress", desc: "Experiments, UI research, prototypes." },
      {
        tag: "PARTNER",
        name: "Todak Life",
        status: "Channel",
        desc: "A creator channel sharing the journey of building apps through video.",
      },
    ],
  },

  why: {
    eyebrow: "WHY LUNERVIA",
    heroLines: ["Why we build —", "**written** down, here."],
    heroSub:
      "A slightly long letter from the person who builds under the name Lunervia. Five minutes to read.",
    readCta: "Read the story",
    storyLabel: "THE STORY",
    chapters: [
      {
        no: "01",
        title: "On the name",
        paragraphs: [
          "Lunervia is a name built around the idea of 'a road to the moon' — it starts from luna, the Latin word for moon. It was never meant to carry a grand philosophy. I simply needed a direction.",
          "The moon is less a destination than a reference point. The way someone walking at night checks the moon to keep their bearing, I wanted one fixed standard I could return to every time I build something. Put it in the name itself, I thought, and the name would pull me back whenever I drift.",
          "So Lunervia has had one standard from day one: we don't make screens. We make services that work.",
        ],
      },
      {
        no: "02",
        title: "On how it started",
        paragraphs: [
          "A studio was never the plan. I just wanted to build one service with my own hands, end to end. I had seen too many ideas stop at the planning deck, too many screens that never left the mockup — and every one of them felt like a waste.",
          "So I built one. Badajwo — Take My Letter, an anonymous letterbox service, came out of exactly that. Carrying it alone through planning, design, frontend, backend and launch taught me things a hundred decks never did.",
          "What a button shows when it fails keeps users longer than what color it is. Build, ship, watch real people use it — that loop is all of Lunervia.",
        ],
      },
      {
        no: "03",
        title: "On how we work",
        paragraphs: [
          "Lunervia is not a big organization, which means it can work in ways big organizations find hard. The person who plans is the one who designs, builds, and watches the deployed screen to the end. Intent doesn't evaporate between hand-offs.",
          "The restraint in our screens comes from the same place. Not because we can't decorate — because erasing is the harder discipline. A screen that needs explaining gets redesigned. Everything clickable must work. We draw the failing, empty and waiting states before we ship.",
          "And launch day is not completion day; it is the first day of refining. Watch the numbers, fix, ship again. We have never seen a lasting service finished in one pass.",
        ],
      },
      {
        no: "04",
        title: "On where this goes",
        paragraphs: [
          "What Lunervia wants is a simple scene: someone who only ever thought \"it would be nice if this existed\" — holding a real service that opens when you type the address.",
          "An idea should not end as a few screens. It should have an address, load, and work when pressed. We want to be the studio that goes with you to that last step — not one that hands off and leaves, but one that keeps refining while the lights are on.",
          "If you've read this far, there is probably something you want to build. Tell us the idea. We'll make it real.",
        ],
      },
    ],
    quote1: "A service is not a sum of screens.\nIt is a sum of **decisions**.",
    quote2: "Launch is not the finish line.\nIt is where **refining** starts.",
    sign: "Lunervia — a software studio that makes ideas real",
    ctaContact: "Start a project",
    ctaWork: "View work",
  },

  notFound: {
    code: "404 — FAR SIDE OF THE MOON",
    title: "You've reached the far side of the moon.",
    desc: "This page doesn't exist, or the address changed.",
    cta: "Back home",
  },
};
