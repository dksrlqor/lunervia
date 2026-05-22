/* ============================================================
   LUNERVIA — quiet software brand site
   - 브랜드 로고 클릭 시 새로고침
   - hero VS Code 창 안 타이핑 사이클 (첫 문구 = '안녕하세요!')
   - 이미지 폴백 (로고/제품/파트너): 이미지 로드 성공 시 표시
   - 모바일 네비게이션 토글
   - 앵커 클릭 시 부드러운 스크롤 + 메뉴 닫힘
   - IntersectionObserver 기반 reveal
   - prefers-reduced-motion 대응
   ============================================================ */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- 1. 브랜드 로고 클릭 → 새로고침 -------- */
  const brandLink = $("#brand-link");
  if (brandLink) {
    brandLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.reload();
    });
  }

  /* -------- 2. 이미지 폴백
     - 이미지가 정상 로드되면 텍스트/플레이스홀더를 숨기고 이미지 표시
     - 로드 실패면 그대로 폴백 유지 (broken icon 안 보이도록 img 는 숨김)
  -------- */
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
      if (img.naturalWidth > 0) {
        handleLoad();
      } else {
        handleError();
      }
      return;
    }
    img.addEventListener("load", handleLoad, { once: true });
    img.addEventListener("error", handleError, { once: true });
  };

  // 브랜드 로고 (헤더) — 이미지 로드 성공 시 .brand-logo 박스를 보이고 텍스트 숨김
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

  /* -------- 3. 모바일 메뉴 토글 -------- */
  const navToggle = $(".nav-toggle");
  const navMenu = $(".nav-menu");

  const closeMobileMenu = () => {
    if (!navMenu || !navToggle) return;
    if (!navMenu.classList.contains("is-open")) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  };

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

  /* -------- 4. 앵커 링크 — 메뉴 닫고 부드럽게 스크롤
     (CSS html { scroll-behavior: smooth } 이 처리하지만,
      모바일 메뉴는 JS 로 닫아 줍니다.)
  -------- */
  $$('.nav-menu a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /* -------- 5. Hero VS Code 창 타이핑 사이클
     - 첫 문구는 반드시 '안녕하세요!' (배열 첫 요소)
     - 한 글자씩 타이핑 → 잠시 머무름 → 한 글자씩 삭제 → 다음 문구
     - 무한 반복
     - reduced-motion 환경에서는 첫 문구만 정적으로 표시
  -------- */
  const phrases = [
    "안녕하세요!",
    "우리는 감정을 소프트웨어로 번역합니다.",
    "작은 불편함에서 서비스를 만듭니다.",
    "Lunervia builds quiet, meaningful tools.",
    "오늘의 아이디어가 내일의 제품이 됩니다.",
  ];

  const typedEl = document.getElementById("typed");

  const TYPE_SPEED = 72;        // ms per char while typing
  const DELETE_SPEED = 36;      // ms per char while deleting
  const PAUSE_AFTER_TYPE = 1700;
  const PAUSE_BEFORE_NEXT = 360;

  const startTypingLoop = () => {
    if (!typedEl) return;

    // 접근성: 모션 줄이기를 선호하면 첫 문구만 정적으로 표시
    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
      return;
    }

    let phraseIdx = 0;
    let charIdx = phrases[0].length; // 시작 시점에 첫 문구가 이미 표시됨 → 거기서 이어서 시작
    let isDeleting = false;

    // HTML 에 미리 '안녕하세요!' 가 들어 있으므로 잠시 보이게 두었다가
    // 자연스럽게 다음 사이클로 진입.
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

      // charIdx === 0 && isDeleting
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      window.setTimeout(tick, PAUSE_BEFORE_NEXT);
    };

    tick();
  };

  startTypingLoop();

  /* -------- 6. IntersectionObserver 기반 reveal -------- */
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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
      // 부드러운 스태거
      item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      revealObserver.observe(item);
    });
  } else {
    // observer 가 없거나 reduced-motion 인 경우 즉시 표시
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
