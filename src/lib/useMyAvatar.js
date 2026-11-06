import { useEffect, useState } from 'react';
import { supabase } from './supabase';

let cached = null;

export default function useMyAvatar() {
  const [url, setUrl] = useState(cached);
  useEffect(() => {
    let on = true;
    supabase.rpc('my_avatar_status').then(({ data }) => {
      if (!on || !data) return;
      cached = data.avatar_url || null;
      setUrl(cached);
    });
    return () => { on = false; };
  }, []);
  return url;
}
