'use strict';
// Shot list. Each shot: (lt = local time, d = duration, t = global time).
const B = (n) => A.beat0 + n * BAR;
const SHOTS = [];
const shot = (name, a, b, fn, o = {}) => SHOTS.push({ name, a, b, fn, o });
const shotAt = (t) => SHOTS.find((s) => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1];
const shotName = (t) => shotAt(t).name;
const bt = (lt) => lt / BEAT;                       // local time in beats
const popAt = (lt, beat, len = 0.5) => easeBack(prog(bt(lt), beat, beat + len));
const AV = ['АВ', 'ТО', 'МА', 'ТИ', 'ЗА', 'ЦИ', 'Я!'], VI = ['ВИ', 'ДЕ', 'О', 'ФИК', 'СА', 'ЦИ', 'Я!'], DE = ['Э', 'ТО', 'ДЕ', 'ПОР', 'ТА', 'ЦИ', 'Я!'];

function cam(cx, cy, z, rot, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rot || 0); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function camTo(sx, sy, cx, cy, z, fn) { ctx.save(); ctx.translate(sx, sy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function wash(color) { ctx.fillStyle = color; ctx.fillRect(-100, -100, W + 200, H + 200); }
function posterBg(t, c1, c2, c3, cx = W / 2, cy = H / 2) { wash(c1); burst(cx, cy, 1500, 20, t * 0.5, c2, 'rgba(0,0,0,0)'); if (c3) halftone(0, 0, W, H, 26, c3, 9, cx / W, cy / H); }
function hey(lt, beats, x, y, label = 'ХЕЙ!') { beats.forEach((b, i) => { const f = prog(bt(lt), b, b + 1.2); if (f > 0 && f < 1) impact(x + (i % 2 ? 190 : -190) * (i ? 1 : 0), y - (i % 2) * 40, 92 * easeBack(prog(f, 0, 0.3)) * (1 - easeIn(prog(f, 0.75, 1))), lt + i, label, '#ff3d6e', '#ffe94a'); }); }

// ============================ INTRO =============================================
shot('title', 0, B(2), (lt, d, t) => {                 // frame 0 is a finished poster (it becomes the thumbnail)
  posterBg(t, '#ff3d6e', 'rgba(255,233,74,.55)', 'rgba(0,0,0,.10)', W / 2, 520);
  cam(640, 360 - 22, 1 + 0.05 * lt / d, 0, () => {
    cam(640, 300, 1, 0, () => { farSkyline(300, t, '#2c1f3d'); moscowCity(180, t, 1, GY + 120); ctx.fillStyle = '#18151c'; ctx.fillRect(-200, GY + 110, W + 400, 500); });
    robot({ x: 1035, y: 676, s: 1.35, dir: -1, t, eyes: 'smug', roll: 0, hop: bob(t, 0.5) * 10 });
    courier({ x: 250, y: 674, s: 1.35, t, eyes: 'angry', mouth: 'yell', armF: [1.5, 0.12], armB: [-0.5, -1.9], hop: bob(t) * 12, lean: 0.08 });
  });
  chant(AV, B(0) + 0.1, B(2) + 0.3, t, { y: 190, size: 176, always: true });
  vhsOSD('PLAY ▶', t);
}, { punch: 0, flash: false });
shot('moscow', B(2), B(5), (lt, d, t) => {
  const sc = 200 + lt * 150;
  cam(640, 360, 1.05 + lt * 0.02, 0, () => { city(t, sc); extras(t, sc); });
});
shot('band-in', B(5), B(8), (lt, d, t) => {
  const sc = 900; city(t, sc, { sky: 'toxic' });
  const x = lerp(-500, 600, easeOut(prog(lt, 0, 1.4)));
  truck(x, GY + 190, 1.05, t, { girl: true });
  hey(lt, [2, 4, 6, 8, 10], 640, 150);
});
const rideAt = (t) => ({ x: 560 + Math.sin(t * 5) * 30, y: GY + 150 - bob(t) * 14, s: 1.25, dir: 1, t: t * 1.6, eyes: 'angry', mouth: 'yell', lean: 0.5 });
shot('courier-ride', B(8), B(10), (lt, d, t) => {
  const sc = 400 + lt * 1500; city(t, sc); speedLines(26, t);
  rider(Object.assign({}, COURIER, rideAt(t)));
  for (let i = 0; i < 3; i++) circ(340 - i * 90 - lt * 30, GY + 150 - i * 12, 26 + i * 12, 'rgba(255,255,255,.55)', 0);
});
shot('courier-tag', B(10), B(12), (lt, d, t) => {      // true freeze-frame of the ride + push-in
  const ft = B(10) - 0.04, sc = 400 + (ft - B(8)) * 1500, k = easeOut(prog(lt, 0, 0.4)), r = rideAt(ft);
  const view = (fn) => cam(lerp(640, r.x + 150, k), lerp(360, r.y - 190, k), 1 + 0.3 * k, -0.05 * k, fn);
  view(() => { city(ft, sc); speedLines(26, ft); });
  wash('rgba(40,20,90,.42)'); burst(520, 380, 1400, 16, t * 0.6, 'rgba(255,233,74,.32)', 'rgba(0,0,0,0)');
  view(() => rider(Object.assign({}, COURIER, r)));
  impact(960, 230, 150 * easeBack(prog(lt, 0.05, 0.4)), t, 'ВЖУХ!');
}, { flash: false, punch: 0.4 });
const rollScene = (lt, t, withRobot) => { const sc = 1500 + lt * 60; if (!withRobot) city(t, sc);
  if (withRobot) robot({ x: 520 + lt * 40, y: GY + 78, s: 1.3, t, eyes: withRobot === 2 ? 'smug' : 'norm', hop: bob(t) * 5, roll: withRobot === 2 ? 0 : 1 });
  else dude({ x: 250 + lt * 140, y: GY + 60, s: 0.8, t, top: '#8f6fb5', skin: '#f0c9a4', hat: 'bun', hatC: '#c9ccd2', walk: t * 1.2, eyes: 'norm', mouth: 'flat', bot: '#5b4034', armF: [0.4, 0.3], handF: () => { line([[0, 0], [8, 70]], 6, '#5b4034'); } }); };
shot('robot-roll', B(12), B(14), (lt, d, t) => { rollScene(lt, t, 0); rollScene(lt, t, 1); });
shot('robot-tag', B(14), B(16), (lt, d, t) => {         // freeze-frame of the roll + push-in
  const fl = B(14) - 0.04 - B(12), ft = B(14) - 0.04, k = easeOut(prog(lt, 0, 0.4)), rx = 520 + fl * 40;
  const view = (fn) => cam(lerp(640, rx - 150, k), lerp(360, GY - 60, k), 1 + 0.3 * k, 0.04 * k, fn);
  view(() => rollScene(fl, ft, 0));
  wash('rgba(90,20,60,.42)'); burst(760, 380, 1400, 16, -t * 0.6, 'rgba(57,240,224,.28)', 'rgba(0,0,0,0)');
  view(() => rollScene(fl, ft, 2));
  impact(330, 230, 140 * easeBack(prog(lt, 0.05, 0.4)), t, 'БИП!', '#39f0e0', '#2c3357');
}, { flash: false, punch: 0.4 });
shot('face-off', B(16), B(17), (lt, d, t) => {
  const k = easeOut(prog(lt, 0, 0.3));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H / 2); ctx.clip(); wash('#f4c531'); speedLines(14, t, 'rgba(0,0,0,.18)');
  camTo(640, 190, 14, -204, 3.3, () => courier({ x: (1 - k) * -200, y: 0, s: 1, t, eyes: 'angry', mouth: 'flat', look: [5, 1] })); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2, W, H / 2); ctx.clip(); wash('#ff3d6e'); speedLines(14, t, 'rgba(0,0,0,.18)', -1);
  camTo(640, 548, -42, -122, 4.4, () => robot({ x: (1 - k) * 200, y: 0, s: 1, dir: -1, t, eyes: 'angry', roll: 0 })); ctx.restore();
  rect(-10, H / 2 - 9, W + 20, 18, INK, 0); impact(640, 360, 86 * popAt(lt, 1), t, 'VS');
});

