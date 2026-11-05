'use strict';
// Verse 2, chorus 2, solo chase.

function radarEye(x, y, rot, s, t, i = 0) {
  at(x, y, rot, s, undefined, () => { line([[0, 0], [0, 260]], 12); line([[0, 0], [0, 260]], 6, '#b9c2c7');
    ell(0, 0, 50, 42, '#e9eef0', 5, 0, INK, true); ell(0, -6, 30, 27, '#18222b', 4); circ(Math.cos(t * 6 + i) * 6, -6 + Math.sin(t * 6 + i) * 5, 12, '#ff2e3d', 0); circ(8, -14, 4, '#fff', 0); });
}
function hud(t, zoomTxt, extra) {
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'square';
  for (const [x, y, sx, sy] of [[60, 50, 1, 1], [W - 60, 50, -1, 1], [60, H - 50, 1, -1], [W - 60, H - 50, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x, y + sy * 70); ctx.lineTo(x, y); ctx.lineTo(x + sx * 70, y); ctx.stroke(); }
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2 - 46, H / 2); ctx.lineTo(W / 2 + 46, H / 2); ctx.moveTo(W / 2, H / 2 - 46); ctx.lineTo(W / 2, H / 2 + 46); ctx.stroke(); Ci(W / 2, H / 2, 70); ctx.stroke();
  circ(104, 104, 15, Math.floor(t * 3) % 2 ? '#ff2e3d' : '#801', 0);
  const f = { align: 'left', font: '"Courier New", monospace', weight: 'bold', fill: '#fff', lw: 6, stroke: 'rgba(0,0,0,.75)' };
  text('REC', 132, 106, 40, f); text(zoomTxt, W - 96, 106, 40, Object.assign({}, f, { align: 'right' })); if (extra) text(extra, 96, H - 92, 36, Object.assign({}, f, { fill: '#39f0e0' }));
}
function notes(x, y, t, n = 9, dirx = 1) {
  for (let i = 0; i < n; i++) { const f = ((t * 0.9 + i / n) % 1); text(i % 2 ? '♪' : '♫', x + dirx * f * 620, y - f * 260 + Math.sin(f * 14 + i) * 46, 60 + f * 60, { fill: pick(['#ffe94a', '#ff3d6e', '#39f0e0', '#fff'], i), rot: Math.sin(t * 5 + i) * 0.4, font: 'Arial, sans-serif', weight: 'bold', lw: 9 }); }
}

