"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/LanguageContext";

const NAV = [
  { key: "about", href: "/why" },
  { key: "work", href: "/work" },
  { key: "coena", href: "/#coena" },
  { key: "contact", href: "/#contact" },
] as const;

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);

  /* 홈 스크롤 스파이 — aria-current 패턴 계승.
     홈이 아니면 관찰하지 않는다(activeHash 는 isActive 에서 pathname 으로 걸러짐). */
  useEffect(() => {
    if (pathname !== "/") return;
    const els = ["work", "coena", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActiveHash(id === "coena" || id === "contact" ? id : null);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  /* 메뉴 열림: 스크롤 잠금 + Esc 닫기 (링크들은 클릭 시 스스로 닫는다) */
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/#coena") return pathname === "/" && activeHash === "coena";
    if (href === "/#contact") return pathname === "/" && activeHash === "contact";
    return pathname === href;
  };

  const langToggle = (
    <div
      className="font-mono text-[11px] tracking-[0.15em]"
      role="group"
      aria-label={t.misc.langLabel}
    >
      <button
        type="button"
        onClick={() => setLang("ko")}
        aria-pressed={lang === "ko"}
        className={`cursor-pointer px-1 py-2 transition-colors ${
          lang === "ko" ? "text-paper" : "text-paper/40 hover:text-mint"
        }`}
      >
        KO
      </button>
      <span aria-hidden="true" className="text-paper/25">
        /
      </span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`cursor-pointer px-1 py-2 transition-colors ${
          lang === "en" ? "text-paper" : "text-paper/40 hover:text-mint"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a href="#main" className="skip-link">
        {t.misc.skip}
      </a>

      <div className="mx-auto mt-3 w-[min(100%-1.25rem,72rem)] md:mt-4">
        <div className="flex items-center justify-between rounded-full border border-paper/10 bg-ink/85 px-4 py-2 backdrop-blur-md md:px-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center py-1.5 transition-opacity hover:opacity-80"
          >
            <Image
              src="/brand/lunervia-wordmark.png"
              alt="Lunervia"
              width={1320}
              height={129}
              priority
              className="h-3 w-auto md:h-3.5"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="주 메뉴">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-sm transition-colors ${
                    active ? "text-paper" : "text-paper/60 hover:text-mint"
                  }`}
                >
                  {t.nav[item.key]}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-mint"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">{langToggle}</div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? t.misc.close : t.misc.menu}
              className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`block h-[1.5px] w-4.5 bg-paper transition-transform ${
                  open ? "translate-y-[3.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-4.5 bg-paper transition-transform ${
                  open ? "-translate-y-[3.25px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 오버레이 메뉴 */}
      {open && (
        <div className="fixed inset-0 -z-10 flex flex-col bg-ink px-7 pt-28 pb-10 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="모바일 메뉴">
            {NAV.map((item, i) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="fade-up py-2 text-3xl font-extrabold tracking-tight text-paper transition-colors hover:text-mint"
                style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
              >
                {t.nav[item.key]}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between border-t border-paper/10 pt-6">
            <span className="t-label inline-flex items-center gap-2 text-paper/55">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-mint" />
              {t.hero.status}
            </span>
            {langToggle}
          </div>
        </div>
      )}
    </header>
  );
}
