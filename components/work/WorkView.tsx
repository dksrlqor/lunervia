"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import LetterScene from "@/components/badajwo/LetterScene";
import { btnPaper, btnGhostLight } from "@/components/ui";

export default function WorkView() {
  const { t } = useI18n();
  const w = t.workPage;

  return (
    <>
      <PageHeader label={w.label} title={w.title} lead={w.lead} />

      {/* Featured — 받아줘. §3-1: 다크 흐름 속에서 열리는 따뜻한 픽셀 세계 */}
      <section className="sheet bg-ink text-paper">
        <div className="wrap py-16 md:py-24">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-[1fr_1.05fr] md:gap-12">
              <div className="min-h-72 md:min-h-96">
                <LetterScene catPx={9} interactive petHint={w.badajwo.petHint} />
              </div>

              <div>
                <p className="t-label inline-flex items-center gap-2 text-paper/55">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-mint"
                  />
                  {w.badajwo.status}
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
                  {w.badajwo.name}
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-paper/70">
                  {w.badajwo.desc}
                </p>

                <h3 className="t-label mt-8 text-paper/40">{w.badajwo.featuresLabel}</h3>
                <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {w.badajwo.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-paper/70">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-paper/35"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <h3 className="t-label mt-7 text-paper/40">{w.badajwo.stackLabel}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {w.badajwo.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-paper/15 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-paper/55 uppercase"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="https://takemyletter.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPaper}
                  >
                    {w.badajwo.cta}
                  </a>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-paper/40">
                    {w.badajwo.role}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 그 외 작업 — 라이트 */}
      <section className="sheet bg-paper text-ink">
        <div className="wrap py-16 md:py-24">
          <ul className="grid gap-4 md:grid-cols-3">
            {w.cards.map((c, i) => (
              <li key={c.name} className="h-full">
                <Reveal delay={i * 90} className="h-full">
                  <div className="h-full rounded-2xl border border-ink/10 p-6">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] tracking-[0.18em] text-ink/40 uppercase">
                        {c.tag}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.12em] text-ink/45 uppercase">
                        {c.status}
                      </p>
                    </div>
                    <h2 className="mt-4 text-lg font-bold">{c.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{c.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink/10 p-7 md:p-9">
              <p className="text-lg font-bold">{t.contact.title}</p>
              <a href="/#contact" className={btnGhostLight}>
                {t.hero.ctaContact}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
