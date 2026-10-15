import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, BadgeCheck, Share2, MapPin, Phone, Mail, Search, Ticket, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SmartImage from '../components/SmartImage';
import { priceRange } from '../lib/variants';

export default function SellerProfile() {
  const { store } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [q, setQ] = useState('');
  const [infoLoading, setInfoLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const decodedStore = decodeURIComponent(store || '');

  useEffect(() => {
    supabase.from('products').select('*').eq('store', decodedStore)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, [decodedStore]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setInfoLoading(true); setBannerLoaded(false); setLogoLoaded(false);
      setInfoLoading(true); setBannerLoaded(false); setLogoLoaded(false);
      const { data } = await supabase.from('stores').select('*').eq('name', decodedStore).maybeSingle();
      if (!alive) return;
      setInfo(data || null);
      setInfoLoading(false);
      setInfoLoading(false);
      if (data) {
        const nowIso = new Date().toISOString();
        const { data: v } = await supabase.from('store_vouchers').select('*')
          .eq('store_id', data.id).eq('active', true)
          .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
        if (alive) setVouchers(v || []);
      }
    })();
    supabase.rpc('store_follower_count', { store_name: decodedStore })
      .then(({ data }) => { if (alive) setFollowers(Number(data) || 0); });
    return () => { alive = false; };
  }, [decodedStore]);

  useEffect(() => {
    if (!user) { setFollowing(false); setClaimed([]); return; }
    supabase.from('seller_follows').select('id').eq('user_id', user.id).eq('seller_name', decodedStore).maybeSingle()
      .then(({ data }) => setFollowing(!!data));
    supabase.from('store_voucher_claims').select('voucher_id').eq('user_id', user.id)
      .then(({ data }) => setClaimed((data || []).map(r => r.voucher_id)));
  }, [user, decodedStore]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) nav(-1);
    else nav('/', { replace: true });
  };

  const toggleFollow = async () => {
    if (!user) { showToast('Please sign in'); nav('/signin'); return; }
    if (following) {
      await supabase.from('seller_follows').delete().eq('user_id', user.id).eq('seller_name', decodedStore);
      setFollowing(false); setFollowers(n => Math.max(0, n - 1));
      showToast('Unfollowed');
    } else {
      await supabase.from('seller_follows').insert({ user_id: user.id, seller_name: decodedStore });
      setFollowing(true); setFollowers(n => n + 1);
      showToast('Following ' + decodedStore);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: decodedStore, url }); return; }
      await navigator.clipboard.writeText(url);
      showToast('Store link copied');
    } catch {}
  };

  const collect = async (v) => {
    if (!user) { showToast('Please sign in'); nav('/signin'); return; }
    const { error } = await supabase.from('store_voucher_claims').insert({ voucher_id: v.id, user_id: user.id });
    if (error) { showToast(error.message); return; }
    setClaimed(c => [...c, v.id]);
    showToast('Voucher collected');
  };

  const shown = products.filter(p => (p.name || '').toLowerCase().includes(q.trim().toLowerCase()));
  const label = (v) => (v.discount_type === 'percent' ? `${Number(v.discount_value)}% off` : `₱${Number(v.discount_value)} off`);

  return (
    <div className="page-enter" style={{ paddingBottom: 60 }}>
      <div style={{ position: 'relative', height: 150, background: 'linear-gradient(135deg, #1E3A8A, #7C3AED)', overflow: 'hidden' }}>
        {(infoLoading || (info?.banner_url && !bannerLoaded)) && <div className="sk" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
        {info?.banner_url && (
          <img src={info.banner_url} alt="" onLoad={() => setBannerLoaded(true)} onError={() => setBannerLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: bannerLoaded ? 1 : 0, transition: 'opacity .25s' }} />
        )}
        <button onClick={goBackSafe} className="icon-btn" style={{ position: 'absolute', top: 12, left: 12 }}><ArrowLeft size={20} /></button>
        <button onClick={share} className="icon-btn" aria-label="Share store" style={{ position: 'absolute', top: 12, right: 12 }}><Share2 size={18} /></button>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginTop: -44, marginBottom: 12, position: 'relative', zIndex: 2 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--bg, #fff)', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            {(infoLoading || (info?.logo_url && !logoLoaded)) && <div className="sk" style={{ position: 'absolute', inset: 0, borderRadius: '50%' }} />}
            {!infoLoading && (info?.logo_url
              ? <img src={info.logo_url} alt={decodedStore} onLoad={() => setLogoLoaded(true)} onError={() => setLogoLoaded(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: logoLoaded ? 1 : 0, transition: 'opacity .25s' }} />
              : <Store size={32} color="#fff" />)}
          </div>
          <button onClick={toggleFollow} className={following ? 'btn-ghost' : 'btn-primary'} style={{ marginLeft: 'auto', padding: '10px 22px' }}>
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
          {decodedStore} {info?.verified && <BadgeCheck size={18} color="#2563EB" />}
        </h2>
        <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--muted)', marginTop: 4, marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {followers} {followers === 1 ? 'follower' : 'followers'}</span>
          <span>{products.length} {products.length === 1 ? 'product' : 'products'}</span>
        </div>

        {info?.description && <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{info.description}</p>}

        {(info?.location || info?.contact_phone || info?.contact_email) && (
          <div className="card" style={{ padding: 14, marginBottom: 16, fontSize: 13, display: 'grid', gap: 10 }}>
            {info.location && <div style={{ display: 'flex', gap: 10 }}><MapPin size={16} color="var(--primary)" /><span>{info.location}</span></div>}
            {info.contact_phone && <a href={`tel:${info.contact_phone}`} style={{ display: 'flex', gap: 10, color: 'inherit', textDecoration: 'none' }}><Phone size={16} color="var(--primary)" /><span>{info.contact_phone}</span></a>}
            {info.contact_email && <a href={`mailto:${info.contact_email}`} style={{ display: 'flex', gap: 10, color: 'inherit', textDecoration: 'none' }}><Mail size={16} color="var(--primary)" /><span>{info.contact_email}</span></a>}
          </div>
        )}

        {vouchers.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Store vouchers</h3>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {vouchers.map(v => {
                const got = claimed.includes(v.id);
                return (
                  <div key={v.id} className="card" style={{ padding: 12, minWidth: 190, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 15 }}><Ticket size={16} color="var(--primary)" /> {label(v)}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
                      {v.title || 'Store voucher'}{Number(v.min_spend) > 0 ? ` · Min. spend ₱${Number(v.min_spend)}` : ''}
                    </div>
                    {v.expires_at && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Until {new Date(v.expires_at).toLocaleDateString()}</div>}
                    <button onClick={() => collect(v)} disabled={got} className={got ? 'btn-ghost' : 'btn-primary'} style={{ width: '100%', padding: '8px 0', marginTop: 10, fontSize: 12.5 }}>
                      {got ? 'Collected' : 'Collect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 12, top: 13 }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search in ${decodedStore}`}
            style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 14 }} />
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
        ) : shown.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>{q ? 'No products match your search.' : 'No products yet.'}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {shown.map(p => (
              <Link key={p.id} to={`/product/${p.legacy_id || p.id}`} className="card" style={{ padding: 0, textDecoration: 'none', color: 'inherit' }}>
                <div className="product-thumb">
                  <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{priceRange(p).display}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
