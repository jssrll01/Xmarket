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
            background: t.type === 'success'
              ? 'linear-gradient(145deg, #6373d8, #4a59b8)'
              : 'linear-gradient(145deg, #d8638a, #b84a6b)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 14,
            fontSize: 13, fontWeight: 700,
            boxShadow: '6px 6px 16px rgba(0,0,0,0.4), -4px -4px 12px rgba(255,255,255,0.1)',
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
