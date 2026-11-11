import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Avatar } from './socialsUi';

const left = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 86400) + 'd ' + Math.floor((s % 86400) / 3600) + 'h ' + Math.floor((s % 3600) / 60) + 'm ' + (s % 60) + 's';
};

export default function AvatarSetting() {
  const { user } = useAuth();
  const { show } = useToast();
  const [st, setSt] = useState(null);
  const [off, setOff] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [pct, setPct] = useState(null);
  const pick = useRef(null);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('my_avatar_status');
    if (data) { setSt(data); setOff(Date.parse(data.server_now) - Date.now()); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const name = (user && user.user_metadata && (user.user_metadata.first_name || '')) + ' ' + ((user && user.user_metadata && user.user_metadata.last_name) || '') || (user && user.email) || 'U';
  const remaining = st && st.next_change_at ? Date.parse(st.next_change_at) - (now + off) : 0;
  const can = st && (st.can_change || remaining <= 0);

  const choose = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || !can) return;
    if (!/^image\//.test(f.type)) return show('Choose an image file.');
    if (f.size > 5 * 1024 * 1024) return show('Image must be under 5 MB.');
    if (!window.confirm('Use this photo? You can change it again only after 7 days.')) return;
    try {
      setPct(0);
      const fd = new FormData(); fd.append('file', f); fd.append('upload_preset', 'xmarket_user_profile');
      const j = await new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();
        x.open('POST', 'https://api.cloudinary.com/v1_1/bvw3okdf/image/upload');
        x.upload.onprogress = (ev) => { if (ev.lengthComputable) setPct(Math.round((ev.loaded / ev.total) * 100)); };
        x.onload = () => { try { resolve(JSON.parse(x.responseText)); } catch (er) { reject(new Error('Upload failed. Try again.')); } };
        x.onerror = () => reject(new Error('Network error. Try again.'));
        x.send(fd);
      });
      if (!j.secure_url) throw new Error('Upload failed. Try again.');
      const url = j.secure_url.replace('/upload/', '/upload/c_fill,w_300,h_300,g_auto/');
      const { data, error } = await supabase.rpc('set_my_avatar', { p_url: url });
      if (error) throw new Error(error.message);
      if (!data.ok) throw new Error(data.error);
      show('Profile photo updated'); await load();
    } catch (er) { show(er.message || 'Something went wrong.'); }
    setPct(null);
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Avatar name={name.trim()} url={st && st.avatar_url} size={72} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>Profile photo</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 8px' }}>
          {!st ? 'Loading…' : pct !== null ? 'Uploading ' + pct + '%…' : can ? 'You can change your photo now.' : 'Change again in ' + left(remaining)}
        </div>
        <input ref={pick} type="file" accept="image/*" onChange={choose} style={{ display: 'none' }} />
        <button className="btn-primary" disabled={!can || pct !== null} onClick={() => pick.current && pick.current.click()} style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Camera size={15} /> {st && st.avatar_url ? 'Change photo' : 'Upload photo'}</button>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 6 }}>Without a photo your initials are shown. One change per week.</div>
      </div>
    </div>
  );
}
