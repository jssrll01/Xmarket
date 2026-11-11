import React, { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BLUE, MUTED, peso, card, Pill, Sk, SkStyle } from './creatorUi';
import CreatorShell, { Chips, Chip } from './creatorPage';

const FILTERS = [['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']];

export default function CreatorHistory() {
  const [subs, setSubs] = useState(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let alive = true;
    supabase.rpc('creator_my_submissions').then(({ data, error }) => {
      if (!alive) return;
      if (error) setErr(error.message);
      setSubs(data || []);
    });
    return () => { alive = false; };
  }, []);

  const all = subs || [];
  const count = (k) => (k === 'all' ? all.length : all.filter((s) => s.status === k).length);
  const list = filter === 'all' ? all : all.filter((s) => s.status === filter);

  return (
    <CreatorShell title="Content history">
      <Chips>
        {FILTERS.map(([k, label]) => (
          <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>{label} {subs ? count(k) : ''}</Chip>
        ))}
      </Chips>

      {subs === null && (<><SkStyle />{[0, 1, 2].map((i) => <Sk key={i} h={130} r={18} style={{ marginBottom: 12 }} />)}</>)}
      {err && <div style={{ ...card, color: '#DC2626', fontSize: 13 }}>{err}</div>}

      {list.map((s) => (
        <div key={s.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <b style={{ fontSize: 15 }}>{s.title}</b><Pill s={s.status} />
          </div>
          <div style={{ fontSize: 12, color: MUTED, margin: '4px 0' }}>{s.description}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Submitted {new Date(s.submitted_at).toLocaleString()}</div>
          {s.link && (
            <a href={s.link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: BLUE, wordBreak: 'break-all', marginTop: 8 }}>
              <Link2 size={14} />{s.link}
            </a>
          )}
          {s.content && <p style={{ fontSize: 13, margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{s.content}</p>}
          {s.feedback && (
            <div style={{ fontSize: 12, marginTop: 8, padding: 10, borderRadius: 10, background: 'rgba(148,163,184,.14)' }}>
              <b>Admin feedback:</b> {s.feedback}
            </div>
          )}
          {s.status === 'approved' && <div style={{ fontSize: 14, fontWeight: 800, color: '#059669', marginTop: 8 }}>Earned {peso(s.reward)}</div>}
        </div>
      ))}

      {subs !== null && !err && list.length === 0 && (
        <div style={{ ...card, textAlign: 'center', color: MUTED }}>
          {filter === 'all' ? 'No entries yet. Join a task to get started.' : 'No ' + filter + ' entries.'}
        </div>
      )}
    </CreatorShell>
  );
}
