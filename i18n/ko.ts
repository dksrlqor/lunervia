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
    ctaBtn: "만든 이유 읽기",
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

  serviceBuilder: {
    eyebrow: "LUNERVIA MODULE · SERIES 01",
    titleLines: ["복붙 프롬프트가 아니라,", "AI를 위한 **작업 시스템**."],
    sub: "ChatGPT·Claude·Gemini·Cursor에 끼우면 누가 써도 일정한 품질의 서비스 진단이 나옵니다. 초보자는 빈칸만 채우면 됩니다.",
    ctaSample: "예시 결과 보기",
    ctaGet: "패키지 받기",
    chips: ["ChatGPT", "Claude", "Gemini", "Cursor", "모바일"],
    problem: {
      label: "PROBLEM",
      title: "AI는 똑똑한데, 결과가 매번 달라집니다.",
      lead: "필요한 건 잘 쓴 한 문장이 아니라, 같은 품질을 반복해서 뽑아내는 작업 흐름입니다.",
      cards: [
        { t: "매번 새로 짠다", d: "물어볼 때마다 프롬프트를 처음부터 다시 짜야 합니다." },
        { t: "품질이 들쭉날쭉", d: "같은 질문도 답의 깊이와 형식이 매번 달라집니다." },
        { t: "우선순위가 없다", d: "“그래서 뭘 먼저 고치라는 거지?”가 정리되지 않습니다." },
        { t: "개발로 못 넘긴다", d: "진단을 실제 개발 작업으로 넘기기가 막막합니다." },
      ],
    },
    solution: {
      label: "SOLUTION",
      title: "분석 → 판단 → 출력 → 검수, 한 흐름으로.",
      lead: "서비스 진단을 네 단계의 고정된 작업 흐름으로 묶었습니다. 누가 돌려도 같은 구조의 결과가 나옵니다.",
      steps: [
        { name: "분석", desc: "서비스의 목적과 사용자를 먼저 분석합니다." },
        { name: "판단", desc: "핵심 문제 3~5개를 근거와 우선순위로 정렬합니다." },
        { name: "출력", desc: "디자인·문구·기능·모바일 UX 개선안을 고정 형식으로 정리합니다." },
        { name: "검수", desc: "12항목 루브릭으로 결과의 품질을 채점합니다." },
      ],
    },
    sample: {
      label: "SAMPLE OUTPUT",
      title: "샘플 진단 결과",
      intro: "예시 입력: “동네 베이커리 픽업 예약 웹앱(모바일 위주, 1인 운영).” 아래는 모듈이 실제로 내놓는 출력 형식입니다.",
      blocks: [
        {
          t: "1 · 분석",
          d: "목적은 ‘예약 픽업 전환’, 주 사용자는 모바일로 빠르게 주문하는 단골. 핵심 동선은 메뉴 → 시간 선택 → 결제 확인입니다.",
          lines: [],
        },
        {
          t: "2 · 판단 (우선순위 문제)",
          d: "",
          lines: [
            "[높음] 픽업 시간 선택이 3단계라 이탈이 큼 — 한 화면 슬롯 선택으로 단축.",
            "[높음] 가격·재고가 결제 직전에야 노출 — 목록 단계에서 미리 표시.",
            "[중간] CTA 문구가 ‘확인’으로 모호 — ‘이 시간에 픽업 예약’으로 구체화.",
          ],
        },
        {
          t: "3 · 출력 (개선안 · 고정 형식)",
          d: "문제별로 「현상 → 개선안 → 기대효과 → 작업 난이도」를 한 줄로 정리해, 바로 작업 목록으로 옮길 수 있게 합니다.",
          lines: [],
        },
        {
          t: "4 · 검수 (12항목 루브릭)",
          d: "명확성·우선순위·실행 가능성 등 12항목을 5점 척도로 채점. 예시 결과: 평균 4.1 / 5, 보완 필요 항목 2개를 함께 표시합니다.",
          lines: [],
        },
      ],
      note: "실제 결과는 입력 내용과 AI 모델·버전에 따라 달라집니다. 1차 판단이며 사람 검토를 전제로 합니다.",
    },
    inside: {
      label: "WHAT'S INSIDE",
      title: "패키지 안에 담긴 것",
      lead: "앱이나 로그인이 아니라, 복붙해서 바로 쓰는 문서형 패키지(zip·노션)입니다.",
      items: [
        { t: "핵심 모듈 본체", d: "모든 AI에 공통으로 쓰는 작업 시스템 본체." },
        { t: "플랫폼별 프롬프트", d: "ChatGPT · Claude · Gemini · Cursor · 모바일 각각의 버전." },
        { t: "입력·출력 템플릿", d: "입력 템플릿 6종 / 출력 템플릿 6종." },
        { t: "검수 루브릭 12항목", d: "결과를 스스로 점수로 채점하는 체크 기준." },
        { t: "개발 연결 프롬프트", d: "진단 결과를 Cursor 작업지시로 바로 넘깁니다." },
        { t: "사용법 & 성능 개선 가이드", d: "처음 쓰는 사람도 따라 할 수 있는 사용 가이드." },
        { t: "안전·한계 가이드", d: "어디까지 믿고, 무엇을 사람이 확인할지 정리." },
        { t: "예시 입출력 3종", d: "실제로 어떻게 나오는지 보여주는 샘플." },
      ],
    },
    audience: {
      label: "FOR WHOM",
      title: "이런 분들께 맞습니다",
      items: [
        "1인 창업자 · 인디 개발자",
        "학생 · 예비 창업자",
        "소규모 팀 · 스타트업",
        "프리랜서 · 마케터",
        "개발자",
      ],
    },
    compare: {
      label: "DIFFERENCE",
      title: "무료 프롬프트와 무엇이 다른가요?",
      colHead: "구분",
      colFree: "무료 프롬프트",
      colMod: "Service Builder Module",
      rows: [
        { name: "형태", free: "문장 한두 개", mod: "분석·판단·출력·검수 작업 시스템" },
        { name: "결과 일관성", free: "매번 다름", mod: "고정된 출력 구조" },
        { name: "깊이", free: "단편적인 답", mod: "우선순위·작업지시·QA까지 연결" },
        { name: "환경", free: "보통 한 곳", mod: "ChatGPT·Claude·Gemini·Cursor·모바일" },
        { name: "품질 점검", free: "없음", mod: "12항목 루브릭 포함" },
      ],
    },
    pricing: {
      label: "PRICING",
      title: "한 번 받으면 계속 쓰는 패키지",
      lead: "기존 AI를 더 잘 쓰게 만드는 전문화 레이어입니다. 전문가를 고용하기 전, 저비용으로 1차 결과물을 만들어 보세요.",
      badge: "추천",
      note: "정식 결제 페이지는 준비 중입니다. 지금은 먼저 사용해보실 수 있도록 Instagram 문의 → 계좌이체로 패키지를 보내드립니다.",
      plans: [
        {
          id: "starter",
          name: "Starter",
          tag: "개인용 · AI 입문 개인·학생",
          price: "₩14,900",
          features: ["핵심 모듈 본체", "주요 플랫폼 프롬프트", "기본 템플릿 · 예시"],
          cta: "Starter 받기",
        },
        {
          id: "pro",
          name: "Pro",
          tag: "개인/팀용 · 실무자·소규모 팀",
          price: "₩39,000",
          features: [
            "전체 입력·출력 템플릿",
            "검수 루브릭 12항목",
            "개발 연결 프롬프트",
            "전체 예시 입출력",
          ],
          cta: "Pro 받기",
        },
        {
          id: "custom",
          name: "Custom",
          tag: "기업 맞춤형",
          price: "별도 문의",
          features: ["자사 도메인·브랜드 톤 맞춤", "커스터마이징", "도입 지원"],
          cta: "문의하기",
        },
      ],
    },
    notice: {
      label: "BEFORE YOU BUY",
      title: "구매 전, 솔직하게 알려드립니다",
      items: [
        "ChatGPT·Claude·Gemini 등 범용 AI 위에서 작동하는 전문화 레이어입니다. (AI 자체는 포함되지 않습니다.)",
        "앱이나 로그인이 아니라, 복붙해서 쓰는 문서형 패키지입니다.",
        "AI 결과는 1차 결과물이며, 중요한 결정은 사람이 검토해야 합니다.",
        "법률·의료·투자·보안 판단은 반드시 전문가 확인이 필요합니다.",
        "개인정보·API 키·비밀번호는 절대 입력하지 마세요.",
      ],
    },
    faq: {
      label: "FAQ",
      title: "자주 묻는 질문",
      items: [
        {
          q: "그냥 프롬프트 모음 아닌가요?",
          a: "아닙니다. 분석·판단·출력·검수가 하나로 묶인 작업 시스템이고, 출력 형식이 고정돼 누가 써도 일정한 품질이 나오며, 결과를 점수로 채점하는 루브릭까지 포함됩니다.",
        },
        {
          q: "어떤 AI에서 쓰나요?",
          a: "ChatGPT·Claude·Gemini·Cursor·모바일 ChatGPT 각각의 버전이 들어 있습니다.",
        },
        { q: "AI를 잘 몰라도 되나요?", a: "네. 입력 템플릿의 빈칸만 채워서 보내면 됩니다." },
        {
          q: "결과가 항상 정확한가요?",
          a: "1차 판단입니다. 모델·버전에 따라 달라질 수 있어, 사람 검토를 전제로 설계했습니다.",
        },
        {
          q: "전문가가 필요 없어지나요?",
          a: "아닙니다. 전문가를 고용하기 전, 저비용으로 1차 결과물을 만드는 도구입니다.",
        },
        {
          q: "환불되나요?",
          a: "디지털 콘텐츠 특성상, 판매 채널 정책과 관련 법령을 따릅니다.",
        },
      ],
    },
    buy: {
      label: "GET THE MODULE",
      title: "받는 방법",
      body: "정식 결제 페이지는 준비 중이라, 지금은 자동 다운로드를 제공하지 않습니다. 먼저 사용해보고 싶다면 Instagram DM으로 문의 주세요. 확인 후 계좌이체로 패키지(zip·노션)를 보내드립니다.",
      steps: [
        "Instagram DM으로 원하는 플랜을 알려주세요.",
        "플랜 확인 후 계좌이체를 안내해 드립니다.",
        "입금 확인 후 패키지(zip·노션)를 보내드립니다.",
      ],
      note: "개인정보·API 키·비밀번호는 보내지 마세요. 디지털 콘텐츠 특성상 환불은 판매 채널 정책과 관련 법령을 따릅니다.",
      cta: "Instagram DM으로 문의",
    },
    final: { title: "좋은 프롬프트 찾기를 끝내고,\n일정한 결과를 뽑으세요." },
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