// ============================ VERSE 1 ============================================
const twoShot = (t, sc = 2260, o = {}) => { city(t, sc, o); };
shot('kick', B(17), B(18), (lt, d, t) => {
  const k = prog(bt(lt), 0, 4) * 0.56, hitT = bt(lt) - 3.0;
  cam(640 + (hitT > 0 ? jit(5, t * 3, 14 * (1 - prog(hitT, 0, 0.8))) : 0), 400, 1.12, 0, () => { twoShot(t);
    robot({ x: 840, y: GY + 86, s: 1.35, dir: -1, t, eyes: hitT > 0 ? 'smug' : 'norm', roll: 0 });
    kicker(520, GY + 86, 1.3, k, t);
    if (hitT > 0) impact(700, GY - 30, 120 * easeBack(prog(hitT, 0, 0.35)), t, 'БАЦ!'); });
});
shot('weight', B(18), B(19), (lt, d, t) => {
  cam(640, 400, 1.12, 0, () => { twoShot(t);
    robot({ x: 840, y: GY + 86, s: 1.35, dir: -1, t, eyes: 'smug', roll: 0 });
    kicker(520 - sm(prog(lt, 0.1, d)) * 90, GY + 86, 1.3, lerp(0.56, 0.8, prog(lt, 0, 0.3)), t); });
  [['АЙ!', 300, 190, 0.2], ['ОЙ!', 420, 130, 2.0]].forEach(([s, x, y, b], i) => { const f = prog(bt(lt), b, b + 1.8); if (f > 0 && f < 1) impact(x - lt * 60, y, 100 * easeBack(prog(f, 0, 0.25)) * (1 - easeIn(prog(f, 0.8, 1))), t + i, s); });
}, { flash: false, punch: 0 });
shot('steel', B(19), B(20), (lt, d, t) => {
  posterBg(t, '#3f7fa6', 'rgba(255,255,255,.22)', 'rgba(0,0,0,.10)', 640, 420);
  const n = Math.min(4, Math.floor(bt(lt) + 0.6));
  cam(640, 360, 1, -0.04, () => { robot({ x: 640, y: 640, s: 2.25, t, eyes: 'smug', medals: n, roll: 0, hop: pulse(t, 3) * 10 });
    ctx.save(); ctx.globalAlpha = 0.5; const gx = ((lt * 1400) % 2200) - 400; poly([[gx, 100], [gx + 90, 100], [gx - 110, 700], [gx - 200, 700]], '#fff', 0); ctx.restore(); });
  { const b = bt(lt) + 0.6, f = b - Math.floor(b); if (b < 4.6 && f < 0.8) impact(Math.floor(b) % 2 ? 1010 : 270, Math.floor(b) % 2 ? 220 : 180, 110 * easeBack(prog(f, 0, 0.3)), t, 'ДЗЫНЬ!', '#ffe94a', '#e8463a'); }
});
shot('brass-1', B(20), B(21), (lt, d, t) => {
  posterBg(t, '#ffd23e', 'rgba(255,61,110,.35)', null);
  cam(640, 330, 1.25, 0.03, () => truck(700, 640, 1.25, t, { singer: false }));
  hey(lt, [0, 2], 640, 130);
});
shot('pockets', B(21), B(22), (lt, d, t) => {
  posterBg(t, '#8f6fb5', 'rgba(255,255,255,.14)', 'rgba(0,0,0,.10)', 640, 430);
  const sh = Math.sin(t * 16) * 0.12;
  courier({ x: 560, y: 740, s: 2.5, t, eyes: 'sad', mouth: 'frown', armF: [1.25 + sh, -0.5], armB: [-1.25 - sh, 0.5], look: [0, 5], tilt: sh * 0.4, box: null, hop: bob(t) * 10 });
  for (const sg of [-1, 1]) poly([[560 + sg * 70, 500], [560 + sg * 170, 470 + sh * 60], [560 + sg * 150, 560], [560 + sg * 74, 560]], '#fff', 5);
  for (let i = 0; i < 2; i++) at(840 + Math.sin(t * 3 + i * 2) * 120 + i * 90, 260 + Math.cos(t * 4 + i) * 70 - i * 60, Math.sin(t * 5) * 0.4, 1, undefined, () => { const fl = Math.abs(Math.sin(t * 30 + i)); ell(-12, 0, 16, 22 * fl + 3, '#b9b09a', 3, -0.5); ell(12, 0, 16, 22 * fl + 3, '#b9b09a', 3, 0.5); ell(0, 0, 4, 12, INK, 0); });
});
shot('scroll', B(22), B(23), (lt, d, t) => {
  cam(640, 400, 1.08, 0, () => { twoShot(t);
    const len = easeOut(prog(bt(lt), 0.3, 3.0)) * 1050, lid = sm(prog(bt(lt), 0, 0.5));
    const sq = prog(len, 560, 700);
    courier({ x: 250, y: GY + 86, s: 1.3 * (1 - sq * 0.0), t, eyes: sq > 0 ? 'dizzy' : 'wide', mouth: sq > 0 ? 'flat' : 'o', armF: [2.6, 0.3], armB: [-2.6, -0.3], rot: -sq * 1.45, hop: (1 - sq) * bob(t) * 10 });
    robot({ x: 980, y: GY + 86, s: 1.35, dir: -1, t, eyes: 'happy', lid, roll: 0 });
    scrollPaper(900, GY - 76, len, 0.02, t, -1);
    if (sq > 0.3) impact(300, GY - 150, 110 * easeBack(prog(sq, 0.3, 0.8)), t, 'ШМЯК!'); });
});
shot('auto-stop', B(23), B(24), (lt, d, t) => {
  posterBg(t, '#18151c', 'rgba(57,240,224,.20)', null, 640, 520);
  cam(640, 360, 1 + lt * 0.05, 0, () => robot({ x: 640, y: 720, s: 2.4, t, eyes: 'wink', roll: 0, medals: 4 }));
  chant(AV, B(23) - 0.05, B(24) + 0.2, t, { y: 190, size: 160 });
}, { flash: true });

