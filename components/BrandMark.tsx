/** 달(lune) 크레센트 마크 — currentColor 로 그려져 다크/라이트 어디서든 쓴다. */
export default function BrandMark({
  id,
  className = "h-6 w-6",
}: {
  id: string;
  className?: string;
}) {
  const maskId = `crescent-${id}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <circle cx="16" cy="9.5" r="7.8" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="9.4" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
