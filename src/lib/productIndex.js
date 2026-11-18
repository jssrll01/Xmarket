import { supabase } from './supabase';
import { cfg } from './searchBoostConfig';

let cache = null;
let pending = null;
const KEYS = ['barcode', 'bar_code', 'upc', 'ean', 'gtin', 'sku', 'code', 'product_code'];
const dg = (v) => String(v == null ? '' : v).replace(/\D/g, '').replace(/^0+/, '');

export const nameOf = (p) => (p && (p.name || p.title || p.product_name)) || '';
export const priceOf = (p) => Number((p && (p.price != null ? p.price : p.sale_price != null ? p.sale_price : p.selling_price)) || 0);
export const imgOf = (p) => {
  if (!p) return '';
  const c = [p.image, p.image_url, p.img, p.thumbnail, p.photo, p.cover, p.main_image];
  for (const v of c) if (typeof v === 'string' && v) return v;
  const a = p.images || p.image_urls || p.photos;
  if (Array.isArray(a) && a.length) { const f = a[0]; return typeof f === 'string' ? f : (f && (f.url || f.src)) || ''; }
  return '';
};
export const productPath = (p) => cfg.route.replace(/:[A-Za-z]+/, encodeURIComponent(String(p[cfg.param] != null ? p[cfg.param] : p.id)));

export function loadProducts() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = supabase.from(cfg.table).select('*').limit(1500)
      .then(({ data }) => { cache = Array.isArray(data) ? data : []; return cache; })
      .catch(() => { cache = []; return cache; });
  }
  return pending;
}

export function findByCode(list, code) {
  const raw = String(code).trim().toLowerCase();
  const d = dg(raw);
  let hasField = false;
  for (const p of list) {
    for (const k of KEYS) {
      const v = p[k];
      if (v == null || v === '') continue;
      hasField = true;
      if (String(v).trim().toLowerCase() === raw || (d.length >= 6 && dg(v) === d)) return { product: p, hasField: true };
    }
  }
  return { product: null, hasField };
}
