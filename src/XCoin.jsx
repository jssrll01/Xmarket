import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { createChart, CandlestickSeries, AreaSeries, CrosshairMode } from 'lightweight-charts';
import { useNavigate } from 'react-router-dom';

const TFS = [['1m', 60], ['5m', 300], ['15m', 900], ['1H', 3600], ['4H', 14400], ['1D', 86400]];
const perMinute = (rows) => {
  const m = new Map();
  rows.forEach((t) => m.set(Math.floor(t.time / 60), t.value));
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([b, v]) => ({ time: b * 60, value: v }));
};
const BUY_SPREAD = 1.005;
const SELL_SPREAD = 0.995;
const UP = '#16a34a';
const DOWN = '#dc2626';

const CSS = `
.xc{background:#f4f6fb;min-height:100vh;color:#0f172a;font-family:Inter,system-ui,sans-serif;padding-bottom:40px}
.xc *{box-sizing:border-box}
.xc-top{background:#ffffff;border-bottom:1px solid #e2e8f0;padding:12px 14px;position:sticky;top:0;z-index:20}
.xc-top-in{max-width:1240px;margin:0 auto;display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap}
.xc-back{background:none;border:0;color:#64748b;font-size:13px;cursor:pointer;padding:0}
.xc-pair{display:flex;align-items:center;gap:10px}
.xc-logo{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#ef4444);display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff}
.xc-pair b{font-size:16px}.xc-pair small{display:block;color:#64748b;font-size:11px}
.xc-chip{font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;background:#dbeafe;color:#1d4ed8;margin-left:6px}
.xc-clock{font-family:ui-monospace,monospace;color:#0284c7;font-size:13px;font-weight:700}
.xc-wal{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:6px 12px;text-align:right}
.xc-wal small{display:block;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.8px}
.xc-wal b{font-size:16px}
.xc-wrap{max-width:1240px;margin:0 auto;padding:12px 12px 0;display:grid;gap:12px;grid-template-columns:minmax(0,1fr);align-items:start}
@media(min-width:1000px){
  .xc-wrap{grid-template-columns:minmax(0,1fr) 340px}
  .xc-a{grid-column:1;grid-row:1 / span 2}
  .xc-b{grid-column:2;grid-row:1}
  .xc-c{grid-column:2;grid-row:2}
  .xc-d{grid-column:1;grid-row:3 / span 1}
}
.xc-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;box-shadow:0 1px 2px rgba(15,23,42,.04)}
.xc-ticker{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 14px}
@media(min-width:700px){.xc-ticker{grid-template-columns:repeat(6,1fr)}}
.xc-stat small{display:block;color:#64748b;font-size:10.5px;text-transform:uppercase;letter-spacing:.6px}
.xc-stat b{font-size:13.5px}
.xc-price{font-size:34px;font-weight:900;letter-spacing:-1px;line-height:1.05}
.xc-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:12px 0 8px}
.xc-tf{background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:700;cursor:pointer}
.xc-tf.on{background:#2563eb;color:#fff;border-color:#2563eb}
.xc-sp{flex:1}
.xc-chart{border-radius:10px;overflow:hidden;background:#ffffff;border:1px solid #eef2f7;height:380px}
.xc-ohlc{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:#64748b;margin-top:8px;font-family:ui-monospace,monospace}
.xc-seg{display:grid;grid-template-columns:1fr 1fr;background:#f1f5f9;border-radius:10px;padding:3px;margin-bottom:12px}
.xc-seg button{border:0;border-radius:8px;padding:10px;font-weight:800;font-size:14px;cursor:pointer;background:transparent;color:#64748b}
.xc-lbl{display:flex;justify-content:space-between;font-size:11.5px;color:#64748b;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px}
.xc-inp{display:flex;align-items:center;background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:0 12px}
.xc-inp:focus-within{border-color:#2563eb;background:#fff}
.xc-inp span{color:#64748b;font-weight:800}
.xc-inp input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:#0f172a;font-size:18px;font-weight:700;padding:13px 8px}
.xc-pcts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0 12px}
.xc-pcts button{background:#f1f5f9;border:1px solid #e2e8f0;color:#334155;border-radius:8px;padding:6px 0;font-size:12px;font-weight:700;cursor:pointer}
.xc-row{display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin:6px 0}
.xc-row b{color:#0f172a}
.xc-go{width:100%;border:0;border-radius:10px;padding:14px;font-weight:900;font-size:15px;color:#fff;cursor:pointer;margin-top:10px}
.xc-go:disabled{opacity:.55;cursor:not-allowed}
.xc-msg{margin-top:10px;padding:10px 12px;border-radius:8px;font-size:13px;font-weight:600}
.xc-h{font-size:14px;font-weight:800;margin:0 0 10px;display:flex;justify-content:space-between;align-items:center}
.xc-pf{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.xc-pf small{display:block;color:#64748b;font-size:10.5px;text-transform:uppercase;letter-spacing:.6px}
.xc-pf b{font-size:16px}
.xc-ticks{max-height:260px;overflow:auto}
.xc-tk{display:grid;grid-template-columns:1fr 1fr 1fr;font-family:ui-monospace,monospace;font-size:12px;padding:5px 0;border-bottom:1px solid #f1f5f9}
.xc-tk span:nth-child(2){text-align:right}.xc-tk span:nth-child(3){text-align:right;color:#64748b}
.xc-gauge{height:8px;border-radius:6px;background:#e2e8f0;overflow:hidden;margin-top:6px}
.xc-gauge i{display:block;height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)}
.xc-note{font-size:11px;color:#64748b;margin-top:8px;line-height:1.4}
`;

