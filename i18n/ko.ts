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
    work: "작업",
    coena: "Coena",
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

  coena: {
    eyebrow: "COENA · 코이나 — LIVING LAYER R&D",
    title: "AI 위에 얹는, 살아있는 계층",
    body: "AI는 가끔 그럴듯한 오답을 내놓습니다. 코이나는 그 결과를 그대로 믿지 않는 엔진입니다. 한 번 더 확인하고, 틀린 건 다시 만들고, 확인이 끝난 것만 내보냅니다. 생물이 스스로를 회복하는 방식을 소프트웨어에 옮겨보고 있습니다.",
    /* 모프 밴드 — 코이나의 실제 파이프라인 순서(검증→회복→기억→내보냄) */
    gooey: ["검증하고", "회복하고", "기억하고", "내보낸다"],
    gooeySr: "코이나는 검증하고, 회복하고, 기억하고 — 확인이 끝난 것만 내보냅니다.",
    features: [
      { tag: "self.heal()", desc: "오류가 나면 원인을 찾아 스스로 다시 시도합니다" },
      { tag: "self.verify()", desc: "내보내기 전에 빠뜨린 내용이 없는지 스스로 대조합니다" },
      { tag: "failure.memory", desc: "실패한 이유를 기억해 같은 실수를 반복하지 않습니다" },
    ],
    status: "지금 v0.1을 만들고 있습니다",
    ctaPrototype: "시제품 열기",
    ctaNotes: "기술 노트",
    /* TODO(가격·결제): 실제 가격 확정·결제 연동 시 price/billing/cta 교체.
       그 전까지는 확인된 사실만 — 결제되는 것처럼 보이게 하지 않는다. */
    pricing: {
      label: "PRICING",
      title: "코이나를 만나는 세 가지 방법",
      lead: "아직 만드는 중입니다. 그래서 약속할 수 있는 것만 적어 두었습니다 — 가격은 정식 출시 때 공개합니다.",
      tiers: [
        {
          id: "preview",
          tag: "v0.1 — PREVIEW",
          name: "Preview",
          desc: "공개 시제품. 코이나의 검증 루프를 가장 먼저 써 봅니다.",
          price: "무료",
          billing: "공개 시점부터",
          features: [
            "self.verify() 검증 루프 체험",
            "공개 시제품 접근",
            "출시 소식 우선 안내",
          ],
          cta: "출시 알림 받기",
          badge: "",
          highlighted: false,
        },
        {
          id: "standard",
          tag: "v1.0 — STANDARD",
          name: "Standard",
          desc: "정식 버전. 혼자서도, 팀으로도 쓰는 플랜.",
          price: "가격 미정",
          billing: "출시 때 공개",
          features: [
            "self.heal() 자기 회복",
            "self.verify() 자기 검증",
            "failure.memory 실패 기억",
          ],
          cta: "출시 알림 받기",
          badge: "",
          highlighted: false,
        },
        {
          id: "studio",
          tag: "NOW — STUDIO",
          name: "Studio",
          desc: "Lunervia가 만드는 프로젝트에 코이나 파이프라인을 함께 설계합니다.",
          price: "별도 문의",
          billing: "프로젝트 단위",
          features: [
            "프로젝트 맞춤 검증 설계",
            "구현·배포까지 스튜디오가 직접",
            "대표 직통 소통",
          ],
          cta: "프로젝트 문의",
          badge: "지금 가능",
          highlighted: true,
        },
      ],
    },
  },

  contact: {
    label: "CONTACT",
    title: "프로젝트, 시작합시다.",
    lead: "문의는 Instagram DM이 가장 빠릅니다. 신규 제작, 리뉴얼, 협업 — 어떤 단계든 좋습니다.",
    channels: [
      { name: "Instagram", handle: "@lunerviasoft", meta: "공식 채널 · DM 문의", href: "https://www.instagram.com/lunerviasoft/" },
      { name: "Instagram", handle: "@4ever2short", meta: "대표 직통", href: "https://www.instagram.com/4ever2short/" },
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

  workPage: {
    label: "WORK",
    title: "증명은 배포로 합니다.",
    lead: "운영 중인 서비스, 실험, 클라이언트 작업 — 전부 실제입니다.",
    badajwo: {
      status: "운영 중 · takemyletter.site",
      name: "받아줘 — Take My Letter",
      desc: "익명 손편지를 받는 픽셀 감성 편지함. 내 편지함 링크를 인스타 스토리에 올리면 누구나 익명 또는 이름으로 편지를 보냅니다. 기획, 디자인, 프론트엔드, 백엔드까지 전부 Lunervia가 직접 만들어 운영합니다.",
      stackLabel: "STACK",
      stack: ["React 18", "Vite", "Tailwind CSS", "Supabase", "Framer Motion"],
      featuresLabel: "만든 것들",
      features: [
        "익명 편지함 — 링크 하나로 받는 손편지",
        "24시간 일회성 편지 링크",
        "편지지 템플릿 4종 (픽셀·로맨틱·빈티지·포토프레임)",
        "인스타 스토리 공유 이미지 자동 생성",
        "레코드 플레이어 BGM",
        "관리자 대시보드와 신고 처리",
      ],
      role: "기획 · UX · 프론트엔드 · 백엔드",
      cta: "서비스 열기",
      petHint: "고양이를 쓰다듬어 보세요",
    },
    cards: [
      { tag: "LAB", name: "Lunervia Lab", status: "준비 중", desc: "서비스 실험, UI 연구, 프로토타입." },
      {
        tag: "PARTNER",
        name: "Todak Life",
        status: "채널",
        desc: "앱 제작 과정과 기록을 영상으로 공유하는 크리에이터 채널.",
      },
    ],
  },

  why: {
    eyebrow: "WHY LUNERVIA",
    heroLines: ["왜 만들었는지,", "여기 **적어** 둡니다."],
    heroSub:
      "루네르비아라는 이름 아래에서 화면을 만드는 사람이 직접 쓴, 조금 긴 글입니다. 5분이면 읽습니다.",
    readCta: "만든 이유 읽기",
    storyLabel: "THE STORY",
    chapters: [
      {
        no: "01",
        title: "이름에 대하여",
        paragraphs: [
          "루네르비아(Lunervia)는 '달로 가는 길'이라는 뜻을 담아 지은 이름입니다. 라틴어로 달을 뜻하는 luna에서 출발했습니다. 거창한 철학을 담으려던 것은 아닙니다. 다만, 방향이 필요했습니다.",
          "달은 도착점이라기보다 기준점에 가깝습니다. 밤길을 걷는 사람이 달을 보고 방향을 잡듯, 무언가를 만들 때마다 돌아와서 확인할 수 있는 기준이 하나 있었으면 했습니다. 그 기준을 아예 이름에 박아 두면, 흔들릴 때마다 이름이 저를 다시 붙잡아 줄 것 같았습니다.",
          "그래서 루네르비아의 기준은 처음부터 하나였습니다. 화면을 만드는 것이 아니라, 작동하는 서비스를 만든다는 것.",
        ],
      },
      {
        no: "02",
        title: "시작에 대하여",
        paragraphs: [
          "처음부터 스튜디오를 하려던 것은 아니었습니다. 서비스 하나를 처음부터 끝까지 제 손으로 만들어 보고 싶었을 뿐입니다. 기획서에서 멈추는 아이디어, 시안으로만 남는 화면, '나중에 꼭 만들어야지'로 끝나는 이야기를 너무 많이 봤고, 그게 매번 아까웠습니다.",
          "그래서 직접 만들었습니다. 익명 손편지 서비스 '받아줘'는 그렇게 나왔습니다. 기획, 디자인, 프론트엔드, 백엔드, 배포까지 전 과정을 한 손으로 지나 보니, 기획서 백 장이 가르쳐 주지 않던 것들을 알게 됐습니다.",
          "버튼의 색보다, 그 버튼이 실패했을 때 무엇을 보여줄지가 사용자를 더 오래 붙잡습니다. 만들어서 배포하고, 실제 사용자가 쓰는 모습을 지켜보는 일 — 그 반복이 루네르비아의 전부입니다.",
        ],
      },
      {
        no: "03",
        title: "일하는 방식에 대하여",
        paragraphs: [
          "루네르비아는 큰 조직이 아닙니다. 그래서 큰 조직이 하기 어려운 방식으로 일할 수 있습니다. 기획한 사람이 설계하고, 설계한 사람이 구현하고, 구현한 사람이 배포된 화면을 끝까지 지켜봅니다. 사람과 사람 사이를 건너는 동안 의도가 증발하는 일이 없습니다.",
          "담백한 화면을 고집하는 이유도 같은 자리에서 나옵니다. 화려하게 만들 줄 몰라서가 아니라, 지우는 쪽이 훨씬 어렵기 때문입니다. 설명이 필요한 화면은 다시 설계합니다. 눌리는 것은 반드시 동작하게 만듭니다. 잘 되는 순간만이 아니라 실패하고, 비어 있고, 기다리는 순간까지 그린 다음에야 배포합니다.",
          "그리고 배포한 날은 완성한 날이 아니라 다듬기를 시작하는 날입니다. 지표를 보고, 고치고, 다시 배포합니다. 오래 쓰이는 서비스가 한 번에 완성되는 것을 본 적이 없기 때문입니다.",
        ],
      },
      {
        no: "04",
        title: "앞으로에 대하여",
        paragraphs: [
          "루네르비아가 바라는 장면은 단순합니다. '이런 게 있으면 좋겠는데'라고 생각만 하던 사람이, 주소를 치면 열리는 진짜 서비스를 손에 쥐는 장면입니다.",
          "생각은 화면 몇 장으로 끝나면 안 됩니다. 주소가 있고, 접속이 되고, 눌렀을 때 동작해야 합니다. 루네르비아는 그 마지막 단계까지 함께 가는 곳이고 싶습니다. 만들어 드리고 끝나는 곳이 아니라, 서비스가 켜져 있는 동안 계속 다듬는 곳.",
          "여기까지 읽으셨다면, 아마 마음속에 만들고 싶은 무언가가 하나쯤 있을 겁니다. 그 생각을 들려주세요. 현실로 만들어 드리겠습니다.",
        ],
      },
    ],
    quote1: "서비스는 화면의 합이 아니라,\n**결정**의 합입니다.",
    quote2: "배포는 끝이 아니라,\n**다듬기**의 시작입니다.",
    sign: "Lunervia — 생각을 현실로 만드는 소프트웨어 스튜디오",
    ctaContact: "프로젝트 문의하기",
    ctaWork: "작업 보기",
  },

  notFound: {
    code: "404 — FAR SIDE OF THE MOON",
    title: "달 뒤편입니다.",
    desc: "찾는 페이지가 없거나, 주소가 바뀌었습니다.",
    cta: "메인으로 돌아가기",
  },
};

export type Dict = typeof ko;
