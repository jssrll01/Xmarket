import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, X, SlidersHorizontal, ShoppingCart, Bell, ChevronDown, Check, Menu,
  Store, HelpCircle, MoreHorizontal, BadgeCheck, PackageSearch, User, Heart
} from 'lucide-react';
import { banners, fetchProducts } from '../lib/products';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SmartImage from '../components/SmartImage';
import { ProductGridSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import useRecentSearches from '../hooks/useRecentSearches';
import UserMenu from '../components/UserMenu';

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
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

function VariantModal({ product, onClose, onConfirm }) {
  const [variant, setVariant] = useState(null);
  const [error, setError] = useState(false);
  if (!product) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(15,23,42,0.5)',
      animation: 'modalFadeIn 180ms ease-out',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: 20, animation: 'modalPop 220ms ease-out' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Select a Variant</h3>
          <button onClick={onClose} className="icon-btn" style={{ width: 34, height: 34 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
          {product.name}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {product.variants.map(v => (
            <button key={v}
              onClick={() => { setVariant(v); setError(false); }}
              className={'chip' + (variant === v ? ' active' : '')}
              style={{ border: error && variant !== v ? '1px solid #DC2626' : undefined }}>
              {v}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: '#DC2626', fontSize: 12, marginBottom: 12 }}>
            Please select a variant to continue
          </div>
        )}

        <button
          onClick={() => {
            if (!variant) { setError(true); return; }
            onConfirm(variant);
          }}
          className="btn-primary"
          style={{ width: '100%', padding: 12 }}>
          Confirm
        </button>
      </div>
    </div>
  );
}

function Drawer({ open, onClose }) {
  const navigate = useNavigate();
  const items = [
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: MoreHorizontal, label: 'More', path: '/more' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  ];
  return (
    <>
      <div
        className={'drawer-backdrop' + (open ? ' open' : '')}
        onClick={onClose}
      />
      <div className={'drawer' + (open ? ' open' : '')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>XMARKET</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Menu</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {items.map(it => {
          const Icon = it.icon;
          return (
            <button key={it.path} className="drawer-item"
              onClick={() => { onClose(); navigate(it.path); }}>
              <Icon size={18} />
              {it.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState('All');
  const [minDiscount, setMinDiscount] = useState(0);
  const [sort, setSort] = useState('priceLow');
  const [loadingId, setLoadingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [variantProduct, setVariantProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const { recent, add: addRecent, remove: removeRecent, clear: clearRecent } = useRecentSearches();
  const { items, dispatch } = useCart();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const hyd = setTimeout(() => setHydrated(true), 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setInterval(() => {
      setBannerIdx(i => (i + 1) % banners.length);
    }, 3500);
    return () => {
      clearInterval(t);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(hyd);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetchProducts().then(list => {
      if (alive) {
        setProducts(list);
        setProductsLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  const order = ['All', 'MALL', 'Food', 'E-Book', 'Website', 'Device', 'Mobile', 'Accessories'];
  const found = Array.from(new Set(products.map(p => p.category)));
  const categories = order.filter(c => c === 'All' || found.includes(c));

  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    p.price <= maxPrice &&
    (category === 'All' || p.category === category) &&
    p.discount >= minDiscount
  );
  if (sort === 'priceLow') filtered.sort((a,b) => a.price - b.price);
  if (sort === 'priceHigh') filtered.sort((a,b) => b.price - a.price);
  if (sort === 'best') filtered.sort((a,b) => b.sold - a.sold);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (p, variant = '') => {
    setLoadingId(p.id);
    setTimeout(async () => {
      await dispatch({ type: 'ADD', payload: {
        product_id: p.uuid,
        variant: variant || '',
        quantity: 1,
      }});
      setLoadingId(null);
      showToast('Added to cart');
    }, 500);
  };

  const handleAdd = (p) => {
    if (!user) {
      showToast('Please sign in to add items');
      navigate('/signin');
      return;
    }
    if (p.variants && p.variants.length > 0) {
      setVariantProduct(p);
      return;
    }
    addToCart(p);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setMinDiscount(0);
    setMaxPrice(1000000);
  };

  const suggestions = search.length >= 2
    ? Array.from(new Set(products.map(p => p.name)))
        .filter(n => n.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className="page-enter" style={{ paddingBottom: 40 }}>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {variantProduct && (
        <VariantModal
          product={variantProduct}
          onClose={() => setVariantProduct(null)}
          onConfirm={(v) => {
            addToCart(variantProduct, v);
            setVariantProduct(null);
          }}
        />
      )}
      <div className={'sticky-header' + (scrolled ? ' scrolled' : '')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 4px' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>XMARKET</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Your World of Great Deals</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/notifications" className="icon-btn">
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 8, right: 8,
                width: 10, height: 10, borderRadius: '50%',
                background: '#DC2626',
                border: '2px solid #FFFFFF'
              }} />
            </Link>
            <Link to="/cart" className="icon-btn">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <UserMenu />
            <button className="icon-btn" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

        <div className="search-wrap" style={{ position: 'relative' }}>
          <div className="search-input-box">
            <Search size={16} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--muted)'
            }} />
            <input type="text" placeholder="Search a product..."
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
              onKeyDown={e => { if (e.key === 'Enter') { addRecent(search); e.target.blur(); } }}
              style={{ paddingLeft: 36, paddingRight: 40 }} />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>
          <button className="icon-btn" onClick={() => setShowFilters(s => !s)}>
            <SlidersHorizontal size={18} />
          </button>

          {searchFocus && (
            <div className="search-suggest" onMouseDown={e => e.preventDefault()}>
              {recent.length > 0 && search.length < 3 && (
                <>
                  <div className="ss-head">
                    <span>Recent searches</span>
                    <button onClick={clearRecent} className="ss-clear">Clear</button>
                  </div>
                  {recent.map(term => (
                    <div key={term} className="ss-item">
                      <button className="ss-term" onClick={() => { setSearch(term); addRecent(term); }}>
                        <Search size={14} />
                        <span>{term}</span>
                      </button>
                      <button className="ss-x" onClick={() => removeRecent(term)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </>
              )}
              {search.length >= 2 && (
                <>
                  <div className="ss-head"><span>Suggestions</span></div>
                  {suggestions.map(n => (
                    <button key={n} className="ss-term" onClick={() => { setSearch(n); addRecent(n); }}>
                      <Search size={14} />
                      <span>{n}</span>
                    </button>
                  ))}
                  {suggestions.length === 0 && (
                    <div className="ss-empty">No suggestions</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {showFilters && (
          <div className="card" style={{ margin: '4px 16px 12px', padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Filters</div>
            <label>Max Price: ₱{maxPrice}</label>
            <input type="range" min="0" max="1000000" step="1000" value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%' }} />
            <label style={{ display: 'block', marginTop: 6 }}>Min Discount: {minDiscount}%</label>
            <input type="range" min="0" max="100" value={minDiscount}
              onChange={e => setMinDiscount(+e.target.value)} style={{ width: '100%' }} />
          </div>
        )}

      <div className="banner-wrap" style={{ padding: '12px 16px 4px' }}>
        <div style={{ overflow: 'hidden', borderRadius: 18 }}>
          <div className="banner-track" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
            {banners.map((b, i) => (
              <div key={i} className="banner-slide-full">
                <img src={b} alt={'Banner ' + (i+1)} />
              </div>
            ))}
          </div>
        </div>
        <div className="banner-dots">
          {banners.map((_, i) => (
            <span key={i} className={'banner-dot' + (i === bannerIdx ? ' active' : '')} />
          ))}
        </div>
      </div>

      <div className="chips">
        {categories.map(c => (
          <button key={c}
            className={'chip' + (category === c ? ' active' : '')}
            onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 16px 12px' }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>Featured Products</div>
        <Dropdown value={sort} onChange={setSort}
          options={[
            { value: 'priceLow', label: 'Price: Low to High' },
            { value: 'priceHigh', label: 'Price: High to Low' },
            { value: 'best', label: 'Best Seller' },
          ]} />
      </div>

      {(!hydrated || productsLoading) ? (
        <ProductGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          message="Try adjusting your filters or search term."
          action="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="card fade-up" style={{ borderRadius: 18, overflow: 'hidden', animationDelay: Math.min(i * 40, 400) + 'ms' }}>
              <Link to={`/product/${p.id}`}>
                <div className="product-thumb">
                  <SmartImage src={p.images[0]} alt={p.name} />
                  {p.preorder && <span className="preorder-badge">PRE-ORDER</span>}
                  {p.instant && !p.preorder && <span className="instant-badge">INSTANT</span>}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{
                    fontSize: 13, lineHeight: '1.35em', height: '2.7em',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: 700
                  }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Store size={11} />
                    <span style={{
                      fontSize: 11, color: 'var(--muted)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1
                    }}>{p.store}</span>
                    {p.verified && <BadgeCheck size={12} color="#2563EB" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>₱{p.price}</span>
                    {p.originalPrice && (
                      <span style={{ color: 'var(--muted)', fontSize: 11, textDecoration: 'line-through' }}>₱{p.originalPrice}</span>
                    )}
                    {p.discount > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: 6, lineHeight: 1 }}>
                        -{p.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <button onClick={() => handleAdd(p)} disabled={loadingId === p.id}
                className="btn-primary"
                style={{ width: "100%", padding: 11, fontSize: 12, borderRadius: 0 }}>
                {loadingId === p.id
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      <span className="spinner" /> ADDING
                    </span>
                  : 'ADD TO CART'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
