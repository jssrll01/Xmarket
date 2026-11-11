import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

const tag = { fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 99, marginLeft: 6, color: '#fff' };

export default function ProductQA({ productId }) {
  const { show } = useToast();
  const [d, setD] = useState(null);
  const [text, setText] = useState('');
  const [ans, setAns] = useState({});
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('qa_list', { p_product: productId });
    setD(data || { items: [], can_answer: false });
  }, [productId]);
  useEffect(() => { load(); }, [load]);

  const ask = async () => {
    if (busy || !text.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('qa_ask', { p_product: productId, p_body: text });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setText(''); load();
  };
  const reply = async (q) => {
    const b = (ans[q] || '').trim();
    if (!b) return;
    const { data, error } = await supabase.rpc('qa_answer', { p_question: q, p_body: b });
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setAns((a) => ({ ...a, [q]: '' })); load();
  };

  return (
    <div className="card" style={{ padding: 14, margin: '14px 0' }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Questions &amp; Answers</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={text} maxLength={300} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(); }} placeholder="Ask about this product…" style={{ flex: 1, padding: 11, fontSize: 14 }} />
        <button className="btn-primary" disabled={busy || !text.trim()} onClick={ask} style={{ padding: '0 16px', fontWeight: 800 }}>Ask</button>
      </div>
      {d && d.items.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 12 }}>No questions yet. Be the first to ask.</div>}
      {d && d.items.map((q) => (
        <div key={q.id} style={{ borderTop: '1px solid var(--border)', padding: '10px 0' }}>
          <div style={{ fontSize: 14 }}><b>Q:</b> {q.body} <span style={{ fontSize: 11, color: 'var(--muted)' }}>@{q.username}</span></div>
          {q.answers.map((a) => (
            <div key={a.id} style={{ fontSize: 13.5, marginTop: 6, marginLeft: 12, paddingLeft: 10, borderLeft: '3px solid #2563EB' }}>
              {a.body}
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>@{a.username}
                {a.role === 'seller' && <span style={{ ...tag, background: '#2563EB' }}>Seller</span>}
                {a.role === 'admin' && <span style={{ ...tag, background: '#DC2626' }}>XMARKET</span>}
                {a.role === 'buyer' && <span style={{ ...tag, background: '#059669' }}>Verified buyer</span>}
              </div>
            </div>
          ))}
          {d.can_answer && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, marginLeft: 12 }}>
              <input value={ans[q.id] || ''} maxLength={300} onChange={(e) => setAns((a) => ({ ...a, [q.id]: e.target.value }))} placeholder="Answer as a buyer…" style={{ flex: 1, padding: 8, fontSize: 13 }} />
              <button className="btn-ghost" onClick={() => reply(q.id)} style={{ padding: '0 12px', fontSize: 12, fontWeight: 800 }}>Reply</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
