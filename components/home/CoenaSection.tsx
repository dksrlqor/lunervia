"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import { btnPaper, btnGhostDark } from "@/components/ui";

/* Coena(코이나) — AI 위에 얹는 살아있는 계층. 모듈 자리를 잇는 대표 R&D.

   히어로 = 영원히 순환하는 균사 생태 (Anthropic Glasswing 결의 표본 아트).
   도식이 아니라 생명체: 라벨·링·궤도 없음. 굵직한 실이 빛나는 첨단을
   앞세워 자라고, 갈라지고, 접합해 매듭을 남긴다. 조직은 서서히 풍화되어
   사라지고 그 사이 새 포자가 점화해 실 다발을 터뜨린다 — 성장과 소멸의
   동적 평형이라 장면이 반복되면서도 같은 그림이 두 번 없다. 생장 속도는
   ~9초 물결로 출렁이고, 민트 신호가 혜성처럼 실을 타고 흐르다 연쇄한다.
   조직은 사각 캔버스 전체를 채우고, 가장자리는 소프트 페이드로만 끝난다.

   - Canvas 2D 3장: 대기(정적) + 조직(누적·풍화) + 첨단·신호 오버레이.
   - 풍화 = 주기적 destination-out 침식. 실 수명 ≈ 30초 내외.
   - 페이싱은 팁당 속도(dt 기반) 기준이라 주사율 무관.
   - 뷰포트 밖·탭 숨김 시 정지, DPR ≤ 2, 리사이즈 시 동기 프리워밍.
   - reduced-motion: 완성 표본을 즉시 그리고 모션(생장·풍화·펄스) 없음.
   - 색은 토큰 3색 규율: 잉크 바탕 + 종이색 실(투명도 파생) + 민트 신호. */

/* 시제품/기술 노트 URL — 공개되면 여기만 채우면 된다. 비어 있으면
   해당 버튼은 렌더되지 않는다. */
const PROTOTYPE_URL = "";
const NOTES_URL = "";

const PAPER = "255, 249, 250";
const MINT = "33, 241, 168";

/* 생태 파라미터 — 감도가 높은 값에는 주석 */
const CELL = 7; // 접합 판정용 공간 그리드 셀(px)
const MAX_TIPS = 46; // 동시 생장 첨단 수(분기 상한 — 포자 점화는 잠시 초과 가능)
const TIP_RATE = 0.04; // 팁당 걸음/ms ≈ 90px/s — 첨단이 활기차게 내달린다
const SURGE_MS = 7000; // 생장 물결 주기 — 속도·분기가 ±60% 출렁인다
const ERODE_MS = 1200; // 조직 풍화 주기 — 빠른 생장만큼 빠른 세대교체
const ERODE_A = 0.13; // 풍화 강도 — 실 수명과 평형 밀도를 정한다
const MARGIN = 12; // 사각 틀 가장자리 소프트 페이드 폭(px)
const LAYERS = [
  { w: 0.7, a: 0.06 }, // 배경 조직
  { w: 1.0, a: 0.09 },
  { w: 1.35, a: 0.13 }, // 전경 가닥 — 신호가 타고 흐르는 실
];

type Tip = {
  id: number; // 접합 판정에서 자기 궤적을 제외하기 위한 가닥 식별자
  x: number;
  y: number;
  a: number; // 진행각
  turn: number; // 관성 있는 방향 노이즈
  curl: number; // 가닥 고유의 완만한 나선 성향 — 긴 활 모양 곡선을 만든다
  layer: number;
  age: number;
  mint: boolean; // 조직에 드물게 섞이는 민트 실
  pts: number[] | null; // 펄스 경로로 기록할 폴리라인
};

type Strand = { pts: number[]; born: number };
type Pulse = { pts: number[]; t: number; dur: number };

