import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Total unread direct messages for the signed-in user (refreshes every 15s and when the app comes back to the foreground)
export default function useDmUnread() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = () => supabase.rpc('dm_inbox').then(({ data }) => {
      if (!alive) return;
      setCount(Array.isArray(data) ? data.reduce((s, r) => s + Number(r.unread || 0), 0) : 0);
    });
    load();
    const onVis = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { alive = false; document.removeEventListener('visibilitychange', onVis); };
  }, []);
  return count;
}
