import React from 'react';
import { usePrefs, haptic } from '../../lib/prefs';
import { Card, Row, Toggle, ghost } from './PrefUi';

export default function PrefComfort() {
  const [p, set] = usePrefs();
  const canVibrate = typeof navigator !== 'undefined' && !!navigator.vibrate;
  return (
    <Card title="Comfort">
      <Row label="Data saver" hint="Loads images lazily, stops video autoplay and turns off animations.">
        <Toggle on={p.saver} onChange={(v) => set({ saver: v })} label="Data saver" />
      </Row>
      <Row label="Haptic feedback" hint={canVibrate ? 'A light vibration when you tap buttons.' : 'Not supported on this device (iPhone does not allow it).'}>
        <Toggle on={p.haptics} onChange={(v) => set({ haptics: v })} label="Haptic feedback" />
      </Row>
      {canVibrate && p.haptics && <button type="button" style={ghost} onClick={() => haptic(40)}>Test vibration</button>}
    </Card>
  );
}
