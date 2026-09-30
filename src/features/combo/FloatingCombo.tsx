import React from 'react';

interface FloatingComboProps {
  combo: string[] | null;
}

export const FloatingCombo: React.FC<FloatingComboProps> = ({ combo }) => {
  if (!combo || combo.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        pointerEvents: 'none',
        zIndex: 5,
        maxWidth: '90vw'
      }}
    >
      {combo.map((emoji, index) => (
        <div
          key={`${emoji}-${index}`}
          style={{
            animation: `emojiIdleBob 3.5s ease-in-out infinite ${index * 0.2}s`
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 44,
              lineHeight: 1,
              fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif',
              animation: `emojiFlyUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards`,
              animationDelay: `${index * 0.08}s`,
              opacity: 0,
              filter: 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.1))'
            }}
          >
            {emoji}
          </span>
        </div>
      ))}
    </div>
  );
};
