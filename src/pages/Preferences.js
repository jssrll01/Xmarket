import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PrefAppearance from '../components/prefs/PrefAppearance';
import PrefComfort from '../components/prefs/PrefComfort';
import PrefWallet from '../components/prefs/PrefWallet';
import PrefSecurity from '../components/prefs/PrefSecurity';
import PrefData from '../components/prefs/PrefData';

export default function Preferences() {
  const nav = useNavigate();
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/'))}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Preferences</h2>
      </div>
      <PrefAppearance />
      <PrefComfort />
      <PrefWallet />
      <PrefSecurity />
      <PrefData />
    </div>
  );
}
