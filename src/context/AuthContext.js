import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      if (event === 'SIGNED_IN' && s?.user) {
        try {
          const KEY_FP = 'xmarket.device-fingerprint';
          const KEY_LAST = 'xmarket.last-device-alert';
          // Stable fingerprint — userAgent + language only.
          // Do NOT include screen dimensions — they change on mobile (URL bar, orientation).
          const fp = `${navigator.userAgent}|${navigator.language}`;
          const last = localStorage.getItem(KEY_FP);
          const lastAlertAt = Number(localStorage.getItem(KEY_LAST) || 0);
          const now = Date.now();
          const ONE_DAY = 24 * 60 * 60 * 1000;

          if (last && last !== fp && (now - lastAlertAt) > ONE_DAY) {
            setTimeout(() => window.dispatchEvent(new CustomEvent('xmarket:new-device')), 100);
            try {
              await supabase.from('notifications').insert({
                user_id: s.user.id,
                type: 'security',
                title: 'New device sign-in',
                body: 'A new device signed into your account. If this wasn\'t you, change your password.',
                read: false,
              });
            } catch (e) {}
            localStorage.setItem(KEY_LAST, String(now));
          }
          localStorage.setItem(KEY_FP, fp);
        } catch {}
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) { setProfile(null); return; }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, user: session?.user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
