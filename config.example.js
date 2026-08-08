/**
 * config.example.js — configuration template.
 *
 * Usage:
 *   Copy this file to config.js, fill in your real configuration, then include
 *   config.js in index.html. config.js is git-ignored, so it is never committed
 *   and the key is not leaked.
 *
 * Choose one:
 */

window.ARIA_CONFIG = {
  // -- Production (recommended): go through the server-side proxy; no key on the client --
  // proxyUrl: 'https://your-worker.example.workers.dev',

  // -- Local development: direct call to Groq (key is exposed in the browser; never deploy this) --
  apiKey: 'gsk_your_groq_key_here',

  // Optional overrides:
  // model: 'llama-3.3-70b-versatile',
  // maxTokens: 150,
};