// ============================ VERSE 2 ============================================
shot('think', B(29), B(30), (lt, d, t) => {
  posterBg(t, '#2f9e6b', 'rgba(255,255,255,.14)', 'rgba(0,0,0,.10)', 330, 420);
  courier({ x: 330, y: 770, s: 2.4, t, eyes: 'smug', mouth: 'smug', look: [6, -3], armF: [2.35, 1.2], armB: [-0.3, 0.3], box: null, hop: bob(t) * 8, tilt: 0.08 });
  const k = popAt(lt, 0.3);
  at(880, 270, 0, k, undefined, () => bubble(0, 0, 560, 400, () => {
    at(0, 20 + Math.sin(t * 9) * 4, Math.sin(t * 6) * 0.05, 1, undefined, () => { poly([[-110, -84], [-150, -128], [-70, -128], [-40, -84]], '#b3854a', 5); poly([[110, -84], [150, -128], [70, -128], [40, -84]], '#b3854a', 5);
      rect(-110, -84, 220, 170, '#c99a5b', 5, 6); for (const sg of [-1, 1]) { circ(sg * 40, -20, 26, '#fff', 4); circ(sg * 40 - sg * 12, -14, 9, INK, 0); }
      ell(0, 44, 30, 16, '#5a1020', 4); ell(8, 58, 18, 22, '#ef6b73', 4);
      for (let i = 0; i < 3; i++) circ(Math.cos(t * 5 + i * 2.1) * 150, -60 + Math.sin(t * 7 + i * 2.1) * 60, 6, INK, 0); }); }));
});
shot('radars', B(30), B(31), (lt, d, t) => {
  const R = bt(lt) + 0.25, lock = prog(bt(lt), 2.9, 3.2);
  cam(640, 380, 1.06, 0, () => { city(t, 2260);
    courier({ x: 270, y: GY + 90, s: 1.25, t, eyes: 'wide', mouth: 'o', armF: [0.6, 1.4], armB: [-0.4, -1.2], hop: lock ? 0 : bob(t) * 8, tilt: Math.sin(t * 30) * 0.05 * lock });
    robot({ x: 860, y: GY + 100, s: 1.75, dir: -1, t, eyes: 'angry', radars: R, roll: 0 });
    if (lock > 0) { for (let i = 0; i < 3; i++) line([[920 - i * 60, GY - 300 - (i === 1 ? 40 : 0)], [290, GY - 160]], 5, 'rgba(255,46,61,.8)');
      Ci(280, GY - 165, 70 - lock * 16); ctx.strokeStyle = '#ff2e3d'; ctx.lineWidth = 7; ctx.stroke(); line([[180, GY - 165], [380, GY - 165]], 4, '#ff2e3d'); line([[280, GY - 265], [280, GY - 65]], 4, '#ff2e3d'); } });
  for (let i = 0; i < 3; i++) { const f = prog(bt(lt), i - 0.25, i + 0.65); if (f > 0 && f < 1) impact(1060 - i * 70, 150 + (i % 2) * 50, 96 * easeBack(prog(f, 0, 0.3)), t + i, 'ЧПОК!', '#fff', '#ff3d6e'); }
});
shot('zoom', B(31), B(32), (lt, d, t) => {
  const zf = sm(prog(bt(lt), 0, 2.4)), z = 1.3 * Math.pow(7.5, zf), stab = prog(bt(lt), 2.4, 2.6), shk = (1 - stab) * (10 + zf * 26) / z;
  cam(650 + jit(7, t * 3, shk), 322 + jit(8, t * 3, shk), z, jit(9, t * 3, (1 - stab) * 0.03), () => { city(t, 2260);
    courier({ x: 640, y: GY + 90, s: 1.3, t, eyes: 'wide', mouth: 'o', look: [2, 2], armF: [0.3, 0], armB: [-0.3, 0] });
    for (let i = 0; i < 5; i++) { const f = ((t * 1.4 + i / 5) % 1); ell(600 + i * 20 + (i % 2) * 40, 300 + f * 60, 3, 5, '#8fe3ff', 1.2); } });
  wash('rgba(40,255,200,.07)');
  hud(t, '×' + Math.round(Math.pow(64, zf)), null);
});
function hall(t, drawScreen, o = {}) {
  wash('#1d1730'); burst(640, 250, 1300, 14, 0, 'rgba(255,255,255,.035)', 'rgba(0,0,0,0)');
  poly([[1280, 720], [1180, 720], [330, 470], [330, 60], [950, 60]], 'rgba(255,246,201,.10)', 0);
  screenBox(250, 46, 780, 438, drawScreen, '#0c0a12', 12);
  judgeBench(1110, 716, 0.72, t, o.judge || {});
  crowd(t, 560, 2, { dark: true, hands: o.hands, jump: o.jump || 6 });
}
function curtains(open) { for (const sg of [-1, 1]) { const x = sg > 0 ? W / 2 + open * 700 : -80 - open * 700; rect(x, -20, W / 2 + 80, H + 40, '#b01c2e', 6); for (let i = 0; i < 9; i++) line([[x + 30 + i * 78, -20], [x + 30 + i * 78, H + 20]], 10, 'rgba(0,0,0,.22)'); } rect(-20, -20, W + 40, 60, '#7d1220', 6); for (let i = 0; i < 22; i++) circ(30 + i * 58, 40, 20, '#b01c2e', 5); }
shot('curtain', B(32), B(33), (lt, d, t) => {
  hall(t, () => { ctx.fillStyle = '#efe7d2'; ctx.fillRect(0, 0, 640, 360); const n = 3 - Math.min(2, Math.floor(bt(lt) / 1.34)); circ(320, 180, 130, null, 8); line([[320, 180], [320 + Math.cos(bt(lt) * 4.7) * 130, 180 + Math.sin(bt(lt) * 4.7) * 130]], 6); line([[0, 180], [640, 180]], 3); line([[320, 0], [320, 360]], 3); text(String(n), 320, 190, 200, { fill: INK, lw: 0 }); });
  curtains(sm(prog(bt(lt), 0.3, 3.6)));
});
shot('court', B(33), B(34), (lt, d, t) => { hall(t, () => kickScene(clamp(lt / d * 1.05), t)); });
shot('bis', B(34), B(35), (lt, d, t) => {
  const ph = (bt(lt) % 1.34) / 1.34, tt = lerp(0.62, 0.12, easeIn(ph));
  hall(t, () => { kickScene(tt, t); text('◀◀', 560, 320, 54, { fill: '#fff', font: 'Arial, sans-serif', lw: 8 }); for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(0, (hash(i + boil(t * 2)) * 360) | 0, 640, 4); } }, { hands: 'clap', jump: 34, judge: { mouth: 'yell', eyes: 'wide' } });
  [[200, 560, 0], [640, 610, 1.1], [1000, 540, 2.1]].forEach(([x, y, b], i) => { const f = prog(bt(lt), b, b + 1.5); if (f > 0 && f < 1) impact(x, y - f * 60, 96 * easeBack(prog(f, 0, 0.3)), t + i, 'БИС!', '#fff', '#ff3d6e'); });
});
shot('video-stop', B(35), B(36), (lt, d, t) => {
  ctx.save(); ctx.scale(2, 2); kickScene(0.49, B(35), false); ctx.restore(); wash('rgba(255,0,40,.14)');
  ctx.strokeStyle = '#ff2e3d'; ctx.lineWidth = 16; ctx.strokeRect(26, 26, W - 52, H - 52);
  hud(t, '12:47:03', null);
  chant(VI, B(35) - 0.05, B(36) + 0.2, t, { y: 200, size: 150 });
});

