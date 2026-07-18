"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* CreativePricing — Coena 전용 요금제. 다른 섹션 재사용 금지.
   전체 사이트의 절제된 패널 문법을 따르되, 이 구역에서만 카드가
   살짝 기울어 있다가 호버 시 바로 선다 — 판매 구역의 유일한 유희.
   가격·결제가 확정되지 않았으므로 결제 버튼 흉내를 내지 않는다:
   Preview/Standard 는 출시 소식 채널로, Studio 는 문의로 연결된다. */

const NOTIFY_HREF = "https://www.instagram.com/lunerviasoft/";

const TILT = ["md:-rotate-1", "md:rotate-[0.6deg]", "md:rotate-0"];

export default function CreativePricing() {
  const { t } = useI18n();
  const p = t.coena.pricing;

  return (
    <div className="mt-20">
      <Reveal variant="fade" className="sect-head">
        <h3 className="t-label text-ink3">{p.label}</h3>
      </Reveal>
      <Reveal variant="mask" as="p" delay={60} className="t-title mt-6">
        {p.title}
      </Reveal>
      <Reveal variant="fade" as="p" delay={120} className="mt-3 max-w-lg text-sm leading-relaxed text-ink2">
        {p.lead}
      </Reveal>

      <ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
        {p.tiers.map((tier, i) => {
          const isStudio = tier.id === "studio";
          const href = isStudio ? "/#contact" : NOTIFY_HREF;
          const external = !isStudio;
          return (
            <Reveal
              as="li"
              key={tier.id}
              variant="dock"
              delay={i * 110}
              className={`${TILT[i]} transition-transform duration-300 will-change-transform hover:rotate-0 motion-reduce:rotate-0`}
            >
              <article
                className={`relative flex h-full flex-col rounded-lg border p-6 md:p-7 ${
                  tier.highlighted
                    ? "border-coena/50 bg-bg2"
                    : "border-line bg-bg1"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 right-5 rounded bg-coena px-2.5 py-1 text-[11px] font-bold text-bg0">
                    {tier.badge}
                  </span>
                )}
                <p className={`t-label ${tier.highlighted ? "text-coena" : "text-ink3"}`}>{tier.tag}</p>
                <h4 className="mt-3 text-xl font-bold tracking-tight">{tier.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink2">{tier.desc}</p>

                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight">{tier.price}</span>
                  <span className="t-meta text-ink3">{tier.billing}</span>
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink2">
                      <span
                        aria-hidden="true"
                        className={`mt-[7px] dot size-1.5! ${tier.highlighted ? "bg-coena" : "bg-ink3"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-coena-ghost mt-7 w-full"
                  >
                    {tier.cta}
                    <span className="sr-only"> — {t.misc.externalNote}</span>
                  </a>
                ) : (
                  <Link href={href} className="btn btn-coena mt-7 w-full">
                    {tier.cta}
                  </Link>
                )}
              </article>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
