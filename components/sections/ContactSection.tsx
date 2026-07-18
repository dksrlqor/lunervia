"use client";

import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* Contact — 실제 채널만. Email 은 아직 없으므로 링크처럼 보이지 않게. */

export default function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="sect scroll-mt-16 border-t border-line bg-bg1/50">
      <div className="wrap">
        <Reveal variant="fade" className="sect-head">
          <h2 className="t-label text-ink3">{t.contact.label}</h2>
        </Reveal>

        <div className="mt-10 grid items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal variant="mask" as="p" delay={60} className="t-display max-w-lg">
              {t.contact.title}
            </Reveal>
            <Reveal variant="fade" as="p" delay={130} className="mt-5 max-w-md text-ink2">
              {t.contact.lead}
            </Reveal>
            <Reveal variant="fade" delay={190} className="mt-9">
              <a
                href="https://www.instagram.com/lunerviasoft/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-fill"
              >
                {t.contact.cta}
                <span className="sr-only"> — {t.misc.externalNote}</span>
              </a>
            </Reveal>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 md:col-span-6">
            {t.contact.channels.map((c, i) => {
              const inner = (
                <>
                  <p className="t-label text-ink3">{c.name}</p>
                  <p className="mt-2 font-mono text-[0.95rem] font-medium text-ink">{c.handle}</p>
                  <p className="mt-1 text-xs text-ink3">{c.meta}</p>
                </>
              );
              return (
                <Reveal as="li" key={`${c.name}-${c.handle}`} variant="fade" delay={i * 80} className="bg-bg1">
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full p-5 transition-colors hover:bg-bg2 md:p-6"
                    >
                      {inner}
                      <span className="sr-only"> — {t.misc.externalNote}</span>
                    </a>
                  ) : (
                    <div className="h-full p-5 opacity-60 md:p-6">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
