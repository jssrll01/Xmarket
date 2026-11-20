import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, pri } from './PrefUi';

export default function PrefData() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const go = async () => {
    setBusy(true); setMsg('');
    const { data, error } = await supabase.rpc('my_data_export');
    setBusy(false);
    if (error || !data || !data.ok) { setMsg((data && data.error) || (error && error.message) || 'Could not export your data.'); return; }
    const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'xmarket-my-data-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setMsg('Your data was downloaded.');
  };
  return (
    <Card title="Your data">
      <div style={{ fontSize: 13, color: 'var(--muted, #64748B)', marginBottom: 10 }}>Download your profile, orders, wallet history, reviews and posts as a file. Private messages and security details are not included.</div>
      <button type="button" style={pri} disabled={busy} onClick={go}>{busy ? 'Preparing...' : 'Download my data'}</button>
      {msg && <div style={{ fontSize: 13, marginTop: 8 }}>{msg}</div>}
    </Card>
  );
}
