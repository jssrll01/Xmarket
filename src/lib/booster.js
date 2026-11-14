import { supabase } from './supabase';

const PLAT = {
  Facebook: { bg: '#1877F2', glyph: 'f' },
  Instagram: { bg: 'linear-gradient(45deg,#F9A825,#E1306C,#7B3FE4)', glyph: 'IG' },
  TikTok: { bg: '#111827', glyph: 'TT' },
  YouTube: { bg: '#FF0000', glyph: 'YT' }
};
export const platformStyle = (p) => PLAT[p] || { bg: '#2563EB', glyph: String(p || '?').slice(0, 2).toUpperCase() };

export const STATUS_INFO = {
  pending: { label: 'Pending review', color: '#92400E', bg: '#FEF3C7' },
  starting: { label: 'Starting', color: '#1D4ED8', bg: '#DBEAFE' },
  ongoing: { label: 'In progress', color: '#5B21B6', bg: '#EDE9FE' },
  completed: { label: 'Completed', color: '#047857', bg: '#D1FAE5' },
  cancelled: { label: 'Cancelled', color: '#B91C1C', bg: '#FEE2E2' }
};
export const STEPS = ['pending', 'starting', 'ongoing', 'completed'];

export const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const num = (n) => Number(n || 0).toLocaleString('en-PH');
export const calcTotal = (price, qty, per) => {
  const p = Number(price);
  const q = Number(qty);
  const r = Number(per);
  if (!p || !q || !r) return 0;
  return Math.round((p * q * 100) / r) / 100;
};
export const newKey = () => {
  try {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  } catch (e) { /* fall through */ }
  return 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
};

async function call(fn, args) {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message || 'Something went wrong. Please try again.');
  return data;
}

export const boosterMeta = () => call('booster_meta');

export async function boosterList({ platform = null, category = null, q = null, popular = false, limit = 8, offset = 0 } = {}) {
  const r = await call('booster_list', { p_platform: platform, p_category: category, p_q: q, p_popular: popular, p_limit: limit, p_offset: offset });
  return { items: (r && r.items) || [], total: Number((r && r.total) || 0) };
}

export async function myBoostOrders() {
  const r = await call('booster_my_orders', { p_limit: 100 });
  return Array.isArray(r) ? r : [];
}
