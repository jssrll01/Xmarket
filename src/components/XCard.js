import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { money } from '../lib/currency';

const CSS = `
.xc-wrap{margin:0 0 16px}
.xc{position:relative;max-width:420px;margin:0 auto;aspect-ratio:1.586;border-radius:22px;padding:5.5% 6.5%;color:#fff;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(135deg,#0A1020 0%,#0F1B3D 55%,#1E40AF 125%);box-shadow:0 24px 40px -24px rgba(15,23,42,.85),inset 0 0 0 1px rgba(255,255,255,.08);animation:xcIn .6s cubic-bezier(.2,.8,.2,1) both}
.xc>*{position:relative;z-index:2}
.xc::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 1px,transparent 1px 14px)}
.xc-o1,.xc-o2,.xc-sh{position:absolute!important;z-index:1!important;pointer-events:none}
.xc-o1{right:-16%;top:-42%;width:78%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.55),rgba(96,165,250,0) 66%)}
.xc-o2{left:-22%;bottom:-60%;width:80%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(250,204,21,.26),rgba(250,204,21,0) 66%)}
.xc-sh{inset:0;background:linear-gradient(115deg,transparent 36%,rgba(255,255,255,.13) 48%,transparent 60%);transform:translateX(-120%);animation:xcSh 6s ease-in-out infinite}
.xc-top{display:flex;align-items:center;justify-content:space-between}
.xc-logo{font-size:19px;font-weight:800;letter-spacing:-.03em}
.xc-logo b{font-size:11px;font-weight:700;letter-spacing:.22em;margin-left:5px;color:#BFDBFE}
.xc-mid{display:flex;align-items:center;gap:14px}
.xc-chip{width:44px;height:34px;border-radius:7px;flex:none;position:relative;background:linear-gradient(135deg,#FDE68A,#F59E0B 55%,#FCD34D)}
.xc-chip::before{content:"";position:absolute;inset:18% 14%;border:1px solid rgba(120,53,15,.45);border-radius:3px}
.xc-chip::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(120,53,15,.45)}
.xc-bal{display:flex;flex-direction:column;min-width:0}
.xc-bal small{font-size:10.5px;color:#BFDBFE;letter-spacing:.08em;text-transform:uppercase}
.xc-amt{display:flex;align-items:center;gap:8px}
.xc-amt strong{font-size:26px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
.xc-eye{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);color:#fff;border:0}
.xc-num{font-size:15px;letter-spacing:.2em;font-variant-numeric:tabular-nums;color:#E2E8F0}
.xc-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}
.xc-foot small{display:block;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#93C5FD;margin-bottom:2px}
.xc-foot b{font-size:12.5px;font-weight:600;letter-spacing:.06em}
.xc-tag{padding:4px 10px;border-radius:99px;border:1px solid rgba(250,204,21,.55);color:#FDE68A;font-size:10px;font-weight:700;letter-spacing:.16em}
@keyframes xcIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
@keyframes xcSh{0%,55%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@media(prefers-reduced-motion:reduce){.xc,.xc-sh{animation:none!important}}
`;

export default function XCard() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const [show, setShow] = useState(() => { try { return localStorage.getItem('xc_show') !== '0'; } catch (e) { return true; } });
  // eslint-disable-next-line
  useEffect(() => {
    let live = true;
    if (!user) return undefined;
    supabase.from('profiles').select('first_name,last_name,xwallet_balance').eq('id', user.id).maybeSingle().then(({ data }) => { if (live) setMe(data || {}); });
    return () => { live = false; };
  }, [user && user.id]);
  if (!user) return null;
  const flip = () => { const n = !show; setShow(n); try { localStorage.setItem('xc_show', n ? '1' : '0'); } catch (e) { /* ignore */ } };
  if (me === null) return <div className="xc-wrap"><div className="sk" style={{ maxWidth: 420, margin: '0 auto', aspectRatio: '1.586', borderRadius: 22 }} /></div>;
  const name = ((me.first_name || '') + ' ' + (me.last_name || '')).trim().toUpperCase() || 'XMARKET MEMBER';
  const last4 = Array.from(String(user.id).slice(-4)).map((c) => c.charCodeAt(0) % 10).join('');
  return (
    <div className="xc-wrap">
      <style>{CSS}</style>
      <div className="xc">
        <i className="xc-o1" /><i className="xc-o2" /><i className="xc-sh" />
        <div className="xc-top">
          <span className="xc-logo">X<b>WALLET</b></span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M8.5 8.5a5 5 0 010 7M12 6a9 9 0 010 12M15.5 3.5a13 13 0 010 17" /></svg>
        </div>
        <div className="xc-mid">
          <span className="xc-chip" />
          <div className="xc-bal">
            <small>Available balance</small>
            <div className="xc-amt">
              <strong>{show ? money(me.xwallet_balance, 'fixed') : '••••••'}</strong>
              <button type="button" className="xc-eye" onClick={flip} aria-label={show ? 'Hide balance' : 'Show balance'}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            </div>
          </div>
        </div>
        <div className="xc-num">{'••••  ••••  ••••  ' + last4}</div>
        <div className="xc-foot">
          <div><small>Card holder</small><b>{name}</b></div>
          <span className="xc-tag">VIRTUAL</span>
        </div>
      </div>
    </div>
  );
}