const peso = (n, d = 2) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: d, maximumFractionDigits: d });

const phtFmt = (sec, o) => new Date(sec * 1000).toLocaleString('en-PH', { timeZone: 'Asia/Manila', ...o });
const phtTick = (sec, type) => (type >= 3 ? phtFmt(sec, { hour: 'numeric', minute: '2-digit', hour12: true }) : type === 2 ? phtFmt(sec, { month: 'short', day: 'numeric' }) : type === 1 ? phtFmt(sec, { month: 'short' }) : phtFmt(sec, { year: 'numeric' }));

function aggregate(ticks, step) {
  const candles = [];
  const vols = [];
  let cur = null;
  for (const t of ticks) {
    const b = Math.floor(t.time / step) * step;
    if (!cur || cur.time !== b) {
      cur = { time: b, open: t.value, high: t.value, low: t.value, close: t.value, n: 1 };
      candles.push(cur);
    } else {
      cur.high = Math.max(cur.high, t.value);
      cur.low = Math.min(cur.low, t.value);
      cur.close = t.value;
      cur.n += 1;
    }
  }
  for (let i = 1; i < candles.length; i++) {
    candles[i].open = candles[i - 1].close;
    candles[i].high = Math.max(candles[i].high, candles[i].open);
    candles[i].low = Math.min(candles[i].low, candles[i].open);
  }
  return { candles, vols };
}

