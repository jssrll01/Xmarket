import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Store, Search, X as XIcon, LayoutGrid, List,
  ArrowDownUp, Zap,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';
import EmptyState from '../components/EmptyState';
import { discountPct } from '../lib/variants';

const VIEW_KEY = 'xmall_view';         // 'grid' | 'list'
const SORT_KEY = 'xmall_sort';         // 'newest' | 'price_asc' | 'price_desc' | 'best'

const SORTS = [
  { id: 'newest',     label: 'Newest' },
  { id: 'price_asc',  label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'best',       label: 'Best selling' },
];

/* ─── One product card (grid or list) ─── */
function ProductCard({ product, view }) {
  const pct = discountPct(product);
  const price = Number(product.price) || 0;
  const orig = Number(product.original_price) || 0;
  const sold = Number(product.sold) || 0;
  const stock = Number(product.stock) || 0;
  const img = (product.images && product.images[0]) || product.image;

  if (view === 'list') {
    return (
      <Link to={`/product/${product.legacy_id || product.id}`} className="xmall-row">
        <div className="xmall-row-thumb">
          <SmartImage src={img} alt={product.name} />
          {pct !== null && <span className="discount-badge xmall-badge">-{pct}%</span>}
        </div>
        <div className="xmall-row-body">
          <div className="xmall-row-name">{product.name}</div>
          <div className="xmall-row-meta">
            {sold > 0 && <span>{sold} sold</span>}
            {product.instant && (
              <span className="instant-badge xmall-instant">
                <Zap size={10} /> Instant
              </span>
            )}
            {stock > 0 && stock <= 5 && (
              <span className="stock-low-pulse xmall-low">{stock} left</span>
            )}
          </div>
          <div className="xmall-row-price">
            <span className="xmall-price money">₱{price.toLocaleString()}</span>
            {orig > price && (
              <span className="xmall-orig money">₱{orig.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.legacy_id || product.id}`} className="xmall-card">
      <div className="xmall-card-thumb">
        <SmartImage src={img} alt={product.name} />
        {pct !== null && <span className="discount-badge xmall-badge">-{pct}%</span>}
        {product.instant && (
          <span className="instant-badge xmall-instant">
            <Zap size={10} /> Instant
          </span>
        )}
      </div>
      <div className="xmall-card-body">
        <div className="xmall-card-name">{product.name}</div>
        <div className="xmall-card-price">
          <span className="xmall-price money">₱{price.toLocaleString()}</span>
          {orig > price && (
            <span className="xmall-orig money">₱{orig.toLocaleString()}</span>
          )}
        </div>
        {(sold > 0 || (stock > 0 && stock <= 5)) && (
          <div className="xmall-card-meta">
            {sold > 0 && <span>{sold} sold</span>}
            {stock > 0 && stock <= 5 && (
              <span className="xmall-low">{stock} left</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Xmall() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState(() => localStorage.getItem(VIEW_KEY) || 'grid');
  const [sort, setSort] = useState(() => localStorage.getItem(SORT_KEY) || 'newest');

  // fetch once
  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('store', 'XMALL')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  // persist view + sort
  useEffect(() => { localStorage.setItem(VIEW_KEY, view); }, [view]);
  useEffect(() => { localStorage.setItem(SORT_KEY, sort); }, [sort]);

  // derive categories live from products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => { if (p.category) set.add(p.category); });
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  // filtered + sorted
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (needle && !((p.name || '').toLowerCase().includes(needle))) return false;
      return true;
    });

    switch (sort) {
      case 'price_asc':
        list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'price_desc':
        list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case 'best':
        list = [...list].sort((a, b) => (Number(b.sold) || 0) - (Number(a.sold) || 0));
        break;
      case 'newest':
      default:
        list = [...list].sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
    }
    return list;
  }, [products, q, category, sort]);

  const totalCount = products.length;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <button
        onClick={() => nav(-1)}
        className="icon-btn"
        style={{ marginBottom: 12 }}
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Store size={24} color="var(--primary)" />
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>XMALL</h2>
        <span style={{
          marginLeft: 4, fontSize: 10, fontWeight: 800,
          padding: '3px 8px', borderRadius: 20,
          background: 'var(--bg)', color: 'var(--muted)',
          border: '1px solid var(--border)',
          letterSpacing: .4, textTransform: 'uppercase',
        }}>Official</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        {loading
          ? 'Loading catalog…'
          : `${totalCount} product${totalCount === 1 ? '' : 's'} · curated from the XMARKET catalog`}
      </p>

      {/* Search */}
      <div className="xmall-search">
        <Search size={16} className="xmall-search-icon" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search XMALL products…"
          className="xmall-search-input"
        />
        {q && (
          <button
            className="xmall-search-clear"
            onClick={() => setQ('')}
            aria-label="Clear search"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>

      {/* Category chips */}
      {categories.length > 1 && (
        <div className="xmall-chips">
          {categories.map((c) => (
            <button
              key={c}
              className={'xmall-chip' + (category === c ? ' active' : '')}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar — sort + view toggle */}
      <div className="xmall-toolbar">
        <div className="xmall-sort">
          <ArrowDownUp size={14} color="var(--muted)" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="xmall-sort-select"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="xmall-view-toggle" role="group" aria-label="View mode">
          <button
            className={'xmall-view-btn' + (view === 'grid' ? ' active' : '')}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            className={'xmall-view-btn' + (view === 'list' ? ' active' : '')}
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className={view === 'grid' ? 'xmall-grid' : 'xmall-list'}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={view === 'grid' ? 'xmall-skel-card' : 'xmall-skel-row'} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Store}
          title={q || category !== 'All' ? 'No matches' : 'No products yet'}
          message={
            q || category !== 'All'
              ? 'Try clearing your search or picking a different category.'
              : 'New XMALL products will appear here as soon as they go live.'
          }
          action={q || category !== 'All' ? 'Reset filters' : undefined}
          onAction={
            q || category !== 'All'
              ? () => { setQ(''); setCategory('All'); }
              : undefined
          }
        />
      ) : (
        <div className={view === 'grid' ? 'xmall-grid' : 'xmall-list'}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}
