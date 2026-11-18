import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TgCommunityButton() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let alive = true;
    supabase.rpc('tg_community_link').then(({ data }) => { if (alive && typeof data === 'string') setUrl(data); });
    return () => { alive = false; };
  }, []);
  if (!/^https:\/\//.test(url)) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Open the Xmarket Telegram community"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '6px 12px 6px 7px', borderRadius: 999, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(15,23,42,.08)', color: '#0F172A', fontSize: 12.5, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#229ED9" /><path fill="#fff" d="M5.4 11.9l11.6-4.5c.5-.2 1 .1.8.9l-2 9.3c-.1.7-.6.9-1.2.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.5-5c.2-.2 0-.3-.4-.1l-6.8 4.3-2.9-.9c-.6-.2-.6-.6.1-.9z" /></svg>
      Xmarket TG Community
    </a>
  );
}
