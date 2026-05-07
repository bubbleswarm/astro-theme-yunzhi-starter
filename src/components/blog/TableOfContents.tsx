'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '../../types/blog';

interface TableOfContentsProps {
  headings: Heading[];
}

interface TocItem {
  key: string;
  href: string;
  title: string;
  children?: TocItem[];
  depth: number;
}

function buildTocTree(headings: Heading[]): TocItem[] {
  const result: TocItem[] = [];
  const stack: { item: TocItem; depth: number }[] = [];

  for (const heading of headings) {
    const tocItem: TocItem = {
      key: heading.slug,
      href: `#${heading.slug}`,
      title: heading.text,
      depth: heading.depth,
    };

    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (heading.depth > top.depth) {
        if (!top.item.children) {
          top.item.children = [];
        }
        top.item.children.push(tocItem);
        stack.push({ item: tocItem, depth: heading.depth });
        break;
      }
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(tocItem);
      stack.push({ item: tocItem, depth: heading.depth });
    }
  }

  return result;
}

function TocLink({ item, activeId }: { item: TocItem; activeId: string }) {
  const isActive = activeId === item.key;
  const paddingLeft = 12 + (item.depth - 2) * 12;

  return (
    <div>
      <a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById(item.key);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', item.href);
          }
        }}
        className={`block py-1.5 text-sm transition-colors border-l-2 ${
          isActive
            ? 'text-primary font-medium border-primary bg-primary/5'
            : 'text-base-content/70 hover:text-primary border-transparent'
        }`}
        style={{ paddingLeft }}
      >
        {item.title}
      </a>
      {item.children?.map((child) => (
        <TocLink key={child.key} item={child} activeId={activeId} />
      ))}
    </div>
  );
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const tocItems = buildTocTree(headings);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-22 p-5 rounded-2xl max-h-[80vh] overflow-y-auto glass-card">
      <h4 className="text-base font-semibold mb-4 text-base-content">目录</h4>
      <nav>
        {tocItems.map((item) => (
          <TocLink key={item.key} item={item} activeId={activeId} />
        ))}
      </nav>
    </div>
  );
}
