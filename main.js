'use strict';
(async function () {
  const q = new URLSearchParams(location.search);
  const mode = q.get('mode'), scale = parseFloat(q.get('scale') || '1');
  const cv = document.getElementById('c'); cv.width = Math.round(W * scale); cv.height = Math.round(H * scale);
  ctx = cv.getContext('2d'); window.RENDER_SCALE = scale; initPost(cv);
  // frames go out as plain bytes (no Blob objects: thousands of large blobs exhaust Chrome's blob storage)
  let seq = 0;
  const send = async (bytes) => { const i = seq++;
    for (let k = 0; ; k++) { try { const r = await fetch('/frame?i=' + i, { method: 'POST', body: bytes }); if (r.ok) return; throw new Error('status ' + r.status); }
      catch (e) { if (k >= 8) throw e; await new Promise((r) => setTimeout(r, 300 * (k + 1))); } } };
  const grab = async (ql) => { const s = cv.toDataURL('image/jpeg', ql), b = atob(s.slice(s.indexOf(',') + 1)), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  const render = (t) => { ctx.setTransform(scale, 0, 0, scale, 0, 0); drawFrame(t); };
  try {
    if (mode === 'stills') {
      for (const s of q.get('times').split(',')) { const t = parseFloat(s); render(t);
        if (q.get('label') !== '0') text(t.toFixed(2) + '  ' + shotName(t), 16, H - 20, 30, { align: 'left', fill: '#fff', lw: 6, font: 'monospace' }); await send(await grab(0.92)); }
    } else {
      const fps = parseFloat(q.get('fps') || String(A.fps));
      const f0 = Math.round(parseFloat(q.get('from') || '0') * fps), f1 = Math.round(parseFloat(q.get('to') || String(A.dur)) * fps);
      for (let f = f0; f < f1; f++) { render(f / fps); await send(await grab(0.95)); }
    }
  } catch (e) { await fetch('/log', { method: 'POST', body: 'FATAL ' + (e.stack || e) }); }
  await fetch('/done');
})();
