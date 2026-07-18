"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="flex min-h-svh items-center">
      <div className="wrap py-40">
        {/* 달 뒤편 — 정적 크레센트 */}
        <svg viewBox="0 0 48 48" className="h-16 w-16 text-ink2" aria-hidden="true">
          <mask id="nf-crescent">
            <rect width="48" height="48" fill="white" />
            <circle cx="31" cy="19" r="15.5" fill="black" />
          </mask>
          <circle cx="24" cy="24" r="18.5" fill="currentColor" mask="url(#nf-crescent)" />
        </svg>

        <p className="t-label mt-10 text-ink3">{t.notFound.code}</p>
        <h1 className="t-display mt-4">{t.notFound.title}</h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink2">{t.notFound.desc}</p>
        <Link href="/" className="btn btn-fill mt-10">
          {t.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
