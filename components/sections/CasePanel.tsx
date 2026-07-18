"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/motion/Reveal";

/* Case — 받아줘. 스크린샷 대신 제품 UI 를 코드로 재구성해 보여 주고,
   재구성임을 라벨로 정직하게 표기한다. */

export default function CasePanel() {
  const { t } = useI18n();
  const c = t.caseStudy;

  return (
    <section className="sect-tight border-t border-line">
      <div className="wrap">
        <Reveal variant="fade" className="sect-head">
          <h2 className="t-label text-ink3">{c.label}</h2>
        </Reveal>

        <div className="mt-10 grid items-start gap-10 md:grid-cols-12 md:gap-8">
          {/* 왼쪽 — 사실 중심 설명 */}
          <div className="md:col-span-6 lg:col-span-5">
            <p className="t-meta flex items-center gap-2 text-ok">
              <span className="dot dot-ok pulse-live" />
              {c.status}
            </p>
            <Reveal variant="mask" as="h3" delay={60} className="t-display mt-4">
              {c.title}
            </Reveal>
            <Reveal variant="fade" as="p" delay={120} className="mt-5 leading-relaxed text-ink2">
              {c.desc}
            </Reveal>

            <Reveal variant="fade" delay={180} className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="t-label text-ink3">{c.roleLabel}</h4>
                <p className="mt-2 text-sm text-ink2">{c.role}</p>
              </div>
              <div>
                <h4 className="t-label text-ink3">{c.stackLabel}</h4>
                <p className="mt-2 text-sm text-ink2">{c.stack.join(" · ")}</p>
              </div>
            </Reveal>

            <Reveal variant="fade" delay={220} className="mt-7">
              <h4 className="t-label text-ink3">{c.builtLabel}</h4>
              <ul className="mt-3 space-y-2">
                {c.built.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink2">
                    <span aria-hidden="true" className="mt-[7px] dot dot-ok size-1.5!" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="https://takemyletter.site"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-fill"
              >
                {c.visitCta}
                <span className="sr-only"> — {t.misc.externalNote}</span>
              </a>
              <Link href="/work" className="btn btn-ghost">
                {c.moreCta}
              </Link>
            </div>
          </div>

          {/* 오른쪽 — 코드로 재구성한 제품 표면 */}
          <Reveal variant="dock" delay={150} className="md:col-span-6 lg:col-span-7" as="figure">
            <div aria-hidden="true" className="panel relative overflow-hidden p-5 md:p-7">
              {/* 브라우저 크롬 */}
              <div className="flex items-center gap-2 border-b border-line pb-4">
                <span className="size-2.5 rounded-full bg-line" />
                <span className="size-2.5 rounded-full bg-line" />
                <span className="size-2.5 rounded-full bg-line" />
                <p className="t-meta ml-3 flex-1 truncate rounded border border-line px-3 py-1 text-ink3">
                  takemyletter.site/inbox
                </p>
              </div>

              <div className="grid gap-5 pt-5 sm:grid-cols-5">
                {/* 편지 목록 */}
                <div className="sm:col-span-2">
                  <p className="t-label text-ink3">{c.mockInbox}</p>
                  <ul className="mt-3 space-y-2">
                    {c.mockLetters.map((l, i) => (
                      <li
                        key={l}
                        className={`rounded border px-3 py-2.5 text-xs ${
                          i === 0
                            ? "border-linestrong bg-bg2 text-ink"
                            : "border-line text-ink2"
                        }`}
                      >
                        ✉ {l}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 편지지 */}
                <div className="rounded border border-line bg-bg2 p-4 sm:col-span-3">
                  <div className="space-y-2.5">
                    <div className="h-2 w-10/12 rounded-full bg-line" />
                    <div className="h-2 w-8/12 rounded-full bg-line" />
                    <div className="h-2 w-11/12 rounded-full bg-line" />
                    <div className="h-2 w-6/12 rounded-full bg-line" />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="t-meta text-ink3">— anonymous</span>
                    <span className="rounded bg-ice px-3 py-1.5 text-[11px] font-semibold text-bg0">
                      {c.mockCta}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="t-meta mt-3 text-right text-ink3">{c.mockNote}</figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
