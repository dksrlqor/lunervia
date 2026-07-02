"use client";

/* §3-1 허용된 대표 인터랙션 1개 — 쓰다듬을 수 있는 배달 고양이.
   쓰다듬을수록 표정이 방긋해지고(stage 0→3), 마지막엔 편지를 내민다. */

import { useRef, useState } from "react";
import MailCat from "./MailCat";
import Sprite from "./Sprite";

const HEART = [".h.h.", "hhhhh", ".hhh.", "..h.."];

export default function PettableMailCat({
  px = 8,
  hint,
}: {
  px?: number;
  hint?: string;
}) {
  const [stage, setStage] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const idRef = useRef(0);

  const pet = () => {
    setStage((s) => (s >= 3 ? 3 : s + 1));
    setJumping(true);
    window.setTimeout(() => setJumping(false), 480);
    const id = ++idRef.current;
    setHearts((h) => [...h, id]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 950);
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
      {hearts.map((id) => (
        <span
          key={id}
          aria-hidden="true"
          className="px-float-heart pointer-events-none absolute -top-2 left-1/2"
          style={{ marginLeft: ((id % 3) - 1) * 16 }}
        >
          <Sprite grid={HEART} palette={{ h: "#E45C7A" }} px={3} />
        </span>
      ))}
    </button>
  );
}
