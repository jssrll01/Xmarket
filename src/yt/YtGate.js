import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CardListSkeleton } from '../components/Skeleton';

export default function YtGate({ children }) {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) nav('/signin', { replace: true });
  }, [user, loading, nav]);
  if (loading || !user) return <div style={{ padding: 16 }}><CardListSkeleton count={2} /></div>;
  return children;
}
