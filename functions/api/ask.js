// Cloudflare Pages Function for /api/ask (used when the site is deployed with Pages instead of Workers).
import { handleAsk } from '../../worker/gemini.js';

export const onRequest = ({ request, env }) => handleAsk(request, env);
