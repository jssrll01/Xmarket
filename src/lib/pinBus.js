import { supabase } from './supabase';

export const bus = { ask: null, receipt: null };
export const askPin = () => new Promise((res) => { if (!bus.ask) return res(null); bus.ask(res); });
export const showReceipt = (r) => { if (bus.receipt) bus.receipt(r); };

// calls a function without a PIN first; if the server says PIN_REQUIRED, asks for it and retries
export async function rpcPin(name, args) {
  const first = await supabase.rpc(name, { ...args, p_pin: null });
  if (!first.data || first.data.error !== 'PIN_REQUIRED') return first;
  const pin = await askPin();
  if (pin === null) return { data: { ok: false, error: 'Cancelled' }, error: null };
  return supabase.rpc(name, { ...args, p_pin: pin });
}
