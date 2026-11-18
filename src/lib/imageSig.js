import { imgOf } from './productIndex';

const cache = new Map();

export function loadImg(src, cors) {
  return new Promise((res, rej) => {
    const i = new Image();
    if (cors) i.crossOrigin = 'anonymous';
    const t = setTimeout(() => rej(new Error('timeout')), 8000);
    i.onload = () => { clearTimeout(t); res(i); };
    i.onerror = () => { clearTimeout(t); rej(new Error('load')); };
    i.src = src;
  });
}

function hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx];
}

// 4x4 grid of average colours + a hue histogram. Centre-cropped so photo shape does not matter.
export function signature(img) {
  try {
    const S = 32;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const x = c.getContext('2d', { willReadFrequently: true });
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const m = Math.min(w, h);
    x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
    x.drawImage(img, (w - m) / 2, (h - m) / 2, m, m, 0, 0, S, S);
    const d = x.getImageData(0, 0, S, S).data;
    const grid = new Array(48).fill(0), gn = new Array(16).fill(0), hist = new Array(14).fill(0);
    for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
      const o = (py * S + px) * 4, r = d[o], g = d[o + 1], b = d[o + 2];
      const cell = Math.floor(py / 8) * 4 + Math.floor(px / 8);
      grid[cell * 3] += r / 255; grid[cell * 3 + 1] += g / 255; grid[cell * 3 + 2] += b / 255; gn[cell]++;
      const [hh, s, v] = hsv(r, g, b);
      if (v < 0.2) hist[12] += 1; else if (s < 0.15 && v > 0.85) hist[13] += 1; else if (s >= 0.2) hist[Math.min(11, Math.floor(hh / 30))] += s;
    }
    for (let i = 0; i < 48; i++) grid[i] /= gn[Math.floor(i / 3)];
    const tot = hist.reduce((a, b) => a + b, 0) || 1;
    return [...grid, ...hist.map((v) => (v / tot) * 2)];
  } catch (e) { return null; }
}

const sim = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2; return 1 / (1 + Math.sqrt(s)); };

export async function rankSimilar(mine, products, max = 200) {
  const withImg = products.filter((p) => /^(https?:)?\/\//.test(imgOf(p))).slice(0, max);
  const jobs = withImg.slice();
  const worker = async () => {
    while (jobs.length) {
      const p = jobs.pop();
      if (cache.has(p.id)) continue;
      try { cache.set(p.id, signature(await loadImg(imgOf(p), true))); } catch (e) { cache.set(p.id, null); }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  const scored = [];
  withImg.forEach((p) => { const s = cache.get(p.id); if (s) scored.push({ p, s: sim(mine, s) }); });
  scored.sort((a, b) => b.s - a.s);
  return { items: scored.slice(0, 8).map((x) => x.p), compared: scored.length };
}
