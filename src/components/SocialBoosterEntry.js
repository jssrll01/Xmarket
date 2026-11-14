import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import '../booster.css';

export default function SocialBoosterEntry() {
  const nav = useNavigate();
  return (
    <div className="bst-entry-wrap">
      <button type="button" className="bst-entry" onClick={() => nav('/social-booster')}>
        <span className="bst-entry-ic"><Zap size={22} /></span>
        <span className="bst-entry-tx">
          <b>Social Booster</b>
          <small>Grow your Facebook, Instagram, TikTok and YouTube. Pay with Xwallet.</small>
        </span>
      </button>
    </div>
  );
}
