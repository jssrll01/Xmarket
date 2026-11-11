import { useCallback, useEffect, useRef, useState } from 'react';

export default function useVoiceSearch(onText, lang = 'en-PH') {
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const rec = useRef(null);

  const stop = useCallback(() => { try { rec.current && rec.current.stop(); } catch (e) {} }, []);
  const start = useCallback(() => {
    if (!SR) return;
    setError('');
    const r = new SR();
    r.lang = lang; r.interimResults = true; r.maxAlternatives = 1;
    r.onresult = (e) => {
      const text = Array.from(e.results).map((x) => x[0].transcript).join(' ').trim();
      if (text) onText(text, e.results[e.results.length - 1].isFinal);
    };
    r.onerror = (e) => setError(e.error === 'not-allowed' ? 'Allow microphone access to use voice search.' : e.error === 'no-speech' ? 'No speech heard. Try again.' : 'Voice search failed.');
    r.onend = () => setListening(false);
    rec.current = r; setListening(true);
    try { r.start(); } catch (e) { setListening(false); }
  }, [SR, lang, onText]);

  useEffect(() => () => stop(), [stop]);
  return { supported: !!SR, listening, error, start, stop };
}
