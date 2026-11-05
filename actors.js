'use strict';
// Cut-out puppets. All take feet/ground position (x, y), scale s, facing dir (+1 right, -1 left).

function faceOn(o) {            // head-local coords, facing +x
  const E = o.eyes || 'norm', M = o.mouth || 'smile', look = o.look || [3, 1], skin = o.skin;
  for (const sg of [-1, 1]) {
    const cx = sg * 15 + 7, cy = -6, r = E === 'wide' ? 15 : 12;
    if (E === 'shut' || E === 'happy') { ctx.beginPath(); ctx.arc(cx, cy + (E === 'happy' ? 4 : -2), 10, E === 'happy' ? Math.PI * 1.1 : 0.1 * Math.PI, E === 'happy' ? Math.PI * 1.9 : 0.9 * Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); }
    else if (E === 'dizzy') { line([[cx - 8, cy - 8], [cx + 8, cy + 8]], 4); line([[cx - 8, cy + 8], [cx + 8, cy - 8]], 4); }
    else {
      ell(cx, cy, r, r * 1.08, '#fff', 3.5);
      circ(cx + look[0] * (E === 'wide' ? 0.5 : 1), cy + look[1], E === 'wide' ? 3.5 : 5.5, INK, 0);
      if (E === 'smug' || E === 'sad' || E === 'angry') { ctx.save(); El(cx, cy, r + 1, r * 1.08 + 1); ctx.clip(); ctx.fillStyle = skin; const k = E === 'smug' ? 0 : (E === 'sad' ? sg : -sg) * 7;
        ctx.beginPath(); ctx.moveTo(cx - 20, cy - 22); ctx.lineTo(cx + 20, cy - 22); ctx.lineTo(cx + 20, cy - 3 + k); ctx.lineTo(cx - 20, cy - 3 - k); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(cx - 20, cy - 3 - k); ctx.lineTo(cx + 20, cy - 3 + k); ctx.stroke(); ctx.restore(); ell(cx, cy, r, r * 1.08, null, 3.5); }
    }
    const by = cy - r - 8;
    if (E === 'angry') line([[cx - sg * 13, by - 5], [cx + sg * 9, by + 6]], 5);
    else if (E === 'sad' || E === 'wide') line([[cx - sg * 11, by + (E === 'sad' ? 4 : -4)], [cx + sg * 9, by + (E === 'sad' ? -5 : -7)]], 4);
    else if (E !== 'happy') line([[cx - 9, by], [cx + 9, by - 1]], 4);
  }
  const mx = 9, my = 21;
  if (M === 'smile') { ctx.beginPath(); ctx.arc(mx, my - 8, 15, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (M === 'grin') { ctx.beginPath(); ctx.arc(mx, my - 9, 19, 0.05 * Math.PI, 0.95 * Math.PI); ctx.closePath(); paint('#fff', 3.5); line([[mx - 9, my - 6], [mx - 9, my + 6]], 2); line([[mx, my - 6], [mx, my + 9]], 2); line([[mx + 9, my - 6], [mx + 9, my + 6]], 2); }
  else if (M === 'open') { ell(mx, my, 12, 10, '#5a1020', 3.5); ell(mx, my + 5, 7, 4, '#ef6b73', 0); }
  else if (M === 'yell') { ell(mx, my + 3, 19, 18, '#5a1020', 4); rect(mx - 13, my - 13, 26, 8, '#fff', 2, 3); ell(mx, my + 12, 10, 6, '#ef6b73', 0); }
  else if (M === 'cry') { ctx.beginPath(); ctx.arc(mx, my + 16, 18, 1.05 * Math.PI, 1.95 * Math.PI); ctx.closePath(); paint('#5a1020', 4); ell(mx, my + 12, 8, 4, '#ef6b73', 0); }
  else if (M === 'o') { ell(mx + 2, my, 7, 9, '#5a1020', 3.5); }
  else if (M === 'flat') line([[mx - 10, my], [mx + 10, my]], 4);
  else if (M === 'smug') line([[mx - 10, my + 2], [mx + 4, my + 3], [mx + 13, my - 5]], 4);
  else if (M === 'frown') { ctx.beginPath(); ctx.arc(mx, my + 12, 14, 1.2 * Math.PI, 1.8 * Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); }
}
function hatOn(o) {
  const h = o.hat, c = o.hatC || '#e24';
  if (h === 'cap') { ctx.beginPath(); ctx.arc(0, -8, 43, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); paint(c, 4.5); poly([[26, -22], [70, -16], [66, -6], [30, -9]], dk(c, 0.8), 4.5); circ(0, -51, 5, dk(c, 0.8), 3); }
  else if (h === 'spikes') { const p = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.05 + i * 0.9 / 8); p.push([Math.cos(a) * 40, Math.sin(a) * 40]); if (i < 8) { const b = a + Math.PI * 0.9 / 16; p.push([Math.cos(b) * (66 + (i % 2) * 14), Math.sin(b) * (66 + (i % 2) * 14)]); } } poly(p, c, 4.5); }
  else if (h === 'tails') { for (const sg of [-1, 1]) at(sg * 40, -14, sg * (0.5 + Math.sin((o.t || 0) * 9) * 0.25), 1, undefined, () => { ell(0, 30, 14, 34, c, 4.5); rect(-9, -6, 18, 10, '#ff3d6e', 3, 4); });
    ctx.beginPath(); ctx.arc(0, -6, 44, Math.PI * 0.98, Math.PI * 2.02); ctx.closePath(); paint(c, 4.5); poly([[-30, -10], [-8, -22], [8, -6], [26, -20], [40, -8], [36, -30], [0, -44], [-34, -30]], c, 0); }
  else if (h === 'helmet') { ctx.beginPath(); ctx.arc(0, -10, 45, Math.PI, Math.PI * 2); ctx.closePath(); paint(c, 4.5); rect(-50, -14, 104, 10, dk(c, 0.85), 4, 5); }
  else if (h === 'beanie') { ctx.beginPath(); ctx.arc(0, -8, 43, Math.PI * 0.98, Math.PI * 2.02); ctx.closePath(); paint(c, 4.5); rect(-45, -16, 90, 13, dk(c, 0.8), 4, 6); circ(0, -54, 8, lt(c, 0.4), 3.5); }
  else if (h === 'mop') { for (let i = 0; i < 7; i++) circ(-36 + i * 12, -30 - Math.sin(i * 1.3) * 8, 15, c, 4); }
  else if (h === 'bun') { circ(-8, -50, 15, c, 4); ctx.beginPath(); ctx.arc(0, -8, 43, Math.PI * 1.0, Math.PI * 2.0); ctx.closePath(); paint(c, 4.5); }
  else if (h === 'hood') { ctx.beginPath(); ctx.arc(-4, -2, 49, Math.PI * 0.75, Math.PI * 2.1); ctx.lineTo(10, -30); ctx.closePath(); paint(c, 4.5); }
}
// o: x,y,s,dir,t, skin,top,bot,shoe, walk|legs/knees, armF:[a,b], armB:[a,b], lean, tilt, hop, eyes,mouth,look, hat,hatC, vest, box, robe, handF(fn), handB(fn), sit
function dude(o) {
  const s = o.s || 1, dir = o.dir || 1, skin = o.skin || '#e9bd95', top = o.top || '#e8463a', bot = o.bot || '#2c3357', shoe = o.shoe || '#18151c';
  ctx.save(); ctx.translate(o.x, o.y - (o.hop || 0)); if (o.rot) ctx.rotate(o.rot); ctx.scale(s * dir, s);
  const hipY = -84, w = o.walk;
  const legs = o.legs || (w !== undefined ? [Math.sin(w * TAU) * 0.62, -Math.sin(w * TAU) * 0.62] : [0.1, -0.1]);
  const knees = o.knees || (w !== undefined ? [Math.max(0, -Math.cos(w * TAU)) * 0.95, Math.max(0, Math.cos(w * TAU)) * 0.95] : [0, 0]);
  const legLen = o.sit ? 26 : 42;
  const drawLeg = (i) => { const hx = i ? -11 : 11, a = legs[i], k = knees[i];
    const kx = hx + Math.sin(a) * legLen, ky = hipY + Math.cos(a) * legLen, fx = kx + Math.sin(a - k) * 44, fy = ky + Math.cos(a - k) * 44;
    limb([[hx, hipY], [kx, ky], [fx, fy]], 17, i ? dk(bot, 0.8) : bot); at(fx, fy, a - k > 1 ? -(a - k) + 1.2 : 0, 1, undefined, () => ell(9, 1, 20, 10, shoe, 4)); };
  if (!o.robe) { drawLeg(1); if (!o.legFront) drawLeg(0); }
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(o.lean || 0);
  const arm = (ang, col, fn, sx) => { const [a, b] = ang, ex = sx + Math.sin(a) * 36, ey = -62 + Math.cos(a) * 36, hx = ex + Math.sin(a + b) * 34, hy = ey + Math.cos(a + b) * 34;
    limb([[sx, -62], [ex, ey], [hx, hy]], 15, col); circ(hx, hy, 10.5, skin, 4); if (fn) at(hx, hy, -(a + b), 1, undefined, fn); };
  if (o.box) { rect(-78, -86, 60, 76, o.box, 5, 6, INK, true); rect(-78, -86, 60, 18, dk(o.box, 0.8), 4, 6); line([[-64, -50], [-32, -50]], 4, lt(o.box, 0.5)); }
  arm(o.armB || [-0.25, 0.2], dk(top, 0.8), o.handB, -20);
  if (o.robe) { poly([[-30, -70], [30, -70], [44, 84], [-44, 84]], top, 5, INK, true); for (const fx of [-18, 16]) ell(fx + 6, 86, 18, 9, shoe, 4); }
  else { Rc(-31, -76, 62, 86, 17); paint(top, 5, INK, true); }
  if (o.vest) { Rc(-31, -70, 62, 66, 12); paint(o.vest, 4.5); rect(-31, -34, 62, 9, '#e9eef0', 0); rect(-31, -52, 62, 6, '#e9eef0', 0); Rc(-31, -70, 62, 66, 12); paint(null, 4.5); }
  if (o.jabot) { poly([[-12, -74], [14, -74], [8, -46], [1, -52], [-6, -46]], '#fff', 3.5); }
  if (o.stripe) rect(-31, -46, 62, 12, o.stripe, 0);
  // head
  ctx.save(); ctx.translate(2, -116); ctx.rotate(o.tilt || 0);
  rect(-9, 26, 18, 18, skin, 4);
  if (o.hat === 'tails' || o.hat === 'hood' || o.hat === 'bun') hatOn(o);
  circ(0, 0, 42, skin, 5, INK, true); ell(-36, 4, 8, 11, skin, 4);
  faceOn({ eyes: o.eyes, mouth: o.mouth, look: o.look, skin });
  if (o.hat && o.hat !== 'hood' && o.hat !== 'bun') hatOn(o);
  if (o.cheeks) { circ(-12, 14, 8, 'rgba(255,90,110,.45)', 0); circ(30, 14, 8, 'rgba(255,90,110,.45)', 0); }
  ctx.restore();
  arm(o.armF || [0.25, -0.2], top, o.handF, 22);
  ctx.restore();
  if (o.legFront && !o.robe) drawLeg(0);
  ctx.restore();
}

