"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import LetterScene from "@/components/badajwo/LetterScene";

/* 홈 두 번째 섹션 — 라이트. 히어로의 검정을 여기서 끊는다. */
export default function WorkSection() {
  const { t } = useI18n();

  return (
    <section id="work" className="scroll-mt-20 sheet bg-paper text-ink">
      <div className="wrap py-24 md:py-32">
        <Reveal>
          <p className="t-label flex items-center gap-2.5 text-ink/60">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-mint"
            />
            {t.work.label}
          </p>
          <h2 className="t-display mt-4">{t.work.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink/75">{t.work.lead}</p>
        </Reveal>

        {/* Featured — 받아줘 */}
        <Reveal className="mt-14">
          <Link
            href="/work"
            className="group grid overflow-hidden rounded-3xl border border-ink/10 transition-all duration-200 hover:-translate-y-1 hover:border-ink/30 md:grid-cols-[1.15fr_1fr]"
          >
            <div className="flex flex-col justify-between p-7 md:p-10">
              <div>
                <p className="t-label inline-flex items-center gap-2 text-ink/70">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-mint"
                  />
                  {t.work.featuredStatus}
                </p>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight md:text-3xl">
                  {t.work.featuredName}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-ink/78">
                  {t.work.featuredDesc}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-ink/55">
                  {t.work.featuredRole}
                </p>
                <span className="text-sm font-semibold decoration-mint decoration-2 underline-offset-4 group-hover:underline">
                  {t.work.featuredCta} →
                </span>
              </div>
            </div>
            <div className="p-4 md:p-5">
              <LetterScene />
            </div>
          </Link>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Reveal delay={0} className="h-full">
            <div className="h-full rounded-2xl border border-ink/10 p-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-ink/55 uppercase">
                {t.work.labStatus}
              </p>
              <h3 className="mt-4 text-lg font-bold">{t.work.labName}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/72">
                {t.work.labDesc}
              </p>
            </div>
          </Reveal>
          <Reveal delay={90} className="h-full">
            <Link
              href="/work"
              className="group flex h-full items-end justify-between rounded-2xl border border-ink/10 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink/30"
            >
              <span className="text-lg font-bold">{t.work.moreCta}</span>
              <span
                aria-hidden="true"
                className="text-xl transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
