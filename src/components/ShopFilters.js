import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { priceRange } from '../lib/variants';
import { sortByStock } from '../lib/stock';
import { fetchProductStatsMap } from '../lib/products';

export const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Sort by relevance' },
  { value: 'newest',     label: 'Sort by newest' },
  { value: 'price',      label: 'Sort by price' },
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating',     label: 'Sort by rating' },
  { value: 'sales',      label: 'Sort by sales' },
  { value: 'priceLow',   label: 'Price: Low to High' },
  { value: 'priceHigh',  label: 'Price: High to Low' },
  { value: 'best',       label: 'Best Seller' },
];

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  return (
    <div className="dd" ref={ref}>
      <button className="dd-trigger" onClick={() => setOpen(!open)}>
        {current?.label}<ChevronDown size={14} />
      </button>
      {open && (
        <div className="dd-menu">
          {options.map(o => (
            <button key={o.value}
              className={'dd-item' + (o.value === value ? ' active' : '')}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              {o.label}
              {o.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function useProductFilters(items, defaultSort = 'price') {
  const [sort, setSort] = useState(defaultSort);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    let alive = true;
    Promise.resolve(fetchProductStatsMap())
      .then((m) => { if (alive && m) setStats(m); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const top = useMemo(() => {
    let t = 0;
    for (const p of items) { const m = priceRange(p).max || 0; if (m > t) t = m; }
    return Math.max(100, Math.ceil(t / 10) * 10);
  }, [items]);
  const limit = maxPrice === null ? top : Math.min(maxPrice, top);
  const priceOn = maxPrice !== null && maxPrice < top;
  const filtersOn = minRating > 0 || priceOn;

  const shown = useMemo(() => {
    const rate = (p) => (stats[p.uuid || p.id]?.avgRating || 0);
    const list = items.filter((p) => {
      if (minRating > 0 && rate(p) < minRating) return false;
      if (priceOn && priceRange(p).min > limit) return false;
      return true;
    });
    if (sort === 'priceLow' || sort === 'price') list.sort((a, b) => priceRange(a).min - priceRange(b).min);
    else if (sort === 'priceHigh') list.sort((a, b) => priceRange(b).max - priceRange(a).max);
    else if (sort === 'best' || sort === 'popularity' || sort === 'sales') list.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    else if (sort === 'rating') list.sort((a, b) => rate(b) - rate(a));
    else if (sort === 'newest') list.sort((a, b) => ((b.created_at || '') > (a.created_at || '') ? 1 : -1));
    return sortByStock(list);
  }, [items, sort, minRating, priceOn, limit, stats]);

  const bar = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 12px', gap: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>
          {shown.length} {shown.length === 1 ? 'product' : 'products'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className={'filters-trigger' + (filtersOn ? ' active' : '')}
            onClick={() => setShowFilters((s) => !s)}
            aria-label="Filters"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {filtersOn && <span className="filters-dot" />}
          </button>
          <Dropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      </div>

      {showFilters && (
        <div className="filter-card" style={{ margin: '0 0 12px' }}>
          <div className="filter-card-head">
            <div className="filter-card-title">Filters</div>
            {filtersOn && (
              <button className="filter-reset" onClick={() => { setMinRating(0); setMaxPrice(null); }}>Reset</button>
            )}
          </div>

          <div className="filter-row">
            <div className="filter-label">
              <span>Min rating</span>
              <span className="filter-value">{minRating > 0 ? minRating.toFixed(1) + '★' : 'Any'}</span>
            </div>
            <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(+e.target.value)} />
            <div className="filter-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ opacity: s <= minRating ? 1 : 0.25 }}>★</span>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-label">
              <span>Max price</span>
              <span className="filter-value">₱{limit.toLocaleString()}</span>
            </div>
            <input type="range" min="0" max={top} step="10" value={limit} onChange={(e) => setMaxPrice(+e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );

  return { shown, bar, filtersOn };
}
