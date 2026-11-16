import React, { useEffect, useState } from 'react';
import { Hourglass } from 'lucide-react';
import { fx, S, when } from '../../lib/fx';

export default function PointsExpiryBanner() {
  const [d, setD] = useState(null);
  useEffect(() => { fx('fx_my_points_expiry').then(setD).catch(() => {}); }, []);
  if (!d || !d.enabled || !(Number(d.amount) > 0) || !d.expires_at) return null;
  const days = (new Date(d.expires_at).getTime() - Date.now()) / 86400000;
  if (days > 7) return null;
  const reduced = Number(d.earned_in_window) >= Number(d.min_earn);
  return (
    <div style={{ ...S.card, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Hourglass size={18} color="#B45309" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13, lineHeight: 1.45 }}>
        <b>{Number(d.amount).toLocaleString()} points ({d.current_pct}%) expire {when(d.expires_at)}</b>
        <div style={S.muted}>
          {reduced
            ? 'You earned enough points in the last ' + d.window_hours + ' hours, so the expiry is reduced to ' + d.reduced_pct + '%.'
            : 'Earn ' + d.min_earn + ' or more points in the ' + d.window_hours + ' hours before this time to cut it to ' + d.reduced_pct + '%.'}
        </div>
      </div>
    </div>
  );
}
