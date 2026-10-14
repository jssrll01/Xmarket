import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Download, Check, Loader2, ShieldCheck, Link2, Send, Camera, Video,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

/* ─── 4-column link groups ─── */
const GROUPS = [
  {
    title: 'Shop',
    links: [
      { label: 'Browse products', to: '/' },
      { label: 'XMALL',           to: '/xmall' },
      { label: 'Flash Sale',      to: '/flash-sale' },
      { label: 'Bundles',         to: '/bundles' },
      { label: 'Categories',      to: '/categories' },
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
      { label: 'Contact us',      to: '/help' },
      { label: 'My Reports',      to: '/reports' },
      { label: 'Returns',         to: '/returns' },
      { label: 'Shipping info',   to: '/help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',           to: '/about' },
      { label: 'Careers',         to: '/about' },
      { label: 'Press',           to: '/about' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy',  to: '/privacy' },
    ],
  },
];

/* ─── Payment methods (inline SVG-free pills) ─── */
const PAYMENTS = [
  { id: 'gcash',  label: 'GCash',  bg: '#007DFE', fg: '#fff' },
  { id: 'maya',   label: 'Maya',   bg: '#16C784', fg: '#fff' },
  { id: 'xwallet',label: 'XWallet', bg: '#0F766E', fg: '#fff' },
  { id: 'cod',    label: 'COD',    bg: '#F59E0B', fg: '#422006' },
];

const SOCIALS = [
  { id: 'fb',  icon: Link2,  href: 'https://facebook.com',  label: 'Facebook' },
  { id: 'tw',  icon: Send,   href: 'https://twitter.com',   label: 'Twitter / X' },
  { id: 'ig',  icon: Camera, href: 'https://instagram.com', label: 'Instagram' },
  { id: 'yt',  icon: Video,  href: 'https://youtube.com',   label: 'YouTube' },
];

export default function SiteFooter() {
  const navigate = useNavigate();
  const { show: showToast } = useToast();

  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const [installed, setInstalled] = useState(false);

  /* ─── PWA install hook ─── */
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    // Already installed?
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) {
      showToast?.('Use your browser menu → "Install app"');
      return;
    }
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setInstallEvent(null);
  };

  /* ─── Newsletter submit ─── */
  const handleSubscribe = async (e) => {
    e?.preventDefault?.();
    const clean = email.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      showToast?.('Enter a valid email');
      return;
    }
    setSending(true);
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: clean, source: 'footer' });
    setSending(false);

    // 23505 = unique violation → already subscribed, that's fine
    if (error && String(error.code) !== '23505') {
      showToast?.(error.message || 'Could not subscribe');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast?.('Subscribed. Thanks!', 'success');
  };

  return (
    <footer className="sf">
      {/* Top section: brand + newsletter */}
      <div className="sf-top">
        <div className="sf-brand">
          <div className="sf-brand-name">
            <span className="sf-brand-x">X</span>MARKET
          </div>
          <div className="sf-brand-tag">More Products. Lower Prices.</div>
          <div className="sf-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-social"
                aria-label={s.label}
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="sf-news">
          <div className="sf-news-title">
            <Mail size={14} /> Get the latest deals
          </div>
          <div className="sf-news-sub">
            New drops, flash sales, and promos — straight to your inbox.
          </div>
          {subscribed ? (
            <div className="sf-news-done">
              <Check size={14} /> You're on the list. Thanks!
            </div>
          ) : (
            <form className="sf-news-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sf-news-input"
                disabled={sending}
              />
              <button
                type="submit"
                className="sf-news-btn"
                disabled={sending || !email.trim()}
              >
                {sending ? <Loader2 size={14} className="spin" /> : 'Subscribe'}
              </button>
            </form>
          )}
          <div className="sf-news-note">
            <ShieldCheck size={11} /> No spam. Unsubscribe anytime.
          </div>
        </div>
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

      {/* Install PWA strip */}
      {!installed && (
        <div className="sf-install">
          <div className="sf-install-left">
            <Download size={18} />
            <div>
              <div className="sf-install-title">Install XMARKET app</div>
              <div className="sf-install-sub">
                Faster, offline-ready, and always one tap away.
              </div>
            </div>
          </div>
          <button className="sf-install-btn" onClick={handleInstall} type="button">
            Install
          </button>
        </div>
      )}

      {/* Payments */}
      <div className="sf-pay">
        <div className="sf-pay-title">We accept</div>
        <div className="sf-pay-row">
          {PAYMENTS.map((p) => (
            <span
              key={p.id}
              className="sf-pay-pill"
              style={{ background: p.bg, color: p.fg }}
            >
              {p.label}
            </span>
          ))}
        </div>
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
