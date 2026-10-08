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
          const key = 'xmarket.last-fingerprint';
          const fp = `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}`;
          const last = localStorage.getItem(key);
          if (last && last !== fp) {
            // Fire the in-app toast
            setTimeout(() => window.dispatchEvent(new CustomEvent('xmarket:new-device')), 100);
            // Also persist as a notification row so it shows in the bell
            try {
              await supabase.from('notifications').insert({
                user_id: s.user.id,
                type: 'security',
                title: 'New device sign-in',
                body: 'A new device signed into your account. If this wasn\'t you, change your password.',
                read: false,
              });
            } catch (e) {}
          }
          localStorage.setItem(key, fp);
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
