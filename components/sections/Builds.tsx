"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* What Lunervia Builds — 네 축 분기.
   균일 벤토 카드 대신 헤어라인으로 나눈 비대칭 2행:
   STUDIO(주력)가 가장 넓고, 축마다 밀도가 다르다. */

const SPAN: Record<string, string> = {
  studio: "md:col-span-7 md:row-span-1",
  product: "md:col-span-5",
  coena: "md:col-span-5",
  lab: "md:col-span-7",
};

export default function Builds() {
  const { t } = useI18n();

  return (
    <section className="sect">
      <div className="wrap">
        <Reveal variant="fade" className="sect-head">
          <h2 className="t-label text-ink3">{t.builds.label}</h2>
        </Reveal>
        <Reveal variant="mask" as="p" delay={80} className="t-display mt-6 max-w-xl">
          {t.builds.title}
        </Reveal>
        <Reveal variant="fade" as="p" delay={140} className="mt-4 max-w-md text-ink2">
          {t.builds.lead}
        </Reveal>

        <div className="mt-14 grid border-t border-l border-line md:grid-cols-12">
          {t.builds.items.map((item, i) => (
            <Reveal
              key={item.id}
              variant="fade"
              delay={i * 80}
              className={`group relative border-r border-b border-line p-6 md:p-8 ${SPAN[item.id]} ${
                item.id === "studio" ? "md:py-12" : ""
              }`}
            >
              <p className="t-label flex items-center justify-between text-ink3">
                {item.tag}
                <span
                  aria-hidden="true"
                  className="text-ink3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ice"
                >
                  →
                </span>
              </p>
              <h3 className={`mt-4 font-bold tracking-tight ${item.id === "studio" ? "t-title" : "text-lg"}`}>
                {item.name}
              </h3>
              <p
                className={`mt-3 text-sm leading-relaxed text-ink2 ${
                  item.id === "studio" ? "max-w-lg text-[0.95rem]" : "max-w-sm"
                }`}
              >
                {item.desc}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-block text-sm text-ink2 transition-colors group-hover:text-ice hover:text-ice"
              >
                {item.link}
                <span className="absolute inset-0" aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
