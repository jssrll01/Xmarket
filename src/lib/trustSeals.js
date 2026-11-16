// Adds a small trust row above every payment button on every page, so new pay buttons get it too.
const MARK = 'data-xm-seal';
const SEL = '.ms-pay, .bst-pay, .vip-btn';
const LABEL = /^\s*(pay\b|paying|place order|proceed to checkout|buy now|confirm (and )?pay)/i;
const svg = (inner) => '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
const ITEMS = [
  [svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'), 'Secure payment'],
  [svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'), 'Buyer support'],
  [svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'), 'Easy returns'],
];

function makeSeal() {
  const d = document.createElement('div');
  d.setAttribute(MARK, '1');
  d.style.cssText = 'display:flex;justify-content:center;flex-wrap:wrap;gap:6px 14px;margin:10px 0 8px;font-size:11px;font-weight:600;color:#64748B;width:100%;box-sizing:border-box';
  d.innerHTML = ITEMS.map((it) => '<span style="display:inline-flex;align-items:center;gap:5px">' + it[0] + it[1] + '</span>').join('');
  return d;
}

function isPay(b) {
  if (!b || b.closest('[' + MARK + ']')) return false;
  if (b.matches(SEL)) return true;
  const t = (b.textContent || '').trim();
  return t.length > 0 && t.length < 40 && LABEL.test(t);
}

function decorate(b) {
  const parent = b.parentElement;
  if (!parent) return;
  const prev = b.previousElementSibling;
  if (prev && prev.hasAttribute(MARK)) return;
  let anchor = b;
  const cs = window.getComputedStyle(parent);
  if (cs.display.indexOf('flex') >= 0 && cs.flexDirection.indexOf('row') === 0 && parent.children.length > 1) anchor = parent;
  const host = anchor.parentElement;
  if (!host) return;
  if (anchor !== b && Array.prototype.some.call(host.children, (c) => c.hasAttribute(MARK))) return;
  if (anchor === b && anchor.previousElementSibling && anchor.previousElementSibling.hasAttribute(MARK)) return;
  host.insertBefore(makeSeal(), anchor);
}

function run() {
  if (window.location.pathname.indexOf('/embed') === 0) return;
  document.querySelectorAll('[' + MARK + ']').forEach((s) => {
    const n = s.nextElementSibling;
    const ok = n && (isPay(n) || Array.prototype.some.call(n.querySelectorAll('button'), isPay));
    if (!ok) s.remove();
  });
  document.querySelectorAll('button').forEach((b) => {
    if (b.getClientRects().length && isPay(b)) decorate(b);
  });
}

let timer = 0;
function schedule() {
  if (timer) return;
  timer = window.setTimeout(() => { timer = 0; run(); }, 250);
}

export function startTrustSeals() {
  if (typeof window === 'undefined' || window.__xmSeals) return;
  window.__xmSeals = true;
  const go = () => { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); schedule(); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
}
