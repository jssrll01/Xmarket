import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createChart } from 'lightweight-charts';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export default function XCoin() {
  const [market, setMarket] = useState({ current_price: 0, prev_price: 0, market_state: 'Loading...' });
  const [wallet, setWallet] = useState({ real_balance: 0, avg_buy_price: 0 });
  const [xwalletBalance, setXwalletBalance] = useState(0);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const { data: m } = await supabase.from('xcoin_market_state').select('*').eq('id', 1).single();
      if (m) setMarket(m);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: w } = await supabase.from('xcoin_wallets').select('*').eq('user_id', user.id).single();
        if (w) setWallet(w);
        const { data: p } = await supabase.from('profiles').select('xwallet_balance').eq('id', user.id).single();
        if (p) setXwalletBalance(p.xwallet_balance);
      }
    }
    fetchData();

    const marketSub = supabase.channel('xcoin_market')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'xcoin_market_state' }, payload => {
        setMarket(payload.new);
      }).subscribe();

    return () => supabase.removeChannel(marketSub);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: 'solid', color: '#0f172a' }, textColor: '#94a3b8' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      width: chartContainerRef.current.clientWidth, height: 400,
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    const lineSeries = chart.addLineSeries({ color: '#2563EB', lineWidth: 2 });
    chartRef.current = { chart, lineSeries };

    async function fetchHistory() {
      const { data } = await supabase.from('xcoin_price_history')
        .select('price, recorded_at').order('recorded_at', { ascending: true }).limit(200);
      if (data) {
        const chartData = data.map(d => ({ time: new Date(d.recorded_at).getTime() / 1000, value: d.price }));
        lineSeries.setData(chartData);
      }
    }
    fetchHistory();

    const handleResize = () => { chart.applyOptions({ width: chartContainerRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);

  const executeTrade = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) { setMessage('Please enter a valid amount.'); setLoading(false); return; }
    const ref = 'XCOIN-' + Date.now() + '-' + Math.random().toString(36).substring(7);

    if (tradeType === 'buy') {
      const { data, error } = await supabase.rpc('xcoin_buy', { p_php_amount: amount, p_ref: ref });
      if (error) setMessage(error.message);
      else {
        setMessage(`Successfully bought ${data.xcoin_bought.toFixed(2)} XCOIN!`);
        setXwalletBalance(prev => prev - amount);
        setWallet(prev => ({ ...prev, real_balance: prev.real_balance + data.xcoin_bought }));
      }
    } else {
      const { data, error } = await supabase.rpc('xcoin_sell', { p_xcoin_amount: amount, p_ref: ref });
      if (error) setMessage(error.message);
      else {
        setMessage(`Successfully sold ${amount} XCOIN for ₱${data.php_received.toFixed(2)}!`);
        setXwalletBalance(prev => prev + data.php_received);
        setWallet(prev => ({ ...prev, real_balance: prev.real_balance - amount }));
      }
    }
    setTradeAmount(''); setLoading(false);
  };

  const priceChange = market.current_price - market.prev_price;
  const isUp = priceChange >= 0;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>XCOIN Market</h1>
        <div style={{ background: '#f1f5f9', padding: '10px 15px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Xwallet Balance</span>
          <strong style={{ fontSize: '18px', color: '#2563EB' }}>₱{xwalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Current Price</span>
                <div style={{ fontSize: '36px', fontWeight: 'bold' }}>₱{market.current_price.toFixed(4)}</div>
                <div style={{ color: isUp ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                  {isUp ? '▲' : '▼'} {Math.abs(priceChange).toFixed(4)} ({(Math.abs(priceChange / (market.prev_price || 1)) * 100).toFixed(2)}%)
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Market State</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: market.market_state.includes('Bullish') ? '#10b981' : market.market_state.includes('Bearish') ? '#ef4444' : '#f59e0b' }}>
                  {market.market_state}
                </div>
              </div>
            </div>
            <div ref={chartContainerRef} style={{ marginTop: '20px', borderRadius: '8px', overflow: 'hidden' }} />
          </div>
        </div>
        <div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setTradeType('buy')} style={{ flex: 1, padding: '10px', background: tradeType === 'buy' ? '#2563EB' : '#f1f5f9', color: tradeType === 'buy' ? '#fff' : '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Buy</button>
              <button onClick={() => setTradeType('sell')} style={{ flex: 1, padding: '10px', background: tradeType === 'sell' ? '#ef4444' : '#f1f5f9', color: tradeType === 'sell' ? '#fff' : '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sell</button>
            </div>
            <form onSubmit={executeTrade}>
              <label style={{ fontSize: '14px', color: '#64748b' }}>{tradeType === 'buy' ? 'Amount in PHP (₱)' : 'Amount in XCOIN'}</label>
              <input type="number" step="any" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '12px', marginTop: '5px', marginBottom: '15px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '16px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                <span>You will {tradeType === 'buy' ? 'receive' : 'pay'}:</span>
                <strong>{tradeType === 'buy' ? `${(parseFloat(tradeAmount) / market.current_price || 0).toFixed(2)} XCOIN` : `₱${(parseFloat(tradeAmount) * market.current_price || 0).toFixed(2)}`}</strong>
              </div>
              <button disabled={loading} type="submit" style={{ width: '100%', padding: '14px', background: tradeType === 'buy' ? '#2563EB' : '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Processing...' : (tradeType === 'buy' ? 'Buy XCOIN' : 'Sell XCOIN')}
              </button>
            </form>
            {message && <div style={{ marginTop: '15px', padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px', color: message.includes('Success') ? '#10b981' : '#ef4444' }}>{message}</div>}
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Your Portfolio</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>XCOIN Balance</span>
              <strong>{wallet.real_balance.toFixed(2)} XCOIN</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>Current Value</span>
              <strong>₱{(wallet.real_balance * market.current_price).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>Avg. Buy Price</span>
              <strong>₱{wallet.avg_buy_price.toFixed(4)}</strong>
            </div>
            <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '15px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Profit / Loss</span>
              <strong style={{ color: (market.current_price - wallet.avg_buy_price) >= 0 ? '#10b981' : '#ef4444' }}>
                ₱{((market.current_price - wallet.avg_buy_price) * wallet.real_balance).toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
