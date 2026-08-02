/**
 * aria-api.js — 单一的 ARIA 模型调用出入口。
 *
 * 所有对 Groq 的网络请求都集中在这里，chapter2.js 只调用 callAria()，
 * 不再直接接触 API key 或 endpoint。将来切换到后端代理时，只需修改本文件。
 *
 * 配置来源（按优先级）：
 *   1. window.ARIA_CONFIG.proxyUrl —— 走后端代理，前端不持有 key（推荐用于线上）
 *   2. window.ARIA_CONFIG.apiKey  —— 直连 Groq，key 在前端可见（仅本地/演示用）
 *
 * 见 config.example.js 了解如何提供配置。
 */

const ARIA_DEFAULTS = {
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile',
  maxTokens: 150,
};

/**
 * 调用 ARIA 模型，返回助手回复文本。
 * @param {string} systemPrompt 关卡的系统提示词
 * @param {Array<{role:string, content:string}>} history 对话历史
 * @returns {Promise<string>} ARIA 的回复
 */
async function callAria(systemPrompt, history) {
  const config = window.ARIA_CONFIG || {};
  const messages = [{ role: 'system', content: systemPrompt }, ...history];

  // 方案 A：后端代理。前端把对话发给自己的服务器，服务器再补上 key 转发给 Groq。
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

  // 方案 B：直连 Groq（key 会暴露在浏览器，仅限本地开发）。
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

  throw new Error('ARIA 未配置：请提供 window.ARIA_CONFIG.proxyUrl（线上）或 apiKey（本地）。');
}
