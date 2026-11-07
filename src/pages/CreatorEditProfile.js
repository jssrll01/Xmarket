import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

const FIELDS = [['tiktok', 'TikTok', 'https://www.tiktok.com/@you'], ['youtube', 'YouTube', 'https://www.youtube.com/@you'], ['facebook', 'Facebook', 'https://www.facebook.com/you'], ['instagram', 'Instagram', 'https://www.instagram.com/you']];
const inp = { width: '100%', padding: 12, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 14 };

export default function CreatorEditProfile() {
  const nav = useNavigate();
  const { show } = useToast();
  const [state, setState] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [soc, setSoc] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.rpc('creator_my_application').then(({ data }) => {
      const a = data && data.application;
      setState(a ? a.status : 'none');
      if (a) { setBio(a.bio || ''); setSoc(a.socials || {}); }
      if (data && data.profile) setName(data.profile.username || '');
    });
  }, []);
  const save = async () => {
    if (busy) return;
    const clean = {};
    FIELDS.forEach(([k]) => { const v = (soc[k] || '').trim(); if (v) clean[k] = v; });
    setBusy(true);
    const { data, error } = await supabase.rpc('creator_save_profile', { p_bio: bio, p_socials: clean });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    show('Profile saved');
  };
  const wrap = { padding: 16, paddingBottom: 60, maxWidth: 560, margin: '0 auto' };
  const head = <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}><button className="icon-btn" aria-label="Back" onClick={() => nav('/creator-studio')}><ArrowLeft size={20} /></button><h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Edit creator profile</h2></div>;
  if (!state) return <div style={wrap}>{head}<div className="sk" style={{ height: 220, borderRadius: 18 }} /></div>;
  if (state !== 'approved') return <div style={wrap}>{head}<div className="card" style={{ padding: 20, textAlign: 'center' }}>Only approved creators can edit a profile.</div></div>;
  return (
    <div className="page-enter" style={wrap}>
      {head}
      <div className="card" style={{ padding: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: '#64748B', letterSpacing: '.06em', textTransform: 'uppercase' }}>Bio</label>
        <textarea value={bio} maxLength={300} onChange={e => setBio(e.target.value)} placeholder="Tell people about yourself…" style={{ ...inp, minHeight: 100, marginTop: 6 }} />
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>{bio.length}/300</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', letterSpacing: '.06em', textTransform: 'uppercase', margin: '12px 0 6px' }}>Social links (optional)</div>
        {FIELDS.map(([k, l, ph]) => (
          <div key={k} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{l}</div>
            <input value={soc[k] || ''} maxLength={300} inputMode="url" autoCapitalize="none" onChange={e => setSoc({ ...soc, [k]: e.target.value })} placeholder={ph} style={inp} />
          </div>
        ))}
        <button className="btn-primary" disabled={busy} onClick={save} style={{ width: '100%', padding: 14, fontSize: 14, marginTop: 6 }}>{busy ? 'Saving…' : 'Save profile'}</button>
        <button className="btn-ghost" onClick={() => nav('/socials/creator/' + name)} style={{ width: '100%', padding: 12, marginTop: 8 }}>View my public profile</button>
      </div>
    </div>
  );
}
