import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Plus, MapPin, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { fetchAddresses, saveAddress, deleteAddress, addressLine } from '../lib/addresses';

const EMPTY = { full_name: '', phone: '', address: '', barangay: '', city: '', province: '', postal_code: '', landmark: '', label: '', is_default: false };
const fld = { width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid var(--border, #e5e7eb)', borderRadius: 0, background: 'transparent', boxShadow: 'none', fontSize: 14, outline: 'none', color: 'var(--text)' };
const lab = { fontSize: 12, color: 'var(--muted)', marginTop: 12, display: 'block' };

export default function AddressBook({ mode = 'page', selectedId, onSelect, onClose }) {
  const { user } = useAuth();
  const { show } = useToast();
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => { if (user) setList(await fetchAddresses(user.id)); }, [user]);
  useEffect(() => { load(); }, [load]);

  const upd = (k, v) => setEdit(e => ({ ...e, [k]: v }));

  const submit = async () => {
    const a = edit;
    if (a.full_name.trim().length < 2) return show('Enter the full name');
    if (!/^(09|\+?639)\d{9}$/.test(a.phone.replace(/[\s()-]/g, ''))) return show('Enter a valid mobile number (09XXXXXXXXX)');
    if (!a.province.trim() || !a.city.trim() || !a.barangay.trim()) return show('Enter province, city and barangay');
    if (!a.address.trim()) return show('Enter street name, building, house no.');
    if (!/^\d{4}$/.test((a.postal_code || '').trim())) return show('Postal code is required (4 digits)');
    setBusy(true);
    const { data, error } = await saveAddress(user.id, a);
    setBusy(false);
    if (error) return show(error.message);
    show('Address saved');
    setEdit(null);
    await load();
    if (mode === 'select' && data && !a.id) onSelect && onSelect(data);
  };

  const remove = async () => {
    if (!window.confirm('Delete this address?')) return;
    setBusy(true);
    const { error } = await deleteAddress(edit.id);
    setBusy(false);
    if (error) return show(error.message);
    setEdit(null); load();
  };

  const shell = { position: mode === 'select' ? 'fixed' : 'relative', inset: mode === 'select' ? 0 : undefined, zIndex: 600, background: 'var(--bg, #f5f5f5)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--text)' };
  const bar = (title, back) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card, #fff)', borderBottom: '1px solid var(--border, #eee)', position: 'sticky', top: 0, zIndex: 2 }}>
      <button onClick={back} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
      <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
    </div>
  );

  if (edit) {
    return (
      <div style={shell}>
        {bar(edit.id ? 'Edit Address' : 'New Address', () => setEdit(null))}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, paddingBottom: 110 }}>
          <div className="card" style={{ padding: '4px 16px 12px', marginBottom: 12 }}>
            <label style={lab}>Full Name</label>
            <input style={fld} value={edit.full_name} onChange={e => upd('full_name', e.target.value)} autoComplete="name" />
            <label style={lab}>Phone Number</label>
            <input style={fld} value={edit.phone} onChange={e => upd('phone', e.target.value)} type="tel" inputMode="tel" placeholder="09XX XXX XXXX" />
            <label style={lab}>Province</label>
            <input style={fld} value={edit.province} onChange={e => upd('province', e.target.value)} />
            <label style={lab}>City / Municipality</label>
            <input style={fld} value={edit.city} onChange={e => upd('city', e.target.value)} />
            <label style={lab}>Barangay</label>
            <input style={fld} value={edit.barangay} onChange={e => upd('barangay', e.target.value)} />
            <label style={lab}>Postal Code *</label>
            <input style={fld} value={edit.postal_code || ''} onChange={e => upd('postal_code', e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} />
            <label style={lab}>Street Name, Building, House No.</label>
            <input style={fld} value={edit.address} onChange={e => upd('address', e.target.value)} />
            <label style={lab}>Nearest Landmark (optional)</label>
            <input style={fld} value={edit.landmark || ''} onChange={e => upd('landmark', e.target.value)} />
          </div>
          <div className="card" style={{ padding: '4px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border, #eee)' }}>
              <span style={{ fontWeight: 600 }}>Set as Default Address</span>
              <button type="button" disabled={edit.id && edit.was_default} onClick={() => upd('is_default', !edit.is_default)}
                style={{ width: 46, height: 26, borderRadius: 13, border: 'none', background: edit.is_default ? '#22c55e' : '#cbd5e1', position: 'relative', opacity: edit.was_default ? .6 : 1 }}>
                <span style={{ position: 'absolute', top: 3, left: edit.is_default ? 23 : 3, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left .15s' }} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <span style={{ fontWeight: 600 }}>Label As:</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['work', 'Work'], ['home', 'Home']].map(([id, name]) => {
                  const on = edit.label === id;
                  return <button key={id} type="button" onClick={() => upd('label', on ? '' : id)}
                    style={{ padding: '8px 18px', borderRadius: 6, border: on ? '1px solid var(--primary)' : '1px solid transparent', background: on ? 'transparent' : 'var(--bg, #f1f5f9)', color: on ? 'var(--primary)' : 'var(--text)', fontSize: 13 }}>{name}</button>;
                })}
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, display: 'flex', gap: 10, padding: 12, background: 'var(--card, #fff)', borderTop: '1px solid var(--border, #eee)', zIndex: 3 }}>
          {edit.id && <button onClick={remove} disabled={busy} className="btn-ghost" style={{ flex: 1, padding: 13, color: '#DC2626', borderColor: '#DC2626' }}><Trash2 size={14} /> Delete Address</button>}
          <button onClick={submit} disabled={busy} className="btn-primary" style={{ flex: 1, padding: 13, fontWeight: 700 }}>{busy ? 'Saving…' : 'Submit'}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={shell}>
      {bar(mode === 'select' ? 'Address Selection' : 'My Addresses', onClose)}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
        <div style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--muted)' }}>Address</div>
        {list && list.some((a) => !/^\d{4}$/.test(String(a.postal_code || '').trim())) && (
          <div style={{ margin: '0 12px 10px', padding: '10px 12px', borderRadius: 12, background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', fontSize: 13, fontWeight: 700 }}>Some saved addresses have no postal code. Tap Edit and add the 4-digit code so your orders can be delivered.</div>
        )}
        {list === null ? <p style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Loading…</p>
          : list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 24px', color: 'var(--muted)' }}>
              <MapPin size={40} style={{ opacity: .4 }} />
              <p style={{ marginTop: 10, fontSize: 14 }}>No saved addresses yet.</p>
            </div>
          ) : list.map(a => {
            const sel = mode === 'select' && a.id === selectedId;
            return (
              <div key={a.id} onClick={() => mode === 'select' && onSelect && onSelect(a)}
                style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'var(--card, #fff)', borderBottom: '1px solid var(--border, #eee)', cursor: mode === 'select' ? 'pointer' : 'default' }}>
                {mode === 'select' && (
                  <div style={{ width: 22, height: 22, borderRadius: 11, flexShrink: 0, marginTop: 2, border: '2px solid ' + (sel ? 'var(--primary)' : '#cbd5e1'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel && <Check size={13} color="var(--primary)" strokeWidth={3} />}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.full_name} <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: 13 }}>| {a.phone}</span></div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>{a.address}<br />{addressLine(a)}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {a.is_default && <span style={{ fontSize: 11, padding: '1px 8px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 3 }}>Default</span>}
                    {a.label && <span style={{ fontSize: 11, padding: '1px 8px', border: '1px solid var(--border, #ddd)', color: 'var(--muted)', borderRadius: 3, textTransform: 'capitalize' }}>{a.label}</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setEdit({ ...a, postal_code: a.postal_code || '', landmark: a.landmark || '', label: a.label || '', was_default: a.is_default }); }}
                  style={{ background: 'transparent', color: 'var(--muted)', fontSize: 13, alignSelf: 'flex-start', padding: 4 }}>Edit</button>
              </div>
            );
          })}
      </div>
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: 12, background: 'var(--card, #fff)', borderTop: '1px solid var(--border, #eee)' }}>
        <button onClick={() => setEdit({ ...EMPTY })} disabled={list && list.length >= 10} className="btn-ghost"
          style={{ width: '100%', padding: 13, fontWeight: 700, color: 'var(--primary)', borderColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Plus size={16} /> Add a new address
        </button>
      </div>
    </div>
  );
}
