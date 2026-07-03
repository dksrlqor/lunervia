/* §3-1 받아줘 예외 구역 — "사이트 속의 작은 다른 세계".
   원본 badajwo 의 PixelWindow(♡ 받아줘 ♡ 레트로 창) 프레임 안:
   구름·하트·잔디 위를 편지 문 배달 고양이가 천천히 거닌다.
   이 팔레트·서체(Galmuri)·모션은 이 창 밖으로 한 픽셀도 새지 않는다. */

import type { CSSProperties } from "react";
import Sprite from "./Sprite";
import MailCat from "./MailCat";
import PettableMailCat from "./PettableMailCat";

/* 원본 pixel.css 토큰 */
export const ZONE = {
  bg: "#FFF7F3",
  cream: "#FFFDF8",
  pink: "#F3A6B5",
  deep: "#C96F7F",
  border: "#9E5C64",
  text: "#4A2F35",
  heart: "#E45C7A",
  shadow: "rgba(158, 92, 100, 0.28)",
  beige: "#E8D5B8",
  grass: "#D8BF9C",
  blush: "#F8D0C7",
  rose: "#D89588",
  lavender: "#DDD0EF",
} as const;

const PX_FONT: CSSProperties = {
  fontFamily:
    "'Galmuri11', 'Galmuri9', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
};

const CLOUD_BIG = ["...wwww.....", "..wwwwwww...", ".wwwwwwwwww.", "wwwwwwwwwwww"];
const CLOUD_SMALL = ["..www...", ".wwwwww.", "wwwwwwww"];
const HEART = [".h.h.", "hhhhh", ".hhh.", "..h.."];
const GRASS = ["g.g..g.g", ".g.gg.g."];
const FLOWER = [".p.", "pdp", ".p.", ".s.", ".s."];

export default function LetterScene({
  catPx = 7,
  className = "",
  interactive = false,
  petHint,
}: {
  catPx?: number;
  className?: string;
  interactive?: boolean;
  petHint?: string;
}) {
  return (
    <div
      aria-hidden={interactive ? undefined : "true"}
      className={`px-scene flex h-full min-h-64 flex-col ${className}`}
      style={{
        background: ZONE.bg,
        border: `3px solid ${ZONE.border}`,
        boxShadow: `6px 6px 0 ${ZONE.shadow}`,
        imageRendering: "pixelated",
      }}
    >
      {/* 타이틀바 — 원본 PixelWindow */}
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-bold select-none"
        style={{
          ...PX_FONT,
          background: ZONE.pink,
          borderBottom: `3px solid ${ZONE.border}`,
          color: ZONE.text,
          letterSpacing: "0.08em",
        }}
      >
        <span style={{ color: ZONE.heart }} className="text-[11px]">
          ♥
        </span>
        <span className="flex-1 text-center">♡ 받아줘 ♡</span>
        <span className="inline-flex gap-1" aria-hidden="true">
          <i
            className="inline-block h-2.5 w-2.5"
            style={{ background: ZONE.cream, border: `2px solid ${ZONE.border}` }}
          />
          <i
            className="inline-block h-2.5 w-2.5"
            style={{ background: ZONE.cream, border: `2px solid ${ZONE.border}` }}
          />
        </span>
      </div>

      {/* 창 본문 — 픽셀 풍경 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 하늘 */}
        <Sprite
          grid={CLOUD_BIG}
          palette={{ w: "#FFFFFF" }}
          px={4}
          className="absolute top-5 left-5 opacity-90"
        />
        <Sprite
          grid={CLOUD_SMALL}
          palette={{ w: "#FFFFFF" }}
          px={3}
          className="absolute top-11 right-12 opacity-80"
        />
        <Sprite
          grid={HEART}
          palette={{ h: ZONE.blush }}
          px={4}
          className="absolute top-14 left-16"
        />
        <Sprite
          grid={HEART}
          palette={{ h: ZONE.rose }}
          px={3}
          className="absolute top-7 right-6"
        />
        <Sprite
          grid={HEART}
          palette={{ h: ZONE.lavender }}
          px={3}
          className="absolute bottom-24 left-6"
        />

        {/* 땅 */}
        <div
          className="absolute inset-x-0 bottom-0 h-9"
          style={{ background: ZONE.beige }}
        />
        <Sprite
          grid={GRASS}
          palette={{ g: ZONE.grass }}
          px={4}
          className="absolute bottom-6 left-5"
        />
        <Sprite
          grid={GRASS}
          palette={{ g: ZONE.grass }}
          px={4}
          className="absolute right-7 bottom-5"
        />
        <Sprite
          grid={FLOWER}
          palette={{ p: ZONE.blush, d: ZONE.heart, s: ZONE.grass }}
          px={3}
          className="absolute bottom-7 left-10"
        />
        <Sprite
          grid={FLOWER}
          palette={{ p: ZONE.lavender, d: ZONE.rose, s: ZONE.grass }}
          px={3}
          className="absolute right-16 bottom-7"
        />

        {/* 배달 고양이 — 창 안을 좌우로 거닌다 (호버 시 멈춤) */}
        <div className="px-stroll absolute inset-x-0 bottom-6 flex justify-center">
          <div className="px-stroll-face">
            {interactive ? (
              <PettableMailCat px={catPx} hint={petHint} />
            ) : (
              <MailCat stage={1} px={catPx} />
            )}
          </div>
        </div>

        {/* 창 하단 라벨 */}
        <p
          className="pointer-events-none absolute bottom-1.5 left-2.5 text-[9px] tracking-[0.14em] uppercase"
          style={{ ...PX_FONT, color: `${ZONE.text}99` }}
        >
          takemyletter.site
        </p>
        {interactive && petHint && (
          <p
            className="pointer-events-none absolute right-2.5 bottom-1.5 text-[9px] tracking-[0.06em]"
            style={{ ...PX_FONT, color: `${ZONE.text}88` }}
          >
            {petHint} ♥
          </p>
        )}
      </div>
    </div>
  );
}
