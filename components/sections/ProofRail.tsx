"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* Deployment Proof Rail — 히어로 직후의 증거 바.
   장식이 아니라 확인된 사실만: 운영 서비스, 개발 중 제품, 작업 방식, 스택.
   모바일에서는 가로 스크롤 스냅. */

const DOT: Record<string, string> = {
  live: "dot dot-ok pulse-live",
  ok: "dot dot-ok",
  warn: "dot dot-warn",
  plain: "dot bg-ink3",
};

export default function ProofRail() {
  const { t } = useI18n();

  return (
    <section aria-label={t.proof.sr} className="border-y border-line bg-bg1/60">
      <div className="wrap">
        <ul className="-mx-5 flex snap-x snap-mandatory gap-0 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {t.proof.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.tag}
              variant="clip"
              delay={i * 90}
              className="min-w-[78%] shrink-0 snap-start border-r border-line px-1 py-5 first:border-l-0 sm:min-w-[52%] md:min-w-0 md:px-6 md:py-6 md:first:pl-0 md:last:border-r-0"
            >
              <p className="t-label flex items-center gap-2 text-ink3">
                <span aria-hidden="true" className={DOT[item.state]} />
                {item.tag}
              </p>
              <p className="mt-2 pr-4 text-[0.95rem] font-medium text-ink">{item.text}</p>
              <p className="t-meta mt-1 text-ink3">{item.meta}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
