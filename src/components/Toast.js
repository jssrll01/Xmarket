import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 24, left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8,
        zIndex: 300, pointerEvents: 'none', padding: '0 16px'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--neu-surface, #F8FAFC)',
            color: 'var(--text, #0F172A)',
            border: '1px solid var(--border, #E2E8F0)',
            padding: '12px 20px',
            borderRadius: 14,
            fontSize: 13, fontWeight: 700,
            boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
            animation: 'toastIn 0.25s ease',
            pointerEvents: 'auto',
            maxWidth: 360
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
