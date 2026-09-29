import { useState, useEffect } from 'react';
import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';
import { SideMenu } from '../features/menu/SideMenu';

export const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);

      if (startX < 45 && deltaX > 50 && deltaY < 80) {
        setIsMenuOpen(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <EmojiPhysics />
      <SearchBar onOpenMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};
