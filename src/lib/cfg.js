import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Reads app content from the database. Everything returns null when the
// use_db_config flag is off or a query fails, so callers keep their old constants.
const TTL = 5 * 60 * 1000;
const mem = new Map();

function cached(key, loader) {
  const hit = mem.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.promise;
  const promise = Promise.resolve()
    .then(loader)
    .catch(() => {
      mem.delete(key);
      return null;
    });
  mem.set(key, { at: Date.now(), promise });
  return promise;
}

export function clearCfgCache() {
  mem.clear();
}

export function dbConfigOn() {
  return cached('flag', async () => {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'use_db_config')
      .maybeSingle();
    if (error) throw error;
    return data?.value === 'true';
  }).then((v) => v === true);
}

async function rows(table, columns) {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function fromDb(table, columns, shape) {
  if (!(await dbConfigOn())) return null;
  const data = await cached(table, () => rows(table, columns));
  if (!data || !data.length) return null;
  const out = shape(data);
  return out && out.length ? out : null;
}

// Same shapes as the old constants in each page
export const loadPayments = (usedFor) =>
  fromDb(
    'payment_methods',
    'code,name,name_topup,qr_url,instructions,instructions_topup,used_for',
    (list) =>
      list
        .filter((p) => (p.used_for || []).includes(usedFor))
        .map((p) => ({
          id: p.code,
          label: usedFor === 'topup' ? p.name_topup || p.name : p.name,
          note: usedFor === 'topup' ? p.instructions_topup || p.instructions : p.instructions,
          ...(p.qr_url ? { qr: p.qr_url } : {}),
        }))
  );

export const loadDeliveries = () =>
  fromDb('delivery_methods', 'code,name,description,digital_only', (list) =>
    list.map((d) => ({
      id: d.code,
      label: d.name,
      note: d.description,
      ...(d.digital_only ? { instantOnly: true } : {}),
    }))
  );

export const loadXcardValues = () =>
  fromDb('xcard_denominations', 'value', (list) => list.map((r) => r.value));

export const loadReturnReasons = () =>
  fromDb('return_reasons', 'label', (list) => list.map((r) => r.label));

export const loadSupportChannels = () =>
  fromDb('support_channels', 'label,sub,href,icon,color', (list) =>
    list.map((c) => ({ icon: c.icon, label: c.label, sub: c.sub, href: c.href, color: c.color }))
  );

export const loadReportCategories = () =>
  fromDb('report_categories', 'code,label', (list) =>
    list.map((r) => ({ id: r.code, label: r.label }))
  );

async function settingsMap() {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('key,value')
    .eq('group_name', 'content_config')
    .eq('is_enabled', true);
  if (error) throw error;
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]));
}

export async function loadSetting(key, parse = (v) => v) {
  if (!(await dbConfigOn())) return null;
  const map = await cached('settings', settingsMap);
  if (!map || map[key] == null || map[key] === '') return null;
  try {
    return parse(map[key]);
  } catch {
    return null;
  }
}

// Renders with the fallback first, then swaps in database data if available
export function useCfg(loader, fallback) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    let live = true;
    loader()
      .then((v) => {
        if (live && v) setValue(v);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return value;
}

// FAQ rows for one page (scope), as [question, answer] pairs
export const loadFaqs = (scope) =>
  fromDb('faqs', 'scope,question,answer', (list) =>
    list.filter((f) => f.scope === scope).map((f) => [f.question, f.answer])
  );

// Help index: [{ name, items: [{ t, slug }] }] in the same shape as the old CATEGORIES constant
export async function loadHelp() {
  if (!(await dbConfigOn())) return null;
  const data = await cached('help', async () => {
    const [c, a] = await Promise.all([
      supabase.from('help_categories').select('id,title').eq('active', true).order('sort_order', { ascending: true }),
      supabase.from('help_articles').select('category_id,slug,title').eq('active', true).order('sort_order', { ascending: true }),
    ]);
    if (c.error) throw c.error;
    if (a.error) throw a.error;
    return { c: c.data || [], a: a.data || [] };
  });
  if (!data || !data.c.length || !data.a.length) return null;
  const out = data.c
    .map((cat) => ({ name: cat.title, items: data.a.filter((x) => x.category_id === cat.id).map((x) => ({ t: x.title, slug: x.slug })) }))
    .filter((cat) => cat.items.length);
  return out.length ? out : null;
}

// Article text written in the database, or null so the built-in page is used
export async function loadHelpBody(slug) {
  if (!(await dbConfigOn())) return null;
  const { data, error } = await supabase.from('help_articles').select('title,body').eq('slug', slug).eq('active', true).maybeSingle();
  if (error || !data || !String(data.body || '').trim()) return null;
  return { title: data.title, body: data.body };
}
