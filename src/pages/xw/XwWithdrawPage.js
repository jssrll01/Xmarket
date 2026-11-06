import React from 'react';
import { useNavigate } from 'react-router-dom';
import XwalletWithdraw from '../XwalletWithdraw';
import useWallet from './useWallet';
import { Shell, SignIn, peso } from './ui';

export default function XwWithdrawPage() {
  const nav = useNavigate();
  const { user, balance, withdrawals, refresh } = useWallet();
  if (!user) return <SignIn />;
  return (
    <Shell title="Withdraw">
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Available balance <b style={{ color: 'var(--text)' }}>{peso(balance)}</b> · minimum ₱100 · 1% fee</div>
      <XwalletWithdraw balance={balance} withdrawals={withdrawals} onDone={refresh} onSeeAll={() => nav('/xwallet/history?f=withdraw')} />
    </Shell>
  );
}
