const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const revealItems = document.querySelectorAll(".reveal");
const typedMessage = document.querySelector("#typed-message");
const topStrip = document.querySelector(".top-strip");
const instagramChoices = document.querySelectorAll("[data-instagram-account]");
const instagramProfile = document.querySelector("#instagram-profile");
const instagramProfileLabel = document.querySelector("#instagram-profile-label");
const instagramProfileHandle = document.querySelector("#instagram-profile-handle");
const instagramProfileLink = document.querySelector("#instagram-profile-link");
const contactInstagramPanel = document.querySelector("#instagram-follow-panel");
const followerCount = document.querySelector("#follower-count");
const followingCount = document.querySelector("#following-count");
const statusTabs = document.querySelectorAll("[data-status-tab]");
const statusPanels = document.querySelectorAll("[data-status-panel]");
const examCards = document.querySelectorAll("[data-exam-date]");
const examList = document.querySelector(".exam-list");
const productDetailButtons = document.querySelectorAll(".product-detail-button");
const projectMenus = document.querySelectorAll("[data-project-menu]");
const brandLink = document.querySelector(".brand");
const brandWord = document.querySelector(".brand-word");
const brandL = document.querySelector(".brand-l");
const brandA = document.querySelector(".brand-a");
const animatedHeaderLogo = document.querySelector('[data-lunervia-logo="header"]');
const animatedHeaderLogoLetters = animatedHeaderLogo ? [...animatedHeaderLogo.querySelectorAll(".lunervia-letter")] : [];
const animatedFooterLogos = document.querySelectorAll('[data-lunervia-logo="footer"]');
const refreshFromTopKey = "lunervia-refresh-from-top";
const brandTopTolerance = 1;
const lottieButtonSelector = ".button, .product-detail-button, .status-tab, .menu-toggle, .nav-project-trigger, .contact-email, .instagram-link";
const lottieIconPaths = {
  arrow: "assets/lottieflow/arrow-right.json",
  menu: "assets/lottieflow/menu-nav-11-14.json",
  dropdown: "assets/lottieflow/dropdown.json",
  instagram: "assets/lottieflow/instagram.json",
  message: "assets/lottieflow/message.json",
  scrollDown: "assets/lottieflow/scroll-down.json",
  success: "assets/lottieflow/success.json",
};
const buttonLottieAnimations = new WeakMap();
const activeLottieAnimations = [];
const prefersReducedLottieMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const prefersReducedBrandMotion = prefersReducedLottieMotion;
const prefersCompactLottieMotion = window.matchMedia?.("(max-width: 760px)")?.matches ?? false;
const lottieVisibilityRecords = new WeakMap();
let brandMotionFrame = 0;
let lastBrandAtTop = null;
let examCountdownTimer = null;

const updateTopbarHeight = () => {
  const topbar = document.querySelector(".topbar");

  if (!topbar) {
    return;
  }

  document.documentElement.style.setProperty("--topbar-height", `${Math.ceil(topbar.offsetHeight)}px`);
};

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const scrollToPageTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

if (sessionStorage.getItem(refreshFromTopKey) === "1") {
  sessionStorage.removeItem(refreshFromTopKey);

  if (!window.location.hash) {
    scrollToPageTop();
    requestAnimationFrame(scrollToPageTop);
    window.addEventListener("load", () => requestAnimationFrame(scrollToPageTop), { once: true });
  }
}

const updateBrandShift = ({ force = false } = {}) => {
  if (!brandWord || !brandL || !brandA) {
    return;
  }

  if (!force && !isAtAbsolutePageTop()) {
    return;
  }

  const wasScrolled = document.body.classList.contains("brand-scrolled");
  document.body.classList.add("brand-measuring");
  document.body.classList.remove("brand-scrolled");

  const wordRect = brandWord.getBoundingClientRect();
  const lRect = brandL.getBoundingClientRect();
  const aRect = brandA.getBoundingClientRect();
  const targetLeft = lRect.right - wordRect.left + 4;
  const currentLeft = aRect.left - wordRect.left;

  brandWord.style.setProperty("--brand-a-shift", `${targetLeft - currentLeft}px`);

  document.body.classList.toggle("brand-scrolled", wasScrolled);
  requestAnimationFrame(() => document.body.classList.remove("brand-measuring"));
};

