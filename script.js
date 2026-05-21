/* ============================================================
   LUNERVIA — quiet brand site
   - 4-뷰 SPA 라우팅 (Home / Products / Why / Contact)
   - hero 내부 타이핑 모션 ('안녕하세요 ><')
   - 모바일 메뉴 토글
   - 제품 카드 펼치기/접기
   - Contact 폼 (백엔드 자리만 분리되어 있음)
   ============================================================ */

/* -------- 0. 공통 -------- */
const VIEWS = ["home", "products", "why", "contact"];
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
    startHeroTyping();
  }

  closeMobileMenu();
};

const pageTitleFor = (name) => {
  switch (name) {
    case "products":
      return "Products — LUNERVIA";
    case "why":
      return "Why LUNERVIA";
    case "contact":
      return "Contact — LUNERVIA";
    default:
      return "LUNERVIA — quiet software for meaningful ideas";
  }
};

/* -------- 2. 메뉴 / 버튼 클릭 → 뷰 전환 -------- */
$$("[data-goto]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    const target = el.dataset.goto;

    if (target === "home") {
      // 홈으로 갈 때는 hash 를 깨끗이 비웁니다.
      if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      setView("home");
      return;
    }

    if (location.hash === `#${target}`) {
      // 같은 메뉴를 다시 누르면 그 자리에서 스크롤만 위로
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

/* -------- 4. Hero 인트로 타이핑 ('안녕하세요 ><') -------- */
const HERO_TYPING_TEXT = "안녕하세요 ><";
const HERO_TYPE_SPEED = 70; // ms / char

let heroTypingStarted = false;

function startHeroTyping() {
  const target = document.getElementById("hero-typed");
  if (!target || heroTypingStarted) return;
  heroTypingStarted = true;

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

/* -------- 6. Contact 폼 -------- */
const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");
const contactError = document.getElementById("contact-error");
const contactReset = document.getElementById("contact-reset");

/**
 * 실제 백엔드 연동 자리.
 * fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) })
 * 같은 코드로 교체하시면 됩니다.
 */
async function sendContactMessage(payload) {
  // 데모 모드 — 짧은 지연 후 성공으로 응답합니다.
  // 콘솔에서도 확인할 수 있도록 payload 를 찍어둡니다.
  console.info("[contact] payload", payload);
  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ ok: true }), 320);
  });
}

const showFormError = (text) => {
  if (!contactError) return;
  contactError.textContent = text;
  contactError.hidden = false;
};

const clearFormError = () => {
  if (!contactError) return;
  contactError.textContent = "";
  contactError.hidden = true;
};

if (contactForm && contactSuccess) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormError();

    const fd = new FormData(contactForm);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      topic: String(fd.get("topic") || ""),
      message: String(fd.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      showFormError("이름·이메일·메시지를 모두 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      showFormError("이메일 형식을 확인해주세요.");
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const result = await sendContactMessage(payload);
      if (result && result.ok) {
        contactForm.hidden = true;
        contactSuccess.hidden = false;
        contactForm.reset();
      } else {
        showFormError("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (err) {
      console.error(err);
      showFormError("전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  if (contactReset) {
    contactReset.addEventListener("click", () => {
      contactSuccess.hidden = true;
      contactForm.hidden = false;
      const firstField = contactForm.querySelector("input, textarea, select");
      firstField?.focus();
    });
  }
}

/* -------- 7. 초기 부트 -------- */
setView(viewFromHash());
