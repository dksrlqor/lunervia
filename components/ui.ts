/* 공용 버튼/링크 클래스 — 호버는 transform/opacity 만(모션 4) */

const btn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";

export const btnPaper = `${btn} bg-paper text-ink`;
export const btnInk = `${btn} bg-ink text-paper`;
export const btnGhostDark = `${btn} border border-paper/25 text-paper hover:border-paper/60`;
export const btnGhostLight = `${btn} border border-ink/25 text-ink hover:border-ink/60`;
