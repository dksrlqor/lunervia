"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import { btnPaper, btnGhostDark } from "@/components/ui";

/* Coena(코이나) — AI 위에 얹는 살아있는 계층. 모듈 자리를 잇는 대표 R&D.
   히어로 SVG = 엔진 동작 원리 도식: 핵이 결과물(입자)을 만들고, 막이
   검사하고, 불합격 입자는 핵으로 되돌아가고, 합격 입자만 밖으로 나간다.
   순수 인라인 SVG + CSS keyframes(transform·opacity만), 라이브러리 없음.
   reduced-motion: 기본값이 정적 배치(합격 2개는 막 밖, 불합격 1개는 귀환 중)
   이고, 모션은 no-preference 미디어쿼리에서만 얹힌다. */

/* 시제품/기술 노트 URL — 공개되면 여기만 채우면 된다. 비어 있으면
   해당 버튼은 렌더되지 않는다. */
const PROTOTYPE_URL = "";
const NOTES_URL = "";

export default function CoenaSection() {
  const { t } = useI18n();
  const c = t.coena;

  return (
    <section id="coena" className="sheet bg-ink text-paper">
      <div className="wrap py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="t-label text-mint/80">{c.eyebrow}</p>
            <h2 className="t-display mt-4">{c.title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/78">{c.body}</p>

            <ul className="mt-8 space-y-3">
              {c.features.map((f) => (
                <li
                  key={f.tag}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                >
                  <code className="font-mono text-[13px] font-medium text-mint">
                    {f.tag}
                  </code>
                  <span className="text-[15px] leading-relaxed text-paper/72">
                    {f.desc}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 font-mono text-xs tracking-[0.08em] text-paper/50">
              {c.status}
            </p>

            {(PROTOTYPE_URL || NOTES_URL) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {PROTOTYPE_URL && (
                  <a
                    href={PROTOTYPE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPaper}
                  >
                    {c.ctaPrototype}
                  </a>
                )}
                {NOTES_URL && (
                  <a href={NOTES_URL} className={btnGhostDark}>
                    {c.ctaNotes}
                  </a>
                )}
              </div>
            )}
          </Reveal>

          {/* 히어로 — 세포 도식. 이 섹션의 유일한 볼드 요소 */}
          <Reveal delay={140}>
            <div className="mx-auto w-full max-w-[420px] lg:max-w-none">
              <p className="sr-only">{c.srHero}</p>
              <svg
                viewBox="0 0 480 480"
                width="480"
                height="480"
                className="h-auto w-full"
                aria-hidden="true"
              >
                {/* 세포막 — 비대칭 blob, 8~10초 호흡(항상성) */}
                <g className="cn-mem">
                  <path
                    d="M 240 88 C 306 88 354 139 373 197 C 392 255 388 328 333 368 C 278 408 205 393 155 357 C 105 321 79 255 99 194 C 119 133 174 88 240 88 Z"
                    fill="none"
                    stroke="rgba(255,249,250,0.12)"
                    strokeWidth="1.5"
                  />
                </g>

                {/* 핵 + 궤도 */}
                <circle
                  cx="240"
                  cy="240"
                  r="58"
                  fill="none"
                  stroke="rgba(255,249,250,0.1)"
                  strokeWidth="1"
                  strokeDasharray="3 7"
                />
                <circle cx="240" cy="240" r="36" fill="#21F1A8" />

                {/* 합격 입자 4 — 막을 통과해 밖으로 */}
                <circle className="cn-p1" cx="280" cy="259" r="5" fill="#21F1A8" />
                <circle className="cn-p2" cx="232" cy="283" r="4" fill="#21F1A8" />
                <circle className="cn-p3" cx="200" cy="221" r="6" fill="#21F1A8" />
                <circle className="cn-p4" cx="274" cy="212" r="4.5" fill="#21F1A8" />

                {/* 불합격 입자 2 — 막 근처까지 갔다가 핵으로 귀환 */}
                <circle className="cn-f1" cx="202" cy="262" r="5" fill="#E8735A" />
                <circle className="cn-f2" cx="251" cy="198" r="4.5" fill="#E8735A" />

                {/* 마이크로 라벨 */}
                <text
                  x="64"
                  y="84"
                  fontSize="11"
                  fill="rgba(255,249,250,0.35)"
                  style={{ fontFamily: "var(--font-jbm), monospace" }}
                >
                  verify()
                </text>
                <text
                  x="64"
                  y="352"
                  fontSize="11"
                  fill="rgba(255,249,250,0.35)"
                  style={{ fontFamily: "var(--font-jbm), monospace" }}
                >
                  retry ×3
                </text>
                <text
                  x="402"
                  y="370"
                  fontSize="11"
                  fill="rgba(255,249,250,0.35)"
                  style={{ fontFamily: "var(--font-jbm), monospace" }}
                >
                  pass
                </text>
              </svg>
            </div>

            <style>{`
              .cn-mem {
                transform-box: view-box;
                transform-origin: 240px 240px;
              }
              /* 기본값 = 정적 배치(reduced-motion에서 그대로 노출):
                 합격 2개는 막 바깥, 불합격 1개는 귀환 중, 나머지는 핵 곁 */
              .cn-p1 { transform: translate(168px, 78px); opacity: 0.75; }
              .cn-p2 { transform: translate(-32px, 182px); opacity: 0.75; }
              .cn-p3 { opacity: 0.5; }
              .cn-p4 { opacity: 0.5; }
              .cn-f1 { transform: translate(-38px, 22px); opacity: 0.9; }
              .cn-f2 { opacity: 0.85; }

              @media (prefers-reduced-motion: no-preference) {
                .cn-mem { animation: cnBreath 9s ease-in-out infinite; }
                .cn-p1 { animation: cnP1 7s linear infinite; }
                .cn-p2 { animation: cnP2 9.5s linear 2.5s infinite; opacity: 0; }
                .cn-p3 { animation: cnP3 6.5s linear 4s infinite; opacity: 0; }
                .cn-p4 { animation: cnP4 11s linear 1.2s infinite; opacity: 0; }
                .cn-f1 { animation: cnF1 8s ease-in-out infinite; }
                .cn-f2 { animation: cnF2 10s ease-in-out 3s infinite; }

                @keyframes cnBreath {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.02); }
                }
                @keyframes cnP1 {
                  0% { transform: translate(0, 0); opacity: 0; }
                  6% { opacity: 1; }
                  72% { opacity: 0.9; }
                  100% { transform: translate(168px, 78px); opacity: 0; }
                }
                @keyframes cnP2 {
                  0% { transform: translate(0, 0); opacity: 0; }
                  6% { opacity: 1; }
                  72% { opacity: 0.9; }
                  100% { transform: translate(-32px, 182px); opacity: 0; }
                }
                @keyframes cnP3 {
                  0% { transform: translate(0, 0); opacity: 0; }
                  6% { opacity: 1; }
                  72% { opacity: 0.9; }
                  100% { transform: translate(-168px, -78px); opacity: 0; }
                }
                @keyframes cnP4 {
                  0% { transform: translate(0, 0); opacity: 0; }
                  6% { opacity: 1; }
                  72% { opacity: 0.9; }
                  100% { transform: translate(142px, -119px); opacity: 0; }
                }
                @keyframes cnF1 {
                  0%, 100% { transform: translate(0, 0); }
                  45%, 55% { transform: translate(-76px, 44px); }
                  92% { transform: translate(0, 0); }
                }
                @keyframes cnF2 {
                  0%, 100% { transform: translate(0, 0); }
                  45%, 55% { transform: translate(24px, -89px); }
                  92% { transform: translate(0, 0); }
                }
              }
            `}</style>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
