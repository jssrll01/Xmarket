import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const size = (b) => (!b ? '' : b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

async function startDownload(path, name) {
  const { data, error } = await supabase.storage.from('digital-files').createSignedUrl(path, 60, { download: name || true });
  if (error || !data || !data.signedUrl) throw new Error('Could not prepare your download. Use the Download button to try again.');
  const a = document.createElement('a');
  a.href = data.signedUrl; a.rel = 'noopener'; a.download = name || '';
  document.body.appendChild(a); a.click(); a.remove();
}

export default function DigitalFiles({ onPaid }) {
  const { user } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState({});
  const [busy, setBusy] = useState('');
  const refs = useRef({});

  const load = useCallback(async () => {
    const r = await supabase.from('digital_items').select('id,title,price,file_name,file_size').eq('active', true).order('created_at', { ascending: false });
    setItems(r.data || []);
    if (user) {
      const m = await supabase.rpc('digital_my_files');
      const o = {}; (m.data || []).forEach((x) => { o[x.item_id] = x; });
      setMine(o);
    }
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const dl = async (path, name) => { try { await startDownload(path, name); } catch (e) { show(e.message); } };

  const buy = async (it) => {
    if (!user || busy) return;
    if (!window.confirm('Buy "' + it.title + '" for ' + peso(it.price) + '?\n\nThis is paid from your Xwallet. Digital purchases are final and cannot be refunded.')) return;
    if (!refs.current[it.id]) refs.current[it.id] = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    setBusy(it.id);
    const { data, error } = await supabase.rpc('digital_buy', { p_item: it.id, p_ref: refs.current[it.id] });
    if (error || !data || !data.ok) { setBusy(''); show((error && error.message) || (data && data.error) || 'Purchase failed.'); return; }
    refs.current[it.id] = null;
    show('Paid. Your download is starting.');
    if (onPaid) onPaid();
    await load();
    setBusy('');
    if (data.path) dl(data.path, data.name);
  };

  if (items === null) return <div className="xf-card xf-empty">Loading downloads…</div>;
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '4px 0 10px' }}>Instant downloads</h3>
      {items.map((it) => {
        const own = mine[it.id];
        return (
          <div className="xf-card" key={it.id} style={{ marginBottom: 10 }}>
            <div className="xf-body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={20} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: 0 }}>{it.title}</h3>
                <div className="xf-meta">{size(it.file_size)}{own ? ' · Purchased' : ' · Final sale, no refunds'}</div>
                {!own && <div className="xf-price">{peso(it.price)}</div>}
              </div>
              {own
                ? <button className="btn-primary" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => dl(own.path, own.name)}><Download size={15} /> Download</button>
                : <button className="btn-primary" style={{ padding: '10px 16px' }} disabled={!!busy} onClick={() => (user ? buy(it) : window.location.assign('/signin'))}>{busy === it.id ? 'Paying…' : 'Buy'}</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
