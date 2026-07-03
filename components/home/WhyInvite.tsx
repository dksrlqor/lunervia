"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import Reveal from "@/components/Reveal";
import WritingParticles from "@/components/why/WritingParticles";
import { btnPaper } from "@/components/ui";

/* 홈 두 번째 섹션 — 만든 이유로 보내는 초대장.
   히어로와 같은 문법: 밤하늘이 이어지고(시트 없음), 별이 책과 손이 되어
   글을 쓰는 장면을 배경에 깔고, 대형 헤드라인 하나와 버튼 하나만 둔다. */
export default function WhyInvite() {
  const { t } = useI18n();
  const w = t.whyInvite;

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink text-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <WritingParticles className="h-full w-full" />
      </div>

      <div className="wrap relative z-10 pt-40 pb-20 md:pb-28">
        <Reveal>
          <p className="t-label text-mint/80">{w.label}</p>
        </Reveal>

        <Reveal delay={120}>
          <h2
            className="mt-6 font-black tracking-[-0.035em] break-keep"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)", lineHeight: 1.08 }}
          >
            {w.titleLines.map((line, i) => (
              <span key={i} className="block">
                {fmt(line)}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-paper/78 md:text-lg">
            {w.lead}
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-10">
            <Link href="/why" className={btnPaper}>
              {w.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
