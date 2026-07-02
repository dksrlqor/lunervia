"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   시그니처 — 흩어진 입자가 모여 초승달이 되는 연출.
   · canvas 2D 단일 요소, 외부 라이브러리 없음.
   · 진입 1회(로드 시 헤드라인 리빌과 동기) → 이후 미세한 표류/반짝임.
   · prefers-reduced-motion: 완성된 달을 정적 1프레임으로만 그린다.
   · 화면 밖/백그라운드 탭에서는 rAF 정지.
   ============================================================ */

type Particle = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  r: number;
  a: number;
  mint: boolean;
  delay: number;
  dur: number;
  ph: number;
  sp: number;
  wob: number;
};

const PAPER = "255, 249, 250";
const MINT = "33, 241, 168";

export default function MoonParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ps: Particle[] = [];
    let W = 0;
    let H = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let entryAt = performance.now();

    /* 초승달 = 바깥 원 − 물린 원(오른쪽 위로 비켜 감) */
    const inCrescent = (x: number, y: number) => {
      if (x * x + y * y > R * R) return false;
      const bx = x - 0.45 * R;
      const by = y + 0.2 * R;
      const br = 0.85 * R;
      return bx * bx + by * by >= br * br;
    };

    function makeTarget(kind: 0 | 1 | 2): [number, number] {
      for (let i = 0; i < 80; i++) {
        if (kind === 0) {
          const x = (Math.random() * 2 - 1) * R;
          const y = (Math.random() * 2 - 1) * R;
          if (inCrescent(x, y)) return [x, y];
        } else if (kind === 1) {
          const th = Math.random() * Math.PI * 2;
          const rr = R * (0.94 + Math.random() * 0.055);
          const x = Math.cos(th) * rr;
          const y = Math.sin(th) * rr;
          if (inCrescent(x, y)) return [x, y];
        } else {
          const th = Math.random() * Math.PI * 2;
          const rr = 0.85 * R * (1.008 + Math.random() * 0.05);
          const x = 0.45 * R + Math.cos(th) * rr;
          const y = -0.2 * R + Math.sin(th) * rr;
          if (inCrescent(x, y)) return [x, y];
        }
      }
      return [-R * 0.45, R * 0.3];
    }

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

      const count = rect.width < 480 ? 520 : 900;
      const far = Math.max(W, H);
      ps = [];
      for (let i = 0; i < count; i++) {
        const kind: 0 | 1 | 2 = i < count * 0.7 ? 0 : i < count * 0.88 ? 1 : 2;
        const [tx, ty] = makeTarget(kind);
        const th = Math.random() * Math.PI * 2;
        const d = far * (0.5 + Math.random() * 0.55);
        ps.push({
          tx,
          ty,
          sx: tx + Math.cos(th) * d,
          sy: ty + Math.sin(th) * d,
          r: (kind === 0 ? 0.5 + Math.random() * 1.0 : 0.7 + Math.random() * 1.1) * dpr,
          a: kind === 0 ? 0.16 + Math.random() * 0.55 : 0.45 + Math.random() * 0.45,
          mint: Math.random() < 0.055,
          delay: withEntry ? Math.random() * 1100 : 0,
          dur: withEntry ? 900 + Math.random() * 1700 : 1,
          ph: Math.random() * Math.PI * 2,
          sp: 0.5 + Math.random(),
          wob: (Math.random() * 2 - 1) * 26 * dpr,
        });
      }
      entryAt = performance.now();
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);

      const g = ctx!.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.1);
      g.addColorStop(0, `rgba(${PAPER}, 0.055)`);
      g.addColorStop(1, `rgba(${PAPER}, 0)`);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

      for (const p of ps) {
        const t = Math.min(Math.max((now - entryAt - p.delay) / p.dur, 0), 1);
        const e = 1 - Math.pow(1 - t, 3);
        let x: number;
        let y: number;
        if (t < 1) {
          const swirl = Math.sin(e * Math.PI) * p.wob;
          x = p.sx + (p.tx - p.sx) * e + swirl * Math.sin(p.ph);
          y = p.sy + (p.ty - p.sy) * e + swirl * Math.cos(p.ph);
        } else {
          x = p.tx + Math.sin(now * 0.00045 * p.sp + p.ph) * 1.4 * dpr;
          y = p.ty + Math.cos(now * 0.00038 * p.sp + p.ph) * 1.4 * dpr;
        }
        const tw = t < 1 ? 1 : 0.82 + 0.18 * Math.sin(now * 0.0012 * p.sp + p.ph);
        ctx!.beginPath();
        ctx!.arc(cx + x, cy + y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.mint ? MINT : PAPER}, ${(p.a * tw * (t < 1 ? Math.max(e, 0.05) : 1)).toFixed(3)})`;
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
      draw(entryAt + 10);
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
