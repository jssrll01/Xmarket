import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { fetchWallet, fetchWalletTxns, fetchMyTopups, fetchMyLoads, fetchMyWithdrawals, fetchInterestSummary, fetchMyInterestLog } from '../../lib/xwallet';

export default function useWallet() {
  const { user } = useAuth();
  const [d, setD] = useState({ balance: 0, txns: [], topups: [], loads: [], withdrawals: [], interest: null, interestLog: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [balance, txns, topups, loads, withdrawals, interest, interestLog] = await Promise.all([
      fetchWallet(user.id), fetchWalletTxns(user.id), fetchMyTopups(user.id), fetchMyLoads(user.id),
      fetchMyWithdrawals(user.id), fetchInterestSummary(), fetchMyInterestLog(user.id, 30),
    ]);
    setD({ balance, txns, topups, loads, withdrawals, interest, interestLog });
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!user) return undefined;
    const ch = supabase.channel('xwallet-hub-' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'xwallet_withdrawals', filter: 'user_id=eq.' + user.id }, () => refresh())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'xwallet_txns', filter: 'user_id=eq.' + user.id }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, refresh]);

  return { user, loading, refresh, ...d };
}
