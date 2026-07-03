"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   시그니처 — 히어로 전면이 하나의 밤하늘. "궤도에서 본 밤".
   · 성운 헤이즈: 초저알파 radial 2겹이 느리게 호흡·표류 — 검정이
     평면이 되지 않게 깊이의 바닥을 깐다.
   · 딥필드: 깊이(depth)로 크기·밝기·표류 속도·시차가 전부 갈라지는
     별 90~300개. 원경은 기어가고 근경은 흐른다. 일부 근경 별은
     사전 렌더한 글로우 스프라이트를 두른다.
   · 글린트: 이따금 별 하나가 십자 스파이크와 함께 잠깐 밝아진다.
   · 유성: 드물게 두 종류 — 빠르고 가는 것, 느리고 조금 밝은 것.
   · 전경 성단: 입자가 로고의 초승달+4점 별로 맺힌 뒤 큰 별 →
     고리 행성으로 순환 모프. 맺힌 뒤에도 리사주 표류·기울기·호흡을
     (전부 2주파수 합성으로) 멈추지 않는다 — 정지 프레임 없음.
   · 포인터 시차: 마우스 이동에 레이어가 깊이별 진폭으로 반응
     (원경 1px … 성단 7px, lerp 추종). 터치·reduced-motion 제외.
   · canvas 2D 단일 요소, 외부 라이브러리 없음. globalAlpha +
     사전 계산 색상으로 프레임당 문자열 생성 없음.
   · prefers-reduced-motion: 정적 1프레임(글린트·유성·시차 없음).
   · 화면 밖/백그라운드 탭에서는 rAF 정지.
   ============================================================ */

type Particle = {
  fx: number; // 모프 출발
  fy: number;
  tx: number; // 목표
  ty: number;
  sx: number; // 최초 진입 출발(산개)
  sy: number;
  r: number;
  a: number;
  mint: boolean;
  delay: number; // 진입 지연
  dur: number; // 진입 시간
  md: number; // 모프 지연
  ph: number;
  sp: number;
  wob: number;
};

type Star = {
  x: number;
  y: number;
  depth: number; // 0(원경)~1(근경) — 크기·밝기·속도·시차 전부 이걸로
  r: number;
  a: number;
  tw: number; // 트윙클 속도
  ph: number;
  mint: boolean;
  glow: boolean; // 근경 일부만 글로우 스프라이트
  spd: number; // 사전 계산 — 표류 속도 계수
  ampX: number; // 사전 계산 — 포인터 시차 진폭(px 단위)
  ampY: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  len: number;
  bright: boolean; // 느리고 밝은 변종 — 머리에 점광
};

type Glint = { idx: number; born: number; dur: number };

const PAPER = "255, 249, 250";
const MINT = "33, 241, 168";
const PAPER_RGB = "rgb(255, 249, 250)";
const MINT_RGB = "rgb(33, 241, 168)";

/* 입자 대역 — 인덱스 순서 고정: 앞은 은은한 채움, 뒤로 갈수록 밝은 윤곽 */
const B1 = 0.62;
const B2 = 0.92;

const HOLD_MS = 5200;
const MORPH_MS = 1500;
const MORPH_SPREAD = 550;
const TAU = Math.PI * 2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* 표류 좌표 순환 — 여백 m 을 두고 캔버스 밖으로 나가면 반대편에서 돌아온다 */
const wrap = (v: number, max: number, m: number) => {
  const span = max + m * 2;
  let r = (v + m) % span;
  if (r < 0) r += span;
  return r - m;
};

/* 글로우 스프라이트 — 프레임마다 gradient 를 만들지 않도록 미리 굽는다 */
function makeGlowSprite(rgb: string): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = 64;
  s.height = 64;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(${rgb}, 0.4)`);
  g.addColorStop(0.4, `rgba(${rgb}, 0.12)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return s;
}

/* 대형 radial(성운·후광)도 스프라이트로 — 프레임당 gradient 생성 0.
   부드러운 그라디언트는 확대해도 손실이 없어 256px 로 굽고 스케일한다.
   innerRatio: 중심부터 이 비율까지는 알파 1(원본 gradient 의 안쪽 원). */
