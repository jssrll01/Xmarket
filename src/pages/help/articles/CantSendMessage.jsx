import React from 'react';

export default function CantSendMessage() {
  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Why can\'t I send a message?</h2>
      <div className="card" style={{ padding: 16, fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
        <p>
          This article is being prepared. Please check back soon for the full answer.
        </p>
      </div>
    </div>
  );
}
