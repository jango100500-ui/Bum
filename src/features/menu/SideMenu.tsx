import React from 'react';

interface SideMenuProps {
  progress: number;
  isDragging: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ progress, isDragging, onClose }) => {
  const isVisible = progress > 0.001;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: progress * 0.42,
          transition: isDragging ? 'none' : 'opacity 0.42s cubic-bezier(0.08, 0.82, 0.17, 1)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(300px, 76vw)',
          backgroundColor: '#121214',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '12px 0 40px rgba(0, 0, 0, 0.45)',
          transform: `translateX(${(progress - 1) * 100}%)`,
          transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.08, 0.82, 0.17, 1)',
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
