import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Edit these 3 to change the default display
const DEFAULTS = [['/flash-sale', 'Flash Sale'], ['/savemore', 'Save More'], ['/bundles', 'Bundles']];

const CSS = `
.ns{margin:8px 12px 4px;height:36px;border:1px solid var(--border);border-radius:12px;background:var(--card);overflow:hidden;display:flex;align-items:center}
.ns-in{width:100%;padding:0 12px;font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation:nsIn .3s ease-out both}
.ns-def{display:flex;justify-content:space-around;gap:8px}
.ns-def a{color:var(--primary);font-weight:700}
@keyframes nsIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ns-in{animation:none}}
`;

export default function NewsStrip() {
  const { user } = useAuth();
  const [news, setNews] = useState(null);
  const [i, setI] = useState(0);
  const marked = useRef({});

  useEffect(() => {
    let alive = true;
    if (!user) { setNews([]); return undefined; }
    supabase.rpc('news_ticker_next').then(({ data }) => { if (alive) setNews(Array.isArray(data) ? data : []); });
    return () => { alive = false; };
  }, [user]);

  const slides = news ? (news.length ? [...news, null] : [null]) : [];
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const cur = slides.length ? slides[i % slides.length] : undefined;
  useEffect(() => {
    if (cur && !marked.current[cur.id]) {
      marked.current[cur.id] = true;
      supabase.rpc('news_ticker_mark_seen', { p_ids: [cur.id] }).then(() => {});
    }
  }, [cur]);

  if (news === null) return <div className="ns"><style>{CSS}</style><div className="sk sk-line" style={{ width: '70%', margin: '0 12px' }} /></div>;
  return (
    <div className="ns" aria-live="polite">
      <style>{CSS}</style>
      {cur
        ? <div className="ns-in" key={cur.id}>{cur.message}</div>
        : <div className="ns-in ns-def" key="def">{DEFAULTS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div>}
    </div>
  );
}
