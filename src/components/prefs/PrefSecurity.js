import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getDeviceId } from '../../lib/devices';
import { useServerPrefs } from '../../lib/serverPrefs';
import { Card, Row, Toggle, ghost } from './PrefUi';

export default function PrefSecurity() {
  const { sp, save } = useServerPrefs();
  const [list, setList] = useState(null);
  const me = getDeviceId();
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('devices_list');
    setList(Array.isArray(data) ? data : []);
  }, []);
  useEffect(() => { load(); }, [load]);
  const trust = async (d) => { await supabase.rpc('device_trust', { p_id: d.id, p_trusted: !d.trusted }); load(); };
  const remove = async (d) => { if (window.confirm('Remove this device?')) { await supabase.rpc('device_remove', { p_id: d.id }); load(); } };
  return (
    <Card title="Trusted devices">
      {sp === false && <div style={{ fontSize: 13, color: 'var(--muted, #64748B)' }}>Sign in to manage your devices.</div>}
      {sp && (
        <Row label="Alert me about new devices" hint="Get a notification when an unrecognised device uses your account.">
          <Toggle on={sp.device_alert} onChange={(v) => save({ device_alert: v })} label="Alert me about new devices" />
        </Row>
      )}
      {list && list.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted, #64748B)' }}>No devices recorded yet.</div>}
      {list && list.map((d) => (
        <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 0', borderTop: '1px solid var(--border, #E2E8F0)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{d.label}{d.device_id === me ? ' (this device)' : ''}</div>
            <div style={{ fontSize: 12, color: 'var(--muted, #64748B)' }}>Last used {new Date(d.last_seen).toLocaleDateString()}{d.trusted ? ' · Trusted' : ''}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" style={ghost} onClick={() => trust(d)}>{d.trusted ? 'Untrust' : 'Trust'}</button>
            {d.device_id !== me && <button type="button" style={ghost} onClick={() => remove(d)}>Remove</button>}
          </div>
        </div>
      ))}
    </Card>
  );
}
