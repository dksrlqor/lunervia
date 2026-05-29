/* ============================================================
   LUNERVIA — quiet software brand site
   ------------------------------------------------------------
   기능 모듈
   1. 브랜드 로고 클릭 → 부드럽게 상단으로
   2. 이미지 폴백 (로고/파트너) — 로드 성공 시 표시
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

  /* -------- 4b. 헤더 드롭다운 (소개 · 제품) ---------------------------
     - 클릭 시 토글 (모바일·데스크탑 공통)
     - 데스크탑은 hover 로도 열림
     - 바깥 클릭 / Esc / 다른 드롭다운 열림 시 자동 닫힘
  ------------------------------------------------------------------ */
  const navDropdowns = $$(".nav-item-dropdown");
  const isHoverCapable = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function closeAllDropdowns(except) {
    navDropdowns.forEach((item) => {
      if (item === except) return;
      const trigger = item.querySelector(".nav-link-dropdown");
      const panel = item.querySelector(".nav-dropdown");
      if (!trigger || !panel) return;
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    });
  }

  function openDropdown(item) {
    const trigger = item.querySelector(".nav-link-dropdown");
    const panel = item.querySelector(".nav-dropdown");
    if (!trigger || !panel) return;
    closeAllDropdowns(item);
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }

  function closeDropdown(item) {
    const trigger = item.querySelector(".nav-link-dropdown");
    const panel = item.querySelector(".nav-dropdown");
    if (!trigger || !panel) return;
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  navDropdowns.forEach((item) => {
    const trigger = item.querySelector(".nav-link-dropdown");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) closeDropdown(item);
      else openDropdown(item);
    });

    // 데스크탑에서는 hover 로도 열림 (모바일 menu 가 열려 있을 때는 hover 무시)
    if (isHoverCapable) {
      let hoverTimer = null;
      item.addEventListener("mouseenter", () => {
        if (navMenu && navMenu.classList.contains("is-open")) return;
        window.clearTimeout(hoverTimer);
        openDropdown(item);
      });
      item.addEventListener("mouseleave", () => {
        hoverTimer = window.setTimeout(() => closeDropdown(item), 160);
      });
    }

    // 드롭다운 내부 항목 클릭하면 닫고 메인 메뉴(모바일)도 닫음
    const panel = item.querySelector(".nav-dropdown");
    if (panel) {
      panel.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("click", () => {
          closeDropdown(item);
          closeMobileMenu();
        });
      });
    }
  });

  // 바깥 클릭 / Esc 로 모든 드롭다운 닫기
  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-item-dropdown")) return;
    closeAllDropdowns(null);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllDropdowns(null);
  });

  /* -------- 5. Hero 터미널 타이핑 사이클 -------------------------- */
  const phrases = [
    "안녕하세요!",
    "Lunervia designs user-focused software.",
    "사용자 경험 중심의 웹·모바일 서비스를 설계합니다.",
    "Web · Mobile · UX — built with care.",
    "디지털 제품의 완성도를 한 걸음씩 다듬어갑니다.",
    "Software brand for everyday digital experience.",
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
      "nav.partners": "협력",
      "nav.philosophy": "철학",
      "nav.contact": "문의",
      "nav.sns": "SNS",
      "nav.why": "루네르비아를 만든 이유",

      "nav.intro.brand": "브랜드 소개",
      "nav.intro.brand.meta": "루네르비아가 어떤 브랜드인지",
      "nav.intro.philosophy": "철학",
      "nav.intro.philosophy.meta": "제품 설계의 기준",
      "nav.intro.why": "루네르비아를 만든 이유",
      "nav.intro.why.meta": "브랜드의 출발점",

      "back.toMain": "메인으로",
      "back.toMainLong": "메인으로 돌아가기",

      "hero.eyebrow": "Welcome to Lunervia",
      "hero.title": "루네르비아에 오신 것을 환영합니다",
      "hero.sub": "Lunervia는 사용자 경험을 중심으로 웹과 모바일 서비스를 설계하는 소프트웨어 브랜드입니다.",
      "hero.cta.brand": "브랜드 살펴보기",
      "hero.cta.contact": "문의하기",

      "about.label": "About",
      "about.title": "사용자 경험 중심의 소프트웨어 브랜드",
      "about.lead":
        "Lunervia는 사용자가 매일 마주하는 웹과 모바일 환경에서, 명확하고 안정적인 디지털 제품을 설계합니다. 작은 실험과 개선을 반복하며 완성도 있는 서비스를 만들어가고 있습니다.",
      "about.focusLabel": "Focus",
      "about.focusValue": "웹 서비스 · 모바일 앱 · UX 설계",
      "about.stageValue": "성장 단계",

      "philosophy.label": "Philosophy",
      "philosophy.title": "Design Principles",
      "philosophy.big":
        "Lunervia는 화려한 기능보다, 사용자가 명확하게 이해하고 안정적으로 사용할 수 있는 제품을 우선합니다.",
      "philosophy.card1.name": "User-centered design",
      "philosophy.card1": "사용자가 실제 마주하는 맥락에서 의사결정을 시작합니다.",
      "philosophy.card2.name": "Reliable services",
      "philosophy.card2": "기능의 화려함보다 안정성과 일관된 사용 경험을 우선합니다.",
      "philosophy.card3.name": "Clear & practical",
      "philosophy.card3": "복잡한 구조 대신 사용자가 바로 이해할 수 있는 설계를 지향합니다.",
      "philosophy.cta": "브랜드 소개 자세히 보기",

      "partners.label": "Partners",
      "partners.title": "협력 파트너",
      "partners.lead":
        "Lunervia는 서비스 경험 개선과 브랜드 협력에 관심 있는 파트너 브랜드와 함께 협업하고 있습니다.",
      "partners.name": "어항 관리와 일상 기록을 돕는 다이어리 서비스",
      "partners.desc":
        "토닥 어항일기는 어항 관리와 사용자의 일상 기록을 돕는 다이어리 서비스입니다. Lunervia는 토닥 어항일기와 서비스 경험 개선 및 브랜드 협력을 함께 논의하고 있습니다.",

      "contact.label": "Contact",
      "contact.title": "문의하기",
      "contact.lead":
        "협업, 문의, 제안이 있다면 아래 채널을 통해 연락해 주세요. Instagram DM을 가장 빠르게 확인합니다.",
      "contact.official.label": "Official Instagram",
      "contact.official.meta": "브랜드 소식 및 협업 문의",
      "contact.personal.label": "Personal Instagram",
      "contact.personal.meta": "개인 작업 기록 및 프로젝트 업데이트",
      "contact.tiktok.label": "TikTok",
      "contact.tiktok.meta": "영상 기반 작업 기록",
      "contact.email.label": "Email",
      "contact.email.handle": "coming soon",
      "contact.email.meta": "이메일 채널은 준비 중입니다.",
      "contact.cta": "메시지 보내기 <span aria-hidden=\"true\">↗</span>",

      "sns.eyebrow": "Find Lunervia on",
      "sns.title": "Lunervia 공식 SNS<br />채널 안내",
      "sns.lead": "Lunervia의 공식 소식과 작업 기록은 아래 채널에서 확인할 수 있습니다. 가장 빠른 응답은 Instagram DM을 통해 받을 수 있습니다.",
      "sns.official": "Official",
      "sns.personal": "Personal",
      "sns.video": "Video",
      "sns.soon": "Soon",
      "sns.follow": "팔로우",
      "sns.watch": "영상 보러가기",
      "sns.officialMeta": "브랜드 소식 및 협업 문의를 위한 공식 채널입니다.",
      "sns.personalMeta": "개인 작업 기록 및 프로젝트 업데이트.",
      "sns.tiktokMeta": "영상 기반 작업 기록 및 프로젝트 공유.",
      "sns.emailHandle": "coming soon",
      "sns.emailMeta": "이메일 채널은 준비 중입니다. 그 전까지는 Instagram DM을 이용해 주세요.",

      "footer.explore": "Explore",
      "footer.connect": "Connect",
      "footer.emailSoon": "Email · 준비 중",
      "footer.snsAll": "공식 SNS 채널 보기 ↗",
      "footer.tagline":
        "Lunervia는 사용자 경험 중심의 웹·모바일 서비스를 설계합니다.<br />작은 실험과 개선을 반복하며 완성도 있는 제품을 만들어갑니다.",
      "footer.built": "Designed with care.",
      "footer.top": "맨 위로 ↑",
      "footer.toMain": "메인으로 ↑",

      "why.eyebrow": "Why Lunervia",
      "why.title": "루네르비아를 만든 이유",
      "why.intro": "Lunervia는 디지털 서비스가 사용자의 실제 문제를 더 명확하고 편리하게 해결해야 한다는 생각에서 출발한 소프트웨어 브랜드입니다.",
      "why.body.p1": "Lunervia는 단순한 제작자 이름이 아니라, 사용자가 마주하는 디지털 환경을 보다 명확하고 안정적으로 설계하기 위해 시작한 브랜드입니다.",
      "why.body.p2":
        "우리는 웹과 모바일 환경에서 사용자가 쉽게 이해하고 안정적으로 사용할 수 있는 제품을 만들고자 합니다. 시각적 화려함보다 일관된 사용 경험과 신뢰할 수 있는 동작을 우선 순위에 둡니다.",
      "why.body.p3":
        "Lunervia는 작은 실험과 개선을 반복하며 완성도 있는 서비스를 만들어가고 있습니다. 새로운 기능을 빠르게 추가하기보다, 사용자가 오래 사용할 수 있는 구조와 흐름을 다듬는 데 시간을 씁니다.",
      "why.emphasis": "기술은 기능에 그치지 않고, 사용자의 맥락을 이해하는 방향으로 설계되어야 한다고 생각합니다.",
      "why.body.p4": "사용자는 단순한 기능 이상의 경험을 기대합니다. Lunervia는 그 경험을 구성하는 작은 결정들을 진지하게 다룹니다.",
      "why.body.p5": "아직 성장 단계의 브랜드이지만, 실험과 기록을 통해 디지털 제품의 기준을 한 걸음씩 만들어가고 있습니다.",
      "why.body.en": "Lunervia is a software brand designing web and mobile services with a focus on clear and reliable user experience.",
      "why.partners.title": "협력 파트너",
      "why.partners.intro": "Lunervia는 서비스 경험 개선과 브랜드 협력에 관심 있는 파트너 브랜드와 함께 협업하고 있습니다.",
      "why.partners.todak":
        "토닥 어항일기는 어항 관리와 사용자의 일상 기록을 돕는 다이어리 서비스입니다. Lunervia는 토닥 어항일기와 서비스 경험 개선 및 브랜드 협력을 함께 논의하고 있습니다.",
      "why.close": "메인으로 돌아가기",
    },
    en: {
      "nav.about": "About",
      "nav.partners": "Partners",
      "nav.philosophy": "Philosophy",
      "nav.contact": "Contact",
      "nav.sns": "SNS",
      "nav.why": "Why Lunervia",

      "nav.intro.brand": "Brand overview",
      "nav.intro.brand.meta": "What Lunervia is about",
      "nav.intro.philosophy": "Philosophy",
      "nav.intro.philosophy.meta": "How we design our products",
      "nav.intro.why": "Why we built Lunervia",
      "nav.intro.why.meta": "Where the brand starts",

      "back.toMain": "Back to main",
      "back.toMainLong": "Back to main page",

      "hero.eyebrow": "Welcome to Lunervia",
      "hero.title": "Welcome to Lunervia.",
      "hero.sub": "Lunervia is a software brand designing web and mobile services around user experience.",
      "hero.cta.brand": "Explore the brand",
      "hero.cta.contact": "Contact us",

      "about.label": "About",
      "about.title": "A software brand built around user experience",
      "about.lead":
        "Lunervia designs clear and reliable digital products across the web and mobile environments people use every day. We build through small experiments and steady improvements.",
      "about.focusLabel": "Focus",
      "about.focusValue": "Web · Mobile · UX design",
      "about.stageValue": "Growing",

      "philosophy.label": "Philosophy",
      "philosophy.title": "Design Principles",
      "philosophy.big":
        "Lunervia prioritises products that users can understand clearly and rely on consistently — over flashy features.",
      "philosophy.card1.name": "User-centered design",
      "philosophy.card1": "Decisions start from the real context a user is facing.",
      "philosophy.card2.name": "Reliable services",
      "philosophy.card2": "We prioritise stability and a consistent experience over flashy features.",
      "philosophy.card3.name": "Clear & practical",
      "philosophy.card3": "We design for immediate understanding rather than complex structures.",
      "philosophy.cta": "Read more about Lunervia",

      "partners.label": "Partners",
      "partners.title": "Partners",
      "partners.lead":
        "Lunervia collaborates with partner brands interested in improving service experience and exploring brand partnerships.",
      "partners.name": "A diary service for aquarium care and daily records",
      "partners.desc":
        "Todak Aquarium Diary helps users manage their aquariums and record daily moments. Lunervia is in ongoing discussion with Todak on service experience and brand collaboration.",

      "contact.label": "Contact",
      "contact.title": "Contact",
      "contact.lead":
        "For collaboration, enquiries, or proposals, please reach out through the channels below. Instagram DM is the fastest way to reach us.",
      "contact.official.label": "Official Instagram",
      "contact.official.meta": "Brand news and collaboration enquiries.",
      "contact.personal.label": "Personal Instagram",
      "contact.personal.meta": "Personal account — process notes and project updates.",
      "contact.tiktok.label": "TikTok",
      "contact.tiktok.meta": "Video-based work records.",
      "contact.email.label": "Email",
      "contact.email.handle": "coming soon",
      "contact.email.meta": "An email channel is being prepared.",
      "contact.cta": "Send a message <span aria-hidden=\"true\">↗</span>",

      "sns.eyebrow": "Find Lunervia on",
      "sns.title": "Lunervia official<br />social channels",
      "sns.lead": "Official news and work records are available through the channels below. The fastest response comes through Instagram DM.",
      "sns.official": "Official",
      "sns.personal": "Personal",
      "sns.video": "Video",
      "sns.soon": "Soon",
      "sns.follow": "Follow",
      "sns.watch": "Watch videos",
      "sns.officialMeta": "Official channel for brand news and collaboration enquiries.",
      "sns.personalMeta": "Personal account — process notes and project updates.",
      "sns.tiktokMeta": "Video-based work records and project highlights.",
      "sns.emailHandle": "coming soon",
      "sns.emailMeta": "An email channel is being prepared. Until then, please reach us through Instagram DM.",

      "footer.explore": "Explore",
      "footer.connect": "Connect",
      "footer.emailSoon": "Email · in preparation",
      "footer.snsAll": "View official social channels ↗",
      "footer.tagline":
        "Lunervia designs web and mobile services around user experience.<br />We build with small experiments and steady improvements.",
      "footer.built": "Designed with care.",
      "footer.top": "Back to top ↑",
      "footer.toMain": "Back to main ↑",

      "why.eyebrow": "Why Lunervia",
      "why.title": "Why we built Lunervia",
      "why.intro": "Lunervia is a software brand built on the belief that digital services should solve real user problems more clearly and conveniently.",
      "why.body.p1": "Lunervia is more than a maker's name. It is a brand we started to design clearer and more reliable digital environments for the people who use them.",
      "why.body.p2":
        "We aim to build products on web and mobile that users can understand quickly and rely on consistently. We prioritise dependable behaviour and a coherent experience over visual flourish.",
      "why.body.p3":
        "Lunervia grows through small experiments and steady improvements. Rather than rushing new features, we spend time refining the structure and flow that lets people use a product for a long time.",
      "why.emphasis": "Technology should not stop at functionality. It should be designed with an understanding of the user's context.",
      "why.body.p4": "Users expect more than features. We treat the small decisions that shape that experience with care.",
      "why.body.p5": "Lunervia is still a growing brand. Through experiments and records, we are defining our standard for digital products one step at a time.",
      "why.body.en": "Lunervia is a software brand designing web and mobile services with a focus on clear and reliable user experience.",
      "why.partners.title": "Partners",
      "why.partners.intro": "Lunervia collaborates with partner brands interested in improving service experience and exploring brand partnerships.",
      "why.partners.todak":
        "Todak Aquarium Diary helps users manage their aquariums and record daily moments. Lunervia is in ongoing discussion with Todak on service experience and brand collaboration.",
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