const getPageScroll = () => {
  const scrollingElement = document.scrollingElement || document.documentElement;

  return Math.max(
    window.scrollY || 0,
    window.visualViewport?.pageTop || 0,
    scrollingElement?.scrollTop || 0,
    document.documentElement?.scrollTop || 0,
    document.body?.scrollTop || 0
  );
};

const isAtAbsolutePageTop = () => {
  const bodyTop = document.body?.getBoundingClientRect?.().top ?? -getPageScroll();

  return getPageScroll() <= brandTopTolerance && bodyTop >= -brandTopTolerance;
};

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

const smoothstep = (edge0, edge1, value) => {
  const progress = clamp01((value - edge0) / (edge1 - edge0));

  return progress * progress * (3 - 2 * progress);
};

const headerLogoLetterMotion = {
  L: { scatterX: -0.1, scatterY: -0.08, scatterRotate: -4, compactX: 0, compactY: 0, compactRotate: 0, signature: true },
  U: { scatterX: 0.12, scatterY: 0.08, scatterRotate: 6, compactX: 0.08, compactY: 0, compactRotate: -3, signature: true },
  N: { scatterX: 0.18, scatterY: -0.1, scatterRotate: -5, compactX: -0.18, compactY: -0.04, compactRotate: 4, signature: false },
  E: { scatterX: -0.12, scatterY: 0.1, scatterRotate: 5, compactX: -0.4, compactY: 0.05, compactRotate: -4, signature: false },
  R: { scatterX: 0.12, scatterY: -0.06, scatterRotate: -4, compactX: -0.66, compactY: -0.03, compactRotate: 3, signature: false },
  V: { scatterX: -0.1, scatterY: 0.08, scatterRotate: 4, compactX: -0.92, compactY: 0.06, compactRotate: -3, signature: false },
  I: { scatterX: 0.06, scatterY: -0.1, scatterRotate: -6, compactX: -1.2, compactY: -0.04, compactRotate: 4, signature: false },
  A: { scatterX: 0.2, scatterY: 0.06, scatterRotate: 7, compactX: -3.36, compactY: 0, compactRotate: 2, signature: true },
};

