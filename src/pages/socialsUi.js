import FollowChip from './FollowChip';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const BLUE = '#2563EB';
export const time12 = (d) => new Date(d).toLocaleString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
export const initials = (n) => String(n || 'U').slice(0, 2).toUpperCase();

export const Sk = ({ h = 16, w = '100%', r = 12, style }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(148,163,184,.25)', animation: 'socsk 1.2s ease-in-out infinite', ...style }} />
);
export const SkStyle = () => <style>{'@keyframes socsk{0%,100%{opacity:.45}50%{opacity:1}}'}</style>;

export function Avatar({ name, url, size = 40 }) {
  return url
    ? <img src={url} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    : <span style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#fff', fontWeight: 800, fontSize: size * 0.38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials(name)}</span>;
}

export async function toggleLike(id) {
  const { data } = await supabase.rpc('socials_toggle_like', { p_post: id });
  return data;
}

export async function sharePost(p) {
  const url = window.location.origin + '/socials/post/' + p.id + '/comments';
  const text = '@' + p.username + ' on XMARKET: ' + String(p.description).slice(0, 80);
  if (navigator.share) { try { await navigator.share({ title: 'XMARKET Socials', text, url }); return 'shared'; } catch (e) { return 'cancel'; } }
  try { await navigator.clipboard.writeText(url); return 'copied'; } catch (e) { return 'fail'; }
}

const CAP = 200;
function Caption({ p }) {
  const full = String(p.description || '');
  const long = full.length > CAP;
  const [open, setOpen] = React.useState(false);
  const cut = long ? full.slice(0, CAP).replace(/\s+\S*$/, '') : full;
  const rest = long ? full.slice(cut.length) : '';
  return (
    <div style={{ padding: '4px 12px 14px', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
      <b>@{p.username}</b> {cut}
      {long && (
        <>
          <span style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows .45s ease', }}>
            <span style={{ overflow: 'hidden', minHeight: 0, opacity: open ? 1 : 0, transition: 'opacity .45s ease' }}>{rest}</span>
          </span>
          {!open && <span>… </span>}
          <button type="button" onClick={() => setOpen(o => !o)} style={{ display: 'block', marginTop: 4, color: '#2563EB', fontWeight: 700, fontSize: 13.5 }}>{open ? 'Show less' : 'View details'}</button>
        </>
      )}
    </div>
  );
}

export function PostCard({ p, onLike, onShare }) {
  const nav = useNavigate();
  return (
    <div className="card" style={{ marginBottom: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, cursor: 'pointer' }} onClick={() => nav('/socials/creator/' + p.username)}>
        <Avatar name={p.username} url={p.avatar_url} />
        <div><div style={{ fontWeight: 800, fontSize: 14 }}>@{p.username}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>{time12(p.created_at)}</div></div>
        {!p.mine && p.creator_id && <FollowChip creatorId={p.creator_id} initial={p.following} />}
      </div>
      <img src={p.image_url} alt="" loading="lazy" style={{ width: '100%', display: 'block', maxHeight: 520, objectFit: 'cover', background: '#EEF1F6' }} />
      <div style={{ display: 'flex', gap: 18, padding: '10px 12px 4px' }}>
        <button onClick={() => onLike(p)} aria-label="Like" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13 }}>
          <Heart size={22} color={p.liked ? '#DC2626' : '#475569'} fill={p.liked ? '#DC2626' : 'none'} /> {p.likes}
        </button>
        <button onClick={() => nav('/socials/post/' + p.id + '/comments')} aria-label="Comments" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13 }}>
          <MessageCircle size={22} color="#475569" /> {p.comments}
        </button>
        <button onClick={() => onShare(p)} aria-label="Share" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, marginLeft: 'auto' }}>
          <Share2 size={21} color="#475569" /> Share
        </button>
      </div>
      <Caption p={p} />
      {Array.isArray(p.links) && p.links.filter(l => l && /^https?:\/\/\S+$/i.test(l.url || '')).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 12px 14px' }}>
          {p.links.filter(l => l && /^https?:\/\/\S+$/i.test(l.url || '')).map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer nofollow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 99, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
