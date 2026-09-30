import { useState, useEffect } from 'react';
import { EmojiPhysics, ALL_EMOJIS } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';
import { FloatingCombo } from '../features/combo/FloatingCombo';

export const App = () => {
  const [query, setQuery] = useState('');
  const [combo, setCombo] = useState<string[] | null>(null);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();

    if (trimmed !== 'тест' && trimmed !== 'test') {
      setCombo(null);
      return;
    }

    const timer = window.setTimeout(() => {
      const count = Math.floor(Math.random() * 4) + 3;
      const shuffled = [...ALL_EMOJIS].sort(() => Math.random() - 0.5);
      setCombo(shuffled.slice(0, count));
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#f2f2f7' }}>
      <EmojiPhysics />
      <FloatingCombo combo={combo} />
      <SearchBar value={query} onChange={setQuery} />
    </div>
  );
};
