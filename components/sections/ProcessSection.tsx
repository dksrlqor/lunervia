"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* Process — 히어로 패브릭과 같은 파이프라인 어휘를 정적 5단계로 풀어 쓴다.
   데스크톱: 연결선 위 가로 5열, 모바일: 세로 타임라인. */

export default function ProcessSection() {
  const { t } = useI18n();

  return (
    <section className="sect border-t border-line">
      <div className="wrap">
        <Reveal variant="fade" className="sect-head">
          <h2 className="t-label text-ink3">{t.process.label}</h2>
        </Reveal>
        <Reveal variant="mask" as="p" delay={80} className="t-display mt-6">
          {t.process.title}
        </Reveal>
        <Reveal variant="fade" as="p" delay={140} className="mt-4 max-w-md text-ink2">
          {t.process.lead}
        </Reveal>

        <div className="relative mt-14">
          {/* 데스크톱 연결선 — 왼쪽에서 자라난다 */}
          <Reveal
            variant="line"
            className="absolute top-[9px] right-0 left-0 hidden h-px bg-line md:block"
          />
          <ol className="grid gap-8 md:grid-cols-5 md:gap-6">
            {t.process.steps.map((s, i) => (
              <Reveal as="li" key={s.code} variant="fade" delay={120 + i * 110} className="relative flex gap-4 md:block">
                {/* 노드 점 */}
                <span
                  aria-hidden="true"
                  className="relative z-10 mt-[2px] flex size-[19px] shrink-0 items-center justify-center rounded-full border border-linestrong bg-bg0 md:mt-0"
                >
                  <span className="size-1.5 rounded-full bg-ice" />
                </span>
                <div className="md:mt-5">
                  <p className="t-label text-ink3">
                    {s.code}
                  </p>
                  <h3 className="mt-1.5 font-semibold">{s.name}</h3>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-ink2">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          {/* 모바일 세로 연결선 */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-6 left-[9px] w-px bg-line md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
