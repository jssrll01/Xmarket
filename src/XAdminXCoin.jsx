import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export default function XAdminXCoin() {
  const [settings, setSettings] = useState(null);
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: s } = await supabase.from('xcoin_settings').select('*').eq('id', 1).single();
    const { data: m } = await supabase.from('xcoin_market_state').select('*').eq('id', 1).single();
    if (s) setSettings(s);
    if (m) setMarket(m);
    setLoading(false);
  }

  async function updateSettings(field, value) {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    const { error } = await supabase.from('xcoin_settings').update({ [field]: value }).eq('id', 1);
    if (error) setMsg('Error: ' + error.message);
    else setMsg('Settings updated successfully.');
  }

  async function forceTick() {
    setMsg('Triggering market tick...');
    const { data, error } = await supabase.rpc('xcoin_tick_market');
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg(`Market ticked. New price: ₱${data.new_price.toFixed(4)}`);
      fetchData();
    }
  }

  async function forcePriceCrash() {
    setMsg('Forcing market crash...');
    await supabase.from('xcoin_settings').update({ drift: -0.5, volatility: 0.3 }).eq('id', 1);
    const { error } = await supabase.rpc('xcoin_tick_market');
    if (!error) {
      setMsg('Crash executed. Drift and Volatility restored.');
      await supabase.from('xcoin_settings').update({ drift: 0.01, volatility: 0.05 }).eq('id', 1);
      fetchData();
    }
  }

  async function setCustomPrice() {
    const p = parseFloat(manualPrice);
    if (isNaN(p) || p <= 0) return setMsg('Invalid price');
    const { error } = await supabase.from('xcoin_market_state').update({ current_price: p, prev_price: p }).eq('id', 1);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg(`Price manually set to ₱${p.toFixed(4)}`);
      setManualPrice('');
      fetchData();
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>XCOIN Administration</h1>
      
      {msg && <div style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '20px', color: '#0f172a' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* MARKET CONTROL */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Market Controls</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Current Price</label>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563EB' }}>₱{market?.current_price.toFixed(4)}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>State: {market?.market_state}</div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={forceTick} style={{ flex: 1, padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Force Market Tick</button>
            <button onClick={forcePriceCrash} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simulate Crash</button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" step="any" value={manualPrice} onChange={e => setManualPrice(e.target.value)} placeholder="Manual Price (₱)" style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <button onClick={setCustomPrice} style={{ padding: '10px 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Set Price</button>
          </div>
        </div>
        {/* SETTINGS */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Platform Settings</h2>

          <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#334155' }}>Market Enabled</span>
            <button onClick={() => updateSettings('is_enabled', !settings.is_enabled)} style={{ padding: '5px 15px', background: settings.is_enabled ? '#10b981' : '#ef4444', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              {settings.is_enabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#334155', marginBottom: '5px' }}>Transaction Fee (%)</label>
            <input type="number" step="0.1" value={settings.fee_percentage} onChange={e => updateSettings('fee_percentage', parseFloat(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#334155', marginBottom: '5px' }}>Max Buy Amount (₱)</label>
            <input type="number" value={settings.max_buy_php} onChange={e => updateSettings('max_buy_php', parseFloat(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#334155', marginBottom: '5px' }}>Volatility (Base)</label>
            <input type="number" step="0.01" value={settings.volatility} onChange={e => updateSettings('volatility', parseFloat(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
