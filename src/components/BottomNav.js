import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

// The bar only shows on the main tabs. Every other page hides it.
const SHOW = ['/global-chat', '/socials', '/vip', '/digital-hub'];

const svg = (children) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const ITEMS = [
  { to: '/', label: 'Home', icon: svg(<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h5v-6h4v6h5V10" /></>) },
  { to: '/digital-hub', label: 'Digital Hub', icon: svg(<><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>) },
  { to: '/global-chat', label: 'Global Chat', center: true, icon: svg(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.2-4.3A8 8 0 1 1 21 12Z" />) },
  { to: '/socials', label: 'Socials', icon: svg(<><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M10 8.5v7l6-3.5-6-3.5Z" /></>) },
  { to: '/vip', label: 'VIP', icon: svg(<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z" />) },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const [note, setNote] = useState(false);
  const hidden = !(pathname === '/' || SHOW.some((p) => pathname === p || pathname.startsWith(p + '/')));

  useEffect(() => {
    document.body.classList.toggle('has-bottom-nav', !hidden);
    return () => document.body.classList.remove('has-bottom-nav');
  }, [hidden]);

  useEffect(() => {
    if (!note) return undefined;
    const t = setTimeout(() => setNote(false), 1800);
    return () => clearTimeout(t);
  }, [note]);

  if (hidden) return null;

  return (
    <>
      {note && <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 96, background: '#0F172A', color: '#fff', padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, zIndex: 3000 }}>Coming soon</div>}
      <nav className="bn" aria-label="Main navigation">
        {ITEMS.map((it) => it.soon ? (
          <button key="soon" type="button" className="bn-item" onClick={() => setNote(true)}>
            <span className="bn-ico">{it.icon}</span>
            <span className="bn-label">{it.label}</span>
          </button>
        ) : (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) => 'bn-item' + (it.center ? ' bn-center' : '') + (isActive ? ' active' : '')}
          >
            <span className="bn-ico">{it.icon}</span>
            <span className="bn-label">{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
