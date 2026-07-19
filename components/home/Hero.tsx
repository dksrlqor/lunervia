"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { btnPaper, btnGhostDark } from "@/components/ui";

/* 히어로 "퍼스트 빌드" — 흩어진 어절과 인터페이스 조각이 가이드라인을 타고
   조립되고, 펄스가 흘러 시스템이 실행되는 오프닝(데스크톱 ~5.2s, 모바일 ~3.2s).
   이후에는 7초에 한 번 흐르는 옅은 펄스와 LIVE 도트 호흡만 남는다.

   구성 레이어(각각 rAF 1개가 포인터 시차·스크롤 분해를 합성):
   · guides — 청사진 가이드라인 SVG (시차 ±3px, 이탈 -0.03y)
   · copy   — 카피 칼럼            (시차 ±6px, 이탈 -0.06y)
   · cardL  — 빌드 무대            (시차 ∓10px, 이탈 -0.12y + scale)
   안무 자체는 CSS 키프레임(globals.css fb-*) — transform/opacity 만.
   FLIP 역변환: 레이아웃은 처음부터 최종 위치, 어절은 transform 으로만
   산개했다가 제자리로 오므로 CLS 0.
   reduced-motion: 오프닝·펄스·시차 전부 없이 처음부터 완성 화면.
   리플레이(데스크톱): key 리마운트로 전체 시퀀스 재생. */

/* 어절 산개 좌표 — 인덱스 순환. 화면을 크게 가로지르도록 과감하게. */
const SCATTER = [
  { x: "-38vw", y: "-14vh", r: "-5deg", s: 1.9 },
  { x: "46vw", y: "-26vh", r: "4deg", s: 2.3 },
  { x: "16vw", y: "32vh", r: "-3deg", s: 1.7 },
  { x: "56vw", y: "6vh", r: "6deg", s: 2.0 },
  { x: "28vw", y: "-6vh", r: "-8deg", s: 2.6 },
  { x: "-26vw", y: "24vh", r: "3deg", s: 1.6 },
  { x: "40vw", y: "20vh", r: "-4deg", s: 1.8 },
  { x: "-30vw", y: "-22vh", r: "5deg", s: 2.1 },
  { x: "22vw", y: "-30vh", r: "-6deg", s: 1.7 },
  { x: "-18vw", y: "12vh", r: "4deg", s: 1.9 },
];

const wordVars = (i: number): CSSProperties => {
  const sc = SCATTER[i % SCATTER.length];
  return {
    "--fx": sc.x,
    "--fy": sc.y,
    "--fr": sc.r,
    "--fs": sc.s,
    "--wd": `${0.5 + i * 0.15}s`,
    "--mfx": i % 2 ? "62vw" : "-62vw",
    "--mfr": i % 2 ? "3deg" : "-3deg",
    "--mwd": `${0.35 + i * 0.14}s`,
  } as CSSProperties;
};

/* 오프닝 시점(초) — 데스크톱/모바일 쌍 */
const at = (wd: number, mwd: number): CSSProperties =>
  ({ "--wd": `${wd}s`, "--mwd": `${mwd}s` }) as CSSProperties;

