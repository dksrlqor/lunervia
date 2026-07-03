"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import WritingParticles from "@/components/why/WritingParticles";
import { btnInk } from "@/components/ui";

/* 홈 두 번째 섹션 — 만든 이유로 보내는 초대장.
   히어로의 검정이 그대로 이어지면 다크 구간이 두 화면 가까이 되므로
   여기서 라이트 시트로 끊고, 별-글쓰기 장면은 다크 라운드 패널
   ("밤하늘로 난 창") 안에만 남긴다 — 다크↔라이트 교차 리듬 복원. */

/* "**단어**" → 라이트 지면에선 민트 텍스트가 저대비라, 잉크 글자에
   민트 밑줄로 강조한다(fmt 의 라이트 버전). */
function accent(s: string): ReactNode {
  return s.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        className="underline decoration-mint decoration-[0.13em] underline-offset-[0.16em]"
      >
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function WhyInvite() {
  const { t } = useI18n();
  const w = t.whyInvite;

  return (
    <section className="sheet bg-paper text-ink">
      <div className="wrap py-20 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
          <Reveal>
            <p className="t-label flex items-center gap-2.5 text-ink/60">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-mint"
              />
              {w.label}
            </p>

            <h2
              className="mt-6 font-black tracking-[-0.035em] break-keep"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: 1.1 }}
            >
              {w.titleLines.map((line, i) => (
                <span key={i} className="block">
                  {accent(line)}
                </span>
              ))}
            </h2>

            <p className="mt-6 max-w-lg leading-relaxed text-ink/75 md:text-lg">
              {w.lead}
            </p>

            <div className="mt-9">
              <Link href="/why" className={btnInk}>
                {w.cta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          {/* 밤하늘로 난 창 — 별이 책과 손이 되어 글을 쓴다 */}
          <Reveal delay={140}>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-ink md:aspect-[5/4]">
              <WritingParticles variant="panel" className="h-full w-full" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
