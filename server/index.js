import express from 'express';
import crypto from 'node:crypto';
import cors from 'cors';
import fetch from 'node-fetch';
import { Blob } from 'buffer';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

import { sendPushToUser } from './fcm.js';
const app = express();

const sb = createClient(
  process.env.SUPABASE_URL || 'https://dmdjytkuwfudkqepkxkl.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Existing order bot
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// Xwallet bots (new)
const WALLET_TOPUP_BOT   = process.env.BOT_TOKEN_TOPUP    || '8875698436:AAFaPLtpsraRYH5j-zfi728U02_-U9dNH5A';
const WALLET_SEND_BOT    = process.env.BOT_TOKEN_SEND     || '8762059416:AAEkWqtDDH1XZWtC4N-FCoSKYMjGSQB6rcE';
const WALLET_LOAD_BOT    = process.env.BOT_TOKEN_LOAD     || '8740980945:AAEx0cQDX_o5DQh0gDYe0JeznwsyX0mRi3Q';

// Admin chat where wallet bot alerts go (falls back to main CHAT_ID)
const WALLET_ADMIN_CHAT  = process.env.WALLET_ADMIN_CHAT_ID || CHAT_ID;

/* ============================================================
   HELPERS
   ============================================================ */
async function tgSend(botToken, chatId, text, extra = {}) {
  if (!botToken || !chatId) return { ok: false, error: 'not configured' };
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        ...extra,
      }),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function logBotMessage(bot, direction, from_id, from_name, text, raw) {
  try {
    await sb.from('bot_messages').insert({
      bot, direction, from_id: String(from_id || ''), from_name, text,
      raw: raw || null,
    });
  } catch (e) {
    console.error('logBotMessage failed:', e.message);
  }
}

async function getOrCreateTopup(userId, amount, channel) {
  // Insert a pending topup row that XADMIN can approve
  const { data, error } = await sb.from('xwallet_topups').insert({
    user_id: userId,
    amount: Number(amount),
    status: 'processing',
    channel,
    source: 'telegram_bot',
  }).select().single();
  return { data, error };
}

/* ============================================================
   ROOT
   ============================================================ */
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'xmarket-telegram-bot',
    bots: {
      order:      !!BOT_TOKEN,
      topup:      !!WALLET_TOPUP_BOT,
      send:       !!WALLET_SEND_BOT,
      buyload:    !!WALLET_LOAD_BOT,
    },
  });
});

/* ============================================================
   ORDER NOTIFICATION (existing)
   ============================================================ */
app.post('/api/order', async (req, res) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { form, items, subtotal, discount, total, payment, delivery, orderId, xcard, payment_status } = req.body || {};
  if (!form || !items) return res.status(400).json({ error: 'Missing order data' });

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

  const data = await tgSend(BOT_TOKEN, CHAT_ID, lines.join('\n'));
  res.json({ ok: data.ok, forwarded: !!data.ok });
});



// Authenticated receipt upload: Cloudinary + existing Supabase order.
app.post('/api/receipt', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Sign in required' });

    const supabaseUrl = process.env.RECEIPT_SUPABASE_URL
      || 'https://dmdjytkuwfudkqepkxkl.supabase.co';
    const serviceKey = process.env.RECEIPT_SUPABASE_SERVICE_KEY;
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!serviceKey || !cloud || !apiKey || !apiSecret) {
      return res.status(503).json({ error: 'Receipt service is not configured' });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { orderId, dataUrl } = req.body || {};
    if (typeof orderId !== 'string' || !/^XM-[A-Za-z0-9-]+$/.test(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    if (typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Receipt image is required' });
    }

    const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return res.status(400).json({ error: 'Use a JPG, PNG, or WebP image' });

    const mime = match[1];
    const base64 = match[2];
    const image = Buffer.from(base64, 'base64');
    if (!image.length || image.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Receipt image must be 5 MB or smaller' });
    }

    const { data: order, error: orderError } = await admin
      .from('orders')
      .select('id, order_code, buyer_id')
      .eq('order_code', orderId)
      .eq('buyer_id', userData.user.id)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ error: 'Order not found for this account' });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = 'xmarket/receipts';
    const publicId = `receipt-${order.id}-${timestamp}`;
    const signed = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha1')
      .update(signed + apiSecret)
      .digest('hex');

    const uploadBody = new URLSearchParams({
      file: `data:${mime};base64,${base64}`,
      api_key: apiKey,
      timestamp,
      folder,
      public_id: publicId,
      signature
    });

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: uploadBody.toString()
      }
    );

    const uploaded = await uploadResponse.json();
    if (!uploadResponse.ok || !uploaded.secure_url || !uploaded.public_id) {
      console.error('[receipt] Cloudinary upload failed:', uploaded.error?.message || uploadResponse.status);
      return res.status(502).json({ error: 'Receipt image upload failed' });
    }

    const { error: updateError } = await admin
      .from('orders')
      .update({
        receipt_url: uploaded.secure_url,
        receipt_public_id: uploaded.public_id,
        receipt_uploaded_at: new Date().toISOString()
      })
      .eq('id', order.id)
      .eq('buyer_id', userData.user.id);

    if (updateError) throw updateError;

    return res.json({ ok: true, receipt_url: uploaded.secure_url });
  } catch (error) {
    console.error('[receipt] Endpoint error:', error.message || error);
    return res.status(500).json({ error: 'Unable to save receipt' });
  }
});

