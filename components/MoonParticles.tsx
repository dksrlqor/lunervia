"use client";

import { useEffect, useRef } from "react";
import {
  makeGlowSprite,
  makeDotSprite,
  makeRadialSprite,
} from "@/components/canvas/sprites";

/* ============================================================
   시그니처 — 히어로 전면이 하나의 밤하늘. "궤도에서 본 밤".
   · 성운 헤이즈: 초저알파 radial 2겹이 느리게 호흡·표류 — 검정이
     평면이 되지 않게 깊이의 바닥을 깐다.
   · 딥필드: 깊이(depth)로 크기·밝기·표류 속도·시차가 전부 갈라지는
     별 90~300개. 원경은 기어가고 근경은 흐른다. 일부 근경 별은
     사전 렌더한 글로우 스프라이트를 두른다.
   · 글린트: 이따금 별 하나가 십자 스파이크와 함께 잠깐 밝아진다.
   · 유성: 드물게 두 종류 — 빠르고 가는 것, 느리고 조금 밝은 것.
   · 전경 성단: 입자가 로고의 초승달+4점 별로 맺힌 뒤 달토끼 →
     고리 행성 → 우주 고래로 순환 모프(동물은 연속 배치 금지 — 천체가
     사이를 가른다). 동물이 맺힌 동안 귀·꼬리가 살랑이는 관절 모션.
     맺힌 뒤에도 리사주 표류·기울기·호흡을 (전부 2주파수 합성으로)
     멈추지 않는다 — 정지 프레임 없음.
   · 포인터 시차: 마우스 이동에 레이어가 깊이별 진폭으로 반응
     (원경 1px … 성단 7px, lerp 추종). 터치·reduced-motion 제외.
   · canvas 2D 단일 요소, 외부 라이브러리 없음. globalAlpha +
     사전 계산 색상으로 프레임당 문자열 생성 없음.
   · prefers-reduced-motion: 정적 1프레임(글린트·유성·시차 없음).
   · 화면 밖/백그라운드 탭에서는 rAF 정지.
   ============================================================ */

type Particle = {
  fx: number; // 모프 출발
  fy: number;
  tx: number; // 목표
  ty: number;
  sx: number; // 최초 진입 출발(산개)
  sy: number;
  r: number;
  a: number;
  mint: boolean;
  delay: number; // 진입 지연
  dur: number; // 진입 시간
  md: number; // 모프 지연
  ph: number;
  sp: number;
  wob: number;
};

type Star = {
  x: number;
  y: number;
  depth: number; // 0(원경)~1(근경) — 표류 속도·시차
  mag: number; // 등급 — 멱법칙 밝기(밝은 별은 극소수)
  r: number;
  a: number;
  tw: number; // 트윙클 1차 주파수
  tw2: number; // 트윙클 2차 주파수 — 규칙성 제거
  ph: number;
  ph2: number;
  bSpd: number; // 드문 깜빡임 버스트 주기
  bPh: number;
  mint: boolean;
  glow: boolean; // 밝은 별만 글로우 스프라이트
  spike: boolean; // 최상위 등급 — 상시 십자 회절 스파이크
  spd: number; // 사전 계산 — 표류 속도 계수
  ampX: number; // 사전 계산 — 포인터 시차 진폭(px 단위)
  ampY: number;
};

type EarthDot = { x: number; y: number; r: number; a: number; ph: number; sp: number };

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  r: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  len: number;
  bright: boolean; // 느리고 밝은 변종 — 머리에 점광
};

type Glint = { idx: number; born: number; dur: number };

const PAPER = "255, 249, 250";
const MINT = "33, 241, 168";
const PAPER_RGB = "rgb(255, 249, 250)";
const MINT_RGB = "rgb(33, 241, 168)";

/* 입자 대역 — 인덱스 순서 고정: 앞은 은은한 채움, 뒤로 갈수록 밝은 윤곽 */
const B1 = 0.62;
const B2 = 0.92;

const HOLD_MS = 5200;
const MORPH_MS = 1500;
const MORPH_SPREAD = 550;
const TAU = Math.PI * 2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/* 히어로 스크롤 카메라 — Hero 가 rAF 로 채우고 이 캔버스가 프레임마다 읽는다.
   p: 트랙 진행도 0~1(하강·접근), v: 정규화 스크롤 속도 -1~1(궤적·관성). */
export type HeroCamera = { p: number; v: number };

/* 표류 좌표 순환 — 여백 m 을 두고 캔버스 밖으로 나가면 반대편에서 돌아온다 */
const wrap = (v: number, max: number, m: number) => {
  const span = max + m * 2;
  let r = (v + m) % span;
  if (r < 0) r += span;
  return r - m;
};


