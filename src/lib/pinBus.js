export const bus = { ask: null, receipt: null };
export const askPin = () => new Promise((res) => { if (!bus.ask) return res(null); bus.ask(res); });
export const showReceipt = (r) => { if (bus.receipt) bus.receipt(r); };
