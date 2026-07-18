/* LUNERVIA i18n — English. Not a literal translation: written as
   native product copy. Structure follows ko.ts (Dict). */

import type { Dict } from "./ko";

export const en: Dict = {
  misc: {
    skip: "Skip to content",
    menu: "Open menu",
    close: "Close",
    langLabel: "Switch language",
    backHome: "Back to home",
    externalNote: "Opens in a new tab",
  },

  nav: {
    about: "About",
    work: "Work",
    coena: "Coena",
    contact: "Contact",
    cta: "Start a project",
  },

  hero: {
    eyebrow: "LUNERVIA — SOFTWARE STUDIO & PRODUCT LAB",
    titleLines: ["Working software comes from", "**structures you can verify**."],
    sub: "Lunervia is a software studio that owns the whole path from plan to production. We don't hand over screens — we ship services with a URL that answers.",
    ctaWork: "See the work",
    ctaContact: "Start a project",
    ctaCoena: "Preview Coena",
    fabricSr:
      "A diagram of how Lunervia works — spec, build, verify, recover and ship connected as one system.",
    stages: {
      spec: "Spec",
      build: "Build",
      verify: "Verify",
      recover: "Recover",
      ship: "Ship",
    },
    panels: {
      verifyTitle: "coena.verify()",
      verifyLines: ["structure — ok", "empty state — ok", "retry path — ok"],
      verifyMeta: "3 checks passed",
      shipTitle: "takemyletter.site",
      shipMeta: "LIVE · 200 OK",
      shipDesc: "Take My Letter — in production",
      buildTitle: "letter.form.tsx",
      buildLines: ['- alert("Send failed")', "+ <RetryNotice at={savedDraft} />"],
      buildMeta: "Failure states designed in",
    },
  },

  proof: {
    label: "PROOF",
    sr: "Operating evidence",
    items: [
      { state: "live", tag: "LIVE", text: "Take My Letter · takemyletter.site", meta: "in production" },
      { state: "warn", tag: "BUILDING", text: "Coena v0.1 verification engine", meta: "in progress" },
      { state: "ok", tag: "SHIPPED", text: "Plan to deploy, carried by one team", meta: "one team" },
      {
        state: "plain",
        tag: "STACK",
        text: "Next.js · React · TypeScript · Supabase",
        meta: "production stack",
      },
    ],
  },

  builds: {
    label: "WHAT LUNERVIA BUILDS",
    title: "Four lines of work",
    lead: "Client builds are the core. The other three keep raising their bar.",
    items: [
      {
        id: "studio",
        tag: "STUDIO",
        name: "Client web services",
        desc: "We turn ideas into services with sign-in, data and deployment. From landing pages to full products — scope is fixed in writing before we start.",
        link: "Start a project",
        href: "/#contact",
      },
      {
        id: "product",
        tag: "PRODUCT",
        name: "Our own service",
        desc: "We built and operate Take My Letter, an anonymous letter inbox. Before building for clients, we test our standards on ourselves.",
        link: "See Take My Letter",
        href: "/work",
      },
      {
        id: "coena",
        tag: "COENA",
        name: "Verification layer R&D",
        desc: "Coena is an engine that refuses to trust AI output as-is. It verifies, recovers and remembers.",
        link: "About Coena",
        href: "/#coena",
      },
      {
        id: "lab",
        tag: "LAB",
        name: "Experiments & prototypes",
        desc: "UI research and service experiments. We break our tools here before using them on client work.",
        link: "All work",
        href: "/work",
      },
    ],
  },

  caseStudy: {
    label: "CASE — 001",
    title: "받아줘 — Take My Letter",
    status: "In production · takemyletter.site",
    desc: "A pixel-art inbox for anonymous handwritten letters. Post your inbox link on an Instagram story and anyone can write to you, named or anonymous. Planned, designed, built and operated entirely by Lunervia.",
    roleLabel: "ROLE",
    role: "Plan · UX · Frontend · Backend",
    stackLabel: "STACK",
    stack: ["React 18", "Vite", "Tailwind CSS", "Supabase", "Framer Motion"],
    builtLabel: "What we built",
    built: [
      "Anonymous inbox — letters through one link",
      "24-hour one-time letter links",
      "4 letter paper templates",
      "Auto-generated story share images",
    ],
    mockNote: "Product UI, recreated in code",
    mockInbox: "My inbox",
    mockLetters: ["Anonymous letter · just now", "Signed letter · 3h ago", "Anonymous letter · yesterday"],
    mockCta: "Write a letter",
    visitCta: "Open the service",
    moreCta: "Project details",
  },

  philosophy: {
    label: "HOW WE THINK",
    quote: "A service is not a sum of screens.\nIt is a sum of **decisions**.",
    principles: [
      "The person who plans it builds it, and watches the deployed screen to the end.",
      "We ship only after designing the failing, empty and waiting moments — not just the happy path.",
      "Launch day is not completion day. It is the first day of refinement.",
    ],
    cta: "Read why we exist",
  },

  coena: {
    eyebrow: "COENA — LIVING LAYER R&D",
    title: "A living layer on top of AI",
    body: "AI sometimes produces convincing wrong answers. Coena is an engine that refuses to take that output on faith. It checks once more, rebuilds what's wrong, and releases only what passed. We're porting the way organisms heal themselves into software.",
    gooey: ["verify", "recover", "remember", "release"],
    gooeySr: "Coena verifies, recovers, remembers — and releases only what passed.",
    features: [
      { tag: "self.heal()", desc: "On failure, it finds the cause and retries on its own" },
      { tag: "self.verify()", desc: "Before release, it cross-checks that nothing was dropped" },
      { tag: "failure.memory", desc: "It remembers why it failed, so it won't fail the same way twice" },
    ],
    status: "v0.1 is being built right now",
    pricing: {
      label: "PRICING",
      title: "Three ways to meet Coena",
      lead: "It's still being built, so we wrote down only what we can promise — prices will be published at launch.",
      tiers: [
        {
          id: "preview",
          tag: "v0.1 — PREVIEW",
          name: "Preview",
          desc: "Public prototype. Be the first to try Coena's verification loop.",
          price: "Free",
          billing: "from public release",
          features: ["Try the self.verify() loop", "Public prototype access", "Launch news first"],
          cta: "Get launch updates",
          badge: "",
          highlighted: false,
        },
        {
          id: "standard",
          tag: "v1.0 — STANDARD",
          name: "Standard",
          desc: "The full version. A plan for solo builders and teams.",
          price: "TBA",
          billing: "published at launch",
          features: ["self.heal() self-recovery", "self.verify() self-checking", "failure.memory"],
          cta: "Get launch updates",
          badge: "",
          highlighted: false,
        },
        {
          id: "studio",
          tag: "NOW — STUDIO",
          name: "Studio",
          desc: "We design a Coena pipeline into the projects Lunervia builds for you.",
          price: "Custom",
          billing: "per project",
          features: [
            "Verification designed per project",
            "Built and shipped by the studio",
            "Direct line to the founder",
          ],
          cta: "Start a project",
          badge: "Available now",
          highlighted: true,
        },
      ],
    },
  },

  process: {
    label: "PROCESS",
    title: "How a project runs",
    lead: "Five stages. Each stage's output is the next stage's input.",
    steps: [
      { code: "SPEC", name: "Plan", desc: "Scope and goals are fixed in plain sentences." },
      { code: "FLOW", name: "UX flow", desc: "Screen order comes before visual design." },
      {
        code: "BUILD",
        name: "Build",
        desc: "Screens assembled from tokens and components; frontend and backend built together.",
      },
      {
        code: "VERIFY",
        name: "Verify",
        desc: "Failing, empty and waiting states checked by hand before release.",
      },
      { code: "SHIP", name: "Ship", desc: "Deploy, watch the numbers, write the next improvement list." },
    ],
  },

  contact: {
    label: "CONTACT",
    title: "Let's start the project.",
    lead: "Instagram DM is the fastest way to reach us. New builds, redesigns, collaborations — any stage is fine.",
    channels: [
      {
        name: "Instagram",
        handle: "@lunerviasoft",
        meta: "Official channel · DM",
        href: "https://www.instagram.com/lunerviasoft/",
      },
      {
        name: "Instagram",
        handle: "@4ever2short",
        meta: "Founder, direct",
        href: "https://www.instagram.com/4ever2short/",
      },
      {
        name: "TikTok",
        handle: "@_dksrlqor",
        meta: "Behind the scenes",
        href: "https://www.tiktok.com/@_dksrlqor",
      },
      { name: "Email", handle: "Coming soon", meta: "Opening soon", href: "" },
    ],
    cta: "Message us on Instagram",
  },

  footer: {
    tagline: "The road to the moon, Lunervia.",
    sub: "A software studio that turns ideas into working services.",
    explore: "Explore",
    connect: "Channels",
    rights: "All rights reserved.",
    top: "Back to top",
  },

  workPage: {
    label: "WORK",
    title: "Deployment is our proof.",
    lead: "Services in production, experiments, client work — all of it real.",
    badajwo: {
      status: "In production · takemyletter.site",
      name: "받아줘 — Take My Letter",
      desc: "A pixel-art inbox for anonymous handwritten letters. Post your inbox link on an Instagram story and anyone can write to you, named or anonymous. Planned, designed, built and operated entirely by Lunervia.",
      stackLabel: "STACK",
      stack: ["React 18", "Vite", "Tailwind CSS", "Supabase", "Framer Motion"],
      featuresLabel: "What we built",
      features: [
        "Anonymous inbox — letters through one link",
        "24-hour one-time letter links",
        "4 letter paper templates (pixel · romantic · vintage · photo frame)",
        "Auto-generated Instagram story share images",
        "Record player BGM",
        "Admin dashboard and report handling",
      ],
      role: "Plan · UX · Frontend · Backend",
      cta: "Open the service",
    },
    cards: [
      {
        tag: "LAB",
        name: "Lunervia Lab",
        status: "In preparation",
        desc: "Service experiments, UI research, prototypes.",
      },
      {
        tag: "PARTNER",
        name: "Todak Life",
        status: "Channel",
        desc: "A creator channel sharing the app-building process on video.",
      },
    ],
  },

  why: {
    eyebrow: "WHY LUNERVIA",
    heroLines: ["Why we build,", "**written down** here."],
    heroSub:
      "A slightly long letter, written by the person who makes the screens under the name Lunervia. Five minutes to read.",
    storyLabel: "THE STORY",
    chapters: [
      {
        no: "01",
        title: "On the name",
        paragraphs: [
          "Lunervia carries the meaning 'the road to the moon'. It starts from luna, Latin for moon. It wasn't meant to hold a grand philosophy — a direction was needed.",
          "The moon is less a destination than a reference point. The way a night walker finds their bearing by the moon, I wanted one standard to return to with every build. Carve it into the name itself, and the name pulls you back whenever you drift.",
          "So Lunervia's standard has been singular from the start: not making screens — making services that work.",
        ],
      },
      {
        no: "02",
        title: "On the beginning",
        paragraphs: [
          "A studio wasn't the plan. I just wanted to carry one service from first idea to production with my own hands. I had seen too many ideas stop at the planning document, too many screens remain mockups, too many 'someday' stories — and every one felt like a waste.",
          "So I built one. Take My Letter, the anonymous letter service, came out of that. Passing through planning, design, frontend, backend and deployment single-handed taught me things a hundred documents never did.",
          "What keeps users longer isn't the button's color — it's what the screen shows when that button fails. Build, ship, watch real people use it. That loop is the whole of Lunervia.",
        ],
      },
      {
        no: "03",
        title: "On how we work",
        paragraphs: [
          "Lunervia is not a large organization, which lets it work in ways large organizations find hard. The person who plans, designs; the person who designs, builds; the person who builds watches the deployed screen to the end. Intent never evaporates crossing between people.",
          "The insistence on plain screens comes from the same place. Not because we can't make things flashy — because erasing is the harder discipline. A screen that needs explaining gets redesigned. Anything that looks pressable must work. We ship only after drawing the failing, empty and waiting moments, not just the successful ones.",
          "And launch day is not completion day — it's the day refinement begins. Watch the numbers, fix, redeploy. We've never seen a long-lived service finished in one pass.",
        ],
      },
      {
        no: "04",
        title: "On what's ahead",
        paragraphs: [
          "The scene Lunervia hopes for is simple: someone who only ever thought 'this should exist' holding a real service that opens when you type the address.",
          "A thought shouldn't end as a few screens. It needs an address, a connection, and buttons that do things. Lunervia wants to be the place that goes all the way to that last step — not a shop that hands off and leaves, but one that keeps refining while the service stays on.",
          "If you've read this far, there's probably something you want to build. Tell us about it. We'll make it real.",
        ],
      },
    ],
    quote1: "A service is not a sum of screens.\nIt is a sum of **decisions**.",
    quote2: "Launch is not the end.\nIt is where **refinement** begins.",
    sign: "Lunervia — a software studio that makes ideas real",
    ctaContact: "Start a project",
    ctaWork: "See the work",
  },

  notFound: {
    code: "404 — FAR SIDE OF THE MOON",
    title: "You're on the far side of the moon.",
    desc: "The page doesn't exist, or the address has changed.",
    cta: "Back to home",
  },
};
