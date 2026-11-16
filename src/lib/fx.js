import { supabase } from './supabase';

export async function fx(fn, args) {
  const { data, error } = await supabase.rpc(fn, args || {});
  if (error) throw new Error(error.message || 'Something went wrong. Please try again.');
  return data;
}
export const when = (t) => { try { return new Date(t).toLocaleString(); } catch (e) { return ''; } };
export const S = {
  page: { padding: '16px 16px 120px', maxWidth: 560, margin: '0 auto' },
  card: { padding: 14, borderRadius: 18, background: 'var(--card)', boxShadow: 'var(--raised-sm)', marginBottom: 12 },
  h1: { fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: 0 },
  sub: { fontSize: 12.5, color: 'var(--muted)', margin: '3px 0 14px' },
  muted: { fontSize: 12, color: 'var(--muted)' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10 },
  btn: { padding: '11px 16px', borderRadius: 14, border: 0, background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  input: { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14, border: 0, background: 'var(--bg)', boxShadow: 'var(--inset)', color: 'var(--text)', fontSize: 14, outline: 0, marginBottom: 10 },
  bar: { height: 8, borderRadius: 99, background: 'var(--bg)', boxShadow: 'var(--inset)', overflow: 'hidden', marginTop: 8 },
  err: { padding: 12, borderRadius: 14, background: '#FEE2E2', color: '#B91C1C', fontSize: 13, marginBottom: 12 },
};
