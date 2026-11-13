import { money } from '../../lib/currency';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const peso = (n) => money(n, 'fixed');

export function useMe() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const reload = async () => {
    if (!user) return null;
    const { data } = await supabase.from('profiles').select('first_name,last_name,email,phone,xwallet_balance').eq('id', user.id).single();
    setMe(data || {});
    return data || {};
  };
  // eslint-disable-next-line
  useEffect(() => { reload(); }, [user && user.id]);
  return { user, me, reload };
}

function Slide({ src }) {
  const [ok, setOk] = useState(false);
  return (
    <div style={{ flex: '0 0 100%', position: 'relative', scrollSnapAlign: 'center', height: '100%' }}>
      {!ok && <div className="sk" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
      <img src={src} alt="" loading="lazy" onLoad={() => setOk(true)} onError={() => setOk(true)} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: ok ? 1 : 0, transition: 'opacity .3s' }} />
    </div>
  );
}

export function Carousel({ images }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const n = (images || []).length;
  useEffect(() => {
    if (n < 2) return undefined;
    const t = setInterval(() => {
      const el = ref.current; if (!el) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % n;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 3500);
    return () => clearInterval(t);
  }, [n]);
  if (!n) return <div className="xf-noimg" style={{ aspectRatio: '16 / 9' }}>No image</div>;
  return (
    <div className="xf-car" style={{ aspectRatio: '16 / 9' }}>
      <div className="xf-track" ref={ref} style={{ position: 'absolute', inset: 0 }} onScroll={(e) => setI(Math.round(e.target.scrollLeft / e.target.clientWidth))}>
        {images.map((s, k) => <Slide key={k} src={s} />)}
      </div>
      {n > 1 && <div className="xf-dots">{images.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>}
    </div>
  );
}

const CAP = 200;
export function Desc({ text }) {
  const full = String(text || '');
  const [open, setOpen] = useState(false);
  if (!full) return null;
  const long = full.length > CAP;
  const cut = long ? full.slice(0, CAP).replace(/\s+\S*$/, '') : full;
  const rest = long ? full.slice(cut.length) : '';
  return (
    <p>
      {cut}
      {long && (
        <>
          <span style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows .45s ease' }}>
            <span style={{ overflow: 'hidden', minHeight: 0, opacity: open ? 1 : 0, transition: 'opacity .45s ease' }}>{rest}</span>
          </span>
          {!open && <span>… </span>}
          <button type="button" onClick={() => setOpen((o) => !o)} style={{ display: 'block', marginTop: 4, color: '#2563EB', fontWeight: 700, fontSize: 13.5 }}>{open ? 'Show less' : 'View all'}</button>
        </>
      )}
    </p>
  );
}

export const XF_CSS = `
.xf{padding:16px 16px 80px;max-width:560px;margin:0 auto;color:#0F172A}
.xf-head{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.xf-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.xf-head p{font-size:13.5px;color:#64748B;margin-top:3px}
.xf-bal{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:12px;background:linear-gradient(135deg,#FFFFFF,#EFF6FF);border:1px solid #BFDBFE;margin-bottom:16px;font-size:13.5px;color:#475569}
.xf-bal b{color:#1D4ED8;font-size:17px}
.xf-card{background:#fff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;margin-bottom:16px;box-shadow:0 14px 26px -22px rgba(37,99,235,.5);animation:xfUp .5s cubic-bezier(.2,.8,.2,1) both}
.xf-card:nth-child(2){animation-delay:.07s}.xf-card:nth-child(3){animation-delay:.14s}.xf-card:nth-child(4){animation-delay:.21s}
.xf-body{padding:14px 16px 16px}
.xf-body h3{font-size:16px;font-weight:700;letter-spacing:-.01em}
.xf-body p{font-size:13px;color:#64748B;margin-top:5px;line-height:1.5;white-space:pre-line}
.xf-price{font-size:20px;font-weight:800;color:#1D4ED8;margin:10px 0 2px}
.xf-meta{font-size:12px;color:#3B82F6;font-weight:600}
.xf-car{position:relative;background:#EFF6FF}
.xf-track{display:flex;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.xf-track::-webkit-scrollbar{display:none}
.xf-track img{flex:0 0 100%;width:100%;height:100%;object-fit:cover;scroll-snap-align:center}
.xf-dots{position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px}
.xf-dots i{width:6px;height:6px;border-radius:99px;background:rgba(255,255,255,.7);transition:all .25s}
.xf-dots i.on{width:18px;background:#2563EB}
.xf-noimg{display:flex;align-items:center;justify-content:center;background:#EFF6FF;color:#93C5FD;font-size:13px}
.xf-btn{width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,#3B82F6,#2563EB);color:#fff;font-size:14.5px;font-weight:600;box-shadow:0 10px 20px -12px rgba(37,99,235,.75);transition:transform .15s,opacity .2s;margin-top:12px}
.xf-btn:not(:disabled):active{transform:scale(.98)}
.xf-btn:disabled{opacity:.5}
.xf-btn.ghost{background:#fff;color:#1D4ED8;border:1px solid #BFDBFE;box-shadow:none}
.xf-warn{margin-top:10px;padding:10px 12px;border-radius:10px;background:#FEF3C7;color:#92400E;font-size:12.5px;animation:xfUp .3s both}
.xf-ok{margin-top:10px;padding:10px 12px;border-radius:10px;background:#DCFCE7;color:#166534;font-size:12.5px;animation:xfUp .3s both}
.xf-lab{display:block;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748B;margin:14px 0 6px}
.xf-in{width:100%;padding:13px 14px;border-radius:12px;border:1px solid #CBD5E1;background:#fff;font-size:14.5px;color:#0F172A;transition:border .2s,box-shadow .2s}
.xf-in:focus{outline:none;border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.xf-in.bad{border-color:#F87171}
.xf-bar{height:12px;border-radius:99px;background:#DBEAFE;overflow:hidden;margin:12px 0 6px}
.xf-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#60A5FA,#2563EB);transition:width 1s cubic-bezier(.2,.8,.2,1)}
.xf-chips{display:flex;gap:8px;margin-top:10px}
.xf-chips button{flex:1;padding:10px 0;border-radius:10px;border:1px solid #BFDBFE;background:#fff;color:#1D4ED8;font-weight:600;font-size:13.5px;transition:all .2s}
.xf-chips button.on{background:#2563EB;color:#fff;border-color:#2563EB}
.xf-opt{display:block;width:100%;text-align:left;position:relative;overflow:hidden;padding:13px 14px;border-radius:12px;border:1px solid #BFDBFE;background:#fff;margin-top:8px;font-size:14px;font-weight:600;color:#0F172A;transition:transform .15s,background .2s}
.xf-opt:not(:disabled):active{transform:scale(.98);background:#EFF6FF}
.xf-opt i{position:absolute;left:0;top:0;bottom:0;background:#DBEAFE;transition:width .8s cubic-bezier(.2,.8,.2,1);z-index:0}
.xf-opt span{position:relative;z-index:1;display:flex;justify-content:space-between;gap:10px}
.xf-opt.mine{border-color:#2563EB}
.xf-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}
.xf-gal img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;animation:xfUp .5s both}
.xf-sec h4{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3B82F6;margin:14px 0 4px}
.xf-spin{width:44px;height:44px;border-radius:50%;border:4px solid #DBEAFE;border-top-color:#2563EB;animation:xfSpin .9s linear infinite;margin:0 auto}
.xf-steps{margin:18px 0 4px}
.xf-steps div{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:13.5px;color:#94A3B8;transition:color .3s}
.xf-steps div b{width:22px;height:22px;border-radius:50%;border:2px solid #CBD5E1;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all .3s}
.xf-steps div.on{color:#1D4ED8}.xf-steps div.on b{border-color:#2563EB;animation:xfPulse 1.2s infinite}
.xf-steps div.done{color:#166534}.xf-steps div.done b{background:#16A34A;border-color:#16A34A;color:#fff}
.xf-pill{display:inline-block;padding:4px 10px;border-radius:99px;background:#DBEAFE;color:#1D4ED8;font-size:12px;font-weight:700;text-transform:capitalize}
.xf-center{text-align:center;padding:26px 16px}
.xf-empty{padding:34px 16px;text-align:center;color:#64748B;font-size:13.5px}
.xf-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #EEF2F7;font-size:13.5px}
.xf-row span{color:#64748B}.xf-row b{text-align:right;word-break:break-all}
@keyframes xfUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes xfSpin{to{transform:rotate(360deg)}}
@keyframes xfPulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.45)}50%{box-shadow:0 0 0 6px rgba(37,99,235,0)}}
@media(prefers-reduced-motion:reduce){.xf *{animation:none!important;transition:none!important}}
`;

const L = (w, h, mt) => <div className="sk sk-line" style={{ width: w, height: h, marginTop: mt }} />;

export function XfSkel({ kind = 'cards' }) {
  if (kind === 'cards') {
    return [0, 1].map((i) => (
      <div className="xf-card" key={i} style={{ animationDelay: i * 70 + 'ms' }}>
        <div className="sk" style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 0 }} />
        <div className="xf-body">
          {L('60%', 18)}{L('95%', 12, 10)}{L('75%', 12, 6)}{L('35%', 24, 14)}
          <div className="sk sk-btn" style={{ marginTop: 14, height: 46, borderRadius: 12 }} />
        </div>
      </div>
    ));
  }
  if (kind === 'polls') {
    return [0, 1].map((i) => (
      <div className="xf-card" key={i} style={{ animationDelay: i * 70 + 'ms' }}>
        <div className="xf-body">
          {L('30%', 11)}{L('80%', 18, 10)}
          {[0, 1, 2].map((k) => <div key={k} className="sk" style={{ width: '100%', height: 46, borderRadius: 12, marginTop: 10 }} />)}
        </div>
      </div>
    ));
  }
  if (kind === 'fund') {
    return (
      <div className="xf-card">
        <div className="xf-body">
          {L('55%', 18)}
          <div className="sk" style={{ width: '100%', height: 12, borderRadius: 99, margin: '14px 0 8px' }} />
          {L('70%', 12)}{L('95%', 12, 14)}{L('85%', 12, 6)}
          <div className="xf-gal">{[0, 1, 2].map((k) => <div key={k} className="sk" style={{ aspectRatio: '1', borderRadius: 10 }} />)}</div>
          <div className="sk sk-btn" style={{ marginTop: 16, height: 46, borderRadius: 12 }} />
        </div>
      </div>
    );
  }
  if (kind === 'form') {
    return (
      <div className="xf-card">
        <div className="xf-body">
          {[0, 1, 2, 3, 4, 5, 6].map((k) => <div key={k}>{L('28%', 10, k ? 16 : 0)}<div className="sk" style={{ width: '100%', height: 46, borderRadius: 12, marginTop: 8 }} /></div>)}
          <div className="sk sk-btn" style={{ marginTop: 18, height: 46, borderRadius: 12 }} />
        </div>
      </div>
    );
  }
  return (
    <div className="xf-card">
      <div className="xf-body xf-center">
        <div className="sk" style={{ width: 44, height: 44, borderRadius: '50%', margin: '0 auto' }} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>{L('55%', 18, 16)}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>{L('80%', 12, 10)}</div>
      </div>
    </div>
  );
}
