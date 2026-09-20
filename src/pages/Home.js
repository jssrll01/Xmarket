import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, X, SlidersHorizontal, ShoppingCart, Bell, ChevronDown, Check, Menu,
  Store, Settings, HelpCircle, MoreHorizontal, BadgeCheck, Download
} from 'lucide-react';
import { products, banners } from '../products';
import { useCart } from '../CartContext';

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  return (
    <div className="dd">
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

function Drawer({ open, onClose }) {
  const navigate = useNavigate();
  const [canInstall, setCanInstall] = useState(!!window.__deferredPrompt);

  useEffect(() => {
    const onPrompt = () => setCanInstall(true);
    window.addEventListener('bip-prompt-ready', onPrompt);
    return () => window.removeEventListener('bip-prompt-ready', onPrompt);
  }, []);

  if (!open) return null;

  const items = [
    { icon: Store, label: 'Start Selling', path: '/start-selling' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: MoreHorizontal, label: 'More', path: '/more' },
  ];

  const handleInstall = async () => {
    const prompt = window.__deferredPrompt;
    if (prompt) {
      prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        window.__deferredPrompt = null;
        setCanInstall(false);
      }
      return;
    }
    alert(
      'To install XMARKET:\n\n' +
      '• Android Chrome: menu (⋮) → Add to Home screen\n' +
      '• iOS Safari: Share (⬆) → Add to Home Screen\n' +
      '• Desktop Chrome: address bar install icon'
    );
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              <span className="gradient-text">X</span>MARKET
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Menu</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {items.map(it => {
          const Icon = it.icon;
          return (
            <button key={it.path} className="drawer-item"
              onClick={() => { onClose(); navigate(it.path); }}>
              <Icon size={18} color="#00d4ff" />
              {it.label}
            </button>
          );
        })}

        {canInstall && (
          <button className="drawer-item" onClick={handleInstall}>
            <Download size={18} color="#00d4ff" />
            Install App
          </button>
        )}
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer style={{
      marginTop: 32,
      padding: '24px 16px 32px',
      borderTop: '1px solid var(--border)',
      background: 'linear-gradient(180deg, transparent 0%, rgba(123,63,242,0.08) 100%)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>
        <span className="gradient-text">X</span>MARKET
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>
        More Products. Lower Prices.
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} XMARKET. All rights reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState('All');
  const [minDiscount, setMinDiscount] = useState(0);
  const [sort, setSort] = useState('best');
  const [loadingId, setLoadingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const { items, dispatch } = useCart();

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIdx(i => (i + 1) % banners.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

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

  const handleAdd = (p) => {
    setLoadingId(p.id);
    setTimeout(() => {
      dispatch({ type: 'ADD', payload: p });
      setLoadingId(null);
    }, 700);
  };

  return (
    <div style={{ paddingBottom: 40 }}>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 16px 4px'
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
            <span className="gradient-text">X</span>MARKET
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            Your World of <span style={{ color: '#00d4ff', fontWeight: 700 }}>Great Deals</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/notifications" className="icon-btn">
            <Bell size={20} />
            <span style={{
              position: 'absolute', top: 8, right: 8, width: 8, height: 8,
              borderRadius: '50%', background: 'var(--magenta)'
            }} />
          </Link>
          <Link to="/cart" className="icon-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--grad-btn)', color: '#fff',
                borderRadius: '50%', padding: '2px 6px',
                fontSize: 10, fontWeight: 700
              }}>{cartCount}</span>
            )}
          </Link>
          <button className="icon-btn" onClick={() => setDrawerOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="search-wrap">
        <div className="search-input-box">
          <Search size={16} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-dim)'
          }} />
          <input
            type="text" placeholder="Search a product..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36, paddingRight: 40 }}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <button className="icon-btn" onClick={() => setShowFilters(s => !s)}
          style={{
            background: showFilters ? 'var(--grad-btn)' : 'var(--card)',
            borderColor: showFilters ? 'transparent' : 'var(--border)'
          }}>
          <SlidersHorizontal size={18} />
        </button>
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
          <div className="banner-track"
            style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
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

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '4px 16px 12px'
      }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>Featured Products</div>
        <Dropdown value={sort} onChange={setSort}
          options={[
            { value: 'best', label: 'Best Seller' },
            { value: 'priceLow', label: 'Price: Low to High' },
            { value: 'priceHigh', label: 'Price: High to Low' }
          ]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            background: 'var(--card)', borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.4)'
          }}>
            <Link to={`/product/${p.id}`}>
              <div className="product-thumb">
                <img src={p.images[0]} alt={p.name} />
                {p.discount > 0 && (
                  <span style={{
                    position: 'absolute', top: 8, left: 8,
                    background: 'var(--grad-btn)', color: '#fff',
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999
                  }}>-{p.discount}%</span>
                )}
                {p.preorder && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#ff3d71', color: '#fff',
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999
                  }}>PRE-ORDER</span>
                )}
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, height: 36, overflow: 'hidden', fontWeight: 500 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Store size={11} color="#00d4ff" />
                  <span style={{
                    fontSize: 11, color: 'var(--text-dim)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    flex: 1
                  }}>{p.store}</span>
                  {p.verified && <BadgeCheck size={12} color="#00d4ff" />}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ color: '#00d4ff', fontWeight: 800, fontSize: 15 }}>₱{p.price}</span>
                  {p.originalPrice && (
                    <span style={{ color: 'var(--text-dim)', fontSize: 11, textDecoration: 'line-through' }}>₱{p.originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
            <button onClick={() => handleAdd(p)} disabled={loadingId === p.id}
              className="btn-primary"
              style={{ width: '100%', padding: 10, fontSize: 12, borderRadius: 0 }}>
              {loadingId === p.id
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <span className="spinner" /> ADDING
                  </span>
                : 'ADD TO CART'}
            </button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
