import { money } from '../lib/currency';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpLeft, Search, X, Clock, Trash2, TrendingUp, PackageSearch, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useRecentSearches from '../hooks/useRecentSearches';
import { imgUrl } from '../lib/img';
import VoiceButton from '../components/VoiceButton';
import LongPressPreview from '../components/LongPressPreview';
import AnchorPrice from '../components/AnchorPrice';
import SearchBoost from '../components/SearchBoost';

const peso = (n) => money(n, 'plain');
const clean = (s) => String(s || '').replace(/[%,()*\\]/g, ' ').trim();
const minPrice = (vp) => { const v = Object.values(vp || {}).map(Number).filter(n => n > 0); return v.length ? Math.min(...v) : 0; };
const SORTS = [['rel', 'Relevance'], ['new', 'Latest'], ['sold', 'Top Sales'], ['pa', 'Price ↑'], ['pd', 'Price ↓']];
const COLS = 'id,name,category,store,images,sold,variant_prices,created_at,description';
const COLS2 = COLS + ',compare_at_price';

// Works before and after the compare_at_price column exists.
async function fetchProducts(build) {
  let r = await build(COLS2);
  if (r.error) r = await build(COLS);
  return r;
}

function lev(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

function Hl({ s, q }) {
  const i = q ? s.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{s}</>;
  return <>{s.slice(0, i)}<b>{s.slice(i, i + q.length)}</b>{s.slice(i + q.length)}</>;
}

function ProductRow({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ padding: '8px 0 4px' }}>
      <b style={{ fontSize: 15, padding: '0 16px', display: 'block', margin: '12px 0 10px' }}>{title}</b>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 6px' }}>
        {items.map((p) => (
          <Link key={p.id} to={'/product/' + p.id} className="card" style={{ flex: '0 0 130px', overflow: 'hidden', display: 'block' }}>
            <div style={{ aspectRatio: '1 / 1', background: '#EEF1F6' }}>
              {p.images && p.images[0] && <img src={imgUrl(p.images[0], 300)} alt="" width="130" height="130" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            </div>
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, height: 32, overflow: 'hidden' }}>{p.name}</div>
              <div style={{ marginTop: 4 }}><AnchorPrice price={minPrice(p.variant_prices)} compareAt={p.compare_at_price} size="small" /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [text, setText] = useState(q);
  const [sort, setSort] = useState('rel');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recs, setRecs] = useState([]);
  const [seen, setSeen] = useState([]);
  const [related, setRelated] = useState([]);
  const [zero, setZero] = useState({ for: '', fix: '', similar: [] });
  const { recent, add, remove, clear } = useRecentSearches();
  const inputRef = useRef(null);

  useEffect(() => { if (!q && inputRef.current) inputRef.current.focus(); }, [q]);
  useEffect(() => { setText(q); }, [q]);
  useEffect(() => {
    let alive = true;
    supabase.rpc('recommend_products', { p_limit: 12 }).then(({ data }) => { if (alive) setRecs(Array.isArray(data) ? data : []); });
    supabase.rpc('recent_products', { p_limit: 12 }).then(({ data }) => { if (alive) setSeen(Array.isArray(data) ? data : []); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    supabase.from('products').select('name').order('sold', { ascending: false }).limit(8)
      .then(({ data }) => setPopular((data || []).map(r => r.name)));
  }, []);

  // Autocomplete: product names (best matches first) plus matching categories.
  useEffect(() => {
    const t = clean(text);
    if (q || t.length < 2) { setSugg([]); return undefined; }
    let alive = true;
    const h = setTimeout(async () => {
      const [a, b] = await Promise.all([
        supabase.from('products').select('name').ilike('name', '%' + t + '%').order('sold', { ascending: false }).limit(14),
        supabase.from('products').select('category').ilike('category', '%' + t + '%').limit(40),
      ]);
      if (!alive) return;
      const low = t.toLowerCase();
      const names = [...new Set((a.data || []).map((r) => r.name))];
      names.sort((x, y) => (x.toLowerCase().startsWith(low) ? 0 : 1) - (y.toLowerCase().startsWith(low) ? 0 : 1));
      const cats = [...new Set((b.data || []).map((r) => r.category).filter(Boolean))].slice(0, 2);
      setSugg(names.slice(0, 5).map((n) => ({ t: n, kind: 'product' })).concat(cats.map((c) => ({ t: c, kind: 'category' }))));
    }, 200);
    return () => { alive = false; clearTimeout(h); };
  }, [text, q]);

  useEffect(() => {
    const t = clean(q);
    if (!t) { setRows([]); return undefined; }
    let alive = true;
    setLoading(true);
    const p = '%' + t + '%';
    fetchProducts((cols) => supabase.from('products').select(cols).or(`name.ilike.${p},category.ilike.${p},store.ilike.${p}`).limit(80))
      .then(({ data }) => {
        if (!alive) return;
        const found = data || [];
        setRows(found); setLoading(false);
        supabase.rpc('log_search', { p_term: t, p_hits: found.length }).then(() => {}, () => {});
      });
    return () => { alive = false; };
  }, [q]);

  // People also search
  useEffect(() => {
    const t = clean(q);
    if (!t) { setRelated([]); return undefined; }
    let alive = true;
    supabase.rpc('related_searches', { p_term: t, p_limit: 8 }).then(({ data }) => { if (alive) setRelated(Array.isArray(data) ? data : []); }, () => {});
    return () => { alive = false; };
  }, [q]);

  // Zero results: spelling suggestion and similar products.
  useEffect(() => {
    if (!q || loading || rows.length > 0) return undefined;
    let alive = true;
    (async () => {
      const words = clean(q).toLowerCase().split(/\s+/).filter((w) => w.length >= 2);
      const pool = await supabase.from('products').select('name,category').order('sold', { ascending: false }).limit(300);
      const vocab = new Set();
      (pool.data || []).forEach((r) => (r.name + ' ' + (r.category || '')).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).forEach((w) => { if (w.length >= 3) vocab.add(w); }));
      const fixed = words.map((w) => {
        if (w.length < 3 || vocab.has(w)) return w;
        const lim = w.length > 5 ? 2 : 1;
        let best = w; let bd = lim + 1;
        vocab.forEach((v) => { if (Math.abs(v.length - w.length) > lim) return; const x = lev(w, v); if (x < bd) { bd = x; best = v; } });
        return best;
      });
      const fix = fixed.join(' ') !== words.join(' ') ? fixed.join(' ') : '';
      const terms = (fix ? fixed : words).filter((w) => w.length >= 3);
      let similar = [];
      if (terms.length) {
        const clause = terms.map((w) => `name.ilike.%${w}%,category.ilike.%${w}%`).join(',');
        const r = await fetchProducts((cols) => supabase.from('products').select(cols).or(clause).order('sold', { ascending: false }).limit(12));
        similar = r.data || [];
      }
      if (alive) setZero({ for: q, fix, similar });
    })();
    return () => { alive = false; };
  }, [q, loading, rows]);

  const go = (term) => {
    const t = (term || '').trim();
    if (!t) return;
    add(t); setParams({ q: t });
    window.scrollTo(0, 0);
  };

  const list = useMemo(() => {
    const a = rows.map(r => ({ ...r, price: minPrice(r.variant_prices) }));
    const low = q.toLowerCase();
    const rank = (r) => (r.name.toLowerCase().startsWith(low) ? 0 : r.name.toLowerCase().includes(low) ? 1 : 2);
    if (sort === 'new') a.sort((x, y) => new Date(y.created_at) - new Date(x.created_at));
    else if (sort === 'sold') a.sort((x, y) => (y.sold || 0) - (x.sold || 0));
    else if (sort === 'pa') a.sort((x, y) => x.price - y.price);
    else if (sort === 'pd') a.sort((x, y) => y.price - x.price);
    else a.sort((x, y) => rank(x) - rank(y) || (y.sold || 0) - (x.sold || 0));
    return a;
  }, [rows, sort, q]);

  const also = useMemo(() => {
    const low = clean(q).toLowerCase();
    const base = related.length ? related : [...new Set(rows.map((r) => r.category).filter(Boolean))];
    return [...new Set([...base, ...popular])].filter((t) => t && t.toLowerCase() !== low).slice(0, 10);
  }, [related, rows, popular, q]);

  const chip = { padding: '8px 14px', borderRadius: 999, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' };
  const zr = zero.for === q ? zero : { fix: '', similar: [] };
  const alsoBlock = also.length > 0 ? (
    <div style={{ padding: '16px 16px 4px' }}>
      <b style={{ fontSize: 15, display: 'block', marginBottom: 10 }}>People also search</b>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {also.map((t) => <span key={t} style={chip} onClick={() => go(t)}>{t.length > 28 ? t.slice(0, 28) + '…' : t}</span>)}
      </div>
    </div>
  ) : null;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', padding: '12px 12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/'))}><ArrowLeft size={20} /></button>
        <form style={{ flex: 1, position: 'relative' }} onSubmit={e => { e.preventDefault(); go(text); }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--muted)' }} />
          <input ref={inputRef} value={text} onChange={e => { setText(e.target.value); if (q) setParams({}); }} placeholder="Search a product..." enterKeyHint="search"
            style={{ width: '100%', height: 44, padding: '0 38px 0 36px', fontSize: 15 }} />
          {text && <button type="button" aria-label="Clear" onClick={() => { setText(''); setParams({}); if (inputRef.current) inputRef.current.focus(); }} style={{ position: 'absolute', right: 8, top: 10 }}><X size={18} /></button>}
        </form>
<SearchBoost />
        <VoiceButton onText={(t, fin) => { setText(t); if (fin) go(t); }} />
        <button onClick={() => go(text)} style={{ fontWeight: 800, color: 'var(--primary)', padding: '0 4px' }}>Search</button>
      </div>

      {!q && (
        <div style={{ padding: '4px 16px' }}>
          {sugg.length > 0 ? sugg.map((s) => (
            <div key={s.kind + s.t} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <button onClick={() => go(s.t)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, textAlign: 'left', padding: '12px 0', fontSize: 14 }}>
                {s.kind === 'category' ? <Tag size={15} color="#94a3b8" /> : <Search size={15} color="#94a3b8" />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Hl s={s.t} q={clean(text)} />{s.kind === 'category' && <span style={{ color: 'var(--muted)', fontSize: 12 }}> · category</span>}
                </span>
              </button>
              <button aria-label="Use this text" onClick={() => { setText(s.t); if (inputRef.current) inputRef.current.focus(); }} style={{ padding: 10, color: '#94a3b8' }}><ArrowUpLeft size={16} /></button>
            </div>
          )) : (<>
            {recent.length > 0 && (<>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                <b style={{ fontSize: 15 }}>Recent searches</b>
                <button onClick={clear} aria-label="Clear all" style={{ color: 'var(--muted)' }}><Trash2 size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recent.map(t => (
                  <span key={t} style={{ ...chip, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} color="#94a3b8" /><span onClick={() => go(t)}>{t}</span>
                    <X size={13} color="#94a3b8" onClick={() => remove(t)} />
                  </span>
                ))}
              </div>
            </>)}
            {popular.length > 0 && (<>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '20px 0 10px' }}><TrendingUp size={16} color="#2563EB" /><b style={{ fontSize: 15 }}>Popular searches</b></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {popular.map(t => <span key={t} style={chip} onClick={() => go(t)}>{t.length > 28 ? t.slice(0, 28) + '…' : t}</span>)}
              </div>
            </>)}
          </>)}
        </div>
      )}

      {!q && sugg.length === 0 && (<>
        <ProductRow title="Recently viewed" items={seen} />
        <ProductRow title="Recommended for you" items={recs} />
      </>)}

      {q && (<>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 16px 10px' }}>
          {SORTS.map(([id, label]) => (
            <button key={id} onClick={() => setSort(id)} style={{ ...chip, background: sort === id ? 'var(--primary)' : 'var(--card)', color: sort === id ? '#fff' : 'var(--text)', borderColor: sort === id ? 'var(--primary)' : 'var(--border)' }}>{label}</button>
          ))}
        </div>
        <div style={{ padding: '0 16px 8px', fontSize: 12, color: 'var(--muted)' }}>{loading ? 'Searching…' : `${list.length} result${list.length === 1 ? '' : 's'} for “${q}”`}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 12px' }}>
          {loading && [0, 1, 2, 3].map(i => <div key={i} className="sk" style={{ borderRadius: 14, height: 250 }} />)}
          {!loading && list.map(p => (
            <LongPressPreview key={p.id} product={{ name: p.name, price: p.price, image: p.images && p.images[0] ? imgUrl(p.images[0], 700) : '', description: p.description }}><Link to={'/product/' + p.id} className="card" style={{ overflow: 'hidden', display: 'block' }}>
              <div style={{ aspectRatio: '1 / 1', background: '#EEF1F6' }}>
                {p.images && p.images[0] && <img src={imgUrl(p.images[0], 400)} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, height: 34, overflow: 'hidden' }}>{p.name}</div>
                <div style={{ marginTop: 6 }}><AnchorPrice price={p.price} compareAt={p.compare_at_price} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{p.store}</span>
                  <span>{p.sold || 0} sold</span>
                </div>
              </div>
            </Link></LongPressPreview>
          ))}
        </div>
        {!loading && list.length > 0 && alsoBlock}
        {!loading && list.length === 0 && (<>
          <div style={{ textAlign: 'center', padding: '40px 24px 8px', color: 'var(--muted)' }}>
            <PackageSearch size={44} />
            <div style={{ fontWeight: 800, color: 'var(--text)', marginTop: 10, fontSize: 16 }}>No results for “{q}”</div>
            {zr.fix && <div style={{ fontSize: 14, marginTop: 8 }}>Did you mean <button onClick={() => go(zr.fix)} style={{ fontWeight: 800, color: 'var(--primary)' }}>{zr.fix}</button>?</div>}
            <div style={{ fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>Check the spelling · Use fewer or more general words · Try a category name</div>
          </div>
          {alsoBlock}
          <ProductRow title="Similar products" items={zr.similar} />
          <ProductRow title="Recommended for you" items={recs} />
        </>)}
      </>)}
    </div>
  );
}
