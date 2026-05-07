'use client';

import { Folder } from 'lucide-react';
import { SidebarCard } from '../ui/SidebarCard';

interface Category {
  name: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
  activeCategory?: string | null;
}

export function CategoryList({ categories, activeCategory }: CategoryListProps) {
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  const isAllActive = !activeCategory;

  return (
    <SidebarCard className="mb-0">
      <h3 className="sidebar-section-title flex items-center gap-2 font-semibold text-base-content mb-4">
        <Folder className="w-4 h-4" />
        文章分类
      </h3>

      <div className="flex flex-col gap-1">
        <a
          href="/blog/"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors no-underline hover:no-underline ${
            isAllActive
              ? 'bg-base-200 text-base-content border border-base-300'
              : 'text-base-content/70 hover:bg-primary/5 hover:text-primary'
          }`}
        >
          <span>全部文章</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/60">
            {totalCount}
          </span>
        </a>

        {categories.map((category) => {
          const isActive = activeCategory === category.name;
          return (
            <a
              key={category.name}
              href={`/blog/category/${encodeURIComponent(category.name)}`}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors no-underline hover:no-underline ${
                isActive
                  ? 'bg-base-200 text-base-content border border-base-300'
                  : 'text-base-content/70 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/60">
                {category.count}
              </span>
            </a>
          );
        })}
      </div>
    </SidebarCard>
  );
}