// --- hero: the courier ----------------------------------------------------------
const COURIER = { skin: '#e2b185', top: '#009de0', bot: '#2c3357', hat: 'cap', hatC: '#0079b8', box: '#009de0', shoe: '#f6f1e4' };   // Wolt-blue uniform
const courier = (o) => dude(Object.assign({}, COURIER, o));
function tears(x, y, t, s = 1, spread = 1) {     // sprinkler tears from both eyes
  ctx.fillStyle = '#8fe3ff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5 * s;
  for (const sg of [-1, 1]) for (let i = 0; i < 9; i++) { const f = ((t * 2.2 + i / 9) % 1), vx = sg * (90 + (i % 3) * 40) * spread, px = x + sg * 14 * s + vx * f * s, py = y - (130 * f - 260 * f * f) * s;
    El(px, py, 6 * s, 9 * s, sg * 0.6); ctx.fill(); ctx.stroke(); }
}
function bike(x, y, s, dir, t, spin = 1) {
  at(x, y, 0, s * dir, s, () => { for (const wx of [-56, 56]) { circ(wx, -34, 34, null, 7); circ(wx, -34, 27, null, 2, '#888'); for (let i = 0; i < 4; i++) { const a = t * 9 * spin + i * Math.PI / 4; line([[wx - Math.cos(a) * 30, -34 - Math.sin(a) * 30], [wx + Math.cos(a) * 30, -34 + Math.sin(a) * 30]], 2, '#666'); } }
    line([[-56, -34], [-14, -86], [34, -86], [56, -34]], 7, '#3a3340'); line([[-14, -86], [4, -34], [34, -86]], 7, '#3a3340'); line([[-22, -94], [-6, -94]], 9); line([[34, -86], [40, -112], [56, -116]], 6); circ(4, -34, 8, '#333', 3); });
}
function rider(o) {              // courier (or extra) on a bike
  const t = o.t, ph = t * 2.4;
  bike(o.x, o.y, o.s, o.dir, t);
  dude(Object.assign({}, o, { y: o.y - 62 * o.s, lean: 0.38, legs: [0.9 + Math.sin(ph * TAU) * 0.45, 0.9 - Math.sin(ph * TAU) * 0.45], knees: [1.3 + Math.cos(ph * TAU) * 0.4, 1.3 - Math.cos(ph * TAU) * 0.4], armF: [1.25, -0.3], armB: [1.15, -0.3], sit: true }));
}

