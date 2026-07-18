"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import GooeyText from "@/components/coena/GooeyText";
import CoenaPricing from "@/components/coena/CoenaPricing";
import { btnGhostDark, btnPaper } from "@/components/ui";

/* Coena(코이나) — AI 위에 얹는 살아있는 계층.

   시각 장치는 균사 캔버스 대신 타이포그래피: 코이나의 실제 루프
   (검증 → 회복 → 기억 → 내보냄)가 구이 모프로 서로 녹아들며 순환한다.
   흐름: 인트로 → 모프 밴드 → 기능 3열 → 요금제 → 상태·CTA. */

/* 시제품/기술 노트 URL — 공개되면 여기만 채우면 된다. 비어 있으면
   해당 버튼은 렌더되지 않는다. */
const PROTOTYPE_URL = "";
const NOTES_URL = "";

export default function CoenaSection() {
  const { t } = useI18n();
  const c = t.coena;

  return (
    <section id="coena" className="sheet bg-ink text-paper">
      <div className="wrap py-24 md:py-32">
        <Reveal>
          <p className="t-label text-mint/80">{c.eyebrow}</p>
          <h2 className="t-display mt-4">{c.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-paper/78">{c.body}</p>
        </Reveal>

        {/* 모프 밴드 — 이 섹션의 유일한 볼드 요소 */}
        <Reveal delay={120}>
          <div className="mt-14 border-y border-paper/10 py-14 md:mt-20 md:py-20">
            <GooeyText
              texts={c.gooey}
              srText={c.gooeySr}
              textClassName="text-[clamp(2.2rem,7vw,4.6rem)] font-black tracking-[-0.03em]"
            />
          </div>
        </Reveal>

        {/* 기능 — 모프의 동사들이 실제로 뜻하는 것 */}
        <div className="mt-14 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-3">
          {c.features.map((f, i) => (
            <Reveal key={f.tag} delay={i * 90}>
              <code className="font-mono text-[13px] font-medium text-mint">
                {f.tag}
              </code>
              <p className="mt-2.5 text-[15px] leading-relaxed text-paper/72">
                {f.desc}
              </p>
            </Reveal>
          ))}
        </div>

        {/* 요금제 */}
        <div className="mt-20 md:mt-28">
          <CoenaPricing
            label={c.pricing.label}
            title={c.pricing.title}
            lead={c.pricing.lead}
            tiers={c.pricing.tiers}
          />
        </div>

        {/* 상태 라인 + (URL 이 생기면) 보조 CTA */}
        <Reveal className="mt-14 md:mt-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <p className="font-mono text-xs tracking-[0.08em] text-paper/50">
              {c.status}
            </p>
            {PROTOTYPE_URL && (
              <a
                href={PROTOTYPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={btnPaper}
              >
                {c.ctaPrototype}
              </a>
            )}
            {NOTES_URL && (
              <a href={NOTES_URL} className={btnGhostDark}>
                {c.ctaNotes}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
