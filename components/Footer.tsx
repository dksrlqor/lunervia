"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";

const EXPLORE = [
  { key: "services", href: "/#services" },
  { key: "work", href: "/work" },
  { key: "modules", href: "/modules" },
  { key: "about", href: "/why" },
  { key: "contact", href: "/#contact" },
] as const;

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="sheet bg-ink text-paper">
      <div className="wrap pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/lunervia-symbol.png"
              alt="Lunervia"
              width={852}
              height={612}
              className="h-28 w-auto"
            />
            <p className="mt-6 text-paper/75">{t.footer.tagline}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-paper/45">
              {t.footer.sub}
            </p>
          </div>

          <nav aria-label={t.footer.explore}>
            <h2 className="t-label text-paper/40">{t.footer.explore}</h2>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper/65 transition-colors hover:text-mint"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-label text-paper/40">{t.footer.connect}</h2>
            <ul className="mt-5 space-y-3">
              {t.contact.channels
                .filter((c) => c.href)
                .map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-paper/65 transition-colors hover:text-mint"
                    >
                      {c.name} {c.handle}
                    </a>
                  </li>
                ))}
              <li>
                <a
                  href="https://github.com/dksrlqor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-paper/65 transition-colors hover:text-mint"
                >
                  GitHub dksrlqor
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 pt-6">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} Lunervia. {t.footer.rights}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer font-mono text-[11px] tracking-[0.15em] text-paper/40 uppercase transition-colors hover:text-mint"
          >
            {t.footer.top} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
