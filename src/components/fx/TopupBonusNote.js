import React, { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { fx, S } from '../../lib/fx';
import { money } from '../../lib/currency';

export default function TopupBonusNote({ payment, amount }) {
  const [c, setC] = useState(null);
  useEffect(() => { fx('fx_topup_bonus_info').then(setC).catch(() => {}); }, []);
  if (payment !== 'gotyme' || !c || !c.enabled) return null;
  const min = Number(c.min), cap = Number(c.cap), pct = Number(c.pct);
  const ok = Number(amount) >= min;
  const bonus = ok ? Math.min(cap, Math.round(Number(amount) * pct) / 100) : 0;
  return (
    <div style={{ ...S.card, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Gift size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13, lineHeight: 1.4 }}>
        {ok
          ? <><b>GoTyme bonus: +{money(bonus, 'fixed')}</b><div style={S.muted}>Credited to your Xwallet after your top-up is approved.</div></>
          : <><b>GoTyme bonus: +{pct}% (up to {money(cap, 'fixed')})</b><div style={S.muted}>Top up {money(min, 'fixed')} or more to receive it.</div></>}
      </div>
    </div>
  );
}