// ============================ CHORUS 2 ===========================================
function videoWall(t, n, lt) {
  wash('#0c0a12'); const gw = W / n, gh = H / n;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const ph = ((lt * 0.75 + (i * 3 + j * 5) * 0.11) % 1);
    ctx.save(); ctx.beginPath(); ctx.rect(i * gw + 5, j * gh + 5, gw - 10, gh - 10); ctx.clip(); ctx.translate(i * gw, j * gh); ctx.scale(gw / 640, gh / 360); kickScene(ph, t, n < 4); ctx.restore();
    ctx.strokeStyle = '#2b2630'; ctx.lineWidth = 10; ctx.strokeRect(i * gw + 5, j * gh + 5, gw - 10, gh - 10); }
}
shot('wall', B(36), B(38), (lt, d, t) => { videoWall(t, [1, 2, 3, 4][Math.min(3, Math.floor(bt(lt) / 2))], lt); chant(VI, B(36) + 0.05, B(38), t, { y: 360, size: 150 }); }, {});
shot('tv-city', B(38), B(40), (lt, d, t) => {
  city(t, 900, { sky: 'night', tv: true, sunX: 1080, sunY: 120, sunR: 50 });
  for (let i = 0; i < 4; i++) { const f = ((t * 0.9 + i / 4) % 1); Ci(264, GY - 505, 20 + f * 260); ctx.strokeStyle = `rgba(255,46,61,${0.8 * (1 - f)})`; ctx.lineWidth = 7; ctx.stroke(); }
  truck(640, GY + 190, 1.0, t, { girl: true });
  chant(VI, B(38) + 0.05, B(40), t, { y: 130, size: 140 });
});
shot('gulp', B(40), B(41), (lt, d, t) => {
  posterBg(t, '#18151c', 'rgba(255,46,61,.22)', null);
  courier({ x: 640, y: 800, s: 2.6, t, eyes: 'wide', mouth: 'o', look: [Math.sin(t * 14) * 5, 0], armF: [0.5, 2.0], armB: [-0.5, -2.0], box: null, tilt: Math.sin(t * 40) * 0.03 });
  for (let i = 0; i < 6; i++) { const f = ((t * 1.2 + i / 6) % 1); ell(470 + i * 68, 250 + f * 120, 9, 14, '#8fe3ff', 3); }
  const k = easeBack(prog(bt(lt), 0, 1.2));
  [[150, 250, -1.9], [130, 520, -1.3], [1130, 250, 1.9], [1150, 520, 1.3], [400, 90, -2.9], [880, 90, 2.9]].forEach(([x, y, r], i) => radarEye(lerp(x + Math.sin(r) * -400, x, k), lerp(y + Math.cos(r) * 400, y, k), r, 1.15, t, i));
});

