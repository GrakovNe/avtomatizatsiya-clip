'use strict';
// Verse 3, the pause, final chorus, outro.

function receipts(t, n = 40) { confetti(t, n, [], 3, 'receipt'); }
function tag(s, x, y, size, k, fill = '#fff', bg = INK, rot = -0.05) {
  if (k <= 0) return; ctx.font = `${size}px ${FONT}`; const w = ctx.measureText(s).width + size * 0.7;
  at(x, y, rot, k, undefined, () => { poly([[-w / 2 - 8, -size * 0.72], [w / 2 + 14, -size * 0.8], [w / 2 + 4, size * 0.66], [-w / 2 - 16, size * 0.74]], bg, 0, INK, true); text(s, 0, 2, size, { fill, lw: 0 }); });
}

// ============================ VERSE 3 ============================================
shot('boxed', B(57), B(58), (lt, d, t) => {
  posterBg(t, '#ff8a1f', 'rgba(255,255,255,.18)', 'rgba(0,0,0,.10)', 640, 430);
  const land = 1 - easeBounce(prog(lt, 0, 0.35));
  parcel(640, 690, 1.3, t, { tape: prog(bt(lt), 0.4, 2.6), sticker: prog(bt(lt), 2.8, 3.3), hop: land * 40, look: [Math.sin(t * 8) * 5, 2] });
  const tp = prog(bt(lt), 0.4, 2.6); if (tp > 0 && tp < 1) at(430 + ((tp * 3) % 1) * 430, 430 + Math.floor(tp * 3) * 80, 0.2, 1, undefined, () => { rect(-10, -60, 70, 50, '#3f7fa6', 5, 8, INK, true); rect(-34, -20, 60, 34, '#18222b', 4, 6); circ(-30, -2, 26, '#efdca0', 4); circ(-30, -2, 9, '#fff', 3); });
  if (lt < 0.3) for (const sg of [-1, 1]) circ(640 + sg * (230 + lt * 500), 690 - lt * 100, 50 * (1 - lt / 0.3) + 10, 'rgba(255,255,255,.6)', 0);
  if (lt < 0.55) impact(1020, 230, 130 * easeBack(prog(lt, 0, 0.2)) * (1 - easeIn(prog(lt, 0.4, 0.55))), t, 'БУМ!');
});
shot('watchers', B(58), B(59), (lt, d, t) => {
  posterBg(t, '#2c2a5e', 'rgba(143,227,255,.10)', null);
  crowd(t, 330, 3, { phone: true, lookX: Math.sin(t * 3) * 5, lookY: 5, jump: 8 });
  phone(1050, 400, 0.72, 0.12 + Math.sin(t * 2) * 0.02, () => mapScreen(t, 0.1 + lt * 0.12));
});
shot('track', B(59), B(60), (lt, d, t) => {
  posterBg(t, '#2f9e6b', 'rgba(255,255,255,.14)', 'rgba(0,0,0,.08)');
  phone(640, 372, 1.12, -0.04, () => mapScreen(t, lerp(0.25, 0.95, sm(lt / d)), '', lt / d > 0.72 ? 'plane' : 'box'));
  [[250, 200, 0.0], [1040, 320, 1.25], [260, 520, 2.5]].forEach(([x, y, b], i) => { const f = prog(bt(lt), b, b + 1.2); if (f > 0 && f < 1) impact(x, y, 104 * easeBack(prog(f, 0, 0.3)) * (1 - easeIn(prog(f, 0.8, 1))), t + i, 'ПИК!', '#39f0e0', '#2c3357'); });
});
shot('sorting', B(60), B(61), (lt, d, t) => {
  posterBg(t, '#5b6b77', 'rgba(255,255,255,.10)', 'rgba(0,0,0,.10)', 1000, 300);
  plane(1250, 330, 2.6, -1, t); rect(900, 250, 250, 300, '#18151c', 6, 20); rect(916, 266, 218, 268, null, 4, 12, '#3a3340'); poly([[1040, 560], [1160, 540], [1160, 604], [1040, 604]], '#b9c2c7', 5);
  conveyor(-60, 560, 1100, t, 1);
  const x = lerp(-150, 1020, lt / d);
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, 1110 + 200, H + 400); ctx.clip(); parcel(x, 562, 0.86, t, { tape: 1, sticker: 1, hop: bob(t) * 14, eyes: 'wide', mouth: 'o', rot: Math.sin(t * 9) * 0.05 }); ctx.restore();
});
shot('takeoff', B(61), B(62), (lt, d, t) => {
  const f = sm(lt / d);
  cam(640, 250 - f * 60, 0.86, 0, () => { city(t, 800 + lt * 200, { clouds: true });
    const px = lerp(60, 880, f), py = lerp(420, 40, f);
    for (let i = 0; i < 14; i++) { const g = ((t * 1.6 + i / 14) % 1); ell(px + 10 - g * 140 - i * 4, py + 10 + g * g * 420, 7, 11, '#8fe3ff', 2.5, 0.4); }
    plane(px, py, 0.95, 1, t, { rot: -0.34, cry: 6 }); });
  at(1040, 500, 0, popAt(lt, 0.4), undefined, () => { circ(0, 0, 170, '#bfe6f2', 8, INK, true); ctx.save(); Ci(0, 0, 166); ctx.clip();
    courier({ x: -6, y: 330, s: 1.7, t, eyes: 'sad', mouth: 'cry', box: null, look: [0, 4], tilt: Math.sin(t * 12) * 0.08 }); tears(-4, -24, t, 1.4, 0.8); ctx.restore(); circ(0, 0, 170, null, 12, '#e9eef0'); circ(0, 0, 176, null, 5); });
});
shot('work', B(62), B(63), (lt, d, t) => {
  cam(640, 390, 1.08, 0, () => { city(t, 2260 + lt * 120);
    plane(1030 + lt * 60, 90 - lt * 20, 0.22, 1, t, { rot: -0.2 });
    const rx = 520 + lt * 70;
    for (let i = 0; i < 2; i++) at(rx, GY + 92 - 1.4 * (176 + i * 16) - bob(t) * 8, 0, 1.4, undefined, () => { rect(-64, -10, 128, 16, '#fff6dc', 4, 3, INK, true); circ(0, -2, 4.5, '#e8463a', 0); });
    robot({ x: rx, y: GY + 92, s: 1.4, t, eyes: 'happy', arm: 1, hop: bob(t) * 8 });
    for (let i = 0; i < 16; i++) { const g = ((t * 1.3 + hash(i)) % 1); ell(120 + hash(i * 3) * 1040, -60 + g * (GY + 140), 5, 10, '#8fe3ff', 2.5); } });
});
const flyAway = (lt, t) => {
  sky(t, 'sunset', 760, 300, 150); clouds(t, 0); cam(640, 360, 1, 0, () => { farSkyline(600, t, '#c9603f'); moscowCity(430, t, 1, GY + 150); ctx.fillStyle = '#3a2233'; ctx.fillRect(-100, GY + 150, W + 200, 300); });
  const f = prog(lt, 0, 1.4); plane(lerp(260, 720, f), lerp(420, 300, f), lerp(0.7, 0.16, f), 1, t, { rot: -0.18 });
  for (let i = 0; i < 6; i++) { const g = ((t * 1.5 + i / 6) % 1); ell(lerp(260, 720, f) - g * 60, lerp(420, 300, f) + g * g * 200 * lerp(1, 0.3, f), 4, 7, '#8fe3ff', 2); }
};
shot('fly-away', B(63), TL.pauseAt, (lt, d, t) => flyAway(lt, t));
shot('freeze', TL.pauseAt, TL.eto, (lt, d, t) => { flyAway(TL.pauseAt - B(63), TL.pauseAt); wash('rgba(30,30,60,.55)'); vhsOSD('PAUSE ❚❚', t, false); }, { flash: false, punch: 0, shake: 0 });
function paper(t) {
  wash('#efe3c4'); ctx.strokeStyle = 'rgba(60,90,150,.25)'; ctx.lineWidth = 3; for (let y = 90; y < H; y += 56) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  line([[150, 0], [150, H]], 4, 'rgba(220,60,60,.35)');
  const f = { align: 'left', font: '"Courier New", monospace', weight: 'bold', fill: '#3a3340', lw: 0 };
  text('НАКЛАДНАЯ №404', 190, 80, 48, f); text('ГРУЗ:  курьер, 1 шт.', 190, 192, 40, f); text('ОТКУДА: Москва', 190, 248, 40, f); text('КУДА:  домой', 190, 304, 40, f); text('ПРИЧИНА:', 190, 360, 40, f);
  for (let i = 0; i < 26; i++) rect(900 + i * 9, 50, (i * 7 % 3) + 2, 70, INK, 0);
}
shot('eto', TL.eto, TL.slam, (lt, d, t) => {
  const f = lt / d; cam(640, 360, 1.0 + f * 0.06, -0.02, () => { paper(t);
    ell(660, 500, 150 + f * 120, 30 + f * 26, `rgba(0,0,0,${0.12 + f * 0.2})`, 0);
    stampTool(660 + jit(4, t * 3, 5), lerp(-40, 250, easeOut(prog(f, 0, 0.7))) - sm(prog(f, 0.72, 1)) * 110 + jit(5, t * 3, 5), 1.25, -0.1); });
}, { flash: false, punch: 0, shake: 0 });
shot('slam', TL.slam, TL.chants[0], (lt, d, t) => {
  const k = 1 - prog(lt, 0, 0.5), up = easeIn(prog(lt, 0.1, 0.5));
  cam(640 + jit(6, t * 3, 26 * k), 360 + jit(7, t * 3, 26 * k), 1.06 + 0.1 * k, -0.02, () => { paper(t);
    stampMark(660, 500, 150, -0.13, 'ДЕПОРТАЦИЯ');
    if (lt < 0.5) for (let i = 0; i < 8; i++) { const a = i * TAU / 8, r = 300 + lt * 700; star(660 + Math.cos(a) * r, 500 + Math.sin(a) * r * 0.5, 30 * k + 6, 12 * k + 3, 4, '#fff', 3, a); }
    if (up < 1) stampTool(660 + up * 500, lerp(490, -300, up), 1.25, -0.1 + up * 0.5); });
}, { flash: true });

