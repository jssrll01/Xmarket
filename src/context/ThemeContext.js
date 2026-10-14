import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const KEY = 'xmarket_theme';   // 'light' | 'dark' | 'system'
const ThemeCtx = createContext(null);

function resolve(theme) {
  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return theme;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
  });
  const [resolved, setResolved] = useState(() => resolve(theme));

  const apply = useCallback((t) => {
    const r = resolve(t);
    setResolved(r);
    const root = document.documentElement;
    root.setAttribute('data-theme', r);
    // sync status-bar color for PWA
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', r === 'dark' ? '#0F1420' : '#FFFFFF');
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    try { localStorage.setItem(KEY, t); } catch {}
    apply(t);
  }, [apply]);

  useEffect(() => { apply(theme); }, [theme, apply]);

  // react to system changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = () => apply('system');
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn);
    };
  }, [theme, apply]);

  return (
    <ThemeCtx.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx) || { theme: 'system', resolved: 'light', setTheme: () => {} };
