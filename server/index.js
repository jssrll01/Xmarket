import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { Blob } from 'buffer';
import { createClient } from '@supabase/supabase-js';

const app = express();

const sb = createClient(
  process.env.SUPABASE_URL || 'https://dmdjytwrgqnvxdxdlnrp.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || ''
);
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'xmarket-telegram-bot' });
});

app.post('/api/order', async (req, res) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { form, items, subtotal, discount, total, payment, delivery, orderId, xcard, payment_status } = req.body || {};

  if (!form || !items) {
    return res.status(400).json({ error: 'Missing order data' });
  }

  const lines = [];
  lines.push('🛒 *NEW ORDER — XMARKET*');
  lines.push('');
  lines.push('🆔 *Order ID:* ' + (orderId || '-'));
  lines.push('');
  lines.push('👤 *Customer*');
  lines.push(`Name: ${form.fullName || '-'}`);
  lines.push(`Mobile: ${form.mobile || '-'}`);
  lines.push(`Email: ${form.email || '-'}`);
  lines.push(`Address: ${form.address || '-'}`);
  lines.push(`Landmark: ${form.landmark || '-'}`);
  lines.push(`Province: ${form.province || '-'}`);
  lines.push(`City/Municipality: ${form.city || '-'}`);
  lines.push(`Barangay: ${form.barangay || '-'}`);
  lines.push(`Instructions: ${form.instructions || '-'}`);
  if (form.note) lines.push(`Note: ${form.note}`);
  lines.push('');
  lines.push('📦 *Items*');
  items.forEach(i => {
    const v = i.variant ? ` [${i.variant}]` : '';
    lines.push(`• ${i.name}${v} × ${i.quantity} — ₱${i.price * i.quantity}`);
  });
  lines.push('');
  lines.push('💰 *Summary*');
  lines.push(`Subtotal: ₱${subtotal}`);
  lines.push(`Discount: -₱${discount}`);
  lines.push(`Total: ₱${total}`);
  lines.push('');
  lines.push('💳 *Payment*');
  lines.push(payment || '-');
  lines.push('');
  lines.push('🚚 *Delivery*');
  lines.push(delivery || '-');

  const text = lines.join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });
    const data = await tgRes.json();
    if (!data.ok) return res.status(500).json({ error: data.description });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/receipt', async (req, res) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { orderId, name, dataUrl } = req.body || {};
  if (!dataUrl) return res.status(400).json({ error: 'Missing receipt data' });

  try {
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('caption', 'Payment receipt for Order ' + (orderId || 'N/A'));
    form.append('photo', new Blob([buffer]), name || 'receipt.jpg');

    const tgRes = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendPhoto', {
      method: 'POST',
      body: form
    });
    const data = await tgRes.json();
    if (!data.ok) return res.status(500).json({ error: data.description });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
// ============================================================
// Report forwarding — 5 dedicated Telegram bots
// ============================================================
const REPORT_BOTS = {
  bug:      { token: process.env.BOT_TOKEN_BUG,      chat: process.env.CHAT_ID_BUG },
  order:    { token: process.env.BOT_TOKEN_ORDER,    chat: process.env.CHAT_ID_ORDER },
  shop:     { token: process.env.BOT_TOKEN_SHOP,     chat: process.env.CHAT_ID_SHOP },
  content:  { token: process.env.BOT_TOKEN_CONTENT,  chat: process.env.CHAT_ID_CONTENT },
  security: { token: process.env.BOT_TOKEN_SECURITY, chat: process.env.CHAT_ID_SECURITY },
};

const REPORT_LABELS = {
  bug: '🪲 Bug & Technical',
  order: '📦 Order & Product',
  shop: '🏪 Shop / Seller',
  content: '📝 Content & Review',
  security: '🔒 Account Security',
};

app.post('/api/report/:category', async (req, res) => {
  const { category } = req.params;
  const bot = REPORT_BOTS[category];

  if (!bot || !bot.token || !bot.chat) {
    return res.status(400).json({ error: 'Unknown category or missing env vars' });
  }

  const { ticket_id, user_id, gmail, phone, concern, related_id, created_at } = req.body || {};

  if (!concern) {
    return res.status(400).json({ error: 'Missing concern' });
  }

  // Log to Supabase so xadmin can display it
  try {
    await logBotMessage(category, user_id, gmail, concern, {
      ticket_id, gmail, phone, related_id,
    });
  } catch (e) {}

  const lines = [
    `*${REPORT_LABELS[category] || category.toUpperCase()} REPORT*`,
    '',
    'Ticket: `' + ticket_id + '`',
    'User: `' + user_id + '`',
    `Gmail: ${gmail || '-'}`,
    `Phone: ${phone || '-'}`,
    related_id ? `Related: ${related_id}` : null,
    `Time: ${created_at || new Date().toISOString()}`,
    '',
    '*Concern:*',
    concern,
  ].filter(Boolean).join('\n');

  try {
    const r = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: bot.chat,
        text: lines,
        parse_mode: 'Markdown',
      }),
    });
    const data = await r.json();
    res.json({ ok: data.ok, forwarded: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Admin: send test message to a specific bot
// ============================================================
app.post('/api/admin/bot-test/:bot', async (req, res) => {
  const { bot } = req.params;
  const { text } = req.body || {};
  const TOKEN = process.env[`BOT_TOKEN_${bot.toUpperCase()}`];
  const CHAT = process.env[`CHAT_ID_${bot.toUpperCase()}`];
  if (!TOKEN || !CHAT) return res.status(400).json({ error: 'Bot not configured' });
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, text: `[TEST] ${text}`, parse_mode: 'Markdown' }),
    });
    const data = await r.json();
    // Log the outbound message
    try { await sb.from('bot_messages').insert({
      bot, direction: 'out', from_id: 'admin', from_name: 'Admin', text: `[TEST] ${text}`,
    }); } catch (e) {}
    res.json({ ok: data.ok, forwarded: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: log incoming report to bot_messages (used by /api/report)
async function logBotMessage(bot, from_id, from_name, text, raw) {
  try {
    await sb.from('bot_messages').insert({ bot, direction: 'in', from_id, from_name, text, raw });
  } catch (e) { console.error('logBotMessage failed:', e.message); }
}

app.listen(PORT, () => {
  console.log('Xmarket Telegram bot listening on port ' + PORT);
});
