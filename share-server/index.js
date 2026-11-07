import express from 'express';

const app = express();
const SB = process.env.SUPABASE_URL || 'https://dmdjytwrgqnvxdxdlnrp.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY || '';
const SITE = (process.env.SITE_URL || 'https://xmarket-app.onrender.com').replace(/\/$/, '');
const PORT = process.env.PORT || 3000;
const cache = new Map();

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const peso = (n) => '₱' + Number(n).toLocaleString('en-PH', { maximumFractionDigits: 2 });

function firstImage(v) {
  let a = v;
  if (typeof a === 'string') { try { a = JSON.parse(a); } catch { a = [a]; } }
  const u = Array.isArray(a) ? a.find((x) => typeof x === 'string' && /^https:\/\//i.test(x)) : null;
  if (!u) return '';
  return u.includes('res.cloudinary.com') && u.includes('/upload/') ? u.replace('/upload/', '/upload/c_fill,w_1200,h_630,f_jpg,q_auto/') : u;
}
function lowestPrice(vp) {
  let o = vp;
  if (typeof o === 'string') { try { o = JSON.parse(o); } catch { return null; } }
  const nums = (o && typeof o === 'object' ? Object.values(o) : [o]).map(Number).filter((n) => n > 0);
  return nums.length ? Math.min(...nums) : null;
}
async function getProduct(id) {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.t < 5 * 60 * 1000) return hit.v;
  const col = /^\d+$/.test(id) ? 'legacy_id=eq.' + id : 'id=eq.' + encodeURIComponent(id);
  let v = null;
  try {
    const r = await fetch(SB + '/rest/v1/products?select=name,description,images,variant_prices&limit=1&' + col, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
    if (r.ok) { const j = await r.json(); v = j[0] || null; }
  } catch { /* fall back below */ }
  cache.set(id, { t: Date.now(), v });
  if (cache.size > 500) cache.clear();
  return v;
}

app.get('/', (req, res) => res.type('text').send('XMARKET share service'));

app.get('/p/:id', async (req, res) => {
  const id = String(req.params.id).slice(0, 64);
  if (!/^[A-Za-z0-9-]+$/.test(id)) return res.redirect(302, SITE);
  const p = await getProduct(id);
  const target = SITE + '/product/' + encodeURIComponent(id);
  const price = p ? lowestPrice(p.variant_prices) : null;
  const title = p ? p.name + (price ? ' · ' + peso(price) : '') : 'XMARKET';
  const desc = p && p.description ? String(p.description).replace(/\s+/g, ' ').slice(0, 180) : 'Shop great deals on XMARKET.';
  const img = p ? firstImage(p.images) : '';
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta property="og:type" content="product"><meta property="og:site_name" content="XMARKET">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(target)}">${img ? `<meta property="og:image" content="${esc(img)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : ''}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">${img ? `<meta name="twitter:image" content="${esc(img)}">` : ''}
<meta http-equiv="refresh" content="0;url=${esc(target)}"><link rel="canonical" href="${esc(target)}"></head>
<body style="font-family:system-ui;text-align:center;padding:40px"><p>Opening XMARKET…</p><p><a href="${esc(target)}">Tap here if nothing happens</a></p>
<script>location.replace(${JSON.stringify(target)})</script></body></html>`);
});

app.listen(PORT, () => console.log('share service on ' + PORT));
