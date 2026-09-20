import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
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

  const { form, items, subtotal, discount, total, payment, delivery } = req.body || {};

  if (!form || !items) {
    return res.status(400).json({ error: 'Missing order data' });
  }

  const lines = [];
  lines.push('🛒 *NEW ORDER — XMARKET*');
  lines.push('');
  lines.push('👤 *Customer*');
  lines.push(`Name: ${form.fullName || '-'}`);
  lines.push(`Mobile: ${form.mobile || '-'}`);
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
    lines.push(`• ${i.name} × ${i.quantity} — ₱${i.price * i.quantity}`);
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Xmarket Telegram bot listening on port ' + PORT);
});
