"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import { btnInk } from "@/components/ui";

export default function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="sheet bg-paper text-ink">
      <div className="wrap py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="t-label text-ink/45">{t.contact.label}</p>
            <h2 className="t-display mt-4">{t.contact.title}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink/60">{t.contact.lead}</p>
            <a
              href="https://www.instagram.com/lunerviasoft/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnInk} mt-9`}
            >
              {t.contact.cta}
            </a>
          </Reveal>

          <ul className="grid content-start gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {t.contact.channels.map((c, i) => (
              <li key={`${c.handle}-${i}`} className="h-full">
                <Reveal delay={i * 80} className="h-full">
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full flex-col rounded-2xl border border-ink/10 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-ink/30"
                    >
                      <span className="font-mono text-[10px] tracking-[0.18em] text-ink/40 uppercase">
                        {c.name}
                      </span>
                      <span className="mt-3 font-bold">{c.handle}</span>
                      <span className="mt-1 text-xs text-ink/55">{c.meta}</span>
                    </a>
                  ) : (
                    <div className="flex h-full flex-col rounded-2xl border border-ink/10 p-5 opacity-55">
                      <span className="font-mono text-[10px] tracking-[0.18em] text-ink/40 uppercase">
                        {c.name}
                      </span>
                      <span className="mt-3 font-bold">{c.handle}</span>
                      <span className="mt-1 text-xs text-ink/55">{c.meta}</span>
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