// --- hero: the delivery robot ---------------------------------------------------
// o: x,y,s,dir,t, eyes:'norm'|'smug'|'wink'|'angry'|'happy'|'rec', radars:0..3, medals:n, lid:0..1, arm:0..1, wheelie, roll(speed), tilt, flagC
function robot(o) {
  const s = o.s || 1, dir = o.dir || 1, t = o.t || 0, body = o.body || '#f6f1e4', acc = o.acc || '#ff3d6e';
  ctx.save(); ctx.translate(o.x, o.y - (o.hop || 0)); ctx.scale(s * dir, s); ctx.rotate((o.tilt || 0) - (o.wheelie || 0) * 0.42);
  const spin = (o.roll === undefined ? 1 : o.roll) * t * 7;
  line([[-58, -150], [-62, -238 + Math.sin(t * 8) * 4]], 4); poly([[-62, -240], [-22, -228 + Math.sin(t * 10) * 5], [-62, -214]], o.flagC || '#ff9d2e', 3.5);
  // radars on stalks
  const R = o.radars || 0;
  for (let i = 0; i < 3; i++) { const f = easeBack(clamp(R - i)); if (f <= 0) continue; const rx = -34 + i * 34, hgt = 78 * f + (i === 1 ? 22 * f : 0);
    line([[rx, -156], [rx + Math.sin(t * 5 + i) * 5, -156 - hgt]], 6);
    at(rx + Math.sin(t * 5 + i) * 5, -156 - hgt, Math.sin(t * 3 + i * 2) * 0.25, f, undefined, () => { ell(0, 0, 25, 21, '#e9eef0', 4.5); ell(4, 0, 15, 14, '#18222b', 3); circ(6 + Math.cos(t * 6 + i) * 3, Math.sin(t * 6 + i) * 3, 6, '#ff2e3d', 0); circ(9, -4, 2, '#fff', 0); }); }
  Rc(-86, -154, 172, 118, 30); paint(body, 5.5, INK, true);
  rect(-86, -96, 172, 20, acc, 0); line([[-86, -96], [86, -96]], 3); line([[-86, -76], [86, -76]], 3);
  // lid
  at(-84, -150, -(o.lid || 0) * 1.25, 1, undefined, () => { Rc(-4, -14, 176, 24, 11); paint(dk(body, 0.92), 5); });
  // visor + eyes
  Rc(6, -142, 72, 40, 14); paint('#18222b', 4.5);
  const E = o.eyes || 'norm', ec = E === 'angry' || E === 'rec' ? '#ff2e3d' : '#39f0e0';
  for (const sg of [-1, 1]) { const ex = 42 + sg * 17, ey = -122;
    if (E === 'happy') { ctx.beginPath(); ctx.arc(ex, ey + 4, 9, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = ec; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(); }
    else if (E === 'wink' && sg === 1) line([[ex - 9, ey], [ex + 9, ey]], 5, ec);
    else if (E === 'smug') { ctx.beginPath(); ctx.arc(ex, ey - 2, 10, 0, Math.PI); ctx.closePath(); ctx.fillStyle = ec; ctx.fill(); }
    else if (E === 'angry') poly([[ex - 10, ey - 9 + sg * 5], [ex + 10, ey - 9 - sg * 5], [ex + 9, ey + 8], [ex - 9, ey + 8]], ec, 0);
    else ell(ex, ey, 8.5, E === 'rec' ? 8.5 : 11 * (Math.sin(t * 1.7) > 0.96 ? 0.15 : 1), ec, 0); }
  circ(76, -58, 9, '#ffe27a', 3.5); rect(-70, -66, 40, 18, '#fff', 3, 4); text('Р-01', -50, -56, 13, { fill: INK, lw: 0, sx: dir });
  for (let i = 0; i < (o.medals || 0); i++) { const mx = -62 + i * 26, my = -124; poly([[mx - 7, my - 16], [mx + 7, my - 16], [mx + 3, my], [mx - 3, my]], i % 2 ? '#3f7fa6' : '#e8463a', 2.5); star(mx, my + 8, 11, 5, 8, '#ffd23e', 2.5, t * 2); }
  if (o.arm) { const a = o.arm, wv = Math.sin(t * 12) * 0.5; limb([[70, -110], [70 + 40 * a, -150 * a - 60], [70 + (40 + Math.sin(wv) * 40) * a, (-150 - 46) * a - 60]], 9, '#b9c2c7', 3); at(70 + (40 + Math.sin(wv) * 40) * a, (-150 - 46) * a - 60, wv, a, undefined, () => { line([[0, 0], [-10, -18]], 6); line([[0, 0], [10, -18]], 6); circ(0, 0, 7, '#b9c2c7', 3); }); }
  // wheels
  [-56, 0, 56].forEach((wx, i) => { const lift = i === 2 && o.kick ? o.kick : 0;
    at(wx + lift * 26, -22 - lift * 58, spin, 1, undefined, () => { circ(0, 0, 24, '#2b2630', 5); circ(0, 0, 10, '#b9c2c7', 3); line([[-20, 0], [20, 0]], 3, '#55505c'); line([[0, -20], [0, 20]], 3, '#55505c'); });
    if (lift) line([[wx, -40], [wx + lift * 26, -22 - lift * 58]], 9); });
  ctx.restore();
}

// --- the band on a flatbed truck ---------------------------------------------------
const trumpet = (len = 62) => () => { ctx.rotate(Math.PI / 2); line([[-46, 0], [len, 0]], 9); line([[-46, 0], [len, 0]], 5, '#ffd23e'); poly([[len - 4, -5], [len + 22, -19], [len + 22, 19], [len - 4, 5]], '#ffd23e', 4); rect(14, -12, 22, 9, '#ffd23e', 3, 3); };
const sax = () => () => { line([[0, -6], [8, 40], [34, 52], [48, 30]], 13); line([[0, -6], [8, 40], [34, 52], [48, 30]], 8, '#ffd23e'); poly([[40, 34], [66, 14], [58, 44]], '#ffd23e', 4); };
const mic = () => () => { line([[0, -12], [0, 26]], 8); circ(0, 32, 11, '#9aa3a8', 4); };
function bandMember(k, x, y, s, t, extra = {}) {
  const b = bob(t, k % 2 ? 0.5 : 0), blow = 0.5 + 0.5 * Math.sin(beatF(t) * TAU);
  const M = [
    { top: '#18151c', skin: '#f0c9a4', hat: 'spikes', hatC: '#18151c', mouth: 'yell', eyes: 'angry', armF: [1.9 + b * 0.3, 0.9], armB: [-0.6 - b * 0.8, -0.4], handF: mic(), bot: '#3a3340' },        // singer
    { top: '#e8463a', skin: '#e9bd95', hat: 'beanie', hatC: '#2f9e6b', mouth: 'o', eyes: 'shut', armF: [1.45, 0.35], armB: [1.3, 0.5], handF: trumpet(), cheeks: true, tilt: -0.25 * blow },                     // trumpet
    { top: '#3f7fa6', skin: '#d9a877', hat: 'mop', hatC: '#5b3a22', mouth: 'o', eyes: 'shut', armF: [1.2, 0.5], armB: [1.3, 0.3], handF: trumpet(86 + blow * 26), cheeks: true },                                 // trombone
    { top: '#ffd23e', skin: '#f0c9a4', hat: 'bun', hatC: '#c9552f', mouth: 'o', eyes: 'happy', armF: [0.8, 0.9], armB: [0.5, 1.0], handF: sax(), cheeks: true, tilt: 0.2 * blow },                               // sax
    { top: '#ff3d6e', skin: '#f6d2b5', hat: 'tails', hatC: '#ffe27a', mouth: 'yell', eyes: 'happy', armF: [2.6 + b * 0.4, 0.3], armB: [-2.4 - b * 0.5, -0.3], bot: '#18151c', shoe: '#fff', handF: mic() },    // girl
  ][k];
  dude(Object.assign({ x, y, s, t, hop: b * 20 * s, lean: (k % 2 ? -1 : 1) * 0.08 * Math.sin(beatF(t) * Math.PI), legs: [0.25 + b * 0.5, -0.2], knees: [b * 0.9, 0] }, M, extra));
}
function truck(x, y, s, t, o = {}) {
  const j = pulse(t, 3) * 6;
  at(x, y + j, 0, s, undefined, () => {
    rect(-330, -112, 470, 26, '#8a5a3c', 5, 4, INK, true); for (let i = 0; i < 9; i++) line([[-318 + i * 52, -110], [-318 + i * 52, -88]], 3);
    rect(-330, -150, 470, 40, '#b5764a', 5, 4); for (let i = 0; i < 9; i++) line([[-318 + i * 52, -148], [-318 + i * 52, -112]], 3);
    Rc(150, -206, 150, 122, 18); paint('#3f7fa6', 5, INK, true); Rc(178, -190, 88, 54, 10); paint('#bfe6f2', 4.5); rect(150, -112, 178, 34, '#e9eef0', 5, 8);
    circ(316, -98, 9, '#ffe27a', 3.5); rect(-330, -90, 660, 16, '#3a3340', 4);
    for (const wx of [-230, 235]) at(wx, -42, t * 9, 1, undefined, () => { circ(0, 0, 42, '#2b2630', 6); circ(0, 0, 18, '#b9c2c7', 4); line([[-36, 0], [36, 0]], 4, '#55505c'); line([[0, -36], [0, 36]], 4, '#55505c'); });
  });
  if (o.band === false) return;
  const by = y + j - 150 * s;
  // drums behind
  at(x - 250 * s, by, 0, s, undefined, () => { circ(0, -52, 52, '#fff6c9', 5); circ(0, -52, 38, '#e8463a', 4); star(0, -52, 26, 11, 5, '#ffe94a', 3, -Math.PI / 2); ell(-70, -110 - pulse(t, 4) * 10, 40, 9, '#ffd23e', 4, -0.12); line([[-70, -104], [-70, 0]], 4); });
  dude({ x: x - 250 * s, y: by - 30 * s, s: s * 0.9, t, top: '#2f9e6b', skin: '#e9bd95', hat: 'bald', mouth: 'grin', eyes: 'wide', armF: [2.2 - pulse(t, 3) * 1.4, 0.5], armB: [-2.2 + upbeat(t, 3) * 1.4, -0.5], handF: () => line([[0, -8], [0, 50]], 5, '#c9a27a'), handB: () => line([[0, -8], [0, 50]], 5, '#c9a27a'), hop: bob(t) * 10 });
  bandMember(2, x - 140 * s, by, s * 0.92, t); bandMember(1, x - 40 * s, by, s * 0.92, t); bandMember(3, x + 60 * s, by, s * 0.92, t);
  if (o.singer !== false) bandMember(0, x - 95 * s, by + 6 * s, s, t, { dir: 1 });
  if (o.girl) bandMember(4, x + 10 * s, by + 6 * s, s, t);
}

// --- street extras ------------------------------------------------------------------
const SKINS = ['#e9bd95', '#d9a877', '#c58f62', '#f0c9a4', '#b97c52'];
function extras(t, scroll, o = {}) {
  const dance = o.dance, L = [];
  // janitor sweeping
  L.push(() => { const x = tile(scroll, 1, 2300) + 880 + (dance ? 0 : Math.sin(t * 0.7) * 60), sw = Math.sin(t * 6);
    dude({ x, y: GY + 40, s: 0.72, t, dir: -1, skin: SKINS[2], top: '#5b6b77', vest: '#ff8a1f', bot: '#3a3340', hat: 'beanie', hatC: '#3f7fa6', eyes: 'norm', mouth: dance ? 'grin' : 'flat', hop: dance ? bob(t) * 26 : 0,
      armF: [0.9 + sw * 0.35, 0.5], armB: [0.6 + sw * 0.35, 0.6], handF: () => { line([[-10, -40], [34, 86]], 6, '#c9a27a'); poly([[22, 80], [46, 80], [56, 108], [14, 108]], '#d6b25a', 3.5); } }); });
  // builder with a plank
  L.push(() => { const x = tile(scroll, 1, 2600) + 1700 + t * 40 % 400;
    dude({ x, y: GY + 58, s: 0.75, t, skin: SKINS[1], top: '#3f7fa6', vest: '#c6f03a', bot: '#5b4034', hat: 'helmet', hatC: '#ff8a1f', walk: t * 1.6, mouth: dance ? 'grin' : 'smile', hop: dance ? bob(t, 0.5) * 26 : 0, armF: [2.9, 0.2], armB: [-2.9, -0.2], handF: () => rect(-150, -12, 220, 16, '#d6b25a', 4) }); });
  // couriers passing by on bikes
  [['#8f6fb5', 0.0, 330, -1], ['#5b6b77', 0.45, 260, 1], ['#7a8fd6', 0.8, 420, -1]].forEach(([c, ph, sp, d], i) => L.push(() => {
    const span = W + 700, x = (((ph * span + t * sp) % span) + span) % span - 350, X = d > 0 ? x : W - x;
    rider({ x: X, y: GY + 150 + i * 16, s: 0.62, dir: d, t: t + i, skin: SKINS[(i + 3) % 5], top: c, box: c, hat: 'cap', hatC: dk(c, 0.7), eyes: 'norm', mouth: 'flat', bot: '#2c3357' }); }));
  // taxi
  L.push(() => { const span = W + 900, x = ((t * 520) % span) - 450; at(x, GY + 205, 0, 0.9, undefined, () => { Rc(-150, -76, 300, 56, 16); paint('#ffd23e', 5, INK, true); poly([[-84, -76], [-54, -120], [56, -120], [92, -76]], '#ffd23e', 5); poly([[-66, -78], [-46, -110], [-2, -110], [-2, -78]], '#bfe6f2', 3.5); poly([[8, -78], [8, -110], [48, -110], [72, -78]], '#bfe6f2', 3.5);
      for (let i = 0; i < 8; i++) rect(-64 + i * 16, -58, 8, 8, i % 2 ? INK : '#fff', 0); rect(-16, -134, 34, 14, '#fff', 3, 3);
      for (const wx of [-92, 92]) at(wx, -20, t * 12, 1, undefined, () => { circ(0, 0, 26, '#2b2630', 5); circ(0, 0, 10, '#b9c2c7', 3); line([[-20, 0], [20, 0]], 3, '#55505c'); }); }); });
  L.forEach((f, i) => { if (!o.only || o.only.includes(i)) f(); });
}
// crowd of bobbing heads (silhouette or lit), used for audience / phone watchers
function crowd(t, y, rows, o = {}) {
  for (let r = 0; r < rows; r++) { const n = 12 + r * 2, yy = y + r * 62, sc = 0.72 + r * 0.16;
    for (let i = 0; i < n; i++) { const id = r * 31 + i, x = (i + 0.5 + (r % 2) * 0.5) * W / n + (hash(id) - 0.5) * 30, b = bob(t, hash(id * 3)) * (o.jump || 10);
      at(x, yy - b, (hash(id * 7) - 0.5) * 0.2 + Math.sin(beatF(t) * Math.PI + id) * 0.06, sc, undefined, () => {
        const col = o.dark ? pick(['#221b2e', '#2a2238', '#1d1828'], id) : pick(SKINS, id);
        if (o.hands) { const up = o.hands === 'clap' ? pulse(t + hash(id) * 0.05, 2) : 1; for (const sg of [-1, 1]) { limb([[sg * 34, 60], [sg * (30 - up * 16), -50 - up * 14]], 12, o.dark ? col : pick(['#e8463a', '#3f7fa6', '#ffd23e', '#2f9e6b', '#ff3d6e'], id)); circ(sg * (30 - up * 16), -58 - up * 14, 10, col, 4); } }
        Rc(-44, 44, 88, 120, 22); paint(o.dark ? col : pick(['#e8463a', '#3f7fa6', '#ffd23e', '#2f9e6b', '#ff3d6e', '#5b6b77'], id), 5);
        circ(0, 0, 40, col, 5);
        if (o.phone) { rect(-16, 26, 32, 52, '#18222b', 4, 6); rect(-12, 31, 24, 40, '#bff3ff', 0, 3); circ(0, 0, 40, 'rgba(160,240,255,.28)', 0); }
        if (!o.dark) { for (const sg of [-1, 1]) { circ(sg * 14, -4, 9, '#fff', 3); circ(sg * 14 + (o.lookX || 0), -2 + (o.lookY || 4), 4, INK, 0); }
          if (o.mouth === 'yell') ell(0, 20, 13, 11, '#5a1020', 3.5); else { ctx.beginPath(); ctx.arc(0, 12, 13, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); }
          const hc = pick(['#18151c', '#5b3a22', '#c9552f', '#ffe27a', '#3a3340'], id * 5); ctx.beginPath(); ctx.arc(0, -6, 42, Math.PI * 1.05, Math.PI * 1.95); ctx.closePath(); paint(hc, 4); }
      }); } }
}
