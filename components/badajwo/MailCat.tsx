/* §3-1 받아줘 예외 구역 전용 — 원본: badajwo/src/components/pixel/MailCat.jsx
   편지 배달 고양이: 입에 하트 스티커 봉투를 물고 있는 8비트 고양이.
   stage 0 새침 → 1 옅은 미소 → 2 방긋(눈웃음+볼터치) → 3 활짝(편지 내밂) */

import type { CSSProperties } from "react";
import Sprite from "./Sprite";

const BODY = [
  "..oo........oo..",
  ".occo......occo.",
  ".ocpco....ocpco.",
  ".occcooooooccco.",
  ".occcccccccccco.",
  "occcccccccccccco",
  "occcccccccccccco",
  "occcccccccccccco",
  "ocpcccccccccpcco",
  ".occcccccccccco.",
  ".occcccccccccco.",
  ".occcccccccccco.",
  ".occooccccoocco.",
  "..oooooooooooo..",
];

const EYES_BAR = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "...t........t...",
  "...t........t...",
];
const EYES_HAPPY = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "...t........t...",
  "..t.t......t.t..",
];

const MOUTH_FLAT = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  ".......tt.......",
];
const MOUTH_SOFT = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "......t..t......",
  ".......tt.......",
];
const MOUTH_GRIN = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  ".....t....t.....",
  "......tttt......",
];
const MOUTH_OPEN = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  ".....t....t.....",
  "......thht......",
];

const BLUSH_MORE = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "..p..........p..",
];

const MOUTH_ENVELOPE = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "...oooooooooo...",
  "...owwhwhwwwo...",
  "...owwhhhwwwo...",
  "...owwwhwwwwo...",
  "...oooooooooo...",
];

const TAIL_A = [
  "...................",
  "...................",
  "...................",
  "...................",
  "...................",
  "...................",
  ".................oo",
  ".................oo",
  "................oo.",
  "................oo.",
  "................oo.",
  "...............oo..",
  "..............oo...",
];
const TAIL_B = [
  "...................",
  "...................",
  "...................",
  "...................",
  "...................",
  "...................",
  "................oo.",
  "................oo.",
  "................oo.",
  "................oo.",
  "................oo.",
  "...............oo..",
  "..............oo...",
];

const FACE_BY_STAGE = [
  { eyes: EYES_BAR, mouth: MOUTH_FLAT, blush: false },
  { eyes: EYES_BAR, mouth: MOUTH_SOFT, blush: false },
  { eyes: EYES_HAPPY, mouth: MOUTH_GRIN, blush: true },
  { eyes: EYES_HAPPY, mouth: MOUTH_OPEN, blush: true },
];

export default function MailCat({
  stage = 0,
  px = 8,
  animate = true,
  style = {},
}: {
  stage?: number;
  px?: number;
  animate?: boolean;
  style?: CSSProperties;
}) {
  const face = FACE_BY_STAGE[Math.max(0, Math.min(3, stage))];
  const handover = stage >= 3;
  const W = 16 * px;
  const H = 14 * px;

  const layer: CSSProperties = { position: "absolute", inset: 0 };

  return (
    <div
      className={animate ? "px-bob" : ""}
      style={{ position: "relative", width: W, display: "inline-block", ...style }}
      role="img"
      aria-label="편지를 입에 문 픽셀 고양이"
    >
      <div style={{ position: "relative", width: W, height: H }}>
        <Sprite grid={BODY} px={px} style={layer} />
        {animate ? (
          <>
            <Sprite grid={TAIL_A} px={px} className="px-frame-a" style={layer} />
            <Sprite grid={TAIL_B} px={px} className="px-frame-b" style={layer} />
          </>
        ) : (
          <Sprite grid={TAIL_A} px={px} style={layer} />
        )}
        <Sprite grid={face.eyes} px={px} style={layer} />
        <Sprite grid={face.mouth} px={px} style={layer} />
        {face.blush && <Sprite grid={BLUSH_MORE} px={px} style={layer} />}
        <span
          className={handover ? "px-handover" : ""}
          style={{ ...layer, display: "block", pointerEvents: "none" }}
        >
          <Sprite grid={MOUTH_ENVELOPE} px={px} style={layer} />
        </span>
      </div>
    </div>
  );
}
