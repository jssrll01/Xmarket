import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Search, X } from 'lucide-react';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { fetchWallet } from '../lib/xwallet';
import { boosterList, boosterMeta, calcTotal, newKey, num, peso } from '../lib/booster';
import { PlatformIcon, QtyField } from '../components/BoosterBits';
import { CardListSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import '../booster.css';

function ServiceRow({ s, onPick, showPlatform }) {
  return (
    <button type="button" className="bst-row" onClick={() => onPick(s)}>
      <PlatformIcon platform={s.platform} />
      <span className="bst-row-tx">
        <b>{s.name}</b>
        <small>{showPlatform ? s.platform + ' · ' + s.category + ' · ' : ''}{num(s.min_qty)} to {num(s.max_qty)}</small>
      </span>
      <span className="bst-row-pr">{peso(s.price)}</span>
    </button>
  );
}

function OrderSheet({ service, onClose, onPlaced }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const uid = user ? user.id : null;
  const min = service.min_qty;
  const max = service.max_qty;
  const step = max - min >= 1000 ? 100 : 10;
  const [target, setTarget] = useState('');
  const [qty, setQty] = useState(String(Math.min(Math.max(1000, min), max)));
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(null);
  const keyRef = useRef(newKey());

  useEffect(() => {
    if (!uid) return undefined;
    let alive = true;
    fetchWallet(uid).then((b) => { if (alive) setBalance(b); }).catch(() => {});
    return () => { alive = false; };
  }, [uid]);

  const q = Math.floor(Number(qty)) || 0;
  const qtyOk = q >= min && q <= max;
  const total = qtyOk ? calcTotal(service.price, q, service.per_qty) : 0;
  const short = balance !== null && total > balance;
  const profile = service.target_kind === 'profile';
  const chips = useMemo(
    () => [...new Set([min, 500, 1000, 2500, 5000, 10000, max])].filter((v) => v >= min && v <= max).sort((a, b) => a - b).slice(0, 6),
    [min, max]
  );

  const submit = async () => {
    if (busy) return;
    if (!uid) { nav('/signin'); return; }
    const t = target.trim();
    if (!t) { show(profile ? 'Enter the username or profile link.' : 'Enter the link.'); return; }
    if (!qtyOk) { show(`Quantity must be between ${num(min)} and ${num(max)}.`); return; }
    setBusy(true);
    const { data, error } = await rpcPin('booster_order', {
      p_service: service.id, p_target: t, p_qty: q, p_note: note.trim() || null, p_idem: keyRef.current
    });
    setBusy(false);
    if (error) { show(error.message); return; }
    if (!data || !data.ok) { if (!data || data.error !== 'Cancelled') show((data && data.error) || 'Could not place the order.'); return; }
    onPlaced(data);
  };

  return (
    <div className="bst-ov" onClick={() => { if (!busy) onClose(); }}>
      <div className="bst-sheet" role="dialog" aria-modal="true" aria-label={service.name} onClick={(e) => e.stopPropagation()}>
        <div className="bst-sh-head">
          <PlatformIcon platform={service.platform} />
          <div className="bst-sh-tx"><b>{service.name}</b><small>{service.platform} · {service.category}</small></div>
          <button type="button" className="icon-btn" aria-label="Close" disabled={busy} onClick={onClose}><X size={18} /></button>
        </div>
        {service.description && <p className="bst-desc">{service.description}</p>}
        <div className="bst-facts">
          <div><small>Price</small><b>{peso(service.price)}</b></div>
          <div><small>Quantity</small><b>{num(min)} to {num(max)}</b></div>
          <div><small>Start time</small><b>{service.est_time || 'After admin review'}</b></div>
        </div>

        <label className="bst-lbl">{profile ? 'Username or profile link' : 'Link'}</label>
        <input className="bst-in" value={target} maxLength={300} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false}
          placeholder={profile ? '@username or profile link' : 'Paste the full link (https://...)'} onChange={(e) => setTarget(e.target.value)} />

        <label className="bst-lbl">Quantity</label>
        <QtyField value={qty} onChange={setQty} min={min} max={max} step={step} />
        <div className="bst-qchips">
          {chips.map((v) => (
            <button key={v} type="button" className={q === v ? 'on' : ''} onClick={() => setQty(String(v))}>{num(v)}</button>
          ))}
        </div>
        {qty !== '' && !qtyOk && <div className="bst-err">Quantity must be between {num(min)} and {num(max)}.</div>}

        <label className="bst-lbl"><span>Note for our team (optional)</span><span>{note.length}/300</span></label>
        <textarea className="bst-in" rows={2} maxLength={300} value={note} placeholder="Anything we should know?" onChange={(e) => setNote(e.target.value)} />

        <div className="bst-total"><span>Total</span><b>{peso(total)}</b></div>
        {balance !== null && <div className={'bst-bal' + (short ? ' bad' : '')}>Xwallet balance {peso(balance)}{short ? ' (not enough)' : ''}</div>}
        {short && <button type="button" className="bst-topup" onClick={() => nav('/xwallet/topup')}>Top up Xwallet</button>}
        <button type="button" className="btn-primary bst-pay" disabled={busy || !qtyOk || total <= 0 || !target.trim() || short} onClick={submit}>
          {busy ? 'Processing…' : 'Pay ' + peso(total) + ' with Xwallet'}
        </button>
        <div className="bst-fine">Our team reviews each order and then starts it. Speed and results can vary and are not guaranteed. You can change the quantity or note while the order is still pending.</div>
      </div>
    </div>
  );
}

