import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { Sk, SkStyle } from './socialsUi';

const RULES = [
  'No nudity, violence, hate speech or harassment.',
  'No scams, fake offers or misleading claims.',
  'No copied or stolen content, and no spam.',
  'No prohibited or illegal items.',
  'Only honest product claims.',
  'The post must not go against XMARKET, its products, sellers, staff or policies.',
];

export default function CreatorNewPost() {
  const nav = useNavigate();
  const { show } = useToast();
  const [state, setState] = useState(null);
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const pick = useRef(null);

  useEffect(() => { supabase.rpc('creator_my_application').then(({ data }) => setState(data && data.application ? data.application.status : 'none')); }, []);

  const choose = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) return show('Choose an image file.');
    if (f.size > 8 * 1024 * 1024) return show('Image must be under 8 MB.');
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (busy) return;
    if (!file) return show('Add a picture for your post.');
    if (!desc.trim()) return show('Write a description.');
    if (!agree) return show('Accept the posting rules first.');
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('upload_preset', 'xmarket_creator_upload');
      const up = await fetch('https://api.cloudinary.com/v1_1/bvw3okdf/image/upload', { method: 'POST', body: fd });
      const j = await up.json();
      if (!j.secure_url) throw new Error('Picture upload failed. Try again.');
      await supabase.rpc('creator_accept_rules');
      const { data, error } = await supabase.rpc('creator_create_post', { p_description: desc, p_image_url: j.secure_url });
      if (error) throw new Error(error.message);
      if (!data.ok) throw new Error(data.error);
      show('Posted to XMARKET Socials'); nav('/socials');
    } catch (e) { show(e.message || 'Something went wrong.'); }
    setBusy(false);
  };

  const wrap = { padding: 16, paddingBottom: 60, maxWidth: 560, margin: '0 auto' };
  const head = (<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}><button className="icon-btn" aria-label="Back" onClick={() => nav('/creator-studio')}><ArrowLeft size={20} /></button><h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>New post</h2></div>);

  if (!state) return <div style={wrap}><SkStyle /><Sk h={40} style={{ marginBottom: 14 }} /><Sk h={220} r={18} style={{ marginBottom: 12 }} /><Sk h={120} r={18} /></div>;
  if (state !== 'approved') return <div style={wrap}>{head}<div className="card" style={{ padding: 20, textAlign: 'center' }}>{state === 'banned' ? 'This creator account is permanently banned.' : 'Only approved creators can post.'}</div></div>;

  return (
    <div className="page-enter" style={wrap}>
      {head}
      <div className="card" style={{ padding: 14, marginBottom: 12, borderColor: '#F59E0B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#B45309', marginBottom: 6 }}><ShieldAlert size={18} /> Posting rules</div>
        {RULES.map(r => <div key={r} style={{ fontSize: 13, padding: '3px 0' }}>• {r}</div>)}
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#DC2626', marginTop: 8 }}>Breaking these rules leads to a permanent creator account ban. There is no appeal.</div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10, fontSize: 13, color: 'var(--text)' }}><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 3 }} /> I have read and agree to follow the posting rules.</label>
      </div>
      <div className="card" style={{ padding: 14 }}>
        <input ref={pick} type="file" accept="image/*" onChange={choose} style={{ display: 'none' }} />
        <button type="button" onClick={() => pick.current && pick.current.click()} style={{ width: '100%', minHeight: 160, borderRadius: 16, border: '2px dashed #CBD5E1', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden', color: 'var(--muted)', fontWeight: 700 }}>
          {preview ? <img src={preview} alt="" style={{ width: '100%', maxHeight: 340, objectFit: 'cover' }} /> : <><ImagePlus size={30} />Add picture</>}
        </button>
        <textarea value={desc} maxLength={1000} onChange={e => setDesc(e.target.value)} placeholder="Write a description…" style={{ width: '100%', minHeight: 110, marginTop: 12, padding: 12, fontSize: 14 }} />
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>{desc.length}/1000</div>
        <button className="btn-primary" disabled={busy} onClick={submit} style={{ width: '100%', padding: 14, fontSize: 14, marginTop: 8 }}>{busy ? 'Posting…' : 'Post to Socials'}</button>
        <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 10 }}>You can post once per day. The day resets at midnight (Manila time).</p>
      </div>
    </div>
  );
}
