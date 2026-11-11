import React from 'react';
import { Mic } from 'lucide-react';
import useVoiceSearch from '../hooks/useVoiceSearch';

// <VoiceButton onText={(text, isFinal) => setQuery(text)} onError={show} />
export default function VoiceButton({ onText, onError }) {
  const { supported, listening, error, start, stop } = useVoiceSearch(onText);
  React.useEffect(() => { if (error && onError) onError(error); }, [error]); // eslint-disable-line
  if (!supported) return null;
  return (
    <button type="button" aria-label={listening ? 'Stop voice search' : 'Voice search'} aria-pressed={listening} onClick={listening ? stop : start}
      style={{ width: 38, height: 38, borderRadius: 99, border: 0, flexShrink: 0, display: 'grid', placeItems: 'center', background: listening ? '#EF4444' : 'transparent', color: listening ? '#fff' : '#2563EB', animation: listening ? 'vsPulse 1.1s ease-in-out infinite' : 'none' }}>
      <style>{'@keyframes vsPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}50%{box-shadow:0 0 0 9px rgba(239,68,68,0)}}'}</style>
      <Mic size={19} />
    </button>
  );
}
