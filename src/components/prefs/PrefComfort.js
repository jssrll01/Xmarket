import React from 'react';
import { usePrefs } from '../../lib/prefs';
import { Card, Row, Toggle } from './PrefUi';

export default function PrefComfort() {
  const [p, set] = usePrefs();
  return (
    <Card title="Comfort">
      <Row label="Data saver" hint="Loads images lazily, stops video autoplay and turns off animations.">
        <Toggle on={p.saver} onChange={(v) => set({ saver: v })} label="Data saver" />
      </Row>
    </Card>
  );
}
