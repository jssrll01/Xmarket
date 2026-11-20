/* Checks what a file really is (its first bytes), not its name or the type the browser reports. */
const asc = (b, s, o = 0) => Array.from(s).every((c, i) => b[o + i] === c.charCodeAt(0));
function sniff(b) {
  if (b.length < 12) return '';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'img';
  if (b[0] === 0x89 && asc(b, 'PNG', 1) && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return 'img';
  if (asc(b, 'GIF87a') || asc(b, 'GIF89a')) return 'img';
  if (asc(b, 'RIFF') && asc(b, 'WEBP', 8)) return 'img';
  if (asc(b, 'ftyp', 4) && /^(heic|heix|hevc|heim|heis|mif1|msf1|avif|avis)$/.test(String.fromCharCode(b[8], b[9], b[10], b[11]))) return 'img';
  if (asc(b, '%PDF')) return 'pdf';
  return '';
}
if (typeof document !== 'undefined') {
  document.addEventListener('change', async (e) => {
    const t = e.target;
    if (!t || t.tagName !== 'INPUT' || t.type !== 'file' || e.__xmChecked) return;
    const acc = (t.getAttribute('accept') || '').toLowerCase();
    if (acc && !/image|pdf|\.jpe?g|\.png/.test(acc)) return;
    const files = Array.from(t.files || []);
    if (!files.length) return;
    e.stopImmediatePropagation();
    let bad = false;
    for (const f of files) {
      let k = '';
      try { k = sniff(new Uint8Array(await f.slice(0, 16).arrayBuffer())); } catch (err) { k = ''; }
      if (!(k === 'img' || (k === 'pdf' && (!acc || /pdf/.test(acc))))) { bad = true; break; }
    }
    if (bad) {
      t.value = '';
      window.alert('That file is not a valid photo. Please choose a real JPG, PNG, WebP or GIF image.');
      return;
    }
    const ev = new Event('change', { bubbles: true });
    ev.__xmChecked = true;
    t.dispatchEvent(ev);
  }, true);
}
