import React from 'react';
import { Search } from 'lucide-react';

const CSS = '.hs-s{display:flex;align-items:center;gap:10px;padding:0 14px;margin-bottom:16px;border-radius:14px;background:var(--bg);box-shadow:var(--inset);color:var(--muted)}.hs-s input{flex:1;border:0;outline:0;background:transparent;padding:13px 0;font-size:14px;color:var(--text);min-width:0}';

export default function HubSearch({ value, onChange, placeholder }) {
  return (
    <label className="hs-s">
      <style>{CSS}</style>
      <Search size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  );
}
