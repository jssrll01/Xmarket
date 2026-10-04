import React, { useState } from 'react';

export default function SmartImage({ src, alt, style, className }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="img-wrap" style={style}>
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
      <img
        src={src}
        alt={alt}
        className={(className || '') + (loaded ? ' loaded' : '')}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
