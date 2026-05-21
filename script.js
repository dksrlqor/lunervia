/* ============================================================
   LUNERVIA — quiet brand site (additive beige SPA shell)
   - 5-뷰 라우팅 (home / products / why / contact / archive)
   - hero 안 코딩 콘솔 타이핑 ('안녕하세요 ><')
   - 모바일 메뉴 토글 (CSS 햄버거, 열림 시 X 변형)
   - 제품 카드 펼치기/접기
   - Instagram href 자리 (href="#") 클릭 시 부드러운 안내

   기존 standalone 페이지(projects/proof-board/reason/study-room/
   updates) 는 script_backup.js 를 따로 쓰므로 이 파일은
   해당 페이지에 영향을 주지 않습니다.
   ============================================================ */

/* -------- 0. 공통 -------- */
const VIEWS = ["home", "products", "why", "contact", "archive"];
const DEFAULT_VIEW = "home";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------- 1. 뷰 라우팅 -------- */
const viewSections = $$("[data-view]");
const navLinks = $$(".nav a[data-goto]");

const viewFromHash = () => {
  const hash = (location.hash || "").replace(/^#/, "");
  return VIEWS.includes(hash) ? hash : DEFAULT_VIEW;
};

const pageTitleFor = (name) => {
  switch (name) {
    case "products":
      return "Products — LUNERVIA";
    case "why":
      return "Why LUNERVIA";
    case "contact":
      return "Instagram Contact — LUNERVIA";
    case "archive":
      return "Archive — LUNERVIA";
    default:
      return "LUNERVIA — quiet software for meaningful ideas";
  }
};

const updateNavCurrent = (name) => {
  navLinks.forEach((a) => {
    const isCurrent = a.dataset.goto === name && name !== "home";
    a.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
};

const setView = (name) => {
  const target = VIEWS.includes(name) ? name : DEFAULT_VIEW;

  viewSections.forEach((sec) => {
    sec.classList.toggle("is-active", sec.dataset.view === target);
  });

  updateNavCurrent(target);
  document.title = pageTitleFor(target);
  window.scrollTo({ top: 0, behavior: "auto" });

  if (target === "home") {
    startHeroTerminal();
  }

  closeMobileMenu();
};

/* -------- 2. 메뉴/버튼 클릭 → 뷰 전환 -------- */
$$("[data-goto]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    const target = el.dataset.goto;

    if (target === "home") {
      // 홈으로 갈 때는 hash 를 비웁니다.
      if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      setView("home");
      return;
    }

    if (location.hash === `#${target}`) {
      // 같은 메뉴 재클릭 — 위로 스크롤만
      window.scrollTo({ top: 0, behavior: "auto" });
      setView(target);
      return;
    }

    location.hash = `#${target}`; // hashchange 가 setView 를 호출
  });
});

window.addEventListener("hashchange", () => setView(viewFromHash()));

/* -------- 3. 모바일 메뉴 -------- */
const menuToggle = $(".menu-toggle");
const nav = $(".nav");

function closeMobileMenu() {
  if (!nav || !menuToggle) return;
  if (!nav.classList.contains("is-open")) return;
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "메뉴 열기");
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.target.closest(".topbar-inner")) return;
    closeMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
}

/* -------- 4. Hero 코딩 콘솔 타이핑 -------- */
const HERO_TYPING_TEXT = "안녕하세요 ><";
const HERO_TYPE_SPEED = 70; // ms / char

let heroTerminalStarted = false;

function startHeroTerminal() {
  const target = document.getElementById("terminal-typed");
  if (!target || heroTerminalStarted) return;
  heroTerminalStarted = true;

  if (prefersReducedMotion) {
    target.textContent = HERO_TYPING_TEXT;
    return;
  }

  let index = 0;
  const tick = () => {
    target.textContent = HERO_TYPING_TEXT.slice(0, index);
    if (index < HERO_TYPING_TEXT.length) {
      index += 1;
      window.setTimeout(tick, HERO_TYPE_SPEED);
    }
  };
  tick();
}

/* -------- 5. 제품 카드 펼치기/접기 -------- */
$$(".product-more").forEach((btn) => {
  const card = btn.closest(".product-card");
  const detail = card?.querySelector(".product-detail");
  if (!detail) return;

  btn.setAttribute("aria-expanded", "false");

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    const next = !isOpen;
    btn.setAttribute("aria-expanded", String(next));
    detail.hidden = !next;
    const labelEl = btn.querySelector("span:first-child");
    if (labelEl) {
      labelEl.textContent = next ? "닫기" : "자세히 보기";
    }
  });
});

/* -------- 6. Instagram 링크 안내
   실제 URL 이 아직 안 들어간 a 태그(href="#") 클릭 시 부드럽게
   알려줍니다. 정식 URL 을 href 자리에 넣으면 자동으로 정상 동작.
   ---------- */
$$('a[data-ig-link]').forEach((a) => {
  a.addEventListener("click", (event) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") {
      event.preventDefault();
      const which = a.dataset.igLink;
      console.info(
        `[Lunervia] Instagram URL 이 아직 비어 있습니다. <a data-ig-link="${which}"> 의 href="#" 자리에 인스타그램 주소를 넣어주세요.`
      );
    }
  });
});

/* -------- 7. 초기 부트 -------- */
setView(viewFromHash());
