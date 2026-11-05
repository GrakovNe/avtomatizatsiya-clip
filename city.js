'use strict';
// Moscow backdrop: sky, far skyline, Moscow City towers, panel blocks, street.
const GY = 505;                       // top of the sidewalk
function hexRgb(c) { const n = parseInt(c.slice(1), 16); return c.length === 4 ? [((n >> 8) & 15) * 17, ((n >> 4) & 15) * 17, (n & 15) * 17] : [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function dk(c, f = 0.75) { const [r, g, b] = hexRgb(c); return `rgb(${r * f | 0},${g * f | 0},${b * f | 0})`; }
function lt(c, f = 0.3) { const [r, g, b] = hexRgb(c); return `rgb(${r + (255 - r) * f | 0},${g + (255 - g) * f | 0},${b + (255 - b) * f | 0})`; }
const tile = (scroll, par, period) => -(((scroll * par) % period) + period) % period;

const SKY = {
  day: ['#34b3c6', '#fdeab5', '#ffd75e', '#ff9d2e', 'rgba(255,255,255,.13)'],
  sunset: ['#ff6a3d', '#ffd36b', '#fff1a8', '#ff3d6e', 'rgba(255,255,255,.16)'],
  night: ['#231a4a', '#7a3b8f', '#fff6c9', '#ffd75e', 'rgba(255,255,255,.07)'],
  toxic: ['#b7e23a', '#fff7a8', '#ff5b8a', '#ff2e63', 'rgba(255,255,255,.18)'],
};
function sky(t, mode = 'day', sx = 990, sy = 170, sr = 78) {
  const c = SKY[mode]; const g = ctx.createLinearGradient(0, 0, 0, GY); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
  ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 500);
  burst(sx, sy, 1700, 18, t * 0.25, c[4], 'rgba(255,255,255,0)');
  circ(sx, sy, sr + 16 + pulse(t, 2) * 10, c[3], 0); circ(sx, sy, sr, c[2], 5);
  if (mode === 'night') for (let i = 0; i < 50; i++) star(hash(i) * W, hash(i + 50) * GY * 0.8, 5 + hash(i * 3) * 5 * (0.6 + pulse(t + hash(i), 2)), 2, 4, '#fff6c9', 0, i);
}
function cloud(x, y, s = 1) {
  const b = [[-60, 0, 34], [-22, -22, 40], [24, -14, 36], [62, 2, 30], [0, 6, 38]];
  ctx.beginPath(); for (const [bx, by, r] of b) { ctx.moveTo(x + (bx + r) * s, y + by * s); ctx.arc(x + bx * s, y + by * s, r * s, 0, TAU); }
  ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.stroke(); ctx.fillStyle = '#fffdf4'; ctx.fill();
}
function clouds(t, scroll = 0) {
  for (let i = 0; i < 5; i++) { const x = ((hash(i * 7.3) * 1700 + t * (8 + i * 5) - scroll * 0.05) % 1700 + 1700) % 1700 - 200; cloud(x, 70 + hash(i * 2.9) * 170, 0.7 + hash(i) * 0.6); }
}

function farSkyline(scroll, t, col = '#6fa6b8') {
  const base = GY + 10, P = 2200, ox = tile(scroll, 0.08, P);
  for (let k = 0; k < 2; k++) at(ox + k * P, base, 0, 1, undefined, () => {
    // Ostankino tower
    poly([[300, 0], [322, -150], [330, -330], [334, -520], [338, -330], [346, -150], [368, 0]], col, 0);
    rect(318, -372, 32, 26, col, 0, 6); for (let i = 0; i < 4; i++) rect(331, -500 + i * 26, 6, 13, i % 2 ? '#fff' : '#e8463a', 0);
    // CHP chimneys with smoke
    [[1600, 300], [1660, 260], [1960, 330]].forEach(([x, h], i) => { poly([[x, 0], [x + 6, -h], [x + 26, -h], [x + 32, 0]], col, 0);
      for (let b = 0; b < 3; b++) rect(x + 5, -h + 14 + b * 40, 22, 16, b % 2 ? '#fff' : '#e8463a', 0);
      for (let p = 0; p < 6; p++) { const f = ((t * 0.25 + p / 6 + i * 0.3) % 1); circ(x + 16 + f * 150, -h - 10 - f * 90 + Math.sin(f * 9 + i) * 10, 14 + f * 40, `rgba(255,255,255,${0.75 * (1 - f)})`, 0); } });
  });
}

// Moscow City towers: the mid layer behind the panel blocks
function glassTower(pts, col, hi = 'rgba(255,255,255,.30)') {
  poly(pts, col, 3.5); ctx.save(); Pth(pts); ctx.clip();
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  ctx.fillStyle = hi; ctx.fillRect(x0 + (x1 - x0) * 0.16, y0, (x1 - x0) * 0.2, y1 - y0);
  ctx.strokeStyle = 'rgba(20,30,60,.28)'; ctx.lineWidth = 2; ctx.beginPath(); for (let y = y1 - 14; y > y0; y -= 17) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
  ctx.restore(); Pth(pts); paint(null, 3.5);
}
function moscowCity(scroll, t, par = 0.2, base = GY + 6) {
  const P = 1900, ox = tile(scroll, par, P), b = base;
  for (let k = 0; k < 2; k++) at(ox + k * P, 0, 0, 1, undefined, () => {
    rect(-10, b - 64, P + 20, 80, '#587890', 0); rect(-10, b - 64, P + 20, 12, '#7fa3ba', 0); line([[0, b - 64], [P, b - 64]], 3);
    ctx.fillStyle = 'rgba(255,255,255,.28)'; for (let x = 8; x < P; x += 26) ctx.fillRect(x, b - 40, 14, 22);
    const cluster = (x) => {
      glassTower([[x + 250, b], [x + 250, b - 300], [x + 290, b - 340], [x + 330, b - 300], [x + 330, b]], '#7fb9d6');                          // Imperia
      glassTower([[x - 10, b], [x - 4, b - 250], [x + 66, b - 282], [x + 72, b]], '#93c9e0');                                                       // OKO low
      { const pts = [], n = 9, w = 78, h = 400; for (let i = 0; i <= n; i++) pts.push([x + 96 + Math.sin(i / n * Math.PI * 1.1) * 26, b - h * i / n]);     // Evolution (twisted)
        for (let i = n; i >= 0; i--) pts.push([x + 96 + w + Math.sin(i / n * Math.PI * 1.1 + 0.9) * 26, b - h * i / n]); glassTower(pts, '#a8dcec'); }
      glassTower([[x + 196, b], [x + 204, b - 520], [x + 236, b - 560], [x + 268, b - 470], [x + 276, b]], '#5fa3c7');                               // Federation East
      line([[x + 236, b - 560], [x + 236, b - 610]], 4);
      glassTower([[x + 352, b], [x + 352, b - 360], [x + 370, b - 384], [x + 388, b - 430], [x + 406, b - 384], [x + 424, b - 360], [x + 424, b]], '#d48a3a', 'rgba(255,255,255,.22)');   // Mercury
      glassTower([[x + 444, b], [x + 452, b - 330], [x + 500, b - 300], [x + 506, b]], '#86bfd9');                                                   // Federation West
    };
    cluster(180); cluster(1080);
  });
}
const BLOCKS = [   // x, width, floors, palette index
  [0, 330, 12, 0], [350, 250, 16, 1], [620, 380, 9, 2], [1230, 300, 14, 3], [1550, 420, 10, 0], [1990, 260, 17, 2],
];
const BCOL = [['#d8cfbd', '#c2553f'], ['#c5d3d8', '#3f7fa6'], ['#e3c7b3', '#5a8f5a'], ['#d0d6b4', '#c98a2b']];
function panelBlock(x, w, floors, pal, t, o, id) {
  const [wallC, accC] = BCOL[pal], fh = 27, h = floors * fh + 34, top = GY - h, cols = Math.floor((w - 16) / 34);
  const jump = o.party ? -bob(t, hash(id) * 0.5) * 16 : 0;
  at(x, jump, 0, 1, undefined, () => {
    rect(0, top, w, h, wallC, 4); rect(-6, top - 12, w + 12, 16, dk(wallC, 0.8), 4);
    rect(w * 0.42, top, 26, h, accC, 0); ctx.globalAlpha = 0.5; rect(w * 0.42 + 26, top, 8, h, lt(accC, 0.5), 0); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(0,0,0,.16)'; ctx.lineWidth = 2; ctx.beginPath();
    for (let f = 1; f < floors; f++) { ctx.moveTo(2, top + 20 + f * fh); ctx.lineTo(w - 2, top + 20 + f * fh); } ctx.stroke();
    const pad = (w - cols * 34) / 2;
    for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
      const hh = hash(id * 91 + f * 13 + c * 7), wx = pad + c * 34 + 6, wy = top + 26 + f * fh;
      let col = hh > 0.72 ? '#ffe27a' : hh > 0.45 ? '#7fa9bd' : '#5d8296';
      if (o.party) col = pick(['#ff3d6e', '#ffe27a', '#35e0d0', '#fff', '#ff9d2e'], id + f * 3 + c * 5 + Math.floor(beatF(t)));
      if (o.tv) col = (Math.floor(beatF(t) * 2) + f + c) % 3 ? '#20262e' : '#f33';
      rect(wx, wy, 22, 17, col, 2);
      if (!o.tv && !o.party && hh < 0.18) { rect(wx - 3, wy + 13, 28, 9, dk(wallC, 0.7), 2); }           // balcony
      if (!o.tv && !o.party && hh > 0.9) { rect(wx + 4, wy + 17, 14, 7, '#eee', 2); }                     // AC box
      if (o.tv && (f + c) % 3 === 0) circ(wx + 5, wy + 5, 2.5, '#fff', 0);
    }
    for (let i = 0; i < 4; i++) { const ax = 20 + hash(id + i) * (w - 40); line([[ax, top - 12], [ax, top - 40 - hash(id * 3 + i) * 30]], 3); line([[ax - 9, top - 34], [ax + 9, top - 34]], 3); }
    rect(w * 0.42 - 16, GY - 44, 58, 44, dk(wallC, 0.55), 3); rect(w * 0.42 - 24, GY - 52, 74, 10, accC, 3);
  });
}
function panelki(scroll, t, o = {}, par = 0.5) {
  const P = 2330, ox = tile(scroll, par, P);
  for (let k = 0; k < 2; k++) BLOCKS.forEach(([x, w, f, p], i) => { const X = ox + k * P + x; if (X + w > -40 && X < W + 40) panelBlock(X, w, f, p, t, o, i + 1); });
}

