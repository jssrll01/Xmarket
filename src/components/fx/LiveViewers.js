import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { fx } from '../../lib/fx';

function viewerKey() {
  try {
    let k = sessionStorage.getItem('fx_vk');
    if (!k) { k = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12); sessionStorage.setItem('fx_vk', k); }
    return k;
  } catch (e) { return 'v' + Math.random().toString(36).slice(2, 14); }
}

export default function LiveViewers({ productId }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!productId) return undefined;
    let alive = true;
    const key = viewerKey();
    const ping = () => {
      if (document.hidden) return;
      fx('fx_product_ping', { p_product: String(productId), p_viewer: key }).then((v) => { if (alive) setN(Number(v) || 0); }).catch(() => {});
    };
    ping();
    const t = setInterval(ping, 20000);
    return () => { alive = false; clearInterval(t); };
  }, [productId]);
  if (n < 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '10px 16px 0', fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>
      <Eye size={15} /> {n} {n === 1 ? 'person' : 'people'} viewing this
    </div>
  );
}
