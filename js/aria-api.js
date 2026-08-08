/**
 * aria-api.js — single entry point for all ARIA model calls.
 *
 * All network requests to the model are centralised here. Chapter code only calls
 * callAria(); it never touches the API key or endpoint directly. Switching how the
 * model is reached only requires editing this file.
 *
 * Configuration sources (in priority order):
 *   1. window.ARIA_CONFIG.proxyUrl — go through the server-side proxy; the front
 *      end holds no key (recommended for production).
 *   2. window.ARIA_CONFIG.apiKey  — call Groq directly; the key is visible in the
 *      browser (local development / demo only).
 *
 * See config.example.js for how to provide the configuration.
 */

const ARIA_DEFAULTS = {
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile',
  maxTokens: 150,
};

/**
 * Call the ARIA model and return the assistant's reply text.
 * @param {string} systemPrompt The level's system prompt.
 * @param {Array<{role:string, content:string}>} history Conversation history.
 * @returns {Promise<string>} ARIA's reply.
 */
async function callAria(systemPrompt, history) {
  const config = window.ARIA_CONFIG || {};
  const messages = [{ role: 'system', content: systemPrompt }, ...history];

  // Mode A: server-side proxy. The front end posts the conversation to its own
  // server, which attaches the key and forwards it to Groq.
  if (config.proxyUrl) {
    const response = await fetch(config.proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) throw new Error('ARIA proxy error: ' + response.status);
    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Mode B: direct call to Groq (key is exposed in the browser; local dev only).
  if (config.apiKey) {
    const response = await fetch(config.endpoint || ARIA_DEFAULTS.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + config.apiKey,
      },
      body: JSON.stringify({
        model: config.model || ARIA_DEFAULTS.model,
        max_tokens: config.maxTokens || ARIA_DEFAULTS.maxTokens,
        messages,
      }),
    });
    if (!response.ok) throw new Error('ARIA API error: ' + response.status);
    const data = await response.json();
    return data.choices[0].message.content;
  }

  throw new Error(
    'ARIA not configured: provide window.ARIA_CONFIG.proxyUrl (production) or apiKey (local).'
  );
}
