/* LUNERVIA i18n — 한국어(기본). 구조가 원본, en.ts 는 이 타입을 따른다.
   하이라이트: 문자열 안 **단어** 는 민트 스팬으로 렌더된다(components/format.tsx). */

export const ko = {
  misc: {
    skip: "본문으로 건너뛰기",
    menu: "메뉴 열기",
    close: "닫기",
    langLabel: "언어 전환",
    backHome: "메인으로 돌아가기",
    externalNote: "새 탭에서 열림",
  },

  nav: {
    about: "소개",
    services: "서비스",
    work: "작업",
    modules: "모듈",
    contact: "문의",
  },

  hero: {
    eyebrow: "LUNERVIA — SOFTWARE STUDIO",
    status: "신규 프로젝트 모집 중",
    titleLines: ["당신의 생각을", "**현실**로 만들어 드립니다."],
    sub: "기획, 설계, 구현, 배포까지. 화면이 아니라 작동하는 서비스를 만듭니다.",
    ctaContact: "프로젝트 문의",
    ctaWork: "작업 보기",
    moonAlt: "입자가 모여 이루는 초승달",
  },

  services: {
    label: "SERVICES",
    title: "Lunervia가 하는 일",
    lead: "기획에서 배포까지, 서비스가 실제로 작동하는 데 필요한 전부.",
    items: [
      {
        tag: "WEB",
        name: "웹서비스 개발",
        desc: "아이디어를 로그인, 데이터, 배포까지 갖춘 서비스로 구현합니다.",
      },
      {
        tag: "ARCHITECTURE",
        name: "프론트엔드 시스템 설계",
        desc: "오래 유지보수할 수 있는 컴포넌트 구조와 상태 설계.",
      },
      {
        tag: "UI/UX",
        name: "UI/UX 리디자인",
        desc: "쓰기 어려운 화면을 쓰기 쉬운 화면으로 다시 설계합니다.",
      },
      {
        tag: "LANDING",
        name: "랜딩 페이지",
        desc: "전환을 만드는 구조와 카피, 로딩 속도까지 함께 다룹니다.",
      },
      {
        tag: "BRAND",
        name: "브랜드 경험",
        desc: "로고부터 웹사이트까지, 하나로 읽히는 브랜드 화면.",
      },
      {
        tag: "AI",
        name: "AI 워크플로 연동",
        desc: "반복 작업을 AI 파이프라인으로 바꿉니다.",
      },
    ],
  },

  work: {
    label: "WORK",
    title: "증명은 배포로 합니다.",
    lead: "지금 운영 중인 서비스와 실제 클라이언트 작업.",
    featuredName: "받아줘 — Take My Letter",
    featuredStatus: "운영 중 · takemyletter.site",
    featuredDesc:
      "익명 손편지를 받는 픽셀 감성 편지함. 기획부터 프론트엔드, Supabase 백엔드까지 전부 Lunervia가 만들었습니다.",
    featuredRole: "기획 · UX · 프론트엔드 · 백엔드",
    featuredCta: "프로젝트 자세히",
    visitCta: "서비스 열기",
    labName: "Lunervia Lab",
    labStatus: "준비 중",
    labDesc: "서비스 실험, UI 연구, 프로토타입.",
    smbestName: "SMBEST",
    smbestType: "CLIENT",
    smbestDesc: "기업 사이트 구축 프로젝트.",
    moreCta: "작업 전체 보기",
  },

  process: {
    label: "PROCESS",
    title: "이런 순서로 만듭니다",
    lead: "다섯 단계. 각 단계의 결과물이 다음 단계의 입력이 됩니다.",
    steps: [
      { name: "기획", en: "PLAN", desc: "범위와 목표를 문장으로 고정합니다." },
      { name: "UX 설계", en: "FLOW", desc: "화면 흐름을 먼저 그립니다. 디자인보다 순서가 먼저입니다." },
      { name: "UI 디자인", en: "DESIGN", desc: "토큰과 컴포넌트로 화면을 조립합니다." },
      { name: "구현", en: "BUILD", desc: "프론트엔드와 백엔드를 구현하고 직접 검증합니다." },
      { name: "배포", en: "LAUNCH", desc: "배포하고, 지표를 보고, 다음 개선 목록을 만듭니다." },
    ],
  },

  philosophy: {
    label: "PHILOSOPHY",
    big: "화려한 화면보다,\n오래 쓰이는 경험을 먼저 만듭니다.",
    cards: [
      {
        en: "Clarity before complexity",
        name: "복잡함보다 명확함",
        desc: "설명이 필요한 화면은 다시 설계합니다.",
      },
      {
        en: "Reliable interfaces",
        name: "신뢰할 수 있는 화면",
        desc: "눌리는 것은 반드시 동작합니다. 예외 상태까지 설계합니다.",
      },
      {
        en: "Designed to scale",
        name: "확장을 전제로 한 구조",
        desc: "기능 하나를 붙일 때 전체를 고치지 않아도 되는 구조.",
      },
      {
        en: "Built with care",
        name: "오래 다듬는 완성도",
        desc: "배포는 끝이 아니라 다듬기의 시작입니다.",
      },
    ],
    cta: "루네르비아를 만든 이유",
  },

  contact: {
    label: "CONTACT",
    title: "프로젝트, 시작합시다.",
    lead: "문의는 Instagram DM이 가장 빠릅니다. 신규 제작, 리뉴얼, 월간 모듈 — 어떤 단계든 좋습니다.",
    channels: [
      { name: "Instagram", handle: "@lunerviasoft", meta: "공식 채널 · DM 문의", href: "https://www.instagram.com/lunerviasoft/" },
      { name: "Instagram", handle: "@_dksrlqor", meta: "대표 직통", href: "https://www.instagram.com/_dksrlqor/" },
      { name: "TikTok", handle: "@_dksrlqor", meta: "비하인드 영상", href: "https://www.tiktok.com/@_dksrlqor" },
      { name: "Email", handle: "준비 중", meta: "곧 열립니다", href: "" },
    ],
    cta: "Instagram으로 문의하기",
  },

  footer: {
    tagline: "달로 가는 길, Lunervia.",
    sub: "아이디어를 작동하는 서비스로 만드는 소프트웨어 스튜디오.",
    explore: "탐색",
    connect: "채널",
    rights: "All rights reserved.",
    top: "맨 위로",
  },

  modulesHub: {
    label: "MODULES",
    title: "월간 모듈",
    lead: "매월 정해진 범위를 맡기는 구독형 개발. 프로젝트가 끝나도 사이트는 계속 나아집니다.",
    included: "포함 범위",
    target: "적합한 대상",
    priceNote: "가격은 상담 후 범위와 함께 확정됩니다. 온라인 결제는 아직 받지 않습니다.",
    recommended: "추천",
    relatedTitle: "문서 상품",
    relatedDesc: "Service Builder Module — 범용 AI를 작업 시스템으로 바꾸는 문서형 모듈.",
    relatedCta: "상품 보기",
  },

  checkout: {
    label: "CHECKOUT",
    title: "상담으로 시작합니다",
    lead: "온라인 결제는 아직 열지 않았습니다. 신청은 Instagram DM으로 받고, 범위를 확인한 뒤 시작합니다.",
    planLabel: "선택한 모듈",
    billingLabel: "결제 주기",
    billingValue: "월간 · 상담 후 확정",
    steps: [
      "Instagram DM으로 모듈 이름을 보내주세요.",
      "현재 사이트/아이디어를 보고 범위와 가격을 확정합니다.",
      "첫 달 작업 목록을 함께 정하고 시작합니다.",
    ],
    cta: "DM으로 신청하기",
    invalidTitle: "선택된 모듈이 없습니다",
    invalidDesc: "모듈 페이지에서 플랜을 선택해 주세요.",
    backToModules: "모듈 보러 가기",
  },

  notFound: {
    code: "404 — FAR SIDE OF THE MOON",
    title: "달 뒤편입니다.",
    desc: "찾는 페이지가 없거나, 주소가 바뀌었습니다.",
    cta: "메인으로 돌아가기",
  },
};

export type Dict = typeof ko;
