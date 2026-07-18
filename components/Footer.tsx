"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";

const EXPLORE = [
  { key: "about", href: "/why" },
  { key: "work", href: "/work" },
  { key: "coena", href: "/#coena" },
  { key: "contact", href: "/#contact" },
] as const;

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const channels = t.contact.channels.filter((c) => c.href);

  return (
    <footer className="border-t border-line bg-bg1">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="flex items-center gap-2.5 font-semibold tracking-[0.08em]">
            <span aria-hidden="true" className="block size-2 rotate-45 bg-ice" />
            LUNERVIA
          </p>
          <p className="mt-4 max-w-sm text-ink2">{t.footer.sub}</p>
          <p className="t-meta mt-6 text-ink3">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.explore} className="md:col-span-3">
          <h2 className="t-label text-ink3">{t.footer.explore}</h2>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-ink2 transition-colors hover:text-ice">
                  {t.nav[l.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.connect} className="md:col-span-3">
          <h2 className="t-label text-ink3">{t.footer.connect}</h2>
          <ul className="mt-4 space-y-2.5">
            {channels.map((c) => (
              <li key={c.handle}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink2 transition-colors hover:text-ice"
                >
                  {c.name} <span className="t-meta text-ink3">{c.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="t-meta text-ink3">
            © {year} Lunervia. {t.footer.rights}
          </p>
          <a href="#top" className="t-meta text-ink3 transition-colors hover:text-ice">
            {t.footer.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