export default function SocialBooster() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const showRef = useRef(show);
  showRef.current = show;
  const [params, setParams] = useSearchParams();
  const platform = params.get('p') || '';
  const category = params.get('c') || '';
  const [meta, setMeta] = useState(null);
  const [metaErr, setMetaErr] = useState('');
  const [popular, setPopular] = useState([]);
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [items, setItems] = useState(null);
  const [total, setTotal] = useState(0);
  const [more, setMore] = useState(false);
  const [sel, setSel] = useState(null);
  const reqRef = useRef(0);

  const cats = useMemo(() => (meta && meta.categories && meta.categories[platform]) || [], [meta, platform]);
  const activeCat = category || (cats.length ? cats[0].category : '');
  const searching = dq.length >= 2;
  const browsing = Boolean(platform && activeCat);
  const mode = searching ? 'search' : browsing ? 'browse' : 'home';
  const waiting = Boolean(platform) && !meta && !metaErr;

  useEffect(() => {
    let alive = true;
    boosterMeta().then((m) => { if (alive) setMeta(m); }).catch((e) => { if (alive) setMetaErr(e.message); });
    boosterList({ popular: true, limit: 6 }).then((r) => { if (alive) setPopular(r.items); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDq(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async (offset) => {
    const my = ++reqRef.current;
    if (offset === 0) setItems(null); else setMore(true);
    try {
      const r = await boosterList({
        platform: platform || null, category: searching ? null : activeCat || null, q: searching ? dq : null, limit: 8, offset
      });
      if (my !== reqRef.current) return;
      setItems((prev) => (offset === 0 || !prev ? r.items : [...prev, ...r.items]));
      setTotal(r.total);
    } catch (e) {
      if (my !== reqRef.current) return;
      setItems((prev) => prev || []);
      showRef.current(e.message);
    }
    setMore(false);
  }, [platform, activeCat, dq, searching]);

  useEffect(() => {
    if (mode === 'home') { setItems(null); return; }
    load(0);
  }, [mode, load]);

  const back = () => { if (window.history.length > 1) nav(-1); else nav(platform ? '/social-booster' : '/digital-hub', { replace: true }); };
  const pickPlatform = (p) => { setQ(''); setParams({ p }); };
  const pickCategory = (c) => setParams({ p: platform, c }, { replace: true });
  const pick = (s) => { if (!user) { nav('/signin'); return; } setSel(s); };
  const placed = (data) => {
    setSel(null);
    if (data.replay) show('This order was already placed.');
    else if (data.receipt) showReceipt(data.receipt);
    else show('Order placed');
    nav('/my-boost-orders');
  };

  return (
    <div className="page-enter bst">
      <div className="bst-head">
        <button type="button" className="icon-btn" aria-label="Back" onClick={back}><ArrowLeft size={20} /></button>
        <h2>{platform || 'Social Booster'}</h2>
        <button type="button" className="bst-link" onClick={() => nav('/my-boost-orders')}><ClipboardList size={15} /> My orders</button>
      </div>

      <div className="bst-search">
        <Search size={16} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={platform ? 'Search ' + platform + ' services' : 'Search all services'} aria-label="Search services" />
        {q && <button type="button" aria-label="Clear search" onClick={() => setQ('')}><X size={18} /></button>}
      </div>

      {waiting && <CardListSkeleton count={4} />}

      {mode === 'home' && !waiting && (
        <>
          {popular.length > 0 && (
            <>
              <div className="bst-sec">Popular</div>
              <div className="bst-pop">
                {popular.map((s) => (
                  <button key={s.id} type="button" className="bst-popc" onClick={() => pick(s)}>
                    <PlatformIcon platform={s.platform} size={32} />
                    <b>{s.name}</b>
                    <span className="bst-pc-pr">{peso(s.price)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="bst-sec">Choose a platform</div>
          {metaErr && <div className="bst-empty">{metaErr}</div>}
          {!meta && !metaErr && <CardListSkeleton count={2} />}
          {meta && meta.platforms.length === 0 && <div className="bst-empty">No services yet. Check back soon.</div>}
          {meta && (
            <div className="bst-plats">
              {meta.platforms.map((p) => (
                <button key={p.platform} type="button" className="bst-plat" onClick={() => pickPlatform(p.platform)}>
                  <PlatformIcon platform={p.platform} size={46} />
                  <b>{p.platform}</b>
                  <small>{num(p.count)} services</small>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {mode !== 'home' && !waiting && (
        <>
          {mode === 'search' && (
            <div className="bst-sec">{items === null ? 'Searching…' : `${num(total)} result${total === 1 ? '' : 's'} for "${dq}"${platform ? ' in ' + platform : ''}`}</div>
          )}
          {mode === 'browse' && (
            <div className="bst-chips">
              {cats.map((c) => (
                <button key={c.category} type="button" className={'bst-chip' + (c.category === activeCat ? ' on' : '')} onClick={() => pickCategory(c.category)}>
                  {c.category}<small>{c.count}</small>
                </button>
              ))}
            </div>
          )}
          {items === null && <CardListSkeleton count={4} />}
          {items && items.length === 0 && <div className="bst-empty">No services found.</div>}
          {items && items.map((s) => <ServiceRow key={s.id} s={s} onPick={pick} showPlatform={mode === 'search' && !platform} />)}
          {items && items.length < total && (
            <button type="button" className="bst-more" disabled={more} onClick={() => load(items.length)}>{more ? 'Loading…' : 'Load more'}</button>
          )}
        </>
      )}

      {sel && <OrderSheet service={sel} onClose={() => setSel(null)} onPlaced={placed} />}
    </div>
  );
}