export default function CoenaSection() {
  const { t } = useI18n();
  const c = t.coena;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const atmosRef = useRef<HTMLCanvasElement | null>(null);
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const overRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const atmosCv = atmosRef.current;
    const baseCv = baseRef.current;
    const overCv = overRef.current;
    if (!wrap || !atmosCv || !baseCv || !overCv) return;
    const actx = atmosCv.getContext("2d");
    const bctx = baseCv.getContext("2d");
    const octx = overCv.getContext("2d");
    if (!actx || !bctx || !octx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let started = false;
    let visible = false;
    let destroyed = false;

    /* ── 개체 형태: 사각 캔버스 전체 — 가장자리만 소프트 페이드 ── */
    let cx = 0;
    let cy = 0;

    let tips: Tip[] = [];
    let visited: Int32Array = new Int32Array(0);
    let gridW = 0;
    let nextId = 1;
    let segments = 0; // 그린 세그먼트 누계 — 앵커 샘플링 주기용
    let staticTarget = 0; // reduced-motion/프리워밍용 표본 밀도
    let surge = 1; // 현재 생장 물결 배율
    let anchors: number[] = []; // 재발아·점화 지점 — 조직 위 좌표 샘플
    let strands: Strand[] = [];
    let pulses: Pulse[] = [];
    let lastErode = 0;
    let lastTopUp = 0;
    let nextSporeAt = 0;
    let nextPulseAt = 0;

    const spawnTip = (
      x: number,
      y: number,
      a: number,
      layer: number,
      recordable: boolean,
    ): Tip => ({
      id: nextId++,
      x,
      y,
      a,
      turn: 0,
      curl: (Math.random() - 0.5) * 0.022,
      layer,
      age: 0,
      mint: Math.random() < 0.07,
      pts:
        recordable && strands.length < 40 && Math.random() < 0.6 ? [x, y] : null,
    });

    /* 포자 배광 — 조직 캔버스에 그려서 함께 풍화된다 */
    const sporeGlow = (sx: number, sy: number, r: number) => {
      const g = bctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
      g.addColorStop(0, `rgba(${PAPER}, 0.24)`);
      g.addColorStop(1, `rgba(${PAPER}, 0)`);
      bctx.fillStyle = g;
      bctx.fillRect(sx - r * 4, sy - r * 4, r * 8, r * 8);
    };

    /* 포자 점화 — 경계 안 임의 지점에서 실 다발이 터진다 */
    const igniteSpore = (sx: number, sy: number, count: number) => {
      sporeGlow(sx, sy, 2.2 + Math.random() * 1.2);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
        tips.push(spawnTip(sx, sy, a, i % 3, i % 2 === 0));
      }
    };

    const randomSporePos = (): [number, number] => [
      MARGIN * 2 + Math.random() * (W - MARGIN * 4),
      MARGIN * 2 + Math.random() * (H - MARGIN * 4),
    ];

    const seed = () => {
      tips = [];
      /* 좌·우 반쪽에 하나씩 — 시작부터 틀 전체로 퍼져 나간다 */
      igniteSpore(W * (0.22 + Math.random() * 0.2), H * (0.42 + Math.random() * 0.3), 6);
      igniteSpore(W * (0.6 + Math.random() * 0.2), H * (0.18 + Math.random() * 0.3), 5);
    };

    const setup = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 10) return false;
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const [cv, ctx] of [
        [atmosCv, actx] as const,
        [baseCv, bctx] as const,
        [overCv, octx] as const,
      ]) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
      }
      bctx.lineCap = "round";
      octx.lineCap = "round";

      cx = W * 0.5;
      cy = H * 0.485;
      gridW = Math.ceil(W / CELL);
      visited = new Int32Array(gridW * Math.ceil(H / CELL));
      nextId = 1;
      segments = 0;
      staticTarget = Math.round((W * H) / 10);
      anchors = [];
      strands = [];
      pulses = [];
      const now = performance.now();
      lastErode = now;
      lastTopUp = 0;
      nextSporeAt = now + 9000;
      nextPulseAt = now + 3500;

      /* ── 대기 층(정적, 풍화 안 됨): 역광 + 부유 먼지, 틀 전체 ── */
      const g = actx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(W, H) * 0.58);
      g.addColorStop(0, `rgba(${PAPER}, 0.045)`);
      g.addColorStop(1, `rgba(${PAPER}, 0)`);
      actx.fillStyle = g;
      actx.fillRect(0, 0, W, H);
      for (let i = 0; i < 84; i++) {
        actx.fillStyle = `rgba(${PAPER}, ${0.03 + Math.random() * 0.04})`;
        actx.beginPath();
        actx.arc(
          Math.random() * W,
          Math.random() * H,
          0.4 + Math.random() * 0.9,
          0,
          6.29,
        );
        actx.fill();
      }

      seed();
      return true;
    };

    /* ── 생장 한 걸음: 한 팁의 전진·분기·접합·소멸.
       false = 이 팁은 여기서 소멸 ── */
    const stepTip = (tip: Tip): boolean => {
      const step = 1.9 + Math.random() * 0.7;
      tip.turn = Math.max(
        -0.08,
        Math.min(0.08, (tip.turn + (Math.random() - 0.5) * 0.09) * 0.92),
      );
      /* 어릴 땐 바깥으로 살짝 편향 — 포자에서 퍼져 나가는 형세 */
      const outward = Math.atan2(tip.y - cy, tip.x - cx);
      let diff = outward - tip.a;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      tip.a += diff * 0.012 + tip.turn + tip.curl;

      const nx = tip.x + Math.cos(tip.a) * step;
      const ny = tip.y + Math.sin(tip.a) * step;
      if (nx < 2 || ny < 2 || nx > W - 2 || ny > H - 2) return false;
      /* 틀 가장자리에 다가갈수록 소멸 확률 상승 — 부드러운 테두리 페이드 */
      const bDist = Math.min(nx, ny, W - nx, H - ny);
      const dieP =
        bDist < MARGIN ? ((MARGIN - bDist) / MARGIN) * 0.1 : 0.0012;
      if (Math.random() < dieP) return false;

      /* 접합: 다른 가닥의 조직과 만나면 매듭을 남기고 합류한다 —
         자기 궤적(같은 id)은 제외해야 자기 꼬리를 밟고 죽지 않는다 */
      const owner =
        visited[Math.floor(nx / CELL) + Math.floor(ny / CELL) * gridW];
      visited[
        Math.floor(tip.x / CELL) + Math.floor(tip.y / CELL) * gridW
      ] = tip.id;

      bctx.strokeStyle = tip.mint
        ? `rgba(${MINT}, 0.12)`
        : `rgba(${PAPER}, ${LAYERS[tip.layer].a})`;
      bctx.lineWidth = tip.mint ? 1.0 : LAYERS[tip.layer].w;
      bctx.beginPath();
      bctx.moveTo(tip.x, tip.y);
      bctx.lineTo(nx, ny);
      bctx.stroke();

      segments++;
      if (segments % 16 === 0) {
        anchors.push(nx, ny);
        if (anchors.length > 600) anchors.splice(0, 150);
      }
      tip.x = nx;
      tip.y = ny;
      tip.age++;
      if (tip.pts && tip.age % 2 === 0) tip.pts.push(nx, ny);

      if (
        owner !== 0 &&
        owner !== tip.id &&
        tip.age > 26 &&
        Math.random() < 0.1
      ) {
        /* 접합 매듭 — 네트워크가 짜이는 흔적 */
        bctx.fillStyle = `rgba(${PAPER}, 0.18)`;
        bctx.beginPath();
        bctx.arc(nx, ny, 1.3, 0, 6.29);
        bctx.fill();
        return false;
      }

      if (
        tips.length < MAX_TIPS &&
        tip.age > 14 &&
        Math.random() < 0.03 * surge
      ) {
        const sign = Math.random() < 0.5 ? 1 : -1;
        tips.push(
          spawnTip(
            tip.x,
            tip.y,
            tip.a + sign * (0.4 + Math.random() * 0.55),
            Math.max(0, tip.layer - (Math.random() < 0.4 ? 1 : 0)),
            tip.layer === 2,
          ),
        );
      }
      return true;
    };

    /* 최근 조직 위 임의 지점 — 재발아는 갓 자란 자리에서 */
    const recentAnchor = (): [number, number] | null => {
      if (!anchors.length) return null;
      const start = Math.max(0, anchors.length - 400);
      const j =
        start +
        Math.floor(Math.random() * ((anchors.length - start) / 2)) * 2;
      return [anchors[j], anchors[j + 1]];
    };

    /* 한 라운드 = 모든 팁 한 걸음 + 개체 유지 */
    const simRound = (now: number, force = false) => {
      for (let i = tips.length - 1; i >= 0; i--) {
        if (!stepTip(tips[i])) {
          const tp = tips[i];
          if (tp.pts && tp.pts.length >= 40 && strands.length < 40)
            strands.push({ pts: tp.pts, born: now });
          tips.splice(i, 1);
        }
      }
      if (tips.length < 8 && (force || now - lastTopUp > 400)) {
        lastTopUp = now;
        const p = recentAnchor();
        if (p) {
          for (let i = 0; i < 3; i++) {
            tips.push(
              spawnTip(
                p[0],
                p[1],
                Math.random() * Math.PI * 2,
                Math.floor(Math.random() * 3),
                true,
              ),
            );
          }
        } else {
          seed();
        }
      }
    };

    /* reduced-motion·리사이즈용 동기 생장 — 풍화 없이 표본을 채운다 */
    const syncBuild = (frac: number) => {
      const target = staticTarget * frac;
      let guard = 0;
      while (segments < target && guard++ < 200000)
        simRound(performance.now(), true);
    };

    /* ── 민트 신호 펄스 — 실 한 가닥을 혜성처럼 흐르고, 가끔 연쇄한다 ── */
    const pointAt = (pts: number[], idx: number) => {
      const n = pts.length / 2 - 1;
      const i = Math.max(0, Math.min(n, idx));
      const i0 = Math.floor(i);
      const f = i - i0;
      const i1 = Math.min(n, i0 + 1);
      return [
        pts[i0 * 2] * (1 - f) + pts[i1 * 2] * f,
        pts[i0 * 2 + 1] * (1 - f) + pts[i1 * 2 + 1] * f,
      ];
    };

    const spawnPulse = (now: number): boolean => {
      /* 풍화로 사라진 옛 실 위를 달리지 않게 — 갓 기록된 실만 */
      const fresh = strands.filter((s) => now - s.born < 22000);
      if (!fresh.length) return false;
      const s = fresh[Math.floor(Math.random() * fresh.length)];
      pulses.push({ pts: s.pts, t: 0, dur: ((s.pts.length / 2) * 4) / 0.13 });
      return true;
    };

    const drawOverlay = () => {
      octx.clearRect(0, 0, W, H);
      octx.globalCompositeOperation = "lighter";

      /* 생장 첨단 — 진행 방향 빛꼬리를 단 빛점 */
      for (const tip of tips) {
        const col = tip.mint ? MINT : PAPER;
        octx.strokeStyle = `rgba(${col}, 0.32)`;
        octx.lineWidth = 1.1;
        octx.beginPath();
        octx.moveTo(tip.x - Math.cos(tip.a) * 8, tip.y - Math.sin(tip.a) * 8);
        octx.lineTo(tip.x, tip.y);
        octx.stroke();
        octx.fillStyle = `rgba(${col}, 0.1)`;
        octx.beginPath();
        octx.arc(tip.x, tip.y, 3.2, 0, 6.29);
        octx.fill();
        octx.fillStyle = `rgba(${col}, 0.55)`;
        octx.beginPath();
        octx.arc(tip.x, tip.y, 1.15, 0, 6.29);
        octx.fill();
      }

      /* 신호 — 부드러운 빛줄기 + 머리 글로우 */
      for (const pu of pulses) {
        const n = pu.pts.length / 2 - 1;
        const head = pu.t * n;
        for (let k = 0; k < 14; k++) {
          const [x1, y1] = pointAt(pu.pts, head - k * 1.1);
          const [x2, y2] = pointAt(pu.pts, head - (k + 1) * 1.1);
          const f = 1 - k / 14;
          octx.strokeStyle = `rgba(${MINT}, ${0.45 * f * f})`;
          octx.lineWidth = 1.5 * f + 0.4;
          octx.beginPath();
          octx.moveTo(x1, y1);
          octx.lineTo(x2, y2);
          octx.stroke();
        }
        const [hx, hy] = pointAt(pu.pts, head);
        octx.fillStyle = `rgba(${MINT}, 0.6)`;
        octx.beginPath();
        octx.arc(hx, hy, 1.6, 0, 6.29);
        octx.fill();
        octx.fillStyle = `rgba(${MINT}, 0.09)`;
        octx.beginPath();
        octx.arc(hx, hy, 7, 0, 6.29);
        octx.fill();
      }
      octx.globalCompositeOperation = "source-over";
    };

    let last = 0;
    let tipAcc = 0;
    const frame = (now: number) => {
      if (!running || destroyed) return;
      const dt = last ? Math.min(now - last, 80) : 16;
      last = now;

      /* 생장 물결 — 속도·분기가 함께 출렁인다 */
      surge = 1 + 0.6 * Math.sin((now / SURGE_MS) * Math.PI * 2);

      tipAcc += dt * TIP_RATE * surge;
      let rounds = Math.min(Math.floor(tipAcc), 6);
      tipAcc -= Math.floor(tipAcc);
      while (rounds-- > 0) simRound(now);

      /* 풍화 — 오래된 조직이 서서히 사라져 순환이 생긴다 */
      if (now - lastErode >= ERODE_MS) {
        lastErode = now - lastErode > 10000 ? now : now - ((now - lastErode) % ERODE_MS);
        bctx.globalCompositeOperation = "destination-out";
        bctx.fillStyle = `rgba(0, 0, 0, ${ERODE_A})`;
        bctx.fillRect(0, 0, W, H);
        bctx.globalCompositeOperation = "source-over";
      }

      /* 포자 점화 — 새 자리에서 실 다발이 터진다. 잦고 크게 */
      if (now >= nextSporeAt) {
        nextSporeAt = now + 5000 + Math.random() * 4000;
        const [sx, sy] = randomSporePos();
        igniteSpore(sx, sy, 6 + Math.floor(Math.random() * 4));
      }

      /* 신호 발화·연쇄 — 잦고, 끝나면 절반은 다음 신호로 번진다 */
      if (now >= nextPulseAt && pulses.length < 6) {
        nextPulseAt = now + (spawnPulse(now) ? 700 + Math.random() * 1100 : 1200);
      }
      let finished = 0;
      for (const pu of pulses) pu.t += dt / pu.dur;
      pulses = pulses.filter((pu) => {
        if (pu.t >= 1) {
          finished++;
          return false;
        }
        return true;
      });
      while (finished-- > 0) {
        if (Math.random() < 0.5 && pulses.length < 6) {
          spawnPulse(now);
          if (Math.random() < 0.5 && pulses.length < 6) spawnPulse(now);
        }
      }
      strands = strands.filter((s) => now - s.born < 25000);

      drawOverlay();
      raf = requestAnimationFrame(frame);
    };

    const pause = () => {
      running = false;
      last = 0;
      cancelAnimationFrame(raf);
    };
    const maybeRun = () => {
      if (destroyed || !visible || W === 0) return;
      if (!started) {
        started = true;
        if (reduced) {
          syncBuild(1);
          return;
        }
      }
      if (!running && !reduced) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) maybeRun();
          else pause();
        }
      },
      { threshold: 0.12 },
    );

    /* 리사이즈: 새 크기로 재시작 — 이미 보던 중이면 프리워밍해 몸을 만든다 */
    let rsTimer = 0;
    const ro = new ResizeObserver(() => {
      const w = wrap.getBoundingClientRect().width;
      if (Math.abs(w - W) < 9) return;
      window.clearTimeout(rsTimer);
      rsTimer = window.setTimeout(() => {
        if (destroyed || !setup()) return;
        if (started) syncBuild(reduced ? 1 : 0.5);
      }, 250);
    });

    const onVis = () => {
      if (document.hidden) pause();
      else maybeRun();
    };

    setup();
    io.observe(wrap);
    ro.observe(wrap);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      destroyed = true;
      pause();
      window.clearTimeout(rsTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section id="coena" className="sheet bg-ink text-paper">
      <div className="wrap py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="t-label text-mint/80">{c.eyebrow}</p>
            <h2 className="t-display mt-4">{c.title}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/78">{c.body}</p>

            <ul className="mt-8 space-y-3">
              {c.features.map((f) => (
                <li
                  key={f.tag}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                >
                  <code className="font-mono text-[13px] font-medium text-mint">
                    {f.tag}
                  </code>
                  <span className="text-[15px] leading-relaxed text-paper/72">
                    {f.desc}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 font-mono text-xs tracking-[0.08em] text-paper/50">
              {c.status}
            </p>

            {(PROTOTYPE_URL || NOTES_URL) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {PROTOTYPE_URL && (
                  <a
                    href={PROTOTYPE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPaper}
                  >
                    {c.ctaPrototype}
                  </a>
                )}
                {NOTES_URL && (
                  <a href={NOTES_URL} className={btnGhostDark}>
                    {c.ctaNotes}
                  </a>
                )}
              </div>
            )}
          </Reveal>

          {/* 히어로 — 순환하는 균사 생태. 이 섹션의 유일한 볼드 요소 */}
          <Reveal delay={140}>
            <div
              ref={wrapRef}
              className="cn-hero mx-auto w-full max-w-[420px] lg:max-w-none"
            >
              <p className="sr-only">{c.srHero}</p>
              <canvas ref={atmosRef} aria-hidden="true" />
              <canvas ref={baseRef} aria-hidden="true" />
              <canvas ref={overRef} aria-hidden="true" />
            </div>

            <style>{`
              .cn-hero {
                position: relative;
                aspect-ratio: 1;
              }
              .cn-hero canvas {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                display: block;
              }
              @media (prefers-reduced-motion: no-preference) {
                .cn-hero {
                  animation: cnBreath 11s ease-in-out infinite;
                }
                @keyframes cnBreath {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.012); }
                }
              }
            `}</style>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