function street(scroll, t, o = {}) {
  const sw = 96;   // sidewalk depth
  ctx.fillStyle = '#cfc8bb'; ctx.fillRect(-300, GY, W + 600, sw);
  const ox = tile(scroll, 1, 56);
  ctx.strokeStyle = 'rgba(0,0,0,.16)'; ctx.lineWidth = 2; ctx.beginPath();
  for (let x = ox - 112; x < W + 300; x += 56) { ctx.moveTo(x, GY); ctx.lineTo(x - 60, GY + sw); }
  for (let y = 24; y < sw; y += 24) { ctx.moveTo(-300, GY + y); ctx.lineTo(W + 300, GY + y); } ctx.stroke();
  line([[-300, GY], [W + 300, GY]], 4);
  const ky = GY + sw; const kx = tile(scroll, 1, 80);
  for (let x = kx - 160; x < W + 300; x += 80) { rect(x, ky, 40, 14, '#f4c531', 0); rect(x + 40, ky, 40, 14, '#2e7d5c', 0); }
  line([[-300, ky], [W + 300, ky]], 4); line([[-300, ky + 14], [W + 300, ky + 14]], 4);
  ctx.fillStyle = '#4b4753'; ctx.fillRect(-300, ky + 14, W + 600, H - ky + 300);
  const dx = tile(scroll, 1.25, 180);
  for (let x = dx - 180; x < W + 300; x += 180) rect(x, ky + 62, 100, 10, '#e9e4d6', 0);
}
function streetProps(scroll, t, o = {}) {
  const P = 1900, ox = tile(scroll, 1, P);
  for (let k = 0; k < 2; k++) at(ox + k * P, GY, 0, 1, undefined, () => {
    for (const x of [140, 760, 1380]) { line([[x, 0], [x, -210], [x + 46, -224]], 7); rect(x + 34, -232, 44, 14, '#ffe27a', 3, 6); }
    // shawarma kiosk
    rect(430, -150, 210, 150, '#f6ead2', 4, 0, INK, true); rect(420, -176, 230, 34, '#e8463a', 4); text('ШАУРМА', 535, -158, 27, { fill: '#fff6c9', lw: 5 });
    rect(450, -116, 110, 62, '#35464f', 4); rect(580, -116, 42, 116, '#8a5a3c', 4);
    at(505, -84, Math.sin(t * 4) * 0.08, 1, undefined, () => { rect(-9, -34, 18, 62, '#b56b3b', 3, 8); line([[0, -40], [0, 32]], 3); });
    // bus stop
    rect(1560, -140, 190, 10, '#3f7fa6', 4); line([[1570, -132], [1570, 0]], 6); line([[1740, -132], [1740, 0]], 6); rect(1586, -120, 138, 76, 'rgba(180,220,235,.55)', 3); rect(1590, -40, 130, 10, '#8a5a3c', 3);
    // bare tree
    line([[1040, 0], [1040, -120], [1010, -180]], 9, '#5b4034'); line([[1040, -120], [1076, -176]], 7, '#5b4034'); line([[1040, -84], [1004, -116]], 5, '#5b4034');
  });
}
// one-call backdrop
function city(t, scroll = 0, o = {}) {
  sky(t, o.sky || 'day', o.sunX, o.sunY, o.sunR);
  if (o.clouds !== false) clouds(t, scroll);
  farSkyline(scroll, t, o.sky === 'night' ? '#3d2f6e' : o.sky === 'sunset' ? '#c9603f' : '#6fa6b8');
  if (o.towers !== false) moscowCity(scroll, t, 0.2);
  if (o.panel !== false) panelki(scroll, t, o);
  street(scroll, t, o);
  if (o.props !== false) streetProps(scroll, t, o);
}
