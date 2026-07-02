import { Fragment, type ReactNode } from "react";

/** "**단어**" → 민트 하이라이트, "\n" → 줄바꿈. i18n 문자열 전용 렌더러. */
export function fmt(s: string): ReactNode {
  const lines = s.split("\n");
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-mint">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ));
}
