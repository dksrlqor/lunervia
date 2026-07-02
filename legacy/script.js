/* ============================================================
   LUNERVIA — quiet software brand site
   ------------------------------------------------------------
   기능 모듈
   0. 새로고침 동작 — 어디서 새로고침해도 메인 hero, 메인은 맨 위 +
      브랜드 로고 (헤더 / 푸터) 클릭 → 메인으로 강제 reload
   1. (제거됨 — #0 이 처리)
   2. 이미지 폴백 (로고 / showcase 카드) — 로드 성공 시 표시
   3. 모바일 네비게이션 토글 + 외부 클릭/ESC 로 닫힘
   4. 앵커 클릭 시 부드럽게 스크롤 + 메뉴 닫힘
   5. (제거됨 — Hero 터미널 타이핑. 히어로 우측이 서비스 제작
      대시보드 비주얼로 교체되면서 모든 모션은 CSS keyframes 로 처리)
   6. IntersectionObserver 기반 reveal (스태거 포함)
   7. 스크롤 진행률 바 갱신
   8. KO / EN 언어 토글 + localStorage 영속화 (data-i18n / data-i18n-html)
   9. Why Lunervia 내부 오버레이 — 새 탭이 아니라 사이트 안 스토리룸
      - data-open-why 로 열고, data-close-why / Esc / 배경 클릭으로 닫음
      - 열려 있을 때 body 스크롤 잠금 + 포커스 트랩
   ============================================================ */

