import React from 'react';
import { Crown } from 'lucide-react';
import { useVip } from '../lib/vip';
import '../vip.css';

function Pill() {
  return (
    <span className="vip-badge" title="XMARKET VIP">
      <Crown size={11} strokeWidth={2.6} />VIP
    </span>
  );
}

function Own() {
  const { isVip } = useVip();
  return isVip ? <Pill /> : null;
}

// <VipBadge /> = badge only if the signed-in user is VIP
// <VipBadge active /> = force the badge (used for other users in chat)
export default function VipBadge({ active }) {
  if (active === undefined) return <Own />;
  return active ? <Pill /> : null;
}
