import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, Clock, X } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import { money } from '../lib/currency';
import { loadProducts, nameOf, imgOf, priceOf, findByCode, productPath } from '../lib/productIndex';
import { buildWordIndex, correct } from '../lib/fuzzy';
import { getRecent, clearRecent, logSearch, fetchTrending } from '../lib/trending';
import { loadImg, signature, rankSimilar } from '../lib/imageSig';

const btn = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 8px', borderRadius: 14, background: '#fff', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: 13.5, color: '#0F172A' };
const chip = { padding: '7px 13px', borderRadius: 99, background: '#fff', border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600, color: '#0F172A' };
const label = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 800, color: '#64748B', margin: '12px 0 6px' };
const BAR = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 5v14M8 5v14M12 5v14M16 5v14M20 5v14" /></svg>
);

export default function SearchBoost() {
  const nav = useNavigate();
  const host = useRef(null);
  const file = useRef(null);
  const [q, setQ] = useState('');
  const [words, setWords] = useState(null);
  const [fix, setFix] = useState('');
  const [trend, setTrend] = useState(null);
  const [recent, setRecent] = useState(getRecent());
  const [scan, setScan] = useState(false);
  const [msg, setMsg] = useState('');
  const [hit, setHit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState(null);

  const field = useCallback(() => [...document.querySelectorAll('input')].find((i) => !(host.current && host.current.contains(i)) && (i.type === 'search' || /search/i.test(i.placeholder || ''))) || null, []);

  const setQuery = (v, enter) => {
    const i = field();
    if (!i) return;
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    set.call(i, v);
    i.dispatchEvent(new Event('input', { bubbles: true }));
    if (enter) i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    i.focus();
    setQ(v);
  };

  useEffect(() => {
    loadProducts().then((l) => setWords(buildWordIndex(l.map(nameOf))));
    fetchTrending().then(setTrend);
    const t0 = setTimeout(() => { const i = field(); if (i) setQ(i.value); }, 300);
    let idle = null;
    const onInput = (e) => {
      const i = field();
      if (!i || e.target !== i) return;
      setQ(i.value);
      clearTimeout(idle);
      idle = setTimeout(() => { logSearch(i.value); setRecent(getRecent()); }, 3000);
    };
    const onKey = (e) => { if (e.key === 'Enter' && e.target === field()) { logSearch(e.target.value); setRecent(getRecent()); } };
    document.addEventListener('input', onInput, true);
    document.addEventListener('keydown', onKey, true);
    return () => { clearTimeout(t0); clearTimeout(idle); document.removeEventListener('input', onInput, true); document.removeEventListener('keydown', onKey, true); };
  }, [field]);

  useEffect(() => {
    const t = setTimeout(() => setFix(q.trim().length >= 3 && words ? correct(q, words) : ''), 150);
    return () => clearTimeout(t);
  }, [q, words]);

  const lookup = async (code) => {
    const list = await loadProducts();
    const r = findByCode(list, code);
    if (r.product) { setHit(r.product); setMsg(''); setQuery(nameOf(r.product), true); return true; }
    setHit(null);
    setMsg(r.hasField ? 'No product matches barcode ' + code + '.' : 'Products do not have a barcode field yet, so ' + code + ' cannot be matched.');
    return false;
  };

  const onPhoto = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true); setMsg(''); setHit(null); setPhoto(null);
    const url = URL.createObjectURL(f);
    try {
      const img = await loadImg(url, false);
      if ('BarcodeDetector' in window) {
        try { const r = await new window.BarcodeDetector().detect(img); if (r && r[0] && r[0].rawValue && (await lookup(r[0].rawValue))) { setBusy(false); return; } } catch (er) {}
      }
      const list = await loadProducts();
      const mine = signature(img);
      if (!mine) throw new Error('sig');
      const out = await rankSimilar(mine, list);
      setPhoto({ url, items: out.items, compared: out.compared });
      if (!out.compared) setMsg('Product images could not be compared (they block cross-site reading).');
    } catch (er) { setMsg('Could not read that photo. Try another one.'); }
    setBusy(false);
  };

  const pick = (t) => setQuery(t, true);
  const showFix = fix && fix !== q.trim().toLowerCase();

  return (
    <div ref={host} style={{ margin: '12px 0' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" style={btn} onClick={() => { setMsg(''); setScan(true); }}>{BAR} Scan barcode</button>
        <button type="button" style={btn} disabled={busy} onClick={() => file.current && file.current.click()}><Camera size={16} /> {busy ? 'Comparing…' : 'Search by photo'}</button>
        <input ref={file} type="file" accept="image/*" onChange={onPhoto} style={{ display: 'none' }} />
      </div>
      {msg && <div style={{ marginTop: 10, fontSize: 13, color: '#B45309', background: '#FEF3C7', borderRadius: 12, padding: '9px 12px' }}>{msg}</div>}
      {hit && <button type="button" onClick={() => nav(productPath(hit))} style={{ ...chip, marginTop: 10, borderColor: '#2563EB', color: '#2563EB' }}>Found: {nameOf(hit)} · Open product</button>}
      {showFix && (
        <div style={{ marginTop: 10, fontSize: 13.5, color: '#64748B' }}>Did you mean <button type="button" style={{ ...chip, borderColor: '#2563EB', color: '#2563EB' }} onClick={() => pick(fix)}>{fix}</button></div>
      )}
      {!q.trim() && trend && trend.length > 0 && (
        <>
          <div style={label}><TrendingUp size={14} /> Trending today</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{trend.slice(0, 8).map((t) => <button type="button" key={t} style={chip} onClick={() => pick(t)}>{t}</button>)}</div>
        </>
      )}
      {!q.trim() && recent.length > 0 && (
        <>
          <div style={{ ...label, justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> Recent searches</span>
            <button type="button" style={{ fontSize: 12, color: '#2563EB', fontWeight: 700 }} onClick={() => { clearRecent(); setRecent([]); }}>Clear</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{recent.slice(0, 6).map((t) => <button type="button" key={t} style={chip} onClick={() => pick(t)}>{t}</button>)}</div>
        </>
      )}
      {photo && (
        <div style={{ marginTop: 14, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 18, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <img src={photo.url} alt="Your photo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1, fontSize: 13.5 }}><b>Similar to your photo</b><div style={{ color: '#64748B', fontSize: 12 }}>Matched by colour and layout · compared {photo.compared} items</div></div>
            <button type="button" onClick={() => setPhoto(null)} aria-label="Close"><X size={18} /></button>
          </div>
          {photo.items.length === 0 ? <div style={{ fontSize: 13, color: '#64748B' }}>No similar items found.</div> : (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {photo.items.map((p) => (
                <button type="button" key={p.id} onClick={() => nav(productPath(p))} style={{ flex: '0 0 120px', textAlign: 'left' }}>
                  <img src={imgOf(p)} alt={nameOf(p)} loading="lazy" style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', background: '#F4F6FA' }} />
                  <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{nameOf(p)}</div>
                  {priceOf(p) > 0 && <div style={{ fontSize: 13, fontWeight: 800, color: '#2563EB' }}>{money(priceOf(p), 'fixed')}</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {scan && <BarcodeScanner onClose={() => setScan(false)} onCode={(c) => { setScan(false); lookup(c); }} />}
    </div>
  );
}
