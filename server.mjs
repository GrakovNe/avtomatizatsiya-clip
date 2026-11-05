// Render harness: serves the clip page to headless Chrome and collects frames.
//   node server.mjs stills 1.5,10,42.2 [--scale 0.5] [--name sheet]
//   node server.mjs video out.mp4 [--from 0] [--to 126.4] [--scale 1] [--audio file.wav]
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const argv = process.argv.slice(2);
const mode = argv[0];
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const scale = parseFloat(opt('scale', mode === 'stills' ? '0.5' : '1'));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };

let ff = null, stillDir = null, stillN = 0, done = false, frames = 0, t0 = Date.now(), lastI = -1;
let query = `mode=${mode}&scale=${scale}` + (argv.includes('--nolabel') ? '&label=0' : '');
if (mode === 'stills') {
  stillDir = path.join(ROOT, 'preview', opt('name', 'sheet'));
  rmSync(stillDir, { recursive: true, force: true }); mkdirSync(stillDir, { recursive: true });
  query += `&times=${argv[1]}`;
} else if (mode === 'video') {
  const out = path.resolve(argv[1]);
  if (existsSync(out) && !argv.includes('--overwrite')) { console.error('output exists: ' + out); process.exit(1); }
  const from = parseFloat(opt('from', '0')), to = opt('to', '');
  const audio = opt('audio', '');
  const fps = opt('fps', '25');
  query += `&from=${from}&fps=${fps}` + (to ? `&to=${to}` : '');
  const a = ['-nostdin', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', fps, '-c:v', 'mjpeg', '-i', '-'];
  if (audio) a.push('-ss', String(from), '-i', audio, '-c:a', 'aac', '-b:a', '256k', '-shortest');
  a.push('-c:v', 'libx264', '-preset', 'medium', '-crf', opt('crf', '17'), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  ff = spawn('ffmpeg', a, { stdio: ['pipe', 'inherit', 'inherit'] });
} else { console.error('mode: stills | video'); process.exit(1); }

const body = (req) => new Promise((res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => res(Buffer.concat(c))); });
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (req.method === 'POST' && u.pathname === '/frame') {
      const b = await body(req); const idx = u.searchParams.get('i'); if (idx !== null) { if (+idx <= lastI) return res.end('ok'); lastI = +idx; } frames++;
      if (ff) { if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r)); }
      else writeFileSync(path.join(stillDir, `f${String(stillN++).padStart(3, '0')}.jpg`), b);
      if (frames % 250 === 0) console.log(`frame ${frames} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
      res.end('ok');
    } else if (req.method === 'POST' && u.pathname === '/log') {
      const msg = (await body(req)).toString(); console.log('[page] ' + msg); res.end('ok');
      if (/^(ERROR|REJECT|FATAL)/.test(msg)) setTimeout(() => { console.error('page error, aborting'); if (chrome) chrome.kill('SIGKILL'); if (ff) ff.kill('SIGKILL'); process.exit(1); }, 300);
    } else if (u.pathname === '/done') {
      res.end('ok'); done = true; finish();
    } else {
      const f = path.join(ROOT, decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
      if (!f.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }
      const data = await readFile(f);
      res.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store'); res.end(data);
    }
  } catch (e) { res.statusCode = 404; res.end(String(e)); }
});

let chrome = null;
function finish() {
  if (chrome) chrome.kill('SIGKILL');
  server.close(); setTimeout(() => rmSync(path.join(ROOT, 'work', 'chrome-profile-' + process.pid), { recursive: true, force: true }), 200);
  const end = () => { console.log(`done: ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`); process.exit(0); };
  if (ff) { ff.stdin.end(); ff.on('close', end); }
  else {
    const cols = Math.min(4, stillN) || 1;
    const sheet = stillDir + '.jpg';
    spawnSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-framerate', '1', '-i', path.join(stillDir, 'f%03d.jpg'), '-vf', `tile=${cols}x${Math.ceil(stillN / cols)}:padding=6:color=black`, '-frames:v', '1', '-q:v', '3', sheet], { stdio: 'inherit' });
    console.log('sheet: ' + sheet); end();
  }
}
server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  const prof = path.join(ROOT, 'work', 'chrome-profile-' + process.pid);   // own profile per run: renders can overlap
  chrome = spawn(CHROME, ['--headless=new', `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--mute-audio', '--hide-scrollbars', '--remote-debugging-port=0', '--window-size=1280,720', `http://127.0.0.1:${port}/index.html?${query}`], { stdio: 'ignore' });
  chrome.on('exit', () => { if (!done) { console.error('chrome exited early'); process.exit(1); } });
});
setTimeout(() => { if (!done) { console.error('timeout'); if (chrome) chrome.kill('SIGKILL'); process.exit(1); } }, 1000 * 60 * 120);