// ============================ FINAL CHORUS =======================================
const C = TL.chants, CE = TL.chantsEnd;
shot('fin-cancan', C[0], C[1], (lt, d, t) => {
  sky(t, 'night', 1185, 105, 54); farSkyline(600, t, '#3d2f6e'); moscowCity(430, t, 1, GY + 40); street(0, t); spots(t, 5, 'rgba(255,246,201,.20)');
  canCan(t, 5, GY + 150, 1.05); confetti(t, 50, ['#ffe94a', '#ff3d6e', '#39f0e0', '#fff'], 1);
  chant(AV, C[0] + 0.05, C[1], t, { y: 135, size: 140 });
});
shot('fin-wall', C[1], C[2], (lt, d, t) => {
  videoWall(t, 4, lt);
  [[110, 600, -2.2], [1170, 600, 2.2], [110, 150, -1.2], [1170, 150, 1.2]].forEach(([x, y, r], i) => radarEye(x, y, r, 1.2, t, i));
  chant(VI, C[1] + 0.05, C[2], t, { y: 360, size: 150 });
});
shot('fin-plane', C[2], C[3], (lt, d, t) => {
  sky(t, 'sunset', 640, 380, 170); clouds(t, 0);
  stampMark(640, 420, 120, -0.1, 'ДЕПОРТАЦИЯ', 0.85);
  const f = lt / d, px = lerp(-300, W + 300, f), py = 330 + Math.sin(f * TAU) * 120;
  for (let i = 0; i < 20; i++) { const g = ((t * 1.6 + i / 20) % 1); ell(px - 60 - g * 320, py + Math.sin(g * 9 + i) * 60 + g * g * 240, 9, 13, '#8fe3ff', 3, 0.4); }
  plane(px, py, 1.1, 1, t, { rot: f * TAU * 2 - 0.1, cry: 6 });
  chant(DE, C[2] + 0.05, C[3], t, { y: 140, size: 140 });
});
shot('fin-city', C[3], C[4], (lt, d, t) => {
  const sc = 700 + lt * 220; cam(640, 380, 1.04, Math.sin(beatF(t) * Math.PI) * 0.012, () => { city(t, sc, { party: true, sky: 'toxic' }); extras(t, sc, { dance: true, only: [0, 1, 5] });
    for (let i = 0; i < 4; i++) robot({ x: 200 + i * 300, y: GY + 170 + (i % 2) * 20, s: 0.95, t, eyes: 'happy', hop: bob(t, i * 0.5) * 30, wheelie: bob(t, i * 0.5) * 0.5, roll: 0 }); });
  chant(DE, C[3] + 0.05, C[4], t, { y: 140, size: 140 });
});
shot('fin-band', C[4], C[5], (lt, d, t) => {
  posterBg(t, '#ff3d6e', 'rgba(255,233,74,.5)', 'rgba(0,0,0,.08)', 640, 420);
  truck(640, 560, 1.15, t, { girl: true }); crowd(t, 640, 1, { hands: 'up', jump: 30, mouth: 'yell' }); receipts(t, 30);
  chant(DE, C[4] + 0.05, C[5], t, { y: 120, size: 136 });
});
shot('fin-all', C[5], CE, (lt, d, t) => {
  const sc = 1300 + lt * 260; cam(640, 380, 1.02, Math.sin(beatF(t) * Math.PI) * 0.015, () => { city(t, sc, { party: true, sky: 'sunset', sunX: 640, sunY: 210, sunR: 110 });
    plane(lerp(1500, -300, lt / d), 150 + Math.sin(t * 3) * 30, 0.7, -1, t, { rot: Math.sin(t * 4) * 0.2, cry: 6 });
    truck(760, GY + 200, 0.9, t, { girl: true });
    for (let i = 0; i < 3; i++) robot({ x: 120 + i * 150, y: GY + 190 + (i % 2) * 14, s: 0.8, t, eyes: 'happy', hop: bob(t, i * 0.5) * 26, wheelie: bob(t, i * 0.5) * 0.5, roll: 0 }); });
  receipts(t, 50); chant(DE, C[5] + 0.05, CE - 0.2, t, { y: 150, size: 150 });
});

