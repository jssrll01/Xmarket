import { useEffect, useRef, useState } from 'react';

export default function usePullToRefresh(onRefresh, { threshold = 70 } = {}) {
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);
  const startY = useRef(null);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (window.scrollY > 4) return;
      startY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && window.scrollY === 0) {
        setPulling(true);
        setDistance(Math.min(dy * 0.5, threshold + 20));
      }
    };
    const onTouchEnd = async () => {
      if (pulling && distance >= threshold) {
        await onRefresh?.();
      }
      setPulling(false);
      setDistance(0);
      startY.current = null;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [pulling, distance, threshold, onRefresh]);

  return { pulling, distance };
}
