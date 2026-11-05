'use strict';
// Props and compound gags.

function plane(x, y, s, dir, t, o = {}) {
  at(x, y, o.rot || 0, s * dir, s, () => {
    poly([[-236, -14], [-300, -124], [-246, -124], [-168, -24]], '#ff3d6e', 5, INK, true);
    poly([[-250, 4], [-330, -10], [-322, 14], [-236, 26]], '#d9dee0', 4.5);
    Rc(-256, -48, 512, 96, 48); paint('#fbf8ee', 5.5, INK, true);
    ctx.save(); Rc(-256, -48, 512, 96, 48); ctx.clip(); ctx.fillStyle = '#ff3d6e'; ctx.fillRect(-260, 8, 520, 12); ctx.fillStyle = '#3f7fa6'; ctx.fillRect(-260, 22, 520, 6); ctx.restore();
    poly([[198, -32], [240, -14], [232, -2], [190, -6]], '#35464f', 4.5);
    for (let i = 0; i < 11; i++) { circ(-176 + i * 33, -16, 10.5, o.cry === i ? '#e2b185' : '#bfe6f2', 3.5);
      if (o.cry === i) { circ(-180 + i * 33, -18, 2, INK, 0); circ(-172 + i * 33, -18, 2, INK, 0); } }
    poly([[-46, 12], [62, 12], [-14, 98], [-92, 98]], '#d9dee0', 5, INK, true); Rc(-36, 44, 78, 36, 17); paint('#b9c2c7', 4.5); rect(124, -34, 24, 48, null, 3, 6);
  });
}
function phone(x, y, s, rot, drawScreen) {
  at(x, y, rot, s, undefined, () => { Rc(-150, -290, 300, 580, 42); paint('#18222b', 6, INK, true);
    ctx.save(); Rc(-134, -262, 268, 524, 22); ctx.clip(); drawScreen(); ctx.restore(); Rc(-134, -262, 268, 524, 22); paint(null, 3, '#000'); rect(-42, -282, 84, 13, '#000', 0, 6); });
}
const ROUTE = [[-84, 170], [-60, 96], [-96, 30], [-20, -30], [40, -20], [70, -100], [84, -176]];
function routePt(f) { const n = ROUTE.length - 1, x = clamp(f) * n, i = Math.min(n - 1, Math.floor(x)), k = x - i; return [lerp(ROUTE[i][0], ROUTE[i + 1][0], k), lerp(ROUTE[i][1], ROUTE[i + 1][1], k)]; }
function mapScreen(t, f, status = 'В ПУТИ', icon = 'box') {
  ctx.fillStyle = '#efe7d2'; ctx.fillRect(-140, -270, 280, 540);
  line([[-140, 60], [-40, 20], [30, 60], [140, 10]], 34, '#a9dbe8');                              // river
  for (let i = 0; i < 7; i++) line([[-140, -240 + i * 80 + (i % 2) * 20], [140, -220 + i * 80]], 12, '#fff'); for (let i = 0; i < 5; i++) line([[-120 + i * 62, -270], [-100 + i * 58, 270]], 10, '#fff');
  for (let i = 0; i < 9; i++) rect(-126 + (i % 3) * 92 + hash(i) * 20, -210 + Math.floor(i / 3) * 150 + hash(i * 3) * 30, 34, 26, '#d8cfbd', 0, 4);
  ctx.setLineDash([12, 10]); line(ROUTE, 6, '#b8b0a0'); ctx.setLineDash([]);
  const pts = []; for (let k = 0; k <= 40; k++) if (k / 40 <= f) pts.push(routePt(k / 40)); if (pts.length > 1) line(pts, 7, '#e8463a');
  circ(ROUTE[0][0], ROUTE[0][1], 9, '#fff', 4);
  const [bx, by] = ROUTE[ROUTE.length - 1]; at(bx, by - bob(t) * 14, 0, 1, undefined, () => { poly([[0, 0], [-16, -30], [16, -30]], '#e8463a', 3.5); circ(0, -38, 19, '#e8463a', 3.5); circ(0, -38, 7, '#fff', 0); });
  const [px, py] = routePt(f);
  at(px, py - 6 - bob(t, 0.5) * 6, Math.sin(t * 9) * 0.12, 1, undefined, () => { if (icon === 'plane') { poly([[-26, 0], [20, -8], [30, 0], [20, 8]], '#fff', 3.5); poly([[-4, 0], [-16, -22], [-6, -22], [8, -2]], '#fff', 3.5); poly([[-4, 0], [-16, 22], [-6, 22], [8, 2]], '#fff', 3.5); }
    else { rect(-19, -17, 38, 34, '#c99a5b', 3.5, 3); line([[-19, -4], [19, -4]], 5, '#efdca0'); circ(0, -24, 10, '#e2b185', 3); } });
  ctx.fillStyle = '#2f9e6b'; ctx.fillRect(-140, -270, 280, 56); for (let i = 0; i < 3; i++) rect(-112, -252 + i * 9, 30, 4, '#fff', 0);
  rect(-122, 196, 244, 58, '#fff', 3.5, 14); rect(-104, 218, 208 * clamp(f), 14, '#e8463a', 0, 7); rect(-104, 218, 208, 14, null, 3, 7);
}
function stampTool(x, y, s, rot = 0) {
  at(x, y, rot, s, undefined, () => { rect(-44, -190, 88, 150, '#b5764a', 5, 12, INK, true); ell(0, -196, 78, 44, '#8f2a21', 5, 0, INK, true); ell(-18, -210, 30, 12, 'rgba(255,255,255,.25)', 0); rect(-190, -52, 380, 56, '#5b3a22', 5, 10, INK, true); rect(-176, 4, 352, 12, '#d3122a', 4, 4); });
}
function stampMark(x, y, size, rot, txt, alpha = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
  ctx.font = `${size}px ${FONT}`; const w = ctx.measureText(txt).width + size * 0.7, h = size * 1.45;
  ctx.strokeStyle = '#d3122a'; ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.11; Rc(-w / 2, -h / 2, w, h, size * 0.16); ctx.stroke();
  ctx.lineWidth = size * 0.035; Rc(-w / 2 + size * 0.13, -h / 2 + size * 0.13, w - size * 0.26, h - size * 0.26, size * 0.08); ctx.stroke();
  ctx.fillStyle = '#d3122a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, size * 0.04);
  ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = 1; ctx.fillStyle = '#000';     // worn ink
  ctx.restore();
}
function impact(x, y, r, t, label, c1 = '#ffe94a', c2 = '#ff3d6e') {
  star(x, y, r * 1.25, r * 0.7, 13, c2, 6, t * 2, INK, true); star(x, y, r, r * 0.55, 13, c1, 5, -t * 3);
  if (label) text(label, x, y, r * 0.62, { fill: '#fff', rot: -0.12 + Math.sin(t * 20) * 0.04 });
}
// the kick: k 0..1 (wind-up, strike, pain). Returns nothing; draws the courier.
function kicker(x, y, s, k, t, o = {}) {
  const wu = sm(prog(k, 0, 0.36)), st = sm(prog(k, 0.36, 0.48)), pn = sm(prog(k, 0.56, 0.72));
  const legA = lerp(lerp(0.1, -1.0, wu), 1.55, st) * (1 - pn) + 1.2 * pn, kneeA = lerp(lerp(0, 1.5, wu), 0.0, st) * (1 - pn) + 1.9 * pn;
  courier(Object.assign({ x: x + (st - pn * 0.6) * 26 * s, y, s, t, lean: lerp(lerp(0, -0.32, wu), 0.12, st) * (1 - pn) - 0.1 * pn, legs: [legA, -0.12], knees: [kneeA, 0], legFront: true,
    armF: [lerp(-0.4, -2.2, wu) * (1 - st) + 0.9 * st + pn * 0.6, lerp(-0.3, -0.9, wu) + pn * 0.8], armB: [lerp(0.4, 1.7, wu) * (1 - st) - 0.8 * st, 0.4],
    eyes: pn > 0.3 ? 'wide' : 'angry', mouth: pn > 0.3 ? 'cry' : 'yell', hop: pn * bob(t * 2) * 34 * s, tilt: pn * Math.sin(t * 18) * 0.15 }, o));
  if (pn > 0.2) { const fx = x + 92 * s, fy = y - 96 * s - pn * bob(t * 2) * 34 * s; circ(fx, fy, (20 + Math.sin(t * 22) * 9) * s * pn, 'rgba(255,40,60,.75)', 4); for (let i = 0; i < 3; i++) star(fx + Math.cos(t * 6 + i * 2.1) * 52 * s, fy + Math.sin(t * 6 + i * 2.1) * 34 * s - 20 * s, 11 * s, 5 * s, 5, '#ffe94a', 2.5, t * 4); }
}
// mini kick scene for screens; box 640x360, tt = loop phase 0..1
function kickScene(tt, t, rec = true) {
  ctx.fillStyle = '#9fd6e0'; ctx.fillRect(0, 0, 640, 360); ctx.fillStyle = '#d8cfbd'; ctx.fillRect(60, 60, 190, 240); ctx.fillStyle = '#c5d3d8'; ctx.fillRect(290, 20, 230, 280);
  ctx.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) { ctx.fillRect(78 + j * 34, 78 + i * 36, 20, 18); ctx.fillRect(306 + j * 42, 40 + i * 40, 24, 20); }
  ctx.fillStyle = '#cfc8bb'; ctx.fillRect(0, 286, 640, 74); line([[0, 286], [640, 286]], 4);
  const sh = tt > 0.42 && tt < 0.52 ? Math.sin(tt * 400) * 5 : 0;
  robot({ x: 430 + sh, y: 336, s: 0.92, dir: -1, t, eyes: tt > 0.45 ? 'smug' : 'norm', roll: 0 });
  kicker(250, 336, 0.9, tt, t);
  if (tt > 0.42 && tt < 0.62) impact(350, 286, 60 * easeBack(prog(tt, 0.42, 0.5)), t, 'БАЦ!');
  if (rec) { circ(42, 40, 12, Math.floor(t * 2.5) % 2 ? '#ff2e3d' : '#801', 0); text('REC', 62, 41, 28, { align: 'left', font: '"Courier New", monospace', weight: 'bold', fill: '#fff', lw: 5 }); }
}
function screenBox(x, y, w, h, drawFn, frame = '#18222b', lw = 8) {
  rect(x - lw, y - lw, w + lw * 2, h + lw * 2, frame, 5, 10, INK, true);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.translate(x, y); ctx.scale(w / 640, h / 360); drawFn(); ctx.restore();
}
function scrollPaper(x, y, len, rot, t, dir = 1) {
  at(x, y, rot, dir, 1, () => { if (len > 4) { rect(0, -84, len, 168, '#fff6dc', 5, 0, INK, true);
      ctx.save(); ctx.beginPath(); ctx.rect(0, -84, len, 168); ctx.clip();
      for (let k = 0; k * 470 < len + 470; k++) { text('ПАТЕНТ', 190 + k * 470, -22, 96, { fill: '#2c3357', lw: 0, sx: dir }); for (let i = 0; i < 3; i++) line([[40 + k * 470, 38 + i * 15], [330 + k * 470, 38 + i * 15]], 4, '#b9b09a');
        star(400 + k * 470, 30, 36, 28, 14, '#e8463a', 4, t); circ(400 + k * 470, 30, 17, '#c9261b', 0); }
      ctx.restore(); }
    ell(len, 0, 26, 92, '#efe2bd', 5); ell(len, 0, 13, 56, '#fff6dc', 3); ell(len, 0, 4, 20, '#cdbf99', 2); });
}
function parcel(x, y, s, t, o = {}) {       // courier boxed up; tape 0..1, sticker 0..1
  const tp = o.tape || 0, hop = (o.hop || 0);
  at(x, y - hop, o.rot || 0, s, undefined, () => {
    poly([[-150, -210], [-196, -262], [-120, -262], [-96, -210]], '#b3854a', 5); poly([[150, -210], [196, -262], [120, -262], [96, -210]], '#b3854a', 5);
    courier({ x: 0, y: -84, s: 1.25, t, eyes: o.eyes || 'wide', mouth: o.mouth || 'frown', armF: [0.2, 0], armB: [-0.2, 0], box: null, look: o.look || [0, 2], tilt: Math.sin(t * 7) * 0.06 });
    rect(-150, -210, 300, 214, '#c99a5b', 5.5, 6, INK, true); line([[-150, -150], [150, -150]], 3, '#a87a40');
    for (let i = 0; i < 3; i++) { const f = clamp(tp * 3 - i); if (f > 0) rect(-158, -196 + i * 62, 316 * f, 30, '#efdca0', 4, 4); }
    if (tp > 0.01) rect(-22, -210, 44, 214 * clamp(tp * 1.3), 'rgba(239,220,160,.9)', 4);
    for (let i = 0; i < 16; i++) rect(-128 + i * 7, -44, (i * 7 % 3) + 2, 34, INK, 0);
    const st = o.sticker || 0; if (st > 0) at(62, -92, -0.22, easeBack(st), undefined, () => { rect(-78, -30, 156, 60, '#e8463a', 4.5, 6); text('ХРУПКОЕ', 0, 2, 33, { fill: '#fff', lw: 0 }); });
  });
}
function conveyor(x, y, w, t, dir = 1) {
  rect(x, y, w, 40, '#3a3340', 5, 20); const off = ((t * 260 * dir) % 60 + 60) % 60;
  ctx.save(); Rc(x, y, w, 40, 20); ctx.clip(); for (let i = -1; i * 60 < w + 60; i++) poly([[x + i * 60 + off, y + 8], [x + i * 60 + off + 22, y + 20], [x + i * 60 + off, y + 32]], '#55505c', 0); ctx.restore();
  for (let i = 0; i * 90 < w; i++) at(x + 30 + i * 90, y + 62, t * 6 * dir, 1, undefined, () => { circ(0, 0, 20, '#b9c2c7', 5); line([[-14, 0], [14, 0]], 4); });
}
function popcorn(x, y, s, t) {
  at(x, y, 0, s, undefined, () => { for (let i = 0; i < 9; i++) circ(-40 + i * 10, -112 - hash(i) * 18 - bob(t, hash(i)) * 14, 13, '#fff6c9', 3.5);
    poly([[-52, -104], [52, -104], [36, 0], [-36, 0]], '#fff', 5, INK, true); for (let i = 0; i < 4; i++) poly([[-52 + i * 26, -104], [-39 + i * 26, -104], [-27 + i * 18, 0], [-36 + i * 18, 0]], '#e8463a', 0);
    poly([[-52, -104], [52, -104], [36, 0], [-36, 0]], null, 5); });
}
function judgeBench(x, y, s, t, o = {}) {
  at(x, y, 0, s, undefined, () => {
    const hit = pulse(t, 4);
    dude({ x: 0, y: -90, s: 1.15, t, robe: true, top: '#18151c', skin: '#f0c9a4', hat: 'bun', hatC: '#c9ccd2', jabot: true, eyes: o.eyes || 'happy', mouth: o.mouth || 'grin', hop: bob(t) * 8,
      armF: [1.1 - hit * 0.9, 0.9], armB: [-0.9, -1.4], handF: () => { line([[0, -8], [0, 64]], 8, '#8a5a3c'); rect(-22, 58, 44, 28, '#5b3a22', 4, 6); } });
    rect(-230, -150, 460, 160, '#8a5a3c', 5.5, 8, INK, true); rect(-250, -168, 500, 26, '#b5764a', 5, 6); rect(-190, -116, 380, 96, '#74482f', 4, 6); star(0, -68, 34, 15, 8, '#ffd23e', 4, 0);
    popcorn(-170, -168, 0.62, t);
  });
}
function bubble(x, y, w, h, fn) {
  circ(x - w * 0.42, y + h * 0.72, 13, '#fff', 4.5); circ(x - w * 0.52, y + h * 0.95, 8, '#fff', 4);
  ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12, bx = x + Math.cos(a) * w * 0.42, by = y + Math.sin(a) * h * 0.4, r = Math.min(w, h) * 0.24; ctx.moveTo(bx + r, by); ctx.arc(bx, by, r, 0, TAU); }
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fill(); ell(x, y, w * 0.44, h * 0.42, '#fff', 0);
  ctx.save(); El(x, y, w * 0.56, h * 0.56); ctx.clip(); fn(); ctx.restore();
}
function nameTag(x, y, title, sub, f, col = '#ffe94a', align = 1) {
  const k = easeBack(f); if (f <= 0) return;
  at(x + (1 - k) * 500 * align, y, -0.05 * align, 1, undefined, () => {
    ctx.font = `92px ${FONT}`; const w = Math.max(ctx.measureText(title).width, 260) + 70;
    poly([[-w / 2 - 14, -62], [w / 2 + 22, -74], [w / 2 + 8, 54], [-w / 2 - 26, 62]], INK, 0, INK, true); text(title, 0, -8, 92, { fill: col, lw: 0 });
    if (sub) { ctx.font = `40px ${FONT}`; const w2 = ctx.measureText(sub).width + 44; poly([[-w2 / 2, 56], [w2 / 2 + 8, 50], [w2 / 2, 110], [-w2 / 2 - 8, 112]], col, 5); text(sub, 0, 82, 40, { fill: INK, lw: 0 }); }
  });
}
// kinetic chant: syllables pop one by one between t0 and t1
function chant(syl, t0, t1, t, o = {}) {
  const size = o.size || 150; ctx.font = `${size}px ${FONT}`;
  const ws = syl.map((s) => ctx.measureText(s).width + size * 0.10), tot = ws.reduce((a, b) => a + b, 0), sc = Math.min(1, (o.maxW || 1180) / tot);
  let x = W / 2 - tot * sc / 2; const cols = o.cols || ['#ffe94a', '#ff3d6e', '#39f0e0', '#fff'];
  syl.forEach((s, i) => { const ti = t0 + (t1 - t0) * 0.78 * i / syl.length, f = prog(t, ti, ti + 0.16); const cx = x + ws[i] * sc / 2; x += ws[i] * sc;
    if (o.always) { const p = t >= ti ? Math.pow(1 - prog(t, ti, ti + 0.3), 2) : 0; const y0 = (o.y || H / 2) + (i % 2 ? 18 : -18) - p * 26;
      text(s, cx, y0, size * sc * (1 + p * 0.3), { fill: cols[i % cols.length], rot: (i % 2 ? 1 : -1) * 0.07 + Math.sin(t * 9 + i) * 0.02, lw: size * sc * 0.16, shadow: 'rgba(0,0,0,.45)' }); return; }
    if (f <= 0) return; const k = easeBack(f), out = 1 - easeIn(prog(t, t1 - 0.12, t1 + 0.05));
    const y = (o.y || H / 2) + (i % 2 ? 18 : -18) - bob(t, i * 0.25) * 16;
    text(s, cx, y, size * sc * (0.6 + 0.4 * k) * (0.75 + 0.25 * out) * (1 + pulse(t, 3) * 0.06), { fill: cols[i % cols.length], rot: (i % 2 ? 1 : -1) * 0.07 + Math.sin(t * 9 + i) * 0.03, lw: size * sc * 0.16, shadow: 'rgba(0,0,0,.45)' }); });
}
function caption(s, f, t) {
  if (!s || f <= 0) return; const k = easeBack(prog(f, 0, 0.12)), out = 1 - prog(f, 0.93, 1);
  ctx.save(); ctx.globalAlpha = clamp(out * 1.5);
  text(s, W / 2, 654 + (1 - k) * 40, 54 * (0.8 + 0.2 * k), { fill: '#ffe94a', lw: 11, rot: Math.sin(t * 3) * 0.008, shadow: 'rgba(0,0,0,.5)' }); ctx.restore();
}
