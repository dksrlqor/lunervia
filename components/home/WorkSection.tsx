"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";

/* §3-1 예외 구역의 홈 프리뷰 — 받아줘 픽셀 세계는 이 프레임 밖으로 새지 않는다. */
function PixelLetterPreview() {
  return (
    <div className="relative h-full min-h-52 overflow-hidden rounded-2xl border-2 border-[#3D2E22]/25 bg-[#FDF8EE]">
      <svg
        viewBox="0 0 32 24"
        shapeRendering="crispEdges"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect width="32" height="24" fill="#FDF8EE" />
        <rect x="0" y="21" width="32" height="3" fill="#E8D5B8" />
        {/* 봉투 */}
        <rect x="8" y="9" width="16" height="10" fill="#FFFDF9" />
        <rect x="8" y="9" width="16" height="1" fill="#3D2E22" />
        <rect x="8" y="18" width="16" height="1" fill="#3D2E22" />
        <rect x="8" y="9" width="1" height="10" fill="#3D2E22" />
        <rect x="23" y="9" width="1" height="10" fill="#3D2E22" />
        {/* 플랩 */}
        <rect x="9" y="10" width="14" height="1" fill="#F8D0C7" />
        <rect x="10" y="11" width="12" height="1" fill="#F8D0C7" />
        <rect x="12" y="12" width="8" height="1" fill="#F8D0C7" />
        <rect x="14" y="13" width="4" height="1" fill="#F8D0C7" />
        {/* 하트 실링 */}
        <rect x="15" y="14" width="1" height="1" fill="#D89588" />
        <rect x="17" y="14" width="1" height="1" fill="#D89588" />
        <rect x="14" y="15" width="5" height="1" fill="#D89588" />
        <rect x="15" y="16" width="3" height="1" fill="#D89588" />
        <rect x="16" y="17" width="1" height="1" fill="#D89588" />
        {/* 떠 있는 하트 */}
        <rect x="5" y="5" width="1" height="1" fill="#F8D0C7" />
        <rect x="7" y="5" width="1" height="1" fill="#F8D0C7" />
        <rect x="4" y="6" width="5" height="1" fill="#F8D0C7" />
        <rect x="5" y="7" width="3" height="1" fill="#F8D0C7" />
        <rect x="6" y="8" width="1" height="1" fill="#F8D0C7" />
        <rect x="26" y="4" width="1" height="1" fill="#D89588" />
        <rect x="28" y="4" width="1" height="1" fill="#D89588" />
        <rect x="25" y="5" width="5" height="1" fill="#D89588" />
        <rect x="26" y="6" width="3" height="1" fill="#D89588" />
        <rect x="27" y="7" width="1" height="1" fill="#D89588" />
      </svg>
      <p className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.2em] text-[#3D2E22]/55 uppercase">
        takemyletter.site
      </p>
    </div>
  );
}

export default function WorkSection() {
  const { t } = useI18n();

  return (
    <section id="work" className="sheet bg-ink text-paper">
      <div className="wrap py-24 md:py-32">
        <Reveal>
          <p className="t-label text-paper/45">{t.work.label}</p>
          <h2 className="t-display mt-4">{t.work.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-paper/60">{t.work.lead}</p>
        </Reveal>

        {/* Featured — 받아줘 */}
        <Reveal className="mt-14">
          <Link
            href="/work"
            className="group grid overflow-hidden rounded-3xl border border-paper/12 transition-all duration-200 hover:-translate-y-1 hover:border-paper/30 md:grid-cols-[1.15fr_1fr]"
          >
            <div className="flex flex-col justify-between p-7 md:p-10">
              <div>
                <p className="t-label inline-flex items-center gap-2 text-paper/55">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-mint"
                  />
                  {t.work.featuredStatus}
                </p>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight md:text-3xl">
                  {t.work.featuredName}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-paper/65">
                  {t.work.featuredDesc}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-paper/40">
                  {t.work.featuredRole}
                </p>
                <span className="text-sm font-semibold transition-colors group-hover:text-mint">
                  {t.work.featuredCta} →
                </span>
              </div>
            </div>
            <div className="p-4 md:p-5">
              <PixelLetterPreview />
            </div>
          </Link>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Reveal delay={0} className="h-full">
            <div className="h-full rounded-2xl border border-paper/12 p-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-paper/40 uppercase">
                {t.work.labStatus}
              </p>
              <h3 className="mt-4 text-lg font-bold">{t.work.labName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{t.work.labDesc}</p>
            </div>
          </Reveal>
          <Reveal delay={90} className="h-full">
            <div className="h-full rounded-2xl border border-paper/12 p-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-paper/40 uppercase">
                {t.work.smbestType}
              </p>
              <h3 className="mt-4 text-lg font-bold">{t.work.smbestName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">
                {t.work.smbestDesc}
              </p>
            </div>
          </Reveal>
          <Reveal delay={180} className="h-full">
            <Link
              href="/work"
              className="group flex h-full items-end justify-between rounded-2xl border border-paper/12 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-paper/30"
            >
              <span className="text-lg font-bold">{t.work.moreCta}</span>
              <span
                aria-hidden="true"
                className="text-xl transition-colors group-hover:text-mint"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
