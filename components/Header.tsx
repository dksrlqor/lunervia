"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/LanguageContext";

/* 상단 고정 내비 — 스크롤 전에는 투명, 스크롤 후 배경+헤어라인.
   모바일: 접힘 패널 메뉴(터치 44px+, hover 비의존). */

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/why", label: t.nav.about, active: pathname === "/why" },
    { href: "/work", label: t.nav.work, active: pathname === "/work" },
    { href: "/#coena", label: t.nav.coena, active: false },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg0/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-ice focus:px-3 focus:py-2 focus:text-bg0"
      >
        {t.misc.skip}
      </a>

      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-[0.08em] text-ink"
          aria-label="Lunervia — home"
        >
          <span aria-hidden="true" className="block size-2 rotate-45 bg-ice" />
          LUNERVIA
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`text-sm transition-colors hover:text-ice ${
                l.active ? "text-ice" : "text-ink2"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            aria-label={t.misc.langLabel}
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className="t-meta rounded border border-line px-2.5 py-1.5 text-ink2 transition-colors hover:border-ice hover:text-ice"
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>
          <Link href="/#contact" className="btn btn-fill min-h-9! px-4! py-1.5! text-sm">
            {t.nav.cta}
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label={t.misc.langLabel}
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className="t-meta min-h-11 min-w-11 rounded border border-line px-2 text-ink2"
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.misc.close : t.misc.menu}
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5"
          >
            <span
              aria-hidden="true"
              className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* 모바일 접힘 메뉴 */}
      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-bg0 md:hidden">
        <nav aria-label="Mobile" className="wrap flex flex-col py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={l.active ? "page" : undefined}
              className={`border-b border-line py-4 text-lg font-medium ${
                l.active ? "text-ice" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="btn btn-fill mt-5 mb-2 w-full"
          >
            {t.nav.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}
