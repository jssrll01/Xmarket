import React from 'react';

const stagger = (i) => ({ animationDelay: `${Math.min(i * 40, 240)}ms` });

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
