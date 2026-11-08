const RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

// Cloudinary only: adds automatic format, automatic quality and a max width. Other URLs pass through.
export function imgUrl(url, w = 600) {
  if (!url || typeof url !== 'string') return url;
  const m = RE.exec(url);
  if (!m || /(^|[,/])f_auto/.test(m[2])) return url;
  return m[1] + 'f_auto,q_auto,w_' + Math.round(w) + ',c_limit/' + m[2];
}
