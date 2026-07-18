"use client";

import { useEffect } from "react";
import Link from "next/link";

/* 세그먼트 에러 바운더리 — 페이지 크래시 시 백지 대신 복구 UI.
   i18n 컨텍스트에 의존하지 않는다(컨텍스트 자체가 죽었을 수도 있으므로). */
export default function ErrorPage({
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
    <section className="flex min-h-svh items-center">
      <div className="wrap py-40">
        {/* 흐려진 달 — 잠깐 가려졌다는 뜻 */}
        <svg viewBox="0 0 48 48" className="h-16 w-16 text-ink2 opacity-70" aria-hidden="true">
          <mask id="err-crescent">
            <rect width="48" height="48" fill="white" />
            <circle cx="31" cy="19" r="15.5" fill="black" />
          </mask>
          <circle cx="24" cy="24" r="18.5" fill="currentColor" mask="url(#err-crescent)" />
        </svg>

        <p className="t-label mt-10 text-ink3">ERROR</p>
        <h1 className="t-display mt-4">일시적인 문제가 발생했습니다.</h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink2">
          화면을 그리는 중 오류가 있었습니다. 다시 시도하면 대부분 해결됩니다.
          {error.digest ? ` (코드: ${error.digest})` : ""}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn btn-fill">
            다시 시도
          </button>
          <Link href="/" className="btn btn-ghost">
            홈으로
          </Link>
        </div>
      </div>
    </section>
  );
}
