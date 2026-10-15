import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Mail, HelpCircle, Trash2 } from 'lucide-react';
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

function freshGreeting() {
  return { id: uid(), role: 'bot', text: GREETING, at: Date.now() };
}

export default function Xupport() {
  const nav = useNavigate();
  const listRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = loadHistory();
    if (saved && saved.length) return saved;
    return [freshGreeting()];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  // Persist during the session
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch {}
  }, [messages]);

  // AUTO-CLEAR: wipe storage when the user leaves the page.
  // Handles: React Router unmount, tab close, browser back, and reload.
  useEffect(() => {
    const wipe = () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    };

    // Clear immediately on mount so the previous session never shows up
    try { localStorage.removeItem(STORAGE_KEY); } catch {}

    // Clear on unmount (React Router navigation away)
    // Clear on pagehide (tab close / bfcache)
    // Clear on beforeunload (hard reload / browser nav)
    window.addEventListener('pagehide', wipe);
    window.addEventListener('beforeunload', wipe);

    return () => {
      wipe();
      window.removeEventListener('pagehide', wipe);
      window.removeEventListener('beforeunload', wipe);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
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
    }, 320);
  };

  const onSubmit = (e) => { e.preventDefault(); ask(input); };

  const clear = () => {
    setMessages([freshGreeting()]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <div className="xu-root">
      {/* Header */}
      <div className="xu-header">
        <button onClick={goBackSafe} className="xu-icon-btn" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="xu-header-title">
          <div className="xu-avatar">
            <Sparkles size={15} color="#fff" />
          </div>
          <div>
            <div className="xu-name">Xautomated Support</div>
            <div className="xu-status">
              <span className="xu-dot" /> Online
            </div>
          </div>
        </div>
        <button onClick={clear} className="xu-icon-btn" aria-label="Clear chat">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="xu-list" ref={listRef}>
        {messages.map((m, i) => (
          <div key={m.id} className={'xu-row xu-' + m.role}>
            {m.role === 'bot' && (
              <div className="xu-bot-avatar">
                <Sparkles size={13} color="#fff" />
              </div>
            )}
            <div className={'xu-bubble xu-' + m.role + '-bubble'}>
              <div className="xu-text">{m.text}</div>
              {m.links && m.links.length > 0 && (
                <div className="xu-links">
                  {m.links.map((l, k) =>
                    l.href ? (
                      <a key={k} className="xu-link" href={l.href}>
                        {l.href.startsWith('mailto:') ? <Mail size={13} /> : <HelpCircle size={13} />}
                        {l.label}
                      </a>
                    ) : (
                      <Link key={k} className="xu-link" to={l.to}>
                        <HelpCircle size={13} />
                        {l.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="xu-row xu-bot">
            <div className="xu-bot-avatar">
              <Sparkles size={13} color="#fff" />
            </div>
            <div className="xu-bubble xu-bot-bubble xu-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {/* Quick chips — only show on first screen */}
      {messages.length <= 1 && (
        <div className="xu-chips">
          {QUICK_CHIPS.map(c => (
            <button key={c.label} className="xu-chip" onClick={() => ask(c.q)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form className="xu-inputbar" onSubmit={onSubmit}>
        <input
          className="xu-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about XMARKET…"
          aria-label="Message"
        />
        <button type="submit" className="xu-send" disabled={!input.trim() || typing} aria-label="Send">
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
