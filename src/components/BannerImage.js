import React, { useState, useRef, useEffect } from 'react';

// Banner image that shows the shared skeleton until it has loaded
export default function BannerImage({ src, alt, eager }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <>
      {!loaded && <div className="sk" style={{ width: '100%', aspectRatio: '16 / 6', borderRadius: 0 }} />}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}
