import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Mail, HelpCircle } from 'lucide-react';
import { GREETING, QUICK_CHIPS } from '../lib/xupport';
import { pickBest } from '../lib/xupport/match';

const STORAGE_KEY = 'xmarket.xupport.history.v1';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function Xupport() {
  const nav = useNavigate();
  const listRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = loadHistory();
    if (saved && saved.length) return saved;
    return [{ id: uid(), role: 'bot', text: GREETING, at: Date.now() }];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20))); } catch {}
  }, [messages]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) nav(-1);
    else nav('/', { replace: true });
  };

  const ask = (text) => {
    const t = (text || '').trim();
    if (!t || typing) return;

    const userMsg = { id: uid(), role: 'user', text: t, at: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    // tiny delay so it feels like it's thinking
    setTimeout(() => {
      const { intent } = pickBest(t);
      const botMsg = {
        id: uid(),
        role: 'bot',
        text: intent.answer,
        links: intent.links || [],
        at: Date.now(),
      };
      setMessages(m => [...m, botMsg]);
      setTyping(false);
    }, 380);
  };

  const onSubmit = (e) => { e.preventDefault(); ask(input); };

  const clear = () => {
    setMessages([{ id: uid(), role: 'bot', text: GREETING, at: Date.now() }]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <div className="xu-root">
      <div className="xu-header">
        <button onClick={goBackSafe} className="icon-btn" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="xu-header-title">
          <Sparkles size={16} color="#2563EB" />
          <span>Xautomated Support</span>
        </div>
        <button onClick={clear} className="xu-clear" aria-label="New chat">New</button>
      </div>

      <div className="xu-list" ref={listRef}>
        {messages.map(m => (
          <div key={m.id} className={'xu-msg xu-' + m.role}>
            <div className="xu-bubble">
              {m.text}
              {m.links && m.links.length > 0 && (
                <div className="xu-links">
                  {m.links.map((l, i) => (
                    l.href
                      ? <a key={i} className="xu-link" href={l.href}>
                          {l.href.startsWith('mailto:') ? <Mail size={14} /> : <HelpCircle size={14} />}
                          {l.label}
                        </a>
                      : <Link key={i} className="xu-link" to={l.to}>
                          <HelpCircle size={14} />
                          {l.label}
                        </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="xu-msg xu-bot">
            <div className="xu-bubble xu-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="xu-chips">
          {QUICK_CHIPS.map(c => (
            <button key={c.label} className="xu-chip" onClick={() => ask(c.q)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <form className="xu-inputbar" onSubmit={onSubmit}>
        <input
          className="xu-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about XMARKET…"
          aria-label="Message"
        />
        <button type="submit" className="xu-send" disabled={!input.trim() || typing} aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
