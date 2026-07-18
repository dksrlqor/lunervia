"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* /work — 작업 아카이브. 받아줘 상세 + 준비 중인 축들.
   확인된 사실만: 기능 목록·스택·역할 전부 실제 구현 내역이다. */

export default function WorkView() {
  const { t } = useI18n();
  const w = t.workPage;
  const b = w.badajwo;

  return (
    <>
      {/* 페이지 헤드 */}
      <section className="border-b border-line pt-16">
        <div className="wrap py-16 md:py-24">
          <Reveal variant="fade" className="sect-head">
            <p className="t-label text-ink3">{w.label}</p>
          </Reveal>
          <Reveal variant="mask" as="h1" delay={80} className="t-hero mt-8 max-w-3xl">
            {w.title}
          </Reveal>
          <Reveal variant="fade" as="p" delay={160} className="mt-5 max-w-md text-ink2">
            {w.lead}
          </Reveal>
        </div>
      </section>

      {/* 받아줘 상세 */}
      <section className="sect">
        <div className="wrap grid items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="t-meta flex items-center gap-2 text-ok">
              <span className="dot dot-ok pulse-live" />
              {b.status}
            </p>
            <Reveal variant="mask" as="h2" delay={60} className="t-display mt-4">
              {b.name}
            </Reveal>
            <Reveal variant="fade" as="p" delay={120} className="mt-5 max-w-2xl leading-relaxed text-ink2">
              {b.desc}
            </Reveal>

            <Reveal variant="fade" delay={180} className="mt-9">
              <h3 className="t-label text-ink3">{b.featuresLabel}</h3>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {b.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink2">
                    <span aria-hidden="true" className="mt-[7px] dot dot-ok size-1.5!" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="fade" delay={220} className="mt-9">
              <a
                href="https://takemyletter.site"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-fill"
              >
                {b.cta}
                <span className="sr-only"> — {t.misc.externalNote}</span>
              </a>
            </Reveal>
          </div>

          <Reveal variant="dock" delay={140} className="md:col-span-5">
            <div className="panel p-6 md:p-7">
              <h3 className="t-label text-ink3">{b.stackLabel}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.stack.map((s) => (
                  <li key={s} className="t-meta rounded border border-line px-2.5 py-1.5 text-ink2">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-line pt-6">
                <h3 className="t-label text-ink3">ROLE</h3>
                <p className="mt-3 text-sm text-ink2">{b.role}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 준비 중인 축들 */}
      <section id="lab" className="sect-tight scroll-mt-16 border-t border-line">
        <div className="wrap">
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
            {w.cards.map((card, i) => (
              <Reveal as="div" key={card.name} variant="fade" delay={i * 100} className="bg-bg1 p-6 md:p-8">
                <p className="t-label flex items-center justify-between text-ink3">
                  {card.tag}
                  <span className="t-meta tracking-normal normal-case text-warn">{card.status}</span>
                </p>
                <h2 className="mt-4 text-lg font-bold tracking-tight">{card.name}</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink2">{card.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
