/* ============================================================
   LUNERVIA — quiet software brand site
   ------------------------------------------------------------
   기능 모듈
   1. 브랜드 로고 클릭 → 부드럽게 상단으로
   2. 이미지 폴백 (로고/제품/파트너) — 로드 성공 시 표시
   3. 모바일 네비게이션 토글 + 외부 클릭/ESC 로 닫힘
   4. 앵커 클릭 시 부드럽게 스크롤 + 메뉴 닫힘
   5. Hero 터미널 창 안 타이핑 사이클 (첫 문구 = '안녕하세요!')
   6. IntersectionObserver 기반 reveal (스태거 포함)
   7. 스크롤 진행률 바 갱신
   8. KO / EN 언어 토글 + localStorage 영속화 (data-i18n / data-i18n-html)
   9. Why Lunervia 내부 오버레이 — 새 탭이 아니라 사이트 안 스토리룸
      - data-open-why 로 열고, data-close-why / Esc / 배경 클릭으로 닫음
      - 열려 있을 때 body 스크롤 잠금 + 포커스 트랩
   ============================================================ */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- 1. 브랜드 로고 클릭 → 맨 위로 ----------------------------- */
  const brandLink = $("#brand-link");
  if (brandLink) {
    brandLink.addEventListener("click", (event) => {
      event.preventDefault();
      closeWhyOverlay();
      closeMobileMenu();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* -------- 2. 이미지 폴백 ----------------------------------------- */
  const wireImageFallback = (img, onSuccess, onFail) => {
    if (!img) return;
    const handleLoad = () => {
      img.hidden = false;
      if (typeof onSuccess === "function") onSuccess();
    };
    const handleError = () => {
      img.hidden = true;
      if (typeof onFail === "function") onFail();
    };

    if (img.complete) {
      if (img.naturalWidth > 0) handleLoad();
      else handleError();
      return;
    }
    img.addEventListener("load", handleLoad, { once: true });
    img.addEventListener("error", handleError, { once: true });
  };

  // 헤더 워드마크 (이미지가 있으면 텍스트 숨김)
  const brandLogo = $(".brand-logo");
  const brandImg = $(".brand-img");
  const brandText = $(".brand-text");
  wireImageFallback(
    brandImg,
    () => {
      if (brandLogo) brandLogo.hidden = false;
      if (brandText) brandText.hidden = true;
    },
    () => {
      if (brandLogo) brandLogo.hidden = true;
      if (brandText) brandText.hidden = false;
    }
  );

  // 푸터 워드마크
  const footerBrandImg = $(".footer-brand-img");
  const footerBrandText = $(".footer-brand-text");
  wireImageFallback(
    footerBrandImg,
    () => { if (footerBrandText) footerBrandText.hidden = true; },
    () => { if (footerBrandText) footerBrandText.hidden = false; }
  );

  // 제품 이미지
  $$(".product-card").forEach((card) => {
    const img = card.querySelector(".product-img");
    const placeholder = card.querySelector(".media-placeholder");
    wireImageFallback(
      img,
      () => { if (placeholder) placeholder.style.display = "none"; },
      () => { if (placeholder) placeholder.style.display = ""; }
    );
  });

  // 파트너 이미지
  $$(".partner-card").forEach((card) => {
    const img = card.querySelector(".partner-img");
    const placeholder = card.querySelector(".media-placeholder");
    wireImageFallback(
      img,
      () => { if (placeholder) placeholder.style.display = "none"; },
      () => { if (placeholder) placeholder.style.display = ""; }
    );
  });

  /* -------- 3. 모바일 메뉴 토글 ----------------------------------- */
  const navToggle = $(".nav-toggle");
  const navMenu = $(".nav-menu");

  function closeMobileMenu() {
    if (!navMenu || !navToggle) return;
    if (!navMenu.classList.contains("is-open")) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("is-open")) return;
      if (event.target.closest(".nav-inner")) return;
      closeMobileMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  /* -------- 4. 앵커 링크 — 메뉴 닫고 부드럽게 스크롤 ---------------- */
  $$('.nav-menu a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => closeMobileMenu());
  });

  /* -------- 5. Hero 터미널 타이핑 사이클 -------------------------- */
  const phrases = [
    "안녕하세요!",
    "Lunervia builds emotional software.",
    "작은 아이디어를 서비스로 만듭니다.",
    "We design warm digital experiences.",
    "오늘의 감정을 기술로 연결합니다.",
    "Somewhere, something meaningful begins.",
  ];

  const typedEl = document.getElementById("typed");

  const TYPE_SPEED = 70;
  const DELETE_SPEED = 34;
  const PAUSE_AFTER_TYPE = 1700;
  const PAUSE_BEFORE_NEXT = 360;

  function startTypingLoop() {
    if (!typedEl) return;

    if (prefersReducedMotion) {
      // 모션 줄이기 환경에서는 첫 문구만 정적으로 표시
      typedEl.textContent = phrases[0];
      return;
    }

    let phraseIdx = 0;
    let charIdx = phrases[0].length; // HTML 안에 첫 문구가 미리 들어 있음
    let isDeleting = false;
    let initialHold = 1400;

    const tick = () => {
      const phrase = phrases[phraseIdx];

      if (!isDeleting && charIdx < phrase.length) {
        charIdx += 1;
        typedEl.textContent = phrase.slice(0, charIdx);
        window.setTimeout(tick, TYPE_SPEED);
        return;
      }

      if (!isDeleting && charIdx === phrase.length) {
        isDeleting = true;
        window.setTimeout(tick, initialHold || PAUSE_AFTER_TYPE);
        initialHold = 0;
        return;
      }

      if (isDeleting && charIdx > 0) {
        charIdx -= 1;
        typedEl.textContent = phrase.slice(0, charIdx);
        window.setTimeout(tick, DELETE_SPEED);
        return;
      }

      // 다음 문구로
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      window.setTimeout(tick, PAUSE_BEFORE_NEXT);
    };

    tick();
  }

  startTypingLoop();

  /* -------- 6. IntersectionObserver reveal ------------------------ */
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* -------- 7. 스크롤 진행률 바 ----------------------------------- */
  const progressFill = $("#scroll-progress-fill");
  if (progressFill) {
    let ticking = false;
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollMax = (doc.scrollHeight || 0) - window.innerHeight;
      const ratio = scrollMax > 0 ? Math.min(Math.max(scrollTop / scrollMax, 0), 1) : 0;
      progressFill.style.width = `${ratio * 100}%`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateProgress();
  }

  /* -------- 8. KO / EN 언어 토글 ---------------------------------- */
  /*
     UI 문구는 모두 data-i18n / data-i18n-html 로 표시.
     번역 키는 ko 기준 + en 매핑.
     localStorage 키: 'lunervia-lang'.
  */
  const I18N = {
    ko: {
      "nav.about": "소개",
      "nav.products": "제품",
      "nav.partners": "협력",
      "nav.philosophy": "철학",
      "nav.contact": "문의",
      "nav.sns": "SNS",
      "nav.why": "루네르비아를 만든 이유",

      "back.toMain": "메인으로",
      "back.toMainLong": "메인으로 돌아가기",

      "hero.eyebrow": "Welcome to Lunervia",
      "hero.title": "감정과 기술 사이에,<br />루네르비아가 있습니다.",
      "hero.sub": "따뜻한 디지털 경험을 만드는 작은 소프트웨어 브랜드입니다.",
      "hero.cta.products": "제품 보기",
      "hero.cta.contact": "문의하기",

      "about.label": "About",
      "about.title": "작지만 진지한 소프트웨어 브랜드",
      "about.lead":
        "루네르비아는 사람의 감정과 고민을 기술로 더 따뜻하게 연결하는 작은 소프트웨어 브랜드입니다. 웹과 모바일을 가리지 않고, 사용자가 오래 기억할 수 있는 작은 경험을 차분히 쌓아갑니다.",
      "about.focusLabel": "Focus",
      "about.focusValue": "감성 소프트웨어 · 웹앱 · 모바일",
      "about.stageValue": "조용히 성장 중",

      "philosophy.label": "Philosophy",
      "philosophy.title": "Brand Manifesto",
      "philosophy.big":
        "우리는 기술이 사람을 더 차갑게 만들지 않도록, 감정이 머물 수 있는 디지털 공간을 만듭니다.",
      "philosophy.card1": "시끄러운 기능보다 오래 남는 따뜻함을 선택합니다.",
      "philosophy.card2": "작은 문장, 작은 버튼, 작은 경험도 누군가의 하루를 바꿀 수 있다고 믿습니다.",
      "philosophy.card3": "사람의 감정이 느껴지는 소프트웨어를 만들고자 합니다.",
      "philosophy.cta": "루네르비아를 만든 이유 자세히 읽기",

      "products.label": "Products",
      "products.title": "지금 만들고 있는 것",
      "products.lead":
        "아직 출시 전이지만, 마음과 마음 사이를 잇는 작은 소프트웨어를 차분히 다듬고 있습니다.",
      "product.tagline": "익명의 마음이 거리와 언어를 넘어 누군가에게 닿습니다.",
      "product.desc":
        "Night Letter 는 익명의 감정과 고민이 편지처럼 흐르는 글로벌 감성 서비스입니다. 사용자는 자신의 마음을 조용히 남기고, 어딘가의 다른 사용자가 그 편지를 펼쳐 읽고 따뜻한 답장을 보냅니다. 말이 달라도 마음이 닿을 수 있다는 믿음에서 시작한 프로젝트입니다.",

      "partners.label": "Partners",
      "partners.title": "함께하는 곳",
      "partners.lead":
        "루네르비아는 일상의 작은 순간을 소중히 다루는 동료 브랜드들과 함께 자랍니다.",
      "partners.name": "작은 어항 속 일상을 기록하는 다이어리",
      "partners.desc":
        "토닥 어항일기는 사용자가 자신의 어항과 작은 일상을 기록할 수 있도록 돕는 따뜻한 다이어리 서비스입니다. 루네르비아는 이런 섬세한 기록의 가치를 존중하며, 서로의 서비스가 더 좋은 사용자 경험을 만들 수 있도록 함께 고민합니다.",

      "contact.label": "Contact",
      "contact.title": "문의하기",
      "contact.lead":
        "함께 만들고 싶은 아이디어가 있다면 편하게 연락해 주세요. Instagram 메시지를 가장 빠르게 확인합니다.",
      "contact.official.label": "Official Instagram",
      "contact.official.meta": "Lunervia 공식 채널 — 브랜드 소식과 협업 문의",
      "contact.personal.label": "Personal Instagram",
      "contact.personal.meta": "개인 계정 — 작업 기록과 일상",
      "contact.tiktok.label": "TikTok",
      "contact.tiktok.meta": "TikTok 영상 채널 — 짧은 작업 기록과 일상",
      "contact.email.label": "Email",
      "contact.email.handle": "coming soon",
      "contact.email.meta": "이메일 채널은 곧 열립니다",
      "contact.cta": "메시지 보내기 <span aria-hidden=\"true\">↗</span>",

      "sns.eyebrow": "Find Lunervia on",
      "sns.title": "소셜 채널을<br />한 자리에서.",
      "sns.lead": "루네르비아의 작업 기록과 일상은 인스타그램과 틱톡에 짧게 흐릅니다. 가장 빠른 답장은 Instagram DM 입니다.",
      "sns.official": "Official",
      "sns.personal": "Personal",
      "sns.video": "Video",
      "sns.soon": "Soon",
      "sns.follow": "팔로우하기",
      "sns.watch": "영상 보러가기",
      "sns.officialMeta": "Lunervia 공식 채널 — 브랜드 소식과 협업 문의는 여기서.",
      "sns.personalMeta": "개인 계정 — 작업 기록과 일상이 천천히 쌓입니다.",
      "sns.tiktokMeta": "짧은 작업 기록과 일상의 순간들 — 영상으로 가볍게.",
      "sns.emailHandle": "coming soon",
      "sns.emailMeta": "이메일 채널은 곧 열립니다. 그동안은 Instagram DM 으로 부탁드립니다.",

      "footer.explore": "Explore",
      "footer.connect": "Connect",
      "footer.emailSoon": "Email · coming soon",
      "footer.snsAll": "모든 SNS 모아보기 ↗",
      "footer.tagline":
        "조용한 아이디어와 세심한 소프트웨어로 만들어갑니다.<br />감정과 기술 사이에서, 오래 남는 제품을 만듭니다.",
      "footer.built": "Built with warmth.",
      "footer.top": "맨 위로 ↑",
      "footer.toMain": "메인으로 ↑",

      "why.eyebrow": "Why Lunervia",
      "why.title": "루네르비아를 만든 이유",
      "why.intro": "루네르비아는 거창한 기술보다, 사람에게 오래 남는 작은 경험을 믿습니다.",
      "why.body.p1": "루네르비아는 단순히 웹사이트나 앱을 만드는 이름이 아닙니다.",
      "why.body.p2":
        "사람이 하루를 살아가며 마주하는 감정, 외로움, 고민, 기대, 설렘 같은 것들을 기술로 더 따뜻하게 다루기 위해 시작한 브랜드입니다.",
      "why.body.p3":
        "우리는 차가운 기능만 만드는 것이 아니라, 사용자가 오래 기억할 수 있는 경험을 만들고 싶습니다. 누군가에게는 작은 버튼 하나, 짧은 문장 하나, 부드러운 화면 전환 하나가 위로가 될 수 있다고 믿습니다.",
      "why.emphasis": "기술은 차가울 수 있지만, 그것을 설계하는 마음은 따뜻할 수 있다고 믿습니다.",
      "why.body.p4": "우리는 누군가의 하루를 아주 조금 더 가볍게 만들 수 있는 소프트웨어를 만들고 싶습니다.",
      "why.body.p5": "루네르비아는 그런 작은 경험들을 모아, 사람에게 닿는 소프트웨어를 만들어가고자 합니다.",
      "why.body.en": "Lunervia builds software that feels less like a machine, and more like a quiet hand on your shoulder.",
      "why.partners.title": "함께 만드는 사람들",
      "why.partners.intro": "루네르비아는 작지만 진심을 담는 동료 브랜드와 함께 자라고 있습니다.",
      "why.partners.todak":
        "토닥 어항일기는 사용자가 자신의 어항과 작은 일상을 기록할 수 있도록 돕는 따뜻한 다이어리 서비스입니다. 루네르비아는 이런 섬세한 기록의 가치를 존중하며, 서로의 서비스가 더 좋은 사용자 경험을 만들 수 있도록 함께 고민합니다.",
      "why.close": "메인으로 돌아가기",
    },
    en: {
      "nav.about": "About",
      "nav.products": "Products",
      "nav.partners": "Partners",
      "nav.philosophy": "Philosophy",
      "nav.contact": "Contact",
      "nav.sns": "SNS",
      "nav.why": "Why Lunervia",

      "back.toMain": "Back to main",
      "back.toMainLong": "Back to main page",

      "hero.eyebrow": "Welcome to Lunervia",
      "hero.title": "Between emotion and technology,<br />Lunervia quietly stands.",
      "hero.sub": "A small software brand crafting warm digital experiences.",
      "hero.cta.products": "See products",
      "hero.cta.contact": "Get in touch",

      "about.label": "About",
      "about.title": "A small, sincere software studio",
      "about.lead":
        "Lunervia is a small software brand that connects people's emotions and concerns through technology — gently. Across web and mobile, we build small experiences worth remembering.",
      "about.focusLabel": "Focus",
      "about.focusValue": "Emotional software · Web · Mobile",
      "about.stageValue": "Quietly growing",

      "philosophy.label": "Philosophy",
      "philosophy.title": "Brand Manifesto",
      "philosophy.big":
        "We design digital spaces where emotion can rest — so that technology never makes people feel colder.",
      "philosophy.card1": "We choose lingering warmth over louder features.",
      "philosophy.card2": "A small sentence, a small button, a small moment can change someone's day.",
      "philosophy.card3": "We build software that carries a human pulse.",
      "philosophy.cta": "Read why we built Lunervia",

      "products.label": "Products",
      "products.title": "What we're building now",
      "products.lead":
        "Not yet launched — we are quietly shaping software that connects one heart to another.",
      "product.tagline": "Anonymous feelings, crossing distance and language to reach someone.",
      "product.desc":
        "Night Letter is a global emotional service where anonymous feelings flow like letters. People leave their quiet thoughts, and somewhere else, another person opens that letter and writes a warm reply. It is built on the belief that hearts can meet even when languages don't.",

      "partners.label": "Partners",
      "partners.title": "Brands we grow with",
      "partners.lead":
        "Lunervia grows alongside small, careful brands that cherish the quiet moments of daily life.",
      "partners.name": "A diary for the small life inside a fish tank",
      "partners.desc":
        "Todak Aquarium Diary helps people record their aquarium and daily moments with care. Lunervia values that kind of attentive record, and we shape ideas together so each service can become a softer experience for its users.",

      "contact.label": "Contact",
      "contact.title": "Get in touch",
      "contact.lead":
        "If there is an idea you would like to build together, please reach out. Instagram messages are checked the fastest.",
      "contact.official.label": "Official Instagram",
      "contact.official.meta": "Lunervia's official channel — news and collaboration.",
      "contact.personal.label": "Personal Instagram",
      "contact.personal.meta": "Personal account — process notes and daily life.",
      "contact.tiktok.label": "TikTok",
      "contact.tiktok.meta": "Short clips of process and daily moments.",
      "contact.email.label": "Email",
      "contact.email.handle": "coming soon",
      "contact.email.meta": "An email channel will open soon.",
      "contact.cta": "Send a message <span aria-hidden=\"true\">↗</span>",

      "sns.eyebrow": "Find Lunervia on",
      "sns.title": "All our social<br />channels, in one place.",
      "sns.lead": "Lunervia's process and daily moments live on Instagram and TikTok. The fastest reply comes through Instagram DM.",
      "sns.official": "Official",
      "sns.personal": "Personal",
      "sns.video": "Video",
      "sns.soon": "Soon",
      "sns.follow": "Follow",
      "sns.watch": "Watch videos",
      "sns.officialMeta": "Lunervia's official channel — news and collaboration enquiries.",
      "sns.personalMeta": "Personal account — process notes and quiet daily moments.",
      "sns.tiktokMeta": "Short clips of process and small daily moments — kept light.",
      "sns.emailHandle": "coming soon",
      "sns.emailMeta": "An email channel will open soon. For now, please reach us via Instagram DM.",

      "footer.explore": "Explore",
      "footer.connect": "Connect",
      "footer.emailSoon": "Email · coming soon",
      "footer.snsAll": "See all socials ↗",
      "footer.tagline":
        "Built from quiet ideas and careful software.<br />Between emotion and technology, we make things that last.",
      "footer.built": "Built with warmth.",
      "footer.top": "Back to top ↑",
      "footer.toMain": "Back to main ↑",

      "why.eyebrow": "Why Lunervia",
      "why.title": "Why we built Lunervia",
      "why.intro": "Lunervia believes in small experiences that stay with people — more than in grand technology.",
      "why.body.p1": "Lunervia is not just a name that builds websites or apps.",
      "why.body.p2":
        "It is a brand we started so that the emotions, loneliness, worries, hopes and quiet excitements people meet each day can be handled by technology in a warmer way.",
      "why.body.p3":
        "We don't just build cold features. We want to make experiences people remember — because for someone, a single button, a short sentence, or a gentle transition can become a small comfort.",
      "why.emphasis": "Technology can feel cold, but the heart that designs it can be warm.",
      "why.body.p4": "We want to build software that makes someone's day just a little lighter.",
      "why.body.p5": "Lunervia gathers those small experiences into software that quietly reaches people.",
      "why.body.en": "Lunervia builds software that feels less like a machine, and more like a quiet hand on your shoulder.",
      "why.partners.title": "People we build with",
      "why.partners.intro": "Lunervia is growing alongside small, sincere companion brands.",
      "why.partners.todak":
        "Todak Aquarium Diary helps people record their aquarium and daily moments with care. Lunervia values that kind of attentive record, and we shape ideas together so each service can become a softer experience for its users.",
      "why.close": "Back to main",
    },
  };

  const LANG_KEY = "lunervia-lang";
  let currentLang = "ko";

  function applyI18n(lang) {
    const dict = I18N[lang] || I18N.ko;
    currentLang = lang;

    // 텍스트 노드
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[key];
      if (typeof value === "string") el.textContent = value;
    });
    // HTML 노드 (br, span, em 같이 마크업 포함된 키)
    $$("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const value = dict[key];
      if (typeof value === "string") el.innerHTML = value;
    });

    // <html lang="..."> 갱신 — 스크린리더와 검색엔진을 위해
    document.documentElement.setAttribute("lang", lang);

    // 토글 버튼 상태
    $$(".nav-lang-btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  // 초기 언어 결정 — 저장된 값 > <html lang> > ko
  const storedLang = (() => {
    try { return localStorage.getItem(LANG_KEY); } catch (_) { return null; }
  })();
  const initialLang = storedLang && I18N[storedLang]
    ? storedLang
    : (document.documentElement.getAttribute("lang") || "ko").toLowerCase().startsWith("en") ? "en" : "ko";
  applyI18n(initialLang);

  $$(".nav-lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (!lang || lang === currentLang) return;
      applyI18n(lang);
      try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
    });
  });

  /* -------- 9. Why Lunervia 내부 오버레이 ------------------------- */
  const whyOverlay = $("#why-overlay");
  let lastFocusBeforeWhy = null;
  let whyKeydownHandler = null;

  function getWhyFocusables() {
    if (!whyOverlay) return [];
    return $$(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      whyOverlay
    ).filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);
  }

  function openWhyOverlay(trigger) {
    if (!whyOverlay) return;
    lastFocusBeforeWhy = trigger || document.activeElement;
    whyOverlay.hidden = false;
    // 다음 프레임에 클래스 추가 — transition 이 살아남도록
    window.requestAnimationFrame(() => {
      whyOverlay.classList.add("is-open");
    });
    document.body.classList.add("why-open");

    // 키보드 처리 — Esc 닫기 + 포커스 트랩
    whyKeydownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeWhyOverlay();
        return;
      }
      if (event.key === "Tab") {
        const focusables = getWhyFocusables();
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", whyKeydownHandler);

    // 첫 포커스를 close 버튼으로
    window.setTimeout(() => {
      const closeBtn = whyOverlay.querySelector(".why-close");
      if (closeBtn) closeBtn.focus();
    }, 80);
  }

  function closeWhyOverlay() {
    if (!whyOverlay) return;
    if (whyOverlay.hidden) return;
    whyOverlay.classList.remove("is-open");
    document.body.classList.remove("why-open");
    if (whyKeydownHandler) {
      document.removeEventListener("keydown", whyKeydownHandler);
      whyKeydownHandler = null;
    }
    // CSS transition (0.6s) 가 끝난 뒤 hidden 처리
    const finish = () => {
      whyOverlay.hidden = true;
      if (lastFocusBeforeWhy && typeof lastFocusBeforeWhy.focus === "function") {
        lastFocusBeforeWhy.focus();
      }
      lastFocusBeforeWhy = null;
    };
    if (prefersReducedMotion) {
      finish();
    } else {
      window.setTimeout(finish, 480);
    }
  }

  $$("[data-open-why]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileMenu();
      openWhyOverlay(trigger);
    });
  });

  $$("[data-close-why]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      closeWhyOverlay();
    });
  });
})();
