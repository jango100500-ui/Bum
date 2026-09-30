import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { LiquidGlass } from '../../shared/ui/LiquidGlass/LiquidGlass';
import { TITLES } from './titles';

const getRandomIndex = (excludeIndex: number): number => {
  if (TITLES.length <= 1) return 0;
  let next = Math.floor(Math.random() * TITLES.length);
  while (next === excludeIndex) {
    next = Math.floor(Math.random() * TITLES.length);
  }
  return next;
};

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * TITLES.length));
  const [incomingIdx, setIncomingIdx] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextIdx = getRandomIndex(currentIdx);
      setIncomingIdx(nextIdx);
      setIsAnimating(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIdx]);

  useEffect(() => {
    if (incomingIdx !== null && isAnimating) {
      const finishTimer = window.setTimeout(() => {
        setCurrentIdx(incomingIdx);
        setIncomingIdx(null);
        setIsAnimating(false);
      }, 900);

      return () => clearTimeout(finishTimer);
    }
  }, [incomingIdx, isAnimating]);

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
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 22,
                overflow: 'hidden',
                pointerEvents: 'none'
              }}
            >
              {incomingIdx !== null && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 22,
                    lineHeight: '22px',
                    color: '#1c1c1e',
                    opacity: 0.55,
                    fontSize: 16,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transform: isAnimating ? 'translateY(0)' : 'translateY(-100%)',
                    transition: isAnimating
                      ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
                      : 'none'
                  }}
                >
                  {TITLES[incomingIdx]}
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 22,
                  lineHeight: '22px',
                  color: '#1c1c1e',
                  opacity: 0.55,
                  fontSize: 16,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transform:
                    incomingIdx !== null
                      ? isAnimating
                        ? 'translateY(100%)'
                        : 'translateY(0)'
                      : 'translateY(0)',
                  transition: isAnimating
                    ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'none'
                }}
              >
                {TITLES[currentIdx]}
              </div>
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
