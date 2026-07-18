"use client";

import { useEffect } from "react";
import "./globals.css";

/* 루트 에러 바운더리 — 루트 레이아웃까지 죽었을 때의 최후 방어선.
   레이아웃을 대체하므로 html/body 를 직접 렌더해야 한다. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <section className="flex min-h-svh items-center">
          <div className="wrap py-40">
            <p className="t-label text-ink3">ERROR</p>
            <h1 className="t-display mt-4">일시적인 문제가 발생했습니다.</h1>
            <p className="mt-4 max-w-md leading-relaxed text-ink2">
              페이지를 불러오는 중 오류가 있었습니다. 다시 시도해 주세요.
              {error.digest ? ` (코드: ${error.digest})` : ""}
            </p>
            <button type="button" onClick={reset} className="btn btn-fill mt-10">
              다시 시도
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
