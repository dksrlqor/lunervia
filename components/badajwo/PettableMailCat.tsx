"use client";

/* §3-1 허용된 대표 인터랙션 1개 — 쓰다듬을 수 있는 배달 고양이.
   원본 badajwo PettableCat 의 동작을 그대로 계승:
   · 쓰다듬을 때마다 픽셀 하트 2~4개가 머리 위 랜덤 위치에서 뿅
   · 연속 입력은 cooldown(350ms)으로 제한
   · 표정은 잠깐 밝아졌다가(stage +1) 가만히 두면 은은한 미소로 되돌아온다
   · prefers-reduced-motion 이면 점프 없이 하트만 잠깐 */

import { useEffect, useRef, useState } from "react";
import MailCat from "./MailCat";
import Sprite from "./Sprite";

const HEART = [".hh.hh.", "hhhhhhh", "hhhhhhh", ".hhhhh.", "..hhh..", "...h..."];

const COOLDOWN_MS = 350;
const HEART_LIFETIME_MS = 1200;
const MAX_HEARTS = 10;
const CALM_MS = 4500;

type FloatingHeart = { id: string; left: number; delay: number; px: number };

export default function PettableMailCat({
  px = 8,
  hint,
}: {
  px?: number;
  hint?: string;
}) {
  const [stage, setStage] = useState(1);
  const [jumping, setJumping] = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const lastPet = useRef(0);
  const jumpTimer = useRef<number | undefined>(undefined);
  const calmTimer = useRef<number | undefined>(undefined);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      window.clearTimeout(jumpTimer.current);
      window.clearTimeout(calmTimer.current);
    };
  }, []);

  const pet = () => {
    const now = Date.now();
    if (now - lastPet.current < COOLDOWN_MS) return;
    lastPet.current = now;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* 하트 2~4개, 랜덤 위치 */
    const count = 2 + Math.floor(Math.random() * 3);
    const batch: FloatingHeart[] = Array.from({ length: count }, (_, i) => ({
      id: `${now}-${i}`,
      left: 8 + Math.random() * 72,
      delay: i * 0.09,
      px: Math.random() < 0.5 ? 3 : 4,
    }));
    setHearts((prev) => [...prev, ...batch].slice(-MAX_HEARTS));
    window.setTimeout(() => {
      if (!alive.current) return;
      const ids = new Set(batch.map((b) => b.id));
      setHearts((prev) => prev.filter((h) => !ids.has(h.id)));
    }, HEART_LIFETIME_MS);

    /* 표정: 한 단계 밝아졌다가, 가만히 두면 은은한 미소(1)로 */
    setStage((s) => Math.min(3, s + 1));
    window.clearTimeout(calmTimer.current);
    calmTimer.current = window.setTimeout(() => {
      if (alive.current) setStage(1);
    }, CALM_MS);

    if (!reduceMotion) {
      setJumping(true);
      window.clearTimeout(jumpTimer.current);
      jumpTimer.current = window.setTimeout(() => {
        if (alive.current) setJumping(false);
      }, 500);
    }
  };

  return (
    <button
      type="button"
      onClick={pet}
      aria-label={hint ?? "고양이 쓰다듬기"}
      className="relative inline-block cursor-pointer border-0 bg-transparent p-0"
    >
      <span className={`inline-block ${jumping ? "px-cat-jump" : ""}`}>
        <MailCat stage={stage} px={px} />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {hearts.map((h) => (
          <span
            key={h.id}
            className="px-float-heart absolute"
            style={{ top: -8, left: `${h.left}%`, animationDelay: `${h.delay}s` }}
          >
            <Sprite grid={HEART} palette={{ h: "#E45C7A" }} px={h.px} />
          </span>
        ))}
      </span>
    </button>
  );
}
