import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// 可选：Umami 统计 —— 配置 UMAMI_WEBSITE_ID 环境变量后自动启用
let umamiIntegration = null;
try {
  const { loadEnv } = await import('vite');
  const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');
  if (env.UMAMI_WEBSITE_ID) {
    const umami = await import('@yeskunall/astro-umami');
    umamiIntegration = umami.default({
      id: env.UMAMI_WEBSITE_ID,
      endpointUrl: env.UMAMI_HOST,
    });
  }
} catch {
  // Umami 未配置，跳过
}

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
    ...(umamiIntegration ? [umamiIntegration] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['astro/zod'],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@astrojs/rss'],
      exclude: ['astro/zod', 'cookie'],
    },
  },
});
