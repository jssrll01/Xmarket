import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { dbConfigOn } from './cfg';

// Legal text from the database when use_db_config is on; otherwise the built-in text is kept.
export function useLegalDoc(slug, fallback) {
  const [doc, setDoc] = useState(fallback);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        if (!(await dbConfigOn())) return;
        const { data } = await supabase.from('legal_documents').select('body').eq('slug', slug).eq('active', true).maybeSingle();
        if (live && data && String(data.body || '').trim()) setDoc(data.body);
      } catch (e) { /* keep fallback */ }
    })();
    return () => { live = false; };
  }, [slug]);
  return doc;
}
