import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Zap, Tag, ShieldCheck, Sparkles, Gift, Clock, Star, Truck } from 'lucide-react';

const notifs = [
  { icon: Bell, title: 'Welcome to XMARKET!', body: 'Enjoy discounted prices on all products. Shop now and save more!' },
  { icon: Zap, title: 'Instant Delivery Now Available!', body: 'All digital products now support Instant Delivery with no delivery fee.' },
  { icon: Sparkles, title: 'New Arrivals', body: 'Check out the newest additions to our MALL and E-Book collections.' },
  { icon: Tag, title: 'Seasonal Vouchers', body: 'Limited-time discounts are live on the Home banner. Grab them before they end!' },
  { icon: ShieldCheck, title: 'Verified Sellers', body: 'Look for the blue badge next to store names. All verified sellers are trusted.' },
  { icon: Gift, title: 'Free Minor Adjustments', body: 'Selected digital services include 1 month of free minor adjustments after delivery.' },
  { icon: Truck, title: 'Meet-up Option Available', body: 'Prefer face-to-face? Choose Meet-up at checkout — 3 to 7 days, ₱15 per km.' },
  { icon: Clock, title: 'Pre-order Items', body: 'Pre-order products ship 7-14 days after confirmation. Look for the PRE-ORDER tag.' },
  { icon: Star, title: 'Rate Your Experience', body: 'Loved your purchase? Let us know — feedback helps us improve.' },
];

export default function Notifications() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 14 }}>Notifications</h2>
      {notifs.map((n, i) => {
        const Icon = n.icon;
        return (
          <div key={i} className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div className="notif-icon">
              <Icon size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
