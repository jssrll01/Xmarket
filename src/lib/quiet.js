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
const TRUSTED = [
  /^https:\/\/(www\.)?youtube(-nocookie)?\.com$/,
  /^https:\/\/challenges\.cloudflare\.com$/,
  /^https:\/\/([a-z0-9-]+\.)?hcaptcha\.com$/,
];
window.addEventListener('message', (e) => {
  if (e.origin === window.location.origin) return;
  if (!TRUSTED.some((r) => r.test(e.origin))) e.stopImmediatePropagation();
}, true);
