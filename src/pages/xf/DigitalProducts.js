import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { rpcPin, showReceipt } from '../../lib/pinBus';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { CardListSkeleton } from '../../components/Skeleton';
import TopupButton from '../../components/TopupButton';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const size = (b) => (!b ? '' : b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

async function startDownload(path, name) {
  const { data, error } = await supabase.storage.from('digital-files').createSignedUrl(path, 60, { download: name || true });
  if (error || !data || !data.signedUrl) throw new Error('Could not prepare your download. Tap Download to try again.');
  const a = document.createElement('a');
  a.href = data.signedUrl; a.rel = 'noopener'; a.download = name || '';
  document.body.appendChild(a); a.click(); a.remove();
}

export default function DigitalProducts() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState({});
  const [bal, setBal] = useState(null);
  const [busy, setBusy] = useState('');
  const refs = useRef({});

  const load = useCallback(async () => {
    const r = await supabase.from('digital_products').select('id,title,price,file_name,file_size').eq('active', true).order('created_at', { ascending: false });
    setItems(r.data || []);
    if (user) {
      const m = await supabase.rpc('digital_my_files');
      const o = {}; (m.data || []).forEach((x) => { o[x.item_id] = x; });
      setMine(o);
      const p = await supabase.from('profiles').select('xwallet_balance').eq('id', user.id).maybeSingle();
      setBal(p.data ? p.data.xwallet_balance : null);
    }
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const dl = async (path, name) => { try { await startDownload(path, name); } catch (e) { show(e.message); } };

  const buy = async (it) => {
    if (!user) return nav('/signin');
    if (busy) return;
    if (!window.confirm('Buy "' + it.title + '" for ' + peso(it.price) + '?\n\nPaid from your Xwallet. Digital purchases are final and cannot be refunded.')) return;
    if (!refs.current[it.id]) refs.current[it.id] = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    setBusy(it.id);
    const { data, error } = await rpcPin('digital_buy', { p_item: it.id, p_ref: refs.current[it.id] });
    setBusy('');
    if (error) return show(error.message);
    if (!data || !data.ok) { if (!data || data.error !== 'Cancelled') show((data && data.error) || 'Purchase failed.'); return; }
    refs.current[it.id] = null;
    await load();
    if (data.receipt) showReceipt(data.receipt); else show('Paid. Your download is starting.');
    if (data.path) dl(data.path, data.name);
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Digital Products</h2>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Pay with Xwallet. Download right after payment.</div>
        </div>
      </div>
      {user && bal !== null && (
        <div className="card neu-bal" style={{ padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>Xwallet balance</span><span style={{ display: 'inline-flex', alignItems: 'center' }}><b style={{ color: '#1D4ED8', fontSize: 18 }}>{peso(bal)}</b><TopupButton /></span>
        </div>
      )}
      {items === null && <CardListSkeleton count={4} />}
      {items && items.length === 0 && <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>No digital products yet.</div>}
      {items && items.map((it) => {
        const own = mine[it.id];
        return (
          <div className="card neu-row" key={it.id} style={{ padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="neu-ic" style={{ width: 44, height: 44, minWidth: 44, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={20} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div title={it.title} style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordBreak: 'break-word' }}>{it.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{size(it.file_size)}{own ? ' · Purchased' : ' · Final sale'}</div>
              {!own && <div style={{ fontWeight: 900, color: '#2563EB', marginTop: 2 }}>{it.price > 0 ? peso(it.price) : 'Free'}</div>}
            </div>
            {own
              ? <button className="btn-primary" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => dl(own.path, own.name)}><Download size={15} /> Download</button>
              : <button className="btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }} disabled={!!busy} onClick={() => buy(it)}>{busy === it.id ? 'Paying…' : 'Buy'}</button>}
          </div>
        );
      })}
    </div>
  );
}
