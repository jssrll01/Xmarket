import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import GlobalProductPreview from './GlobalProductPreview';

// Pages where a refresh would lose what the user is doing
const SKIP = ['/play-time', '/checkout', '/creator-studio', '/signin', '/signup', '/forgot', '/product/', '/cart', '/video', '/chat'];

export default function LiveRoutes({ children }) {
  const { pathname } = useLocation();
  const [tick, setTick] = useState(0);
  const path = useRef(pathname);
  path.current = pathname;

  useEffect(() => {
    let t;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(function run() {
        const a = document.activeElement;
        const typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
        const skip = SKIP.some((s) => path.current.startsWith(s) || (s.endsWith('/') && path.current.includes(s)));
        if (document.hidden || skip) return;
        if (typing) { t = setTimeout(run, 4000); return; }
        setTick((n) => n + 1);
      }, 1500);
    };
    const ch = supabase.channel('live-all').on('postgres_changes', { event: '*', schema: 'public', table: '*' }, refresh).subscribe();
    return () => { clearTimeout(t); supabase.removeChannel(ch); };
  }, []);

  return <><React.Fragment key={tick}>{children}</React.Fragment><GlobalProductPreview /></>;
}
