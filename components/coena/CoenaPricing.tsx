import Link from "next/link";
import Reveal from "@/components/Reveal";
import { btnGhostDark, btnPaper } from "@/components/ui";

/* Coena 요금제 — 오프셋 섀도 카드 3장.
   결제 기능이 아직 없으므로 가격은 정직한 라벨(무료/미정/별도 문의)만 쓰고,
   모든 CTA 는 실존하는 문의 앵커(/#contact)로 연결한다.
   TODO(가격·결제): 확정 시 i18n coena.pricing.tiers 의 price/billing/cta 교체. */

export type PricingTier = {
  id: string;
  tag: string;
  name: string;
  desc: string;
  price: string;
  billing: string;
  features: string[];
  cta: string;
  badge: string; // 빈 문자열이면 렌더하지 않음
  highlighted: boolean;
};

const CONTACT_HREF = "/#contact";

export default function CoenaPricing({
  label,
  title,
  lead,
  tiers,
}: {
  label: string;
  title: string;
  lead: string;
  tiers: PricingTier[];
}) {
  return (
    <div>
      <Reveal>
        <p className="t-label text-mint/80">{label}</p>
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h3>
        <p className="mt-4 max-w-xl leading-relaxed text-paper/72">{lead}</p>
      </Reveal>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <li key={tier.id} className="h-full">
            <Reveal delay={i * 90} className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-2xl border-2 bg-ink p-6 transition-transform duration-200 hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-mint shadow-[6px_6px_0_0_rgba(33,241,168,0.28)]"
                    : "border-paper/70 shadow-[6px_6px_0_0_rgba(255,249,250,0.14)]"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 right-5 rounded-full bg-mint px-3 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-ink uppercase">
                    {tier.badge}
                  </span>
                )}

                <p className="font-mono text-[11px] tracking-[0.14em] text-paper/55">
                  {tier.tag}
                </p>
                <h4 className="mt-3 text-xl font-extrabold">{tier.name}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/72">
                  {tier.desc}
                </p>

                <p className="mt-6">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="ml-2 font-mono text-xs text-paper/55">
                    {tier.billing}
                  </span>
                </p>

                <ul className="mt-6 mb-8 space-y-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[14px] leading-relaxed text-paper/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-mint"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={CONTACT_HREF}
                  className={`${tier.highlighted ? btnPaper : btnGhostDark} mt-auto w-full`}
                  aria-label={`${tier.name} — ${tier.cta}`}
                >
                  {tier.cta}
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
