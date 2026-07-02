"use client";

import type { ReactNode } from "react";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** 서브 페이지 공통 헤더 — 브랜드 일관성을 위해 항상 다크로 시작한다. */
export default function PageHeader({
  label,
  title,
  lead,
  children,
}: {
  label: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-ink text-paper">
      <div className="wrap pt-40 pb-16 md:pt-48 md:pb-20">
        <p className="t-label fade-up text-paper/55" style={d(100)}>
          {label}
        </p>
        <h1 className="t-display fade-up mt-4 max-w-3xl" style={d(220)}>
          {title}
        </h1>
        {lead && (
          <p
            className="fade-up mt-5 max-w-xl leading-relaxed text-paper/65"
            style={d(340)}
          >
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
