'use client';

import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../../config';
import type { SearchResult } from '../../types/blog';
import type { PagefindAPI } from '../../types/pagefind';

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefind, setPagefind] = useState<PagefindAPI | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for open-search event
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-search', handleOpen);
    return () => window.removeEventListener('open-search', handleOpen);
  }, []);

  // Initialize pagefind when modal opens
  useEffect(() => {
    if (typeof window !== 'undefined' && open && !pagefind) {
      const pagefindPath = '/pagefind/pagefind.js';
      import(/* @vite-ignore */ pagefindPath)
        .then((mod) => setPagefind(mod))
        .catch(() => {
          // 开发模式：pagefind 未构建时静默处理
        });
    }
  }, [open, pagefind]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !pagefind) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResult = await pagefind.search(searchQuery);
        const searchResults = await Promise.all(
          searchResult.results.map(
            async (result: {
              data: () => Promise<{ url: string; meta: { title: string }; excerpt: string }>;
            }) => {
              const data = await result.data();
              return {
                url: data.url,
                title: data.meta.title,
                excerpt: data.excerpt,
              };
            }
          )
        );
        setResults(searchResults);
      } catch (_error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [pagefind]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  if (!config.features.search || !open) return null;

  return (
    <div
      className="fixed inset-0 z-(--z-modal) flex items-start justify-center pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="搜索文章"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-label="关闭搜索"
      />
      <div className="relative w-full max-w-xl mx-4 bg-base-200 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-base-200">
          <Search className="w-5 h-5 text-base-content/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="输入关键词搜索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base-content placeholder:text-base-content/40"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-base-200 text-base-content/50 transition-colors"
            type="button"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!pagefind ? (
            <div className="py-12 text-center text-base-content/50">
              <p>搜索功能需构建后使用</p>
              <p className="text-sm mt-1">运行 npm run build:search</p>
            </div>
          ) : loading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 hover:bg-base-200 transition-colors border-b border-base-200 last:border-b-0"
                >
                  <h3 className="font-medium text-base-content mb-1">{item.title}</h3>
                  <p
                    className="text-sm text-base-content/60 line-clamp-2"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: 搜索摘要是从受控的 Markdown 内容生成的
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                </a>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center text-base-content/50">
              <p>未找到相关文章</p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-base-200 text-xs text-base-content/40 flex items-center justify-between">
          <span>
            快捷键 <kbd className="px-1.5 py-0.5 rounded bg-base-200 font-mono">Ctrl</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-base-200 font-mono">K</kbd>
          </span>
          <span>{results.length > 0 ? `${results.length} 个结果` : ''}</span>
        </div>
      </div>
    </div>
  );
}
