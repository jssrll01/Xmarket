import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// useRealtime('products', load)  or  useRealtime(['orders','notifications'], load)
export default function useRealtime(tables, onChange, filter) {
  const cb = useRef(onChange);
  cb.current = onChange;
  const key = [].concat(tables).join(',');
  useEffect(() => {
    let t;
    const fire = () => { clearTimeout(t); t = setTimeout(() => cb.current && cb.current(), 300); };
    let ch = supabase.channel('rt-' + key + '-' + Math.random().toString(36).slice(2, 7));
    [].concat(tables).forEach((tb) => { ch = ch.on('postgres_changes', { event: '*', schema: 'public', table: tb, ...(filter ? { filter } : {}) }, fire); });
    ch.subscribe();
    return () => { clearTimeout(t); supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [key, filter]);
}