// ============================ CHORUS 1 ===========================================
function canCan(t, n = 5, y = GY + 150, s = 1.05, girl = true) {
  for (let i = 0; i < n; i++) { const x = W / 2 + (i - (n - 1) / 2) * 230 * s, ph = Math.floor(beatF(t)) + i, kick = (ph % 2 ? 1 : 0) * (1 - Math.pow(1 - beatPh(t), 2) * 0 - Math.abs(beatPh(t) - 0.5) * 2 * 0) * Math.sin(beatPh(t) * Math.PI);
    robot({ x, y, s, t, eyes: 'happy', kick, wheelie: kick * 0.35, hop: bob(t) * 12, roll: 0, flagC: pick(['#ff9d2e', '#39f0e0', '#ffe94a'], i) }); }
  if (girl) bandMember(4, W / 2, y - 168 * s - bob(t) * 12, s * 0.95, t);
}
function spots(t, n = 4, col = 'rgba(255,246,201,.16)') { for (let i = 0; i < n; i++) { const x = (i + 0.5) * W / n, a = Math.sin(t * 2 + i * 1.7) * 0.5; ctx.save(); ctx.translate(x, H + 40); ctx.rotate(a); poly([[-16, 0], [16, 0], [190, -1100], [-190, -1100]], col, 0); ctx.restore(); } }
shot('cancan', B(24), B(26), (lt, d, t) => {
  sky(t, 'night', 1185, 105, 54); farSkyline(600, t, '#3d2f6e'); moscowCity(430, t, 1, GY + 40); street(0, t); spots(t);
  canCan(t); chant(AV, B(24) + 0.05, B(26), t, { y: 135, size: 140 });
});
shot('factory', B(26), B(28), (lt, d, t) => {
  posterBg(t, '#ff3d6e', 'rgba(255,233,74,.4)', 'rgba(0,0,0,.10)', 180, 300);
  rect(40, 60, 260, 470, '#5b6b77', 6, 10, INK, true); rect(70, 430, 200, 110, '#18222b', 5, 8); for (let i = 0; i < 3; i++) circ(100 + i * 70, 120, 20, pick(['#ff2e3d', '#ffe94a', '#39f0e0'], i + Math.floor(beatF(t))), 5);
  at(170, 250 + pulse(t, 2) * 70, 0, 1, undefined, () => { rect(-80, -160, 160, 150, '#3a3340', 5, 8); rect(-100, -18, 200, 34, '#b9c2c7', 5, 6); });
  for (let r = 0; r < 3; r++) { const y = 330 + r * 150, sc = 0.62 + r * 0.2; conveyor(-40, y, W + 80, t, 1);
    for (let i = 0; i < 6; i++) { const x = ((t * 260 + i * 260 + r * 90) % 1560) - 140; robot({ x, y: y + 2, s: sc, t: t + i, eyes: 'happy', roll: 0, hop: bob(t, i * 0.5) * 8 * sc }); } }
  const cx = 1180 + bt(lt) * 30;
  courier({ x: cx, y: 640, s: 1.1, t, dir: -1, eyes: 'wide', mouth: 'o', lean: 0.35, armF: [1.4, -0.4], armB: [1.2, -0.3], legs: [-0.5, 0.4], knees: [0, 0.4] });
  chant(AV, B(26) + 0.05, B(28), t, { y: 135, size: 140 });
});
shot('band-hit-1', B(28), B(29), (lt, d, t) => {
  city(t, 900, { sky: 'toxic' }); truck(600, GY + 190, 1.05, t, { girl: true }); hey(lt, [0, 2], 640, 150);
});
