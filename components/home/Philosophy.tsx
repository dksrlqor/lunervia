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
          <p className="t-label text-paper/45">{t.philosophy.label}</p>
          <blockquote className="t-quote mt-8 max-w-4xl">
            {fmt(t.philosophy.big)}
          </blockquote>
        </Reveal>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2">
          {t.philosophy.cards.map((c, i) => (
            <li key={c.en} className="h-full">
              <Reveal delay={(i % 2) * 90} className="h-full">
                <div className="h-full rounded-2xl border border-paper/12 p-6 md:p-7">
                  <h3 className="text-lg font-bold">{c.en}</h3>
                  {c.name !== c.en && (
                    <p className="mt-1 text-sm text-paper/50">{c.name}</p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-paper/60">{c.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12">
          <Link
            href="/why"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-paper/75 transition-colors hover:text-mint"
          >
            {t.philosophy.cta}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