export default function MoonParticles({
  className = "",
  cameraRef,
}: {
  className?: string;
  cameraRef?: { current: HeroCamera };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    /* 히어로 배경(bg-ink)과 같은 색을 직접 칠하므로 불투명 캔버스 —
       DOM 합성에서 알파 블렌딩이 빠져 프레임 비용이 준다. */
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    let ps: Particle[] = [];
    let stars: Star[] = [];
    let earth: EarthDot[] = []; // 지구조 — 초승달의 어두운 면
    let earthA = 1;
    let sparks: Spark[] = []; // 유성 잔해
    let meteor: Meteor | null = null;
    let meteorNext = 0;
    let glint: Glint | null = null;
    let glintNext = 0;
    let targets: [number, number][][] = [];
    let arts: (ArtMap | null)[] = []; // 형태별 관절 맵(동물만, 그 외 null)
    let W = 0;
    let H = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let phase: "entry" | "hold" | "morph" = "entry";
    let phaseAt = performance.now();
    let entryMax = 0;
    let shapeIdx = 0;
    let prevShape = 0;

    /* 적응 품질 — 평균 프레임이 예산을 넘기는 기기에서 한 번 밀도를 낮춘다 */
    let lastLoopT = 0;
    let emaDt = 16.7;
    let frameN = 0;
    let degraded = false;

    /* 형태별 관절 모션 — 동물이 맺힌 동안 부위가 살랑인다.
       그룹·가중치는 샘플 시점에 구워 둔 것(arts)을 쓰고, 관절 각의
       삼각함수는 프레임당 그룹별 한 번만 계산한다(입자당 trig 없음).
       적용은 피벗 기준 정확 회전을 가중치 w 로 보간 — 뿌리는 붙어 있고
       끝이 부드럽게 휜다. 모프 중에는 출발·목표 관절을 진행도로 블렌드. */
    const SHAPE_KIND = ["moon", "rabbit", "planet", "whale"] as const;
    const limbCT = new Float64Array(4).fill(1);
    const limbST = new Float64Array(4);
    const limbCF = new Float64Array(4).fill(1);
    const limbSF = new Float64Array(4);
    function bakeLimbs(
      kind: string,
      now: number,
      C: Float64Array,
      S: Float64Array,
    ) {
      for (let g = 1; g < 4; g++) {
        C[g] = 1;
        S[g] = 0;
      }
      if (kind === "rabbit") {
        /* 떡방아 — 절굿공이(g1)가 어깨 피벗으로 쿵덕, 귀(g2/g3)는 위상 다르게 쫑긋 */
        const a1 = 0.13 * Math.sin(now * 0.0016);
        const a2 = 0.06 * Math.sin(now * 0.0013);
        const a3 = 0.06 * Math.sin(now * 0.0013 + 2.1);
        C[1] = Math.cos(a1);
        S[1] = Math.sin(a1);
        C[2] = Math.cos(a2);
        S[2] = Math.sin(a2);
        C[3] = Math.cos(a3);
        S[3] = Math.sin(a3);
      } else if (kind === "whale") {
        /* 꼬리(g1) 살랑 */
        const a1 = 0.1 * Math.sin(now * 0.0009);
        C[1] = Math.cos(a1);
        S[1] = Math.sin(a1);
      }
    }

    /* 포인터 시차 — 목표값(ptx,pty)을 향해 현재값(px,py)이 lerp 로 따라온다 */
    let px = 0;
    let py = 0;
    let ptx = 0;
    let pty = 0;

    /* 스크롤 카메라 — 프레임마다 cameraRef 에서 읽는다(reduced 는 항상 0) */
    let camP = 0; // 진행도 0~1
    let camV = 0; // 정규화 속도 -1~1
    let camEase = 0; // 접근 이징(성단 확대·하강용)
    let expo = 1; // 3막 노출 디밍
    let lagY = 0; // 성단 관성 지연(스크롤 속도 반대 방향)

    const glowPaper = makeGlowSprite(PAPER);
    const glowMint = makeGlowSprite(MINT);
    const dotPaper = makeDotSprite(PAPER);
    const dotMint = makeDotSprite(MINT);
    const nebSprite = makeRadialSprite(PAPER, 0);
    /* 후광 원본 gradient 의 안쪽 원 = R*0.2 / 바깥 원 = R*2.1 */
    const haloSprite = makeRadialSprite(PAPER, 0.2 / 2.1);

    /* ── 형태 샘플러 ─────────────────────────────── */

    const inCrescent = (x: number, y: number) => {
      if (x * x + y * y > R * R) return false;
      const bx = x - 0.45 * R;
      const by = y + 0.2 * R;
      const br = 0.85 * R;
      return bx * bx + by * by >= br * br;
    };

    /* 4점 별 — 십자 두 획을 끝으로 갈수록 가늘게 */
    function starPoint(sx: number, sy: number, L: number, Wd: number): [number, number] {
      const t = Math.random() * 2 - 1;
      const taper = Math.pow(1 - Math.abs(t), 1.7);
      const a = t * L;
      const b = (Math.random() * 2 - 1) * Wd * taper;
      return Math.random() < 0.5 ? [sx + a, sy + b] : [sx + b, sy + a];
    }

    /* ① 초승달 + 로고 별 */
    function crescentTargets(count: number): [number, number][] {
      const out: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const f = i / count;
        let p: [number, number] | null = null;
        for (let k = 0; k < 90 && !p; k++) {
          if (f < B1) {
            const x = (Math.random() * 2 - 1) * R;
            const y = (Math.random() * 2 - 1) * R;
            if (inCrescent(x, y)) p = [x, y];
          } else if (f < B2) {
            if (Math.random() < 0.6) {
              const th = Math.random() * TAU;
              const rr = R * (0.945 + Math.random() * 0.05);
              const x = Math.cos(th) * rr;
              const y = Math.sin(th) * rr;
              if (inCrescent(x, y)) p = [x, y];
            } else {
              const th = Math.random() * TAU;
              const rr = 0.85 * R * (1.008 + Math.random() * 0.045);
              const x = 0.45 * R + Math.cos(th) * rr;
              const y = -0.2 * R + Math.sin(th) * rr;
              if (inCrescent(x, y)) p = [x, y];
            }
          } else {
            p = starPoint(0.42 * R, -0.18 * R, R * 0.3, R * 0.045);
          }
        }
        out.push(p ?? [-R * 0.45, R * 0.3]);
      }
      return out;
    }

    /* ② 동물 실루엣 — 회전 타원 합집합. 부위(el)마다 관절 그룹 g 를 달아
       샘플 시점에 그룹·가중치(피벗 거리 기반)를 함께 굽는다 — 런타임 영역
       판정이 없어 부위 경계가 어긋날 수 없다. 좌표는 레퍼런스(떡방아 토끼·
       향유고래) 기준 ASCII 시뮬로 튜닝한 확정값.
       대역: 채움(내부) / 외곽선(경계 파라메트릭 + 0.9 수축 합집합 기각 —
       진짜 테두리만, 작은 부위일수록 촘촘) / 강조(눈 클러스터 + 윤곽). */
    type El = [cx: number, cy: number, rx: number, ry: number, rot: number]; // R 배수
    type Part = { el: El; g: number };
    type ArtMap = {
      G: Int8Array; // 입자별 관절 그룹(0 = 정적)
      W: Float32Array; // 입자별 가중치 0~1 — 피벗에서 멀수록 크게 휜다
      P: [number, number][]; // 그룹별 피벗(R 배수), 인덱스 = g
    };
    const inEl = (x: number, y: number, e: El, scale: number) => {
      const c = Math.cos(e[4]);
      const s = Math.sin(e[4]);
      const dx = x - e[0] * R;
      const dy = y - e[1] * R;
      const u = (dx * c + dy * s) / (e[2] * R * scale);
      const v = (-dx * s + dy * c) / (e[3] * R * scale);
      return u * u + v * v <= 1;
    };
    const inUnion = (x: number, y: number, parts: Part[], scale: number) => {
      for (const p of parts) if (inEl(x, y, p.el, scale)) return true;
      return false;
    };

    function silhouetteTargets(
      count: number,
      parts: Part[],
      eyes: [number, number][],
      box: [number, number, number, number], // xmin,ymin,xmax,ymax (R 배수)
      pivots: [number, number][],
      reach: number[],
    ): { pts: [number, number][]; art: ArtMap } {
      const pts: [number, number][] = [];
      const G = new Int8Array(count);
      const W = new Float32Array(count);
      const edgePoint = (): [number, number, number] | null => {
        const part = parts[(Math.random() * parts.length) | 0];
        const e = part.el;
        const th = Math.random() * TAU;
        const sc = 0.92 + Math.random() * 0.08;
        const c = Math.cos(e[4]);
        const s = Math.sin(e[4]);
        const u = Math.cos(th) * e[2] * R * sc;
        const v = Math.sin(th) * e[3] * R * sc;
        const x = e[0] * R + u * c - v * s;
        const y = e[1] * R + u * s + v * c;
        return inUnion(x, y, parts, 0.9) ? null : [x, y, part.g];
      };
      for (let i = 0; i < count; i++) {
        const f = i / count;
        let p: [number, number, number] | null = null;
        for (let k = 0; k < 140 && !p; k++) {
          if (f < B1) {
            const x = (box[0] + Math.random() * (box[2] - box[0])) * R;
            const y = (box[1] + Math.random() * (box[3] - box[1])) * R;
            for (const part of parts) {
              if (inEl(x, y, part.el, 1)) {
                p = [x, y, part.g];
                break;
              }
            }
          } else if (f < B2) {
            p = edgePoint();
          } else if (eyes.length && Math.random() < 0.4) {
            const e = eyes[(Math.random() * eyes.length) | 0];
            const th = Math.random() * TAU;
            const rr = Math.sqrt(Math.random()) * 0.04 * R;
            p = [e[0] * R + Math.cos(th) * rr, e[1] * R + Math.sin(th) * rr, 0];
          } else {
            p = edgePoint();
          }
        }
        if (!p) p = [0, 0, 0];
        pts.push([p[0], p[1]]);
        const g = p[2];
        G[i] = g;
        W[i] = g
          ? Math.min(
              Math.hypot(p[0] - pivots[g][0] * R, p[1] - pivots[g][1] * R) /
                (reach[g] * R),
              1,
            )
          : 0;
      }
      return { pts, art: { G, W, P: pivots } };
    }

    /* 달토끼 — 레퍼런스: 서서 절굿공이를 들고 절구를 찧는 옆모습.
       g1 = 팔+절굿공이(떡방아), g2/g3 = 귀(쫑긋) */
    const RABBIT_PARTS: Part[] = [
      { el: [-0.38, -0.42, 0.2, 0.19, 0], g: 0 }, // 머리
      { el: [-0.42, 0.08, 0.26, 0.38, 0.05], g: 0 }, // 몸통
      { el: [-0.52, -0.72, 0.075, 0.27, -0.3], g: 2 }, // 왼귀(뒤로 젖힘)
      { el: [-0.3, -0.76, 0.075, 0.27, 0.12], g: 3 }, // 오른귀
      { el: [-0.16, -0.32, 0.2, 0.065, -0.5], g: 1 }, // 팔
      { el: [0.02, -0.42, 0.34, 0.045, -0.95], g: 1 }, // 절굿공이 자루
      { el: [0.23, -0.71, 0.13, 0.085, -0.95], g: 1 }, // 절굿공이 머리
      { el: [-0.4, 0.38, 0.22, 0.14, 0.1], g: 0 }, // 뒷다리
      { el: [-0.26, 0.47, 0.14, 0.06, 0], g: 0 }, // 발
      { el: [-0.66, 0.3, 0.07, 0.07, 0], g: 0 }, // 꼬리
      { el: [0.34, 0.4, 0.29, 0.09, 0], g: 0 }, // 절구 테
      { el: [0.34, 0.55, 0.26, 0.14, 0], g: 0 }, // 절구 몸
    ];
    const RABBIT_PIVOTS: [number, number][] = [
      [0, 0],
      [-0.22, -0.26], // 어깨(절굿공이 피벗)
      [-0.46, -0.48], // 왼귀 뿌리
      [-0.33, -0.49], // 오른귀 뿌리
    ];
    const RABBIT_REACH = [1, 0.62, 0.55, 0.55];
    const rabbitTargets = (count: number) =>
      silhouetteTargets(
        count,
        RABBIT_PARTS,
        [[-0.31, -0.45]],
        [-0.88, -1.05, 0.85, 0.8],
        RABBIT_PIVOTS,
        RABBIT_REACH,
      );

    /* 향유고래 — 레퍼런스: 대각선 상승(머리 좌상단). 뭉툭한 대두 + 좁은
       아래턱 + 등혹·너클 + 작은 두 갈래 꼬리. g1 = 후미+꼬리(살랑) */
    const WHALE_PARTS: Part[] = [
      { el: [-0.33, -0.4, 0.36, 0.26, 0.785], g: 0 }, // 머리 블록
      { el: [-0.52, -0.58, 0.14, 0.24, 0.785], g: 0 }, // 앞머리(뭉툭한 코)
      { el: [-0.5, -0.18, 0.2, 0.04, 0.7], g: 0 }, // 아래턱
      { el: [0.0, -0.02, 0.42, 0.21, 0.7], g: 0 }, // 몸통 중앙
      { el: [0.28, 0.3, 0.3, 0.13, 0.75], g: 1 }, // 몸통 후미
      { el: [0.48, 0.55, 0.18, 0.075, 0.8], g: 1 }, // 꼬리자루
      { el: [0.72, 0.62, 0.15, 0.055, -0.05], g: 1 }, // 꼬리 위갈래
      { el: [0.58, 0.8, 0.15, 0.055, 1.3], g: 1 }, // 꼬리 아래갈래
      { el: [-0.02, 0.16, 0.1, 0.05, 1.0], g: 0 }, // 가슴지느러미
      { el: [0.3, 0.02, 0.05, 0.05, 0], g: 0 }, // 등혹
      { el: [0.39, 0.13, 0.045, 0.045, 0], g: 0 }, // 너클1
      { el: [0.47, 0.24, 0.04, 0.04, 0], g: 0 }, // 너클2
    ];
    const WHALE_PIVOTS: [number, number][] = [
      [0, 0],
      [0.28, 0.3], // 꼬리 피벗(후미 시작점)
    ];
    const WHALE_REACH = [1, 0.75];
    const whaleTargets = (count: number) =>
      silhouetteTargets(
        count,
        WHALE_PARTS,
        [[-0.3, -0.22]],
        [-0.98, -0.95, 1.05, 1.0],
        WHALE_PIVOTS,
        WHALE_REACH,
      );

    /* ③ 고리 행성 — 위쪽 고리는 행성 뒤로 숨는다 */
    function planetTargets(count: number): [number, number][] {
      const out: [number, number][] = [];
      const Rd = 0.5 * R;
      const phi = -0.35;
      const cosF = Math.cos(phi);
      const sinF = Math.sin(phi);
      const ringPoint = (frontOnly: boolean): [number, number] | null => {
        for (let k = 0; k < 40; k++) {
          const th = Math.random() * TAU;
          const j = 1 + (Math.random() * 2 - 1) * 0.05;
          const u = 0.95 * R * Math.cos(th) * j;
          const v = 0.3 * R * Math.sin(th) * j;
          if (frontOnly && v < 0) continue;
          const x = u * cosF - v * sinF;
          const y = u * sinF + v * cosF;
          if (v < 0 && Math.hypot(x, y) < Rd * 1.06) continue; // 뒤쪽은 행성에 가림
          return [x, y];
        }
        return null;
      };
      for (let i = 0; i < count; i++) {
        const f = i / count;
        let p: [number, number] | null = null;
        if (f < B1) {
          const th = Math.random() * TAU;
          const rr = Rd * Math.sqrt(Math.random());
          p = [Math.cos(th) * rr, Math.sin(th) * rr];
        } else if (f < B2) {
          p = ringPoint(false);
        } else {
          if (Math.random() < 0.55) {
            const th = Math.random() * TAU;
            const rr = Rd * (0.95 + Math.random() * 0.06);
            p = [Math.cos(th) * rr, Math.sin(th) * rr];
          } else {
            p = ringPoint(true);
          }
        }
        out.push(p ?? [0, 0]);
      }
      return out;
    }

    /* ── 초기화 ─────────────────────────────────── */

    function init(withEntry: boolean) {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      /* 백킹스토어 픽셀 상한(~7M) — 초대형·고DPI 화면에서 픽셀 수가
         프레임 비용을 지배하지 않도록 dpr 을 부드럽게 낮춘다. */
      const cap = Math.sqrt(7_000_000 / (rect.width * rect.height));
      dpr = Math.max(1, Math.min(dpr, cap));
      W = Math.round(rect.width * dpr);
      H = Math.round(rect.height * dpr);
      canvas!.width = W;
      canvas!.height = H;

      /* 성단 배치 — 캔버스가 히어로 전면이므로 구도는 내부에서 잡는다.
         기존 박스 위치(데스크톱 우측 중단, 모바일 우측 상단) 계승. */
      const mobile = rect.width < 768;
      cx = W * (mobile ? 0.72 : 0.76);
      cy = H * (mobile ? 0.27 : 0.41);
      R = Math.min(W, H) * (mobile ? 0.34 : 0.27);

      /* "섬세하게 많이" — 입자 수 상향(모바일 820·데스크톱 1500), 대신
         개별 입자는 더 작게(아래 r 계수 0.9배). 저성능 기기는 loop 의
         적응 품질이 밀도를 자동으로 낮춘다. */
      const count = rect.width < 480 ? 820 : 1500;
      /* 순환: 초승달 → 달토끼 → 고리 행성 → 고래 — 동물이 연속되지 않는 배치 */
      const rb = rabbitTargets(count);
      const wh = whaleTargets(count);
      targets = [crescentTargets(count), rb.pts, planetTargets(count), wh.pts];
      arts = [null, rb.art, null, wh.art];
      shapeIdx = 0;
      prevShape = 0;

      const far = Math.max(W, H);
      ps = [];
      for (let i = 0; i < count; i++) {
        const f = i / count;
        const [tx, ty] = targets[0][i];
        const th = Math.random() * TAU;
        const d = far * (0.5 + Math.random() * 0.55);
        ps.push({
          fx: tx,
          fy: ty,
          tx,
          ty,
          sx: tx + Math.cos(th) * d,
          sy: ty + Math.sin(th) * d,
          r:
            (f < B1
              ? 0.36 + Math.random() * 0.62
              : f < B2
                ? 0.5 + Math.random() * 0.76
                : 0.63 + Math.random() * 0.9) * dpr,
          a:
            f < B1
              ? 0.13 + Math.random() * 0.37
              : f < B2
                ? 0.4 + Math.random() * 0.4
                : 0.62 + Math.random() * 0.38,
          mint: Math.random() < (f < B1 ? 0.04 : f < B2 ? 0.06 : 0.1),
          delay: withEntry ? Math.random() * 1100 : 0,
          dur: withEntry ? 900 + Math.random() * 1700 : 1,
          md: Math.random() * MORPH_SPREAD,
          ph: Math.random() * TAU,
          sp: 0.5 + Math.random(),
          wob: (Math.random() * 2 - 1) * 26 * dpr,
        });
      }

      /* 딥필드 — depth 를 원경 쪽으로 스큐해 "먼 별이 훨씬 많은" 하늘.
         밝기 상한은 낮게 눌러 성단(시그니처)이 항상 주인공으로 남는다. */
      /* "별을 더 섬세하게" — 밀도 상향, 개별 밝기 분포는 유지(성단이 주인공) */
      const starCount = Math.round(
        Math.min(360, Math.max(110, (rect.width * rect.height) / 5400)),
      );
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const depth = Math.pow(Math.random(), 1.6);
        /* 등급 — 실제 밤하늘처럼 밝은 별은 극소수(멱법칙) */
        const mag = Math.pow(Math.random(), 2.6);
        const amp = (1 + 4 * depth) * dpr;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          depth,
          mag,
          r: (0.3 + 0.5 * depth + mag * (0.5 + 0.7 * depth)) * dpr,
          a: Math.min(0.05 + 0.12 * depth + mag * 0.55, 0.78),
          tw: 0.0005 + Math.random() * 0.0011,
          tw2: 0.0016 + Math.random() * 0.0017,
          ph: Math.random() * TAU,
          ph2: Math.random() * TAU,
          bSpd: 0.00006 + Math.random() * 0.00013,
          bPh: Math.random() * TAU,
          mint: Math.random() < 0.03 + 0.03 * depth,
          glow: mag > 0.55 && Math.random() < 0.55,
          spike: mag > 0.93 && depth > 0.35,
          spd: 0.12 + 0.88 * depth * depth,
          ampX: amp,
          ampY: amp * 0.7,
        });
      }

      /* 지구조 — 달 원반에서 초승달이 아닌 어두운 면을 아주 옅게 채운다 */
      earth = [];
      for (let i = 0; i < 130; i++) {
        for (let k = 0; k < 40; k++) {
          const x = (Math.random() * 2 - 1) * R;
          const y = (Math.random() * 2 - 1) * R;
          const bx = x - 0.45 * R;
          const by = y + 0.2 * R;
          if (x * x + y * y <= R * R && bx * bx + by * by < 0.7225 * R * R) {
            earth.push({
              x,
              y,
              r: (0.35 + Math.random() * 0.4) * dpr,
              a: 0.03 + Math.random() * 0.06,
              ph: Math.random() * TAU,
              sp: 0.5 + Math.random(),
            });
            break;
          }
        }
      }
      earthA = 1;
      sparks = [];

      /* 적응 품질이 이미 발동한 기기면 재초기화 후에도 낮춘 밀도 유지.
         ps 는 뒤에서부터 자르므로 targets/arts 와의 인덱스 정렬이 깨지지 않는다. */
      if (degraded) {
        ps.length = (ps.length * 0.72) | 0;
        stars.length = (stars.length * 0.75) | 0;
      }

      meteor = null;
      meteorNext = performance.now() + 6000 + Math.random() * 4000;
      glint = null;
      glintNext = performance.now() + 3500 + Math.random() * 4000;
      entryMax = withEntry ? 2900 : 0;
      phase = withEntry ? "entry" : "hold";
      phaseAt = performance.now();
    }

    /* 별의 현재 위치 — 표류 + 순환 + 깊이 시차 (글린트에서도 재사용).
       카메라 하강은 깊이별 진폭(원경 5%H … 근경 15%H)으로 y 를 끌어올린다 —
       wrap 안에 넣어 하늘이 끊기지 않고 순환한다. */
    function starPos(s: Star, now: number): [number, number] {
      return [
        wrap(s.x - 0.0022 * dpr * s.spd * now, W, 16 * dpr) - px * s.ampX,
        wrap(
          s.y + 0.00085 * dpr * s.spd * now - camP * H * (0.05 + 0.1 * s.depth),
          H,
          16 * dpr,
        ) - py * s.ampY,
      ];
    }

    /* ── 유성 — 드물게, 가늘게, 조용히. 가끔 느리고 밝은 변종 ── */

    function drawMeteor(now: number) {
      if (!meteor) {
        if (now < meteorNext) return;
        const bright = Math.random() < 0.3;
        const th = Math.PI * (0.86 + Math.random() * 0.1); // 좌하향 12°~25°
        const spd = (bright ? 0.22 : 0.38 + Math.random() * 0.2) * dpr;
        meteor = {
          x: W * (0.25 + Math.random() * 0.7),
          y: H * (0.04 + Math.random() * 0.3),
          vx: Math.cos(th) * spd,
          vy: Math.sin(th) * spd,
          born: now,
          life: bright ? 1400 + Math.random() * 400 : 700 + Math.random() * 350,
          len: (bright ? 110 + Math.random() * 50 : 65 + Math.random() * 50) * dpr,
          bright,
        };
      }
      const t = (now - meteor.born) / meteor.life;
      if (t >= 1) {
        /* 소멸 지점에서 불티 몇 점이 떨어져 사그라진다 */
        const ex = meteor.x + meteor.vx * meteor.life;
        const ey = meteor.y + meteor.vy * meteor.life;
        const mag0 = Math.hypot(meteor.vx, meteor.vy) || 1;
        const n = meteor.bright ? 4 : 2;
        for (let i = 0; i < n; i++) {
          const spread = (Math.random() * 2 - 1) * 0.5;
          const sp = (0.04 + Math.random() * 0.06) * dpr;
          sparks.push({
            x: ex,
            y: ey,
            vx: (meteor.vx / mag0) * sp * Math.cos(spread) - (meteor.vy / mag0) * sp * Math.sin(spread),
            vy: (meteor.vy / mag0) * sp * Math.cos(spread) + (meteor.vx / mag0) * sp * Math.sin(spread),
            born: now,
            life: 500 + Math.random() * 500,
            r: (0.5 + Math.random() * 0.7) * dpr,
          });
        }
        meteor = null;
        meteorNext = now + 11000 + Math.random() * 14000;
        return;
      }
      const age = now - meteor.born;
      const hx = meteor.x + meteor.vx * age;
      const hy = meteor.y + meteor.vy * age;
      const mag = Math.hypot(meteor.vx, meteor.vy);
      const tx2 = hx - (meteor.vx / mag) * meteor.len;
      const ty2 = hy - (meteor.vy / mag) * meteor.len;
      const a = (meteor.bright ? 0.55 : 0.45) * Math.sin(Math.PI * t);
      const grad = ctx!.createLinearGradient(hx, hy, tx2, ty2);
      grad.addColorStop(0, `rgba(${PAPER}, ${a.toFixed(3)})`);
      grad.addColorStop(1, `rgba(${PAPER}, 0)`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = dpr;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(hx, hy);
      ctx!.lineTo(tx2, ty2);
      ctx!.stroke();
      if (meteor.bright) {
        ctx!.globalAlpha = a;
        const gs = 7 * dpr;
        ctx!.drawImage(glowPaper, hx - gs, hy - gs, gs * 2, gs * 2);
        ctx!.globalAlpha = 1;
      }
    }

    /* ── 유성 잔해 — 소멸 지점에서 떨어져 사그라지는 불티 ── */

    function drawSparks(now: number) {
      if (!sparks.length) return;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const t = (now - s.born) / s.life;
        if (t >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        const age = now - s.born;
        const x = s.x + s.vx * age;
        const y = s.y + s.vy * age + 0.00002 * dpr * age * age; // 아주 옅은 낙하
        ctx!.globalAlpha = 0.55 * (1 - t);
        ctx!.fillStyle = PAPER_RGB;
        ctx!.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2);
      }
      ctx!.globalAlpha = 1;
    }

    /* ── 글린트 — 별 하나가 십자 스파이크와 함께 잠깐 밝아진다 ── */

    function drawGlint(now: number) {
      if (!glint) {
        if (now < glintNext) return;
        const near = stars
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.depth > 0.5);
        if (!near.length) return;
        const pick = near[Math.floor(Math.random() * near.length)];
        glint = { idx: pick.i, born: now, dur: 1100 + Math.random() * 500 };
      }
      const t = (now - glint.born) / glint.dur;
      if (t >= 1) {
        glint = null;
        glintNext = now + 4000 + Math.random() * 6000;
        return;
      }
      const s = stars[glint.idx];
      if (!s) {
        /* 적응 품질·리사이즈로 배열이 줄어든 경우 — 조용히 재추첨 대기 */
        glint = null;
        return;
      }
      const [gx, gy] = starPos(s, now);
      const e = Math.sin(Math.PI * t);
      const len = (3 + 9 * e) * dpr;
      const rgb = s.mint ? MINT : PAPER;
      ctx!.strokeStyle = `rgba(${rgb}, ${(0.5 * e).toFixed(3)})`;
      ctx!.lineWidth = dpr * 0.8;
      ctx!.beginPath();
      ctx!.moveTo(gx - len, gy);
      ctx!.lineTo(gx + len, gy);
      ctx!.moveTo(gx, gy - len);
      ctx!.lineTo(gx, gy + len);
      ctx!.stroke();
      ctx!.globalAlpha = 0.6 * e;
      const gs = 5 * dpr;
      ctx!.drawImage(s.mint ? glowMint : glowPaper, gx - gs, gy - gs, gs * 2, gs * 2);
      ctx!.globalAlpha = 1;
    }

    /* ── 렌더 ────────────────────────────────────── */

    function draw(now: number) {
      /* 위상 전환 */
      if (phase === "entry" && now - phaseAt > entryMax) {
        phase = "hold";
        phaseAt = now;
      } else if (phase === "hold" && now - phaseAt > HOLD_MS && !reduced) {
        prevShape = shapeIdx;
        shapeIdx = (shapeIdx + 1) % targets.length;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          p.fx = p.tx;
          p.fy = p.ty;
          p.tx = targets[shapeIdx][i][0];
          p.ty = targets[shapeIdx][i][1];
          /* 웨이브 모프 — 중심에 가까운 입자부터 변형, 바깥으로 전파.
             출발·목표 중 먼 쪽 반지름 기준(형태가 커지든 작아지든 물결) */
          const rf = Math.hypot(p.fx, p.fy);
          const rt = Math.hypot(p.tx, p.ty);
          p.md = (Math.max(rf, rt) / R) * MORPH_SPREAD + Math.random() * 90;
        }
        phase = "morph";
        phaseAt = now;
      } else if (phase === "morph" && now - phaseAt > MORPH_MS + MORPH_SPREAD + 90) {
        phase = "hold";
        phaseAt = now;
      }

      /* 포인터 시차 추종 */
      px += (ptx - px) * 0.045;
      py += (pty - py) * 0.045;

      /* 스크롤 카메라 읽기 — 접근 이징·노출·성단 관성 */
      if (cameraRef && !reduced) {
        camP = cameraRef.current.p;
        camV = cameraRef.current.v;
      }
      camEase = easeInOut(clamp01(camP / 0.85));
      expo = 1 - 0.32 * sstep((camP - 0.75) / 0.25);
      lagY += (-camV * 16 * dpr - lagY) * 0.09;

      /* 불투명 캔버스 — 히어로 배경색으로 직접 지운다 */
      ctx!.fillStyle = "#171717";
      ctx!.fillRect(0, 0, W, H);

      /* 성운 헤이즈 — 검정이 평면이 되지 않게, 아주 낮게 두 겹.
         gradient 는 스프라이트로 구워 두고 알파·위치만 프레임마다 바꾼다.
         카메라 하강 시 가장 느린 층(4%H)으로 함께 밀린다. */
      const nebLift = camP * H * 0.04;
      const n1x = W * 0.3 + Math.sin(now * 0.00007) * 40 * dpr - px * 2 * dpr;
      const n1y =
        H * 0.74 + Math.cos(now * 0.000056) * 30 * dpr - py * 1.5 * dpr - nebLift;
      const n1r = Math.max(W, H) * 0.5;
      ctx!.globalAlpha = 0.02 + 0.006 * Math.sin(now * 0.00009);
      ctx!.drawImage(nebSprite, n1x - n1r, n1y - n1r, n1r * 2, n1r * 2);

      const n2x = W * 0.88 + Math.cos(now * 0.00005) * 34 * dpr - px * 2 * dpr;
      const n2y =
        H * 0.12 + Math.sin(now * 0.000063) * 26 * dpr - py * 1.5 * dpr - nebLift;
      const n2r = Math.max(W, H) * 0.38;
      ctx!.globalAlpha = 0.024 + 0.007 * Math.sin(now * 0.00008 + 2);
      ctx!.drawImage(nebSprite, n2x - n2r, n2y - n2r, n2r * 2, n2r * 2);

      /* 성단 접근 — 카메라가 달로 하강: 중심이 화면 중앙 쪽으로 내려오며 커진다 */
      const ccy = cy + camEase * H * 0.07;
      const camScale = 1 + 0.16 * camEase;

      /* 성단 후광 */
      const hr = R * 2.1 * camScale;
      ctx!.globalAlpha = 0.05 * expo;
      ctx!.drawImage(haloSprite, cx - hr, ccy - hr, hr * 2, hr * 2);
      ctx!.globalAlpha = 1;

      /* 딥필드 — 깊을수록 느리게 표류, 얕을수록 시차 크게.
         · 트윙클: 2주파수 합성으로 규칙성 제거
         · 버스트: 아주 느린 사인의 꼭대기에서만 잠깐 밝아지는 신틸레이션
         · 작은 별은 fillRect, 큰 별은 원형 스프라이트로 부드럽게
         · 최상위 등급은 상시 십자 회절 스파이크 */
      for (const s of stars) {
        const [sx, sy] = starPos(s, now);
        let tw = 1;
        if (!reduced) {
          const base = 0.6 + 0.28 * Math.sin(now * s.tw + s.ph)
            + 0.12 * Math.sin(now * s.tw2 + s.ph2);
          const b = Math.sin(now * s.bSpd + s.bPh);
          const burst = b > 0.86 ? (b - 0.86) / 0.14 : 0; // 상위 14% 구간만
          tw = base + burst * 0.5;
        }
        const alpha = Math.min(s.a * tw, 0.9) * expo;
        if (alpha < 0.012) continue;
        const rgb = s.mint ? MINT_RGB : PAPER_RGB;
        if (s.glow) {
          ctx!.globalAlpha = alpha * (0.4 + 0.35 * s.mag);
          const gs = s.r * (5 + 3 * s.mag);
          ctx!.drawImage(s.mint ? glowMint : glowPaper, sx - gs, sy - gs, gs * 2, gs * 2);
        }
        /* 속도 궤적 — 빠른 스크롤에서 별이 깊이별 길이의 짧은 획으로 늘어난다.
           스크롤 다운(v>0) = 하늘이 위로 → 궤적은 진행 반대(아래)로 남는다. */
        const streak =
          Math.abs(camV) > 0.15 ? Math.abs(camV) * (3 + 14 * s.depth) * dpr : 0;
        if (streak > s.r * 2.2) {
          ctx!.globalAlpha = alpha * 0.85;
          ctx!.strokeStyle = rgb;
          ctx!.lineWidth = Math.max(s.r * 0.9, 0.6);
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(sx, sy);
          ctx!.lineTo(sx, sy + (camV > 0 ? streak : -streak));
          ctx!.stroke();
        } else {
          ctx!.globalAlpha = alpha;
          if (s.r > 1.15 * dpr) {
            const d2 = s.r * 2.4;
            ctx!.drawImage(s.mint ? dotMint : dotPaper, sx - s.r * 1.2, sy - s.r * 1.2, d2, d2);
          } else {
            ctx!.fillStyle = rgb;
            ctx!.fillRect(sx - s.r, sy - s.r, s.r * 2, s.r * 2);
          }
          /* 회절 스파이크 — 밝은 별에만, 트윙클과 함께 숨 쉰다 */
          if (s.spike) {
            const len = s.r * (3.4 + 2.2 * Math.sin(now * s.tw + s.ph));
            ctx!.globalAlpha = alpha * 0.5;
            ctx!.strokeStyle = rgb;
            ctx!.lineWidth = Math.max(0.5, dpr * 0.5);
            ctx!.beginPath();
            ctx!.moveTo(sx - len, sy);
            ctx!.lineTo(sx + len, sy);
            ctx!.moveTo(sx, sy - len);
            ctx!.lineTo(sx, sy + len);
            ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1;

      if (!reduced) {
        drawGlint(now);
        drawSparks(now);
        drawMeteor(now);
      }

      /* 성단 — 궤도 위 정거장처럼 표류·기울기·호흡을 계속한다.
         전부 2주파수 합성이라 같은 자세가 다시 오지 않는다.
         카메라: 접근 스케일·중앙 하강(ccy)·미세 틸트, 그리고 스크롤 속도의
         반대 방향으로 밀렸다 돌아오는 관성 지연(lagY). */
      const ox =
        (6 * Math.sin(now * 0.00019) + 2.5 * Math.sin(now * 0.00047 + 1.3)) * dpr -
        px * 7 * dpr;
      const oy =
        (5 * Math.cos(now * 0.00016) + 2 * Math.sin(now * 0.00041 + 0.5)) * dpr -
        py * 5 * dpr;
      const rot =
        0.022 * Math.sin(now * 0.00013) +
        0.01 * Math.sin(now * 0.00031 + 2.1) +
        camEase * 0.03 +
        camV * 0.012;
      const sc = (1 + 0.008 * Math.sin(now * 0.00017 + 0.7)) * camScale;
      ctx!.save();
      ctx!.translate(cx + ox, ccy + oy + lagY);
      ctx!.rotate(rot);
      ctx!.scale(sc, sc);

      /* 지구조 — 초승달 위상에서만, 어두운 면을 옅게 채운다.
         목표 가시도를 lerp 해 형태가 바뀔 때 자연히 사라진다. */
      const wantEarth = shapeIdx === 0 ? 1 : 0;
      earthA += (wantEarth - earthA) * 0.04;
      if (earthA > 0.01 && !reduced) {
        ctx!.fillStyle = PAPER_RGB;
        for (const e of earth) {
          const dx = Math.sin(now * 0.0004 * e.sp + e.ph) * 1.1 * dpr;
          const dy = Math.cos(now * 0.00034 * e.sp + e.ph) * 1.1 * dpr;
          ctx!.globalAlpha = e.a * earthA * (0.82 + 0.18 * Math.sin(now * 0.0011 + e.ph));
          ctx!.fillRect(e.x + dx - e.r, e.y + dy - e.r, e.r * 2, e.r * 2);
        }
        ctx!.globalAlpha = 1;
      }

      /* 관절 각 — 입자 루프 밖에서 그룹별로 한 번만 굽는다 */
      const artT = arts[shapeIdx];
      const artF = arts[prevShape];
      if (!reduced) {
        if (artT) bakeLimbs(SHAPE_KIND[shapeIdx], now, limbCT, limbST);
        if (artF && phase === "morph")
          bakeLimbs(SHAPE_KIND[prevShape], now, limbCF, limbSF);
      }

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        let bx: number;
        let by: number;
        let fade = 1;

        if (phase === "entry") {
          const t = Math.min(Math.max((now - phaseAt - p.delay) / p.dur, 0), 1);
          const e = easeOutCubic(t);
          const swirl = Math.sin(e * Math.PI) * p.wob;
          bx = p.sx + (p.tx - p.sx) * e + swirl * Math.sin(p.ph);
          by = p.sy + (p.ty - p.sy) * e + swirl * Math.cos(p.ph);
          fade = Math.max(e, 0.05);
        } else if (phase === "morph") {
          const t = Math.min(Math.max((now - phaseAt - p.md) / MORPH_MS, 0), 1);
          const e = easeInOut(t);
          const swirl = Math.sin(e * Math.PI) * p.wob * 0.35;
          bx = p.fx + (p.tx - p.fx) * e + swirl * Math.sin(p.ph);
          by = p.fy + (p.ty - p.fy) * e + swirl * Math.cos(p.ph);
          /* 관절 — 출발·목표 형태의 살랑임을 진행도로 가중해 잇는다 */
          if (!reduced) {
            if (artF) {
              const g = artF.G[i];
              if (g) {
                const w = artF.W[i] * (1 - e);
                const rx = p.fx - artF.P[g][0] * R;
                const ry = p.fy - artF.P[g][1] * R;
                bx += w * (limbCF[g] * rx - limbSF[g] * ry - rx);
                by += w * (limbSF[g] * rx + limbCF[g] * ry - ry);
              }
            }
            if (artT) {
              const g = artT.G[i];
              if (g) {
                const w = artT.W[i] * e;
                const rx = p.tx - artT.P[g][0] * R;
                const ry = p.ty - artT.P[g][1] * R;
                bx += w * (limbCT[g] * rx - limbST[g] * ry - rx);
                by += w * (limbST[g] * rx + limbCT[g] * ry - ry);
              }
            }
          }
        } else {
          bx = p.tx;
          by = p.ty;
          if (!reduced && artT) {
            const g = artT.G[i];
            if (g) {
              const w = artT.W[i];
              const rx = p.tx - artT.P[g][0] * R;
              const ry = p.ty - artT.P[g][1] * R;
              bx += w * (limbCT[g] * rx - limbST[g] * ry - rx);
              by += w * (limbST[g] * rx + limbCT[g] * ry - ry);
            }
          }
        }

        /* 개별 미세 표류 — 두 주파수를 겹쳐 기계적 반복감을 없앤다 */
        const x =
          bx +
          (Math.sin(now * 0.00042 * p.sp + p.ph) * 1.6 +
            Math.sin(now * 0.00011 * p.sp + p.ph * 1.7)) *
            dpr;
        const y =
          by +
          (Math.cos(now * 0.00036 * p.sp + p.ph) * 1.6 +
            Math.cos(now * 0.000095 * p.sp + p.ph * 2.3)) *
            dpr;
        const tw =
          phase === "entry" ? 1 : 0.84 + 0.16 * Math.sin(now * 0.0012 * p.sp + p.ph);

        ctx!.globalAlpha = Math.min(p.a * tw * fade, 1) * expo;
        ctx!.fillStyle = p.mint ? MINT_RGB : PAPER_RGB;
        ctx!.fillRect(x - p.r, y - p.r, p.r * 2, p.r * 2);
      }

      ctx!.globalAlpha = 1;
      ctx!.restore();
    }

    function loop(now: number) {
      if (!visible) return;
      /* 적응 품질 — 이동평균 프레임이 26ms(≈38fps)를 넘기면 한 번 밀도를
         낮춘다. 탭 복귀 등 80ms 초과 스파이크는 표본에서 제외. */
      if (lastLoopT) {
        const d = now - lastLoopT;
        if (d < 80) {
          emaDt += (d - emaDt) * 0.05;
          frameN++;
          if (!degraded && frameN > 150 && emaDt > 26) {
            degraded = true;
            ps.length = (ps.length * 0.72) | 0;
            stars.length = (stars.length * 0.75) | 0;
            glint = null; // 잘린 인덱스 참조 방지
          }
        }
      }
      lastLoopT = now;
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    init(!reduced);
    if (reduced) {
      draw(phaseAt + 10);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.03 },
    );
    io.observe(canvas);

    const onVis = () => {
      visible = !document.hidden;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    /* 포인터 시차 — 마우스 전용(터치·reduced 제외), 창 밖으로 나가면 복귀 */
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptx = Math.min(Math.max((e.clientX / window.innerWidth) * 2 - 1, -1), 1);
      pty = Math.min(Math.max((e.clientY / window.innerHeight) * 2 - 1, -1), 1);
    };
    const onPointerOut = () => {
      ptx = 0;
      pty = 0;
    };
    if (!reduced && !coarse) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("mouseleave", onPointerOut);
    }

    let ro: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      let first = true;
      ro = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        init(false);
        if (reduced) draw(performance.now());
      });
      ro.observe(canvas);
    }

    /* DPR 변화(모니터 이동·브라우저 줌) — 크기가 같으면 RO 가 침묵하므로
       resolution 미디어쿼리로 감지해 백킹스토어를 다시 만든다. */
    let dprMql: MediaQueryList | null = null;
    const onDprChange = () => {
      init(false);
      if (reduced) draw(performance.now());
      watchDpr();
    };
    const watchDpr = () => {
      dprMql?.removeEventListener("change", onDprChange);
      dprMql = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`,
      );
      dprMql.addEventListener("change", onDprChange);
    };
    watchDpr();

    /* 드물게 오는 캔버스 2D 컨텍스트 유실 — 복구 시 처음부터 다시 그린다 */
    const onCtxLost = (e: Event) => e.preventDefault();
    const onCtxRestored = () => {
      init(false);
      if (reduced) draw(performance.now());
    };
    canvas.addEventListener("contextlost", onCtxLost);
    canvas.addEventListener("contextrestored", onCtxRestored);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
      dprMql?.removeEventListener("change", onDprChange);
      canvas.removeEventListener("contextlost", onCtxLost);
      canvas.removeEventListener("contextrestored", onCtxRestored);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onPointerOut);
    };
  }, [cameraRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
