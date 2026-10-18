import { ListRowsSkeleton } from '../../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { fetchHistory } from '../../lib/playtime';
import { PlayHeader, HistoryRow } from './common';
import { useAuth } from '../../context/AuthContext';

export default function History() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  useEffect(() => { if (user) fetchHistory(100).then(setItems); }, [user]);
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Play Time History" subtitle="Your latest 100 games and exchanges." />
      {items === null ? <ListRowsSkeleton />
        : items.length === 0 ? <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 30 }}>No activity yet.</p>
        : items.map(t => <HistoryRow key={t.id} t={t} />)}
    </div>
  );
}