// Header logo motion: progress 0 is the full LUNERVIA wordmark, progress 1 is the compact LUA signature.
const updateAnimatedHeaderLogo = (progress) => {
  if (!animatedHeaderLogo || animatedHeaderLogoLetters.length === 0 || prefersReducedBrandMotion) {
    return;
  }

  const clampedProgress = clamp01(progress);
  const scatterProgress = Math.sin(clampedProgress * Math.PI);
  const compactProgress = smoothstep(0.34, 1, clampedProgress);
  const gap = 0.34 + scatterProgress * 0.07 - compactProgress * 0.16;

  animatedHeaderLogo.style.setProperty("--logo-gap", `${gap.toFixed(3)}em`);
  animatedHeaderLogo.classList.toggle("is-lua-signature", compactProgress > 0.72);

  animatedHeaderLogoLetters.forEach((letter) => {
    const motion = headerLogoLetterMotion[letter.dataset.logoLetter] || headerLogoLetterMotion.L;
    const x = motion.scatterX * scatterProgress + motion.compactX * compactProgress;
    const y = motion.scatterY * scatterProgress + motion.compactY * compactProgress;
    const rotate = motion.scatterRotate * scatterProgress + motion.compactRotate * compactProgress;
    const opacity = motion.signature ? 1 : 1 - compactProgress;
    const scale = motion.signature ? 1 + compactProgress * 0.035 : 1 - compactProgress * 0.08;

    letter.style.opacity = opacity.toFixed(3);
    letter.style.transform = `translate3d(${x.toFixed(3)}em, ${y.toFixed(3)}em, 0) rotate(${rotate.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
  });
};

const updateBrandMotion = () => {
  const isAtPageTop = isAtAbsolutePageTop();
  const wasAtTop = lastBrandAtTop;
  const logoProgress = clamp01(getPageScroll() / 260);

  lastBrandAtTop = isAtPageTop;
  document.body.classList.toggle("brand-scrolled", !isAtPageTop);
  updateAnimatedHeaderLogo(logoProgress);

  if (isAtPageTop && wasAtTop === false) {
    updateBrandShift({ force: true });
  }
};

const requestBrandMotionUpdate = () => {
  if (brandMotionFrame) {
    return;
  }

  brandMotionFrame = requestAnimationFrame(() => {
    brandMotionFrame = 0;
    updateBrandMotion();
  });
};

const isMobileContactView = () => {
  return window.matchMedia?.("(max-width: 760px)")?.matches || window.innerWidth <= 760;
};

const openContactInstagramPanel = ({ scroll = false } = {}) => {
  if (!contactInstagramPanel || !isMobileContactView()) {
    return;
  }

  contactInstagramPanel.classList.add("open");

  if (scroll) {
    requestAnimationFrame(() => {
      contactInstagramPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
};

const maybeOpenContactInstagramPanel = () => {
  if (window.location.hash === "#contact") {
    setTimeout(() => openContactInstagramPanel({ scroll: true }), 180);
  }
};

const normalizeBlankLinkRel = (link) => {
  if (!link || link.getAttribute("target") !== "_blank") {
    return;
  }

  const relTokens = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
  relTokens.add("noopener");
  relTokens.add("noreferrer");
  link.setAttribute("rel", [...relTokens].join(" "));
};

const isProofBoardPage = () => {
  return document.body.classList.contains("proof-page") || window.location.pathname.endsWith("/proof-board.html");
};

const setupLinkPolicies = () => {
  document.querySelectorAll('a[target="_blank"]').forEach(normalizeBlankLinkRel);

  document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach((link) => {
    try {
      const linkUrl = new URL(link.href, window.location.href);

      if (linkUrl.origin !== window.location.origin) {
        link.setAttribute("target", "_blank");
        normalizeBlankLinkRel(link);
      }
    } catch (error) {
      normalizeBlankLinkRel(link);
    }
  });

  document.querySelectorAll('a[href="proof-board.html"], .project-proof-open').forEach((link) => {
    if (isProofBoardPage()) {
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.classList.add("is-current");
      link.setAttribute("aria-current", "page");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
      return;
    }

    link.classList.remove("is-current");
    link.removeAttribute("aria-current");
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
    link.setAttribute("target", "_blank");
    normalizeBlankLinkRel(link);
  });
};

const instagramStats = {
  company: {
    label: "Lunervia 공식 인스타그램",
    handle: "@lunerviasoft",
    url: "https://www.instagram.com/lunerviasoft/",
    button: "공식 인스타그램 열기",
    followers: "확인 필요",
    following: "확인 필요",
  },
  personal: {
    label: "개인 인스타그램",
    handle: "@dksrlqor",
    url: "https://www.instagram.com/dksrlqor/",
    button: "개인 인스타그램 열기",
    followers: "확인 필요",
    following: "확인 필요",
  },
};

const typingMessages = [
  "안녕하세요 ><",
  "아이디어를 실제 서비스로 연결합니다.",
  "웹, 앱, 자동화, AI 연동을 설계합니다.",
  "작지만 현실적인 소프트웨어를 만듭니다.",
  "첫 릴리스를 향해 차분히 준비합니다.",
  "브랜드의 첫 화면과 제품 흐름을 정리합니다.",
  "필요한 기술을 필요한 만큼 연결합니다.",
];

const getLottieButtonType = (button) => {
  if (button.classList.contains("menu-toggle")) {
    return "menu";
  }

  if (button.classList.contains("nav-project-trigger")) {
    return "dropdown";
  }

  if (button.classList.contains("social-button")) {
    return "instagram";
  }

  if (button.classList.contains("contact-email")) {
    return "message";
  }

  if (button.classList.contains("product-detail-button")) {
    return "dropdown";
  }

  if (button.classList.contains("status-tab")) {
    return "success";
  }

  if (button.classList.contains("primary") || button.classList.contains("reason-button")) {
    return "arrow";
  }

  return "arrow";
};

const ensureButtonLabel = (button) => {
  if (button.classList.contains("menu-toggle")) {
    return;
  }

  const existingLabel = button.querySelector(":scope > .button-label");

  if (existingLabel) {
    return;
  }

  const directTextSpan = [...button.children].find((child) => {
    return child.tagName === "SPAN" && !child.classList.contains("button-lottie") && !child.classList.contains("dot");
  });

  if (directTextSpan) {
    directTextSpan.classList.add("button-label");
    return;
  }

  const textNodes = [...button.childNodes].filter((node) => {
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0;
  });

  if (textNodes.length === 0) {
    return;
  }

  const label = document.createElement("span");
  label.className = "button-label";
  textNodes[0].before(label);
  textNodes.forEach((node) => label.appendChild(node));
};

const getLottiePlayback = (iconType) => {
  const playback = {
    arrow: { loop: true, restProgress: 0.68, speed: 0.34 },
    dropdown: { loop: true, restProgress: 0.62, speed: 0.42 },
    instagram: { loop: true, restProgress: 0.54, speed: 0.5 },
    menu: { loop: true, restProgress: 0, speed: 0.42 },
    message: { loop: true, restProgress: 0.62, speed: 0.48 },
    scrollDown: { loop: true, restProgress: 0.5, speed: 0.42 },
    success: { loop: true, restProgress: 0.72, speed: 0.38 },
  };

  return playback[iconType] || { loop: true, restProgress: 0.62, speed: 0.42 };
};

const setLottieRestFrame = (animation, restProgress = 0.62) => {
  if (!animation) {
    return;
  }

  const totalFrames = animation.totalFrames || animation.getDuration?.(true) || 60;
  const restFrame = Math.max(0, Math.floor(totalFrames * restProgress));

  animation.goToAndStop?.(restFrame, true);
};

const lottieViewportObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const record = lottieVisibilityRecords.get(entry.target);

            if (!record) {
              return;
            }

            record.inView = entry.isIntersecting;

            if (!record.config.loop || prefersReducedLottieMotion) {
              return;
            }

            if (entry.isIntersecting) {
              record.animation.play?.();
              return;
            }

            record.animation.pause?.();
          });
        },
        {
          rootMargin: "120px 0px",
          threshold: 0.01,
        }
      )
    : null;

const playButtonLottie = (button) => {
  const record = buttonLottieAnimations.get(button);

  if (!record || record.disabled || prefersReducedLottieMotion) {
    return;
  }

  record.animation.setDirection?.(1);

  if (!record.config.loop) {
    record.animation.goToAndStop?.(0, true);
  }

  record.animation.play?.();
};

const registerLoopingLottie = (animation, target, config) => {
  const record = {
    animation,
    config,
    inView: !lottieViewportObserver,
    target,
  };

  activeLottieAnimations.push(record);

  if (target && lottieViewportObserver) {
    lottieVisibilityRecords.set(target, record);
    lottieViewportObserver.observe(target);
  }

  return record;
};

const wakeLoopingLotties = () => {
  activeLottieAnimations.forEach((record) => {
    if (record.disabled || !record.config.loop || prefersReducedLottieMotion || record.inView === false) {
      return;
    }

    record.animation.setDirection?.(1);
    record.animation.play?.();
  });
};

const removeLottieEnhancement = (button, icon, record = null) => {
  if (record) {
    record.disabled = true;
  }

  if (icon && lottieViewportObserver) {
    lottieViewportObserver.unobserve(icon);
    lottieVisibilityRecords.delete(icon);
  }

  icon?.remove();
  button.classList.remove("lottie-enhanced");
  button.classList.add("lottie-fallback");
  delete button.dataset.lottieIcon;
  buttonLottieAnimations.delete(button);
};

const setupLottieButtons = () => {
  if (!window.lottie) {
    document.body.classList.add("lottie-unavailable");
    return;
  }

  document.querySelectorAll(lottieButtonSelector).forEach((button) => {
    if (button.classList.contains("lottie-enhanced")) {
      return;
    }

    if (button.matches(".contact-actions > .instagram-app-link")) {
      return;
    }

    if (button.closest("body:not(.projects-page) #home > .section-products")) {
      return;
    }

    const iconType = getLottieButtonType(button);
    const iconPath = lottieIconPaths[iconType];

    if (!iconPath) {
      return;
    }

    ensureButtonLabel(button);

    const icon = document.createElement("span");
    icon.className = "button-lottie";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.lottieIcon = iconType;

    button.classList.add("lottie-enhanced");
    button.dataset.lottieIcon = iconType;
    button.appendChild(icon);

    const playback = getLottiePlayback(iconType);
    let animation = null;

    try {
      animation = window.lottie.loadAnimation({
        container: icon,
        renderer: "svg",
        loop: playback.loop,
        autoplay: false,
        path: iconPath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });
    } catch (error) {
      removeLottieEnhancement(button, icon);
      return;
    }

    if (!animation?.addEventListener) {
      removeLottieEnhancement(button, icon);
      return;
    }

    animation.setSpeed(playback.speed * (prefersCompactLottieMotion ? 0.72 : 1));
    const record = registerLoopingLottie(animation, icon, playback);
    buttonLottieAnimations.set(button, record);
    animation.addEventListener("data_failed", () => removeLottieEnhancement(button, icon, record));

    if (!playback.loop) {
      button.addEventListener("pointerenter", () => playButtonLottie(button), { passive: true });
      button.addEventListener("focus", () => playButtonLottie(button));
      animation.addEventListener("complete", () => setLottieRestFrame(animation, playback.restProgress));
    }

    animation.addEventListener("DOMLoaded", () => {
      icon.classList.add("is-ready");
      setLottieRestFrame(animation, playback.restProgress);

      if (playback.loop && !prefersReducedLottieMotion && record.inView) {
        playButtonLottie(button);
      }
    });
  });
};

const setupScrollCueLottie = () => {
  const scrollCues = document.querySelectorAll(".reason-scroll-lottie");

  if (!scrollCues.length || !window.lottie) {
    return;
  }

  scrollCues.forEach((cue) => {
    const playback = getLottiePlayback("scrollDown");
    let animation = null;

    try {
      animation = window.lottie.loadAnimation({
        container: cue,
        renderer: "svg",
        loop: playback.loop,
        autoplay: false,
        path: lottieIconPaths.scrollDown,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });
    } catch (error) {
      cue.classList.add("is-fallback");
      return;
    }

    if (!animation?.addEventListener) {
      cue.classList.add("is-fallback");
      return;
    }

    animation.setSpeed(playback.speed);
    const record = registerLoopingLottie(animation, cue, playback);
    animation.addEventListener("data_failed", () => {
      record.disabled = true;
      cue.classList.add("is-fallback");
    });

    animation.addEventListener("DOMLoaded", () => {
      cue.classList.add("is-ready");
      setLottieRestFrame(animation, playback.restProgress);

      if (!prefersReducedLottieMotion && record.inView) {
        animation.play();
      }
    });
  });
};

const setupInstagramFooterLotties = () => {
  const footerIcons = document.querySelectorAll(".instagram-footer-icon");

  if (!footerIcons.length || !window.lottie) {
    return;
  }

  footerIcons.forEach((icon) => {
    if (icon.querySelector(".instagram-footer-lottie")) {
      return;
    }

    const lottieMount = document.createElement("span");
    lottieMount.className = "instagram-footer-lottie";
    lottieMount.setAttribute("aria-hidden", "true");
    icon.appendChild(lottieMount);

    const playback = getLottiePlayback("instagram");
    let animation = null;

    try {
      animation = window.lottie.loadAnimation({
        container: lottieMount,
        renderer: "svg",
        loop: playback.loop,
        autoplay: false,
        path: lottieIconPaths.instagram,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });
    } catch (error) {
      lottieMount.remove();
      icon.classList.add("is-fallback");
      return;
    }

    if (!animation?.addEventListener) {
      lottieMount.remove();
      icon.classList.add("is-fallback");
      return;
    }

    animation.setSpeed(playback.speed * (prefersCompactLottieMotion ? 0.72 : 1));
    const record = registerLoopingLottie(animation, lottieMount, playback);

    animation.addEventListener("data_failed", () => {
      record.disabled = true;
      lottieMount.remove();
      icon.classList.add("is-fallback");
    });

    animation.addEventListener("DOMLoaded", () => {
      icon.classList.add("has-lottie");
      lottieMount.classList.add("is-ready");
      setLottieRestFrame(animation, playback.restProgress);

      if (!prefersReducedLottieMotion && record.inView) {
        animation.play?.();
      }
    });
  });
};

const setupAnimatedFooterLogos = () => {
  if (!animatedFooterLogos.length) {
    return;
  }

  if (prefersReducedBrandMotion || !("IntersectionObserver" in window)) {
    animatedFooterLogos.forEach((logo) => logo.classList.add("is-assembled"));
    return;
  }

  const footerLogoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-assembled");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.22,
    }
  );

  animatedFooterLogos.forEach((logo) => footerLogoObserver.observe(logo));
};

window.addEventListener("pageshow", wakeLoopingLotties);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    wakeLoopingLotties();
  }
});
window.addEventListener("load", () => setTimeout(wakeLoopingLotties, 250), { once: true });

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    closeProjectMenus();
    wakeLoopingLotties();
    requestAnimationFrame(updateTopbarHeight);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("project-proof-open")) {
        return;
      }

      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "메뉴 열기");
      closeProjectMenus();
      requestAnimationFrame(updateTopbarHeight);

      if (link.getAttribute("href") === "#contact") {
        setTimeout(() => openContactInstagramPanel({ scroll: true }), 120);
      }
    });
  });
}

document.querySelectorAll('a[href="#contact"]').forEach((link) => {
  link.addEventListener("click", () => {
    setTimeout(() => openContactInstagramPanel({ scroll: true }), 160);
  });
});

setupLinkPolicies();

window.addEventListener("hashchange", maybeOpenContactInstagramPanel);
window.addEventListener("pageshow", maybeOpenContactInstagramPanel);
maybeOpenContactInstagramPanel();

if (brandLink) {
  brandLink.addEventListener("click", (event) => {
    event.preventDefault();

    const targetUrl = new URL(brandLink.getAttribute("href") || window.location.href, window.location.href);
    targetUrl.hash = "";
    const currentUrl = new URL(window.location.href);
    const isSamePage = targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search;

    scrollToPageTop();

    if (isSamePage) {
      window.history.replaceState(null, "", targetUrl.pathname + targetUrl.search);
      return;
    }

    sessionStorage.setItem(refreshFromTopKey, "1");
    window.location.href = targetUrl.href;
  });
}

updateBrandShift({ force: true });
updateTopbarHeight();
updateBrandMotion();
window.addEventListener("resize", () => {
  if (isAtAbsolutePageTop()) {
    updateBrandShift({ force: true });
  }
  updateTopbarHeight();
  updateBrandMotion();
});
window.addEventListener("load", updateTopbarHeight, { once: true });
document.fonts?.ready.then(() => {
  if (isAtAbsolutePageTop()) {
    updateBrandShift({ force: true });
  }
  updateTopbarHeight();
  updateBrandMotion();
});
window.addEventListener("scroll", requestBrandMotionUpdate, { passive: true });
document.addEventListener("scroll", requestBrandMotionUpdate, { passive: true, capture: true });
window.addEventListener("wheel", requestBrandMotionUpdate, { passive: true });
window.addEventListener("touchmove", requestBrandMotionUpdate, { passive: true });
window.addEventListener("pageshow", requestBrandMotionUpdate);
window.addEventListener("orientationchange", () => {
  requestBrandMotionUpdate();
  setTimeout(updateTopbarHeight, 120);
});

if (followerCount && followingCount) {
  followerCount.textContent = instagramStats.company.followers;
  followingCount.textContent = instagramStats.company.following;
}

const openInstagramProfile = (accountKey) => {
  if (!instagramProfile) {
    return;
  }

  const account = instagramStats[accountKey];

  if (instagramProfile.classList.contains("open") && instagramProfile.dataset.activeAccount === accountKey) {
    instagramProfile.classList.remove("open");
    instagramProfile.dataset.activeAccount = "";
    return;
  }

  if (account) {
    if (instagramProfileLabel) {
      instagramProfileLabel.textContent = account.label;
    }

    if (instagramProfileHandle) {
      instagramProfileHandle.textContent = account.handle;
    }

    if (instagramProfileLink) {
      instagramProfileLink.href = account.url;
      instagramProfileLink.textContent = account.button;
    }

    if (followerCount) {
      followerCount.textContent = account.followers;
    }

    if (followingCount) {
      followingCount.textContent = account.following;
    }
  }

  instagramProfile.dataset.activeAccount = accountKey;
  instagramProfile.classList.add("open");
  instagramProfile.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

instagramChoices.forEach((choice) => {
  choice.addEventListener("click", (event) => {
    event.stopPropagation();
    openInstagramProfile(choice.dataset.instagramAccount);
  });
});

const syncStatusTabs = (selectedTab = null) => {
  if (!statusTabs.length || !statusPanels.length) {
    return;
  }

  const activeTab = selectedTab || [...statusTabs].find((tab) => tab.classList.contains("active")) || statusTabs[0];
  const target = activeTab?.dataset.statusTab;

  statusTabs.forEach((tab) => {
    const isActive = tab === activeTab;
    const panel = [...statusPanels].find((item) => item.dataset.statusPanel === tab.dataset.statusTab);
    const tabId = tab.id || `status-tab-${tab.dataset.statusTab}`;

    tab.id = tabId;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
    tab.classList.toggle("active", isActive);

    if (panel) {
      const panelId = panel.id || `status-panel-${tab.dataset.statusTab}`;
      panel.id = panelId;
      tab.setAttribute("aria-controls", panelId);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
    }
  });

  statusPanels.forEach((panel) => {
    const isActive = panel.dataset.statusPanel === target;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
};

statusTabs.forEach((tab) => {
  tab.addEventListener("click", () => syncStatusTabs(tab));
});
syncStatusTabs();

const setButtonLabelText = (button, text) => {
  const label = button.querySelector(".button-label");

  if (label) {
    label.textContent = text;
    return;
  }

  const textNode = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

  if (textNode) {
    textNode.textContent = text;
    return;
  }

  button.prepend(document.createTextNode(text));
};

const setProductDetailOpen = (button, isOpen) => {
  const card = button.closest(".product-card");
  const detail = card?.querySelector(".product-detail");

  if (!card || !detail) {
    return;
  }

  card.classList.toggle("open", isOpen);
  button.classList.toggle("is-open", isOpen);
  button.setAttribute("aria-expanded", String(isOpen));
  detail.setAttribute("aria-hidden", String(!isOpen));
  setButtonLabelText(button, isOpen ? "요약 닫기" : "기획 요약 보기");
};

productDetailButtons.forEach((button, index) => {
  const card = button.closest(".product-card");
  const detail = card?.querySelector(".product-detail");

  if (detail) {
    detail.id = detail.id || `product-detail-${index + 1}`;
    detail.setAttribute("aria-hidden", String(!card?.classList.contains("open")));
    button.setAttribute("aria-controls", detail.id);
    button.setAttribute("aria-expanded", String(Boolean(card?.classList.contains("open"))));
  }

  button.addEventListener("click", () => {
    const isOpen = !button.closest(".product-card")?.classList.contains("open");
    setProductDetailOpen(button, isOpen);
  });
});

const closeProjectMenus = (exceptMenu = null) => {
  projectMenus.forEach((menu) => {
    if (menu === exceptMenu) {
      return;
    }

    const trigger = menu.querySelector(".nav-project-trigger");
    const panel = menu.querySelector(".project-proof-panel");

    menu.classList.remove("open");
    trigger?.setAttribute("aria-expanded", "false");

    if (panel) {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
    }
  });
};

closeProjectMenus();
window.addEventListener("pageshow", () => closeProjectMenus());

projectMenus.forEach((menu) => {
  const trigger = menu.querySelector(".nav-project-trigger");
  const panel = menu.querySelector(".project-proof-panel");

  if (!trigger || !panel) {
    return;
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const shouldOpen = !menu.classList.contains("open");

    closeProjectMenus(menu);
    menu.classList.toggle("open", shouldOpen);
    trigger.setAttribute("aria-expanded", String(shouldOpen));
    panel.hidden = !shouldOpen;
    panel.setAttribute("aria-hidden", String(!shouldOpen));
    wakeLoopingLotties();
  });
});

document.querySelectorAll(".project-proof-open").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("aria-disabled") === "true" || link.classList.contains("is-current")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    link.setAttribute("target", "_blank");
    normalizeBlankLinkRel(link);
    const url = link.href || link.getAttribute("href");
    const opened = url ? window.open("about:blank", "_blank") : null;

    if (opened) {
      opened.opener = null;
      opened.location.href = url;
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    window.setTimeout(() => {
      closeProjectMenus();

      if (menuToggle && nav) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
        requestAnimationFrame(updateTopbarHeight);
      }
    }, 0);
  }, { capture: true });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-project-menu]")) {
    closeProjectMenus();
  }

  if (menuToggle && nav && nav.classList.contains("open") && !event.target.closest(".topbar")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
    requestAnimationFrame(updateTopbarHeight);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectMenus();

    if (menuToggle && nav) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "메뉴 열기");
      requestAnimationFrame(updateTopbarHeight);
    }
  }
});

setupLottieButtons();
setupScrollCueLottie();
setupInstagramFooterLotties();
setupAnimatedFooterLogos();

const updateExamCountdowns = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  examCards.forEach((card) => {
    const targetDate = new Date(card.dataset.examDate);
    const daysTarget = card.querySelector("[data-countdown-days]");
    const hoursTarget = card.querySelector("[data-countdown-total-hours]");
    const minutesTarget = card.querySelector("[data-countdown-minutes]");
    const secondsTarget = card.querySelector("[data-countdown-seconds]");

    if (!daysTarget || !hoursTarget || !minutesTarget || !secondsTarget) {
      return;
    }

    if (Number.isNaN(targetDate.getTime())) {
      daysTarget.textContent = "날짜 확인";
      hoursTarget.textContent = "0";
      minutesTarget.textContent = "0";
      secondsTarget.textContent = "0";
      return;
    }

    const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const diff = targetDate - now;
    const dayDiff = Math.ceil((targetDay - today) / 86400000);

    if (diff <= 0) {
      daysTarget.textContent = "D-Day";
      hoursTarget.textContent = "0";
      minutesTarget.textContent = "0";
      secondsTarget.textContent = "0";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const totalHours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysTarget.textContent = `D-${dayDiff}`;
    hoursTarget.textContent = totalHours.toLocaleString("ko-KR");
    minutesTarget.textContent = minutes;
    secondsTarget.textContent = seconds;
  });
};

if (examCards.length > 0 && examList) {
  [...examCards]
    .sort((a, b) => {
      const aTime = new Date(a.dataset.examDate).getTime();
      const bTime = new Date(b.dataset.examDate).getTime();

      return (Number.isNaN(aTime) ? Number.POSITIVE_INFINITY : aTime) - (Number.isNaN(bTime) ? Number.POSITIVE_INFINITY : bTime);
    })
    .forEach((card) => {
      examList.appendChild(card);
    });

  updateExamCountdowns();
  examCountdownTimer = setInterval(updateExamCountdowns, 1000);
}

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.18,
        }
      )
    : null;

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;

  if (revealObserver) {
    revealObserver.observe(item);
    return;
  }

  item.classList.add("visible");
});

if (typedMessage) {
  let messageIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const currentMessage = typingMessages[messageIndex];
    typedMessage.textContent = currentMessage.slice(0, charIndex);

    if (!isDeleting && charIndex < currentMessage.length) {
      charIndex += 1;
      setTimeout(typeLoop, 85);
      return;
    }

    if (!isDeleting && charIndex === currentMessage.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1300);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeLoop, 45);
      return;
    }

    isDeleting = false;
    messageIndex = (messageIndex + 1) % typingMessages.length;
    setTimeout(typeLoop, 260);
  };

  typeLoop();
}
