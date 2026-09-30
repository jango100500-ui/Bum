import { MOVIE_SYSTEM_PROMPT } from './prompt';

export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { query } = (await req.json()) as { query?: string };

    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ emojis: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const modelName = 'gemini-2.5-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: MOVIE_SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: query.trim() }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 60
        }
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ emojis: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const emojis = Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, 5)
      : [];

    return new Response(JSON.stringify({ emojis }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ emojis: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
