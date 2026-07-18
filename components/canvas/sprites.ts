/* 캔버스 공용 스프라이트 — 프레임 루프에서 gradient 를 만들지 않도록
   미리 구워 두는 광점/글로우/대형 radial. 부드러운 그라디언트는
   확대해도 손실이 없어 저해상도로 굽고 스케일해 쓴다. */

export function makeGlowSprite(rgb: string): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = 64;
  s.height = 64;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(${rgb}, 0.4)`);
  g.addColorStop(0.4, `rgba(${rgb}, 0.12)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return s;
}

/* 원형 광점 — 큰 별을 사각 점(fillRect) 대신 부드러운 원으로 */
export function makeDotSprite(rgb: string): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = 32;
  s.height = 32;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, `rgba(${rgb}, 1)`);
  g.addColorStop(0.5, `rgba(${rgb}, 0.9)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, 32, 32);
  return s;
}

/* 대형 radial(성운·후광) — innerRatio 까지는 알파 1, 바깥으로 소멸 */
export function makeRadialSprite(rgb: string, innerRatio: number): HTMLCanvasElement {
  const size = 256;
  const half = size / 2;
  const s = document.createElement("canvas");
  s.width = size;
  s.height = size;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(half, half, half * innerRatio, half, half, half);
  g.addColorStop(0, `rgba(${rgb}, 1)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  return s;
}
