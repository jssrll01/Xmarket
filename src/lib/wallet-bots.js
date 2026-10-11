const API = 'https://xmarket-telegram-bot.onrender.com';

export async function notifyTopup({ userId, amount, channel, userChatId }) {
  try {
    const res = await fetch(`${API}/api/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, channel, userChatId }),
    });
    return await res.json();
  } catch (e) { return { ok: false, error: e.message }; }
}

export async function notifySendMoney({ fromUserId, toUserId, toUsername, amount, note, userChatId }) {
  try {
    const res = await fetch(`${API}/api/wallet/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId, toUserId, toUsername, amount, note, userChatId }),
    });
    return await res.json();
  } catch (e) { return { ok: false, error: e.message }; }
}

export async function notifyBuyLoad({ userId, network, mobile, amount, userChatId }) {
  try {
    const res = await fetch(`${API}/api/wallet/buyload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, network, mobile, amount, userChatId }),
    });
    return await res.json();
  } catch (e) { return { ok: false, error: e.message }; }
}
