import React, { useEffect, useRef, useState } from 'react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [currentTranslateX, setCurrentTranslateX] = useState<number>(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentTranslateX(0);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.touches[0].clientX - touchStartX;
    if (diff < 0) {
      setCurrentTranslateX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslateX < -70) {
      onClose();
    }
    setTouchStartX(null);
    setCurrentTranslateX(0);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: isOpen ? 'auto' : 'none',
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'visibility 0.35s'
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: isOpen ? (currentTranslateX < 0 ? Math.max(0, 0.45 * (1 + currentTranslateX / 280)) : 0.45) : 0,
          backdropFilter: isOpen ? 'blur(6px)' : 'none',
          WebkitBackdropFilter: isOpen ? 'blur(6px)' : 'none',
          transition: touchStartX !== null ? 'none' : 'opacity 0.35s ease'
        }}
      />

      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(310px, 82vw)',
          backgroundColor: '#121214',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 35px rgba(0, 0, 0, 0.35)',
          transform: isOpen
            ? `translateX(${currentTranslateX}px)`
            : 'translateX(-100%)',
          transition: touchStartX !== null ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
          paddingLeft: 22,
          paddingRight: 22
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 36
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: -0.4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}
          >
            Bum
          </span>

          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#242426',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8e8e93',
            fontSize: 15,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            letterSpacing: -0.2
          }}
        >
          Тут пусто
        </div>
      </div>
    </div>
  );
};
