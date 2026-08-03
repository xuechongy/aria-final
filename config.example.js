/**
 * config.example.js — 配置模板。
 *
window.ARIA_CONFIG = {
  // ── 线上部署（推荐）：走后端代理，前端不持有 key ──
  // proxyUrl: 'https://your-worker.example.workers.dev',

  // ── 本地开发：直连 Groq（key 会暴露在浏览器，切勿用于公开部署）──
  apiKey: 'gsk_你的_groq_key_放这里',

  // 可选覆盖项：
  // model: 'llama-3.3-70b-versatile',
  // maxTokens: 150,
};
