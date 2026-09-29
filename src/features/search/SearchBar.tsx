import { useState, useRef, ChangeEvent } from 'react';
import { LiquidGlass } from '../../shared/ui/LiquidGlass/LiquidGlass';

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleContainerClick}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 540,
        height: 52,
        borderRadius: 9999,
        zIndex: 10,
        cursor: 'text'
      }}
    >
      <LiquidGlass isPill={true} radius={26} blur={0.0} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '0 18px',
          gap: 12
        }}
      >
        <img
          src="/search.png"
          alt=""
          width="18"
          height="18"
          style={{
            width: 18,
            height: 18,
            objectFit: 'contain',
            flexShrink: 0,
            opacity: 0.55,
            pointerEvents: 'none'
          }}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Введи название фильма, сериала или мультфильма…"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 16,
            color: '#1c1c1e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            WebkitAppearance: 'none',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#8e8e9380',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