export default function Hero() {
  const { t } = useI18n();
  const b = t.hero.build;
  const [run, setRun] = useState(0);

  const sceneRef = useRef<HTMLElement>(null);
  const guidesRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cardLRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  /* rAF 1개 — 포인터 시차(lerp) + 스크롤 분해 + 카드 근접 반응 */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scene = sceneRef.current;
    const guides = guidesRef.current;
    const copy = copyRef.current;
    const cardL = cardLRef.current;
    const card = cardRef.current;
    if (!scene || !guides || !copy || !cardL || !card) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    let running = false;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    /* 카드 중심 캐시 — 프레임마다 레이아웃을 읽지 않는다 */
    let cardCX = 0;
    let cardCY = 0;
    const measure = () => {
      const r = card.getBoundingClientRect();
      cardCX = r.left + r.width / 2;
      cardCY = r.top + r.height / 2 + window.scrollY;
    };

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let lastPx = 0;
    let lastPy = 0;
    let lastSy = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      const vh = window.innerHeight;
      const sy = Math.min(window.scrollY, vh);
      /* 변화가 없으면 DOM 쓰기 0 */
      if (
        Math.abs(cx - lastPx) < 0.001 &&
        Math.abs(cy - lastPy) < 0.001 &&
        sy === lastSy
      )
        return;
      lastPx = cx;
      lastPy = cy;
      lastSy = sy;

      const sp = Math.min(sy / (vh * 0.9), 1);
      copy.style.transform = `translate3d(${(cx * 6).toFixed(2)}px, ${(
        cy * 6 -
        sy * 0.06
      ).toFixed(1)}px, 0)`;
      cardL.style.transform = `translate3d(${(-cx * 10).toFixed(2)}px, ${(
        -cy * 10 -
        sy * 0.12
      ).toFixed(1)}px, 0) scale(${(1 - sp * 0.03).toFixed(3)})`;
      guides.style.transform = `translate3d(${(cx * 3).toFixed(2)}px, ${(
        cy * 3 -
        sy * 0.03
      ).toFixed(1)}px, 0)`;
      scene.style.setProperty("--sp", sp.toFixed(3));

      /* 근접할수록 카드 테두리가 선명해진다 — 구조의 반응 */
      if (fine) {
        const px = ((tx + 1) / 2) * window.innerWidth;
        const py = ((ty + 1) / 2) * vh + window.scrollY;
        const dist = Math.hypot(px - cardCX, py - cardCY);
        const prox = Math.max(0, 1 - dist / 480);
        card.style.setProperty("--prox", prox.toFixed(2));
      }
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(scene);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    /* 오프닝(카드 등장) 이후 중심을 잰다 */
    const mt = window.setTimeout(measure, 2600);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      if (fine) window.removeEventListener("pointermove", onMove);
      window.clearTimeout(mt);
    };
  }, [run]);

  let w = 0; // 어절 전역 인덱스 (두 줄 연속 안무)

  return (
    /* key 리마운트 = 리플레이. 가이드·펄스·본문이 모두 .fb-run 범위 안에 있어
       한 번에 처음부터 재생된다. */
    <section key={run} ref={sceneRef} className="fb-hero fb-run relative bg-ink text-paper">
      {/* 청사진 가이드라인 — 어절과 부품이 타고 오는 선 */}
      <svg
        ref={guidesRef}
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
      >
        <line
          x1="58"
          y1="0"
          x2="58"
          y2="100"
          pathLength={1}
          className="fb-guide hidden md:block"
          style={at(0.05, 0)}
          stroke="rgba(255,249,250,0.12)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="0"
          y1="36"
          x2="100"
          y2="36"
          pathLength={1}
          className="fb-guide"
          style={at(0.15, 0.05)}
          stroke="rgba(255,249,250,0.1)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="0"
          y1="72"
          x2="100"
          y2="72"
          pathLength={1}
          className="fb-guide"
          style={at(0.25, 0.15)}
          stroke="rgba(255,249,250,0.08)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* 실행 펄스 레일 — 헤드라인("운영")에서 카드로 (데스크톱 전용) */}
        <g className="hidden md:block">
          <path
            d="M30,46 C42,41 52,36 64,38"
            pathLength={1}
            className="fb-pulse-open"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.07 0.93"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M30,46 C42,41 52,36 64,38"
            pathLength={1}
            className="fb-pulse-idle"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.07 0.93"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* 스크롤 인계선 — 분해되며 WorkSection 으로 자라는 세로선 */}
      <span
        aria-hidden="true"
        className="fb-drop absolute bottom-[-2.5rem] left-[58%] hidden h-24 w-px bg-paper/25 md:block"
      />

      <div className="wrap grid items-center gap-14 md:grid-cols-[1fr_1.05fr] md:gap-10 lg:gap-16">
        {/* ---------- 좌: 카피 레이어 ---------- */}
        <div ref={copyRef} className="will-change-transform">
          <p className="t-label fb-in text-mint/80" style={at(2.3, 1.2)}>
            {t.hero.eyebrow}
          </p>

          <h1
            className="fb-title mt-6"
            aria-label={t.hero.titleLines.join(" ").replace(/\*\*/g, "")}
          >
            {t.hero.titleLines.map((line, li) => (
              <span key={li} className="block" aria-hidden="true">
                {line
                  .split(" ")
                  /* 대시가 홀로 떨어져 다음 줄로 밀리지 않게 앞 어절에 붙인다 */
                  .reduce<string[]>((acc, tok) => {
                    if ((tok === "—" || tok === "–") && acc.length)
                      acc[acc.length - 1] += " " + tok;
                    else acc.push(tok);
                    return acc;
                  }, [])
                  .map((tok, wi) => {
                  const m = tok.match(/^\*\*(.+)\*\*$/);
                  const i = w++;
                  return (
                    <Fragment key={wi}>
                      {wi > 0 && " "}
                      <span
                        className={`fb-w inline-block ${m ? "fb-w-mint text-mint" : ""}`}
                        style={wordVars(i)}
                      >
                        {m ? m[1] : tok}
                      </span>
                    </Fragment>
                  );
                })}
              </span>
            ))}
          </h1>

          <p
            className="fb-in mt-7 max-w-xl text-base leading-relaxed text-paper/78 md:text-lg"
            style={at(4.5, 2.7)}
          >
            {t.hero.sub}
          </p>

          <div className="fb-in mt-10 flex flex-wrap items-center gap-4" style={at(4.65, 2.85)}>
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

        {/* ---------- 우: 빌드 무대 레이어 ---------- */}
        <div ref={cardLRef} className="will-change-transform">
          <p className="sr-only">{b.sr}</p>

          <div className="mx-auto w-full max-w-md md:max-w-none">
            {/* ① 기획 — 스펙 한 줄 (좌상단 밖에서 진입) */}
            <div
              className="fb-in flex items-baseline gap-3"
              style={{ ...at(2.5, 1.9), "--ffrom": "translate(-70px,-90px) rotate(-4deg)" } as CSSProperties}
            >
              <span className="rounded border border-paper/25 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-paper/60">
                {b.specLabel}
              </span>
              <p className="font-mono text-[13px] text-paper/75">{b.spec}</p>
            </div>

            {/* 모바일 에너지 선 — 헤드라인과 카드를 잇는 스윕 */}
            <div aria-hidden="true" className="fb-mline relative mt-4 h-px w-full bg-paper/15 md:hidden" />

            {/* ②–④ 조립되는 편지 카드 = 실서비스 링크 */}
            <a
              ref={cardRef}
              href="https://takemyletter.site"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${b.open} — ${t.misc.externalNote}`}
              className="fb-card group relative mt-4 block rounded-2xl bg-paper/[0.045] p-5 transition-transform duration-200 hover:-translate-y-1 md:p-6"
            >
              {/* 테두리 — 한 붓에 그려진 뒤(fb-frame) 근접 반응으로 선명해진다 */}
              <span
                aria-hidden="true"
                className="fb-frame pointer-events-none absolute inset-0 rounded-2xl border"
                style={{ borderColor: "rgba(255,249,250,calc(0.15 + var(--prox,0)*0.3))" }}
              />

              <div className="flex items-center justify-between gap-3">
                <span
                  className="fb-in relative inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-mint"
                  style={{ ...at(4.5, 2.8), "--ffrom": "scale(0.6)" } as CSSProperties}
                >
                  {/* 점화 링 — LIVE 켜지는 순간 1회 */}
                  <span aria-hidden="true" className="fb-ring absolute -left-1 h-3.5 w-3.5 rounded-full border border-mint" />
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mint"
                  />
                  {b.live}
                </span>
                <span
                  aria-hidden="true"
                  className="text-paper/40 transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>

              <div
                className="fb-in mt-5 border-b border-paper/12 pb-3 text-sm text-paper/80"
                style={{ ...at(2.7, 2.0), "--ffrom": "translate(120px,-10px) rotate(2deg)" } as CSSProperties}
              >
                {b.uiTo}
              </div>

              <div
                className="fb-in mt-4 space-y-2.5"
                style={{ ...at(2.95, 2.15), "--ffrom": "translateY(90px)" } as CSSProperties}
                aria-hidden="true"
              >
                <div className="h-2 w-10/12 rounded-full bg-paper/15" />
                <div className="h-2 w-7/12 rounded-full bg-paper/15" />
                <div className="h-2 w-9/12 rounded-full bg-paper/15" />
              </div>

              <div
                className="fb-in mt-5 flex justify-end"
                style={{ ...at(3.15, 2.3), "--ffrom": "scale(0.4) rotate(6deg)" } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="rounded-full bg-paper px-4 py-1.5 text-xs font-semibold text-ink"
                >
                  {b.uiBtn}
                </span>
              </div>
            </a>

            {/* ③ 검증 체크 — 펄스 도착 직후 점등 */}
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
              {b.checks.map((c, i) => (
                <li
                  key={c}
                  className="fb-in flex items-center gap-2 font-mono text-[12px] text-paper/70"
                  style={{ ...at(4.15 + i * 0.2, 2.5 + i * 0.15), "--ffrom": "translateX(-24px)" } as CSSProperties}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-mint" aria-hidden="true">
                    <path
                      d="M2 6.2 5 9l5-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>

            {/* 단계 타임라인 + 재구성 표기 + 리플레이 */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
              <ol className="flex items-center gap-2">
                {b.stages.map((s, i) => (
                  <li
                    key={s}
                    className={`fb-dim flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase ${
                      i === b.stages.length - 1 ? "text-mint" : "text-paper/65"
                    }`}
                    style={at([2.5, 3.0, 4.15, 4.5][i], [1.9, 2.15, 2.5, 2.8][i])}
                  >
                    {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-paper/25" />}
                    {s}
                  </li>
                ))}
              </ol>

              <div className="flex items-center gap-4">
                <span className="text-[11px] text-paper/40">{b.note}</span>
                <button
                  type="button"
                  onClick={() => setRun((n) => n + 1)}
                  className="hidden cursor-pointer font-mono text-[11px] tracking-[0.1em] text-paper/55 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper motion-safe:md:inline"
                >
                  {b.replay} ↺
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
