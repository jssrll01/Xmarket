import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const KEY = 'xmarket:scroll';
const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const write = (m) => { try { sessionStorage.setItem(KEY, JSON.stringify(m)); } catch {} };

export default function useScrollTop() {
  const { pathname, key } = useLocation();
  const type = useNavigationType();
  const prevPath = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  // remember scroll position for this history entry
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const m = read();
        m[key] = window.scrollY;
        write(m);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [key]);

  // restore on Back/Forward, top on new pages
  useEffect(() => {
    const changed = prevPath.current !== pathname;
    prevPath.current = pathname;
    if (type === 'POP' && pathname === '/') return; if (type === 'POP') {
      const y = read()[key];
      if (y > 0) {
        let tries = 0, timer;
        const tick = () => {
          window.scrollTo({ top: y, behavior: 'instant' });
          if (Math.abs(window.scrollY - y) > 2 && tries++ < 30) timer = setTimeout(tick, 50);
        };
        tick();
        return () => clearTimeout(timer);
      }
      return;
    }
    if (changed) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, key, type]);
}