/* ============================================================
   XWALLET BOT ENDPOINTS
   Frontend calls these to notify the user + admin.
   ============================================================ */

// TOP-UP initiated
app.post('/api/wallet/topup', async (req, res) => {
  const { userId, amount, channel, userChatId } = req.body || {};
  if (!userId || !amount) return res.status(400).json({ error: 'Missing userId or amount' });

  const { data: topup, error } = await getOrCreateTopup(userId, amount, channel || 'gcash');
  if (error) return res.status(500).json({ error: error.message });

  // Notify admin
  const adminMsg =
    `💵 *NEW TOP-UP REQUEST*\n\n` +
    `👤 User: \`${String(userId).slice(0, 8)}\`\n` +
    `💰 Amount: ₱${amount}\n` +
    `📱 Channel: ${channel || 'gcash'}\n` +
    `🆔 Ref: \`${String(topup.id).slice(0, 8)}\`\n\n` +
    `Approve or reject in XADMIN → Top-ups`;

  await tgSend(WALLET_TOPUP_BOT, WALLET_ADMIN_CHAT, adminMsg);

  // Notify user (if they opened the bot with /start)
  if (userChatId) {
    await tgSend(WALLET_TOPUP_BOT, userChatId,
      `✅ Your top-up request for *₱${amount}* has been received.\n` +
      `Reference: \`${String(topup.id).slice(0, 8)}\`\n` +
      `We'll notify you once it's approved.`);
  }

  await logBotMessage('topup', 'in', userId, 'user', `Top-up ₱${amount} via ${channel}`, topup);
  res.json({ ok: true, topup });
});

// SEND MONEY initiated
app.post('/api/wallet/send', async (req, res) => {
  const { fromUserId, toUserId, toUsername, amount, note, userChatId } = req.body || {};
  if (!fromUserId || !amount) return res.status(400).json({ error: 'Missing fromUserId or amount' });

  // Fetch balances
  const { data: sender } = await sb.from('profiles')
    .select('id, first_name, last_name, username, xwallet_balance')
    .eq('id', fromUserId).single();

  if (!sender) return res.status(404).json({ error: 'Sender not found' });
  if (Number(sender.xwallet_balance || 0) < Number(amount)) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Find recipient
  let recipient = null;
  if (toUserId) {
    const { data } = await sb.from('profiles').select('id, first_name, last_name, username, xwallet_balance').eq('id', toUserId).single();
    recipient = data;
  } else if (toUsername) {
    const { data } = await sb.from('profiles').select('id, first_name, last_name, username, xwallet_balance')
      .ilike('username', toUsername.trim()).maybeSingle();
    recipient = data;
  }

  if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
  if (recipient.id === sender.id) return res.status(400).json({ error: 'Cannot send to yourself' });

  // Atomic balance moves (via RPC or two updates)
  const senderNew = Number(sender.xwallet_balance) - Number(amount);
  const recipNew  = Number(recipient.xwallet_balance || 0) + Number(amount);

  await sb.from('profiles').update({ xwallet_balance: senderNew }).eq('id', sender.id);
  await sb.from('profiles').update({ xwallet_balance: recipNew }).eq('id', recipient.id);

  await sb.from('xwallet_txns').insert([
    { user_id: sender.id,    amount: -Number(amount), type: 'send',    note: note || `Sent to @${recipient.username || recipient.id.slice(0,8)}` },
    { user_id: recipient.id, amount:  Number(amount), type: 'receive', note: note || `Received from @${sender.username || sender.id.slice(0,8)}` },
  ]);

  // Notify both
  const amountStr = `₱${Number(amount).toLocaleString()}`;
  if (userChatId) {
    await tgSend(WALLET_SEND_BOT, userChatId,
      `✅ *Sent ${amountStr}*\nTo: @${recipient.username || recipient.first_name || recipient.id.slice(0,8)}\nNew balance: ₱${senderNew.toFixed(2)}`);
  }
  if (recipient.telegram_chat_id) {
    await tgSend(WALLET_SEND_BOT, recipient.telegram_chat_id,
      `💰 *You received ${amountStr}*\nFrom: @${sender.username || sender.first_name || sender.id.slice(0,8)}\nNew balance: ₱${recipNew.toFixed(2)}`);
  }

  await logBotMessage('send', 'in', sender.id, sender.username || 'sender',
    `${amountStr} → ${recipient.username || recipient.id.slice(0,8)}`, { sender, recipient, amount });

  res.json({ ok: true, newBalance: senderNew });
});

