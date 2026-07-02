"use client";

import { useI18n } from "@/i18n/LanguageContext";
import { fmt } from "@/components/format";
import Reveal from "@/components/Reveal";
import { btnPaper, btnGhostDark } from "@/components/ui";

const IG = "https://www.instagram.com/lunerviasoft/";
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function ServiceBuilderView() {
  const { t } = useI18n();
  const sb = t.serviceBuilder;

  return (
    <>
      {/* Hero — 다크 */}
      <section className="bg-ink text-paper">
        <div className="wrap pt-40 pb-16 md:pt-48 md:pb-24">
          <p className="t-label fade-up text-paper/55" style={d(100)}>
            {sb.eyebrow}
          </p>
          <h1 className="t-display fade-up mt-4 max-w-3xl" style={d(220)}>
            {sb.titleLines.map((line, i) => (
              <span key={i} className="block">
                {fmt(line)}
              </span>
            ))}
          </h1>
          <p className="fade-up mt-5 max-w-xl leading-relaxed text-paper/65" style={d(340)}>
            {sb.sub}
          </p>
          <div className="fade-up mt-8 flex flex-wrap items-center gap-4" style={d(460)}>
            <a href="#pricing" className={btnPaper}>
              {sb.ctaGet}
            </a>
            <a href="#sample" className={btnGhostDark}>
              {sb.ctaSample}
            </a>
          </div>
          <ul className="fade-up mt-8 flex flex-wrap gap-2" style={d(560)}>
            {sb.chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-paper/15 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-paper/55 uppercase"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem — 라이트 */}
      <section className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-ink/45">{sb.problem.label}</p>
            <h2 className="t-display mt-4 max-w-3xl">{sb.problem.title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-ink/60">{sb.problem.lead}</p>
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sb.problem.cards.map((c, i) => (
              <li key={c.t} className="h-full">
                <Reveal delay={(i % 4) * 80} className="h-full">
                  <div className="h-full rounded-2xl border border-ink/10 p-6">
                    <h3 className="font-bold">{c.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{c.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution — 다크, 실제 순서라 번호를 쓴다 */}
      <section className="sheet bg-ink text-paper">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-paper/45">{sb.solution.label}</p>
            <h2 className="t-display mt-4 max-w-3xl">{sb.solution.title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/60">{sb.solution.lead}</p>
          </Reveal>
          <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
            {sb.solution.steps.map((s, i) => (
              <li key={s.name}>
                <Reveal delay={i * 90}>
                  <div className="border-t-2 border-paper/15 pt-5">
                    <p className="font-mono text-xs font-medium text-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-bold">{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/60">{s.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sample — 라이트 */}
      <section id="sample" className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-ink/45">{sb.sample.label}</p>
            <h2 className="t-display mt-4">{sb.sample.title}</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/60">{sb.sample.intro}</p>
          </Reveal>
          <Reveal className="mt-10">
            <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10">
              {sb.sample.blocks.map((b) => (
                <div key={b.t} className="p-6 md:p-7">
                  <h3 className="font-mono text-sm font-bold tracking-tight">{b.t}</h3>
                  {b.d && (
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{b.d}</p>
                  )}
                  {b.lines.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {b.lines.map((l) => (
                        <li key={l} className="text-sm leading-relaxed text-ink/65">
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs leading-relaxed text-ink/45">
              {sb.sample.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Inside — 다크 */}
      <section className="sheet bg-ink text-paper">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-paper/45">{sb.inside.label}</p>
            <h2 className="t-display mt-4">{sb.inside.title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/60">{sb.inside.lead}</p>
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sb.inside.items.map((it, i) => (
              <li key={it.t} className="h-full">
                <Reveal delay={(i % 4) * 80} className="h-full">
                  <div className="h-full rounded-2xl border border-paper/12 p-5">
                    <p className="font-mono text-xs font-medium text-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-sm font-bold">{it.t}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-paper/55">{it.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Audience + Compare — 라이트 */}
      <section className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-ink/45">{sb.audience.label}</p>
            <h2 className="t-display mt-4">{sb.audience.title}</h2>
          </Reveal>
          <Reveal className="mt-8">
            <ul className="flex flex-wrap gap-2.5">
              {sb.audience.items.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/70"
                >
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-20">
            <p className="t-label text-ink/45">{sb.compare.label}</p>
            <h2 className="t-display mt-4">{sb.compare.title}</h2>
          </Reveal>

          {/* 데스크톱: 표 */}
          <Reveal className="mt-10 hidden md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-ink/20 text-left">
                  <th scope="col" className="t-label py-3 pr-4 font-medium text-ink/45">
                    {sb.compare.colHead}
                  </th>
                  <th scope="col" className="t-label py-3 pr-4 font-medium text-ink/45">
                    {sb.compare.colFree}
                  </th>
                  <th scope="col" className="t-label py-3 font-medium text-ink/70">
                    {sb.compare.colMod}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sb.compare.rows.map((r) => (
                  <tr key={r.name} className="border-b border-ink/10">
                    <th scope="row" className="py-4 pr-4 text-left font-bold">
                      {r.name}
                    </th>
                    <td className="py-4 pr-4 text-ink/50">{r.free}</td>
                    <td className="py-4 font-semibold">{r.mod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* 모바일: 카드 스택 */}
          <div className="mt-10 space-y-3 md:hidden">
            {sb.compare.rows.map((r, i) => (
              <Reveal key={r.name} delay={i * 60}>
                <div className="rounded-2xl border border-ink/10 p-5">
                  <h3 className="font-bold">{r.name}</h3>
                  <p className="mt-2 text-sm text-ink/50">
                    <span className="t-label mr-2 text-ink/35">{sb.compare.colFree}</span>
                    {r.free}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    <span className="t-label mr-2 font-normal text-ink/45">Module</span>
                    {r.mod}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — 다크 */}
      <section id="pricing" className="sheet bg-ink text-paper">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-paper/45">{sb.pricing.label}</p>
            <h2 className="t-display mt-4">{sb.pricing.title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/60">{sb.pricing.lead}</p>
          </Reveal>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {sb.pricing.plans.map((p, i) => {
              const accent = p.id === "pro";
              return (
                <li key={p.id} className="h-full">
                  <Reveal delay={i * 90} className="h-full">
                    <article
                      className={`flex h-full flex-col rounded-3xl border p-7 ${
                        accent ? "border-paper/40" : "border-paper/12"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold tracking-tight">{p.name}</h3>
                        {accent && (
                          <span className="rounded-full border border-paper/25 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
                            {sb.pricing.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-paper/50">{p.tag}</p>
                      <p className="mt-5 font-mono text-2xl font-bold tracking-tight">
                        {p.price}
                      </p>
                      <ul className="mt-5 space-y-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex gap-2.5 text-sm text-paper/70">
                            <span
                              aria-hidden="true"
                              className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-paper/35"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-7">
                        <a
                          href="#get"
                          className={`inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                            accent
                              ? "bg-paper text-ink"
                              : "border border-paper/25 text-paper hover:border-paper/60"
                          }`}
                        >
                          {p.cta}
                        </a>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <Reveal className="mt-8">
            <p className="text-center font-mono text-xs leading-relaxed text-paper/45">
              {sb.pricing.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Notice + FAQ — 라이트 */}
      <section className="sheet bg-paper text-ink">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <p className="t-label text-ink/45">{sb.notice.label}</p>
            <h2 className="t-display mt-4">{sb.notice.title}</h2>
          </Reveal>
          <Reveal className="mt-8">
            <ul className="max-w-2xl space-y-3">
              {sb.notice.items.map((n, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                  <span className="font-mono text-xs font-medium text-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-20">
            <p className="t-label text-ink/45">{sb.faq.label}</p>
            <h2 className="t-display mt-4">{sb.faq.title}</h2>
          </Reveal>
          <div className="mt-8 max-w-2xl divide-y divide-ink/10 border-y border-ink/10">
            {sb.faq.items.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ink/40 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA + 구매 안내 — 다크 */}
      <section id="get" className="sheet bg-ink text-paper">
        <div className="wrap py-24 md:py-32">
          <Reveal>
            <h2 className="t-quote max-w-3xl">{fmt(sb.final.title)}</h2>
          </Reveal>
          <Reveal className="mt-12">
            <div className="max-w-2xl rounded-3xl border border-paper/12 p-7 md:p-9">
              <p className="t-label text-paper/45">{sb.buy.label}</p>
              <h3 className="mt-3 text-xl font-extrabold tracking-tight">{sb.buy.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{sb.buy.body}</p>
              <ol className="mt-6 space-y-2.5">
                {sb.buy.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-paper/70">
                    <span className="font-mono text-xs font-medium text-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <a
                href={IG}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnPaper} mt-8`}
              >
                {sb.buy.cta}
              </a>
              <p className="mt-5 font-mono text-[11px] leading-relaxed text-paper/40">
                {sb.buy.note}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
