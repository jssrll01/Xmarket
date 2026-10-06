import { useEffect, useState, useCallback } from 'react';

export default function useInstallPrompt() {
  const [deferred, setDeferred] = useState(() => window.__deferredPrompt || null);
  const [installed, setInstalled] = useState(
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
     window.navigator.standalone === true)
  );

  useEffect(() => {
    const onReady = () => setDeferred(window.__deferredPrompt || null);
    const onInstalled = () => {
      setDeferred(null);
      setInstalled(true);
    };

    window.addEventListener('bip-prompt-ready', onReady);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('bip-prompt-ready', onReady);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const canInstall = !!deferred && !installed;

  const promptInstall = useCallback(async () => {
    const evt = deferred || window.__deferredPrompt;
    if (!evt) return 'unavailable';
    try {
      evt.prompt();
      const choice = await evt.userChoice;
      window.__deferredPrompt = null;
      setDeferred(null);
      return choice?.outcome || 'dismissed';
    } catch {
      return 'error';
    }
  }, [deferred]);

  return { canInstall, installed, promptInstall };
}
