import { useState, useEffect, useRef } from 'react';
import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';

const DIGIT_EMOJIS: Record<string, string> = {
  '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣',
  '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
};

const BUG_EMOJIS = ['🪲', '🐞', '🚨'];

const MOVIE_SYSTEM_PROMPT = `
You are a movie/TV series/anime emoji converter. 
User will give a title. 
You must reply with a valid JSON array of strings containing EXACTLY 3 to 5 emojis describing it.
Example: ["🚢", "🧊", "🌹"]
If you don't know it, return random generic movie emojis like ["🍿", "🎬", "🎞️"].
Do not return anything else. Return ONLY JSON.
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

    // Если начали печатать новый текст — сразу сбрасываем предыдущий запрос
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

    // Ждем ровно 1 секунду тишины после последнего ввода
    const timer = window.setTimeout(async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey) {
          triggerErrorCombo(500); 
          return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${MOVIE_SYSTEM_PROMPT}\n\nUser request: "${trimmed}"` }] }],
            generationConfig: { 
              temperature: 0.2, 
              responseMimeType: "application/json" // Жестко заставляем отдавать только JSON
            }
          })
        });

        if (!res.ok) {
          triggerErrorCombo(res.status);
          return;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const parsed = JSON.parse(rawText);

        const emojis = Array.isArray(parsed)
          ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, 5)
          : [];

        if (emojis.length > 0) {
          setFromTop(false);
          setCombo(emojis);
        } else {
          triggerErrorCombo(404);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        triggerErrorCombo(400); // Ошибка парсинга или сети
      }
    }, 1000);

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
