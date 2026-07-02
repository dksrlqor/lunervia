"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="sheet bg-paper text-ink">
      <div className="wrap py-24 md:py-32">
        <Reveal>
          <p className="t-label text-ink/45">{t.services.label}</p>
          <h2 className="t-display mt-4 max-w-3xl">{t.services.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink/60">{t.services.lead}</p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => (
            <li key={s.tag} className="h-full">
              <Reveal delay={(i % 3) * 90} className="h-full">
                <div className="h-full rounded-2xl border border-ink/10 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink/30">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-ink/40">
                    {s.tag}
                  </p>
                  <h3 className="mt-4 text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
