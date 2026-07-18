"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";
import GooeyText from "./GooeyText";
import CreativePricing from "./CreativePricing";

/* Coena — 사이트 안의 독립 제품 구역.
   공통 그리드·타이포는 그대로 쓰되, 이 구역에서만 민트 액센트와
   유동형 장치(GooeyText·CreativePricing)를 허용한다.
   흐름 고정: 순환 문구 → 제품 설명 → 기능 이해 → 요금제 선택. */

export default function CoenaSection() {
  const { t } = useI18n();
  const c = t.coena;

  return (
    <section
      id="coena"
      className="coena-zone scroll-mt-16 border-t border-coena/25 bg-bg0"
    >
      <div className="wrap sect">
        <Reveal
          variant="fade"
          className="sect-head [--head-line:rgba(43,232,172,0.2)]"
        >
          <h2 className="t-label flex items-center gap-2.5 text-ink3">
            <span aria-hidden="true" className="block size-1.5 rotate-45 bg-coena" />
            {c.eyebrow}
          </h2>
        </Reveal>

        {/* 1 — 순환 문구 (GooeyText, Coena 전용 장치) */}
        <div className="mt-16 md:mt-20">
          <GooeyText
            texts={c.gooey}
            srText={c.gooeySr}
            className="gooey-band"
            textClassName="t-quote text-coena"
          />
        </div>

        {/* 2 — 제품 설명 */}
        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal variant="mask" as="h3" delay={60} className="t-display">
              {c.title}
            </Reveal>
            <Reveal variant="fade" as="p" delay={130} className="mt-5 max-w-xl leading-relaxed text-ink2">
              {c.body}
            </Reveal>
            <Reveal variant="fade" delay={190} className="t-meta mt-7 flex items-center gap-2.5 text-warn">
              <span className="dot dot-warn" />
              {c.status}
            </Reveal>
          </div>

          {/* 3 — 기능 이해 */}
          <ul className="space-y-px overflow-hidden rounded-lg border border-line md:col-span-6">
            {c.features.map((f, i) => (
              <Reveal
                as="li"
                key={f.tag}
                variant="clip"
                delay={i * 110}
                className="flex flex-col gap-1.5 border-b border-line bg-bg1 p-5 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-5 md:p-6"
              >
                <code className="t-meta shrink-0 text-coena sm:w-40">{f.tag}</code>
                <p className="text-sm leading-relaxed text-ink2">{f.desc}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* 4 — 요금제 선택 (CreativePricing, Coena 전용 장치) */}
        <CreativePricing />
      </div>
    </section>
  );
}
