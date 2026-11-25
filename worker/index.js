// Cloudflare Workers entry: /api/ask goes to Gemini, everything else is the static Astro build.
import { handleAsk } from './gemini.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/ask') return handleAsk(request, env);
    return env.ASSETS.fetch(request);
  },
};
