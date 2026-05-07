import { useEffect, useRef } from 'react';

interface ArticleTrackerProps {
  slug: string;
}

interface UmamiWindow extends Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
  };
}

// 追踪配置常量
const READ_INTERVAL_SECONDS = 30;
const READ_INTERVAL_MS = READ_INTERVAL_SECONDS * 1000;
const SCROLL_MILESTONES = [50, 100];
const MAX_POLL_ATTEMPTS = 100;
const POLL_INTERVAL_MS = 100;

export function ArticleTracker({ slug }: ArticleTrackerProps) {
  const durationRef = useRef(0);
  const scrollMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    let intervalId: number | undefined;
    let scrollHandler: (() => void) | undefined;
    let cleanupExecuted = false;

    const tryInit = () => {
      const umami = (window as unknown as UmamiWindow).umami;
      if (!umami || cleanupExecuted) return;

      // 阅读时长：每 READ_INTERVAL_SECONDS 秒触发一次
      intervalId = window.setInterval(() => {
        durationRef.current += READ_INTERVAL_SECONDS;
        umami.track('read_article', { slug, duration: durationRef.current });
      }, READ_INTERVAL_MS);

      // 滚动深度：50%、100%
      const articleElement = document.querySelector('article');
      if (articleElement) {
        const handleScroll = () => {
          const rect = articleElement.getBoundingClientRect();
          const articleHeight = articleElement.scrollHeight;
          const viewportHeight = window.innerHeight;
          const scrolled = Math.max(0, viewportHeight - rect.top);
          const percent = Math.min(100, Math.round((scrolled / articleHeight) * 100));

          for (const milestone of SCROLL_MILESTONES) {
            if (percent >= milestone && !scrollMilestonesRef.current.has(milestone)) {
              scrollMilestonesRef.current.add(milestone);
              umami.track('scroll_depth', { slug, percent: milestone });
            }
          }
        };

        scrollHandler = handleScroll;
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
      }
    };

    // 轮询等待 window.umami 就绪（最多等 POLL_TIMEOUT_MS）
    let attempts = 0;
    const pollId = window.setInterval(() => {
      attempts++;
      if ((window as unknown as UmamiWindow).umami) {
        window.clearInterval(pollId);
        tryInit();
      } else if (attempts >= MAX_POLL_ATTEMPTS) {
        window.clearInterval(pollId);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cleanupExecuted = true;
      window.clearInterval(pollId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [slug]);

  return null;
}
