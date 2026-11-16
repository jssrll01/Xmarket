import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { imgUrl } from '../lib/img';

const clean = (s) => String(s || '').replace(/[%,()*\\]/g, ' ').trim();

export default function EmbedBuilder() {
  const nav = useNavigate();
  const { show } = useToast();
  const [text, setText] = useState('');
  const [res, setRes] = useState([]);
  const [pick, setPick] = useState(null);
  const [w, setW] = useState(300);

  useEffect(() => {
    const t = clean(text);
    if (t.length < 2) { setRes([]); return undefined; }
    let alive = true;
    const h = setTimeout(async () => {
      const { data } = await supabase.from('products').select('id,name,images').ilike('name', '%' + t + '%').limit(6);
      if (alive) setRes(data || []);
    }, 250);
    return () => { alive = false; clearTimeout(h); };
  }, [text]);

  const raw = text.trim();
  const looksId = /^[0-9a-f-]{8,}$/i.test(raw) || /^\d+$/.test(raw);
  const origin = window.location.origin;
  const code = pick ? '<iframe src="' + origin + '/embed/' + pick.id + '" width="' + w + '" height="430" style="border:0;border-radius:14px;max-width:100%" loading="lazy" title="XMARKET product"></iframe>' : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); show('Embed code copied'); } catch (e) { show('Press and hold the code to copy it'); }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/'))}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Embed a product</h2>
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Pick a product, then copy the code into any website.</div>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--muted)' }} />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search a product or paste its ID" style={{ width: '100%', height: 44, padding: '0 12px 0 36px', fontSize: 15 }} />
      </div>
      {looksId && <button className="btn-primary" style={{ marginTop: 8, padding: '8px 14px' }} onClick={() => setPick({ id: raw, name: 'Product ' + raw })}>Use this ID</button>}
      {res.map((r) => (
        <button key={r.id} onClick={() => { setPick(r); setText(''); setRes([]); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
          <span style={{ width: 40, height: 40, borderRadius: 8, background: '#EEF1F6', overflow: 'hidden', flexShrink: 0 }}>
            {r.images && r.images[0] && <img src={imgUrl(r.images[0], 100)} alt="" width="40" height="40" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </span>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
        </button>
      ))}
      {pick && (
        <div style={{ marginTop: 16 }}>
          <b style={{ fontSize: 14 }}>{pick.name}</b>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Width</span>
            <select value={w} onChange={(e) => setW(Number(e.target.value))} style={{ height: 38, padding: '0 10px' }}>
              <option value={260}>260</option><option value={300}>300</option><option value={360}>360</option>
            </select>
          </div>
          <textarea readOnly value={code} rows={4} onFocus={(e) => e.target.select()} style={{ width: '100%', fontFamily: 'monospace', fontSize: 12, padding: 10 }} />
          <button className="btn-primary" onClick={copy} style={{ marginTop: 8, padding: '10px 16px' }}>Copy code</button>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>Preview</div>
          <iframe title="Preview" src={'/embed/' + pick.id} width={w} height="430" style={{ border: 0, borderRadius: 14, maxWidth: '100%', marginTop: 6 }} />
        </div>
      )}
    </div>
  );
}
