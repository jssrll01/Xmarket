import { supabase } from './supabase';

export const fetchTiers = async () => {
  const { data } = await supabase.from('airdrop_tiers').select('*').eq('enabled', true).order('sort');
  return data || [];
};
export const fetchCredits = async () => {
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) return 0;
  const { data } = await supabase.from('profiles').select('play_credits').eq('id', u.user.id).single();
  return data?.play_credits || 0;
};
export const claimCredits = async () => {
  const { data, error } = await supabase.rpc('airdrop_claim');
  return error ? { ok: false, message: error.message } : data;
};
export const placeBet = async (tier, pick, amount) => {
  const { data, error } = await supabase.rpc('airdrop_bet', { p_tier: tier, p_pick: pick, p_amount: amount });
  return error ? { ok: false, message: error.message } : data;
};
export const fetchDraw = async (tier, endMs) => {
  const { data } = await supabase.from('airdrop_draws').select('*')
    .eq('tier', tier).eq('draw_at', new Date(endMs).toISOString()).maybeSingle();
  return data;
};
export const fetchMyBet = async (drawId) => {
  if (!drawId) return null;
  const { data } = await supabase.from('airdrop_bets').select('*').eq('draw_id', drawId).maybeSingle();
  return data;
};
export const fetchLastDraw = async (tier) => {
  const { data } = await supabase.from('airdrop_draws').select('*')
    .eq('tier', tier).eq('status', 'done').order('draw_at', { ascending: false }).limit(1).maybeSingle();
  return data;
};
export const fetchMyBets = async (drawId, uid) => {
  if (!drawId || !uid) return [];
  const { data } = await supabase.from('airdrop_bets').select('*')
    .eq('draw_id', drawId).eq('user_id', uid).order('created_at', { ascending: true });
  return data || [];
};
export const fetchBetHistory = async (tier, uid) => {
  if (!uid) return [];
  const { data } = await supabase.from('airdrop_bets').select('*')
    .eq('tier', tier).eq('user_id', uid).order('created_at', { ascending: false }).limit(30);
  return data || [];
};
export const fetchLockSeconds = async () => {
  const { data } = await supabase.rpc('airdrop_settings_public');
  return data && data.lock_seconds != null ? Number(data.lock_seconds) : 10;
};
