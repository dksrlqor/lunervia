"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/LanguageContext";

/* 운영형 소프트웨어 패브릭 — 히어로의 핵심 비주얼.
   Spec → Build → Verify → Ship 파이프라인과 Verify → Recover → Build 회복
   루프를 SVG 토폴로지로 그린다. 위에는 실제 도구 조각(디프·검증 로그·배포
   상태) 패널이 선 위에 걸쳐 떠 있다.
   - 진입: 그리드 페이드 → 연결선 1회 드로우 → 노드 → 패널 도킹 (~2.2s 종료)
   - 이후 idle 모션 없음. 유일한 순환은 LIVE 점 호흡 하나.
   - 호버: 노드/패널에 닿으면 인접 연결선과 패널만 선명해진다.
   - 전체가 장식 도식이므로 aria-hidden, 의미는 sr-only 문장이 전달. */

type Stage = "spec" | "build" | "verify" | "recover" | "ship";

const NODES: {
  id: Stage;
  x: number;
  y: number;
  r: number;
  tone: "ice" | "ok" | "warn";
}[] = [
  { id: "spec", x: 64, y: 168, r: 7, tone: "ice" },
  { id: "build", x: 250, y: 108, r: 8, tone: "ice" },
  { id: "verify", x: 432, y: 186, r: 9, tone: "ok" },
  { id: "ship", x: 612, y: 120, r: 8, tone: "ice" },
  { id: "recover", x: 330, y: 330, r: 7, tone: "warn" },
];

const EDGES: { d: string; stages: Stage[]; loop?: boolean; delay: number }[] = [
  { d: "M64,168 C126,140 190,116 250,108", stages: ["spec", "build"], delay: 0.5 },
  { d: "M250,108 C312,116 374,158 432,186", stages: ["build", "verify"], delay: 0.66 },
  { d: "M432,186 C494,168 552,140 612,120", stages: ["verify", "ship"], delay: 0.82 },
  { d: "M432,186 C412,244 378,296 330,330", stages: ["verify", "recover"], loop: true, delay: 0.98 },
  { d: "M330,330 C288,270 258,180 250,108", stages: ["recover", "build"], loop: true, delay: 1.14 },
];

const TONE = {
  ice: "var(--ice)",
  ok: "var(--ok)",
  warn: "var(--warn)",
} as const;

