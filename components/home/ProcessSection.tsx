"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";

export default function ProcessSection() {
  const { t } = useI18n();

  return (
    <section id="process" className="sheet bg-paper text-ink">
      <div className="wrap py-24 md:py-32">
        <Reveal>
          <p className="t-label text-ink/45">{t.process.label}</p>
          <h2 className="t-display mt-4">{t.process.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink/60">{t.process.lead}</p>
        </Reveal>

        <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-5">
          {t.process.steps.map((s, i) => (
            <li key={s.en}>
              <Reveal delay={i * 90}>
                <div className="border-t-2 border-ink/15 pt-5">
                  <p className="font-mono text-xs font-medium text-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-bold">{s.name}</h3>
                  <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-ink/35">
                    {s.en}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{s.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