// ============================ SOLO: THE CHASE =====================================
shot('chase-1', B(41), B(45), (lt, d, t) => {
  const sc = 3000 + lt * 1500; city(t, sc, { sky: 'toxic' }); speedLines(30, t);
  for (let i = 0; i < 3; i++) robot({ x: 130 + i * 190 + Math.sin(t * 3 + i) * 30, y: GY + 110 + i * 34, s: 0.95 + i * 0.12, t: t * 2, eyes: 'angry', radars: 3, wheelie: 0.4 + bob(t, i * 0.3) * 0.5, hop: bob(t, i * 0.3) * 14 });
  rider(Object.assign({}, COURIER, { x: 930 + Math.sin(t * 4) * 40, y: GY + 170 - bob(t) * 16, s: 1.2, dir: 1, t: t * 2, eyes: 'wide', mouth: 'yell', look: [-6, 1] }));
  for (let i = 0; i < 4; i++) circ(770 - i * 70, GY + 170 - i * 8, 22 + i * 12, 'rgba(255,255,255,.5)', 0);
});
shot('chase-2', B(45), B(47), (lt, d, t) => {
  const sc = 9000 - lt * 1500; city(t, sc, { sky: 'toxic' }); speedLines(30, t, 'rgba(255,255,255,.55)', -1);
  rider(Object.assign({}, COURIER, { x: 300 + Math.sin(t * 4) * 30, y: GY + 170 - bob(t) * 16, s: 1.2, dir: -1, t: t * 2, eyes: 'wide', mouth: 'yell', look: [-6, 1] }));
  for (let i = 0; i < 2; i++) robot({ x: 600 + i * 190, y: GY + 120 + i * 30, s: 1.0 + i * 0.1, dir: -1, t: t * 2, eyes: 'angry', radars: 3, wheelie: 0.4 + bob(t, i * 0.3) * 0.5, hop: bob(t, i * 0.3) * 14 });
  dude({ x: 1010, y: GY + 150, s: 0.95, t, dir: -1, skin: SKINS[2], top: '#5b6b77', vest: '#ff8a1f', bot: '#3a3340', hat: 'beanie', hatC: '#3f7fa6', walk: t * 3.4, eyes: 'angry', mouth: 'yell', lean: 0.25, armF: [2.4, 0.4], armB: [2.0, 0.4], handF: () => { line([[-10, -40], [34, 86]], 6, '#c9a27a'); poly([[22, 80], [46, 80], [56, 108], [14, 108]], '#d6b25a', 3.5); } });
  dude({ x: 1170, y: GY + 170, s: 1.0, t, dir: -1, skin: SKINS[1], top: '#3f7fa6', vest: '#c6f03a', bot: '#5b4034', hat: 'helmet', hatC: '#ff8a1f', walk: t * 3.4 + 0.5, eyes: 'wide', mouth: 'yell', lean: 0.25, armF: [2.6, 0.3], armB: [-1.2, -0.6] });
});
shot('trumpet', B(47), B(49), (lt, d, t) => {
  posterBg(t, '#ffd23e', 'rgba(255,61,110,.40)', 'rgba(0,0,0,.08)', 400, 400);
  bandMember(1, 400, 790, 2.7, t); notes(600, 330, t);
});
function roofs(t, sc) {
  const P = 1500, ox = tile(sc, 1, P), R = [[0, 380, 0], [470, 300, 1], [860, 420, 2], [1360, 100, 3]];
  for (let k = 0; k < 3; k++) R.forEach(([x, w, p]) => { const X = ox + k * P + x; if (X + w < -50 || X > W + 50) return; const [wc, ac] = BCOL[p];
    rect(X, 480, w, 300, wc, 5); rect(X - 8, 462, w + 16, 22, dk(wc, 0.8), 5); rect(X + w * 0.4, 484, 26, 300, ac, 0);
    for (let f = 0; f < 6; f++) for (let c = 0; c * 36 < w - 30; c++) rect(X + 14 + c * 36, 506 + f * 34, 22, 20, hash(p * 9 + f * 5 + c) > 0.6 ? '#ffe27a' : '#5d8296', 2);
    line([[X + 40, 462], [X + 40, 410]], 4); line([[X + 26, 420], [X + 54, 420]], 4); rect(X + w - 90, 430, 50, 34, dk(wc, 0.7), 4); });
}
shot('roofs', B(49), B(53), (lt, d, t) => {
  sky(t, 'sunset', 300, 250, 110); clouds(t, 0); farSkyline(600 + lt * 200, t, '#c9603f'); moscowCity(300 + lt * 500, t, 1, GY + 70);
  const sc = 500 + lt * 900; roofs(t, sc);
  const jump = Math.abs(Math.sin(Math.PI * beatF(t) / 2));
  for (let i = 0; i < 3; i++) { const rx = 110 + i * 150, ry = 300 + Math.sin(t * 5 + i * 2) * 40 - i * 30;
    robot({ x: rx, y: ry, s: 0.8, t, eyes: 'angry', radars: 3, roll: 3, tilt: 0.12 });
    at(rx, ry - 0.8 * 262, 0, 0.8, undefined, () => { line([[0, 40], [0, 0]], 6); ell(0, 0, 120 * Math.abs(Math.cos(t * 30 + i)) + 10, 9, 'rgba(240,240,240,.85)', 3.5); }); }
  courier({ x: 760, y: 462 - jump * 150, s: 1.05, t, eyes: 'wide', mouth: 'yell', walk: t * 3, lean: 0.3, armF: [2.2, 0.5], armB: [-1.6, -0.7], look: [-6, 0], rot: -jump * 0.15 });
});
shot('cornered', B(53), B(57), (lt, d, t) => {
  const cl = sm(prog(bt(lt), 0, 9)), look = Math.floor(bt(lt)) % 2 ? 1 : -1, up = prog(bt(lt), 9, 10), drop = easeIn(prog(bt(lt), 12.2, 16));
  cam(640, 390, 1.08 + cl * 0.08, 0, () => { city(t, 2260);
    if (up > 0) ell(640, GY + 96, 60 + up * 150 + drop * 40, 14 + up * 22, 'rgba(0,0,0,.35)', 0);
    courier({ x: 640, y: GY + 90, s: 1.3, t, dir: up > 0 ? 1 : look, eyes: 'wide', mouth: 'o', look: up > 0 ? [0, -7] : [5, 0], armF: [0.5, 1.6], armB: [-0.5, -1.6], tilt: Math.sin(t * 30) * 0.04, hop: bob(t) * 6 });
    for (let i = 0; i < 3; i++) { const off = lerp(760, 250 + i * 150, cl);
      robot({ x: 640 - off, y: GY + 96 + i * 26, s: 1.0 + i * 0.12, t, eyes: 'angry', radars: 3, hop: bob(t, i * 0.3) * 8 });
      robot({ x: 640 + off, y: GY + 96 + i * 26, s: 1.0 + i * 0.12, dir: -1, t, eyes: 'angry', radars: 3, hop: bob(t, i * 0.3 + 0.5) * 8 }); }
    if (drop > 0) { const by = lerp(-420, GY + 96, drop); line([[640, -500], [640, by - 300]], 8); poly([[610, by - 300], [670, by - 300], [640, by - 262]], '#b9c2c7', 5);
      rect(455, by - 262, 370, 262, '#c99a5b', 6, 6, INK, true); line([[455, by - 190], [825, by - 190]], 4, '#a87a40'); rect(618, by - 262, 44, 262, '#efdca0', 4); for (const ax of [520, 760]) { line([[ax, by - 40], [ax, by - 110]], 8); poly([[ax - 22, by - 100], [ax, by - 136], [ax + 22, by - 100]], INK, 0); } } });
});
