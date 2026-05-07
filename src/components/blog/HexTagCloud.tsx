'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { BlogTag } from '../../utils/tagLayouts';
import { calculateHexContainerSize, calculateHexLayout } from '../../utils/tagLayouts';
import styles from './HexTagCloud.module.css';

interface HexTagCloudProps {
  tags: BlogTag[];
}

const LEVEL_CLASSES = [styles.level1, styles.level2, styles.level3, styles.level4, styles.level5];

export function HexTagCloud({ tags }: HexTagCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // ResizeObserver 监听容器尺寸变化（防抖）
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    let rafId: number;

    const ro = new ResizeObserver((entries) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });
    });

    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  // IntersectionObserver：进入视口后触发动画
  useEffect(() => {
    if (!containerRef.current) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  const { width: containerWidth, height: containerHeight } = dimensions;

  const cells = useMemo(() => {
    if (containerWidth === 0 || containerHeight === 0) return [];
    return calculateHexLayout(tags, containerWidth, containerHeight);
  }, [tags, containerWidth, containerHeight]);

  const containerSize = useMemo(() => calculateHexContainerSize(cells), [cells]);

  if (tags.length === 0) {
    return <div className={styles.empty}>暂无标签</div>;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={`${styles.grid} ${isVisible ? styles.gridVisible : ''}`}
        style={{
          width: containerSize.width,
          height: containerSize.height,
        }}
      >
        {cells.map((cell) => {
          const levelClass = LEVEL_CLASSES[cell.sizeLevel - 1] ?? styles.level1;
          const hexH = cell.size * Math.sqrt(3);

          return (
            <a
              key={cell.tag.name}
              href={`/tags/${encodeURIComponent(cell.tag.name)}/`}
              className={`${styles.hexCell} ${levelClass}`}
              style={
                {
                  left: `calc(50% + ${cell.x}px - ${cell.size}px)`,
                  top: `calc(50% + ${cell.y}px - ${hexH / 2}px)`,
                  width: cell.size * 2,
                  height: hexH,
                  '--hex-base-color': cell.baseColor,
                  '--hex-delay': `${cell.delay}ms`,
                  '--hex-size': `${cell.size}px`,
                } as React.CSSProperties
              }
              title={`${cell.tag.name} (${cell.tag.count} 篇)`}
              aria-label={`标签: ${cell.tag.name}, ${cell.tag.count} 篇文章`}
            >
              <div className={styles.hexShape}>
                <span className={styles.hexName}>{cell.tag.name}</span>
                {cell.sizeLevel >= 3 && <span className={styles.hexCount}>{cell.tag.count}</span>}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
