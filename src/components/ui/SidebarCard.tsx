import type { ReactNode } from 'react';

interface SidebarCardProps {
  children: ReactNode;
  className?: string;
}

export function SidebarCard({ children, className = '' }: SidebarCardProps) {
  return (
    <div
      className={`rounded-2xl border border-base-300 bg-base-200/90 backdrop-blur-xl p-5 shadow-md mb-6 ${className}`}
    >
      {children}
    </div>
  );
}
