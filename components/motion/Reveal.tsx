"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* 스크롤 진입 리빌 — 섹션마다 다른 모션 언어를 variant 로 고른다.
   fade  : 기본 — 살짝 떠오름
   clip  : 왼쪽에서 열리는 클립 (증거 바·라벨)
   dock  : 패널이 자리에 내려앉음 (사례·요금제)
   mask  : 행 단위 마스크 상승 (대형 타이포)
   line  : 헤어라인이 왼쪽에서 자라남
   초기 상태는 전부 CSS 의 (prefers-reduced-motion: no-preference) 안에만
   존재한다 — 모션 축소 환경·JS 실패 시엔 처음부터 완성 상태로 보인다. */

export default function Reveal({
  children,
  variant = "fade",
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children?: ReactNode;
  variant?: "fade" | "clip" | "dock" | "mask" | "line";
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "p" | "h1" | "h2" | "h3" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-rv={variant}
      className={`rv ${className}`}
      style={delay ? ({ "--rv-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
