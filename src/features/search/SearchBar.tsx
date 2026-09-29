import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { LiquidGlass } from '../../shared/ui/LiquidGlass/LiquidGlass';

const PLACEHOLDERS: string[] = [
  'Введи название фильма…',
  'Введи название сериала…',
  'Введи мультфильм…',
  'Введи книгу…',
  'Введи аниме…'
];

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPrevIdx(currentIdx);
      setCurrentIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [currentIdx]);

  useEffect(() => {
    if (prevIdx !== null) {
      const clearTimer = window.setTimeout(() => {
        setPrevIdx(null);
      }, 1100);
      return () => clearTimeout(clearTimer);
    }
  }, [prevIdx]);

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
        cursor: 'text',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)'
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
            opacity: 0.85,
            filter: 'brightness(0)',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            position: 'relative',
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          {value.length === 0 && (
            <>
              {prevIdx !== null && (
                <span
                  key={`prev-${prevIdx}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    color: '#1c1c1e',
                    fontSize: 16,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    pointerEvents: 'none',
                    animation: 'placeholderSlideOutBottom 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  }}
                >
                  {PLACEHOLDERS[prevIdx]}
                </span>
              )}

              <span
                key={`curr-${currentIdx}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  color: '#1c1c1e',
                  fontSize: 16,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  pointerEvents: 'none',
                  animation:
                    prevIdx !== null
                      ? 'placeholderSlideInTop 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                      : 'none',
                  opacity: prevIdx !== null ? undefined : 0.55
                }}
              >
                {PLACEHOLDERS[currentIdx]}
              </span>
            </>
          )}

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: '#1c1c1e',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              WebkitAppearance: 'none'
            }}
          />
        </div>

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
              backgroundColor: '#1c1c1e1f',
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
              stroke="#1c1c1e"
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
