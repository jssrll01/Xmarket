const API = 'https://xmarket-telegram-bot.onrender.com';

async function post(path, body) {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export const notifyTopup = (p) => post('/api/wallet/topup', p);
export const notifySendMoney = (p) => post('/api/wallet/send', p);
export const notifyBuyLoad = (p) => post('/api/wallet/buyload', p);
