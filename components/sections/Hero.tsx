"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import HeroFabric from "./HeroFabric";

/* 히어로 — 좌측 선언, 우측 운영형 패브릭.
   스크롤 시 패브릭이 카피보다 조금 빠르게 밀려 올라가며(얕은 시차)
   아래 Proof Rail 로 자연스럽게 넘겨준다. 공연형 스크롤 재킹 없음. */

export default function Hero() {
  const { t } = useI18n();
  const fabricRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        if (fabricRef.current)
          fabricRef.current.style.transform = `translateY(${y * -0.07}px)`;
        if (copyRef.current)
          copyRef.current.style.transform = `translateY(${y * -0.03}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-16">
      {/* 구조 가이드 — 히어로에만 보이는 세로 헤어라인 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="wrap relative h-full">
          <span className="absolute top-0 bottom-0 left-[41.666%] w-px bg-line/60" />
        </div>
      </div>

      <div className="wrap grid min-h-[calc(100svh-4rem)] items-center gap-12 py-14 md:grid-cols-12 md:gap-8 md:py-20">
        <div ref={copyRef} className="hero-copy md:col-span-5">
          <p className="t-label flex items-center gap-2.5 text-ink3" style={{ "--i": 0 } as CSSProperties}>
            <span aria-hidden="true" className="block size-1.5 rotate-45 bg-ice" />
            {t.hero.eyebrow}
          </p>
          <h1 className="t-hero mt-6" style={{ "--i": 1 } as CSSProperties}>
            {t.hero.titleLines.map((l, i) => (
              <span key={i} className="block">
                {fmt(l)}
              </span>
            ))}
          </h1>
          <p
            className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink2"
            style={{ "--i": 2 } as CSSProperties}
          >
            {t.hero.sub}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3" style={{ "--i": 3 } as CSSProperties}>
            <Link href="/work" className="btn btn-fill">
              {t.hero.ctaWork}
            </Link>
            <Link href="/#contact" className="btn btn-ghost">
              {t.hero.ctaContact}
            </Link>
          </div>
          <p className="mt-5" style={{ "--i": 4 } as CSSProperties}>
            <Link href="/#coena" className="lnk text-sm text-ink2">
              {t.hero.ctaCoena} →
            </Link>
          </p>
        </div>

        <div ref={fabricRef} className="md:col-span-7">
          <HeroFabric />
        </div>
      </div>
    </section>
  );
}
