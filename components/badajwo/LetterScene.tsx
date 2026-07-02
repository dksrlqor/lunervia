/* §3-1 받아줘 예외 구역 — "사이트 속의 작은 다른 세계".
   따뜻한 종이 프레임 안: 구름·하트·잔디 위에서 편지를 문 배달 고양이.
   이 팔레트와 모션은 이 프레임 밖으로 한 픽셀도 새지 않는다. */

import Sprite from "./Sprite";
import MailCat from "./MailCat";

const CLOUD_BIG = [
  "...wwww.....",
  "..wwwwwww...",
  ".wwwwwwwwww.",
  "wwwwwwwwwwww",
];
const CLOUD_SMALL = ["..www...", ".wwwwww.", "wwwwwwww"];

const HEART = [".h.h.", "hhhhh", ".hhh.", "..h.."];

const GRASS = ["g.g..g.g", ".g.gg.g."];

export default function LetterScene({
  catPx = 7,
  className = "",
}: {
  catPx?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-full min-h-56 overflow-hidden rounded-2xl border-2 border-[#3D2E22]/25 bg-[#FDF8EE] ${className}`}
      style={{ imageRendering: "pixelated" }}
    >
      {/* 하늘 장식 */}
      <Sprite
        grid={CLOUD_BIG}
        palette={{ w: "#FFFFFF" }}
        px={4}
        className="absolute top-6 left-5 opacity-90"
      />
      <Sprite
        grid={CLOUD_SMALL}
        palette={{ w: "#FFFFFF" }}
        px={3}
        className="absolute top-12 right-14 opacity-80"
      />
      <Sprite
        grid={HEART}
        palette={{ h: "#F8D0C7" }}
        px={4}
        className="absolute top-16 left-14"
      />
      <Sprite
        grid={HEART}
        palette={{ h: "#D89588" }}
        px={3}
        className="absolute top-8 right-7"
      />
      <Sprite
        grid={HEART}
        palette={{ h: "#DDD0EF" }}
        px={3}
        className="absolute bottom-24 left-7"
      />

      {/* 땅 — 베이지 밴드 + 픽셀 잔디 결 */}
      <div className="absolute inset-x-0 bottom-0 h-9 bg-[#E8D5B8]" />
      <Sprite
        grid={GRASS}
        palette={{ g: "#D8BF9C" }}
        px={4}
        className="absolute bottom-6 left-6"
      />
      <Sprite
        grid={GRASS}
        palette={{ g: "#D8BF9C" }}
        px={4}
        className="absolute right-8 bottom-5"
      />

      {/* 배달 고양이 — 편지를 물고 방긋 */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <MailCat stage={2} px={catPx} />
      </div>

      <p className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.2em] text-[#3D2E22]/55 uppercase">
        takemyletter.site
      </p>
    </div>
  );
}
