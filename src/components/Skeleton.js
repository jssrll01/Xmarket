import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="card skeleton-card">
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
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div style={{ padding: 16 }}>
      <div className="sk" style={{ width: '100%', aspectRatio: '3/2', borderRadius: 16 }} />
      <div className="sk sk-line" style={{ width: '70%', height: 22, marginTop: 16 }} />
      <div className="sk sk-line" style={{ width: '40%', marginTop: 10 }} />
      <div className="sk sk-line" style={{ width: '30%', height: 26, marginTop: 16 }} />
      <div className="sk sk-btn" style={{ marginTop: 20, height: 44, borderRadius: 12 }} />
    </div>
  );
}
