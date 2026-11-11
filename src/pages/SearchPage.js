import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, X, Clock, Trash2, TrendingUp, PackageSearch } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useRecentSearches from '../hooks/useRecentSearches';
import { imgUrl } from '../lib/img';
import VoiceButton from '../components/VoiceButton';
import LongPressPreview from '../components/LongPressPreview';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
const clean = (s) => String(s || '').replace(/[%,()*\\]/g, ' ').trim();
const minPrice = (vp) => { const v = Object.values(vp || {}).map(Number).filter(n => n > 0); return v.length ? Math.min(...v) : 0; };
const SORTS = [['rel', 'Relevance'], ['new', 'Latest'], ['sold', 'Top Sales'], ['pa', 'Price ↑'], ['pd', 'Price ↓']];
const COLS = 'id,name,category,store,images,sold,variant_prices,created_at,description';

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
              <div style={{ fontWeight: 800, fontSize: 14, color: '#DC2626', marginTop: 4 }}>{peso(minPrice(p.variant_prices))}</div>
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

  useEffect(() => {
    const t = clean(text);
    if (q || t.length < 2) { setSugg([]); return undefined; }
    const h = setTimeout(async () => {
      const { data } = await supabase.from('products').select('name').ilike('name', '%' + t + '%').limit(6);
      setSugg((data || []).map(r => r.name));
    }, 200);
    return () => clearTimeout(h);
  }, [text, q]);

  useEffect(() => {
    const t = clean(q);
    if (!t) { setRows([]); return; }
    let alive = true;
    setLoading(true);
    const p = '%' + t + '%';
    supabase.from('products').select(COLS)
      .or(`name.ilike.${p},category.ilike.${p},store.ilike.${p}`).limit(80)
      .then(({ data }) => { if (alive) { setRows(data || []); setLoading(false); } });
    return () => { alive = false; };
  }, [q]);

  const go = (term) => {
    const t = (term || '').trim();
    if (!t) return;
    add(t); setParams({ q: t });
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

  const chip = { padding: '8px 14px', borderRadius: 999, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' };

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
        <VoiceButton onText={(t, fin) => { setText(t); if (fin) go(t); }} />
        <button onClick={() => go(text)} style={{ fontWeight: 800, color: 'var(--primary)', padding: '0 4px' }}>Search</button>
      </div>

      {!q && (
        <div style={{ padding: '4px 16px' }}>
          {sugg.length > 0 ? sugg.map(n => (
            <button key={n} onClick={() => go(n)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <Search size={15} color="#94a3b8" /> {n}
            </button>
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
                <div style={{ fontWeight: 800, fontSize: 16, color: '#DC2626', marginTop: 6 }}>{peso(p.price)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{p.store}</span>
                  <span>{p.sold || 0} sold</span>
                </div>
              </div>
            </Link></LongPressPreview>
          ))}
        </div>
        {!loading && list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
            <PackageSearch size={44} />
            <div style={{ fontWeight: 800, color: 'var(--text)', marginTop: 10 }}>No products found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try a different keyword or check the spelling.</div>
          </div>
        )}
      </>)}
    </div>
  );
}
