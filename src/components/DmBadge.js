import React from 'react';

// Red unread counter shown on the corner of a message button. Put it inside a position:relative wrapper.
export default function DmBadge({ count, ring = '#fff' }) {
  if (!count) return null;
  return (
    <span
      aria-label={count + ' unread messages'}
      style={{ position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 800, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px ' + ring, pointerEvents: 'none' }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
