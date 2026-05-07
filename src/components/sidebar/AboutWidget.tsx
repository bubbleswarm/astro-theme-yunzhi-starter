'use client';

import type { CollectionEntry } from 'astro:content';
import type React from 'react';
import { SidebarCard } from '../ui/SidebarCard';

interface AboutWidgetProps {
  site?: CollectionEntry<'site'>;
}

const DEFAULT_TITLE = '关于博主';
const DEFAULT_CONTENT = '热爱技术，喜欢分享。这里记录我的学习笔记、技术心得和生活感悟。';

export function AboutWidget({ site }: AboutWidgetProps): React.ReactElement {
  const title = site?.data.title ?? DEFAULT_TITLE;
  const name = site?.data.name ?? '';
  const avatar = site?.data.avatar;
  const content = site?.body ?? DEFAULT_CONTENT;

  return (
    <SidebarCard>
      <h3 className="sidebar-section-title text-base font-semibold mb-4 text-base-content">
        {title}
      </h3>

      {avatar && (
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-sm text-base-content/70 leading-relaxed">{content}</p>
    </SidebarCard>
  );
}
