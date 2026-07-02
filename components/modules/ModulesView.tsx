"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import { LUNERVIA_MODULES } from "@/data/modules";
import { buildCheckoutUrl, getPriceLabel, getStatusMeta } from "@/lib/subscription";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";

const toneDot: Record<string, string> = {
  ready: "bg-mint",
  contact: "bg-ink/35",
  paused: "bg-ink/35",
  muted: "bg-ink/25",
};

export default function ModulesView() {
  const { t, lang } = useI18n();

  return (
    <>
      <PageHeader
        label={t.modulesHub.label}
        title={t.modulesHub.title}
        lead={t.modulesHub.lead}
      />

      <section className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-28">
          <ul className="grid gap-4 md:grid-cols-2">
            {LUNERVIA_MODULES.map((mod, i) => {
              const copy = mod.i18n[lang];
              const status = getStatusMeta(mod.status, lang);
              return (
                <li key={mod.planId} className="h-full">
                  <Reveal delay={(i % 2) * 90} className="h-full">
                    <article
                      className={`flex h-full flex-col rounded-3xl border p-7 md:p-8 ${
                        mod.accent ? "border-ink/35" : "border-ink/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-extrabold tracking-tight">
                            {mod.name}
                          </h2>
                          <p className="mt-1.5 font-mono text-xs text-ink/50">
                            {getPriceLabel(mod, lang)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          {mod.accent && (
                            <span className="rounded-full border border-ink/20 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
                              {t.modulesHub.recommended}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-ink/55 uppercase">
                            <span
                              aria-hidden="true"
                              className={`inline-block h-1.5 w-1.5 rounded-full ${toneDot[status.tone]}`}
                            />
                            {status.label}
                          </span>
                        </div>
                      </div>

                      <p className="mt-5 leading-relaxed text-ink/75">{copy.summary}</p>

                      <div className="mt-6">
                        <h3 className="t-label text-ink/40">{t.modulesHub.included}</h3>
                        <ul className="mt-3 space-y-2">
                          {copy.features.map((f) => (
                            <li key={f} className="flex gap-2.5 text-sm text-ink/70">
                              <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <h3 className="t-label text-ink/40">{t.modulesHub.target}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink/60">
                          {copy.target}
                        </p>
                      </div>

                      <div className="mt-auto pt-8">
                        <Link
                          href={buildCheckoutUrl(mod.planId)}
                          className={`inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                            mod.accent
                              ? "bg-ink text-paper"
                              : "border border-ink/25 text-ink hover:border-ink/60"
                          }`}
                        >
                          {copy.ctaLabel}
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal className="mt-8">
            <p className="text-center font-mono text-xs text-ink/45">
              {t.modulesHub.priceNote}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sheet bg-ink text-paper">
        <div className="wrap py-16 md:py-20">
          <Reveal>
            <Link
              href="/modules/service-builder"
              className="group flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-paper/12 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-paper/30 md:p-9"
            >
              <div>
                <p className="t-label text-paper/45">{t.modulesHub.relatedTitle}</p>
                <p className="mt-3 max-w-xl text-lg font-bold">
                  {t.modulesHub.relatedDesc}
                </p>
              </div>
              <span className="text-sm font-semibold transition-colors group-hover:text-mint">
                {t.modulesHub.relatedCta} →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
