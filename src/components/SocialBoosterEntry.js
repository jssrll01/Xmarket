import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PlatformIcon } from './BoosterBits';
import '../booster.css';

const PLATS = ['Facebook', 'Instagram', 'TikTok', 'YouTube'];

function searchWrap() {
  const input = document.querySelector('input[placeholder*="Search Hub" i]');
  if (!input) return null;
  let node = input;
  while (node.parentElement && node.parentElement !== document.body && node.parentElement.getBoundingClientRect().height < 120) {
    node = node.parentElement;
  }
  return node === input ? null : node;
}

function Card() {
  const nav = useNavigate();
  return (
    <button type="button" className="bst-entry" onClick={() => nav('/social-booster')}>
      <span className="bst-entry-tx">
        <b>Social Booster</b>
        <small>Grow your socials. Pay with Xwallet.</small>
      </span>
      <span className="bst-entry-ics">
        {PLATS.map((p) => <PlatformIcon key={p} platform={p} size={28} />)}
      </span>
    </button>
  );
}

export default function SocialBoosterEntry() {
  const [host, setHost] = useState(null);
  const [late, setLate] = useState(false);

  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'bst-entry-wrap';
    let stop = false;
    const place = () => {
      if (stop) return;
      const wrap = searchWrap();
      if (!wrap) return;
      if (!el.isConnected || el.previousElementSibling !== wrap) wrap.insertAdjacentElement('afterend', el);
      setHost((h) => h || el);
    };
    place();
    const mo = new MutationObserver(place);
    mo.observe(document.body, { childList: true, subtree: true });
    const t = setTimeout(() => setLate(true), 1500);
    return () => {
      stop = true;
      mo.disconnect();
      clearTimeout(t);
      el.remove();
    };
  }, []);

  if (host) return createPortal(<Card />, host);
  if (late) return <div className="bst-entry-wrap fb"><Card /></div>;
  return null;
}
