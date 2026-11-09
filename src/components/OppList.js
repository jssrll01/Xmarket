import React, { useEffect, useState } from 'react';
import { CardListSkeleton } from './Skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

const day = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
const safe = (u) => (/^https?:\/\//i.test(u || '') ? u : '');

export default function OppList({ title, rpc, kind, empty }) {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    supabase.rpc(rpc).then(({ data }) => setRows(Array.isArray(data) ? data : []));
  }, [rpc]);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h2>
      </div>
      {rows === null && <CardListSkeleton count={3} />}
      {rows && rows.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>{empty}</div>}
      {rows && rows.map((r) => {
        const isOpen = open === r.id;
        const link = safe(r.apply_url);
        return (
          <div key={r.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
            <div onClick={() => setOpen(isOpen ? null : r.id)} style={{ cursor: 'pointer' }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>
                {kind === 'scholarship' ? r.provider : r.pay}
              </div>
              {r.deadline && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#B45309', marginTop: 6, fontWeight: 700 }}><Calendar size={13} /> Deadline {day(r.deadline)}</div>}
            </div>
            {isOpen && (
              <div style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {r.description && <div style={{ marginBottom: 8 }}>{r.description}</div>}
                {kind === 'scholarship' && r.requirements && <><b>Requirements</b><div style={{ marginBottom: 8 }}>{r.requirements}</div></>}
                {kind === 'freelance' && r.skills && <><b>Skills</b><div style={{ marginBottom: 8 }}>{r.skills}</div></>}
                {link && <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontWeight: 800, textDecoration: 'none' }}>Apply <ExternalLink size={14} /></a>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