function makeRadialSprite(rgb: string, innerRatio: number): HTMLCanvasElement {
  const size = 256;
  const half = size / 2;
  const s = document.createElement("canvas");
  s.width = size;
  s.height = size;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(half, half, half * innerRatio, half, half, half);
  g.addColorStop(0, `rgba(${rgb}, 1)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  return s;
}

export default function MoonParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    /* 히어로 배경(bg-ink)과 같은 색을 직접 칠하므로 불투명 캔버스 —
       DOM 합성에서 알파 블렌딩이 빠져 프레임 비용이 준다. */
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    let ps: Particle[] = [];
    let stars: Star[] = [];
    let meteor: Meteor | null = null;
    let meteorNext = 0;
    let glint: Glint | null = null;
    let glintNext = 0;
    let targets: [number, number][][] = [];
    let W = 0;
    let H = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let phase: "entry" | "hold" | "morph" = "entry";
    let phaseAt = performance.now();
    let entryMax = 0;
    let shapeIdx = 0;

    /* 포인터 시차 — 목표값(ptx,pty)을 향해 현재값(px,py)이 lerp 로 따라온다 */
    let px = 0;
    let py = 0;
    let ptx = 0;
    let pty = 0;

    const glowPaper = makeGlowSprite(PAPER);
    const glowMint = makeGlowSprite(MINT);
    const nebSprite = makeRadialSprite(PAPER, 0);
    /* 후광 원본 gradient 의 안쪽 원 = R*0.2 / 바깥 원 = R*2.1 */
    const haloSprite = makeRadialSprite(PAPER, 0.2 / 2.1);

    /* ── 형태 샘플러 ─────────────────────────────── */

    const inCrescent = (x: number, y: number) => {
      if (x * x + y * y > R * R) return false;
      const bx = x - 0.45 * R;
      const by = y + 0.2 * R;
      const br = 0.85 * R;
      return bx * bx + by * by >= br * br;
    };

    /* 4점 별 — 십자 두 획을 끝으로 갈수록 가늘게 */
    function starPoint(sx: number, sy: number, L: number, Wd: number): [number, number] {
      const t = Math.random() * 2 - 1;
      const taper = Math.pow(1 - Math.abs(t), 1.7);
      const a = t * L;
      const b = (Math.random() * 2 - 1) * Wd * taper;
      return Math.random() < 0.5 ? [sx + a, sy + b] : [sx + b, sy + a];
    }

    /* ① 초승달 + 로고 별 */
    function crescentTargets(count: number): [number, number][] {
      const out: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const f = i / count;
        let p: [number, number] | null = null;
        for (let k = 0; k < 90 && !p; k++) {
          if (f < B1) {
            const x = (Math.random() * 2 - 1) * R;
            const y = (Math.random() * 2 - 1) * R;
            if (inCrescent(x, y)) p = [x, y];
          } else if (f < B2) {
            if (Math.random() < 0.6) {
              const th = Math.random() * TAU;
              const rr = R * (0.945 + Math.random() * 0.05);
              const x = Math.cos(th) * rr;
              const y = Math.sin(th) * rr;
              if (inCrescent(x, y)) p = [x, y];
            } else {
              const th = Math.random() * TAU;
              const rr = 0.85 * R * (1.008 + Math.random() * 0.045);
              const x = 0.45 * R + Math.cos(th) * rr;
              const y = -0.2 * R + Math.sin(th) * rr;
              if (inCrescent(x, y)) p = [x, y];
            }
          } else {
            p = starPoint(0.42 * R, -0.18 * R, R * 0.3, R * 0.045);
          }
        }
        out.push(p ?? [-R * 0.45, R * 0.3]);
      }
      return out;
    }

    /* ② 큰 4점 별 + 잔별 */
    function starTargets(count: number): [number, number][] {
      const out: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const f = i / count;
        if (f < B1) {
          out.push(starPoint(0, 0, R * 0.78, R * 0.15));
        } else if (f < B2) {
          out.push(starPoint(0, 0, R * 0.82, R * 0.05));
        } else {
          const r3 = Math.random();
          if (r3 < 0.4) out.push(starPoint(-0.58 * R, -0.42 * R, R * 0.2, R * 0.035));
          else if (r3 < 0.75) out.push(starPoint(0.62 * R, 0.44 * R, R * 0.15, R * 0.03));
          else out.push(starPoint(0, 0, R * 0.16, R * 0.05));
        }
      }
      return out;
    }

    /* ③ 고리 행성 — 위쪽 고리는 행성 뒤로 숨는다 */
    function planetTargets(count: number): [number, number][] {
      const out: [number, number][] = [];
      const Rd = 0.5 * R;
      const phi = -0.35;
      const cosF = Math.cos(phi);
      const sinF = Math.sin(phi);
      const ringPoint = (frontOnly: boolean): [number, number] | null => {
        for (let k = 0; k < 40; k++) {
          const th = Math.random() * TAU;
          const j = 1 + (Math.random() * 2 - 1) * 0.05;
          const u = 0.95 * R * Math.cos(th) * j;
          const v = 0.3 * R * Math.sin(th) * j;
          if (frontOnly && v < 0) continue;
          const x = u * cosF - v * sinF;
          const y = u * sinF + v * cosF;
          if (v < 0 && Math.hypot(x, y) < Rd * 1.06) continue; // 뒤쪽은 행성에 가림
          return [x, y];
        }
        return null;
      };
      for (let i = 0; i < count; i++) {
        const f = i / count;
        let p: [number, number] | null = null;
        if (f < B1) {
          const th = Math.random() * TAU;
          const rr = Rd * Math.sqrt(Math.random());
          p = [Math.cos(th) * rr, Math.sin(th) * rr];
        } else if (f < B2) {
          p = ringPoint(false);
        } else {
          if (Math.random() < 0.55) {
            const th = Math.random() * TAU;
            const rr = Rd * (0.95 + Math.random() * 0.06);
            p = [Math.cos(th) * rr, Math.sin(th) * rr];
          } else {
            p = ringPoint(true);
          }
        }
        out.push(p ?? [0, 0]);
      }
      return out;
    }

    /* ── 초기화 ─────────────────────────────────── */

    function init(withEntry: boolean) {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      /* 백킹스토어 픽셀 상한(~7M) — 초대형·고DPI 화면에서 픽셀 수가
         프레임 비용을 지배하지 않도록 dpr 을 부드럽게 낮춘다. */
      const cap = Math.sqrt(7_000_000 / (rect.width * rect.height));
      dpr = Math.max(1, Math.min(dpr, cap));
      W = Math.round(rect.width * dpr);
      H = Math.round(rect.height * dpr);
      canvas!.width = W;
      canvas!.height = H;

      /* 성단 배치 — 캔버스가 히어로 전면이므로 구도는 내부에서 잡는다.
         기존 박스 위치(데스크톱 우측 중단, 모바일 우측 상단) 계승. */
      const mobile = rect.width < 768;
      cx = W * (mobile ? 0.72 : 0.76);
      cy = H * (mobile ? 0.27 : 0.41);
      R = Math.min(W, H) * (mobile ? 0.34 : 0.27);

      const count = rect.width < 480 ? 640 : 1100;
      targets = [crescentTargets(count), starTargets(count), planetTargets(count)];
      shapeIdx = 0;

      const far = Math.max(W, H);
      ps = [];
      for (let i = 0; i < count; i++) {
        const f = i / count;
        const [tx, ty] = targets[0][i];
        const th = Math.random() * TAU;
        const d = far * (0.5 + Math.random() * 0.55);
        ps.push({
          fx: tx,
          fy: ty,
          tx,
          ty,
          sx: tx + Math.cos(th) * d,
          sy: ty + Math.sin(th) * d,
          r:
            (f < B1
              ? 0.4 + Math.random() * 0.7
              : f < B2
                ? 0.55 + Math.random() * 0.85
                : 0.7 + Math.random() * 1.0) * dpr,
          a:
            f < B1
              ? 0.13 + Math.random() * 0.37
              : f < B2
                ? 0.4 + Math.random() * 0.4
                : 0.62 + Math.random() * 0.38,
          mint: Math.random() < (f < B1 ? 0.04 : f < B2 ? 0.06 : 0.1),
          delay: withEntry ? Math.random() * 1100 : 0,
          dur: withEntry ? 900 + Math.random() * 1700 : 1,
          md: Math.random() * MORPH_SPREAD,
          ph: Math.random() * TAU,
          sp: 0.5 + Math.random(),
          wob: (Math.random() * 2 - 1) * 26 * dpr,
        });
      }

      /* 딥필드 — depth 를 원경 쪽으로 스큐해 "먼 별이 훨씬 많은" 하늘.
         밝기 상한은 낮게 눌러 성단(시그니처)이 항상 주인공으로 남는다. */
      const starCount = Math.round(
        Math.min(300, Math.max(90, (rect.width * rect.height) / 6500)),
      );
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const depth = Math.pow(Math.random(), 1.6);
        const amp = (1 + 4 * depth) * dpr;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          depth,
          r: (0.3 + 0.55 * depth + Math.random() * (0.35 + 0.45 * depth)) * dpr,
          a: 0.04 + 0.14 * depth + Math.random() * (0.05 + 0.2 * depth),
          tw: 0.0005 + Math.random() * 0.0013,
          ph: Math.random() * TAU,
          mint: Math.random() < 0.03 + 0.03 * depth,
          glow: depth > 0.75 && Math.random() < 0.3,
          spd: 0.12 + 0.88 * depth * depth,
          ampX: amp,
          ampY: amp * 0.7,
        });
      }

      meteor = null;
      meteorNext = performance.now() + 6000 + Math.random() * 4000;
      glint = null;
      glintNext = performance.now() + 3500 + Math.random() * 4000;
      entryMax = withEntry ? 2900 : 0;
      phase = withEntry ? "entry" : "hold";
      phaseAt = performance.now();
    }

    /* 별의 현재 위치 — 표류 + 순환 + 깊이 시차 (글린트에서도 재사용) */
    function starPos(s: Star, now: number): [number, number] {
      return [
        wrap(s.x - 0.0022 * dpr * s.spd * now, W, 16 * dpr) - px * s.ampX,
        wrap(s.y + 0.00085 * dpr * s.spd * now, H, 16 * dpr) - py * s.ampY,
      ];
    }

    /* ── 유성 — 드물게, 가늘게, 조용히. 가끔 느리고 밝은 변종 ── */

    function drawMeteor(now: number) {
      if (!meteor) {
        if (now < meteorNext) return;
        const bright = Math.random() < 0.3;
        const th = Math.PI * (0.86 + Math.random() * 0.1); // 좌하향 12°~25°
        const spd = (bright ? 0.22 : 0.38 + Math.random() * 0.2) * dpr;
        meteor = {
          x: W * (0.25 + Math.random() * 0.7),
          y: H * (0.04 + Math.random() * 0.3),
          vx: Math.cos(th) * spd,
          vy: Math.sin(th) * spd,
          born: now,
          life: bright ? 1400 + Math.random() * 400 : 700 + Math.random() * 350,
          len: (bright ? 110 + Math.random() * 50 : 65 + Math.random() * 50) * dpr,
          bright,
        };
      }
      const t = (now - meteor.born) / meteor.life;
      if (t >= 1) {
        meteor = null;
        meteorNext = now + 11000 + Math.random() * 14000;
        return;
      }
      const age = now - meteor.born;
      const hx = meteor.x + meteor.vx * age;
      const hy = meteor.y + meteor.vy * age;
      const mag = Math.hypot(meteor.vx, meteor.vy);
      const tx2 = hx - (meteor.vx / mag) * meteor.len;
      const ty2 = hy - (meteor.vy / mag) * meteor.len;
      const a = (meteor.bright ? 0.55 : 0.45) * Math.sin(Math.PI * t);
      const grad = ctx!.createLinearGradient(hx, hy, tx2, ty2);
      grad.addColorStop(0, `rgba(${PAPER}, ${a.toFixed(3)})`);
      grad.addColorStop(1, `rgba(${PAPER}, 0)`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = dpr;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(hx, hy);
      ctx!.lineTo(tx2, ty2);
      ctx!.stroke();
      if (meteor.bright) {
        ctx!.globalAlpha = a;
        const gs = 7 * dpr;
        ctx!.drawImage(glowPaper, hx - gs, hy - gs, gs * 2, gs * 2);
        ctx!.globalAlpha = 1;
      }
    }

    /* ── 글린트 — 별 하나가 십자 스파이크와 함께 잠깐 밝아진다 ── */

    function drawGlint(now: number) {
      if (!glint) {
        if (now < glintNext) return;
        const near = stars
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.depth > 0.5);
        if (!near.length) return;
        const pick = near[Math.floor(Math.random() * near.length)];
        glint = { idx: pick.i, born: now, dur: 1100 + Math.random() * 500 };
      }
      const t = (now - glint.born) / glint.dur;
      if (t >= 1) {
        glint = null;
        glintNext = now + 4000 + Math.random() * 6000;
        return;
      }
      const s = stars[glint.idx];
      const [gx, gy] = starPos(s, now);
      const e = Math.sin(Math.PI * t);
      const len = (3 + 9 * e) * dpr;
      const rgb = s.mint ? MINT : PAPER;
      ctx!.strokeStyle = `rgba(${rgb}, ${(0.5 * e).toFixed(3)})`;
      ctx!.lineWidth = dpr * 0.8;
      ctx!.beginPath();
      ctx!.moveTo(gx - len, gy);
      ctx!.lineTo(gx + len, gy);
      ctx!.moveTo(gx, gy - len);
      ctx!.lineTo(gx, gy + len);
      ctx!.stroke();
      ctx!.globalAlpha = 0.6 * e;
      const gs = 5 * dpr;
      ctx!.drawImage(s.mint ? glowMint : glowPaper, gx - gs, gy - gs, gs * 2, gs * 2);
      ctx!.globalAlpha = 1;
    }

    /* ── 렌더 ────────────────────────────────────── */

    function draw(now: number) {
      /* 위상 전환 */
      if (phase === "entry" && now - phaseAt > entryMax) {
        phase = "hold";
        phaseAt = now;
      } else if (phase === "hold" && now - phaseAt > HOLD_MS && !reduced) {
        shapeIdx = (shapeIdx + 1) % targets.length;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          p.fx = p.tx;
          p.fy = p.ty;
          p.tx = targets[shapeIdx][i][0];
          p.ty = targets[shapeIdx][i][1];
        }
        phase = "morph";
        phaseAt = now;
      } else if (phase === "morph" && now - phaseAt > MORPH_MS + MORPH_SPREAD) {
        phase = "hold";
        phaseAt = now;
      }

      /* 포인터 시차 추종 */
      px += (ptx - px) * 0.045;
      py += (pty - py) * 0.045;

      /* 불투명 캔버스 — 히어로 배경색으로 직접 지운다 */
      ctx!.fillStyle = "#171717";
      ctx!.fillRect(0, 0, W, H);

      /* 성운 헤이즈 — 검정이 평면이 되지 않게, 아주 낮게 두 겹.
         gradient 는 스프라이트로 구워 두고 알파·위치만 프레임마다 바꾼다. */
      const n1x = W * 0.3 + Math.sin(now * 0.00007) * 40 * dpr - px * 2 * dpr;
      const n1y = H * 0.74 + Math.cos(now * 0.000056) * 30 * dpr - py * 1.5 * dpr;
      const n1r = Math.max(W, H) * 0.5;
      ctx!.globalAlpha = 0.02 + 0.006 * Math.sin(now * 0.00009);
      ctx!.drawImage(nebSprite, n1x - n1r, n1y - n1r, n1r * 2, n1r * 2);

      const n2x = W * 0.88 + Math.cos(now * 0.00005) * 34 * dpr - px * 2 * dpr;
      const n2y = H * 0.12 + Math.sin(now * 0.000063) * 26 * dpr - py * 1.5 * dpr;
      const n2r = Math.max(W, H) * 0.38;
      ctx!.globalAlpha = 0.024 + 0.007 * Math.sin(now * 0.00008 + 2);
      ctx!.drawImage(nebSprite, n2x - n2r, n2y - n2r, n2r * 2, n2r * 2);

      /* 성단 후광 */
      const hr = R * 2.1;
      ctx!.globalAlpha = 0.05;
      ctx!.drawImage(haloSprite, cx - hr, cy - hr, hr * 2, hr * 2);
      ctx!.globalAlpha = 1;

      /* 딥필드 — 깊을수록 느리게 표류, 얕을수록 시차 크게.
         이 크기의 점은 fillRect 가 arc 와 시각적으로 같고 훨씬 싸다. */
      for (const s of stars) {
        const [sx, sy] = starPos(s, now);
        const tw = reduced ? 1 : 0.62 + 0.38 * Math.sin(now * s.tw + s.ph);
        const alpha = s.a * tw;
        if (alpha < 0.012) continue;
        if (s.glow) {
          ctx!.globalAlpha = alpha * 0.55;
          const gs = s.r * 7;
          ctx!.drawImage(s.mint ? glowMint : glowPaper, sx - gs, sy - gs, gs * 2, gs * 2);
        }
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = s.mint ? MINT_RGB : PAPER_RGB;
        ctx!.fillRect(sx - s.r, sy - s.r, s.r * 2, s.r * 2);
      }
      ctx!.globalAlpha = 1;

      if (!reduced) {
        drawGlint(now);
        drawMeteor(now);
      }

      /* 성단 — 궤도 위 정거장처럼 표류·기울기·호흡을 계속한다.
         전부 2주파수 합성이라 같은 자세가 다시 오지 않는다. */
      const ox =
        (6 * Math.sin(now * 0.00019) + 2.5 * Math.sin(now * 0.00047 + 1.3)) * dpr -
        px * 7 * dpr;
      const oy =
        (5 * Math.cos(now * 0.00016) + 2 * Math.sin(now * 0.00041 + 0.5)) * dpr -
        py * 5 * dpr;
      const rot = 0.022 * Math.sin(now * 0.00013) + 0.01 * Math.sin(now * 0.00031 + 2.1);
      const sc = 1 + 0.008 * Math.sin(now * 0.00017 + 0.7);
      ctx!.save();
      ctx!.translate(cx + ox, cy + oy);
      ctx!.rotate(rot);
      ctx!.scale(sc, sc);

      for (const p of ps) {
        let bx: number;
        let by: number;
        let fade = 1;

        if (phase === "entry") {
          const t = Math.min(Math.max((now - phaseAt - p.delay) / p.dur, 0), 1);
          const e = easeOutCubic(t);
          const swirl = Math.sin(e * Math.PI) * p.wob;
          bx = p.sx + (p.tx - p.sx) * e + swirl * Math.sin(p.ph);
          by = p.sy + (p.ty - p.sy) * e + swirl * Math.cos(p.ph);
          fade = Math.max(e, 0.05);
        } else if (phase === "morph") {
          const t = Math.min(Math.max((now - phaseAt - p.md) / MORPH_MS, 0), 1);
          const e = easeInOut(t);
          const swirl = Math.sin(e * Math.PI) * p.wob * 0.35;
          bx = p.fx + (p.tx - p.fx) * e + swirl * Math.sin(p.ph);
          by = p.fy + (p.ty - p.fy) * e + swirl * Math.cos(p.ph);
        } else {
          bx = p.tx;
          by = p.ty;
        }

        /* 개별 미세 표류 — 두 주파수를 겹쳐 기계적 반복감을 없앤다 */
        const x =
          bx +
          (Math.sin(now * 0.00042 * p.sp + p.ph) * 1.6 +
            Math.sin(now * 0.00011 * p.sp + p.ph * 1.7)) *
            dpr;
        const y =
          by +
          (Math.cos(now * 0.00036 * p.sp + p.ph) * 1.6 +
            Math.cos(now * 0.000095 * p.sp + p.ph * 2.3)) *
            dpr;
        const tw =
          phase === "entry" ? 1 : 0.84 + 0.16 * Math.sin(now * 0.0012 * p.sp + p.ph);

        ctx!.globalAlpha = Math.min(p.a * tw * fade, 1);
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

    init(!reduced);
    if (reduced) {
      draw(phaseAt + 10);
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

    /* 포인터 시차 — 마우스 전용(터치·reduced 제외), 창 밖으로 나가면 복귀 */
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptx = Math.min(Math.max((e.clientX / window.innerWidth) * 2 - 1, -1), 1);
      pty = Math.min(Math.max((e.clientY / window.innerHeight) * 2 - 1, -1), 1);
    };
    const onPointerOut = () => {
      ptx = 0;
      pty = 0;
    };
    if (!reduced && !coarse) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("mouseleave", onPointerOut);
    }

    let ro: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      let first = true;
      ro = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        init(false);
        if (reduced) draw(performance.now());
      });
      ro.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onPointerOut);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
