import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EmptyState from '../components/EmptyState';

export default function Categories() {
  const nav = useNavigate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('category').then(({ data }) => {
      const set = new Set();
      (data || []).forEach((p) => { if (p.category) set.add(p.category); });
      setCats(Array.from(set).sort());
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={() => nav(-1)} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>Categories</h2>
      </div>
      {loading ? (
        <div className="xmall-list">{[0,1,2].map(i => <div key={i} className="xmall-skel-row" />)}</div>
      ) : cats.length === 0 ? (
        <EmptyState icon={Tag} title="No categories yet" message="Products will appear here once sellers add them." />
      ) : (
        <div className="xmall-list">
          {cats.map((c) => (
            <button key={c} className="xmall-row" onClick={() => nav(`/?category=${encodeURIComponent(c)}`)} style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
              <div className="xmall-row-body" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex' }}>
                <div className="xmall-row-name">{c}</div>
                <ChevronRight size={16} color="var(--muted)" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
