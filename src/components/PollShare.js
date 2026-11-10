import React, { useState } from 'react';
import { Share2, Link2, Facebook, MessageCircle, Send } from 'lucide-react';
import { useToast } from './Toast';
import ShareSheet from './ShareSheet';

const CSS = `
.psh-btn{display:inline-flex;align-items:center;gap:6px;border:0;padding:8px 14px;border-radius:12px;background:var(--card);color:var(--primary);box-shadow:var(--raised-sm);font-size:12.5px;font-weight:700;margin-top:10px}
.psh-btn:active{box-shadow:var(--inset)}
.psh-ov{position:fixed;inset:0;z-index:4000;background:rgba(15,23,42,.35);display:flex;align-items:flex-end;justify-content:center}
.psh-sheet{width:100%;max-width:560px;background:var(--card);color:var(--text);border-radius:26px 26px 0 0;padding:10px 18px calc(18px + env(safe-area-inset-bottom,0px))}
.psh-grab{width:42px;height:4px;border-radius:99px;background:var(--border);margin:0 auto 14px}
.psh-t{font-size:17px;font-weight:700;margin-bottom:4px}
.psh-q{font-size:12.5px;color:var(--muted);margin-bottom:14px;line-height:1.4}
.psh-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.psh-o{display:flex;align-items:center;gap:10px;border:0;padding:14px;border-radius:16px;background:var(--card);box-shadow:var(--raised-sm);color:var(--text);font-size:13.5px;font-weight:600;text-align:left}
.psh-o:active{box-shadow:var(--inset)}
.psh-o svg{color:var(--primary);flex:none}
.psh-c{width:100%;border:0;background:none;margin-top:10px;padding:12px;color:var(--muted);font-weight:600;font-size:14px}
`;

export default function PollShare({ poll }) {
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);
  const url = window.location.origin + '/demand-polls?poll=' + poll.id;
  const text = 'Vote on this poll on XMARKET: ' + poll.question;
  const enc = encodeURIComponent;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); show('Link copied'); } catch (e) { show('Copy failed'); }
    setOpen(false);
  };
  const native = async () => {
    if (navigator.share) { try { await navigator.share({ title: 'XMARKET poll', text, url }); } catch (e) { /* cancelled */ } setOpen(false); }
    else copy();
  };
  const out = (href) => { window.open(href, '_blank', 'noopener'); setOpen(false); };
  return (
    <>
      <style>{CSS}</style>
      <button type="button" className="psh-btn" onClick={() => setOpen(true)}><Share2 size={14} /> Share poll</button>
      {open && (
        <div className="psh-ov" onClick={() => setOpen(false)}>
          <div className="psh-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="psh-grab" />
            <div className="psh-t">Share poll</div>
            <div className="psh-q">{poll.question}</div>
            <div className="psh-grid">
              <button className="psh-o" style={{ gridColumn: '1 / -1' }} onClick={() => { setOpen(false); setChat(true); }}><MessageCircle size={18} /> Global Chat or DM</button>
              <button className="psh-o" onClick={() => out('https://www.facebook.com/sharer/sharer.php?u=' + enc(url))}><Facebook size={18} /> Facebook</button>
              <button className="psh-o" onClick={() => out('fb-messenger://share?link=' + enc(url))}><MessageCircle size={18} /> Messenger</button>
              <button className="psh-o" onClick={() => out('https://t.me/share/url?url=' + enc(url) + '&text=' + enc(text))}><Send size={18} /> Telegram</button>
              <button className="psh-o" onClick={() => out('https://wa.me/?text=' + enc(text + ' ' + url))}><MessageCircle size={18} /> WhatsApp</button>
              <button className="psh-o" onClick={copy}><Link2 size={18} /> Copy link</button>
              <button className="psh-o" onClick={native}><Share2 size={18} /> More apps</button>
            </div>
            <button className="psh-c" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {chat && <ShareSheet type="poll" id={poll.id} onClose={() => setChat(false)} />}
    </>
  );
}
