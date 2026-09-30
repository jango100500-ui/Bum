import { useState, useEffect, useRef } from 'react';
import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';

export const App = () => {
  const [query, setQuery] = useState('');
  const [combo, setCombo] = useState<string[] | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (trimmed.length < 2) {
      setCombo(null);
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

        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data?.emojis) && data.emojis.length > 0) {
          setCombo(data.emojis);
        }
      } catch {}
    }, 550);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#f2f2f7' }}>
      <EmojiPhysics combo={combo} />
      <SearchBar value={query} onChange={setQuery} />
    </div>
  );
};
