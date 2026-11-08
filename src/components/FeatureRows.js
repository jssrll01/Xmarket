import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Film, Newspaper, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';

const ROWS = [
  ['/market-shop', 'Market Shop', 'Buy VIP or gift a friend', Store, '#2563EB'],
  ['/cinema', 'Cinema', 'Watch movies, pay once', Film, '#DC2626'],
  ['/articles', 'Weekly Articles', 'Read the latest', Newspaper, '#059669'],
  ['/scholarships', 'Scholarships', 'Opportunities to apply for', GraduationCap, '#7C3AED'],
  ['/freelance', 'Freelance work', 'Find work at XMARKET', Briefcase, '#D97706'],
];

export default function FeatureRows() {
  const nav = useNavigate();
  return (
    <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
      {ROWS.map(([to, title, sub, Icon, c]) => (
        <div key={to} className="card" role="button" tabIndex={0} onClick={() => nav(to)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nav(to); }}
          style={{ padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: c + '1A', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={22} color={c} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{sub}</div>
          </div>
          <ChevronRight size={18} color="#94a3b8" />
        </div>
      ))}
    </div>
  );
}
