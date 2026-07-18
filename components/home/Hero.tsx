"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import MoonParticles, { type HeroCamera } from "@/components/MoonParticles";
import { btnPaper, btnGhostDark } from "@/components/ui";

/* 히어로 — "카메라 항행". 트랙(모바일 165svh·데스크톱 190svh)을 스크롤하는
   동안 무대가 핀 고정되고, 진행도 p 가 가상 카메라가 된다.
   · 1막(p 0~0.3): 카피 유지 — 층별 시차만 미세하게 벌어진다
   · 2막(0.3~0.6): 카피가 요소별 다른 속도로 떠나고(계단식 시차+페이드),
     카메라가 달로 접근한다(성단 확대·중앙 하강, 딥필드는 깊이별로 상승)
   · 3막(0.78~1): 종이색 수평선이 곡선으로 떠올라 밤을 닫고 Work(paper)에
     인계한다 — "달로 가는 길"을 스크롤 자체가 연기하는 구조.
   속도 반응: 스크롤 속도 v 가 별을 짧은 궤적으로 늘이고 성단은 관성으로
   따라온다(MoonParticles 쪽 구현).
   rAF 는 히어로에서 1개 — 공유 ref(cam)에 p·v 를 쓰고 캔버스와 타이포
   래퍼가 각자 읽는다. 진입 모션(line-mask·fade-up)은 그대로 유지하되,
   fill-mode 가 inline transform 을 이기므로 스크롤 시차는 별도 래퍼에 건다.
   reduced-motion·낮은 뷰포트(≤500px 높이): 핀 해제(트랙=1화면), 카메라 0. */

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

export default function Hero() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HeroCamera>({ p: 0, v: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cam = camRef.current;
    let raf = 0;
    let running = false;
    let inView = false;
    let lastY = window.scrollY;
    let lastT = 0;
    let vSm = 0;

    /* 레이아웃 캐시 — 프레임마다 getBoundingClientRect 로 레이아웃을 강제하지
       않는다. 트랙 위치·뷰포트는 RO/resize 이벤트에서만 다시 잰다. */
    let trackTop = 0;
    let travel = 1;
    let vh = 1;
    const measure = () => {
      vh = window.innerHeight;
      const rect = track.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      travel = rect.height - vh;
    };

    const setLift = (el: HTMLElement | null, amt: number) => {
      if (el) el.style.transform = `translateY(${amt.toFixed(1)}px)`;
    };

    let lastP = -1;
    let lastVW = 0;
    const apply = (force = false) => {
      /* 핀이 해제된 레이아웃(낮은 뷰포트 CSS 폴백)에서는 카메라를 끈다 */
      if (travel < vh * 0.35) {
        cam.p = 0;
        cam.v = 0;
        return;
      }
      const p = clamp01((window.scrollY - trackTop) / travel);
      cam.p = p;
      /* 변화가 없으면 DOM 을 건드리지 않는다 — 최상단 대기 중 쓰기 0 */
      if (
        !force &&
        Math.abs(p - lastP) < 0.0004 &&
        Math.abs(cam.v - lastVW) < 0.01
      )
        return;
      lastP = p;
      lastVW = cam.v;

      /* 2막 — 계단식 타이포 이탈: 요소마다 다른 속도로 떠오른다 */
      setLift(eyebrowRef.current, -p * 0.1 * vh);
      for (let i = 0; i < lineRefs.current.length; i++) {
        setLift(lineRefs.current[i], -p * (0.16 + i * 0.08) * vh);
      }
      setLift(subRef.current, -p * 0.34 * vh);
      setLift(ctaRef.current, -p * 0.44 * vh);

      const copy = copyRef.current;
      if (copy) {
        const o = 1 - sstep((p - 0.26) / 0.32);
        copy.style.opacity = o.toFixed(3);
        /* 보이지 않는 CTA 가 눌리지 않게 */
        copy.style.pointerEvents = o < 0.35 ? "none" : "";
      }

      /* 3막 — 수평선: translateY 26%(완전 숨김) → 0%(20vh 크레스트) */
      const hz = horizonRef.current;
      if (hz) {
        const rise = sstep((p - 0.78) / 0.22);
        hz.style.transform = `translateY(${(26 * (1 - rise)).toFixed(2)}%)`;
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const y = window.scrollY;
      const dt = lastT ? Math.min(now - lastT, 80) : 16;
      lastT = now;
      vSm += ((y - lastY) / dt - vSm) * 0.12;
      lastY = y;
      cam.v = Math.max(-1, Math.min(1, vSm / 2.5));
      apply();
    };

    const start = () => {
      if (running || document.hidden || !inView) return;
      running = true;
      lastT = 0;
      lastY = window.scrollY;
      vSm = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      vSm = 0;
      cam.v = 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(track);

    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    /* 트랙 크기(svh 변화 포함)·뷰포트가 바뀌면 캐시를 다시 잰다 */
    const ro = new ResizeObserver(() => {
      measure();
      apply(true);
    });
    ro.observe(track);
    const onResize = () => {
      measure();
      apply(true);
    };
    window.addEventListener("resize", onResize);

    measure();
    apply(true);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section ref={trackRef} className="hero-track bg-ink">
      <div className="hero-stage flex items-end overflow-hidden bg-ink text-paper">
        {/* 시그니처 — 히어로 전면이 밤하늘, 스크롤 카메라가 달로 하강한다 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <MoonParticles className="h-full w-full" cameraRef={camRef} />
        </div>

        <div ref={copyRef} className="wrap relative z-10 pt-44 pb-20 md:pb-28">
          <div ref={eyebrowRef} className="will-change-transform">
            <p className="t-label fade-up text-mint/80" style={d(150)}>
              {t.hero.eyebrow}
            </p>
          </div>

          <h1 className="t-hero mt-6" aria-label={t.hero.titleLines.join(" ")}>
            {t.hero.titleLines.map((line, i) => (
              <span
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="line-mask will-change-transform"
                aria-hidden="true"
              >
                <span style={d(280 + i * 150)}>{fmt(line)}</span>
              </span>
            ))}
          </h1>

          <div ref={subRef} className="will-change-transform">
            <p
              className="fade-up mt-7 max-w-xl text-base leading-relaxed text-paper/78 md:text-lg"
              style={d(720)}
            >
              {t.hero.sub}
            </p>
          </div>

          <div ref={ctaRef} className="will-change-transform">
            <div className="fade-up mt-10 flex flex-wrap items-center gap-4" style={d(880)}>
              <Link href="/#contact" className={btnPaper}>
                {t.hero.ctaContact}
              </Link>
              <Link href="/work" className={btnGhostDark}>
                {t.hero.ctaWork}
              </Link>
              <span className="t-label ml-1 inline-flex items-center gap-2 text-paper/70">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mint"
                />
                {t.hero.status}
              </span>
            </div>
          </div>
        </div>

        {/* 3막 — 종이 수평선(넓고 얕은 타원 크레스트)이 밤을 닫는다.
            무대 아래 60vh 만큼 내려 두고 transform 으로만 떠오른다. */}
        <div
          ref={horizonRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-60vh] left-[-50vw] z-20 h-[80vh] w-[200vw] rounded-[50%] bg-paper will-change-transform"
          style={{ transform: "translateY(26%)" }}
        />
      </div>
    </section>
  );
}