(() => {
  /* -------- 0. 새로고침 동작 통일 ------------------------------------
     - 서브 페이지(sns / why / partners …)에서 새로고침하면 메인으로
       이동 (히스토리에는 안 남도록 location.replace 사용)
     - 메인 페이지에서 새로고침 시에는 마지막 스크롤 위치 복원 끄고
       맨 위(hero) 로 보냄 + URL 의 해시도 제거
     - 브라우저가 자동 스크롤 복원하기 전에 history.scrollRestoration
       을 manual 로 두기 위해 IIFE 진입 즉시 실행 (DOM 대기 X)
  -------------------------------------------------------------------- */
  const pagePath = location.pathname;
  const isMainPage =
    pagePath === "" || pagePath === "/" ||
    pagePath.endsWith("/") || pagePath.endsWith("/index.html");

  // 모듈/결제 관련 페이지는 공유·북마크되는 랜딩이므로 새로고침해도 메인으로 보내지
  // 않고 그 자리에 머문다 (맨 위로만 스크롤). 메인과 같은 부류로 취급.
  const isModulePage =
    pagePath.endsWith("module-service-builder.html") ||
    pagePath.endsWith("modules.html") ||
    pagePath.endsWith("checkout.html");
  const stayOnReload = isMainPage || isModulePage;

  const navEntry =
    (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || null;
  const isReload = navEntry
    ? navEntry.type === "reload"
    : (performance.navigation && performance.navigation.type === 1);

  if (isReload && !stayOnReload) {
    // 서브 페이지 새로고침 → 메인으로
    window.location.replace("index.html");
    return; // 새 페이지 로드되니 이후 초기화는 의미 없음
  }

  if (stayOnReload && "scrollRestoration" in history) {
    // 메인·모듈 페이지는 항상 맨 위부터 시작하도록 자동 복원 꺼두기
    history.scrollRestoration = "manual";
  }

  if (isReload && stayOnReload) {
    // 즉시 + load 이후에도 한 번 더 (브라우저 복원이 늦게 일어나는 경우 대비)
    window.scrollTo(0, 0);
    window.addEventListener("load", () => window.scrollTo(0, 0), { once: true });
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- 1. 브랜드 로고(헤더·푸터) 클릭 → 메인으로 강제 reload -------
     href 가 이미 index.html 이라 그냥 두면 일반 navigate 라 캐시
     사용 가능. 사용자 요청은 "무조건 새로고침" 이므로 명시적으로
     처리: 메인이면 hash 제거 + location.reload(), 다른 페이지면
     location.assign('index.html').
  -------------------------------------------------------------------- */
  $$(".brand, .footer-brand").forEach((logo) => {
    logo.addEventListener("click", (event) => {
      event.preventDefault();
      if (isMainPage) {
        if (location.hash) {
          history.replaceState(null, "", location.pathname + location.search);
        }
        location.reload();
      } else {
        location.assign("index.html");
      }
    });
  });

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

  /* -------- 7b. 스크롤 스파이 — 현재 섹션에 맞춰 nav active 표시 ----
     상단 sticky 헤더 바로 아래 얇은 밴드에 섹션 상단이 들어오면
     해당 nav 링크에 aria-current="page" 를 부여 (CSS 밑줄 강조).
  ------------------------------------------------------------------ */
  const spyLinks = $$('.nav-menu a[href^="#"]');
  if (spyLinks.length && "IntersectionObserver" in window) {
    const spySections = spyLinks
      .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
      .filter(Boolean);

    let spyActive = null;
    const setSpyActive = (id) => {
      if (id === spyActive) return;
      spyActive = id;
      spyLinks.forEach((a) => {
        if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    };

    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setSpyActive(visible[0].target.id);
      },
      { rootMargin: "-16% 0px -76% 0px", threshold: 0 }
    );
    spySections.forEach((s) => spyObserver.observe(s));
  }

  /* -------- 7c. 히어로 지구본 — 실제 대륙 직교투영 자전 -------------
     히어로 우측 비주얼. 외부 라이브러리 없이, 인라인 JSON(#globe-land-data)
     의 실제 해안선 좌표를 직교투영해 매 프레임 다시 그리며 자전.
     화면 밖이거나 탭이 백그라운드면 멈춰서 성능을 아낀다.
  ------------------------------------------------------------------ */
  (function initHeroGlobe() {
    const dataEl = document.getElementById("globe-land-data");
    const landEl = document.getElementById("hero-globe-land");
    const gratEl = document.getElementById("hero-globe-grat");
    if (!dataEl || !landEl) return;
    let L = [];
    try { L = JSON.parse(dataEl.textContent || "[]"); } catch (e) {}
    if (!L.length) return;

    const R = 74, CX = 100, CY = 100, D2R = Math.PI / 180;
    const tilt = 20 * D2R, sinP = Math.sin(tilt), cosP = Math.cos(tilt);

    const GR = (() => {
      const g = [];
      for (let lon = -150; lon <= 180; lon += 30) { const line = []; for (let lat = -80; lat <= 80; lat += 4) line.push(lon, lat); g.push(line); }
      for (let lat = -60; lat <= 60; lat += 30) { const line = []; for (let lon = -180; lon <= 180; lon += 4) line.push(lon, lat); g.push(line); }
      return g;
    })();

    function pathFor(rings, lam) {
      let d = "";
      for (let k = 0; k < rings.length; k++) {
        const arr = rings[k];
        let pen = false;
        for (let i = 0; i < arr.length; i += 2) {
          const lon = arr[i] * D2R, lat = arr[i + 1] * D2R, dl = lon - lam;
          const cosc = sinP * Math.sin(lat) + cosP * Math.cos(lat) * Math.cos(dl);
          if (cosc >= -0.02) {
            const x = CX + R * Math.cos(lat) * Math.sin(dl);
            const y = CY - R * (cosP * Math.sin(lat) - sinP * Math.cos(lat) * Math.cos(dl));
            d += (pen ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1) + " ";
            pen = true;
          } else pen = false;
        }
      }
      return d;
    }

    function draw(lam) {
      if (gratEl) gratEl.setAttribute("d", pathFor(GR, lam));
      landEl.setAttribute("d", pathFor(L, lam));
    }

    draw(0); // 초기 정적 프레임 — 화면 밖이어도 대륙은 항상 보이게
    if (prefersReducedMotion) return;

    let raf = null, last = 0, lam = 0, inView = true;
    function frame(now) {
      if (last) lam += (now - last) * 0.0002;
      last = now;
      draw(lam);
      raf = inView ? window.requestAnimationFrame(frame) : null;
    }
    function start() { if (!raf) { last = 0; raf = window.requestAnimationFrame(frame); } }
    function stop() { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }

    const host = landEl.closest(".hero-globe") || landEl;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }, { threshold: 0 });
      io.observe(host);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (inView) start();
    });
  })();

  /* -------- 8. KO / EN 언어 토글 ---------------------------------- */
  /*
     UI 문구는 모두 data-i18n / data-i18n-html 로 표시.
     번역 키는 ko 기준 + en 매핑.
     localStorage 키: 'lunervia-lang'.
  */
  const I18N = {
    ko: {
      "nav.about": "소개",
      "nav.services": "서비스",
      "nav.work": "작업",
      "nav.process": "프로세스",
      "nav.partners": "프로젝트",
      "nav.module": "모듈",
      "nav.philosophy": "철학",
      "nav.contact": "문의",
      "nav.sns": "SNS",
      "nav.why": "루네르비아를 만든 이유",

      "nav.intro.brand": "브랜드 소개",
      "nav.intro.brand.meta": "루네르비아가 어떤 스튜디오인지",
      "nav.intro.philosophy": "철학",
      "nav.intro.philosophy.meta": "제품 설계의 기준",
      "nav.intro.projects": "전체 프로젝트",
      "nav.intro.projects.meta": "주요 프로젝트 및 협력",
      "nav.intro.why": "루네르비아를 만든 이유",
      "nav.intro.why.meta": "브랜드의 출발점",

      "back.toMain": "메인으로",
      "back.toMainLong": "메인으로 돌아가기",

      "hero.eyebrow": "Lunervia — Software Studio",
      "hero.title": "사용자가 쓰기 쉬운 웹서비스를 설계하고,<br />실제로 작동하는 제품으로 만듭니다.",
      "hero.sub": "복잡한 아이디어를 단순한 구조로 정리하고, 화면부터 작동까지 직접 만드는 작은 소프트웨어 스튜디오입니다.",
      "hero.cta.contact": "프로젝트 문의하기",
      "hero.cta.work": "작업 보기",

      "services.label": "Services",
      "services.title": "Lunervia가 하는 일",
      "services.lead": "기획, 화면 설계, 프론트엔드 구현, 그리고 AI를 활용한 작업까지. 서비스 하나가 끝까지 작동하도록 만듭니다.",
      "services.s1.name": "Web Service Development",
      "services.s1.desc": "아이디어를 배포 가능한 웹서비스로 구현합니다. 화면뿐 아니라 실제로 작동하는 흐름까지.",
      "services.s2.name": "Frontend System Design",
      "services.s2.desc": "재사용 가능한 컴포넌트와 디자인 토큰으로, 오래 다듬을 수 있는 프론트엔드 구조를 설계합니다.",
      "services.s3.name": "UI/UX Redesign",
      "services.s3.desc": "복잡하게 얽힌 화면을 사용자가 길을 잃지 않는 명확한 흐름으로 다시 정리합니다.",
      "services.s4.name": "Landing Page Optimization",
      "services.s4.desc": "로딩 속도, 메시지, 전환 흐름까지 점검해 방문이 실제 문의로 이어지도록 다듬습니다.",
      "services.s5.name": "Brand Experience",
      "services.s5.desc": "로고와 색을 넘어, 사이트 전체에서 일관되게 느껴지는 브랜드 경험을 설계합니다.",
      "services.s6.name": "AI Workflow Integration",
      "services.s6.desc": "AI를 제작 과정에 끼워 넣어, 더 빠르게 만들고 더 일정한 품질을 유지하도록 돕습니다.",

      "process.label": "Process",
      "process.title": "이런 순서로 만듭니다",
      "process.lead": "화면을 꾸미기 전에, 사용자가 헤매지 않을 흐름부터 잡습니다. 보통 다섯 단계로 진행합니다.",
      "process.s1.name": "Discovery",
      "process.s1.desc": "목표와 사용자를 먼저 이해하고, 만들 것의 범위를 정합니다.",
      "process.s1.state": "정리 완료",
      "process.s2.name": "UX Flow",
      "process.s2.desc": "사용자가 헷갈리지 않도록 화면 구조와 동선을 설계합니다.",
      "process.s2.state": "정리 완료",
      "process.s3.name": "Interface System",
      "process.s3.desc": "디자인 토큰과 컴포넌트로 일관된 인터페이스를 구성합니다.",
      "process.s3.state": "진행 중",
      "process.s4.name": "Frontend Build",
      "process.s4.desc": "반응형과 접근성을 고려해 실제로 작동하는 화면으로 구현합니다.",
      "process.s4.state": "다음 단계",
      "process.s5.name": "Launch & Improve",
      "process.s5.desc": "배포 후에도 실제 사용성을 기준으로 계속 다듬어 갑니다.",
      "process.s5.state": "대기",

      "work.label": "Work",
      "work.title": "직접 만들고, 실험하는 프로젝트",
      "work.lead": "Lunervia가 직접 기획하고 만든 작업들입니다. 잘 작동하고, 고치기 쉽고, 오래 쓸 수 있게 만들려고 합니다.",
      "work.status.live": "운영 중",
      "work.lab.status": "실험 중",
      "work.lab.desc": "작은 웹서비스 아이디어를 실험하고 정리하는 내부 공간입니다.",
      "work.lab.role": "서비스 실험 · UI 연구 · 프로토타입",
      "work.lab.foot": "INTERNAL_EXPERIMENT",
      "work.smbest.status": "준비 중",
      "work.smbest.desc": "함께할 예정인 기업 파트너의 웹 경험을 준비하고 있습니다.",
      "work.smbest.role": "Client · 웹서비스 · 브랜드 경험",
      "work.more.name": "더 많은 프로젝트",
      "work.more.desc": "주요 프로젝트와 협력 사례를 전체 목록에서 살펴볼 수 있습니다.",
      "work.more.cta": "전체 프로젝트 보기",

      "trust.title": "Lunervia가 중요하게 보는 것",
      "trust.lead":
        "좋은 사이트는 보기 좋은 화면에서 끝나지 않습니다. 사용자가 이해하고, 실제로 작동하며, 오래 다듬을 수 있어야 합니다.",
      "trust.card1.name": "이해하기 쉬운 흐름",
      "trust.card1.desc": "사용자가 길을 잃지 않도록 화면 구조와 동선을 먼저 설계합니다.",
      "trust.card2.name": "실제로 작동하는 구현",
      "trust.card2.desc": "보기 좋은 화면에서 끝나지 않고, 배포 가능한 형태의 웹서비스를 만듭니다.",
      "trust.card3.name": "오래 다듬을 수 있는 구조",
      "trust.card3.desc": "기능을 추가하고 수정하기 쉬운 구조를 고려해 제작합니다.",

      "about.label": "About",
      "about.title": "아이디어를 실제 서비스로 만드는 작은 소프트웨어 스튜디오",
      "about.lead":
        "기획, 화면 설계, 프론트엔드 구현, 사용자 흐름 개선까지 — 하나의 서비스가 실제로 작동하도록 만드는 과정을 중요하게 생각합니다.",
      "about.focusLabel": "Focus",
      "about.focusValue": "웹 서비스 · 프론트엔드 · UX 설계",
      "about.stageValue": "성장 단계",
      "about.step1.name": "기획",
      "about.step1.desc": "아이디어를 서비스 구조로 정리합니다.",
      "about.step2.name": "UX 설계",
      "about.step2.desc": "사용자가 헷갈리지 않는 흐름을 구성합니다.",
      "about.step3.name": "UI 개발",
      "about.step3.desc": "브랜드에 맞는 화면과 인터랙션을 구현합니다.",
      "about.step4.name": "개선",
      "about.step4.desc": "실제 사용성을 기준으로 계속 다듬습니다.",

      "philosophy.label": "Philosophy",
      "philosophy.title": "Design Principles",
      "philosophy.big":
        "감각적인 화면보다, 오래 쓰이는 경험을 먼저 설계합니다.",
      "philosophy.card1.kr": "복잡함보다 명확함",
      "philosophy.card1": "복잡한 기능을 더하기 전에, 사용자가 이해하기 쉬운 흐름을 먼저 설계합니다.",
      "philosophy.card2.kr": "신뢰할 수 있는 인터페이스",
      "philosophy.card2": "보기 좋은 화면뿐 아니라, 실제로 안정적으로 작동하는 인터페이스를 만듭니다.",
      "philosophy.card3.kr": "확장 가능한 구조",
      "philosophy.card3": "나중에 수정하고 확장하기 쉬운 구조를 고려해 설계합니다.",
      "philosophy.card4.kr": "작은 결정까지 신중하게",
      "philosophy.card4": "경험을 구성하는 작은 결정 하나하나를 진지하게 다룹니다.",
      "philosophy.cta": "브랜드 소개 자세히 보기",

      "tml.label": "Featured · Lunervia Work",
      "tml.title": "편지로 마음을 전하는<br />Take My Letter",
      "tml.desc":
        "익명 또는 이름으로 마음을 전할 수 있는 디지털 편지 서비스입니다. Lunervia가 직접 기획하고 만든 자체 웹서비스예요.",
      "tml.role": "Planning · UX · Frontend · Brand",
      "tml.cta": "편지 보내러 가기",

      "showcase.label": "Projects",
      "showcase.title": "주요 프로젝트 및 협력",
      "showcase.subtitle": "Projects & Works",
      "showcase.lead":
        "작은 아이디어를 실제로 작동하는 서비스로 만들고 있습니다. Lunervia가 직접 만들고, 함께하고, 실험하는 프로젝트들입니다.",
      "showcase.comingSoon": "Coming soon",
      "showcase.label.client": "주요 고객",
      "showcase.label.work": "루네르비아 작품",
      "showcase.label.partner": "협력 파트너",
      "showcase.type.client": "Client · Company",
      "showcase.type.work": "Lunervia Work · 자체 작품",
      "showcase.type.partner": "Partner · Creator",
      "showcase.label.lab": "실험 공간",
      "showcase.type.lab": "Lunervia Lab · 작은 실험들",
      "showcase.smbest.desc":
        "루네르비아가 함께할 예정인 주요 기업 파트너입니다.",
      "showcase.badajwo.desc":
        "익명 또는 이름으로 마음을 전할 수 있는 루네르비아의 자체 디지털 편지 서비스입니다.",
      "showcase.badajwo.status": "운영 중",
      "showcase.badajwo.role": "기획 · UX 구조 · UI 방향 · 프론트엔드",
      "showcase.todak.desc":
        "앱 제작 과정과 기록을 영상으로 공유하는 크리에이터 채널입니다.",
      "showcase.lab.desc":
        "작은 웹서비스 아이디어를 실험하고 정리하는 공간입니다.",
      "showcase.lab.status": "준비 중",
      "showcase.lab.role": "서비스 실험 · UI 연구 · 프로토타입",

      "contact.label": "Contact",
      "contact.title": "프로젝트, 함께 시작해요",
      "contact.lead":
        "작은 아이디어라도 괜찮습니다. Lunervia는 구조를 정리하고, 실제 서비스로 구현하는 과정을 함께 설계합니다. 문의는 Instagram DM으로 가장 빠르게 확인합니다.",
      "contact.cta.instagram": "Instagram으로 문의하기",
      "contact.cta.propose": "프로젝트 제안하기",
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

      "mod.hero.eyebrow": "Lunervia Module · 시리즈 01",
      "mod.hero.title": "복붙 프롬프트가 아니라,<br />AI를 위한 전문 작업 시스템.",
      "mod.hero.sub": "ChatGPT·Claude·Gemini·Cursor에 끼우면, 누가 써도 일정한 품질의 서비스 진단이 나옵니다. 초보자는 빈칸만 채우면 됩니다.",
      "mod.hero.ctaSample": "예시 결과 보기",
      "mod.hero.ctaGet": "Service Builder Module 받기",
      "mod.hero.chip.mobile": "모바일",

      "mod.problem.eyebrow": "Problem",
      "mod.problem.title": "AI는 똑똑한데, 결과가 매번 달라집니다.",
      "mod.problem.lead": "필요한 건 ‘잘 쓴 한 문장’이 아니라, 같은 품질을 반복해서 뽑아내는 작업 흐름입니다.",
      "mod.problem.c1.t": "매번 새로 짠다",
      "mod.problem.c1.d": "물어볼 때마다 프롬프트를 처음부터 다시 짜야 합니다.",
      "mod.problem.c2.t": "품질이 들쭉날쭉",
      "mod.problem.c2.d": "같은 질문도 답의 깊이와 형식이 매번 달라집니다.",
      "mod.problem.c3.t": "우선순위가 없다",
      "mod.problem.c3.d": "“그래서 뭘 먼저 고치라는 거지?”가 정리되지 않습니다.",
      "mod.problem.c4.t": "개발로 못 넘긴다",
      "mod.problem.c4.d": "진단을 실제 개발 작업으로 넘기기가 막막합니다.",

      "mod.solution.eyebrow": "Solution",
      "mod.solution.title": "분석 → 판단 → 출력 → 검수, 한 흐름으로.",
      "mod.solution.lead": "서비스 진단을 네 단계의 고정된 작업 흐름으로 묶었습니다. 누가 돌려도 같은 구조의 결과가 나옵니다.",
      "mod.solution.s1.t": "분석",
      "mod.solution.s1.d": "서비스의 목적과 사용자를 먼저 분석합니다.",
      "mod.solution.s2.t": "판단",
      "mod.solution.s2.d": "핵심 문제 3~5개를 근거와 우선순위로 정렬합니다.",
      "mod.solution.s3.t": "출력",
      "mod.solution.s3.d": "디자인·문구·기능·모바일 UX 개선안을 고정 형식으로 정리합니다.",
      "mod.solution.s4.t": "검수",
      "mod.solution.s4.d": "12항목 루브릭으로 결과의 품질을 채점합니다.",

      "mod.inside.eyebrow": "What's inside",
      "mod.inside.title": "패키지 안에 담긴 것",
      "mod.inside.lead": "앱이나 로그인이 아니라, 복붙해서 바로 쓰는 문서형 패키지(zip·노션)입니다.",
      "mod.inside.i1.t": "핵심 모듈 본체",
      "mod.inside.i1.d": "모든 AI에 공통으로 쓰는 작업 시스템 본체.",
      "mod.inside.i2.t": "플랫폼별 프롬프트",
      "mod.inside.i2.d": "ChatGPT · Claude · Gemini · Cursor · 모바일 각각의 버전.",
      "mod.inside.i3.t": "입력·출력 템플릿",
      "mod.inside.i3.d": "입력 템플릿 6종 / 출력 템플릿 6종.",
      "mod.inside.i4.t": "검수 루브릭 12항목",
      "mod.inside.i4.d": "결과를 스스로 점수로 채점하는 체크 기준.",
      "mod.inside.i5.t": "개발 연결 프롬프트",
      "mod.inside.i5.d": "진단 결과를 Cursor 작업지시로 바로 넘깁니다.",
      "mod.inside.i6.t": "사용법 & 성능 개선 가이드",
      "mod.inside.i6.d": "처음 쓰는 사람도 따라 할 수 있는 사용 가이드.",
      "mod.inside.i7.t": "안전·한계 가이드",
      "mod.inside.i7.d": "어디까지 믿고, 무엇을 사람이 확인할지 정리.",
      "mod.inside.i8.t": "예시 입출력 3종",
      "mod.inside.i8.d": "실제로 어떻게 나오는지 보여주는 샘플.",

      "mod.audience.eyebrow": "For whom",
      "mod.audience.title": "이런 분들께 맞습니다",
      "mod.audience.a1": "1인 창업자 · 인디 개발자",
      "mod.audience.a2": "학생 · 예비 창업자",
      "mod.audience.a3": "소규모 팀 · 스타트업",
      "mod.audience.a4": "프리랜서 · 마케터",
      "mod.audience.a5": "개발자",

      "mod.compare.eyebrow": "Difference",
      "mod.compare.title": "무료 프롬프트와 무엇이 다른가요?",
      "mod.compare.colHead": "구분",
      "mod.compare.colFree": "무료 프롬프트",
      "mod.compare.colMod": "Service Builder Module",
      "mod.compare.r1": "형태",
      "mod.compare.r1.free": "문장 한두 개",
      "mod.compare.r1.mod": "분석·판단·출력·검수 작업 시스템",
      "mod.compare.r2": "결과 일관성",
      "mod.compare.r2.free": "매번 다름",
      "mod.compare.r2.mod": "고정된 출력 구조",
      "mod.compare.r3": "깊이",
      "mod.compare.r3.free": "단편적인 답",
      "mod.compare.r3.mod": "우선순위·작업지시·QA까지 연결",
      "mod.compare.r4": "환경",
      "mod.compare.r4.free": "보통 한 곳",
      "mod.compare.r4.mod": "ChatGPT·Claude·Gemini·Cursor·모바일",
      "mod.compare.r5": "품질 점검",
      "mod.compare.r5.free": "없음",
      "mod.compare.r5.mod": "12항목 루브릭 포함",

      "mod.price.eyebrow": "Pricing",
      "mod.price.title": "한 번 받으면 계속 쓰는 패키지",
      "mod.price.lead": "기존 AI를 더 잘 쓰게 만드는 전문화 레이어입니다. 전문가를 고용하기 전, 저비용으로 1차 결과물을 만들어 보세요.",
      "mod.price.won": "원",
      "mod.price.badge": "추천",
      "mod.price.note": "정식 결제 페이지는 준비 중입니다. 지금은 먼저 사용해보실 수 있도록 Instagram 문의 → 계좌이체로 패키지를 보내드립니다.",
      "mod.price.starter.name": "Starter",
      "mod.price.starter.tag": "개인용 · AI 입문 개인·학생",
      "mod.price.starter.f1": "핵심 모듈 본체",
      "mod.price.starter.f2": "주요 플랫폼 프롬프트",
      "mod.price.starter.f3": "기본 템플릿 · 예시",
      "mod.price.starter.cta": "Starter 받기",
      "mod.price.pro.name": "Pro",
      "mod.price.pro.tag": "개인/팀용 · 실무자·소규모 팀",
      "mod.price.pro.f1": "전체 입력·출력 템플릿",
      "mod.price.pro.f2": "검수 루브릭 12항목",
      "mod.price.pro.f3": "개발 연결 프롬프트",
      "mod.price.pro.f4": "전체 예시 입출력",
      "mod.price.pro.cta": "Pro 받기",
      "mod.price.custom.name": "Custom",
      "mod.price.custom.tag": "기업 맞춤형",
      "mod.price.custom.price": "별도 문의",
      "mod.price.custom.f1": "자사 도메인·브랜드 톤 맞춤",
      "mod.price.custom.f2": "커스터마이징",
      "mod.price.custom.f3": "도입 지원",
      "mod.price.custom.cta": "문의하기",

      "mod.notice.eyebrow": "Before you buy",
      "mod.notice.title": "구매 전, 솔직하게 알려드립니다",
      "mod.notice.n1": "ChatGPT·Claude·Gemini 등 범용 AI 위에서 작동하는 전문화 레이어입니다. (AI 자체는 포함되지 않습니다.)",
      "mod.notice.n2": "앱이나 로그인이 아니라, 복붙해서 쓰는 문서형 패키지입니다.",
      "mod.notice.n3": "AI 결과는 1차 결과물이며, 중요한 결정은 사람이 검토해야 합니다.",
      "mod.notice.n4": "법률·의료·투자·보안 판단은 반드시 전문가 확인이 필요합니다.",
      "mod.notice.n5": "개인정보·API 키·비밀번호는 절대 입력하지 마세요.",

      "mod.faq.eyebrow": "FAQ",
      "mod.faq.title": "자주 묻는 질문",
      "mod.faq.q1": "그냥 프롬프트 모음 아닌가요?",
      "mod.faq.a1": "아닙니다. 분석·판단·출력·검수가 하나로 묶인 작업 시스템이고, 출력 형식이 고정돼 누가 써도 일정한 품질이 나오며, 결과를 점수로 채점하는 루브릭까지 포함됩니다.",
      "mod.faq.q2": "어떤 AI에서 쓰나요?",
      "mod.faq.a2": "ChatGPT·Claude·Gemini·Cursor·모바일 ChatGPT 각각의 버전이 들어 있습니다.",
      "mod.faq.q3": "AI를 잘 몰라도 되나요?",
      "mod.faq.a3": "네. 입력 템플릿의 빈칸만 채워서 보내면 됩니다.",
      "mod.faq.q4": "결과가 항상 정확한가요?",
      "mod.faq.a4": "1차 판단입니다. 모델·버전에 따라 달라질 수 있어, 사람 검토를 전제로 설계했습니다.",
      "mod.faq.q5": "전문가가 필요 없어지나요?",
      "mod.faq.a5": "아닙니다. 전문가를 고용하기 전, 저비용으로 1차 결과물을 만드는 도구입니다.",
      "mod.faq.q6": "환불되나요?",
      "mod.faq.a6": "디지털 콘텐츠 특성상, 판매 채널 정책과 관련 법령을 따릅니다.",

      "mod.final.title": "좋은 프롬프트 찾기를 끝내고, 일정한 결과를 뽑으세요.",

      "mod.sample.eyebrow": "Sample output",
      "mod.sample.title": "샘플 진단 결과",
      "mod.sample.intro": "예시 입력: “동네 베이커리 픽업 예약 웹앱(모바일 위주, 1인 운영).” 아래는 모듈이 실제로 내놓는 출력 형식입니다.",
      "mod.sample.analyze.t": "1 · 분석",
      "mod.sample.analyze.d": "목적은 ‘예약 픽업 전환’, 주 사용자는 모바일로 빠르게 주문하는 단골. 핵심 동선은 메뉴 → 시간 선택 → 결제 확인입니다.",
      "mod.sample.judge.t": "2 · 판단 (우선순위 문제)",
      "mod.sample.judge.l1": "[높음] 픽업 시간 선택이 3단계라 이탈이 큼 — 한 화면 슬롯 선택으로 단축.",
      "mod.sample.judge.l2": "[높음] 가격·재고가 결제 직전에야 노출 — 목록 단계에서 미리 표시.",
      "mod.sample.judge.l3": "[중간] CTA 문구가 ‘확인’으로 모호 — ‘이 시간에 픽업 예약’으로 구체화.",
      "mod.sample.output.t": "3 · 출력 (개선안 · 고정 형식)",
      "mod.sample.output.d": "문제별로 「현상 → 개선안 → 기대효과 → 작업 난이도」를 한 줄로 정리해, 바로 작업 목록으로 옮길 수 있게 합니다.",
      "mod.sample.review.t": "4 · 검수 (12항목 루브릭)",
      "mod.sample.review.d": "명확성·우선순위·실행 가능성 등 12항목을 5점 척도로 채점. 예시 결과: 평균 4.1 / 5, 보완 필요 항목 2개를 함께 표시합니다.",
      "mod.sample.note": "실제 결과는 입력 내용과 AI 모델·버전에 따라 달라집니다. 1차 판단이며 사람 검토를 전제로 합니다.",

      "mod.buy.eyebrow": "Get the module",
      "mod.buy.title": "구매 안내",
      "mod.buy.tierLabel": "선택한 플랜",
      "mod.buy.body": "정식 결제 페이지는 준비 중이라, 지금은 자동 다운로드를 제공하지 않습니다. 먼저 사용해보고 싶다면 Instagram DM으로 문의 주세요. 확인 후 계좌이체로 패키지(zip·노션)를 보내드립니다.",
      "mod.buy.s1": "1. 아래 버튼으로 Instagram DM 문의",
      "mod.buy.s2": "2. 플랜 확인 후 계좌이체 안내",
      "mod.buy.s3": "3. 입금 확인 후 패키지(zip·노션) 전달",
      "mod.buy.note": "개인정보·API 키·비밀번호는 보내지 마세요. 디지털 콘텐츠 특성상 환불은 판매 채널 정책과 관련 법령을 따릅니다.",
      "mod.buy.cta": "Instagram DM으로 문의",
      "mod.modal.close": "닫기",

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
      "why.close": "메인으로 돌아가기",
    },
    en: {
      "nav.about": "About",
      "nav.services": "Services",
      "nav.work": "Work",
      "nav.process": "Process",
      "nav.partners": "Projects",
      "nav.module": "Module",
      "nav.philosophy": "Philosophy",
      "nav.contact": "Contact",
      "nav.sns": "SNS",
      "nav.why": "Why Lunervia",

      "nav.intro.brand": "Brand overview",
      "nav.intro.brand.meta": "What Lunervia is about",
      "nav.intro.philosophy": "Philosophy",
      "nav.intro.philosophy.meta": "How we design our products",
      "nav.intro.projects": "All projects",
      "nav.intro.projects.meta": "Projects & collaborations",
      "nav.intro.why": "Why we built Lunervia",
      "nav.intro.why.meta": "Where the brand starts",

      "back.toMain": "Back to main",
      "back.toMainLong": "Back to main page",

      "hero.eyebrow": "Lunervia — Software Studio",
      "hero.title": "We design web services people find easy to use,<br />and build them into products that actually work.",
      "hero.sub": "A small software studio that turns complex ideas into simple structures, and builds them end to end — from screen to function.",
      "hero.cta.contact": "Start a project",
      "hero.cta.work": "View work",

      "services.label": "Services",
      "services.title": "What Lunervia does",
      "services.lead": "Planning, interface design, front-end, and AI-assisted work. The goal is simple — make one service that works end to end.",
      "services.s1.name": "Web Service Development",
      "services.s1.desc": "We turn ideas into deployable web services — not just screens, but flows that actually work.",
      "services.s2.name": "Frontend System Design",
      "services.s2.desc": "Reusable components and design tokens for a front-end structure that stays easy to maintain.",
      "services.s3.name": "UI/UX Redesign",
      "services.s3.desc": "We restructure tangled screens into clear flows where users never get lost.",
      "services.s4.name": "Landing Page Optimization",
      "services.s4.desc": "We tune speed, message, and conversion flow so visits turn into real enquiries.",
      "services.s5.name": "Brand Experience",
      "services.s5.desc": "Beyond logo and color — a brand experience felt consistently across the whole site.",
      "services.s6.name": "AI Workflow Integration",
      "services.s6.desc": "We weave AI into the build process to ship faster and keep quality consistent.",

      "process.label": "Process",
      "process.title": "The order we work in",
      "process.lead": "Before styling a screen, we map a flow where users won't get lost. Usually in five steps.",
      "process.s1.name": "Discovery",
      "process.s1.desc": "We understand the goal and the users first, then set the scope.",
      "process.s1.state": "Done",
      "process.s2.name": "UX Flow",
      "process.s2.desc": "We design structure and paths so users never get confused.",
      "process.s2.state": "Done",
      "process.s3.name": "Interface System",
      "process.s3.desc": "We compose a consistent interface from design tokens and components.",
      "process.s3.state": "In progress",
      "process.s4.name": "Frontend Build",
      "process.s4.desc": "We build working screens with responsiveness and accessibility in mind.",
      "process.s4.state": "Next",
      "process.s5.name": "Launch & Improve",
      "process.s5.desc": "After launch we keep refining based on real usability.",
      "process.s5.state": "Queued",

      "work.label": "Work",
      "work.title": "Projects we build and experiment on ourselves",
      "work.lead": "Projects Lunervia planned and built in-house. We try to make them work well, stay easy to fix, and last.",
      "work.status.live": "Live",
      "work.lab.status": "Experimenting",
      "work.lab.desc": "An internal space for experimenting with and shaping small web service ideas.",
      "work.lab.role": "Service experiments · UI research · Prototypes",
      "work.lab.foot": "INTERNAL_EXPERIMENT",
      "work.smbest.status": "In preparation",
      "work.smbest.desc": "We're preparing the web experience for a corporate partner we'll work with.",
      "work.smbest.role": "Client · Web service · Brand experience",
      "work.more.name": "More projects",
      "work.more.desc": "Browse the full list of major projects and collaborations.",
      "work.more.cta": "View all projects",

      "trust.title": "What Lunervia cares about",
      "trust.lead":
        "A good site doesn't end at a good-looking screen. It should be easy to understand, actually work, and stay easy to refine over time.",
      "trust.card1.name": "Flows that make sense",
      "trust.card1.desc": "We design the structure and paths first, so users never get lost.",
      "trust.card2.name": "Implementation that works",
      "trust.card2.desc": "Not just mockups — we build web services ready to ship.",
      "trust.card3.name": "Structure built to last",
      "trust.card3.desc": "We build with a structure that stays easy to extend and adjust.",

      "about.label": "About",
      "about.title": "A small software studio turning ideas into real services",
      "about.lead":
        "From planning and interface design to front-end development and flow refinement — we care about the whole process that makes a service actually work.",
      "about.focusLabel": "Focus",
      "about.focusValue": "Web · Frontend · UX design",
      "about.stageValue": "Growing",
      "about.step1.name": "Plan",
      "about.step1.desc": "We shape ideas into a service structure.",
      "about.step2.name": "UX design",
      "about.step2.desc": "We design flows that never confuse the user.",
      "about.step3.name": "UI build",
      "about.step3.desc": "We build screens and interactions that fit the brand.",
      "about.step4.name": "Refine",
      "about.step4.desc": "We keep polishing based on real usability.",

      "philosophy.label": "Philosophy",
      "philosophy.title": "Design Principles",
      "philosophy.big":
        "Experiences that last come before screens that merely impress.",
      "philosophy.card1.kr": "Clarity over complexity",
      "philosophy.card1": "Before adding complex features, we design a flow users can understand.",
      "philosophy.card2.kr": "Interfaces you can rely on",
      "philosophy.card2": "Not just good-looking screens — interfaces that actually run reliably.",
      "philosophy.card3.kr": "A structure that scales",
      "philosophy.card3": "We design with a structure that stays easy to modify and extend.",
      "philosophy.card4.kr": "Every small decision matters",
      "philosophy.card4": "We treat each small decision that shapes the experience with care.",
      "philosophy.cta": "Read more about Lunervia",

      "tml.label": "Featured · Lunervia Work",
      "tml.title": "Send your heart in a letter<br />Take My Letter",
      "tml.desc":
        "A digital letter service for sending your heart — anonymously or by name. It's Lunervia's own web service, planned and built in-house.",
      "tml.role": "Planning · UX · Frontend · Brand",
      "tml.cta": "Open Take My Letter",

      "showcase.label": "Projects",
      "showcase.title": "Projects & Works",
      "showcase.subtitle": "주요 프로젝트 및 협력",
      "showcase.lead":
        "We turn small ideas into services that actually work — projects Lunervia builds, partners with, and experiments on.",
      "showcase.comingSoon": "Coming soon",
      "showcase.label.client": "Client",
      "showcase.label.work": "Lunervia Work",
      "showcase.label.partner": "Partner",
      "showcase.type.client": "Client / Company",
      "showcase.type.work": "Lunervia Work / Original Web Service",
      "showcase.type.partner": "Partner / Creator",
      "showcase.label.lab": "Lab",
      "showcase.type.lab": "Lunervia Lab · Small experiments",
      "showcase.smbest.desc":
        "A major corporate partner we are preparing to work with.",
      "showcase.badajwo.desc":
        "Badajwo — Lunervia's own digital letter service for sending your heart, anonymously or by name.",
      "showcase.badajwo.status": "Live",
      "showcase.badajwo.role": "Planning · UX structure · UI direction · Front-end",
      "showcase.todak.desc":
        "A creator channel sharing the process and journey of building apps through video.",
      "showcase.lab.desc":
        "A space for experimenting with and shaping small web service ideas.",
      "showcase.lab.status": "In preparation",
      "showcase.lab.role": "Service experiments · UI research · Prototypes",

      "contact.label": "Contact",
      "contact.title": "Let's start your project",
      "contact.lead":
        "Even a small idea is welcome. Lunervia helps shape the structure and build it into a real service, together. Enquiries are checked fastest through Instagram DM.",
      "contact.cta.instagram": "Contact via Instagram",
      "contact.cta.propose": "Propose a project",
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

      "mod.hero.eyebrow": "Lunervia Module · Series 01",
      "mod.hero.title": "Not copy-paste prompts —<br />a professional work system for AI.",
      "mod.hero.sub": "Drop it into ChatGPT, Claude, Gemini, or Cursor and anyone gets a consistent-quality service diagnosis. Beginners just fill in the blanks.",
      "mod.hero.ctaSample": "See a sample result",
      "mod.hero.ctaGet": "Get the Service Builder Module",
      "mod.hero.chip.mobile": "Mobile",

      "mod.problem.eyebrow": "Problem",
      "mod.problem.title": "AI is smart, but the output changes every time.",
      "mod.problem.lead": "What you need isn't one well-written sentence — it's a workflow that repeats the same quality.",
      "mod.problem.c1.t": "Rewriting every time",
      "mod.problem.c1.d": "You have to write the prompt from scratch on every ask.",
      "mod.problem.c2.t": "Inconsistent quality",
      "mod.problem.c2.d": "The same question returns different depth and format each time.",
      "mod.problem.c3.t": "No priorities",
      "mod.problem.c3.d": "It never tells you what to fix first.",
      "mod.problem.c4.t": "Hard to hand to dev",
      "mod.problem.c4.d": "Turning the diagnosis into real development work is daunting.",

      "mod.solution.eyebrow": "Solution",
      "mod.solution.title": "Analyze → Judge → Output → Review, in one flow.",
      "mod.solution.lead": "Service diagnosis is bundled into a fixed four-step workflow, so anyone gets the same structured result.",
      "mod.solution.s1.t": "Analyze",
      "mod.solution.s1.d": "It analyzes the service's purpose and users first.",
      "mod.solution.s2.t": "Judge",
      "mod.solution.s2.d": "It sorts 3–5 core issues by evidence and priority.",
      "mod.solution.s3.t": "Output",
      "mod.solution.s3.d": "It organizes design, copy, feature, and mobile-UX fixes in a fixed format.",
      "mod.solution.s4.t": "Review",
      "mod.solution.s4.d": "It scores the result quality against a 12-point rubric.",

      "mod.inside.eyebrow": "What's inside",
      "mod.inside.title": "What's in the package",
      "mod.inside.lead": "Not an app or a login — a document-style package (zip · Notion) you paste and use right away.",
      "mod.inside.i1.t": "Core module",
      "mod.inside.i1.d": "The work-system core, shared across every AI.",
      "mod.inside.i2.t": "Per-platform prompts",
      "mod.inside.i2.d": "Separate versions for ChatGPT · Claude · Gemini · Cursor · Mobile.",
      "mod.inside.i3.t": "Input & output templates",
      "mod.inside.i3.d": "6 input templates / 6 output templates.",
      "mod.inside.i4.t": "12-point review rubric",
      "mod.inside.i4.d": "A checklist to score your own results.",
      "mod.inside.i5.t": "Dev hand-off prompt",
      "mod.inside.i5.d": "Turns the diagnosis straight into Cursor work orders.",
      "mod.inside.i6.t": "Usage & tuning guide",
      "mod.inside.i6.d": "A guide even first-time users can follow.",
      "mod.inside.i7.t": "Safety & limits guide",
      "mod.inside.i7.d": "Where to trust it, and what a human should verify.",
      "mod.inside.i8.t": "3 sample in/outputs",
      "mod.inside.i8.d": "Samples showing exactly how results look.",

      "mod.audience.eyebrow": "For whom",
      "mod.audience.title": "Who it's for",
      "mod.audience.a1": "Solo founders · indie developers",
      "mod.audience.a2": "Students · aspiring founders",
      "mod.audience.a3": "Small teams · startups",
      "mod.audience.a4": "Freelancers · marketers",
      "mod.audience.a5": "Developers",

      "mod.compare.eyebrow": "Difference",
      "mod.compare.title": "How is it different from free prompts?",
      "mod.compare.colHead": "Category",
      "mod.compare.colFree": "Free prompts",
      "mod.compare.colMod": "Service Builder Module",
      "mod.compare.r1": "Form",
      "mod.compare.r1.free": "A sentence or two",
      "mod.compare.r1.mod": "Analyze · judge · output · review system",
      "mod.compare.r2": "Consistency",
      "mod.compare.r2.free": "Different every time",
      "mod.compare.r2.mod": "Fixed output structure",
      "mod.compare.r3": "Depth",
      "mod.compare.r3.free": "Fragmented answers",
      "mod.compare.r3.mod": "Priorities · work orders · QA, all connected",
      "mod.compare.r4": "Environment",
      "mod.compare.r4.free": "Usually one place",
      "mod.compare.r4.mod": "ChatGPT · Claude · Gemini · Cursor · Mobile",
      "mod.compare.r5": "Quality check",
      "mod.compare.r5.free": "None",
      "mod.compare.r5.mod": "Includes a 12-point rubric",

      "mod.price.eyebrow": "Pricing",
      "mod.price.title": "Buy once, keep using it",
      "mod.price.lead": "A specialization layer that makes your existing AI work better. Before hiring an expert, produce a low-cost first draft.",
      "mod.price.won": "KRW",
      "mod.price.badge": "Recommended",
      "mod.price.note": "The official checkout page is in preparation. For now, so you can try it first, inquire via Instagram → we'll send the package by bank transfer.",
      "mod.price.starter.name": "Starter",
      "mod.price.starter.tag": "Personal · AI beginners & students",
      "mod.price.starter.f1": "Core module",
      "mod.price.starter.f2": "Key platform prompts",
      "mod.price.starter.f3": "Basic templates & samples",
      "mod.price.starter.cta": "Get Starter",
      "mod.price.pro.name": "Pro",
      "mod.price.pro.tag": "Personal/team · practitioners & small teams",
      "mod.price.pro.f1": "All input & output templates",
      "mod.price.pro.f2": "12-point review rubric",
      "mod.price.pro.f3": "Dev hand-off prompt",
      "mod.price.pro.f4": "All sample in/outputs",
      "mod.price.pro.cta": "Get Pro",
      "mod.price.custom.name": "Custom",
      "mod.price.custom.tag": "For companies",
      "mod.price.custom.price": "Contact us",
      "mod.price.custom.f1": "Tailored to your domain & brand tone",
      "mod.price.custom.f2": "Customization",
      "mod.price.custom.f3": "Onboarding support",
      "mod.price.custom.cta": "Contact us",

      "mod.notice.eyebrow": "Before you buy",
      "mod.notice.title": "An honest heads-up before you buy",
      "mod.notice.n1": "It's a specialization layer that runs on top of general AI like ChatGPT, Claude, or Gemini. (The AI itself is not included.)",
      "mod.notice.n2": "It's a document-style package you paste and use — not an app or a login.",
      "mod.notice.n3": "AI results are a first draft; important decisions should be reviewed by a person.",
      "mod.notice.n4": "Legal, medical, investment, and security judgments require expert confirmation.",
      "mod.notice.n5": "Never enter personal data, API keys, or passwords.",

      "mod.faq.eyebrow": "FAQ",
      "mod.faq.title": "Frequently asked questions",
      "mod.faq.q1": "Isn't this just a prompt collection?",
      "mod.faq.a1": "No. It's a work system that bundles analyze · judge · output · review, with a fixed output format so anyone gets consistent quality — and it even includes a rubric that scores the result.",
      "mod.faq.q2": "Which AI can I use it with?",
      "mod.faq.a2": "It includes versions for ChatGPT, Claude, Gemini, Cursor, and mobile ChatGPT.",
      "mod.faq.q3": "Do I need to know AI well?",
      "mod.faq.a3": "No. Just fill in the blanks in the input template and send it.",
      "mod.faq.q4": "Are results always accurate?",
      "mod.faq.a4": "It's a first-pass judgment. Results can vary by model and version, so it's designed to assume human review.",
      "mod.faq.q5": "Does it replace experts?",
      "mod.faq.a5": "No. It's a tool for making a low-cost first draft before you hire an expert.",
      "mod.faq.q6": "Can I get a refund?",
      "mod.faq.a6": "As digital content, it follows the sales channel's policy and applicable law.",

      "mod.final.title": "Stop hunting for the perfect prompt — get consistent results.",

      "mod.sample.eyebrow": "Sample output",
      "mod.sample.title": "Sample diagnosis",
      "mod.sample.intro": "Example input: \"A neighborhood bakery pickup-booking web app (mobile-first, run by one person).\" Below is the output format the module actually produces.",
      "mod.sample.analyze.t": "1 · Analyze",
      "mod.sample.analyze.d": "The goal is 'pickup booking conversion'; the main users are regulars ordering quickly on mobile. The core path is menu → time slot → payment confirmation.",
      "mod.sample.judge.t": "2 · Judge (prioritized issues)",
      "mod.sample.judge.l1": "[High] Picking a pickup time takes 3 steps, causing drop-off — shorten it to a single-screen slot picker.",
      "mod.sample.judge.l2": "[High] Price and stock only appear right before payment — show them at the list stage.",
      "mod.sample.judge.l3": "[Medium] The CTA 'Confirm' is vague — make it specific: 'Book pickup at this time.'",
      "mod.sample.output.t": "3 · Output (fixes · fixed format)",
      "mod.sample.output.d": "For each issue it lays out 'symptom → fix → expected effect → effort' in one line, ready to drop straight into a task list.",
      "mod.sample.review.t": "4 · Review (12-point rubric)",
      "mod.sample.review.d": "Scores 12 items — clarity, priority, feasibility, and more — on a 5-point scale. Example result: average 4.1 / 5, with 2 items flagged for improvement.",
      "mod.sample.note": "Actual results vary with your input and the AI model and version. It's a first-pass judgment that assumes human review.",

      "mod.buy.eyebrow": "Get the module",
      "mod.buy.title": "How to get it",
      "mod.buy.tierLabel": "Selected plan",
      "mod.buy.body": "The official checkout page is in preparation, so automatic downloads aren't available yet. If you'd like to try it first, send us a DM on Instagram. After we confirm, we'll send the package (zip · Notion) by bank transfer.",
      "mod.buy.s1": "1. Inquire via Instagram DM using the button below",
      "mod.buy.s2": "2. We confirm your plan and share bank-transfer details",
      "mod.buy.s3": "3. After payment is confirmed, we send the package (zip · Notion)",
      "mod.buy.note": "Please don't send personal data, API keys, or passwords. As digital content, refunds follow the sales channel's policy and applicable law.",
      "mod.buy.cta": "Inquire via Instagram DM",
      "mod.modal.close": "Close",

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

  /* -------- 8b. Showcase marquee — 데이터 + 동적 렌더 + 이미지 폴백 ----
     SHOWCASE 배열의 카드를 한 번 그린 뒤, 끊김 없는 marquee 를 위해
     동일한 세트를 한 번 더 복제(aria-hidden + data-clone="true").
     카드 안 라벨/타입/설명은 data-i18n 으로 채워지므로 이어지는
     applyI18n 호출이 자동으로 텍스트를 매핑합니다.
     새 항목을 추가하고 싶으면 SHOWCASE 배열에 푸시하고, i18n 사전에
     showcase.* 키만 더해주면 됩니다.
  -------------------------------------------------------------------- */
  const SHOWCASE = [
    {
      id: "smbest",
      name: "SMBEST",
      typeKey: "showcase.type.client",
      labelKey: "showcase.label.client",
      descKey: "showcase.smbest.desc",
      image: "assets/brand/client-smbest.png",
      imageAlt: "SMBEST",
      imageStyle: "logo",
      href: null,
      comingSoon: true,
    },
    {
      id: "badajwo",
      name: "받아줘",
      typeKey: "showcase.type.work",
      labelKey: "showcase.label.work",
      descKey: "showcase.badajwo.desc",
      image: "assets/brand/work-badajwo.png",
      imageAlt: "받아줘 — Lunervia Work",
      imageStyle: "icon-rounded",
      href: "https://takemyletter.site",
      statusKey: "showcase.badajwo.status",
      statusSuffix: "takemyletter.site",
      roleKey: "showcase.badajwo.role",
    },
    {
      id: "todak",
      name: "Todak Life",
      typeKey: "showcase.type.partner",
      labelKey: "showcase.label.partner",
      descKey: "showcase.todak.desc",
      avatarType: "default-profile",
      imageAlt: "Todak Life",
      href: "https://www.youtube.com/@Todak_Life",
      instagram: "@todaklife",
    },
    {
      id: "lab",
      name: "Lunervia Lab",
      typeKey: "showcase.type.lab",
      labelKey: "showcase.label.lab",
      descKey: "showcase.lab.desc",
      avatarType: "pixel-lab",
      imageAlt: "Lunervia Lab",
      href: null,
      statusKey: "showcase.lab.status",
      roleKey: "showcase.lab.role",
    },
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function showcaseCardInner(item) {
    let mediaHtml = "";
    if (item.image) {
      const cls = [
        "showcase-card-media",
        item.imageStyle === "icon-rounded" ? "is-icon-rounded" : "",
        item.imageStyle === "logo" ? "is-logo" : "",
      ].filter(Boolean).join(" ");
      mediaHtml = `<div class="${cls}">` +
        `<img class="showcase-card-img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.name)}" loading="lazy" />` +
        `<div class="showcase-card-fallback" aria-hidden="true">${escapeHtml(item.name)}</div>` +
        `</div>`;
    } else if (item.avatarType === "default-profile") {
      mediaHtml = `<div class="showcase-card-media is-avatar" role="img" aria-label="${escapeHtml(item.imageAlt || item.name)}">` +
        `<svg class="showcase-avatar-svg" viewBox="0 0 80 80" aria-hidden="true">` +
          `<circle cx="40" cy="40" r="40" fill="#E8DFCE" />` +
          `<circle cx="40" cy="32" r="11" fill="#8A8378" opacity="0.55" />` +
          `<path d="M16 70 C16 56 26 48 40 48 C54 48 64 56 64 70 Z" fill="#8A8378" opacity="0.55" />` +
        `</svg>` +
        `</div>`;
    } else if (item.avatarType === "pixel-lab") {
      // 픽셀 플라스크 — 히어로 픽셀 개발실과 같은 톤의 미니 일러스트
      mediaHtml = `<div class="showcase-card-media is-pixel" role="img" aria-label="${escapeHtml(item.imageAlt || item.name)}">` +
        `<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">` +
          `<rect x="4" y="0" width="4" height="1" fill="#D8CFC0" />` +
          `<rect x="5" y="1" width="2" height="3" fill="#E5DCC8" />` +
          `<rect x="4" y="4" width="4" height="1" fill="#E5DCC8" />` +
          `<rect x="3" y="5" width="6" height="1" fill="#E5DCC8" />` +
          `<rect x="2" y="6" width="8" height="5" fill="#E5DCC8" />` +
          `<rect x="3" y="7" width="6" height="3" fill="#F2A9C4" />` +
          `<rect x="5" y="8" width="1" height="1" fill="#F9D9E5" />` +
          `<rect x="7" y="7" width="1" height="1" fill="#F9D9E5" />` +
          `<rect x="10" y="2" width="1" height="1" fill="#E8B07B" />` +
          `<rect x="1" y="3" width="1" height="1" fill="#F2A9C4" />` +
        `</svg>` +
        `</div>`;
    }

    let metaHtml = "";
    if (item.statusKey) {
      const suffix = item.statusSuffix ? ` · ${escapeHtml(item.statusSuffix)}` : "";
      metaHtml = `<p class="showcase-card-meta"><span data-i18n="${escapeHtml(item.statusKey)}"></span>${suffix}</p>`;
    } else if (item.comingSoon) {
      metaHtml = `<p class="showcase-card-meta"><span data-i18n="showcase.comingSoon">Coming soon</span></p>`;
    } else if (item.instagram) {
      metaHtml = `<p class="showcase-card-meta">Instagram · ${escapeHtml(item.instagram)}</p>`;
    }

    const arrowHtml = item.href ? '<span class="showcase-card-arrow" aria-hidden="true">↗</span>' : "";

    // 담당 역할 — 포트폴리오 카드의 신뢰 정보 (있는 항목만)
    const roleHtml = item.roleKey
      ? `<p class="showcase-card-role" data-i18n="${escapeHtml(item.roleKey)}"></p>`
      : "";

    const body =
      mediaHtml +
      `<div class="showcase-card-body">` +
        `<span class="showcase-card-label" data-i18n="${escapeHtml(item.labelKey)}"></span>` +
        `<h3 class="showcase-card-name">${escapeHtml(item.name)}</h3>` +
        `<p class="showcase-card-type" data-i18n="${escapeHtml(item.typeKey)}"></p>` +
        `<p class="showcase-card-desc" data-i18n="${escapeHtml(item.descKey)}"></p>` +
        roleHtml +
        metaHtml +
      `</div>` +
      arrowHtml;

    if (item.href) {
      return `<a class="showcase-card-link" href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer">${body}</a>`;
    }
    return `<div class="showcase-card-link is-static" aria-disabled="true">${body}</div>`;
  }

  function renderShowcase() {
    const track = document.getElementById("showcase-track");
    if (!track) return;
    const setHtml = (isClone) =>
      SHOWCASE.map((item) => {
        const cloneAttr = isClone ? ' aria-hidden="true" data-clone="true"' : "";
        return `<li class="showcase-card"${cloneAttr}>${showcaseCardInner(item)}</li>`;
      }).join("");
    track.innerHTML = setHtml(false) + setHtml(true);

    // 이미지 폴백 — 파일이 없으면 카드 안 fallback 텍스트가 자연스럽게 대체
    $$(".showcase-card-media .showcase-card-img").forEach((img) => {
      const media = img.closest(".showcase-card-media");
      wireImageFallback(
        img,
        () => { if (media) media.classList.remove("is-fallback"); },
        () => { if (media) media.classList.add("is-fallback"); }
      );
    });
  }

  renderShowcase();

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

  /* -------- 10. Module 판매 페이지 — 경량 모달 (예시 결과 / 구매 안내) ----
     module-service-builder.html 에서만 동작. 그 외 페이지에는 .module-page
     가 없어 즉시 빠져나감 (renderShowcase / 진행률 바와 같은 가드 패턴).
     FAQ 는 <details> 라 JS 불필요.
  -------------------------------------------------------------------- */
  function initModulePage() {
    if (!$(".module-page")) return;

    let activeModal = null;
    let lastFocus = null;
    let trapHandler = null;

    const modalFocusables = (modal) =>
      $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
        .filter((el) => el.offsetParent !== null);

    function openModal(modal, trigger) {
      if (!modal || activeModal) return;
      activeModal = modal;
      lastFocus = trigger || document.activeElement;
      modal.hidden = false;
      document.body.classList.add("modal-open");
      window.requestAnimationFrame(() => modal.classList.add("is-open"));

      trapHandler = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
          return;
        }
        if (event.key === "Tab") {
          const f = modalFocusables(modal);
          if (!f.length) return;
          const first = f[0];
          const last = f[f.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener("keydown", trapHandler);

      window.setTimeout(() => {
        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) closeBtn.focus();
      }, 60);
    }

    function closeModal() {
      const modal = activeModal;
      if (!modal) return;
      activeModal = null;
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      if (trapHandler) {
        document.removeEventListener("keydown", trapHandler);
        trapHandler = null;
      }
      const finish = () => {
        modal.hidden = true;
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
        lastFocus = null;
      };
      if (prefersReducedMotion) finish();
      else window.setTimeout(finish, 240);
    }

    // 예시 결과 보기
    const sampleModal = $("#sample-modal");
    $$("[data-open-sample]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(sampleModal, btn);
      });
    });

    // 가격 카드 → 구매 안내 모달 (선택 플랜 주입)
    const purchaseModal = $("#purchase-modal");
    const tierWrap = purchaseModal && purchaseModal.querySelector(".buy-tier");
    const tierValue = purchaseModal && purchaseModal.querySelector(".buy-tier-value");
    $$("[data-buy]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        if (tierWrap && tierValue) {
          const tier = btn.getAttribute("data-tier") || "";
          const price = btn.getAttribute("data-price") || "";
          tierValue.textContent = price ? `${tier} · ${price}` : tier;
          tierWrap.hidden = !tier;
        }
        openModal(purchaseModal, btn);
      });
    });

    // 닫기 — X / 배경 / 닫기 버튼.
    // '받기' 앵커(href="#pricing")는 기본 내비를 유지해야 하므로 preventDefault 하지 않음.
    $$("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", () => closeModal());
    });
  }

  initModulePage();
})();
