"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { btnInk, btnGhostLight } from "@/components/ui";

export default function WhyView() {
  const { t } = useI18n();
  const w = t.why;

  return (
    <>
      <PageHeader label={w.eyebrow} title={w.title} lead={w.intro} />

      <section className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-28">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <div className="space-y-6 leading-relaxed text-ink/75">
                {w.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            {/* 강조 인용 — 가는 민트 획 하나만 허용 */}
            <Reveal className="my-12">
              <blockquote className="border-l-2 border-mint pl-6 text-xl leading-relaxed font-bold tracking-tight md:text-2xl">
                {w.emphasis}
              </blockquote>
            </Reveal>

            <Reveal>
              <div className="space-y-6 leading-relaxed text-ink/75">
                {w.paragraphs2.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <p className="font-mono text-sm leading-relaxed text-ink/45">{w.enLine}</p>
            </Reveal>

            <Reveal className="mt-12">
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
