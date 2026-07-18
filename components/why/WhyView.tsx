"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import Reveal from "@/components/motion/Reveal";

/* /why — 만든 이유. 에디토리얼 페이지: 장치 없이 타이포와 문단이 전부.
   챕터 번호는 실제 이야기의 순서(이름→시작→방식→앞으로)를 나른다. */

export default function WhyView() {
  const { t } = useI18n();
  const w = t.why;

  return (
    <>
      {/* 헤드 */}
      <section className="border-b border-line pt-16">
        <div className="wrap py-16 md:py-24">
          <Reveal variant="fade" className="sect-head">
            <p className="t-label text-ink3">{w.eyebrow}</p>
          </Reveal>
          <Reveal variant="mask" as="h1" delay={80} className="t-hero mt-8 max-w-3xl">
            {w.heroLines.map((l, i) => (
              <span key={i} className="block">
                {fmt(l)}
              </span>
            ))}
          </Reveal>
          <Reveal variant="fade" as="p" delay={160} className="mt-5 max-w-md text-ink2">
            {w.heroSub}
          </Reveal>
        </div>
      </section>

      {/* 본문 — 챕터 1·2 */}
      <section className="sect">
        <div className="wrap">
          <Reveal variant="fade" className="sect-head">
            <h2 className="t-label text-ink3">{w.storyLabel}</h2>
          </Reveal>

          {w.chapters.slice(0, 2).map((ch) => (
            <article key={ch.no} className="mt-16 grid gap-6 md:grid-cols-12 md:gap-8">
              <Reveal variant="fade" className="md:col-span-4">
                <p className="t-label text-ink3">{ch.no}</p>
                <h3 className="t-title mt-3">{ch.title}</h3>
              </Reveal>
              <div className="space-y-5 md:col-span-7 md:col-start-6">
                {ch.paragraphs.map((p, i) => (
                  <Reveal as="p" key={i} variant="fade" delay={i * 70} className="leading-[1.85] text-ink2">
                    {p}
                  </Reveal>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 인용 1 — 라이트 브레이크 */}
      <section className="on-paper bg-paper text-paperink">
        <div className="wrap sect-tight">
          <Reveal variant="mask" as="p" className="t-quote max-w-3xl">
            {fmt(w.quote1)}
          </Reveal>
        </div>
      </section>

      {/* 본문 — 챕터 3·4 */}
      <section className="sect">
        <div className="wrap">
          {w.chapters.slice(2).map((ch, idx) => (
            <article
              key={ch.no}
              className={`grid gap-6 md:grid-cols-12 md:gap-8 ${idx > 0 ? "mt-16" : ""}`}
            >
              <Reveal variant="fade" className="md:col-span-4">
                <p className="t-label text-ink3">{ch.no}</p>
                <h3 className="t-title mt-3">{ch.title}</h3>
              </Reveal>
              <div className="space-y-5 md:col-span-7 md:col-start-6">
                {ch.paragraphs.map((p, i) => (
                  <Reveal as="p" key={i} variant="fade" delay={i * 70} className="leading-[1.85] text-ink2">
                    {p}
                  </Reveal>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 인용 2 + 마무리 */}
      <section className="border-t border-line bg-bg1/50">
        <div className="wrap sect">
          <Reveal variant="mask" as="p" className="t-quote max-w-3xl">
            {fmt(w.quote2)}
          </Reveal>
          <Reveal variant="fade" delay={120} className="t-meta mt-10 text-ink3">
            {w.sign}
          </Reveal>
          <Reveal variant="fade" delay={180} className="mt-9 flex flex-wrap gap-3">
            <Link href="/#contact" className="btn btn-fill">
              {w.ctaContact}
            </Link>
            <Link href="/work" className="btn btn-ghost">
              {w.ctaWork}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
