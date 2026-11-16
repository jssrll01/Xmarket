import React, { useEffect, useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { fx, S } from '../../lib/fx';
import { money } from '../../lib/currency';

export default function SpendMilestone({ current }) {
  const [d, setD] = useState(null);
  useEffect(() => {
    let a = true;
    fx('fx_my_savings').then((r) => { if (a) setD(r); }).catch(() => {});
    return () => { a = false; };
  }, []);
  if (!d) return null;
  const total = Number(d.saved || 0) + Number(current || 0);
  if (!(total > 0)) return null;
  const steps = (d.steps || []).map(Number).filter((x) => x > 0).sort((a, b) => a - b);
  const next = steps.find((s) => s > total);
  const last = [...steps].reverse().find((s) => s <= total) || 0;
  const pct = next ? Math.min(100, Math.max(0, ((total - last) / (next - last)) * 100)) : 100;
  return (
    <div style={{ ...S.card, margin: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
        <PiggyBank size={18} color="var(--primary)" /> You've saved {money(total, 'fixed')}
      </div>
      <div style={S.bar}><i style={{ display: 'block', height: '100%', width: pct + '%', background: 'var(--primary)', borderRadius: 99 }} /></div>
      <div style={{ ...S.muted, marginTop: 6 }}>
        {next ? money(next - total, 'fixed') + ' more to reach the ' + money(next, 'fixed') + ' savings milestone' : "You've passed every savings milestone."}
      </div>
    </div>
  );
}
