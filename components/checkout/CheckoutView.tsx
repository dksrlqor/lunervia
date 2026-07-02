"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/LanguageContext";
import { getModuleByPlanId } from "@/data/modules";
import { getPriceLabel, getStatusMeta } from "@/lib/subscription";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { btnInk, btnGhostLight } from "@/components/ui";

export default function CheckoutView() {
  const { t, lang } = useI18n();
  const params = useSearchParams();
  const plan = params.get("plan") ?? "";
  const mod = getModuleByPlanId(plan);

  return (
    <>
      <PageHeader
        label={t.checkout.label}
        title={mod ? t.checkout.title : t.checkout.invalidTitle}
        lead={mod ? t.checkout.lead : t.checkout.invalidDesc}
      />

      <section className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-24">
          {mod ? (
            <div className="mx-auto max-w-2xl">
              <Reveal>
                <div className="rounded-3xl border border-ink/10 p-7 md:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="t-label text-ink/40">{t.checkout.planLabel}</p>
                      <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                        {mod.name}
                      </h2>
                      <p className="mt-2 leading-relaxed text-ink/65">
                        {mod.i18n[lang].summary}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-ink/55 uppercase">
                      <span
                        aria-hidden="true"
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          getStatusMeta(mod.status, lang).tone === "ready"
                            ? "bg-mint"
                            : "bg-ink/35"
                        }`}
                      />
                      {getStatusMeta(mod.status, lang).label}
                    </span>
                  </div>

                  <dl className="mt-7 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
                    <div>
                      <dt className="t-label text-ink/40">{t.checkout.billingLabel}</dt>
                      <dd className="mt-1.5 text-sm font-semibold">
                        {t.checkout.billingValue}
                      </dd>
                    </div>
                    <div>
                      <dt className="t-label text-ink/40">Price</dt>
                      <dd className="mt-1.5 font-mono text-sm font-semibold">
                        {getPriceLabel(mod, lang)}
                      </dd>
                    </div>
                  </dl>

                  <ol className="mt-7 space-y-3 border-t border-ink/10 pt-6">
                    {t.checkout.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                        <span className="font-mono text-xs font-medium text-ink/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="https://www.instagram.com/lunerviasoft/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={btnInk}
                    >
                      {t.checkout.cta}
                    </a>
                    <Link href="/modules" className={btnGhostLight}>
                      {t.checkout.backToModules}
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          ) : (
            <Reveal>
              <div className="mx-auto max-w-md text-center">
                <Link href="/modules" className={btnInk}>
                  {t.checkout.backToModules}
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
