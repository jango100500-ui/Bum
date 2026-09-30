import { useState, useEffect, useRef } from 'react';
import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';

const DIGIT_EMOJIS: Record<string, string> = {
  '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣',
  '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
};

const BUG_EMOJIS = ['🪲', '🐞', '🚨'];

const MOVIE_SYSTEM_PROMPT = `
You are a movie and pop-culture emoji assistant.
Identify the movie, TV series, cartoon or show from the user's title or description.
Return ONLY a valid JSON array of 3 to 5 emojis representing its key plot, characters, or iconic objects.
Example output for Titanic: ["🚢", "🧊", "🌹", "🎻", "🌊"]
Example output for Breaking Bad: ["⚗️", "🧪", "💵", "🚐", "🍗"]
Strict rules:
- Return ONLY the JSON array (no markdown code blocks, no other words).
- If unknown, return [].
`.trim();

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
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey) {
          triggerErrorCombo(500); // Нет ключа
          return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${MOVIE_SYSTEM_PROMPT}\n\nUser request: "${trimmed}"` }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 60 }
          })
        });

        if (!res.ok) {
          triggerErrorCombo(res.status || 502);
          return;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = rawText.match(/\[[\s\S]*?\]/);

        if (match) {
          const parsed = JSON.parse(match[0]);
          const emojis = Array.isArray(parsed)
            ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, 5)
            : [];

          if (emojis.length > 0) {
            setFromTop(false);
            setCombo(emojis);
          } else {
            triggerErrorCombo(404); // Ничего не найдено
          }
        } else {
          triggerErrorCombo(404);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        triggerErrorCombo(500); // Сбой сети
      }
    }, 600);

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