export default function XCoin() {
  const navigate = useNavigate();
  const [market, setMarket] = useState({ current_price: 0, prev_price: 0, current_regime: 'Loading...', high_24h: 0, low_24h: 0, ath: 0, atl: 0, volume_24h: 0 });
  const [wallet, setWallet] = useState({ real_balance: 0, avg_buy_price: 0 });
  const [xwalletBalance, setXwalletBalance] = useState(0);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [phtTime, setPhtTime] = useState('');
  const [tf, setTf] = useState('1m');
  const [style, setStyle] = useState('candles');
  const [ticks, setTicks] = useState([]);
  const [hover, setHover] = useState(null);

  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const ticksRef = useRef([]);
  const tfRef = useRef('1m');
  const pendRef = useRef(null);
  tfRef.current = tf;

  useEffect(() => {
    const timer = setInterval(() => {
      const p = new Date(Date.now() + 8 * 3600 * 1000);
      let h = p.getUTCHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
      setPhtTime(`${String(h).padStart(2, '0')}:${String(p.getUTCMinutes()).padStart(2, '0')}:${String(p.getUTCSeconds()).padStart(2, '0')} ${ap}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAccount = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: w } = await supabase.from('xcoin_wallets').select('*').eq('user_id', user.id).single();
    if (w) setWallet(w);
    const { data: p } = await supabase.from('profiles').select('xwallet_balance').eq('id', user.id).single();
    if (p) setXwalletBalance(Number(p.xwallet_balance) || 0);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: m } = await supabase.from('xcoin_market_state').select('*').eq('id', 1).single();
      if (m) setMarket(m);
      loadAccount();
    })();
    const marketSub = supabase.channel('xcoin_market')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'xcoin_market_state' }, (payload) => setMarket(payload.new)).subscribe();
    const historySub = supabase.channel('xcoin_history')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'xcoin_price_history' }, (payload) => {
        // The database ticks every second; we publish ONE tick per minute (the last price of each finished minute).
        const t = { time: Math.floor(new Date(payload.new.recorded_at).getTime() / 1000), value: Number(payload.new.price) };
        const b = Math.floor(t.time / 60);
        const pend = pendRef.current;
        if (pend && pend.bucket < b) {
          ticksRef.current = [...ticksRef.current.slice(-4999), { time: pend.bucket * 60, value: pend.value }];
          setTicks(ticksRef.current);
          const c = chartRef.current;
          if (c && c.series) {
            const step = TFS.find((x) => x[0] === tfRef.current)[1];
            const { candles } = aggregate(ticksRef.current, step);
            const last = candles[candles.length - 1];
            if (last) {
              if (c.style === 'candles') c.series.update(last); else c.series.update({ time: last.time, value: last.close });
            }
          }
        }
        pendRef.current = { bucket: b, value: t.value };
        const cc = chartRef.current;
        if (cc && cc.series) {
          const lastClosed = ticksRef.current[ticksRef.current.length - 1];
          const live = [...ticksRef.current, { time: b * 60, value: t.value }];
          const stepL = TFS.find((x) => x[0] === tfRef.current)[1];
          const { candles: cl } = aggregate(live, stepL);
          const lc = cl[cl.length - 1];
          if (lc) { if (cc.style === 'candles') cc.series.update(lc); else cc.series.update({ time: lc.time, value: lc.close }); }
        }
      }).subscribe();
    return () => { supabase.removeChannel(marketSub); supabase.removeChannel(historySub); };
  }, [loadAccount]);

  useEffect(() => {
    (async () => {
      let rows = null;
      // Preferred: one row per minute from the xcoin_price_minute view (see SQL). Falls back to raw ticks.
      const v = await supabase.from('xcoin_price_minute').select('price, recorded_at').order('recorded_at', { ascending: false }).limit(1000);
      if (!v.error && v.data && v.data.length) rows = v.data;
      if (!rows) {
        const r = await supabase.from('xcoin_price_history').select('price, recorded_at').order('recorded_at', { ascending: false }).limit(1000);
        if (r.data) rows = r.data;
      }
      if (rows) {
        let list = perMinute(rows.reverse().map((d) => ({ time: Math.floor(new Date(d.recorded_at).getTime() / 1000), value: Number(d.price) })));
        const nowB = Math.floor(Date.now() / 60000);
        const last = list[list.length - 1];
        if (last && last.time / 60 >= nowB) { pendRef.current = { bucket: last.time / 60, value: last.value }; list = list.slice(0, -1); }
        ticksRef.current = list;
        setTicks(list);
      }
    })();
  }, []);

  // (Re)build the chart whenever timeframe / style / history changes.
  useEffect(() => {
    if (!boxRef.current) return;
    const el = boxRef.current;
    const chart = createChart(el, {
      layout: { background: { type: 'solid', color: '#ffffff' }, textColor: '#475569', fontSize: 11 },
      grid: { vertLines: { color: '#eef2f7' }, horzLines: { color: '#eef2f7' } },
      width: el.clientWidth, height: 380,
      crosshair: { mode: CrosshairMode.Normal },
      localization: { timeFormatter: (t) => phtFmt(t, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#e2e8f0', rightOffset: 3, tickMarkFormatter: phtTick },
      rightPriceScale: { borderColor: '#e2e8f0', scaleMargins: { top: 0.1, bottom: 0.1 } },
    });
    const step = TFS.find((x) => x[0] === tf)[1];
    const { candles } = aggregate(ticks, step);
    let series;
    if (style === 'candles') {
      series = chart.addSeries(CandlestickSeries, { upColor: '#16a34a', downColor: '#dc2626', borderUpColor: '#16a34a', borderDownColor: '#dc2626', wickUpColor: '#16a34a', wickDownColor: '#dc2626' });
      series.setData(candles);
    } else {
      series = chart.addSeries(AreaSeries, { lineColor: '#2563eb', topColor: 'rgba(37,99,235,.25)', bottomColor: 'rgba(59,130,246,0)', lineWidth: 2 });
      series.setData(candles.map((c) => ({ time: c.time, value: c.close })));
    }
    const n = candles.length;
    if (n > 80) chart.timeScale().setVisibleLogicalRange({ from: n - 80, to: n + 3 }); else chart.timeScale().fitContent();
    chart.subscribeCrosshairMove((p) => {
      const d = p.seriesData && p.seriesData.get(series);
      if (!d) { setHover(null); return; }
      setHover(d.open !== undefined ? d : { open: d.value, high: d.value, low: d.value, close: d.value });
    });
    chartRef.current = { chart, series, style };
    const onResize = () => chart.applyOptions({ width: el.clientWidth });
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); chart.remove(); chartRef.current = null; };
  }, [tf, style, ticks.length === 0]);

  const price = Number(market.current_price) || 0;
  const prev = Number(market.prev_price) || price;
  const change = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;
  const isUp = change >= 0;

  const win = useMemo(() => {
    const step = TFS.find((x) => x[0] === tf)[1];
    const { candles } = aggregate(ticks, step);
    return candles;
  }, [ticks, tf]);
  const shown = hover || (win.length ? win[win.length - 1] : null);

  const day = useMemo(() => {
    const since = Date.now() / 1000 - 86400;
    const d = ticks.filter((t) => t.time >= since);
    if (!d.length) return null;
    return { open: d[0].value, ticks: d.length };
  }, [ticks]);
  const change24 = day && day.open ? ((price - day.open) / day.open) * 100 : null;

  const balCoin = Number(wallet.real_balance) || 0;
  const avg = Number(wallet.avg_buy_price) || 0;
  const posValue = balCoin * price;
  const cost = balCoin * avg;
  const pnl = posValue - cost;
  const pnlPct = cost ? (pnl / cost) * 100 : 0;

  const amt = parseFloat(tradeAmount);
  const validAmt = !isNaN(amt) && amt > 0;
  const execBuy = price * BUY_SPREAD;
  const execSell = price * SELL_SPREAD;
  const youGet = !validAmt ? 0 : tradeType === 'buy' ? amt / execBuy : amt * execSell;
  const spreadCost = !validAmt ? 0 : tradeType === 'buy' ? amt - amt / execBuy * price : amt * price - amt * execSell;
  const maxAmt = tradeType === 'buy' ? xwalletBalance : balCoin;
  const setPct = (p) => setTradeAmount(String(Math.floor(maxAmt * p * 10000) / 10000));

  const lo = Number(market.low_24h) || 0;
  const hi = Number(market.high_24h) || 0;
  const rangePos = hi > lo ? Math.min(100, Math.max(0, ((price - lo) / (hi - lo)) * 100)) : 50;

  const executeTrade = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    if (!validAmt) { setMessage('Please enter a valid amount.'); setLoading(false); return; }
    if (amt > maxAmt + 1e-9) { setMessage(tradeType === 'buy' ? 'Not enough Xwallet balance.' : 'Not enough XCOIN balance.'); setLoading(false); return; }
    const ref = 'XCOIN-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    if (tradeType === 'buy') {
      const { data, error } = await supabase.rpc('xcoin_buy', { p_php_amount: amt, p_ref: ref });
      if (error) setMessage(error.message);
      else setMessage(`Successfully bought ${data.xcoin_bought.toFixed(4)} XCOIN at ₱${data.execution_price.toFixed(2)}`);
    } else {
      const { data, error } = await supabase.rpc('xcoin_sell', { p_xcoin_amount: amt, p_ref: ref });
      if (error) setMessage(error.message);
      else setMessage(`Successfully sold ${amt} XCOIN for ₱${data.php_received.toFixed(2)} at ₱${data.execution_price.toFixed(2)}`);
    }
    await loadAccount();
    setTradeAmount(''); setLoading(false);
  };

  const regime = String(market.current_regime || '');
  const rcol = regime.includes('Bull') ? UP : regime.includes('Bear') ? DOWN : '#f59e0b';
  const recent = ticks.slice(-40).reverse();

  return (
    <div className="xc">
      <style>{CSS}</style>
      <div className="xc-top">
        <div className="xc-top-in">
          <div>
            <button className="xc-back" onClick={() => navigate(-1)}>← Return</button>
            <div className="xc-pair" style={{ marginTop: 4 }}>
              <div className="xc-logo">X</div>
              <div><b>XCOIN / PHP<span className="xc-chip">2.0</span></b><small>XMARKET spot market</small></div>
            </div>
          </div>
          <div className="xc-clock">PHT {phtTime}</div>
          <div className="xc-wal"><small>Xwallet balance</small><b>{peso(xwalletBalance)}</b></div>
        </div>
      </div>

      <div className="xc-wrap">
          <div className="xc-card xc-a">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div className="xc-price" style={{ color: isUp ? UP : DOWN }}>{peso(price, 4)}</div>
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: isUp ? UP : DOWN }}>
                  {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(4)} ({Math.abs(changePct).toFixed(2)}%)
                  <span style={{ color: '#64748b', fontWeight: 600 }}> last tick</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: .6 }}>Market regime</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: rcol }}>{regime}</div>
              </div>
            </div>

            <div className="xc-ticker" style={{ marginTop: 14 }}>
              <div className="xc-stat"><small>24h change</small><b style={{ color: change24 == null ? '#64748b' : change24 >= 0 ? UP : DOWN }}>{change24 == null ? '—' : `${change24 >= 0 ? '+' : ''}${change24.toFixed(2)}%`}</b></div>
              <div className="xc-stat"><small>24h high</small><b>{peso(hi)}</b></div>
              <div className="xc-stat"><small>24h low</small><b>{peso(lo)}</b></div>
              <div className="xc-stat"><small>24h volume</small><b>{peso(market.volume_24h, 0)}</b></div>
              <div className="xc-stat"><small>All-time high</small><b>{peso(market.ath)}</b></div>
              <div className="xc-stat"><small>All-time low</small><b>{peso(market.atl)}</b></div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#64748b' }}><span>24h range</span><span>{rangePos.toFixed(0)}% of range</span></div>
              <div className="xc-gauge"><i style={{ width: rangePos + '%' }} /></div>
            </div>

            <div className="xc-bar">
              {TFS.map(([k]) => <button key={k} className={'xc-tf' + (tf === k ? ' on' : '')} onClick={() => setTf(k)}>{k}</button>)}
              <span className="xc-sp" />
              <button className={'xc-tf' + (style === 'candles' ? ' on' : '')} onClick={() => setStyle('candles')}>Candles</button>
              <button className={'xc-tf' + (style === 'line' ? ' on' : '')} onClick={() => setStyle('line')}>Line</button>
            </div>
            <div ref={boxRef} className="xc-chart" />
            {shown && (
              <div className="xc-ohlc">
                <span>O <b style={{ color: '#0f172a' }}>{Number(shown.open).toFixed(2)}</b></span>
                <span>H <b style={{ color: UP }}>{Number(shown.high).toFixed(2)}</b></span>
                <span>L <b style={{ color: DOWN }}>{Number(shown.low).toFixed(2)}</b></span>
                <span>C <b style={{ color: '#0f172a' }}>{Number(shown.close).toFixed(2)}</b></span>
              </div>
            )}
          </div>

          <div className="xc-card xc-b">
            <div className="xc-h">Your position</div>
            <div className="xc-pf">
              <div><small>Holdings</small><b>{balCoin.toFixed(4)} <span style={{ fontSize: 11, color: '#64748b' }}>XCOIN</span></b></div>
              <div><small>Market value</small><b>{peso(posValue)}</b></div>
              <div><small>Avg. buy price</small><b>{peso(avg, 4)}</b></div>
              <div><small>Cost basis</small><b>{peso(cost)}</b></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <small>Unrealized P/L</small>
                <b style={{ color: pnl >= 0 ? UP : DOWN, fontSize: 20 }}>{pnl >= 0 ? '+' : '-'}{peso(Math.abs(pnl))} <span style={{ fontSize: 13 }}>({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)</span></b>
              </div>
            </div>
          </div>

          <div className="xc-card xc-c">
            <div className="xc-seg">
              <button onClick={() => { setTradeType('buy'); setTradeAmount(''); }} style={{ background: tradeType === 'buy' ? UP : 'transparent', color: tradeType === 'buy' ? '#ffffff' : '#64748b' }}>Buy</button>
              <button onClick={() => { setTradeType('sell'); setTradeAmount(''); }} style={{ background: tradeType === 'sell' ? DOWN : 'transparent', color: tradeType === 'sell' ? '#fff' : '#64748b' }}>Sell</button>
            </div>
            <form onSubmit={executeTrade}>
              <div className="xc-lbl">
                <span>{tradeType === 'buy' ? 'Amount (PHP)' : 'Amount (XCOIN)'}</span>
                <span>Avail: {tradeType === 'buy' ? peso(xwalletBalance) : balCoin.toFixed(4)}</span>
              </div>
              <div className="xc-inp">
                <span>{tradeType === 'buy' ? '₱' : 'X'}</span>
                <input type="number" step="any" inputMode="decimal" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="xc-pcts">
                {[0.25, 0.5, 0.75, 1].map((p) => <button type="button" key={p} onClick={() => setPct(p)}>{p === 1 ? 'MAX' : p * 100 + '%'}</button>)}
              </div>
              <div className="xc-row"><span>Market price</span><b>{peso(price, 4)}</b></div>
              <div className="xc-row"><span>Execution price (±0.5% spread)</span><b>{peso(tradeType === 'buy' ? execBuy : execSell, 4)}</b></div>
              <div className="xc-row"><span>Spread cost</span><b>{peso(spreadCost, 2)}</b></div>
              <div className="xc-row" style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                <span>{tradeType === 'buy' ? 'You receive' : 'You receive (PHP)'}</span>
                <b style={{ fontSize: 15 }}>{tradeType === 'buy' ? `${youGet.toFixed(4)} XCOIN` : peso(youGet)}</b>
              </div>
              <button disabled={loading} type="submit" className="xc-go" style={{ background: tradeType === 'buy' ? UP : DOWN, color: '#fff' }}>
                {loading ? 'Processing...' : tradeType === 'buy' ? 'Buy XCOIN' : 'Sell XCOIN'}
              </button>
            </form>
            {message && <div className="xc-msg" style={{ background: message.includes('Success') ? 'rgba(22,163,74,.10)' : 'rgba(220,38,38,.10)', color: message.includes('Success') ? UP : '#b91c1c' }}>{message}</div>}
            <div className="xc-note">Estimates use the current price; the final fill price is set by the market when your order executes.</div>
          </div>

          <div className="xc-card xc-d">
            <div className="xc-h">Recent price ticks <small style={{ color: '#64748b', fontWeight: 600 }}>1 tick / minute</small></div>
            <div className="xc-tk" style={{ color: '#64748b', fontSize: 11 }}><span>Price (PHP)</span><span>Change</span><span>Time</span></div>
            <div className="xc-ticks">
              {recent.map((t, i) => {
                const before = recent[i + 1];
                const d = before ? t.value - before.value : 0;
                return (
                  <div className="xc-tk" key={t.time + '-' + i}>
                    <span style={{ color: d >= 0 ? UP : DOWN }}>{t.value.toFixed(4)}</span>
                    <span style={{ color: d >= 0 ? UP : DOWN }}>{d >= 0 ? '+' : ''}{d.toFixed(4)}</span>
                    <span>{new Date(t.time * 1000).toLocaleTimeString('en-PH', { hour12: false })}</span>
                  </div>
                );
              })}
            </div>
          </div>

      </div>
    </div>
  );
}
