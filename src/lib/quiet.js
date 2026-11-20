/* Loaded first. Production: nothing is printed to the console, and messages from unknown origins are dropped. */
if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  ['log', 'info', 'debug', 'trace', 'table', 'dir'].forEach((k) => { try { console[k] = noop; } catch (e) { /* ignore */ } });
  const slim = (a) => (typeof a === 'string' ? a.slice(0, 200) : a && a.message ? String(a.message).slice(0, 200) : '[hidden]');
  ['warn', 'error'].forEach((k) => {
    const o = console[k] ? console[k].bind(console) : noop;
    console[k] = (...args) => o(...args.map(slim));
  });
}
const OK = new Set([window.location.origin, 'https://www.youtube.com', 'https://www.youtube-nocookie.com']);
window.addEventListener('message', (e) => {
  if (!OK.has(e.origin)) e.stopImmediatePropagation();
}, true);
