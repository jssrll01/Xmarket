import { supabase } from './supabase';

// Display-only currency. Every amount in Xmarket stays in pesos; this only changes how a price looks.
// rate = how much of this currency equals 1 peso.
const KEY = 'xm_currency';
const RKEY = 'xm_currency_rates';
export const DEFAULTS = [
  { code: 'PHP', symbol: '₱', rate: 1, name: 'Philippine Peso' },
  { code: 'GBP', symbol: '£', rate: 0.01183, name: 'British Pound' },
  { code: 'USD', symbol: '$', rate: 0.01573, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.01417, name: 'Euro' },
  { code: 'JPY', symbol: '¥', rate: 2.5101, name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', rate: 21.13, name: 'Korean Won' },
  { code: 'RUB', symbol: '₽', rate: 1.305, name: 'Russian Ruble' },
];

function readRates() {
  try {
    const r = JSON.parse(localStorage.getItem(RKEY));
    if (Array.isArray(r) && r.some((c) => c.code === 'PHP')) return r;
  } catch (e) { /* storage blocked or empty */ }
  return DEFAULTS;
}
let RATES = readRates();

export const currencies = () => RATES;
export function currentCode() {
  try { return localStorage.getItem(KEY) || 'PHP'; } catch (e) { return 'PHP'; }
}
function cur() {
  return RATES.find((c) => c.code === currentCode()) || RATES.find((c) => c.code === 'PHP') || DEFAULTS[0];
}
export const isPeso = () => cur().code === 'PHP';
export const symbol = () => cur().symbol;

// Gets the latest list from the database. A changed rate applies from the next page load.
export function refreshCurrencies() {
  return Promise.resolve(supabase.rpc('currencies_public')).then(({ data, error }) => {
    if (!error && Array.isArray(data) && data.some((c) => c.code === 'PHP')) {
      RATES = data.map((c) => ({ code: c.code, symbol: c.symbol, rate: Number(c.rate) || 1, name: c.name || '' }));
      try { localStorage.setItem(RKEY, JSON.stringify(RATES)); } catch (e) { /* ignore */ }
    }
    return RATES;
  }).catch(() => RATES);
}
if (typeof window !== 'undefined') refreshCurrencies();

export function setCurrency(code) {
  try { localStorage.setItem(KEY, code); } catch (e) { /* ignore */ }
  window.location.reload();
}

// n is always pesos. Modes keep the old peso output exactly the same:
//   auto    -> n.toLocaleString()
//   fixed   -> 2 decimals with commas (en-PH)
//   tofixed -> n.toFixed(2)
//   plain   -> up to 2 decimals with commas
//   int     -> n.toFixed(0)
//   raw     -> the value as it was written
// Other currencies always show 2 decimals.
export function money(n, mode = 'auto') {
  const c = cur();
  if (c.code === 'PHP') {
    if (mode === 'raw') return c.symbol + n;
    const v = Number(n || 0);
    if (mode === 'fixed') return c.symbol + v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (mode === 'tofixed') return c.symbol + v.toFixed(2);
    if (mode === 'int') return c.symbol + v.toFixed(0);
    if (mode === 'plain') return c.symbol + v.toLocaleString('en-PH', { maximumFractionDigits: 2 });
    return c.symbol + v.toLocaleString();
  }
  const x = Number(n || 0) * Number(c.rate || 1);
  return c.symbol + x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// For big averages: 12.3k
export function moneyShort(n) {
  const c = cur();
  const x = Number(n || 0) * (c.code === 'PHP' ? 1 : Number(c.rate || 1));
  if (x >= 1000) return c.symbol + (x / 1000).toFixed(1) + 'k';
  return c.code === 'PHP' ? c.symbol + x.toLocaleString() : money(n);
}
