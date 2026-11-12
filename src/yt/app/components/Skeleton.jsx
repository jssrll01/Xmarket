/* eslint-disable */
function RowSkeleton({ count = 6 }) {
  return (
    <div style={{ padding: '16px 16px 0' }}>
      <span className="sk sk-line" style={{ display: 'block', width: 160, height: 18, borderRadius: 99, marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="sk" style={{ flex: '0 0 140px', aspectRatio: '16 / 9', borderRadius: 8 }} />
        ))}
      </div>
    </div>
  )
}

export default function Skeleton({ variant = 'row' }) {
  if (variant === 'page') {
    return (
      <div role="status" aria-label="Loading">
        <span className="sk" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', borderRadius: 0 }} />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    )
  }
  return <RowSkeleton />
}
