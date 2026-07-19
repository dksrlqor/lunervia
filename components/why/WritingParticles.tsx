"use client";

import { useEffect, useRef } from "react";
import { makeGlowSprite } from "@/components/canvas/sprites";

/* ============================================================
   /why 시그니처 — 별이 쓰는 글.
   · 펼친 책(두 페이지·책등)과 펜을 쥔 손의 실루엣을 별 입자로 그린다.
   · 손이 오른쪽 페이지 위를 실제로 이동하며 민트 잉크 점으로
     글줄을 써 내려간다(단어 사이 띄어쓰기 포함). 네 줄을 다 쓰면
     잠시 머문 뒤 잉크가 바래고, 처음부터 다시 쓴다.
   · 왼쪽 페이지에는 이미 쓴 글이 바랜 채 남아 있다.
   · 주변에는 옅은 별이 느리게 표류 — 홈 히어로와 같은 밤하늘 문법.
   · 진입은 홈과 동일한 산개→수렴. 이후 구성 전체가 궤도 위처럼
     리사주 표류·기울기·호흡을 계속한다(정지 프레임 없음).
   · canvas 2D 단일 요소, fillRect·불투명 캔버스(구 홈 히어로 MoonParticles
     의 성능 문법 계승 — 그 파일은 2026-07-19 히어로 교체로 삭제됨).
     reduced-motion: 네 줄이 완성된 정적 1프레임.
   ============================================================ */

type SceneDot = {
  x: number; // 구성 좌표(중심 기준, 장치px)
  y: number;
  sx: number; // 진입 산개 출발
  sy: number;
  r: number;
  a: number;
  mint: boolean;
  delay: number;
  dur: number;
  ph: number;
  sp: number;
};

type RigDot = {
  ox: number; // 펜촉 기준 오프셋
  oy: number;
  r: number;
  a: number;
  mint: boolean;
  ph: number;
  sp: number;
};

type InkDot = { x: number; y: number; r: number; a: number; mint: boolean; born: number };

type Ambient = { x: number; y: number; r: number; a: number; tw: number; ph: number; mint: boolean };

const PAPER = "255, 249, 250";
const MINT = "33, 241, 168";
const PAPER_RGB = "rgb(255, 249, 250)";
const MINT_RGB = "rgb(33, 241, 168)";
const TAU = Math.PI * 2;

const WRITE_MS = 2600;
const TRANSIT_MS = 550;
const HOLD_MS = 1600;
const FADE_MS = 900;
const LINES = [0.16, 0.34, 0.52, 0.7]; // 오른쪽 페이지 글줄(v)
const U0 = 0.12;
const U1 = 0.88;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const wrap = (v: number, max: number, m: number) => {
  const span = max + m * 2;
  let r = (v + m) % span;
  if (r < 0) r += span;
  return r - m;
};

type V2 = [number, number];
const lerp2 = (a: V2, b: V2, t: number): V2 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

/* 사변형 보간 — 페이지 평면 좌표(u,v) → 구성 좌표 */
function quadPoint(q: [V2, V2, V2, V2], u: number, v: number): V2 {
  return lerp2(lerp2(q[0], q[1], u), lerp2(q[3], q[2], u), v);
}

