"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import Reveal from "@/components/Reveal";
import WritingParticles from "@/components/why/WritingParticles";
import { btnPaper, btnInk, btnGhostLight } from "@/components/ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function WhyView() {
  const { t } = useI18n();
  const w = t.why;

  return (
    <>
      {/* 히어로 — 별이 손과 책이 되어 글을 쓴다. 홈 히어로와 같은 문법 */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-ink text-paper">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <WritingParticles className="h-full w-full" />
        </div>

        <div className="wrap relative z-10 pt-44 pb-20 md:pb-28">
          <p className="t-label fade-up text-mint/80" style={d(150)}>
            {w.eyebrow}
          </p>

          <h1 className="t-hero mt-6" aria-label={w.heroLines.join(" ")}>
            {w.heroLines.map((line, i) => (
              <span key={i} className="line-mask" aria-hidden="true">
                <span style={d(280 + i * 150)}>{fmt(line)}</span>
              </span>
            ))}
          </h1>

          <p
            className="fade-up mt-7 max-w-xl text-base leading-relaxed text-paper/78 md:text-lg"
            style={d(700)}
          >
            {w.heroSub}
          </p>

          <div className="fade-up mt-10" style={d(860)}>
            <a href="#story" className={btnPaper}>
              {w.readCta} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* 장문 스토리 — 가독이 전부인 지면 */}
      <section id="story" className="sheet bg-paper text-ink">
        <div className="wrap py-24 md:py-32">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <p className="t-label text-ink/60">{w.storyLabel}</p>
            </Reveal>

            {w.chapters.map((ch, ci) => (
              <Fragment key={ch.no}>
                <Reveal className={ci === 0 ? "mt-10" : "mt-20 md:mt-24"}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 rounded-full bg-mint"
                    />
                    <span className="font-mono text-sm font-semibold tracking-[0.12em] text-ink/60">
                      {ch.no}
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight md:text-[1.75rem]">
                      {ch.title}
                    </h2>
                  </div>
                </Reveal>

                <Reveal className="mt-7">
                  <div className="space-y-7 text-[1.0625rem] leading-[1.95] text-ink/82 md:text-lg">
                    {ch.paragraphs.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>
                </Reveal>

                {/* 인용 — 다크 카드 위에서만 민트 단어를 켠다 */}
                {(ci === 1 || ci === 2) && (
                  <Reveal className="my-16 md:my-20">
                    <blockquote className="rounded-3xl bg-ink px-8 py-10 text-paper md:px-12 md:py-14">
                      <p className="t-quote">{fmt(ci === 1 ? w.quote1 : w.quote2)}</p>
                    </blockquote>
                  </Reveal>
                )}
              </Fragment>
            ))}

            <Reveal className="mt-16 border-t border-ink/10 pt-8">
              <p className="font-mono text-sm leading-relaxed text-ink/55">{w.sign}</p>
            </Reveal>

            <Reveal className="mt-10">
              <div className="flex flex-wrap gap-3">
                <Link href="/#contact" className={btnInk}>
                  {w.ctaContact}
                </Link>
                <Link href="/work" className={btnGhostLight}>
                  {w.ctaWork}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
