import { useEffect, useState } from 'react';

export interface WallpaperData {
  url: string;
  copyright: string;
  title: string;
  date: string;
}

const CACHE_KEY_PREFIX = 'bing-wallpaper-';

function getTodayCacheKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `${CACHE_KEY_PREFIX}${today}`;
}

function getCachedWallpaper(): WallpaperData | null {
  if (typeof window === 'undefined') return null;
  try {
    const cacheKey = getTodayCacheKey();
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as WallpaperData;
    }
    // Clean up old cache
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX) && key !== cacheKey) {
        localStorage.removeItem(key);
      }
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedWallpaper(data: WallpaperData): void {
  if (typeof window === 'undefined') return;
  try {
    const cacheKey = getTodayCacheKey();
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // Ignore cache failures
  }
}

export function useWallpaper() {
  const [wallpaper, setWallpaper] = useState<WallpaperData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallpaper = async () => {
      const cached = getCachedWallpaper();
      if (cached) {
        setWallpaper(cached);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/wallpaper');
        if (!response.ok) {
          throw new Error('Failed to fetch wallpaper');
        }
        const data: WallpaperData = await response.json();
        setWallpaper(data);
        setCachedWallpaper(data);
      } catch {
        // Ignore fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchWallpaper();
  }, []);

  return { wallpaper, loading };
}
