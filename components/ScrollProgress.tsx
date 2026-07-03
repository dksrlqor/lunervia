"use client";

import { useEffect, useRef } from "react";

/* 스크롤 진행 — 뷰포트 최상단 2px 민트 라인이 문서 진행도만큼 차오르고,
   그 끝을 작은 혜성 머리(글로우 팁)가 이끈다. 히어로의 밤하늘과 같은
   세계관: 진행 바 = 하늘을 가로지르는 유성의 궤적.
   rAF 스로틀로 리렌더 없이 transform 만 갱신. 장식이 아니라 위치 피드백
   UI 라서 reduced-motion 에서도 유지한다(전환 효과 자체가 없음). */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const head = headRef.current;
    if (!bar || !head) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${p})`;
      /* clientWidth — innerWidth 는 스크롤바를 포함해 끝에서 오버슛한다 */
      head.style.transform = `translateX(${p * doc.clientWidth}px)`;
      head.style.opacity = p > 0.002 ? "1" : "0";
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    /* 라우트 이동·언어 전환 등 스크롤 이벤트 없이 문서 높이만 변하는 경우 */
    const ro = new ResizeObserver(queue);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-mint/80"
        style={{ transform: "scaleX(0)" }}
      />
      {/* 혜성 머리 — 진행 라인의 리딩 엣지. translateX 는 팁 위치(px) */}
      <div
        ref={headRef}
        className="absolute top-0 h-full w-5 opacity-0"
        style={{
          right: "100%",
          left: "auto",
          background:
            "linear-gradient(to right, rgba(33, 241, 168, 0), rgba(33, 241, 168, 1))",
          boxShadow: "0 0 12px rgba(33, 241, 168, 0.6), 0 0 3px rgba(33, 241, 168, 0.9)",
          transform: "translateX(0px)",
        }}
      />
    </div>
  );
}
