import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

let loaded = false;
const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } };

export default function LaunchPopups() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [queue, setQueue] = useState([]);
  const cur = queue[0];

  useEffect(() => {
    if (pathname !== '/' || loaded) return;
    loaded = true;
    supabase.from('app_popups').select('id,title,image_url,link,frequency').order('sort_order').order('created_at', { ascending: false })
      .then(({ data }) => {
        const today = new Date().toDateString();
        setQueue((data || []).filter((p) => {
          if (p.frequency === 'once') return !get('xm_pop_once_' + p.id);
          if (p.frequency === 'daily') return get('xm_pop_day_' + p.id) !== today;
          return true;
        }));
      });
  }, [pathname]);

  useEffect(() => {
    if (!cur) return;
    if (cur.frequency === 'once') put('xm_pop_once_' + cur.id, '1');
    if (cur.frequency === 'daily') put('xm_pop_day_' + cur.id, new Date().toDateString());
    supabase.rpc('popup_track', { p_id: cur.id, p_kind: 'view' }).then(() => {}, () => {});
  }, [cur && cur.id]); // eslint-disable-line

  if (!cur) return null;
  const close = () => setQueue((q) => q.slice(1));
  const internal = cur.link && /^\/(?!\/)\S*$/.test(cur.link);
  const external = cur.link && /^https:\/\/\S+$/i.test(cur.link);
  const go = () => {
    if (!internal && !external) return;
    supabase.rpc('popup_track', { p_id: cur.id, p_kind: 'click' }).then(() => {}, () => {});
    close();
    if (internal) nav(cur.link); else window.open(cur.link, '_blank', 'noopener,noreferrer');
  };
  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'xmPopBg .25s ease both' }}>
      <style>{`@keyframes xmPopBg{from{opacity:0}to{opacity:1}}@keyframes xmPopIn{0%{opacity:0;transform:scale(.85) translateY(16px)}100%{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.xm-pop{animation:none!important}}`}</style>
      <div className="xm-pop" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '88vw', animation: 'xmPopIn .4s cubic-bezier(.2,.8,.2,1) both' }}>
        <button type="button" aria-label="Close" onClick={close} style={{ position: 'absolute', top: -14, right: -10, zIndex: 2, width: 36, height: 36, borderRadius: '50%', background: '#fff', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,.35)' }}><X size={20} /></button>
        <img src={cur.image_url} alt={cur.title} onClick={go} onError={close} style={{ display: 'block', maxWidth: '88vw', maxHeight: '72vh', borderRadius: 18, objectFit: 'contain', cursor: internal || external ? 'pointer' : 'default', boxShadow: '0 24px 48px -16px rgba(0,0,0,.5)' }} />
      </div>
    </div>
  );
}
