import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, X as XIcon, ChevronRight, ShoppingBag, Wallet,
  RotateCcw, Truck, ShieldCheck, MessageSquare, HelpCircle, TrendingUp,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  { id: 'orders',   icon: ShoppingBag, label: 'Orders & delivery',  desc: 'Tracking, cancellation, delays' },
  { id: 'payment',  icon: Wallet,      label: 'Payments & wallet',  desc: 'Top-ups, refunds, XCards' },
  { id: 'returns',  icon: RotateCcw,   label: 'Returns & refunds',  desc: 'How to request, timeline' },
  { id: 'shipping', icon: Truck,       label: 'Shipping options',   desc: 'Instant, standard, preorder' },
  { id: 'account',  icon: ShieldCheck, label: 'Account & security', desc: 'Password, 2FA, verification' },
  { id: 'contact',  icon: MessageSquare, label: 'Contact support',  desc: 'Chat, tickets, escalation' },
];

const ARTICLES = [
  { id: 'a1',  cat: 'orders',  q: 'Where is my order?',               body: 'Go to My Orders, tap any order to see its status. Instant deliveries appear within minutes; standard items ship the same or next day.' },
  { id: 'a2',  cat: 'orders',  q: 'How do I cancel an order?',        body: 'Open the order in My Orders and tap Cancel. Orders can only be cancelled before the seller has shipped the item.' },
  { id: 'a3',  cat: 'payment', q: 'How do I top up XWallet?',         body: 'Open XWallet and tap Top up. Choose GCash, Maya, or a bank card, and the amount will appear in seconds.' },
  { id: 'a4',  cat: 'payment', q: 'How do refunds work?',             body: 'Approved refunds are credited to XWallet within 24 hours. You can withdraw to your original payment method from XWallet.' },
  { id: 'a5',  cat: 'payment', q: 'What is an XCard?',                body: 'XCards are gift or voucher codes. Redeem one on the XCards page and its value is added to your XWallet.' },
  { id: 'a6',  cat: 'returns', q: 'How do I request a return?',       body: 'From My Orders, open the order and tap Request return. Pick a reason and add photos if needed. You have 7 days after delivery.' },
  { id: 'a7',  cat: 'returns', q: 'Return timeline explained',        body: 'Requested → Approved → Shipped back → Refunded. You can track each stage on the Returns page.' },
  { id: 'a8',  cat: 'shipping',q: 'What does Instant mean?',          body: 'Instant items ship within 1–2 hours of checkout for the same city. Availability is shown on each product page.' },
  { id: 'a9',  cat: 'shipping',q: 'Do you ship outside the city?',    body: 'Yes — the seller sets delivery zones. You will see the estimated delivery date at checkout.' },
  { id: 'a10', cat: 'account', q: 'How do I reset my password?',      body: 'Settings → Change password. We will email a reset link to the address on your account.' },
  { id: 'a11', cat: 'account', q: 'How do I verify my account?',      body: 'Open Account and follow the Get verified hint. You will need to confirm your email and phone.' },
  { id: 'a12', cat: 'contact', q: 'How do I contact a seller?',       body: 'Open any product and tap Message seller. Replies usually arrive within a few hours.' },
  { id: 'a13', cat: 'contact', q: 'How do I file a complaint?',       body: 'Use Report on any order, product, or seller. Track the ticket from My Reports.' },
];

const TRENDING = ['a1', 'a3', 'a6', 'a10', 'a12'];

function searchArticles(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return ARTICLES.filter(
    (a) =>
      a.q.toLowerCase().includes(needle) ||
      a.body.toLowerCase().includes(needle)
  );
}

export default function Help() {
  const nav = useNavigate();
  const { user } = useAuth() || {};
  const [q, setQ] = useState('');
  const [openArticle, setOpenArticle] = useState(null);

  const results = useMemo(() => searchArticles(q), [q]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const trendingList = TRENDING
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter(Boolean);

  // Article detail view
  if (openArticle) {
    const a = openArticle;
    const cat = CATEGORIES.find((c) => c.id === a.cat);
    return (
      <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button onClick={() => setOpenArticle(null)} className="icon-btn">
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 900, flex: 1 }}>Help</h2>
        </div>

        <div className="hp-article-cat">
          {cat && <><cat.icon size={12} /> {cat.label}</>}
        </div>
        <h3 className="hp-article-title">{a.q}</h3>
        <p className="hp-article-body">{a.body}</p>

        <button
          className="hp-contact-cta"
          onClick={() => nav('/reports')}
        >
          <MessageSquare size={14} /> Still need help? Contact support
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>Help Center</h2>
      </div>

      {/* Search */}
      <div className="hp-search">
        <Search size={16} className="hp-search-icon" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help articles…"
          className="hp-search-input"
        />
        {q && (
          <button
            className="hp-search-clear"
            onClick={() => setQ('')}
            aria-label="Clear search"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>

      {/* Search results */}
      {q ? (
        results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No results"
            message="Try a different word or browse the categories below."
            action="Clear search"
            onAction={() => setQ('')}
          />
        ) : (
          <div className="hp-results">
            {results.map((a) => {
              const cat = CATEGORIES.find((c) => c.id === a.cat);
              return (
                <button
                  key={a.id}
                  className="hp-result"
                  onClick={() => setOpenArticle(a)}
                  type="button"
                >
                  <div className="hp-result-icon">
                    {cat && <cat.icon size={16} color="var(--primary)" />}
                  </div>
                  <div className="hp-result-body">
                    <div className="hp-result-title">{a.q}</div>
                    <div className="hp-result-snippet">
                      {a.body.slice(0, 80)}{a.body.length > 80 ? '…' : ''}
                    </div>
                  </div>
                  <ChevronRight size={15} color="var(--muted)" />
                </button>
              );
            })}
          </div>
        )
      ) : (
        <>
          {/* Trending questions */}
          <div className="hp-section-head">
            <TrendingUp size={14} color="#F59E0B" />
            <span>Trending questions</span>
          </div>

          <div className="hp-trending">
            {trendingList.map((a) => (
              <button
                key={a.id}
                className="hp-trend"
                onClick={() => setOpenArticle(a)}
                type="button"
              >
                <span className="hp-trend-dot" />
                <span className="hp-trend-label">{a.q}</span>
                <ChevronRight size={13} color="var(--muted)" />
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="hp-section-head">
            <BookOpen size={14} color="var(--primary)" />
            <span>Browse by topic</span>
          </div>

          <div className="hp-cats">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  className="hp-cat"
                  onClick={() => {
                    // Filter articles by category
                    const first = ARTICLES.find((a) => a.cat === c.id);
                    if (first) setOpenArticle(first);
                  }}
                  type="button"
                >
                  <div className="hp-cat-icon">
                    <Icon size={18} color="var(--primary)" />
                  </div>
                  <div className="hp-cat-body">
                    <div className="hp-cat-title">{c.label}</div>
                    <div className="hp-cat-desc">{c.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Contact CTA */}
          <button
            className="hp-contact-cta"
            onClick={() => (user ? nav('/reports') : nav('/signin'))}
          >
            <MessageSquare size={14} /> Contact support
          </button>
        </>
      )}
    </div>
  );
}