// BUY LOAD initiated
app.post('/api/wallet/buyload', async (req, res) => {
  const { userId, network, mobile, amount, userChatId } = req.body || {};
  if (!userId || !mobile || !amount) return res.status(400).json({ error: 'Missing fields' });

  const { data: profile } = await sb.from('profiles')
    .select('id, first_name, username, xwallet_balance').eq('id', userId).single();

  if (!profile) return res.status(404).json({ error: 'User not found' });
  if (Number(profile.xwallet_balance || 0) < Number(amount)) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Deduct balance
  const newBal = Number(profile.xwallet_balance) - Number(amount);
  await sb.from('profiles').update({ xwallet_balance: newBal }).eq('id', userId);

  await sb.from('xwallet_txns').insert({
    user_id: userId, amount: -Number(amount), type: 'buyload',
    note: `${network || 'Load'} ${mobile}`,
  });

  // Notify admin
  const amountStr = `₱${Number(amount).toLocaleString()}`;
  await tgSend(WALLET_LOAD_BOT, WALLET_ADMIN_CHAT,
    `📱 *NEW LOAD ORDER*\n\n` +
    `👤 User: @${profile.username || profile.id.slice(0, 8)}\n` +
    `📶 Network: ${network || '-'}\n` +
    `📞 Mobile: ${mobile}\n` +
    `💰 Amount: ${amountStr}\n\n` +
    `Please process this load request.`);

  if (userChatId) {
    await tgSend(WALLET_LOAD_BOT, userChatId,
      `✅ *Load order received*\n${network || 'Load'} ${mobile}\nAmount: ${amountStr}\nNew balance: ₱${newBal.toFixed(2)}`);
  }

  await logBotMessage('buyload', 'in', userId, profile.username || 'user',
    `${network || 'Load'} ${mobile} ${amountStr}`, { network, mobile, amount });

  res.json({ ok: true, newBalance: newBal });
});

/* ============================================================
   ADMIN: send test message to any bot
   ============================================================ */
app.post('/api/admin/bot-test/:bot', async (req, res) => {
  const { bot } = req.params;
  const { text, chatId } = req.body || {};

  const tokenMap = {
    order:   BOT_TOKEN,
    topup:   WALLET_TOPUP_BOT,
    send:    WALLET_SEND_BOT,
    buyload: WALLET_LOAD_BOT,
  };
  const token = tokenMap[bot];
  const target = chatId || WALLET_ADMIN_CHAT;

  if (!token) return res.status(400).json({ error: 'Bot not configured' });
  if (!target) return res.status(400).json({ error: 'Missing chatId' });
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const data = await tgSend(token, target, `[TEST] ${text}`);
  await logBotMessage(bot, 'out', 'admin', 'Admin', `[TEST] ${text}`, data);
  res.json({ ok: data.ok, forwarded: !!data.ok });
});

/* ============================================================
   START
   ============================================================ */
const PORT = process.env.PORT || 3000;

/* ============================================================
   PUSH TEST ENDPOINT
   ============================================================ */
app.post('/api/push/test', async (req, res) => {
  const { userId, title, body, url } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const result = await sendPushToUser(sb, userId, {
    title: title || 'XMARKET test',
    body: body || 'Push notification test',
    url: url || '/',
    tag: 'test',
  });
  res.json(result);
});


/* ============================================================
   PUSH — arbitrary user + admins
   ============================================================ */
app.post('/api/push/user', async (req, res) => {
  const { userId, title, body, url, tag } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const result = await sendPushToUser(sb, userId, {
    title: title || 'XMARKET',
    body: body || '',
    url: url || '/',
    tag: tag || 'default',
  });
  res.json(result);
});

