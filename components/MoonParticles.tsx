"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   시그니처 — 흩어진 입자가 로고의 초승달+4점 별로 맺힌 뒤,
   큰 별 → 고리 행성 → 다시 달로 순환하며 형태를 바꾸는 연출.
   · canvas 2D 단일 요소, 외부 라이브러리 없음.
   · 진입 1회(헤드라인 리빌과 동기) → 정지 호흡 → 부드러운 모프 순환.
   · prefers-reduced-motion: 초승달 정적 1프레임.
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

const PAPER = "255, 249, 250";
const MINT = "33, 241, 168";

/* 입자 대역 — 인덱스 순서 고정: 앞은 은은한 채움, 뒤로 갈수록 밝은 윤곽 */
const B1 = 0.62;
const B2 = 0.92;

const HOLD_MS = 4600;
const MORPH_MS = 1500;
const MORPH_SPREAD = 550;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function MoonParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ps: Particle[] = [];
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
              const th = Math.random() * Math.PI * 2;
              const rr = R * (0.945 + Math.random() * 0.05);
              const x = Math.cos(th) * rr;
              const y = Math.sin(th) * rr;
              if (inCrescent(x, y)) p = [x, y];
            } else {
              const th = Math.random() * Math.PI * 2;
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
          const th = Math.random() * Math.PI * 2;
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
          const th = Math.random() * Math.PI * 2;
          const rr = Rd * Math.sqrt(Math.random());
          p = [Math.cos(th) * rr, Math.sin(th) * rr];
        } else if (f < B2) {
          p = ringPoint(false);
        } else {
          if (Math.random() < 0.55) {
            const th = Math.random() * Math.PI * 2;
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
      W = Math.round(rect.width * dpr);
      H = Math.round(rect.height * dpr);
      canvas!.width = W;
      canvas!.height = H;
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.37;

      const count = rect.width < 480 ? 640 : 1100;
      targets = [crescentTargets(count), starTargets(count), planetTargets(count)];
      shapeIdx = 0;

      const far = Math.max(W, H);
      ps = [];
      for (let i = 0; i < count; i++) {
        const f = i / count;
        const [tx, ty] = targets[0][i];
        const th = Math.random() * Math.PI * 2;
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
          ph: Math.random() * Math.PI * 2,
          sp: 0.5 + Math.random(),
          wob: (Math.random() * 2 - 1) * 26 * dpr,
        });
      }
      entryMax = withEntry ? 2900 : 0;
      phase = withEntry ? "entry" : "hold";
      phaseAt = performance.now();
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

      ctx!.clearRect(0, 0, W, H);

      const g = ctx!.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.1);
      g.addColorStop(0, `rgba(${PAPER}, 0.05)`);
      g.addColorStop(1, `rgba(${PAPER}, 0)`);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

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

        const x = bx + Math.sin(now * 0.00045 * p.sp + p.ph) * 1.3 * dpr;
        const y = by + Math.cos(now * 0.00038 * p.sp + p.ph) * 1.3 * dpr;
        const tw =
          phase === "entry" ? 1 : 0.84 + 0.16 * Math.sin(now * 0.0012 * p.sp + p.ph);

        ctx!.beginPath();
        ctx!.arc(cx + x, cy + y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.mint ? MINT : PAPER}, ${(p.a * tw * fade).toFixed(3)})`;
        ctx!.fill();
      }
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
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
