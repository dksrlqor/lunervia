"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import Reveal from "@/components/motion/Reveal";

/* Engineering Philosophy — 사이트에서 유일한 밝은 섹션.
   카드 없이 타이포그래피가 구조를 만든다. 다크 리듬의 호흡 지점. */

export default function Philosophy() {
  const { t } = useI18n();

  return (
    <section className="on-paper bg-paper text-paperink">
      <div className="wrap sect">
        <Reveal
          variant="fade"
          className="sect-head [--head-line:rgba(20,24,31,0.15)]"
        >
          <h2 className="t-label text-paperink2">{t.philosophy.label}</h2>
        </Reveal>

        <Reveal variant="mask" as="p" delay={80} className="t-quote mt-12 max-w-3xl">
          {fmt(t.philosophy.quote)}
        </Reveal>

        <div className="mt-16 grid gap-0 border-t border-paperink/15 md:grid-cols-3">
          {t.philosophy.principles.map((p, i) => (
            <Reveal
              as="p"
              key={i}
              variant="fade"
              delay={i * 110}
              className="border-b border-paperink/15 py-7 leading-relaxed text-paperink2 md:border-b-0 md:border-r md:py-9 md:pr-8 md:last:border-r-0 md:last:pr-0 md:[&:nth-child(2)]:pl-8 md:last:pl-8"
            >
              <span className="t-meta mr-3 text-paperink/50">{String(i + 1).padStart(2, "0")}</span>
              {p}
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={200} className="mt-12">
          <Link
            href="/why"
            className="lnk font-medium text-paperink! hover:text-[#2f5d8f]!"
            style={{ textDecorationColor: "rgba(20,24,31,0.3)" }}
          >
            {t.philosophy.cta} →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
