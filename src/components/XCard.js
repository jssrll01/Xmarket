import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { money } from '../lib/currency';

const CSS = `
.xc-wrap{margin:0 0 14px}
.xc{position:relative;max-width:420px;margin:0 auto;border-radius:18px;padding:14px 18px 14px;color:#0F172A;overflow:hidden;display:flex;flex-direction:column;gap:12px;background:linear-gradient(135deg,#FFFFFF 0%,#F8FAFF 55%,#E8F0FE 130%);border:1px solid #E2E8F0;box-shadow:0 1px 2px rgba(15,23,42,.05),0 14px 26px -18px rgba(37,99,235,.35);animation:xcIn .5s cubic-bezier(.2,.8,.2,1) both}
.xc>*{position:relative;z-index:2}
.xc-o1,.xc-sh{position:absolute!important;z-index:1!important;pointer-events:none}
.xc-o1{right:-14%;top:-90%;width:60%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,.2),rgba(59,130,246,0) 68%)}
.xc-sh{inset:0;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.75) 50%,transparent 62%);transform:translateX(-120%);animation:xcSh 7s ease-in-out infinite}
.xc-top{display:flex;align-items:center;justify-content:space-between}
.xc-logo{font-size:17px;font-weight:800;letter-spacing:-.03em;color:#0F172A}
.xc-logo b{font-size:10px;font-weight:700;letter-spacing:.2em;margin-left:5px;color:#2563EB}
.xc-mid{display:flex;align-items:center;gap:12px}
.xc-chip{width:38px;height:29px;border-radius:6px;flex:none;position:relative;background:linear-gradient(135deg,#FDE68A,#F59E0B 55%,#FCD34D);box-shadow:0 1px 2px rgba(120,53,15,.25)}
.xc-chip::before{content:"";position:absolute;inset:18% 14%;border:1px solid rgba(120,53,15,.4);border-radius:3px}
.xc-chip::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(120,53,15,.4)}
.xc-bal{display:flex;flex-direction:column;min-width:0}
.xc-bal small{font-size:10px;color:#64748B;letter-spacing:.08em;text-transform:uppercase;font-weight:600}
.xc-amt{display:flex;align-items:center;gap:8px}
.xc-amt strong{font-size:24px;line-height:1.15;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap;color:#0F172A}
.xc-eye{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#EEF2F7;color:#475569;border:0;flex:none}
.xc-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px solid #E8EDF4}
.xc-foot small{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#94A3B8;margin-bottom:1px;font-weight:600}
.xc-foot b{font-size:12.5px;font-weight:700;letter-spacing:.05em;color:#0F172A}
.xc-r{display:flex;align-items:center;gap:10px}
.xc-num{font-size:12px;letter-spacing:.16em;font-variant-numeric:tabular-nums;color:#64748B}
.xc-tag{padding:3px 9px;border-radius:99px;background:#EFF6FF;border:1px solid #BFDBFE;color:#1D4ED8;font-size:9.5px;font-weight:700;letter-spacing:.14em}
@keyframes xcIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes xcSh{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@media(prefers-reduced-motion:reduce){.xc,.xc-sh{animation:none!important}}
`;

export default function XCard() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const [show, setShow] = useState(() => { try { return localStorage.getItem('xc_show') !== '0'; } catch (e) { return true; } });
  useEffect(() => {
    let live = true;
    if (!user) return undefined;
    supabase.from('profiles').select('first_name,last_name,xwallet_balance').eq('id', user.id).maybeSingle().then(({ data }) => { if (live) setMe(data || {}); });
    return () => { live = false; };
    // eslint-disable-next-line
  }, [user && user.id]);
  if (!user) return null;
  const flip = () => { const n = !show; setShow(n); try { localStorage.setItem('xc_show', n ? '1' : '0'); } catch (e) { /* ignore */ } };
  if (me === null) return <div className="xc-wrap"><div className="sk" style={{ maxWidth: 420, margin: '0 auto', height: 138, borderRadius: 18 }} /></div>;
  const name = ((me.first_name || '') + ' ' + (me.last_name || '')).trim().toUpperCase() || 'XMARKET MEMBER';
  const last4 = Array.from(String(user.id).slice(-4)).map((c) => c.charCodeAt(0) % 10).join('');
  return (
    <div className="xc-wrap">
      <style>{CSS}</style>
      <div className="xc">
        <i className="xc-o1" /><i className="xc-sh" />
        <div className="xc-top">
          <span className="xc-logo">X<b>WALLET</b></span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M8.5 8.5a5 5 0 010 7M12 6a9 9 0 010 12M15.5 3.5a13 13 0 010 17" /></svg>
        </div>
        <div className="xc-mid">
          <span className="xc-chip" />
          <div className="xc-bal">
            <small>Available balance</small>
            <div className="xc-amt">
              <strong>{show ? money(me.xwallet_balance, 'fixed') : '••••••'}</strong>
              <button type="button" className="xc-eye" onClick={flip} aria-label={show ? 'Hide balance' : 'Show balance'}>{show ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            </div>
          </div>
        </div>
        <div className="xc-foot">
          <div><small>Card holder</small><b>{name}</b></div>
          <div className="xc-r"><span className="xc-num">{'•••• ' + last4}</span><span className="xc-tag">VIRTUAL</span></div>
        </div>
      </div>
    </div>
  );
}
