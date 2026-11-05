'use strict';
// Per-frame compositor: shot, shake, captions, post.
function captionAt(t) {
  for (const [n, s] of TL.lines) { const a = B(n) - 0.12, b = B(n + 1) - 0.06; if (t >= a && t < b) return [s, (t - a) / (b - a)]; }
  return null;
}
function glitchAt(t) {
  let g = 0;
  for (const s of SHOTS) if (s.o.glitchIn && t >= s.a && t < s.a + 0.16) g = Math.max(g, 1 - prog(t - s.a, 0, 0.16));
  if (t >= TL.pauseAt && t < TL.eto) g = Math.max(g, 0.35 + 0.5 * (1 - prog(t - TL.pauseAt, 0, 0.2)));
  if (t > A.dur - 0.45) g = 1;
  return g;
}
function drawFrame(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const s = shotAt(t), lt = t - s.a, d = s.b - s.a;
  const sh = (s.o.shake === undefined ? 1 : s.o.shake) * Math.pow(hitAt(t), 2) * 6;
  const punch = 1 + 0.045 * Math.pow(1 - prog(lt, 0, 0.2), 2) * (s.o.punch === undefined ? 1 : s.o.punch);
  ctx.save(); ctx.translate(W / 2 + jit(1, t * 2, sh), H / 2 + jit(2, t * 2, sh)); ctx.scale(punch + 0.02, punch + 0.02); ctx.rotate(jit(3, t * 2, sh * 0.0015)); ctx.translate(-W / 2, -H / 2);
  s.fn(lt, d, t);
  ctx.restore();
  const c = !window.CAPTIONS || s.o.caption === false ? null : captionAt(t); if (c) caption(c[0], c[1], t);
  post(t, { glitch: glitchAt(t), grain: s.o.grain });
  if (s.o.flash !== false && lt < 0.08) { ctx.fillStyle = `rgba(255,255,255,${0.45 * (1 - lt / 0.08)})`; ctx.fillRect(0, 0, W, H); }
}
