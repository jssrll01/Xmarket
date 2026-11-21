/* Blocks the long-press "save image" menu, right click and dragging images out of the page.
   Text fields still keep their normal menu (copy and paste). Add data-allow-menu to any element that should keep it. */
if (typeof document !== 'undefined') {
  try {
    const st = document.createElement('style');
    st.textContent = 'img,picture,video,canvas{-webkit-touch-callout:none;-webkit-user-drag:none;user-drag:none}img{-webkit-user-select:none;user-select:none}';
    (document.head || document.documentElement).appendChild(st);
  } catch (e) { /* ignore */ }
  const allowed = (t) => !!(t && t.closest && t.closest('input,textarea,[contenteditable="true"],[data-allow-menu]'));
  document.addEventListener('contextmenu', (e) => { if (!allowed(e.target)) e.preventDefault(); }, true);
  document.addEventListener('dragstart', (e) => { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); }, true);
}
