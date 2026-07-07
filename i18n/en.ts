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
    work: "Work",
    coena: "Coena",
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

  coena: {
    eyebrow: "COENA — LIVING LAYER R&D",
    title: "A living layer on top of AI",
    body: "It inspects its own output, tags the cause when it fails and rebuilds, and ships only what passes. A project that brings the biology of self-healing and homeostasis to the LLM reasoning layer.",
    features: [
      { tag: "self.heal()", desc: "Detects an error, classifies the cause, and retries on its own" },
      { tag: "self.verify()", desc: "Mechanically checks that every input fact made it into the output" },
      { tag: "failure.memory", desc: "The more failures it records, the more accurate the engine gets" },
    ],
    status: "v0.1 — first being validated on a teacher-notice assistant",
    ctaPrototype: "Open the prototype",
    ctaNotes: "Tech notes",
    srHero: "An animation of the generate–verify–retry loop",
  },

  contact: {
    label: "CONTACT",
    title: "Let's build.",
    lead: "Instagram DM is the fastest channel. New builds, renewals, collaborations — any stage works.",
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