export default function WritingParticles({
  className = "",
  variant = "hero",
}: {
  className?: string;
  /** hero: 섹션 풀블리드(우측 배치) · panel: 카드 내부(중앙 배치) */
  variant?: "hero" | "panel";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glowMint = makeGlowSprite(MINT);

    let scene: SceneDot[] = [];
    let rig: RigDot[] = [];
    let ink: InkDot[] = [];
    let ambient: Ambient[] = [];
    let gaps: [number, number][][] = []; // 줄별 단어 사이 공백 구간(u)
    let W = 0;
    let H = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let startAt = performance.now();
    let entryMax = 0;

    /* 필기 상태 */
    let mode: "write" | "transit" | "hold" | "fade" = "write";
    let modeAt = 0;
    let line = 0;
    let lastInkU = U0;

    /* 오른쪽/왼쪽 페이지 사변형 (R 단위) */
    const RQ: [V2, V2, V2, V2] = [
      [0.04, -0.44],
      [1.08, -0.33],
      [0.95, 0.5],
      [0.04, 0.39],
    ];
    const LQ: [V2, V2, V2, V2] = [
      [-1.08, -0.33],
      [-0.04, -0.44],
      [-0.04, 0.39],
      [-0.95, 0.5],
    ];

    /* 펜촉 위치 — 줄 k, 진행 u (손글씨 흔들림 포함), R 단위 */
    function nibAt(k: number, u: number): V2 {
      const v = LINES[k] + 0.016 * Math.sin(u * 44 + k * 7.3);
      return quadPoint(RQ, u, v);
    }

    function pushDot(x: number, y: number, r: number, a: number, mint = false) {
      const th = Math.random() * TAU;
      const d = Math.max(W, H) * (0.4 + Math.random() * 0.5);
      scene.push({
        x: x * R,
        y: y * R,
        sx: x * R + Math.cos(th) * d,
        sy: y * R + Math.sin(th) * d,
        r: r * dpr,
        a,
        mint,
        delay: Math.random() * 900,
        dur: 800 + Math.random() * 1500,
        ph: Math.random() * TAU,
        sp: 0.5 + Math.random(),
      });
    }

    /* 캡슐 표면/내부 샘플 (R 단위) */
    function sampleCapsule(
      a: V2,
      b: V2,
      radius: number,
      n: number,
      alphaLo: number,
      alphaHi: number,
      into: (x: number, y: number, r: number, al: number) => void,
    ) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      for (let i = 0; i < n; i++) {
        const t = Math.random();
        const off = (Math.random() * 2 - 1) * radius;
        into(
          a[0] + dx * t + nx * off,
          a[1] + dy * t + ny * off,
          0.45 + Math.random() * 0.5,
          alphaLo + Math.random() * (alphaHi - alphaLo),
        );
      }
    }

    function sampleEllipse(
      c: V2,
      ax: V2, // 장축 방향(단위)
      ra: number,
      rb: number,
      n: number,
      alphaLo: number,
      alphaHi: number,
      into: (x: number, y: number, r: number, al: number) => void,
    ) {
      const px = -ax[1];
      const py = ax[0];
      for (let i = 0; i < n; i++) {
        const th = Math.random() * TAU;
        const rr = Math.sqrt(Math.random());
        const u = Math.cos(th) * rr * ra;
        const v = Math.sin(th) * rr * rb;
        into(
          c[0] + ax[0] * u + px * v,
          c[1] + ax[1] * u + py * v,
          0.45 + Math.random() * 0.5,
          alphaLo + Math.random() * (alphaHi - alphaLo),
        );
      }
    }

    function buildScene() {
      scene = [];

      /* 페이지 윤곽 — 밝게 */
      for (const q of [RQ, LQ]) {
        for (let e = 0; e < 4; e++) {
          const a = q[e];
          const b = q[(e + 1) % 4];
          const n = 26;
          for (let i = 0; i <= n; i++) {
            const t = i / n;
            const j = 0.008;
            pushDot(
              a[0] + (b[0] - a[0]) * t + (Math.random() * 2 - 1) * j,
              a[1] + (b[1] - a[1]) * t + (Math.random() * 2 - 1) * j,
              0.55 + Math.random() * 0.5,
              0.45 + Math.random() * 0.35,
            );
          }
        }
        /* 페이지 내부 — 아주 옅게 */
        for (let i = 0; i < 85; i++) {
          const [x, y] = quadPoint(q, Math.random(), Math.random());
          pushDot(x, y, 0.4 + Math.random() * 0.4, 0.06 + Math.random() * 0.12);
        }
      }

      /* 책등 */
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pushDot(0, -0.44 + (0.39 - -0.44) * t, 0.5 + Math.random() * 0.4, 0.35 + Math.random() * 0.3);
      }

      /* 왼쪽 페이지 — 이미 쓴 글(바랜 잉크), 단어 공백 포함 */
      for (let k = 0; k < 4; k++) {
        const v = 0.18 + k * 0.18;
        let u = U0;
        while (u < U1) {
          if (Math.random() < 0.12) {
            u += 0.03 + Math.random() * 0.03; // 띄어쓰기
            continue;
          }
          const [x, y] = quadPoint(LQ, u, v + 0.012 * Math.sin(u * 40 + k * 5));
          pushDot(x, y, 0.4 + Math.random() * 0.4, 0.16 + Math.random() * 0.14);
          u += 0.02;
        }
      }

      /* 손 + 펜 리그 — 펜촉 기준 오프셋(단단한 몸체, 펜촉을 따라 이동) */
      rig = [];
      const dLen = Math.hypot(0.42, -0.91);
      const dir: V2 = [0.42 / dLen, -0.91 / dLen]; // 펜대 방향(위-오른쪽)
      const perp: V2 = [-dir[1], dir[0]]; // 손이 앉는 쪽(오른-아래)
      const at = (s: number, p: number): V2 => [
        dir[0] * s + perp[0] * p,
        dir[1] * s + perp[1] * p,
      ];
      const intoRig =
        (mintChance: number) => (x: number, y: number, r: number, al: number) => {
          rig.push({
            ox: x * R,
            oy: y * R,
            r: r * dpr,
            a: al,
            mint: Math.random() < mintChance,
            ph: Math.random() * TAU,
            sp: 0.5 + Math.random(),
          });
        };

      /* 펜대 */
      sampleCapsule(at(0.03, 0), at(0.62, 0), 0.024, 70, 0.45, 0.85, intoRig(0.06));
      /* 펜촉 — 민트로 빛나는 점 */
      for (let i = 0; i < 6; i++) {
        rig.push({
          ox: dir[0] * 0.015 * R * i * 0.4,
          oy: dir[1] * 0.015 * R * i * 0.4,
          r: (0.8 + Math.random() * 0.6) * dpr,
          a: 0.85,
          mint: true,
          ph: Math.random() * TAU,
          sp: 0.5 + Math.random(),
        });
      }
      /* 손가락 세 마디 — 펜대를 감싼다 */
      for (const g of [0.16, 0.235, 0.31]) {
        sampleCapsule(at(g, 0.015), at(g, 0.13), 0.032, 22, 0.3, 0.6, intoRig(0.04));
      }
      /* 손등 */
      sampleEllipse(at(0.3, 0.21), dir, 0.23, 0.155, 130, 0.22, 0.55, intoRig(0.03));
      /* 엄지 */
      sampleCapsule(at(0.14, 0.19), at(0.12, 0.035), 0.03, 26, 0.3, 0.55, intoRig(0.04));
      /* 손목 — 오른아래로 잘려 나가는 실루엣 */
      sampleEllipse(at(0.33, 0.42), perp, 0.16, 0.11, 42, 0.16, 0.38, intoRig(0.02));

      /* 줄별 단어 공백 */
      gaps = LINES.map(() => {
        const g: [number, number][] = [];
        const n = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; i++) {
          const s = U0 + 0.08 + Math.random() * (U1 - U0 - 0.2);
          g.push([s, s + 0.018 + Math.random() * 0.02]);
        }
        return g;
      });
    }

    function init() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cap = Math.sqrt(7_000_000 / (rect.width * rect.height));
      dpr = Math.max(1, Math.min(dpr, cap));
      W = Math.round(rect.width * dpr);
      H = Math.round(rect.height * dpr);
      canvas!.width = W;
      canvas!.height = H;

      if (variant === "panel") {
        cx = W * 0.5;
        cy = H * 0.48;
        R = Math.min(W * 0.42, H * 0.34);
      } else {
        const mobile = rect.width < 768;
        cx = W * (mobile ? 0.5 : 0.71);
        cy = H * (mobile ? 0.3 : 0.52);
        R = mobile ? Math.min(W * 0.4, H * 0.24) : Math.min(W * 0.17, H * 0.3);
      }

      buildScene();

      ambient = [];
      const count = Math.round(
        Math.min(140, Math.max(60, (rect.width * rect.height) / 12000)),
      );
      for (let i = 0; i < count; i++) {
        ambient.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: (0.3 + Math.random() * 0.8) * dpr,
          a: 0.04 + Math.random() * 0.18,
          tw: 0.0006 + Math.random() * 0.0012,
          ph: Math.random() * TAU,
          mint: Math.random() < 0.04,
        });
      }

      ink = [];
      startAt = performance.now();
      entryMax = reduced ? 0 : 2400;
      mode = "write";
      line = 0;
      lastInkU = U0;
      modeAt = startAt + entryMax + 400; // 진입이 끝난 뒤 펜이 움직인다

      if (reduced) {
        /* 정적 프레임 — 네 줄이 이미 완성된 장면 */
        for (let k = 0; k < LINES.length; k++) spawnLineInk(k, U1, startAt, true);
        mode = "hold";
      }
    }

    function inGap(k: number, u: number) {
      for (const [s, e] of gaps[k]) if (u >= s && u <= e) return true;
      return false;
    }

    /* 줄 k 를 u 지점까지 잉크로 채운다(이미 찍힌 곳 다음부터).
       필기 압력 — 획의 굵기가 위치에 따라 오르내려 손글씨처럼 보인다:
       느린 저주파(꾹 눌러 쓰는 구간) + 획 단위 고주파의 합. */
    function spawnLineInk(k: number, u: number, now: number, full = false) {
      let from = full ? U0 : lastInkU;
      while (from + 0.011 <= u) {
        from += 0.011;
        if (inGap(k, from)) continue;
        const [x, y] = nibAt(k, from);
        const pressure =
          0.62 +
          0.3 * (0.5 + 0.5 * Math.sin(from * 7.5 + k * 2.3)) +
          0.2 * (0.5 + 0.5 * Math.sin(from * 31 + k));
        ink.push({
          x: x * R + (Math.random() * 2 - 1) * 1.2 * dpr,
          y: y * R + (Math.random() * 2 - 1) * 1.2 * dpr,
          r: (0.34 + Math.random() * 0.28) * pressure * dpr,
          a: (0.42 + Math.random() * 0.36) * (0.72 + 0.28 * pressure),
          mint: Math.random() < 0.3,
          born: now,
        });
      }
      if (!full) lastInkU = from;
    }

    /* ── 렌더 ────────────────────────────────────── */

    function draw(now: number) {
      ctx!.fillStyle = "#171717";
      ctx!.fillRect(0, 0, W, H);

      /* 주변 별 — 느린 표류 + 트윙클 */
      const margin = 12 * dpr;
      for (const s of ambient) {
        const sx = wrap(s.x - 0.0012 * dpr * now, W, margin);
        const sy = wrap(s.y + 0.0005 * dpr * now, H, margin);
        const tw = reduced ? 1 : 0.66 + 0.34 * Math.sin(now * s.tw + s.ph);
        ctx!.globalAlpha = s.a * tw;
        ctx!.fillStyle = s.mint ? MINT_RGB : PAPER_RGB;
        ctx!.fillRect(sx - s.r, sy - s.r, s.r * 2, s.r * 2);
      }
      ctx!.globalAlpha = 1;

      /* 구성 후광 */
      const g = ctx!.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 2.4);
      g.addColorStop(0, `rgba(${PAPER}, 0.045)`);
      g.addColorStop(1, `rgba(${PAPER}, 0)`);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

      /* 필기 상태 전이 */
      let inkFade = 1;
      let nib: V2;
      if (mode === "write") {
        const t = Math.min(Math.max((now - modeAt) / WRITE_MS, 0), 1);
        const u = U0 + (U1 - U0) * t;
        if (!reduced && t > 0) spawnLineInk(line, u, now);
        nib = nibAt(line, u);
        if (t >= 1) {
          if (line < LINES.length - 1) {
            mode = "transit";
          } else {
            mode = "hold";
          }
          modeAt = now;
        }
      } else if (mode === "transit") {
        const t = Math.min((now - modeAt) / TRANSIT_MS, 1);
        const e = easeInOut(t);
        const a = nibAt(line, U1);
        const b = nibAt(line + 1, U0);
        nib = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - 0.07 * Math.sin(Math.PI * e)];
        if (t >= 1) {
          line += 1;
          lastInkU = U0;
          mode = "write";
          modeAt = now;
        }
      } else if (mode === "hold") {
        nib = nibAt(LINES.length - 1, U1);
        if (!reduced && now - modeAt > HOLD_MS) {
          mode = "fade";
          modeAt = now;
        }
      } else {
        /* fade — 잉크가 바래는 동안 펜은 첫 줄로 긴 이동 */
        const t = Math.min((now - modeAt) / FADE_MS, 1);
        inkFade = 1 - easeInOut(t);
        const e = easeInOut(t);
        const a = nibAt(LINES.length - 1, U1);
        const b = nibAt(0, U0);
        nib = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - 0.12 * Math.sin(Math.PI * e)];
        if (t >= 1) {
          ink = [];
          line = 0;
          lastInkU = U0;
          mode = "write";
          modeAt = now;
        }
      }

      /* 구성 전체 — 궤도 위 정거장처럼 계속 떠 있다 */
      const gx =
        (4.5 * Math.sin(now * 0.00018) + 2 * Math.sin(now * 0.00045 + 1.1)) * dpr;
      const gy =
        (3.8 * Math.cos(now * 0.00015) + 1.7 * Math.sin(now * 0.00039 + 0.6)) * dpr;
      const rot = 0.014 * Math.sin(now * 0.00012) + 0.007 * Math.sin(now * 0.00029 + 2);
      const sc = 1 + 0.006 * Math.sin(now * 0.00016 + 0.8);
      ctx!.save();
      ctx!.translate(cx + gx, cy + gy);
      ctx!.rotate(rot);
      ctx!.scale(sc, sc);

      /* 책 — 산개→수렴 진입 + 미세 표류 */
      const sinceStart = now - startAt;
      for (const p of scene) {
        let bx = p.x;
        let by = p.y;
        let fade = 1;
        if (!reduced && sinceStart < entryMax + p.delay + p.dur) {
          const t = Math.min(Math.max((sinceStart - p.delay) / p.dur, 0), 1);
          const e = easeOutCubic(t);
          bx = p.sx + (p.x - p.sx) * e;
          by = p.sy + (p.y - p.sy) * e;
          fade = Math.max(e, 0.05);
        }
        const x = bx + Math.sin(now * 0.0004 * p.sp + p.ph) * 1.2 * dpr;
        const y = by + Math.cos(now * 0.00034 * p.sp + p.ph) * 1.2 * dpr;
        const tw = 0.84 + 0.16 * Math.sin(now * 0.0011 * p.sp + p.ph);
        ctx!.globalAlpha = Math.min(p.a * tw * fade, 1);
        ctx!.fillStyle = p.mint ? MINT_RGB : PAPER_RGB;
        ctx!.fillRect(x - p.r, y - p.r, p.r * 2, p.r * 2);
      }

      /* 잉크 — 갓 찍힌 점은 빠르게 배어들 듯 나타난다 */
      for (const d of ink) {
        const born = Math.min((now - d.born) / 220, 1);
        ctx!.globalAlpha = d.a * born * inkFade;
        ctx!.fillStyle = d.mint ? MINT_RGB : PAPER_RGB;
        ctx!.fillRect(d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
      }

      /* 손 + 펜 — 펜촉을 따라 통째로 이동, 진입 시 서서히 */
      const rigFade = reduced
        ? 1
        : Math.min(Math.max((sinceStart - entryMax * 0.55) / 700, 0), 1);
      const nx = nib[0] * R;
      const ny = nib[1] * R;

      /* 펜촉 미광 — 잉크가 나오는 순간(write)에만 민트로 은은히 빛난다 */
      if (mode === "write" && rigFade > 0.05) {
        const pulse = 0.55 + 0.45 * Math.sin(now * 0.008);
        ctx!.globalAlpha = 0.5 * rigFade * pulse;
        const gs = 9 * dpr;
        ctx!.drawImage(glowMint, nx - gs, ny - gs, gs * 2, gs * 2);
        ctx!.globalAlpha = 1;
      }

      for (const p of rig) {
        const x = nx + p.ox + Math.sin(now * 0.00042 * p.sp + p.ph) * 0.9 * dpr;
        const y = ny + p.oy + Math.cos(now * 0.00037 * p.sp + p.ph) * 0.9 * dpr;
        const tw = 0.86 + 0.14 * Math.sin(now * 0.0012 * p.sp + p.ph);
        ctx!.globalAlpha = Math.min(p.a * tw * rigFade, 1);
        ctx!.fillStyle = p.mint ? MINT_RGB : PAPER_RGB;
        ctx!.fillRect(x - p.r, y - p.r, p.r * 2, p.r * 2);
      }

      ctx!.globalAlpha = 1;
      ctx!.restore();
    }

    function loop(now: number) {
      if (!visible) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    init();
    if (reduced) {
      draw(performance.now() + 10);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.03 },
    );
    io.observe(canvas);

    const onVis = () => {
      visible = !document.hidden;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    let ro: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      let first = true;
      ro = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        init();
        if (reduced) draw(performance.now());
      });
      ro.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
