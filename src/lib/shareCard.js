import { money } from './currency';
import { nameOf, imgOf, priceOf } from './productIndex';

async function bitmap(url) {
  try { const r = await fetch(url, { mode: 'cors' }); return await createImageBitmap(await r.blob()); } catch (e) {}
  try {
    return await new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = url; });
  } catch (e) { return null; }
}
const rr = (x, X, Y, w, h, r) => {
  x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
};
function lines(x, text, maxW, maxL) {
  const out = []; let l = '';
  String(text).split(/\s+/).forEach((w) => { const t = l ? l + ' ' + w : w; if (x.measureText(t).width > maxW && l) { out.push(l); l = w; } else l = t; });
  if (l) out.push(l);
  if (out.length > maxL) { const k = out.slice(0, maxL); k[maxL - 1] = k[maxL - 1].replace(/\s*\S*$/, '') + '…'; return k; }
  return out;
}

export async function makeCard(p) {
  const W = 1080, H = 1350;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.textAlign = 'left'; x.fillStyle = '#2563EB'; x.font = '800 44px sans-serif'; x.fillText('XMARKET', 60, 100);
  rr(x, 60, 150, 960, 760, 40); x.fillStyle = '#F4F6FA'; x.fill();
  const url = imgOf(p);
  const im = url ? await bitmap(url) : null;
  if (im) {
    const iw = im.width, ih = im.height, s = Math.min(900 / iw, 700 / ih), dw = iw * s, dh = ih * s;
    x.save(); rr(x, 60, 150, 960, 760, 40); x.clip(); x.drawImage(im, 60 + (960 - dw) / 2, 150 + (760 - dh) / 2, dw, dh); x.restore();
  } else {
    x.fillStyle = '#CBD5E1'; x.font = '800 220px sans-serif'; x.textAlign = 'center'; x.fillText((nameOf(p)[0] || 'X').toUpperCase(), 540, 590); x.textAlign = 'left';
  }
  x.fillStyle = '#0F172A'; x.font = '700 58px sans-serif';
  const ls = lines(x, nameOf(p), 960, 2);
  ls.forEach((t, i) => x.fillText(t, 60, 990 + i * 66));
  const price = priceOf(p);
  if (price > 0) { x.fillStyle = '#2563EB'; x.font = '900 80px sans-serif'; x.fillText(money(price, 'fixed'), 60, 990 + (ls.length - 1) * 66 + 105); }
  rr(x, 60, 1220, 960, 84, 24); x.fillStyle = '#2563EB'; x.fill();
  x.fillStyle = '#fff'; x.font = '800 34px sans-serif'; x.textAlign = 'center'; x.fillText('Shop now on XMARKET', 540, 1274);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}
