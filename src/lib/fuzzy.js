// Typo and Taglish tolerant matching. Words are compared by how they sound, not how they are spelled.
const SYN = {
  sapatos: 'shoes', sapatilya: 'shoes', damit: 'shirt', kamiseta: 'shirt', pantalon: 'pants', relo: 'watch',
  selpon: 'phone', cellphone: 'phone', celphone: 'phone', cp: 'phone', kape: 'coffee', tsokolate: 'chocolate',
  gatas: 'milk', tinapay: 'bread', laruan: 'toy', pabango: 'perfume', sabon: 'soap', tsinelas: 'slippers',
  salamin: 'glasses', payong: 'umbrella', bolpen: 'pen', notbuk: 'notebook', baso: 'glass', plato: 'plate',
  kutsara: 'spoon', pitaka: 'wallet', sumbrero: 'hat', medyas: 'socks', handsfree: 'earphones', headset: 'headphones',
  pang: '', kendi: 'candy', biskwit: 'biscuit', mantika: 'oil', asukal: 'sugar', bigas: 'rice', itlog: 'egg',
};

export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '')
  .replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/ch/g, 'x').replace(/sh/g, 'x').replace(/ts/g, 's')
  .replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k').replace(/q/g, 'k').replace(/z/g, 's')
  .replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/y/g, 'i').replace(/(.)\1+/g, '$1');

function lev(a, b, lim) {
  if (Math.abs(a.length - b.length) > lim) return lim + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let mn = i;
    for (let j = 1; j <= b.length; j++) {
      const c = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      cur[j] = c;
      if (c < mn) mn = c;
    }
    if (mn > lim) return lim + 1;
    prev = cur;
  }
  return prev[b.length];
}

export function buildWordIndex(names) {
  const set = new Set();
  names.forEach((n) => String(n || '').toLowerCase().split(/[^a-z]+/).forEach((w) => { if (w.length >= 3) set.add(w); }));
  return { set, list: [...set].map((w) => [w, norm(w)]) };
}

export function correct(query, idx) {
  if (!idx || !idx.list || !idx.list.length) return '';
  const toks = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  let changed = false;
  const out = toks.map((t) => {
    if (idx.set.has(t)) return t;
    const nt = norm(t);
    const lim = nt.length <= 4 ? 1 : 2;
    let best = null;
    let bd = 99;
    for (const [w, nw] of idx.list) {
      if (w.startsWith(t)) return t;
      if (nt.length < 3) continue;
      const d = nw.startsWith(nt) ? 0 : lev(nt, nw, lim);
      if (d <= lim && d < bd) { bd = d; best = w; }
    }
    if (SYN[t]) { changed = true; return SYN[t]; }
    if (best) { changed = true; return best; }
    return t;
  });
  const res = out.join(' ').trim();
  return changed && res && res !== String(query).trim().toLowerCase() ? res : '';
}