// ============================ OUTRO ==============================================
shot('parade', CE, B(86), (lt, d, t) => {
  const sc = 2000 + lt * 420; cam(640, 380, 1.02, Math.sin(beatF(t) * Math.PI) * 0.01, () => { city(t, sc, { sky: 'sunset', sunX: 980, sunY: 200, sunR: 96 }); extras(t, sc, { dance: true, only: [0, 1] });
    for (let i = 0; i < 4; i++) robot({ x: 40 + i * 120, y: GY + 182 + (i % 2) * 12, s: 0.78, t, eyes: 'happy', hop: bob(t, i * 0.5) * 22, wheelie: bob(t, i * 0.5) * 0.4 });
    truck(820, GY + 200, 0.95, t, { girl: true }); });
  receipts(t, 34);
  hey(lt % (BEAT * 8), [0, 4], 640, 150);
});
shot('wink', B(86), B(88), (lt, d, t) => {
  posterBg(t, '#18151c', 'rgba(255,61,110,.22)', null, 640, 420);
  const w = envAt(t) < 0.62;
  cam(640, 360, 1 + lt * 0.03, w ? -0.03 : 0.02, () => robot({ x: 600, y: 760, s: 3.1, t, eyes: w ? 'wink' : 'smug', roll: 0, medals: 4, arm: 0.6 }));
}, { glitchIn: true });
shot('sniff', B(88), B(89), (lt, d, t) => {
  wash('#e9eef0'); rect(-20, -20, W + 40, H + 40, '#d9dee0', 0); for (let i = 0; i < 3; i++) Rc(-380 + i * 760, 110, 420, 520, 150), paint(i === 1 ? '#bfe6f2' : '#aacbd6', 12, '#f6f8f8', true);
  ctx.save(); Rc(380, 110, 420, 520, 150); ctx.clip(); for (let i = 0; i < 3; i++) cloud(((t * 160 + i * 300) % 900) + 200, 220 + i * 150, 1.1);
  courier({ x: 590, y: 760, s: 1.9, t, eyes: 'sad', mouth: 'frown', box: null, look: [4, 4], tilt: -0.1 + Math.sin(t * 3) * 0.03 });
  const g = (t * 0.9) % 1; ell(636, 388 + g * 150, 8, 13, '#8fe3ff', 3); ctx.restore(); Rc(380, 110, 420, 520, 150); paint(null, 12, '#f6f8f8'); Rc(374, 104, 432, 532, 154); paint(null, 5);
}, { shake: 0 });
shot('sunset', B(89), B(94), (lt, d, t) => {
  const f = lt / d, sc = 2260 + lt * 240;
  cam(640, 380, 1.03, 0, () => { city(t, sc, { sky: 'sunset', sunX: 900, sunY: 260, sunR: 150 });
    for (let i = 0; i < 2; i++) at(600, GY + 96 - 1.25 * (176 + i * 16) - bob(t) * 8, 0, 1.25, undefined, () => { rect(-64, -10, 128, 16, '#fff6dc', 4, 3, INK, true); circ(0, -2, 4.5, '#e8463a', 0); });
    robot({ x: 600, y: GY + 96, s: 1.25, t, eyes: 'happy', hop: bob(t) * 8 }); });
  { const k = prog(lt, 1.6, 2.0), out = 1 - prog(lt, d - 1.0, d - 0.5); if (k > 0 && out > 0) { ctx.save(); ctx.globalAlpha = out; text('ни один робот не пострадал', W / 2, 640, 56 * easeBack(k), { fill: '#fff', lw: 12, rot: -0.02 }); ctx.restore(); } }
});
shot('end', B(94), A.dur + 1, (lt, d, t) => {
  wash('#0c0a12'); text('КОНЕЦ', W / 2, H / 2 - 10, 230 * (1 + pulse(t, 2) * 0.03), { fill: '#ffe94a', lw: 26, rot: -0.04 });
  vhsOSD('STOP ■', t, false);
}, { glitchIn: true });
