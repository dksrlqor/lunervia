"use client";

import { useEffect, useId, useRef } from "react";

/* Coena 인트로 전용 구이(gooey) 모프 — 짧은 동사들이 서로 녹아들며 순환한다.
   흔한 데모 코드 대비 수정 사항:
   - rAF id 저장·cancel — unmount 후 루프 잔류(누수) 방지
   - SVG filter id 를 useId 로 — 한 페이지에 여러 개 있어도 충돌 없음
   - blur 분모 하한(1e-4) — 0 나누기로 인한 NaN/Infinity 방지
   - dt 상한 0.1s — 탭 복귀·프레임 드랍 시 모프가 건너뛰지 않게
   - IntersectionObserver — 화면 밖에서는 루프 정지
   - reduced-motion: 루프 미기동 + CSS(motion-reduce)로 정적 문구 표시
   - 모션 텍스트는 aria-hidden, 의미는 sr-only 문장이 전달 */

export default function GooeyText({
  texts,
  srText,
  morphTime = 1.1,
  cooldownTime = 1.5,
  className = "",
  textClassName = "",
}: {
  texts: string[];
  srText: string;
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}) {
  const rawId = useId();
  const filterId = `gooey-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const elA = aRef.current;
    const elB = bRef.current;
    if (!wrap || !elA || !elB || texts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let idx = 0;
    let phase: "hold" | "morph" = "hold";
    let t = 0;
    let lastTime = 0;

    elA.textContent = texts[0];
    elB.textContent = texts[1];

    /* f: 0 = 현재 단어만, 1 = 다음 단어만 */
    const apply = (f: number) => {
      const fIn = Math.max(f, 1e-4);
      const fOut = Math.max(1 - f, 1e-4);
      elB.style.filter = `blur(${Math.min(8 / fIn - 8, 100)}px)`;
      elB.style.opacity = `${Math.pow(fIn, 0.4) * 100}%`;
      elA.style.filter = `blur(${Math.min(8 / fOut - 8, 100)}px)`;
      elA.style.opacity = `${Math.pow(fOut, 0.4) * 100}%`;
    };
    apply(0);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - (lastTime || now)) / 1000, 0.1);
      lastTime = now;
      t += dt;
      if (phase === "hold") {
        if (t >= cooldownTime) {
          phase = "morph";
          t = 0;
        }
        return;
      }
      const f = Math.min(t / morphTime, 1);
      apply(f);
      if (f >= 1) {
        idx = (idx + 1) % texts.length;
        elA.textContent = texts[idx];
        elB.textContent = texts[(idx + 1) % texts.length];
        apply(0);
        phase = "hold";
        t = 0;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);

    return () => {
      stop();
      io.disconnect();
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <p className="sr-only">{srText}</p>

      <div
        aria-hidden="true"
        className="relative hidden motion-safe:block"
        style={{ filter: `url(#${filterId})` }}
      >
        {/* A 는 흐름에 남아 높이를 만들고, B 가 그 위에 겹친다 —
            단어가 바뀌어도 밴드 높이가 흔들리지 않는다 */}
        <span
          ref={aRef}
          className={`block text-center whitespace-nowrap ${textClassName}`}
        >
          {texts[0] ?? ""}
        </span>
        <span
          ref={bRef}
          className={`absolute inset-0 flex items-center justify-center whitespace-nowrap opacity-0 ${textClassName}`}
        >
          {texts[1] ?? ""}
        </span>
      </div>

      {/* reduced-motion — 모프 대신 전체 문구를 정적으로 */}
      <div
        aria-hidden="true"
        className="hidden flex-wrap items-baseline justify-center gap-x-4 gap-y-1 motion-reduce:flex"
      >
        {texts.map((w) => (
          <span key={w} className={textClassName}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
