import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

export const KINDS = [['like', '👍'], ['love', '❤️'], ['haha', '😂'], ['wow', '😮'], ['sad', '😢'], ['angry', '😡']];
export const EMOJI = Object.fromEntries(KINDS);

export default function useReactions(type, ids) {
  const [map, setMap] = useState({});
  const key = ids.join(',');
  const keyRef = useRef(key);
  keyRef.current = key;

  const load = useCallback(async () => {
    const list = keyRef.current ? keyRef.current.split(',') : [];
    if (!list.length) { setMap((prev) => (Object.keys(prev).length ? {} : prev)); return; }
    const { data } = await supabase.rpc('react_summary', { p_type: type, p_ids: list.slice(-300) });
    if (data && typeof data === 'object' && !Array.isArray(data)) setMap(data);
  }, [type]);

  useEffect(() => { load(); }, [key, load]);

  const set = useCallback(async (id, kind) => {
    setMap((prev) => {
      const cur = prev[id] || { counts: {}, total: 0, mine: null };
      const counts = { ...(cur.counts || {}) };
      let total = Number(cur.total || 0);
      if (cur.mine) { counts[cur.mine] = Math.max(0, (counts[cur.mine] || 0) - 1); total -= 1; }
      let mine = null;
      if (kind && kind !== cur.mine) { counts[kind] = (counts[kind] || 0) + 1; total += 1; mine = kind; }
      return { ...prev, [id]: { counts, total: Math.max(0, total), mine } };
    });
    const { data } = await supabase.rpc('react_set', { p_type: type, p_id: id, p_kind: kind });
    if (data && data.ok) setMap((prev) => ({ ...prev, [id]: data.summary }));
    else load();
  }, [type, load]);

  return { map, set };
}
