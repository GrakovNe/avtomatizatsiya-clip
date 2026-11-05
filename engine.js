'use strict';
// Core helpers: math, beat clock, cut-out drawing primitives, post effects.
const W = 1280, H = 720, TAU = Math.PI * 2, INK = '#1a1317';
const A = window.AUDIO;
const BEAT = 60 / A.bpm, BAR = BEAT * 4;
let ctx = null;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, f) => a + (b - a) * f;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const sm = (f) => { f = clamp(f); return f * f * (3 - 2 * f); };
const easeIn = (f) => { f = clamp(f); return f * f * f; };
const easeOut = (f) => { f = clamp(f); return 1 - Math.pow(1 - f, 3); };
const easeBack = (f) => { f = clamp(f); const c = 2.2; return 1 + (c + 1) * Math.pow(f - 1, 3) + c * Math.pow(f - 1, 2); };
const easeBounce = (f) => { f = clamp(f); const n = 7.5625, d = 2.75;
  if (f < 1 / d) return n * f * f; if (f < 2 / d) return n * (f -= 1.5 / d) * f + 0.75;
  if (f < 2.5 / d) return n * (f -= 2.25 / d) * f + 0.9375; return n * (f -= 2.625 / d) * f + 0.984375; };
const hash = (n) => { let x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pick = (arr, n) => arr[Math.floor(hash(n) * arr.length) % arr.length];

// --- beat clock -------------------------------------------------------------
const beatF = (t) => (t - A.beat0) / BEAT;
const beatPh = (t) => { const b = beatF(t); return b - Math.floor(b); };
const bob = (t, off = 0) => Math.abs(Math.sin(Math.PI * (beatF(t) + off)));      // 0..1, dips on the beat
const pulse = (t, sharp = 3) => Math.pow(1 - beatPh(t), sharp);                    // 1 on the beat, decays
const upbeat = (t, sharp = 3) => Math.pow(1 - ((beatF(t) + 0.5) % 1 + 1) % 1, sharp); // ska offbeat
const frameAt = (t) => clamp(Math.floor(t * A.fps), 0, A.env.length - 1);
const envAt = (t) => A.env[frameAt(t)];
const hitAt = (t) => Math.max(A.onset[frameAt(t)], A.onset[frameAt(t - 0.04)] * 0.6);
const boil = (t) => Math.floor(t * 12);                                           // stop-motion step
const jit = (seed, t, amp) => (hash(seed * 13.37 + boil(t) * 7.77) - 0.5) * 2 * amp;
const nextBeat = (t) => A.beat0 + Math.ceil((t - A.beat0) / BEAT - 1e-6) * BEAT;   // snap forward to grid
const nearBeat = (t) => A.beat0 + Math.round((t - A.beat0) / BEAT) * BEAT;

// --- drawing primitives -----------------------------------------------------
let SHADOW = true;
function paint(fill, lw = 5, stroke = INK, shadow = false) {
  if (fill) {
    if (shadow && SHADOW) { ctx.save(); ctx.shadowColor = 'rgba(20,10,20,.30)'; const sk = (window.RENDER_SCALE || 1.5) / 1.5; ctx.shadowOffsetX = 7 * sk; ctx.shadowOffsetY = 8 * sk; ctx.shadowBlur = 0; ctx.fillStyle = fill; ctx.fill(); ctx.restore(); }
    else { ctx.fillStyle = fill; ctx.fill(); }
  }
  if (lw) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
const Pth = (pts, close = true) => { ctx.beginPath(); for (let i = 0; i < pts.length; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); if (close) ctx.closePath(); };
const Rc = (x, y, w, h, r = 0) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
const Ci = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); };
const El = (x, y, rx, ry, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, TAU); };
function poly(pts, fill, lw, stroke, shadow) { Pth(pts); paint(fill, lw, stroke, shadow); }
function rect(x, y, w, h, fill, lw, r = 0, stroke, shadow) { Rc(x, y, w, h, r); paint(fill, lw, stroke, shadow); }
function circ(x, y, r, fill, lw, stroke, shadow) { Ci(x, y, r); paint(fill, lw, stroke, shadow); }
function ell(x, y, rx, ry, fill, lw, rot, stroke, shadow) { El(x, y, rx, ry, rot); paint(fill, lw, stroke, shadow); }
function line(pts, w, color = INK) { Pth(pts, false); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
function limb(pts, w, color, ow = 4) { line(pts, w + ow * 2, INK); line(pts, w, color); }   // outlined tube
function at(x, y, rot, sx, sy, fn) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (sx !== undefined && sx !== 1 || sy !== undefined) ctx.scale(sx, sy === undefined ? sx : sy); fn(); ctx.restore(); }
const FONT = 'Impact, "Arial Black", sans-serif';
function text(s, x, y, size, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.sx || o.sy) ctx.scale(o.sx || 1, o.sy || 1);
  ctx.font = `${o.weight || ''} ${size}px ${o.font || FONT}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'middle';
  ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  if (o.shadow) { ctx.fillStyle = o.shadow; ctx.fillText(s, size * 0.07, size * 0.08); ctx.strokeStyle = o.shadow; ctx.lineWidth = (o.lw === undefined ? size * 0.14 : o.lw); ctx.strokeText(s, size * 0.07, size * 0.08); }
  const lw = o.lw === undefined ? size * 0.14 : o.lw;
  if (lw) { ctx.strokeStyle = o.stroke || INK; ctx.lineWidth = lw; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = o.fill || '#fff'; ctx.fillText(s, 0, 0); ctx.restore();
}
function star(x, y, r1, r2, n, fill, lw, rot = 0, stroke, shadow) {
  const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r2 : r1; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  poly(pts, fill, lw, stroke, shadow);
}
function burst(x, y, r, n, t, colA, colB) {      // rotating poster rays
  for (let i = 0; i < n; i++) { const a0 = t + i * TAU / n, a1 = a0 + TAU / n;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a0, a1); ctx.closePath(); ctx.fillStyle = i % 2 ? colA : colB; ctx.fill(); }
}
function halftone(x, y, w, h, step, color, rmax, fx, fy) {   // dots growing toward (fx,fy) in 0..1 box coords
  ctx.fillStyle = color; ctx.beginPath();
  for (let j = 0; j * step < h; j++) for (let i = 0; i * step < w; i++) {
    const px = x + i * step + (j % 2 ? step / 2 : 0), py = y + j * step;
    const d = Math.hypot(i * step / w - fx, j * step / h - fy); const r = rmax * clamp(1 - d * 1.15);
    if (r > 0.4) { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, TAU); }
  } ctx.fill();
}
function speedLines(n, t, color = 'rgba(255,255,255,.55)', dir = 1) {
  ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const y = hash(i * 3.1) * H, sp = 900 + hash(i * 7.7) * 1400, len = 80 + hash(i * 1.3) * 260;
    let x = ((hash(i * 5.3) * (W + 600) - dir * t * sp) % (W + 600) + (W + 600)) % (W + 600) - 300;
    ctx.lineWidth = 2 + hash(i) * 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke(); }
}
function confetti(t, n, colors, seed = 1, shape = 'rect') {
  for (let i = 0; i < n; i++) { const h1 = hash(i * 2.3 + seed), h2 = hash(i * 4.1 + seed), sp = 120 + h2 * 260;
    const y = ((h1 * (H + 200) + t * sp) % (H + 200)) - 100, x = h2 * W + Math.sin(t * 2 + i) * 40;
    at(x, y, t * (2 + h1 * 4) + i, 1, undefined, () => { ctx.scale(1, Math.cos(t * 5 + i * 2));
      if (shape === 'rect') rect(-9, -5, 18, 10, colors[i % colors.length], 2);
      else { rect(-11, -17, 22, 34, '#fffdf2', 2); line([[-6, -9], [6, -9]], 2, '#777'); line([[-6, -3], [6, -3]], 2, '#777'); line([[-6, 3], [3, 3]], 2, '#777'); } }); }
}

// --- post effects -------------------------------------------------------------
let grainTiles = [], scanPat = null, tmpCv = null, tmpCx = null;
function initPost(cv) {
  for (let k = 0; k < 4; k++) { const g = document.createElement('canvas'); g.width = 320; g.height = 180; const gx = g.getContext('2d');
    const im = gx.createImageData(320, 180); for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (Math.random() - 0.5) * 150; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    gx.putImageData(im, 0, 0); grainTiles.push(g); }
  const s = document.createElement('canvas'); s.width = 4; s.height = 4; const sx = s.getContext('2d'); sx.fillStyle = 'rgba(0,0,0,.20)'; sx.fillRect(0, 0, 4, 1.5);
  scanPat = ctx.createPattern(s, 'repeat');
  tmpCv = document.createElement('canvas'); tmpCv.width = cv.width; tmpCv.height = cv.height; tmpCx = tmpCv.getContext('2d');
}
function post(t, o = {}) {
  const k = boil(t * 2);
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = o.grain === undefined ? 0.30 : o.grain;
  ctx.imageSmoothingEnabled = true; ctx.drawImage(grainTiles[k % 4], (hash(k) - 0.5) * 40 - 20, (hash(k + 9) - 0.5) * 40 - 20, W + 40, H + 40); ctx.restore();
  ctx.fillStyle = scanPat; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,0,20,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (o.glitch > 0) vhsGlitch(t, o.glitch);
}
function vhsGlitch(t, amt) {              // tracking bars: shift horizontal slices
  const cv = ctx.canvas, S = cv.width / W;
  tmpCx.setTransform(1, 0, 0, 1, 0, 0); tmpCx.drawImage(cv, 0, 0);
  const n = 3 + Math.floor(amt * 6);
  for (let i = 0; i < n; i++) { const y = hash(i * 9.1 + boil(t * 2)) * H, h = 8 + hash(i * 3.3 + boil(t * 2)) * 70 * amt, dx = (hash(i * 5.7 + boil(t * 2)) - 0.5) * 220 * amt;
    ctx.drawImage(tmpCv, 0, y * S, cv.width, h * S, dx, y, W, h);
    if (i % 2 === 0) { ctx.fillStyle = `rgba(255,255,255,${0.10 + 0.25 * amt})`; ctx.fillRect(0, y + h - 3, W, 2); } }
}
function vhsOSD(label, t, blink = true) {
  if (blink && Math.floor(t * 2) % 2) return;
  text(label, 70, 62, 44, { align: 'left', font: '"Courier New", monospace', weight: 'bold', fill: '#fff', lw: 6, stroke: 'rgba(0,0,0,.7)' });
}
