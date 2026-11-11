import React from 'react';
import { imgUrl } from '../lib/img';

// Plain banner image (skeleton placeholder removed)
export default function BannerImage({ src, alt, eager, w = 900 }) {
  return <img src={imgUrl(src, w)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchpriority: 'high' } : {})} />;
}
