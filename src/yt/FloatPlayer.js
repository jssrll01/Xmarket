import { useEffect, useRef, useState } from 'react';

let state = { video: null, slot: null };
const subs = new Set();
const set = (p) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
export const getFP = () => state;
export const playVideo = (v) => set({ video: v });
export const closeFloat = () => set({ video: null });
const setSlot = (el) => set({ slot: el });

function useFP() {
  const [, f] = useState(0);
  useEffect(() => {
    const s = () => f((n) => n + 1);
    subs.add(s);
    return () => { subs.delete(s); };
  }, []);
  return state;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const W = 300;
const H = 232; // 32px title bar + 300x200 video (YouTube needs at least 200x200 visible)
const ytUrl = (id) => 'https://www.youtube.com/watch?v=' + encodeURIComponent(id);
const ytmUrl = (id) => 'https://music.youtube.com/watch?v=' + encodeURIComponent(id);

// Put this where the video used to be. The one player is drawn over it while the
// page is open, and docks into a floating window when the page is left.
export function XmSlot({ video, className, style }) {
  const ref = useRef(null);
  const id = video && video.youtube_id;
  useEffect(() => {
    if (id) playVideo({ id, title: (video && video.title) || '' });
    // eslint-disable-next-line
  }, [id]);
  useEffect(() => {
    const el = ref.current;
    setSlot(el);
    return () => { if (getFP().slot === el) setSlot(null); };
  }, []);
  const a = { fontSize: 12.5, fontWeight: 700, color: '#2563EB', textDecoration: 'none' };
  return (
    <>
      <div ref={ref} className={className} style={{ width: '100%', aspectRatio: '16 / 9', background: '#000', ...(style || {}) }} />
      {id && (
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <a href={ytUrl(id)} target="_blank" rel="noopener noreferrer" style={a}>Open in YouTube</a>
          <a href={ytmUrl(id)} target="_blank" rel="noopener noreferrer" style={a}>Open in YouTube Music</a>
        </div>
      )}
    </>
  );
}

export default function FloatPlayerHost() {
  const fp = useFP();
  const [rect, setRect] = useState(null);
  const [pos, setPos] = useState(() => ({ x: Math.max(4, window.innerWidth - W - 12), y: Math.max(4, window.innerHeight - H - 84) }));
  const drag = useRef(null);

  useEffect(() => {
    if (!fp.slot) { setRect(null); return undefined; }
    let raf;
    let last = '';
    const tick = () => {
      const r = fp.slot.getBoundingClientRect();
      const k = [r.left, r.top, r.width, r.height].map(Math.round).join(',');
      if (k !== last) { last = k; setRect({ left: r.left, top: r.top, width: r.width, height: r.height }); }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [fp.slot]);

  useEffect(() => {
    const fit = () => setPos((p) => ({ x: clamp(p.x, 4, Math.max(4, window.innerWidth - W - 4)), y: clamp(p.y, 4, Math.max(4, window.innerHeight - H - 4)) }));
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const v = fp.video;
  if (!v) return null;
  const docked = !rect;
  const box = docked ? { left: pos.x, top: pos.y, width: W, height: H } : { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

  const down = (e) => { drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } };
  const move = (e) => {
    if (!drag.current) return;
    setPos({ x: clamp(e.clientX - drag.current.dx, 4, Math.max(4, window.innerWidth - W - 4)), y: clamp(e.clientY - drag.current.dy, 4, Math.max(4, window.innerHeight - H - 4)) });
  };
  const up = () => { drag.current = null; };
  const stop = (e) => e.stopPropagation();
  const lk = { fontSize: 11.5, fontWeight: 700, color: '#93C5FD', textDecoration: 'none', flex: 'none' };

  return (
    <div style={{ position: 'fixed', zIndex: 99000, display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden', borderRadius: docked ? 12 : 0, boxShadow: docked ? '0 10px 30px rgba(0,0,0,.35)' : 'none', ...box }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ display: docked ? 'flex' : 'none', alignItems: 'center', gap: 8, height: 32, padding: '0 8px', background: '#0F172A', color: '#fff', cursor: 'grab', touchAction: 'none', flex: 'none' }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title || 'Now playing'}</span>
        <a href={ytUrl(v.id)} target="_blank" rel="noopener noreferrer" onPointerDown={stop} style={lk}>YouTube</a>
        <a href={ytmUrl(v.id)} target="_blank" rel="noopener noreferrer" onPointerDown={stop} style={lk}>Music</a>
        <button type="button" aria-label="Close player" onPointerDown={stop} onClick={closeFloat}
          style={{ flex: 'none', background: 'transparent', border: 0, color: '#fff', fontSize: 16, lineHeight: 1, cursor: 'pointer', padding: '2px 4px' }}>✕</button>
      </div>
      <iframe
        title={v.title || 'Video'}
        src={'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0&playsinline=1'}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ flex: 1, minHeight: 0, width: '100%', border: 0 }}
      />
    </div>
  );
}
