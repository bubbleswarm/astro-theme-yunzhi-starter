'use client';

import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { config } from '../../config';
import { $theme } from '../../stores/themeStore';

interface GiscusCommentsProps {
  slug: string;
}

function getEnvVar(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

const REPO = getEnvVar('PUBLIC_GISCUS_REPO') || config.integrations.giscus.repo;
const REPO_ID = getEnvVar('PUBLIC_GISCUS_REPO_ID') || config.integrations.giscus.repoId;
const CATEGORY = getEnvVar('PUBLIC_GISCUS_CATEGORY') || config.integrations.giscus.category;
const CATEGORY_ID = getEnvVar('PUBLIC_GISCUS_CATEGORY_ID') || config.integrations.giscus.categoryId;

const isConfigured = config.features.comments && !!(REPO && REPO_ID && CATEGORY_ID);

export function GiscusComments({ slug }: GiscusCommentsProps) {
  const theme = useStore($theme);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const giscusTheme = theme === 'yunzhi-dark' ? 'catppuccin_mocha' : 'catppuccin_latte';

  // Inject Giscus script on mount
  useEffect(() => {
    if (!mounted || !containerRef.current || !isConfigured) return;

    const container = containerRef.current;
    if (container.querySelector('script[data-giscus]')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.dataset.giscus = 'true';
    script.dataset.repo = REPO;
    script.dataset.repoId = REPO_ID;
    script.dataset.category = CATEGORY;
    script.dataset.categoryId = CATEGORY_ID;
    script.dataset.mapping = 'specific';
    script.dataset.term = slug;
    script.dataset.reactionsEnabled = '1';
    script.dataset.emitMetadata = '0';
    script.dataset.inputPosition = 'top';
    script.dataset.theme = giscusTheme;
    script.dataset.lang = 'zh-CN';
    script.dataset.loading = 'lazy';
    script.crossOrigin = 'anonymous';
    script.async = true;

    container.appendChild(script);
  }, [mounted, slug, giscusTheme]);

  // Sync theme when it changes
  useEffect(() => {
    if (!mounted) return;

    const sendTheme = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          'https://giscus.app'
        );
      }
    };

    sendTheme();
    const timer = setTimeout(sendTheme, 500);
    return () => clearTimeout(timer);
  }, [giscusTheme, mounted]);

  if (!isConfigured) {
    return (
      <div className="p-5 text-error bg-error/10 rounded-lg border border-error/20">
        <p className="font-medium">⚠️ Giscus 环境变量未配置</p>
        <p className="text-sm mt-1 opacity-80">请检查 .env 文件中的 PUBLIC_GISCUS_* 变量</p>
      </div>
    );
  }

  if (!mounted) {
    return <div className="min-h-50" />;
  }

  return (
    <div className="giscus-wrapper">
      <style>{`
        .giscus-wrapper {
          width: 100%;
          max-width: 100%;
        }
        .giscus-wrapper .giscus {
          width: 100% !important;
          max-width: 100% !important;
        }
        .giscus-wrapper iframe.giscus-frame {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