export default function HeroFabric() {
  const { t } = useI18n();
  const [hot, setHot] = useState<Stage | null>(null);

  const stages = t.hero.stages;
  const p = t.hero.panels;

  const edgeStroke = (e: (typeof EDGES)[number]) => {
    const isHot = hot !== null && e.stages.includes(hot);
    if (e.loop) return isHot ? "rgba(223,174,87,0.95)" : "rgba(223,174,87,0.5)";
    return isHot ? "rgba(169,205,238,0.95)" : "rgba(169,205,238,0.34)";
  };
  const panelCls = (s: Stage) =>
    `fab-panel panel-raised absolute p-3 transition-all duration-300 ${
      hot === s
        ? "border-linestrong -translate-y-0.5"
        : hot
          ? "opacity-70"
          : ""
    }`;

  return (
    <>
      <p className="sr-only">{t.hero.fabricSr}</p>

      {/* ---------- 데스크톱: 토폴로지 캔버스 ---------- */}
      <div aria-hidden="true" className="relative hidden select-none md:block">
        <svg viewBox="0 0 680 400" className="w-full" role="presentation">
          <defs>
            <pattern id="fab-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(152,168,189,0.13)" />
            </pattern>
          </defs>
          <rect width="680" height="400" fill="url(#fab-dots)" className="fab-grid" />

          {EDGES.map((e, i) => (
            <path
              key={i}
              d={e.d}
              pathLength={1}
              className={e.loop ? "fab-fade" : "fab-line"}
              style={{ animationDelay: `${e.delay}s`, transition: "stroke .25s" }}
              fill="none"
              strokeWidth="1"
              strokeDasharray={e.loop ? "0.02 0.012" : undefined}
              stroke={edgeStroke(e)}
            />
          ))}

          {NODES.map((n, i) => (
            <g
              key={n.id}
              className="fab-node"
              style={{ animationDelay: `${0.95 + i * 0.13}s` }}
              onMouseEnter={() => setHot(n.id)}
              onMouseLeave={() => setHot(null)}
            >
              {/* 호버 히트 영역 */}
              <circle cx={n.x} cy={n.y} r="26" fill="transparent" />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 6}
                fill="none"
                stroke={TONE[n.tone]}
                strokeOpacity={hot === n.id ? 0.9 : 0.35}
                strokeWidth="1"
                style={{ transition: "stroke-opacity .25s" }}
              />
              <circle cx={n.x} cy={n.y} r={n.r} fill="var(--bg-2)" stroke={TONE[n.tone]} strokeWidth="1.25" />
              <circle cx={n.x} cy={n.y} r="2.4" fill={TONE[n.tone]} />
              <text
                x={n.x}
                y={n.y + n.r + 24}
                textAnchor="middle"
                className="font-mono"
                fontSize="10.5"
                letterSpacing="0.14em"
                fill={hot === n.id ? "var(--ink)" : "var(--ink-2)"}
                style={{ transition: "fill .25s", textTransform: "uppercase" }}
              >
                {n.id}
              </text>
              <text
                x={n.x}
                y={n.y + n.r + 40}
                textAnchor="middle"
                fontSize="12"
                fill={hot === n.id ? "var(--ink-2)" : "var(--ink-3)"}
                style={{ transition: "fill .25s" }}
              >
                {stages[n.id]}
              </text>
            </g>
          ))}
        </svg>

        {/* ---- 선 위에 걸쳐진 도구 조각들 ---- */}
        {/* BUILD — 디프 미리보기 */}
        <div
          className={`${panelCls("build")} top-[-4%] left-[17%] w-[min(220px,42%)]`}
          style={{ animationDelay: "1.45s" }}
          onMouseEnter={() => setHot("build")}
          onMouseLeave={() => setHot(null)}
        >
          <p className="t-meta text-ink3">{p.buildTitle}</p>
          <div className="mt-1.5 space-y-0.5 font-mono text-[11px] leading-relaxed">
            <p className="text-err/90">{p.buildLines[0]}</p>
            <p className="text-ok">{p.buildLines[1]}</p>
          </div>
          <p className="mt-1.5 text-[11px] text-ink3">{p.buildMeta}</p>
        </div>

        {/* VERIFY — 검증 로그 */}
        <div
          className={`${panelCls("verify")} top-[56%] left-[50%] w-[min(212px,44%)]`}
          style={{ animationDelay: "1.6s" }}
          onMouseEnter={() => setHot("verify")}
          onMouseLeave={() => setHot(null)}
        >
          <p className="t-meta text-ink3">{p.verifyTitle}</p>
          <ul className="mt-1.5 space-y-1">
            {p.verifyLines.map((l) => (
              <li key={l} className="flex items-center gap-2 font-mono text-[11px] text-ink2">
                <span className="dot dot-ok size-1.5!" />
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 font-mono text-[11px] text-ok">{p.verifyMeta}</p>
        </div>

        {/* SHIP — 배포 상태 */}
        <div
          className={`${panelCls("ship")} top-[-4%] right-0 w-[min(204px,40%)]`}
          style={{ animationDelay: "1.75s" }}
          onMouseEnter={() => setHot("ship")}
          onMouseLeave={() => setHot(null)}
        >
          <div className="flex items-center gap-2">
            <span className="dot dot-ok pulse-live" />
            <p className="t-meta text-ink">{p.shipTitle}</p>
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-ok">{p.shipMeta}</p>
          <p className="mt-1 text-[11px] text-ink3">{p.shipDesc}</p>
        </div>
      </div>

      {/* ---------- 모바일: 세로 축약 파이프라인 + 배포 상태 1개 ---------- */}
      <div aria-hidden="true" className="relative mt-2 md:hidden">
        <div className="absolute top-2 bottom-2 left-[9px] w-px bg-line" />
        <ul className="space-y-4">
          {NODES.filter((n) => n.id !== "recover").map((n, i) => (
            <li
              key={n.id}
              className="fab-panel flex items-center gap-4"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
            >
              <span
                className="relative z-10 flex size-[19px] items-center justify-center rounded-full border bg-bg2"
                style={{ borderColor: TONE[n.tone] }}
              >
                <span className="size-1.5 rounded-full" style={{ background: TONE[n.tone] }} />
              </span>
              <span className="t-meta uppercase tracking-[0.14em] text-ink2">{n.id}</span>
              <span className="text-sm text-ink3">{stages[n.id]}</span>
            </li>
          ))}
        </ul>
        <div
          className="fab-panel panel-raised mt-5 flex items-center gap-3 p-3"
          style={{ animationDelay: "0.85s" }}
        >
          <span className="dot dot-ok pulse-live" />
          <div>
            <p className="t-meta text-ink">{p.shipTitle}</p>
            <p className="mt-0.5 font-mono text-[11px] text-ok">{p.shipMeta}</p>
          </div>
        </div>
      </div>
    </>
  );
}
