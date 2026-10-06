import React from 'react';

export default function DeductedNoOrder() {
  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>My payment was deducted but my order was not confirmed. What should I do?</h2>
      <div className="card" style={{ padding: 16, fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
        <p>
          This article is being prepared. Please check back soon for the full answer.
        </p>
      </div>
    </div>
  );
}
