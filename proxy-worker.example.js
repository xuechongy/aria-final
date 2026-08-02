/**
 * proxy-worker.example.js — Cloudflare Workers 后端代理示例。
 *
 * 作用：前端把对话发到这个 Worker，Worker 用保存在服务端的 key 转发给 Groq。
 * key 存在 Cloudflare 的加密环境变量里，浏览器永远看不到。
 *
 * 部署步骤见文末 README。
 */

export default {
  async fetch(request, env) {
    // 只允许你自己的站点调用（把下面换成你的 GitHub Pages 域名）
    const ALLOWED_ORIGIN = 'https://your-username.github.io';

    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const messages = body.messages || [];

      // 用服务端的 key 转发给 Groq。env.GROQ_API_KEY 来自 Cloudflare 加密变量。
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + env.GROQ_API_KEY,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 150,
          messages,
        }),
      });

      const data = await groqResponse.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

/*
──────────────── 部署 README ────────────────

1. 安装 Wrangler（Cloudflare 官方 CLI）：
     npm install -g wrangler
     wrangler login

2. 新建项目：
     wrangler init aria-proxy   # 选 "Hello World" worker
     把本文件内容复制进 src/index.js

3. 存入 key（加密，不会出现在代码里）：
     wrangler secret put GROQ_API_KEY
     # 粘贴你的 gsk_... key，回车

4. 部署：
     wrangler deploy
     # 得到一个地址，例如 https://aria-proxy.你的名字.workers.dev

5. 在前端 config.js 里改用代理（删掉 apiKey，换成 proxyUrl）：
     window.ARIA_CONFIG = {
       proxyUrl: 'https://aria-proxy.你的名字.workers.dev',
     };

   这样 config.js 里不再有 key，可以安全提交到 GitHub。

*/
