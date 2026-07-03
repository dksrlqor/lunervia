"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import MoonParticles from "@/components/MoonParticles";
import { btnPaper, btnGhostDark } from "@/components/ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-ink text-paper">
      {/* 시그니처 — 히어로 전면이 밤하늘, 입자가 모여 이루는 초승달 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <MoonParticles className="h-full w-full" />
      </div>

      <div className="wrap relative z-10 pt-44 pb-20 md:pb-28">
        <p className="t-label fade-up text-mint/80" style={d(150)}>
          {t.hero.eyebrow}
        </p>

        <h1 className="t-hero mt-6" aria-label={t.hero.titleLines.join(" ")}>
          {t.hero.titleLines.map((line, i) => (
            <span key={i} className="line-mask" aria-hidden="true">
              <span style={d(280 + i * 150)}>{fmt(line)}</span>
            </span>
          ))}
        </h1>

        <p
          className="fade-up mt-7 max-w-xl text-base leading-relaxed text-paper/78 md:text-lg"
          style={d(720)}
        >
          {t.hero.sub}
        </p>

        <div className="fade-up mt-10 flex flex-wrap items-center gap-4" style={d(880)}>
          <Link href="/#contact" className={btnPaper}>
            {t.hero.ctaContact}
          </Link>
          <Link href="/work" className={btnGhostDark}>
            {t.hero.ctaWork}
          </Link>
          <span className="t-label ml-1 inline-flex items-center gap-2 text-paper/70">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mint"
            />
            {t.hero.status}
          </span>
        </div>
      </div>
    </section>
  );
}
