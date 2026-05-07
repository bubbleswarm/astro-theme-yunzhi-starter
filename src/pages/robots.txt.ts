export const prerender = true;

import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

export const GET: APIRoute = () => {
  const site = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
  const sitemapUrl = `${site}/sitemap-index.xml`;
  const llmsUrl = `${site}/llms.txt`;

  const content = `User-agent: *
Allow: /

# AI Search Engine Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

# llms.txt for AI search engines
llms.txt: ${llmsUrl}

Sitemap: ${sitemapUrl}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
