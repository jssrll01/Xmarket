import React, { useState, useEffect, useRef } from 'react';
import { CoinIcon } from './playtime/GameIcons';
import PillRow, { pillStyle } from '../components/PillRow';
import WalletBar from '../components/WalletBar';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, X, ShoppingCart, Bell, ChevronDown, Check, Menu,
  Store, HelpCircle, MoreHorizontal, BadgeCheck, PackageSearch, User, Heart
, Gift, Settings, LogOut , Zap , Percent, SlidersHorizontal, Ticket, Sparkles, MessageSquare } from 'lucide-react';
import { banners as staticBanners, fetchProducts, fetchProductStatsMap } from '../lib/products';
import { supabase as bannerDb } from '../lib/supabase';
import { sortByStock, isOutOfStock } from '../lib/stock';
import { priceRange, hasRealVariants } from '../lib/variants';
import { supabase } from '../lib/supabase';
import { unreadCount } from '../lib/notifications';
import { Star } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SmartImage from '../components/SmartImage';
import { ProductGridSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import useRecentSearches from '../hooks/useRecentSearches';
import UserMenu from '../components/UserMenu';
import VariantPicker from '../components/VariantPicker';


// Banner copy — parallel to `banners` array in lib/products.js (index-aligned).
// Keeps data layer untouched; edit here to change slide copy.
const BANNER_META = [
  { title: 'Mega Deals Week', sub: 'Up to 70% off across all categories', cta: 'Shop Now' },
  { title: 'Free Shipping', sub: 'On orders over ₱500 nationwide', cta: 'Learn More' },
  { title: 'New Arrivals', sub: 'Fresh drops every Friday', cta: 'Explore' },
];

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
  const [selection, setSelection] = useState({});
  const [error, setError] = useState(false);
  if (!product) return null;

  const config = product.variant_config && Object.keys(product.variant_config).length > 0
    ? product.variant_config
    : (product.variants && product.variants.length > 0 ? { Variant: product.variants } : {});
  const dims = Object.keys(config);
  const complete = dims.length > 0 && dims.every(d => selection[d]);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" style={{ width: '100%', maxWidth: 380, padding: 20 }}
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

        <div style={{ marginBottom: 16 }}>
          <VariantPicker
            product={product}
            selection={selection}
            onChange={(sel) => { setSelection(sel); setError(false); }}
            error={error}
          />
        </div>

        {error && (
          <div style={{ color: '#DC2626', fontSize: 12, marginBottom: 12 }}>
            Please select all options to continue
          </div>
        )}

        <button
          onClick={() => {
            if (!complete) { setError(true); return; }
            onConfirm(JSON.stringify(selection));
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
  const nav = useNavigate();
  if (!open) return null;

  const go = (path) => { onClose(); nav(path); };

  const row = {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '16px 20px', fontSize: 16, fontWeight: 600,
    background: 'var(--card)', borderRadius: 14, marginBottom: 10,
    cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
    color: 'inherit',
  };

  return (
    <div className={'drawer-backdrop' + (open ? ' open' : '')} onClick={onClose}>
      <div className={'drawer' + (open ? ' open' : '')} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>XMARKET</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Menu</div>
          </div>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>

        <button style={row} onClick={() => go('/support')}>
          <Sparkles size={20} color="var(--primary)" /> Xautomated Support
        </button>
        <button style={row} onClick={() => go('/help')}>
          <HelpCircle size={20} color="var(--primary)" /> Help
        </button>
        <button style={row} onClick={() => go('/more')}>
          <MoreHorizontal size={20} color="var(--primary)" /> More
        </button>
      </div>
    </div>
  );
}


export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [unread, setUnread] = useState(0);
  const [trending, setTrending] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [storeFilter, setStoreFilter] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('best');
  const [loadingId, setLoadingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [banners, setBanners] = useState(staticBanners);
  const [bannerRows, setBannerRows] = useState([]);
  useEffect(() => {
    let alive = true;
    bannerDb.from('banners').select('*').eq('active', true).order('sort_order')
      .then(({ data }) => {
        if (!alive || !data) return;
        const now = new Date().toISOString();
        const ok = data.filter(b => b.image_url && (!b.starts_at || b.starts_at <= now) && (!b.ends_at || b.ends_at > now));
        if (ok.length) { setBanners(ok.map(b => b.image_url)); setBannerRows(ok); setBannerIdx(0); }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const [bannerHover, setBannerHover] = useState(false);
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

  const loadProducts = React.useCallback(() => {
    let alive = true;
    setLoadError(null);
    setProductsLoading(true);
    Promise.all([fetchProducts(), fetchProductStatsMap()])
      .then(([list, statsMap]) => {
        if (!alive) return;
        setProducts(list);
        setStats(statsMap);
        setProductsLoading(false);
      })
      .catch(err => {
        if (!alive) return;
        setLoadError(err.message || 'Failed to load products');
        setProductsLoading(false);
      });
    return () => { alive = false; };
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    import('../lib/products').then(({ fetchProducts }) => {
      fetchProducts().then(list => {
        setTrending(list.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5));
      });
    });
  }, []);

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    unreadCount(user.id).then(setUnread);
  }, [user]);

  useEffect(() => {
    let alive = true;
    if (!user) { setWishlist(new Set()); return; }
    supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!alive) return;
        setWishlist(new Set((data || []).map(w => w.product_id)));
      });
    return () => { alive = false; };
  }, [user]);




  const toggleWishlist = async (p, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { showToast('Please sign in'); navigate('/signin'); return; }
    if (!p.uuid) return;
    const isWished = wishlist.has(p.uuid);
    if (isWished) {
      const { error } = await supabase.from('wishlists').delete()
        .eq('user_id', user.id).eq('product_id', p.uuid);
      if (!error) {
        setWishlist(prev => { const n = new Set(prev); n.delete(p.uuid); return n; });
        showToast('Removed from wishlist');
      }
    } else {
      const { error } = await supabase.from('wishlists').insert({ user_id: user.id, product_id: p.uuid });
      if (!error) {
        setWishlist(prev => new Set(prev).add(p.uuid));
        showToast('Added to wishlist');
      }
    }
  };

  const order = ['All', 'MALL', 'Food', 'E-Book', 'Website', 'Device', 'Mobile', 'Accessories'];
  const found = Array.from(new Set(products.map(p => p.category)));
  const categories = order.filter(c => c === 'All' || found.includes(c));

  let filtered = sortByStock(products).filter(p => {
    if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && p.category !== category) return false;
    if (minRating > 0 && (stats[p.uuid]?.avgRating || 0) < minRating) return false;
    if (storeFilter && !(p.store || '').toLowerCase().includes(storeFilter.toLowerCase())) return false;
    return true;
  });
  if (sort === 'priceLow' || sort === 'price') filtered.sort((a,b) => priceRange(a).min - priceRange(b).min);
  if (sort === 'priceHigh')                   filtered.sort((a,b) => priceRange(b).max - priceRange(a).max);
  if (sort === 'best' || sort === 'popularity' || sort === 'sales') {
    filtered.sort((a,b) => (b.sold || 0) - (a.sold || 0));
  }
  if (sort === 'rating')   filtered.sort((a,b) => ((stats[b.uuid]?.avgRating || 0) - (stats[a.uuid]?.avgRating || 0)));
  if (sort === 'newest')   filtered.sort((a,b) => (b.created_at || '') > (a.created_at || '') ? 1 : -1);
  if (sort === 'relevance') { /* no sort override — natural order */ }
  filtered = sortByStock(filtered);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (p, variant = '') => {
    setLoadingId(p.id);
    setTimeout(async () => {
      const v = typeof variant === 'string' ? variant : (variant && Object.keys(variant).length ? JSON.stringify(variant) : '');
      const res = await dispatch({ type: 'ADD', payload: {
        product_id: p.uuid,
        variant: v,
        quantity: 1,
      }});
      setLoadingId(null);
      if (res && res.ok === false) showToast((res.error && res.error.message) || 'Could not add to cart');
      else showToast('Added to cart');
    }, 500);
  };

  const handleAdd = (p) => {
    if (!user) {
      showToast('Please sign in to add items');
      navigate('/signin');
      return;
    }
    if (hasRealVariants(p)) {
      setVariantProduct(p);
      return;
    }
    addToCart(p);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('best');
    setMinRating(0);
    setMaxPrice(1000000);
    setMinDiscount(0);
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
          <div className="brand-row">
            <div className="brand-badge">
              <img src="/icons/icon.svg" alt="XMARKET" />
            </div>
            <div className="brand-text">
              <div className="brand-name">X<span className="accent">MARKET</span></div>
              <div className="brand-tag">Your World of Great Deals</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/notifications" className="icon-btn" aria-label="Notifications">
              <Bell size={20} />
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#DC2626',
                }} />
              )}
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
                        <span className="ss-icon-wrap"><Search size={13} /></span>
                        <span className="ss-body">
                          <span className="ss-primary">{term}</span>
                          <span className="ss-hint">Recent search</span>
                        </span>
                      </button>
                      <button className="ss-x" onClick={() => removeRecent(term)} aria-label="Remove">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </>
              )}
              {search.length >= 2 && (
                <>
                  <div className="ss-head"><span>Suggestions</span></div>
                  {suggestions.map(n => {
                    const hit = products.find(pp => pp.name === n);
                    const thumb = hit && hit.images && hit.images[0];
                    const hint = hit && hit.category ? hit.category : 'Product';
                    return (
                      <button key={n} className="ss-term" onClick={() => { setSearch(n); addRecent(n); }}>
                        <span className="ss-icon-wrap">
                          {thumb ? <img src={thumb} alt="" /> : <Search size={13} />}
                        </span>
                        <span className="ss-body">
                          <span className="ss-primary">{n}</span>
                          <span className="ss-hint">{hint}</span>
                        </span>
                      </button>
                    );
                  })}
                  {suggestions.length === 0 && (
                    <div className="ss-empty-wrap">
                      <div className="ss-empty-icon">
                        <PackageSearch size={20} />
                      </div>
                      <div className="ss-empty-title">No matches</div>
                      <div className="ss-empty-sub">Try a different keyword or browse categories below</div>
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <button
                      className="ss-cta"
                      onClick={() => { addRecent(search); setSearchFocus(false); }}
                    >
                      Browse all results for &ldquo;{search}&rdquo;
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

<div className="banner-wrap" style={{ padding: '12px 16px 4px' }}>
        <div
          className="banner-stage"
          onMouseEnter={() => setBannerHover && setBannerHover(true)}
          onMouseLeave={() => setBannerHover && setBannerHover(false)}
        >
          <div className="banner-track" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
            {banners.map((b, i) => {
              const meta = BANNER_META[i % BANNER_META.length];
              const isActive = i === bannerIdx;
              return (
                <div key={i} className={'banner-slide-full' + (isActive ? ' active' : '')}>
                  <img src={b} alt={meta.title} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              );
            })}
          </div>
          {bannerRows[bannerIdx] && bannerRows[bannerIdx].cta_link && (
            /^https?:/i.test(bannerRows[bannerIdx].cta_link)
              ? <a href={bannerRows[bannerIdx].cta_link} target="_blank" rel="noreferrer" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 12, textDecoration: 'none' }}>
                  {bannerRows[bannerIdx].cta_text && <span style={{ background: '#fff', color: '#2563EB', fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 999, boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>{bannerRows[bannerIdx].cta_text}</span>}
                </a>
              : <Link to={bannerRows[bannerIdx].cta_link} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 12, textDecoration: 'none' }}>
                  {bannerRows[bannerIdx].cta_text && <span style={{ background: '#fff', color: '#2563EB', fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 999, boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>{bannerRows[bannerIdx].cta_text}</span>}
                </Link>
          )}
          <div className="banner-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={'Slide ' + (i+1)}
                className={'banner-dot' + (i === bannerIdx ? ' active' : '')}
                onClick={() => setBannerIdx(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <WalletBar />

      {/* Quick-access buttons */}
      <PillRow>
        <Link to="/xmall" className="pill" style={{ ...pillStyle, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #DC2626, #F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Store size={16} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>XMALL</div>
          </div>
        </Link>
        <Link to="/flash-sale" className="pill" style={{ ...pillStyle, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #F59E0B, #DC2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>Flash Sale</div>
          </div>
        </Link>
        <Link to="/savemore" className="pill" style={{ ...pillStyle, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Percent size={16} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>Save More</div>
          </div>
        </Link>
        <Link to="/bundles" className="pill" style={{ ...pillStyle, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Gift size={16} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>Bundle Deals</div>
          </div>
        </Link>
        <Link to="/rewards" className="pill" style={{ ...pillStyle, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CoinIcon size={18} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>Loyalty Points</div>
          </div>
        </Link>
        <Link to="/vouchers" className="pill pill-vouchers" style={{ ...pillStyle, flexShrink: 0, scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Ticket size={16} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>Vouchers</div>
          </div>
          <span className="pill-shine" />
        </Link>
      </PillRow>
      <div className="chips">
        {categories.map(c => (
          <button key={c}
            className={'chip' + (category === c ? ' active' : '')}
            onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>


      {showFilters && (
      <div className="filter-card">
        <div className="filter-card-head">
          <div className="filter-card-title">Filters</div>
          {(minRating > 0 || maxPrice < 1000000 || minDiscount > 0) && (
            <button
              className="filter-reset"
              onClick={() => { setMinRating(0); setMaxPrice(1000000); setMinDiscount(0); }}
            >Reset</button>
          )}
        </div>

        <div className="filter-row">
          <div className="filter-label">
            <span>Min rating</span>
            <span className="filter-value">
              {minRating > 0 ? minRating.toFixed(1) + '★' : 'Any'}
            </span>
          </div>
          <input
            type="range" min="0" max="5" step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(+e.target.value)}
          />
          <div className="filter-stars">
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ opacity: s <= minRating ? 1 : 0.25 }}>★</span>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-label">
            <span>Max price</span>
            <span className="filter-value">₱{maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range" min="0" max="1000000" step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(+e.target.value)}
          />
        </div>

        <div className="filter-row">
          <div className="filter-label">
            <span>Min discount</span>
            <span className="filter-value">{minDiscount}%</span>
          </div>
          <input
            type="range" min="0" max="100" step="5"
            value={minDiscount}
            onChange={(e) => setMinDiscount(+e.target.value)}
          />
        </div>
      </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 16px 12px', gap: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 800, flexShrink: 0 }}>Featured Products</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className={'filters-trigger' + ((minRating > 0 || maxPrice < 1000000 || minDiscount > 0) ? ' active' : '')}
            onClick={() => setShowFilters(s => !s)}
            aria-label="Filters"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {(minRating > 0 || maxPrice < 1000000 || minDiscount > 0) && (
              <span className="filters-dot" />
            )}
          </button>
        <Dropdown value={sort} onChange={setSort}
          options={[
            { value: 'relevance',  label: 'Sort by relevance' },
            { value: 'newest',     label: 'Sort by newest' },
            { value: 'price',      label: 'Sort by price' },
            { value: 'popularity', label: 'Sort by popularity' },
            { value: 'rating',     label: 'Sort by rating' },
            { value: 'discount',   label: 'Sort by discount' },
            { value: 'sales',      label: 'Sort by sales' },
            { value: 'priceLow',   label: 'Price: Low to High' },
            { value: 'priceHigh',  label: 'Price: High to Low' },
            { value: 'best',       label: 'Best Seller' },
          ]} />
        </div>
      </div>

      {loadError ? (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Couldn't load products</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>{loadError}</div>
          <button className="btn-primary" onClick={loadProducts} style={{ padding: '12px 24px' }}>
            Try again
          </button>
        </div>
      ) : (!hydrated || productsLoading) ? (
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
            <div key={p.id} className="card fade-up" style={{ borderRadius: 18, overflow: 'hidden', animationDelay: Math.min(i * 40, 400) + 'ms', position: 'relative' }}>
              <button
                onClick={(e) => toggleWishlist(p, e)}
                aria-label="Wishlist"
                style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 5,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                }}
              >
                <Heart
                  size={16}
                  fill={wishlist.has(p.uuid) ? '#DC2626' : 'none'}
                  color={wishlist.has(p.uuid) ? '#DC2626' : '#475569'}
                />
              </button>
              <Link
                to={isOutOfStock(p) ? '#' : `/product/${p.id}`}
                onClick={(e) => { if (isOutOfStock(p)) e.preventDefault(); }}
                style={{
                  opacity: isOutOfStock(p) ? 0.55 : 1,
                  filter: isOutOfStock(p) ? 'grayscale(0.6)' : 'none',
                }}
              >
                <div className="product-thumb" style={{ position: "relative" }}>
                  <SmartImage src={p.images[0]} alt={p.name} />

                  {isOutOfStock(p) && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(15,23,42,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 3,
                    }}>
                      <span style={{
                        padding: '6px 14px', borderRadius: 8,
                        background: '#EF4444', color: '#fff',
                        fontSize: 11, fontWeight: 900, letterSpacing: 1,
                        boxShadow: '0 4px 12px rgba(239,68,68,0.4)',
                      }}>
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  <div style={{
                    position: 'absolute', top: 8, left: 8, zIndex: 4,
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    {p.preorder && <span style={{ display: "inline-block", fontSize: 9, padding: "3px 6px", borderRadius: 4, background: "#7C3AED", color: "#fff", fontWeight: 700, letterSpacing: 0.5, boxShadow: "0 2px 6px rgba(15,23,42,0.15)" }}>PRE-ORDER</span>}
                    {p.instant && !p.preorder && <span style={{ display: "inline-block", fontSize: 9, padding: "3px 6px", borderRadius: 4, background: "#10B981", color: "#fff", fontWeight: 700, letterSpacing: 0.5, boxShadow: "0 2px 6px rgba(15,23,42,0.15)" }}>INSTANT</span>}
                  </div>
</div>
                <div style={{ padding: 12 }}>
                  <div style={{
                    fontSize: 13, lineHeight: '1.35em', height: '2.7em',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: 700
                  }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, overflow: 'hidden' }}>
                    <Store size={11} style={{ flexShrink: 0 }} />
                    <Link to={`/store/${encodeURIComponent(p.store)}`} style={{ fontSize: 10, color: "var(--muted)", opacity: 0.85, textDecoration: "none", fontWeight: 500, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120, textTransform: "uppercase", letterSpacing: 0.3 }}>{p.store}</Link>
                    {p.verified && <BadgeCheck size={12} color="#2563EB" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{priceRange(p).display}</span>
                    
                  </div>
                </div>
              </Link>
              <button
                onClick={() => !isOutOfStock(p) && handleAdd(p)}
                disabled={loadingId === p.id || isOutOfStock(p)}
                className={isOutOfStock(p) ? '' : 'btn-primary'}
                style={{
                  width: "100%", padding: 11, fontSize: 12, borderRadius: 0,
                  background: isOutOfStock(p) ? '#94A3B8' : undefined,
                  color: isOutOfStock(p) ? '#fff' : undefined,
                  border: 'none',
                  cursor: isOutOfStock(p) ? 'not-allowed' : 'pointer',
                }}>
                {isOutOfStock(p)
                  ? 'SOLD OUT'
                  : loadingId === p.id
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
