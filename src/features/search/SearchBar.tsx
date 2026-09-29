import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { LiquidGlass } from '../../shared/ui/LiquidGlass/LiquidGlass';

const PLACEHOLDERS = [
  'Введите название фильма…',
  'Введите название сериала…',
  'Введите название мультфильма…',
  'Введите имя актера…'
];

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const [index, setIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        setExitingIndex(prev);
        return (prev + 1) % PLACEHOLDERS.length;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (exitingIndex !== null) {
      const clearTimer = setTimeout(() => {
        setExitingIndex(null);
      }, 340);
      return () => clearTimeout(clearTimer);
    }
  }, [exitingIndex]);

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
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 540,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 10
      }}
    >
      <div
        onClick={handleContainerClick}
        style={{
          position: 'relative',
          flex: 1,
          height: '100%',
          borderRadius: 9999,
          cursor: 'text'
        }}
      >
        <LiquidGlass isPill={true} radius={26} bezel={17.0} thickness={22.0} blur={0.0} />

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
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  overflow: 'hidden'
                }}
              >
                {exitingIndex !== null && (
                  <span
                    key={`exit-${exitingIndex}`}
                    className="placeholder-exit"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      fontSize: 16,
                      color: '#8e8e93',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >
                    {PLACEHOLDERS[exitingIndex]}
                  </span>
                )}

                <span
                  key={`enter-${index}`}
                  className="placeholder-enter"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    fontSize: 16,
                    color: '#8e8e93',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {PLACEHOLDERS[index]}
                </span>
              </div>
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
                WebkitAppearance: 'none',
                position: 'relative',
                zIndex: 2
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
                flexShrink: 0,
                zIndex: 3
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

      <button
        type="button"
        className="glass-btn-press"
        style={{
          position: 'relative',
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          padding: 0,
          background: 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <LiquidGlass isPill={false} radius={26} bezel={17.0} thickness={22.0} blur={0.0} />
        <img
          src="/recently.png"
          alt=""
          width="20"
          height="20"
          style={{
            position: 'relative',
            zIndex: 1,
            width: 20,
            height: 20,
            objectFit: 'contain',
            filter: 'brightness(0)',
            opacity: 0.85,
            pointerEvents: 'none'
          }}
        />
      </button>
    </div>
  );
};
