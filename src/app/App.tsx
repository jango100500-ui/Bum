import { useState, useRef, useEffect } from 'react';
import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';
import { SideMenu } from '../features/menu/SideMenu';

export const App = () => {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isGestureActiveRef = useRef(false);
  const initialProgressRef = useRef(0);

  const getMenuWidth = () => Math.min(300, window.innerWidth * 0.76);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      startXRef.current = touchX;
      startYRef.current = touchY;

      if (progress > 0.05 || touchX < 50) {
        isGestureActiveRef.current = true;
        initialProgressRef.current = progress;
        setIsDragging(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGestureActiveRef.current) return;

      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = Math.abs(e.touches[0].clientY - startYRef.current);

      if (deltaY > Math.abs(deltaX) && Math.abs(deltaX) < 10) {
        isGestureActiveRef.current = false;
        setIsDragging(false);
        return;
      }

      const menuWidth = getMenuWidth();
      const newProgress = Math.max(0, Math.min(1, initialProgressRef.current + deltaX / menuWidth));
      setProgress(newProgress);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isGestureActiveRef.current) return;
      isGestureActiveRef.current = false;
      setIsDragging(false);

      const deltaX = e.changedTouches[0].clientX - startXRef.current;

      if (initialProgressRef.current < 0.5) {
        if (deltaX > 60 || progress > 0.3) {
          setProgress(1);
        } else {
          setProgress(0);
        }
      } else {
        if (deltaX < -50 || progress < 0.7) {
          setProgress(0);
        } else {
          setProgress(1);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [progress]);

  const menuWidth = getMenuWidth();
  const screenShiftX = progress * (menuWidth * 0.72);
  const screenScale = 1 - progress * 0.06;
  const screenRadius = progress * 24;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#0c0c0e' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${screenShiftX}px) scale(${screenScale})`,
          borderRadius: screenRadius,
          overflow: 'hidden',
          boxShadow: progress > 0 ? '0 10px 40px rgba(0, 0, 0, 0.4)' : 'none',
          transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.08, 0.82, 0.17, 1), border-radius 0.42s cubic-bezier(0.08, 0.82, 0.17, 1)',
          transformOrigin: 'left center',
          backgroundColor: '#f2f2f7'
        }}
      >
        <EmojiPhysics />
        <SearchBar onOpenMenu={() => setProgress(1)} />
      </div>

      <SideMenu
        progress={progress}
        isDragging={isDragging}
        onClose={() => setProgress(0)}
      />
    </div>
  );
};