app.post('/api/push/admins', async (req, res) => {
  const { title, body, url, tag } = req.body || {};
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(x => x.trim()).filter(Boolean);
  if (!adminIds.length) return res.json({ ok: true, sent: 0, note: 'no ADMIN_USER_IDS configured' });
  let sent = 0, failed = 0;
  for (const uid of adminIds) {
    const r = await sendPushToUser(sb, uid, { title: title || 'XMARKET', body: body || '', url: url || '/', tag: tag || 'admin' });
    sent += r.sent || 0;
    failed += r.failed || 0;
  }
  res.json({ ok: true, sent, failed });
});


// XMARKET_CLOUDINARY_RECEIPT_ROUTE
app.post('/api/receipt', async (req, res) => {
  try {
    // XMARKET_RECEIPT_OWNER_CHECK
    const { orderId, buyerId, dataUrl } = req.body || {};
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!cloudName || !apiKey || !apiSecret || !serviceKey) {
      return res.status(503).json({ error: 'Receipt service is not configured.' });
    }
    if (typeof orderId !== 'string' ||
        !/^XM-[A-Za-z0-9-]{4,40}$/i.test(orderId)) {
      return res.status(400).json({ error: 'Invalid order code.' });
    }

    if (typeof buyerId !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(buyerId)) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (typeof dataUrl !== 'string' ||
        !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$/i.test(dataUrl) ||
        dataUrl.length > 11 * 1024 * 1024) {
      return res.status(400).json({ error: 'Upload a JPG, PNG, or WebP image under 8 MB.' });
    }

    // Use the server-side service role key for this privileged database update.
    const { createClient } = await import('@supabase/supabase-js');
    const adminSb = createClient(
      process.env.SUPABASE_URL || 'https://dmdjytkuwfudkqepkxkl.supabase.co',
      serviceKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: order, error: lookupError } = await adminSb
      .from('orders')
      .select('id, buyer_id, receipt_url')
      .eq('order_code', orderId)
      .eq('buyer_id', buyerId)
      .maybeSingle();

    if (lookupError) {
      console.error('[receipt] Order lookup failed:', lookupError.message);
      return res.status(500).json({ error: 'Could not verify the order.' });
    }
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.receipt_url) {
      return res.status(409).json({ error: 'A receipt has already been uploaded for this order.' });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = 'Xmarket/OrderReceipts';
    const publicId = 'receipt_' + crypto.randomUUID();
    const signParams = { folder, public_id: publicId, timestamp };
    const signText = Object.keys(signParams).sort()
      .map(k => `${k}=${signParams[k]}`).join('&') + apiSecret;
    const signature = crypto.createHash('sha1').update(signText).digest('hex');

    const form = new FormData();
    form.append('file', dataUrl);
    form.append('api_key', apiKey);
    form.append('timestamp', timestamp);
    form.append('folder', folder);
    form.append('public_id', publicId);
    form.append('signature', signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: 'POST', body: form }
    );
    const uploaded = await uploadResponse.json();
    if (!uploadResponse.ok || !uploaded.secure_url) {
      console.error('[receipt] Cloudinary upload failed:', uploaded.error?.message || 'Unknown error');
      return res.status(502).json({ error: 'Cloudinary could not upload the receipt.' });
    }

    const { data: updated, error: updateError } = await adminSb
      .from('orders')
      .update({
        receipt_url: uploaded.secure_url,
        receipt_public_id: uploaded.public_id,
        receipt_uploaded_at: new Date().toISOString()
      })
      .eq('order_code', orderId)
      .eq('buyer_id', buyerId)
      .is('receipt_url', null)
      .select('id')
      .maybeSingle();

    if (updateError || !updated) {
      console.error('[receipt] Database update failed:', updateError?.message || 'Receipt already exists');
      return res.status(409).json({ error: 'Receipt uploaded but could not be attached to the order. Contact support.' });
    }

    return res.json({ ok: true, receipt_url: uploaded.secure_url });
  } catch (err) {
    console.error('[receipt] Endpoint failed:', err.message);
    return res.status(500).json({ error: 'Receipt upload failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ xmarket-telegram-bot listening on ${PORT}`);
  console.log(`   order bot:      ${BOT_TOKEN ? 'configured' : 'MISSING'}`);
  console.log(`   topup bot:      ${WALLET_TOPUP_BOT ? 'configured' : 'MISSING'}`);
  console.log(`   send bot:       ${WALLET_SEND_BOT ? 'configured' : 'MISSING'}`);
  console.log(`   buyload bot:    ${WALLET_LOAD_BOT ? 'configured' : 'MISSING'}`);
});
