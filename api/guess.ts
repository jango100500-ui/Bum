import { MOVIE_SYSTEM_PROMPT } from './prompt';

export const config = {
  runtime: 'edge'
};

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash'
];

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed', status: 405 }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const rawKey = process.env.GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim().replace(/^["']|["']$/g, '') : null;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured', status: 500 }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { query } = (await req.json()) as { query?: string };
    const cleanQuery = query ? query.trim() : '';

    if (cleanQuery.length === 0) {
      return new Response(JSON.stringify({ emojis: [], status: 400 }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let lastErrorStatus = 500;
    let lastErrorMessage = 'Unknown error';

    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${MOVIE_SYSTEM_PROMPT}\n\nUser request: "${cleanQuery}"`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 60
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const match = rawText.match(/\[[\s\S]*?\]/);

          if (match) {
            const parsed = JSON.parse(match[0]);
            const emojis = Array.isArray(parsed)
              ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, 5)
              : [];

            if (emojis.length > 0) {
              return new Response(JSON.stringify({ emojis, status: 200 }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          }
        } else {
          lastErrorStatus = res.status;
          try {
            const errJson = await res.json();
            lastErrorMessage = errJson?.error?.message || res.statusText;
          } catch {
            lastErrorMessage = res.statusText;
          }
        }
      } catch (err: unknown) {
        lastErrorMessage = err instanceof Error ? err.message : 'Network error';
      }
    }

    return new Response(
      JSON.stringify({ error: lastErrorMessage, status: lastErrorStatus }),
      {
        status: lastErrorStatus,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error', status: 500 }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
