import type React from 'react';
import type { Moment } from '../../types/blog';
import { formatLocalDateTimeSeconds } from '../../utils/formatDate';
import { SidebarCard } from '../ui/SidebarCard';

interface LatestMomentsProps {
  moments: Moment[];
}

export function LatestMoments({ moments }: LatestMomentsProps): React.ReactElement {
  return (
    <SidebarCard>
      <h3 className="sidebar-section-title text-base font-semibold mb-4 text-base-content">
        最新说说
      </h3>
      <div className="flex flex-col">
        {moments.length === 0 ? (
          <p className="text-sm text-base-content/50 py-2">还没有说说～</p>
        ) : (
          moments.map((moment, index) => (
            <div
              key={moment.id}
              className={`py-3 ${index < moments.length - 1 ? 'border-b border-base-200' : ''}`}
            >
              <p className="text-sm text-base-content/80 line-clamp-2 leading-relaxed">
                {moment.body?.trim()}
              </p>
              <span className="text-xs text-base-content/40 mt-1 block">
                {formatLocalDateTimeSeconds(moment.data.pubDate)}
              </span>
            </div>
          ))
        )}
      </div>
    </SidebarCard>
  );
}
