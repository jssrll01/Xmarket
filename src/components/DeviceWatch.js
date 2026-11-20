import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getDeviceId, deviceLabel } from '../lib/devices';

const K = 'xm_dev_seen';
function run() {
  let last = 0;
  try { last = Number(localStorage.getItem(K) || 0); } catch (e) { last = 0; }
  if (Date.now() - last < 6 * 3600 * 1000) return;
  supabase.auth.getSession().then(({ data }) => {
    if (!data || !data.session) return;
    supabase.rpc('device_seen', { p_device: getDeviceId(), p_label: deviceLabel() }).then(() => {
      try { localStorage.setItem(K, String(Date.now())); } catch (e) {}
    });
  });
}

export default function DeviceWatch() {
  useEffect(() => {
    run();
    const { data } = supabase.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_IN') run(); });
    return () => { if (data && data.subscription) data.subscription.unsubscribe(); };
  }, []);
  return null;
}
