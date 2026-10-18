import React from 'react';

const stagger = (i) => ({ animationDelay: `${Math.min(i * 40, 400)}ms` });

export function ProductCardSkeleton({ index = 0 }) {
  return (
    <div className="card skeleton-card fade-up" style={stagger(index)}>
      <div className="sk sk-img" />
      <div style={{ padding: 12 }}>
        <div className="sk sk-line" style={{ width: '90%' }} />
        <div className="sk sk-line" style={{ width: '60%', marginTop: 6 }} />
        <div className="sk sk-line" style={{ width: '40%', marginTop: 10, height: 18 }} />
      </div>
      <div className="sk sk-btn" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div style={{ padding: 16 }} className="fade-up">
      <div className="sk" style={{ width: '100%', aspectRatio: '3/2', borderRadius: 16 }} />
      <div className="sk sk-line" style={{ width: '70%', height: 22, marginTop: 16 }} />
      <div className="sk sk-line" style={{ width: '40%', marginTop: 10 }} />
      <div className="sk sk-line" style={{ width: '30%', height: 26, marginTop: 16 }} />
      <div className="sk sk-btn" style={{ marginTop: 20, height: 44, borderRadius: 12 }} />
    </div>
  );
}

export function NotificationListSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card fade-up" style={{ ...stagger(i), padding: 14, marginBottom: 10, display: 'flex', gap: 12 }}>
          <div className="sk" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="sk sk-line" style={{ width: '55%' }} />
            <div className="sk sk-line" style={{ width: '90%', marginTop: 8 }} />
            <div className="sk sk-line" style={{ width: '25%', marginTop: 8 }} />
          </div>
        </div>
      ))}
    </>
  );
}

export function VoucherListSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card fade-up" style={{ ...stagger(i), padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="sk" style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="sk sk-line" style={{ width: '50%', height: 16 }} />
            <div className="sk sk-line" style={{ width: '80%', marginTop: 8 }} />
          </div>
          <div className="sk" style={{ width: 64, height: 32, borderRadius: 10 }} />
        </div>
      ))}
    </>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div style={{ padding: 16 }} className="fade-up">
      <div className="sk sk-line" style={{ width: '45%', height: 22 }} />
      <div className="sk sk-line" style={{ width: '30%', marginTop: 10 }} />
      {[1, 2].map((i) => (
        <div key={i} className="card" style={{ padding: 12, marginTop: 14, display: 'flex', gap: 12 }}>
          <div className="sk" style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="sk sk-line" style={{ width: '80%' }} />
            <div className="sk sk-line" style={{ width: '40%', marginTop: 8 }} />
          </div>
        </div>
      ))}
      <div className="sk sk-line" style={{ width: '100%', height: 90, marginTop: 14, borderRadius: 12 }} />
    </div>
  );
}

export function ListRowsSkeleton({ count = 4, compact = false }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="fade-up" style={{ ...stagger(i), display: 'flex', alignItems: 'center', gap: 12, padding: compact ? '8px 4px' : '12px 4px' }}>
          <div className="sk" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="sk sk-line" style={{ width: '60%' }} />
            <div className="sk sk-line" style={{ width: '35%', marginTop: 8 }} />
          </div>
          <div className="sk sk-line" style={{ width: 54 }} />
        </div>
      ))}
    </>
  );
}

export function CardListSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card fade-up" style={{ ...stagger(i), padding: 16, marginBottom: 12 }}>
          <div className="sk sk-line" style={{ width: '40%', marginBottom: 10 }} />
          <div className="sk sk-line" style={{ width: '70%', marginBottom: 10 }} />
          <div className="sk sk-line" style={{ width: '50%' }} />
        </div>
      ))}
    </>
  );
}

export function WalletSkeleton() {
  return (
    <div className="fade-up">
      <div className="card" style={{ padding: 16 }}>
        <div className="sk sk-line" style={{ width: '30%' }} />
        <div className="sk sk-line" style={{ width: '55%', height: 28, marginTop: 10 }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[1, 2, 3].map((i) => <div key={i} className="sk" style={{ flex: 1, height: 38, borderRadius: 10 }} />)}
        </div>
      </div>
      <div style={{ marginTop: 12 }}><ListRowsSkeleton count={4} /></div>
    </div>
  );
}

export function GameLoadingSkeleton() {
  return (
    <div style={{ padding: 16 }} className="fade-up">
      <div className="sk sk-line" style={{ width: '40%', height: 22 }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {[1, 2, 3].map((i) => <div key={i} className="sk" style={{ width: 80, height: 34, borderRadius: 18 }} />)}
      </div>
      <div className="sk" style={{ width: '100%', height: 120, borderRadius: 16, marginTop: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginTop: 16 }}>
        {Array.from({ length: 10 }).map((_, i) => <div key={i} className="sk" style={{ height: 44, borderRadius: 12 }} />)}
      </div>
      <div className="sk sk-btn" style={{ marginTop: 20, height: 44, borderRadius: 12 }} />
    </div>
  );
}
