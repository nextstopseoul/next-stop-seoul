// Server-side Gemini helper shared by the Workers entry (worker/index.js)
// and the Pages Function (functions/api/ask.js). The API key comes from the
// GEMINI_API_KEY secret and is never sent to the browser.

// Tried in order; the next one is used when a model is overloaded or retired.
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
const MAX_QUESTION = 500;

const SYSTEM = `You are the friendly assistant of "Next Stop Seoul", an English travel blog for international visitors to Seoul.
Answer questions about Seoul: events, food, neighborhoods, transport, practical tips.
Keep answers short (under 150 words), warm and practical. Use plain text, no markdown headings.
When you mention a subway stop, write it as "Station (Line N), Exit N" if you know the exit.
Recommend Naver Map or KakaoMap for walking directions. Dates, prices and hours change, so suggest checking the official site.
If a question has nothing to do with Seoul or travel in Korea, politely say you can only help with Seoul trips.`;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

async function callGemini(model, question, apiKey) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, status: res.status, error: data?.error?.message };
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? '')
    .join('')
    .trim();
  return text ? { ok: true, text } : { ok: false, status: 502, error: 'Empty response' };
}

export async function handleAsk(request, env) {
  if (request.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!env.GEMINI_API_KEY) return json({ error: 'The assistant is not configured yet.' }, 503);

  let question;
  try {
    ({ question } = await request.json());
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  question = typeof question === 'string' ? question.trim() : '';
  if (!question) return json({ error: 'Please type a question.' }, 400);
  if (question.length > MAX_QUESTION) return json({ error: `Please keep it under ${MAX_QUESTION} characters.` }, 400);

  let last;
  for (const model of MODELS) {
    last = await callGemini(model, question, env.GEMINI_API_KEY);
    if (last.ok) return json({ answer: last.text });
    // Only fall through to the next model when this one is busy, rate-limited or gone.
    if (![404, 429, 500, 502, 503].includes(last.status)) break;
  }
  console.error('Gemini error', last?.status, last?.error);
  return json({ error: 'The assistant is busy right now. Please try again in a minute.' }, 502);
}
