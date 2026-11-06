import React from 'react';

// Plain banner image (skeleton placeholder removed)
export default function BannerImage({ src, alt, eager }) {
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />;
}
