"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import { fmt } from "@/components/format";

export default function Philosophy() {
  const { t } = useI18n();

  return (
    <section id="philosophy" className="sheet bg-ink text-paper">
      <div className="wrap py-24 md:py-36">
        <Reveal>
          <p className="t-label text-mint/80">{t.philosophy.label}</p>
          <blockquote className="t-quote mt-8 max-w-4xl">
            {fmt(t.philosophy.big)}
          </blockquote>
        </Reveal>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2">
          {t.philosophy.cards.map((c, i) => (
            <li key={c.en} className="h-full">
              <Reveal delay={(i % 2) * 90} className="h-full">
                <div className="h-full rounded-2xl border border-paper/12 p-6 md:p-7">
                  <h3 className="flex items-center gap-2.5 text-lg font-bold">
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full bg-mint"
                    />
                    {c.en}
                  </h3>
                  {c.name !== c.en && (
                    <p className="mt-1 text-sm text-paper/65">{c.name}</p>
                  )}
                  <p className="mt-3 text-[15px] leading-relaxed text-paper/75">
                    {c.desc}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* 만든 이유 — 지나칠 수 없는 크기의 초대장 */}
        <Reveal className="mt-16">
          <Link
            href="/why"
            className="group block rounded-3xl border border-paper/12 p-8 transition-all duration-200 hover:-translate-y-1 hover:border-mint/45 md:p-12"
          >
            <p className="t-label text-mint/80">WHY LUNERVIA</p>
            <p className="t-quote mt-5">{t.philosophy.cta}</p>
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-paper/85 transition-colors group-hover:text-mint">
              {t.philosophy.ctaBtn}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
