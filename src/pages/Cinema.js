import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Lock, Film, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { imgUrl } from '../lib/img';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Poster({ m, w, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={m.title} style={{ flex: '0 0 auto', width: w, background: 'none', border: 0, padding: 0, textAlign: 'left', color: 'inherit', cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: w, aspectRatio: '2 / 3', borderRadius: 10, overflow: 'hidden', background: '#1c1c24', display: 'grid', placeItems: 'center' }}>
        {m.poster_url ? <img src={imgUrl(m.poster_url, 300)} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Film size={28} color="#555" />}
        <span style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 99, background: 'rgba(0,0,0,.65)', display: 'grid', placeItems: 'center' }}>
          {m.owned ? <Check size={14} color="#34D399" /> : <Lock size={13} color="#fff" />}
        </span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
    </button>
  );
}

function Row({ title, list, onPick }) {
  if (!list.length) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 800, padding: '0 16px', marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 4px' }}>
        {list.map((m) => <Poster key={m.id} m={m} w={112} onClick={() => onPick(m)} />)}
      </div>
    </div>
  );
}

export default function Cinema() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [movies, setMovies] = useState(null);
  const [sel, setSel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.rpc('cinema_list');
    const list = Array.isArray(data) ? data : [];
    setMovies(list);
    return list;
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const rows = useMemo(() => {
    if (!movies) return [];
    const out = [];
    const owned = movies.filter((m) => m.owned);
    if (owned.length) out.push(['My library', owned]);
    const g = {};
    movies.forEach((m) => { const k = (m.genre || 'Movies').trim() || 'Movies'; (g[k] = g[k] || []).push(m); });
    Object.keys(g).forEach((k) => out.push([k, g[k]]));
    return out;
  }, [movies]);

  const play = async (m) => {
    setBusy(true);
    const { data, error } = await supabase.rpc('cinema_watch', { p_movie: m.id });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setPlayer(data.youtube_id);
  };

  const unlock = async (m) => {
    if (!user) return nav('/signin');
    setBusy(true);
    const { data, error } = await rpcPin('cinema_buy', { p_movie: m.id });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) { if (data.error !== 'Cancelled') show(data.error); return; }
    const list = await load();
    setSel(list.find((x) => x.id === m.id) || null);
    if (data.receipt) showReceipt(data.receipt); else show('Movie unlocked');
  };

  const act = (m) => (m.owned ? play(m) : unlock(m));
  const feat = movies && movies[0];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', background: '#0b0b0f', color: '#fff' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'linear-gradient(#0b0b0f, rgba(11,11,15,0))' }}>
        <button aria-label="Back" onClick={() => nav(-1)} style={{ width: 38, height: 38, borderRadius: 12, border: 0, background: 'rgba(255,255,255,.12)', color: '#fff', display: 'grid', placeItems: 'center' }}><ArrowLeft size={20} /></button>
        <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 1.5, color: '#EF4444' }}>CINEMA</div>
      </div>

      {movies === null && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading…</div>}
      {movies && movies.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No movies yet.</div>}

      {feat && (
        <div style={{ position: 'relative', margin: '-62px 0 18px', height: 420, background: feat.poster_url ? `url(${imgUrl(feat.poster_url, 900)}) center/cover` : 'linear-gradient(135deg,#1f2937,#0b0b0f)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#0b0b0f 6%,rgba(11,11,15,.1) 65%)' }} />
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>{feat.title}</div>
            {feat.genre && <div style={{ fontSize: 12.5, color: '#bbb', marginTop: 4 }}>{feat.genre}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button disabled={busy} onClick={() => act(feat)} style={{ flex: 1, padding: 12, borderRadius: 8, border: 0, background: '#fff', color: '#000', fontWeight: 800, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                {feat.owned ? <><Play size={16} fill="#000" /> Play</> : <><Lock size={15} /> Unlock {peso(feat.price)}</>}
              </button>
              <button onClick={() => setSel(feat)} style={{ flex: 1, padding: 12, borderRadius: 8, border: 0, background: 'rgba(255,255,255,.2)', color: '#fff', fontWeight: 800 }}>Details</button>
            </div>
          </div>
        </div>
      )}

      {rows.map(([t, l]) => <Row key={t} title={t} list={l} onPick={setSel} />)}
      <div style={{ height: 40 }} />

      {sel && (
        <div onClick={() => setSel(null)} style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxHeight: '85vh', overflowY: 'auto', background: '#16161d', borderRadius: '20px 20px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 90, flexShrink: 0 }}><Poster m={sel} w={90} onClick={() => {}} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 19, fontWeight: 900 }}>{sel.title}</div>
                {sel.genre && <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>{sel.genre}</div>}
                <div style={{ fontSize: 13, color: sel.owned ? '#34D399' : '#FBBF24', fontWeight: 800, marginTop: 6 }}>{sel.owned ? 'Owned. Watch any time.' : peso(sel.price) + ' · one-time, lifetime access'}</div>
              </div>
            </div>
            {sel.description && <div style={{ fontSize: 13.5, lineHeight: 1.6, color: '#ccc', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{sel.description}</div>}
            <button disabled={busy} onClick={() => act(sel)} style={{ width: '100%', padding: 14, marginTop: 8, borderRadius: 10, border: 0, background: sel.owned ? '#fff' : '#EF4444', color: sel.owned ? '#000' : '#fff', fontWeight: 900, fontSize: 15 }}>
              {busy ? 'Please wait…' : sel.owned ? 'Play' : 'Unlock for ' + peso(sel.price)}
            </button>
            <button onClick={() => setSel(null)} style={{ width: '100%', marginTop: 8, padding: 10, background: 'none', border: 0, color: '#999', fontWeight: 700 }}>Close</button>
          </div>
        </div>
      )}

      {player && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button aria-label="Close player" onClick={() => setPlayer(null)} style={{ position: 'absolute', top: 'calc(12px + env(safe-area-inset-top, 0px))', right: 12, width: 40, height: 40, borderRadius: 99, border: 0, background: 'rgba(255,255,255,.18)', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 2 }}><X size={20} /></button>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <iframe title="Movie" src={`https://www.youtube-nocookie.com/embed/${player}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          </div>
        </div>
      )}
    </div>
  );
}
