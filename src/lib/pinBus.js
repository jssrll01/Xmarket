import { supabase } from './supabase';

export const bus = { ask: null, receipt: null };
export const askPin = () => new Promise((res) => { let n = 0; const go = () => { if (bus.ask) return bus.ask(res); if (++n > 30) return res(null); setTimeout(go, 50); }; go(); });
export const showReceipt = (r) => { if (bus.receipt) bus.receipt(r); };

// calls a function without a PIN first; if the server says PIN_REQUIRED, asks for it and retries
const needsPin = (r) => {
  const m = String((r && r.data && (r.data.error || r.data.message)) || (r && r.error && r.error.message) || '')
  if (m === 'PIN_REQUIRED') return true
  return /\bpin\b/i.test(m) && !/(wrong|incorrect|invalid|locked|too many|not match)/i.test(m)
}
export async function rpcPin(name, args) {
  const first = await supabase.rpc(name, { ...args, p_pin: null });
  if (!needsPin(first)) return first;
  const pin = await askPin();
  if (pin === null || pin === undefined) return { data: { ok: false, error: 'Cancelled' }, error: null };
  return supabase.rpc(name, { ...args, p_pin: pin });
}
