import { Fragment, type ReactNode } from "react";

/** "**단어**" → 액센트 하이라이트(.hl — 배경 문맥에 따라 색이 정해진다),
    "\n" → 줄바꿈. i18n 문자열 전용 렌더러. */
export function fmt(s: string): ReactNode {
  const lines = s.split("\n");
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="hl">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ));
}
