"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import Reveal from "@/components/Reveal";
import WritingParticles from "@/components/why/WritingParticles";
import { btnPaper } from "@/components/ui";

/* 홈 세 번째 섹션 — 만든 이유로 보내는 초대장.
   히어로 문법의 다크 풀블리드: 별이 책과 손이 되어 글을 쓰는 장면이
   배경 전체에 깔린다. 앞뒤가 라이트 시트(Work·Services)라 검정이
   이어지지 않고 하나의 어두운 막으로 선다. */
export default function WhyInvite() {
  const { t } = useI18n();
  const w = t.whyInvite;

  return (
    <section className="sheet relative flex min-h-[92svh] items-end overflow-hidden bg-ink text-paper">
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
