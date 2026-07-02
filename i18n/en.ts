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
    smbestName: "SMBEST",
    smbestType: "CLIENT",
    smbestDesc: "Corporate website build.",
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

  philosophy: {
    label: "PHILOSOPHY",
    big: "Experiences that last\ncome before screens that impress.",
    cards: [
      {
        en: "Clarity before complexity",
        name: "Clarity before complexity",
        desc: "A screen that needs explaining gets redesigned.",
      },
      {
        en: "Reliable interfaces",
        name: "Reliable interfaces",
        desc: "Everything clickable works — error states included.",
      },
      {
        en: "Designed to scale",
        name: "Designed to scale",
        desc: "Adding a feature shouldn't mean rebuilding the whole.",
      },
      {
        en: "Built with care",
        name: "Built with care",
        desc: "Launch isn't the finish line. It's where refining starts.",
      },
    ],
    cta: "Why Lunervia exists",
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

  notFound: {
    code: "404 — FAR SIDE OF THE MOON",
    title: "You've reached the far side of the moon.",
    desc: "This page doesn't exist, or the address changed.",
    cta: "Back home",
  },
};
