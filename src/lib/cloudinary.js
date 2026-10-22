const CLOUD = 'bvw3okdf';
const PRESET = 'xmarket_reviews';
export const REVIEW_PHOTO_RE = new RegExp('^https://res\\.cloudinary\\.com/' + CLOUD + '/image/upload/');

// Small, fast version of a stored photo (resize + automatic format and quality).
export function cld(url, t) {
  if (!url || !REVIEW_PHOTO_RE.test(url)) return '';
  return url.replace('/image/upload/', '/image/upload/' + t + '/');
}

// Shrinks the photo on the phone (max 1200px, JPEG) before uploading.
// Re-drawing also removes hidden data such as GPS location.
function shrink(file, maxSide = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the photo'))), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(src); reject(new Error('Could not read the photo')); };
    img.src = src;
  });
}

export async function uploadReviewPhoto(file) {
  const blob = await shrink(file);
  if (blob.size > 5 * 1024 * 1024) throw new Error('Photo is still too large');
  const fd = new FormData();
  fd.append('file', blob, 'review.jpg');
  fd.append('upload_preset', PRESET);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD + '/image/upload', { method: 'POST', body: fd, signal: ctrl.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.secure_url) throw new Error((data.error && data.error.message) || 'Upload failed');
    if (!REVIEW_PHOTO_RE.test(data.secure_url)) throw new Error('Unexpected upload address');
    return data.secure_url;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Upload timed out');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
