import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useServerPrefs() {
  const [sp, setSp] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    let on = true;
    supabase.rpc('prefs_get').then(({ data, error }) => {
      if (!on) return;
      if (error || !data || !data.ok) { setSp(false); setErr((data && data.error) || (error && error.message) || ''); }
      else setSp(data);
    });
    return () => { on = false; };
  }, []);
  const save = async (patch) => {
    const next = { ...sp, ...patch };
    setSp(next);
    const { data, error } = await supabase.rpc('prefs_set', { p_low_on: !!next.low_bal_on, p_low_amt: Number(next.low_bal_amount) || 0, p_device_alert: !!next.device_alert });
    setErr(error || !data || !data.ok ? (data && data.error) || (error && error.message) || 'Could not save.' : '');
  };
  return { sp, save, err };
}
