import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BLUE, MUTED, peso, card, btn, Pill, IconBox, Sk, SkStyle } from './creatorUi';
import CreatorShell, { Chips, Chip } from './creatorPage';

const FILTERS = [['all', 'All'], ['open', 'Open'], ['joined', 'Joined']];

export default function CreatorTasks() {
  const nav = useNavigate();
  const [tasks, setTasks] = useState(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let alive = true;
    supabase.rpc('creator_tasks_list').then(({ data, error }) => {
      if (!alive) return;
      if (error) setErr(error.message);
      setTasks(data || []);
    });
    return () => { alive = false; };
  }, []);

  const closedOf = (t) => t.deadline && new Date(t.deadline) < new Date();
  const list = (tasks || []).filter((t) => {
    if (filter === 'joined') return !!t.my_status;
    if (filter === 'open') return !t.my_status && !closedOf(t);
    return true;
  });

  return (
    <CreatorShell title="Browse tasks">
      <Chips>
        {FILTERS.map(([k, label]) => <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>{label}</Chip>)}
      </Chips>

      {tasks === null && (<><SkStyle />{[0, 1, 2].map((i) => <Sk key={i} h={120} r={18} style={{ marginBottom: 12 }} />)}</>)}
      {err && <div style={{ ...card, color: '#DC2626', fontSize: 13 }}>{err}</div>}

      {list.map((t) => {
        const isRef = t.kind === 'referral';
        const closed = closedOf(t);
        return (
          <div key={t.id} style={card}>
            <div style={{ display: 'flex', gap: 12 }}>
              <IconBox icon={isRef ? Users : ClipboardList} color={isRef ? '#059669' : BLUE} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <b style={{ fontSize: 15 }}>{t.title}</b>
                  <b style={{ fontSize: 13, color: BLUE, whiteSpace: 'nowrap' }}>{isRef ? 'Commission' : peso(t.reward)}</b>
                </div>
                <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 8px' }}>{t.description}</p>
                {t.deadline && (
                  <div style={{ fontSize: 11, color: closed ? '#DC2626' : MUTED, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <Calendar size={12} /> {closed ? 'Closed' : 'Until'} {new Date(t.deadline).toLocaleDateString()}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isRef
                    ? <button type="button" style={btn} onClick={() => nav('/creator-studio/referrals')}>Referral</button>
                    : <button type="button" style={{ ...btn, opacity: closed ? 0.5 : 1 }} disabled={closed} onClick={() => nav('/creator-studio/tasks/' + t.id)}>{t.my_status ? 'View task' : 'Participate'}</button>}
                  {t.my_status && <Pill s={t.my_status} />}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {tasks !== null && !err && list.length === 0 && (
        <div style={{ ...card, textAlign: 'center', color: MUTED }}>
          {filter === 'all' ? 'No tasks available right now. Check back soon.' : 'Nothing here yet.'}
        </div>
      )}
    </CreatorShell>
  );
}
