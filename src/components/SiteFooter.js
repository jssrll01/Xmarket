import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── 4-column link groups ─── */
const GROUPS = [
  {
    title: 'Shop',
    links: [
      { label: 'Browse products', to: '/' },
      { label: 'XMALL',           to: '/xmall' },
      { label: 'Flash Sale',      to: '/flash-sale' },
      { label: 'Bundles',         to: '/bundles' },
      
    ],
  },
  {
    title: 'My account',
    links: [
      { label: 'My Orders',       to: '/orders' },
      { label: 'Wishlist',        to: '/wishlist' },
      { label: 'XWallet',         to: '/xwallet' },
      { label: 'Rewards',         to: '/rewards' },
      { label: 'Settings',        to: '/settings' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center',     to: '/help' },
      { label: 'Customer service', to: '/customer-service' },
      { label: 'My Reports',      to: '/my-reports' },
      { label: 'Returns',         to: '/returns' },
      { label: 'Shipping info',   to: '/help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',           to: '/help' },
      { label: 'Contact us',      to: '/customer-service' },
      { label: 'Notifications',   to: '/notifications' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy',  to: '/privacy' },
    ],
  },
];

export default function SiteFooter() {
  const navigate = useNavigate();
  return (
    <footer className="sf">
      <div className="sf-brand-row">
        <div className="sf-brand-name">
          <span className="sf-brand-x">X</span>MARKET
        </div>
        <div className="sf-brand-tag">More Products. Lower Prices.</div>
      </div>

      {/* Link columns */}
      <div className="sf-cols">
        {GROUPS.map((g) => (
          <div key={g.title} className="sf-col">
            <div className="sf-col-title">{g.title}</div>
            <ul className="sf-col-list">
              {g.links.map((l) => (
                <li key={l.label + l.to}>
                  <Link to={l.to} className="sf-col-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="sf-bottom">
        <div className="sf-copy">
          © {new Date().getFullYear()} XMARKET. All rights reserved.
        </div>
        <div className="sf-legal">
          <button onClick={() => navigate('/terms')} className="sf-legal-link">Terms</button>
          <span className="sf-legal-dot">·</span>
          <button onClick={() => navigate('/privacy')} className="sf-legal-link">Privacy</button>
          <span className="sf-legal-dot">·</span>
          <button onClick={() => navigate('/help')} className="sf-legal-link">Help</button>
        </div>
      </div>
    </footer>
  );
}
