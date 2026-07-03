"use client";

import { useEffect, useRef } from "react";

/* 스크롤 진행 — 뷰포트 최상단 2px 민트 라인이 문서 진행도만큼 차오른다.
   rAF 스로틀로 리렌더 없이 transform 만 갱신. 장식이 아니라 위치 피드백
   UI 라서 reduced-motion 에서도 유지한다(전환 효과 자체가 없음). */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
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
        className="h-full w-full origin-left bg-mint"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 10px rgba(33, 241, 168, 0.35)" }}
      />
    </div>
  );
}
