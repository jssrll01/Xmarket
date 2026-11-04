import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { createChart, LineSeries } from 'lightweight-charts';

export default function XCoin() {
  const [market, setMarket] = useState({ current_price: 0, prev_price: 0, market_state: 'Loading...', high_24h: 0, low_24h: 0 });
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
      width: chartContainerRef.current.clientWidth, height: 350,
      timeScale: { timeVisible: true, secondsVisible: false },
      rightPriceScale: { borderColor: '#1e293b' },
    });
    const lineSeries = chart.addSeries(LineSeries, { color: '#3b82f6', lineWidth: 3 });
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
  const pnl = (market.current_price - wallet.avg_buy_price) * wallet.real_balance;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#0f172a', padding: '24px 20px', color: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>XCOIN Market</h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Trade XCOIN directly with your Xwallet</p>
          </div>
          <div style={{ background: '#1e293b', padding: '12px 20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Xwallet Balance</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc' }}>₱{xwalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-20px auto 0', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>XCOIN Price</div>
              <div style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>₱{market.current_price.toFixed(4)}</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ background: isUp ? '#ecfdf5' : '#fef2f2', color: isUp ? '#10b981' : '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                  {isUp ? '▲' : '▼'} {Math.abs(priceChange).toFixed(4)} ({Math.abs((priceChange / (market.prev_price || 1)) * 100).toFixed(2)}%)
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>24h High: ₱{market.high_24h?.toFixed(4)}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Market State</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px', color: market.market_state?.includes('Bullish') ? '#10b981' : market.market_state?.includes('Bearish') ? '#ef4444' : '#f59e0b' }}>
                {market.market_state}
              </div>
            </div>
          </div>
          <div ref={chartContainerRef} style={{ borderRadius: '12px', overflow: 'hidden' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
              <button onClick={() => setTradeType('buy')} style={{ flex: 1, padding: '10px', background: tradeType === 'buy' ? '#fff' : 'transparent', color: tradeType === 'buy' ? '#2563EB' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: tradeType === 'buy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Buy</button>
              <button onClick={() => setTradeType('sell')} style={{ flex: 1, padding: '10px', background: tradeType === 'sell' ? '#fff' : 'transparent', color: tradeType === 'sell' ? '#ef4444' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: tradeType === 'sell' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Sell</button>
            </div>
            <form onSubmit={executeTrade}>
              <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                {tradeType === 'buy' ? 'Amount in PHP' : 'Amount in XCOIN'}
              </label>
              <div style={{ position: 'relative', marginTop: '8px', marginBottom: '16px' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 'bold' }}>{tradeType === 'buy' ? '₱' : 'X'}</span>
                <input type="number" step="any" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '16px 16px 16px 36px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '18px', fontWeight: '600', outline: 'none', background: '#f8fafc' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                <span>You will {tradeType === 'buy' ? 'receive' : 'pay'}:</span>
                <strong style={{ color: '#0f172a' }}>{tradeType === 'buy' ? `${(parseFloat(tradeAmount) / market.current_price || 0).toFixed(2)} XCOIN` : `₱${(parseFloat(tradeAmount) * market.current_price || 0).toFixed(2)}`}</strong>
              </div>
              <button disabled={loading} type="submit" style={{ width: '100%', padding: '16px', background: tradeType === 'buy' ? '#2563EB' : '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                {loading ? 'Processing...' : (tradeType === 'buy' ? 'Buy XCOIN' : 'Sell XCOIN')}
              </button>
            </form>
            {message && <div style={{ marginTop: '16px', padding: '12px', background: message.includes('Success') ? '#ecfdf5' : '#fef2f2', borderRadius: '8px', fontSize: '14px', color: message.includes('Success') ? '#10b981' : '#ef4444', fontWeight: '500' }}>{message}</div>}
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>Your Portfolio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Balance</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{wallet.real_balance.toFixed(2)} <span style={{ fontSize: '12px', color: '#64748b' }}>XCOIN</span></div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Current Value</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>₱{(wallet.real_balance * market.current_price).toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Avg. Buy Price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>₱{wallet.avg_buy_price.toFixed(4)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Profit / Loss</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: pnl >= 0 ? '#10b981' : '#ef4444' }}>
                  {pnl >= 0 ? '+' : ''}₱{pnl.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
