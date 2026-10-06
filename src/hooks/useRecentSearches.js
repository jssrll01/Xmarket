import { useCallback, useEffect, useState } from 'react';

const KEY = 'xmarket.recent-searches';
const MAX = 8;

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export default function useRecentSearches() {
  const [recent, setRecent] = useState(read);

  useEffect(() => {
    const onStorage = () => setRecent(read());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((term) => {
    const t = (term || '').trim();
    if (!t) return;
    const next = [t, ...read().filter(x => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    setRecent(next);
  }, []);

  const remove = useCallback((term) => {
    const next = read().filter(x => x !== term);
    localStorage.setItem(KEY, JSON.stringify(next));
    setRecent(next);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setRecent([]);
  }, []);

  return { recent, add, remove, clear };
}
