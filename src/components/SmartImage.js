import React, { useState } from 'react';
import { imgUrl } from '../lib/img';

export default function SmartImage({ src, alt, style, className, w = 800, eager }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="img-wrap" style={style}>
      {!loaded && <div className="sk" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
      <img
        src={imgUrl(src, w)}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        alt={alt}
        className={(className || '') + (loaded ? ' loaded' : '')}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
