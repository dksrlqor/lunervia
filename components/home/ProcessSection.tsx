"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";

/* 다크 섹션 — Services(라이트)와 Contact(라이트) 사이에서 교차 리듬을 지킨다. */
export default function ProcessSection() {
  const { t } = useI18n();

  return (
    <section id="process" className="sheet bg-ink text-paper">
      <div className="wrap py-24 md:py-32">
        <Reveal>
          <p className="t-label text-mint/80">{t.process.label}</p>
          <h2 className="t-display mt-4">{t.process.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-paper/75">{t.process.lead}</p>
        </Reveal>

        <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-5">
          {t.process.steps.map((s, i) => (
            <li key={s.en}>
              <Reveal delay={i * 90}>
                <div className="border-t-2 border-paper/15 pt-5">
                  <p className="font-mono text-xs font-semibold text-paper/80">
                    {String(i + 1).padStart(2, "0")}
                    <span aria-hidden="true" className="mt-1 block h-0.5 w-5 bg-mint" />
                  </p>
                  <h3 className="mt-3 font-bold">{s.name}</h3>
                  <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-paper/50">
                    {s.en}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-paper/72">{s.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
