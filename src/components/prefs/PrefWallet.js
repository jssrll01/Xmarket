import React, { useEffect, useState } from 'react';
import { useServerPrefs } from '../../lib/serverPrefs';
import { Card, Row, Toggle, field, ghost } from './PrefUi';

export default function PrefWallet() {
  const { sp, save, err } = useServerPrefs();
  const [amt, setAmt] = useState('');
  useEffect(() => { if (sp) setAmt(String(sp.low_bal_amount)); }, [sp]);
  return (
    <Card title="Xwallet">
      {sp === false && <div style={{ fontSize: 13, color: 'var(--muted, #64748B)' }}>Sign in to use wallet reminders.</div>}
      {sp && (
        <>
          <Row label="Low-balance reminder" hint="Get a notification when your balance drops below this amount.">
            <Toggle on={sp.low_bal_on} onChange={(v) => save({ low_bal_on: v, low_bal_amount: Number(amt) || 100 })} label="Low-balance reminder" />
          </Row>
          {sp.low_bal_on && (
            <div style={{ display: 'flex', gap: 8, margin: '4px 0 10px' }}>
              <input style={field} type="number" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="Amount in pesos" />
              <button type="button" style={ghost} onClick={() => save({ low_bal_amount: Number(amt) || 0 })}>Save</button>
            </div>
          )}
        </>
      )}
      {err && <div style={{ color: '#DC2626', fontSize: 12.5 }}>{err}</div>}
    </Card>
  );
}
