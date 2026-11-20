export function getDeviceId() {
  try {
    let id = localStorage.getItem('xm_device_id');
    if (!id) {
      id = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'd' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('xm_device_id', id);
    }
    return id;
  } catch (e) { return 'unknown-device'; }
}
export function deviceLabel() {
  const u = navigator.userAgent || '';
  const os = /Android/i.test(u) ? 'Android' : /iPhone|iPad|iPod/i.test(u) ? 'iPhone/iPad' : /Windows/i.test(u) ? 'Windows' : /Mac OS/i.test(u) ? 'Mac' : /Linux/i.test(u) ? 'Linux' : 'Unknown OS';
  const br = /Edg\//.test(u) ? 'Edge' : /Firefox\//.test(u) ? 'Firefox' : /Chrome\//.test(u) ? 'Chrome' : /Safari\//.test(u) ? 'Safari' : 'Browser';
  return br + ' on ' + os;
}
