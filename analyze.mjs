// Audio analysis for the clip: loudness envelope per video frame + beat grid.
// Usage: node analyze.mjs "<audio file>"  -> writes work/audio.js (window.AUDIO = {...})
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const src = process.argv[2];
const SR = 11025, FPS = 25, HOP = 128;
const dec = spawnSync('ffmpeg', ['-nostdin', '-v', 'error', '-i', src, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'],
  { maxBuffer: 1 << 30 });
if (dec.status !== 0) { console.error(dec.stderr.toString()); process.exit(1); }
const pcm = new Float32Array(dec.stdout.buffer, dec.stdout.byteOffset, dec.stdout.length >> 2);
const dur = pcm.length / SR;

// split into low band (one-pole LPF ~150 Hz) and the rest
const low = new Float32Array(pcm.length), high = new Float32Array(pcm.length);
{ const a = Math.exp(-2 * Math.PI * 150 / SR); let y = 0;
  for (let i = 0; i < pcm.length; i++) { y = a * y + (1 - a) * pcm[i]; low[i] = y; high[i] = pcm[i] - y; } }

const nh = Math.floor(pcm.length / HOP);
const eL = new Float32Array(nh), eH = new Float32Array(nh), eA = new Float32Array(nh);
for (let h = 0; h < nh; h++) {
  let a = 0, b = 0, c = 0;
  for (let i = h * HOP; i < (h + 1) * HOP; i++) { a += low[i] * low[i]; b += high[i] * high[i]; c += pcm[i] * pcm[i]; }
  eL[h] = Math.log(a / HOP + 1e-9); eH[h] = Math.log(b / HOP + 1e-9); eA[h] = c / HOP;
}
const onset = new Float32Array(nh);
for (let h = 1; h < nh; h++) onset[h] = Math.max(0, eL[h] - eL[h - 1]) + Math.max(0, eH[h] - eH[h - 1]);
// local-mean normalisation so loud sections do not dominate
{ const w = 86; const out = new Float32Array(nh); let s = 0;
  for (let h = 0; h < nh; h++) { s += onset[h]; if (h >= w) s -= onset[h - w]; out[h] = Math.max(0, onset[h] - s / Math.min(h + 1, w)); }
  onset.set(out); }

const hopSec = HOP / SR;
const at = (tSec) => { const x = tSec / hopSec, i = Math.floor(x); if (i < 0 || i + 1 >= nh) return 0; const f = x - i; return onset[i] * (1 - f) + onset[i + 1] * f; };
function comb(period, phase) { let s = 0, n = 0; for (let t = phase; t < dur; t += period) { s += at(t); n++; } return s / n; }
let cands = [];
for (let bpm = 70; bpm <= 210; bpm += 0.05) {
  const p = 60 / bpm; let best = 0, bp = 0;
  for (let ph = 0; ph < p; ph += 0.008) { const s = comb(p, ph); if (s > best) { best = s; bp = ph; } }
  cands.push({ bpm, phase: bp, score: best });
}
cands.sort((a, b) => b.score - a.score);
const top = []; for (const c of cands) { if (top.every(t => Math.abs(t.bpm - c.bpm) > 2)) top.push(c); if (top.length >= 6) break; }
console.log('tempo candidates:', top.map(c => `${c.bpm.toFixed(2)}bpm ph=${c.phase.toFixed(3)} s=${c.score.toFixed(3)}`).join(' | '));

// prefer the fastest strong candidate inside the ska-punk range, else the top one
const strong = top.filter(c => c.score > top[0].score * 0.8 && c.bpm >= 140 && c.bpm <= 205);
const pick = strong.length ? strong.sort((a, b) => b.score - a.score)[0] : top[0];
// refine
let best = pick;
for (let bpm = pick.bpm - 0.3; bpm <= pick.bpm + 0.3; bpm += 0.005) {
  const p = 60 / bpm; for (let ph = 0; ph < p; ph += 0.004) { const s = comb(p, ph); if (s > best.score) best = { bpm, phase: ph, score: s }; }
}
console.log(`picked ${best.bpm.toFixed(3)} bpm, phase ${best.phase.toFixed(3)} s`);
// drift check: best phase per 10 s window with the picked period
{ const p = 60 / best.bpm; const rows = [];
  for (let w0 = 0; w0 + 10 <= dur; w0 += 10) { let bs = -1, bph = 0;
    for (let ph = 0; ph < p; ph += 0.004) { let s = 0; const first = w0 + ((ph - w0) % p + p) % p; for (let t = first; t < w0 + 10; t += p) s += at(t); if (s > bs) { bs = s; bph = ph; } }
    let d = bph - best.phase; if (d > p / 2) d -= p; if (d < -p / 2) d += p; rows.push(d.toFixed(2)); }
  console.log('phase offset per 10 s window (s):', rows.join(' ')); }

// per-video-frame envelopes
const nf = Math.ceil(dur * FPS);
const env = [], kick = [], ons = [];
let mx = 0; for (let h = 0; h < nh; h++) mx = Math.max(mx, eA[h]);
for (let f = 0; f < nf; f++) {
  const h0 = Math.floor(f / FPS / hopSec), h1 = Math.max(h0 + 1, Math.floor((f + 1) / FPS / hopSec));
  let a = 0, l = -99, o = 0, n = 0;
  for (let h = h0; h < h1 && h < nh; h++) { a += eA[h]; l = Math.max(l, eL[h]); o = Math.max(o, onset[h]); n++; }
  const db = 10 * Math.log10((n ? a / n : 0) / mx + 1e-9);
  env.push(+Math.max(0, Math.min(1, 1 + db / 45)).toFixed(3));
  kick.push(+l.toFixed(2)); ons.push(+o.toFixed(3));
}
const kmin = Math.min(...kick.filter(v => v > -20)), kmax = Math.max(...kick);
const kn = kick.map(v => +Math.max(0, Math.min(1, (v - kmin) / (kmax - kmin))).toFixed(3));
const omax = [...ons].sort((a, b) => a - b)[Math.floor(ons.length * 0.995)] || 1;
const on = ons.map(v => +Math.min(1, v / omax).toFixed(3));
writeFileSync(new URL('./work/audio.js', import.meta.url),
  `window.AUDIO=${JSON.stringify({ fps: FPS, dur, bpm: +best.bpm.toFixed(3), beat0: +best.phase.toFixed(3), env, kick: kn, onset: on })};\n`);
console.log(`frames ${nf}, duration ${dur.toFixed(2)} s -> work/audio.js`);
