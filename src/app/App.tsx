import { useState, useEffect, useRef } from 'react';
import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';

const DIGIT_EMOJIS: Record<string, string> = {
  '0': '0️⃣',
  '1': '1️⃣',
  '2': '2️⃣',
  '3': '3️⃣',
  '4': '4️⃣',
  '5': '5️⃣',
  '6': '6️⃣',
  '7': '7️⃣',
  '8': '8️⃣',
  '9': '9️⃣'
};

const BUG_EMOJIS = ['🪲', '🐞', '🚨'];

export const App = () => {
  const [query, setQuery] = useState('');
  const [combo, setCombo] = useState<string[] | null>(null);
  const [fromTop, setFromTop] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const triggerErrorCombo = (status: number) => {
    const randomBug = BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)];
    const digitList = status
      .toString()
      .split('')
      .map((digit) => DIGIT_EMOJIS[digit] || digit);

    setFromTop(true);
    setCombo([randomBug, ...digitList]);
  };

  useEffect(() => {
    const trimmed = query.trim();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (trimmed.length < 2) {
      setCombo(null);
      setFromTop(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/guess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmed }),
          signal: controller.signal
        });

        if (!res.ok) {
          triggerErrorCombo(res.status || 500);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data?.emojis) && data.emojis.length > 0) {
          setFromTop(false);
          setCombo(data.emojis);
        } else {
          triggerErrorCombo(404);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        triggerErrorCombo(500);
      }
    }, 550);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#f2f2f7' }}>
      <EmojiPhysics combo={combo} fromTop={fromTop} />
      <SearchBar value={query} onChange={setQuery} />
    </div>
  );
};
