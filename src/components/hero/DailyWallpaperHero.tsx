'use client';

import { useWallpaper } from '../../hooks/useWallpaper';
import styles from './DailyWallpaperHero.module.css';

interface DailyWallpaperHeroProps {
  siteTitle: string;
  siteDescription: string;
}

export function DailyWallpaperHero({ siteTitle, siteDescription }: DailyWallpaperHeroProps) {
  const { wallpaper, loading } = useWallpaper();

  const backgroundImage = wallpaper
    ? `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%), url(${wallpaper.url})`
    : 'var(--accent-gradient)';

  return (
    <section
      className={`animate-fade-in-up ${styles.container}`}
      style={{ '--hero-bg-image': backgroundImage } as React.CSSProperties}
    >
      <div className={styles.content}>
        <h1 className={styles.title}>{siteTitle}</h1>
        <p className={styles.description}>{siteDescription}</p>
        <a href="/blog" className={styles.button}>
          开始阅读
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
      {wallpaper && !loading && (
        <div title={`${wallpaper.title} - ${wallpaper.copyright}`} className={styles.copyright}>
          {wallpaper.copyright}
        </div>
      )}
    </section>
  );
}
