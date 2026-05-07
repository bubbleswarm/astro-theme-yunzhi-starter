import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../../consts';

export default function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('toggle-mobile-drawer', handleToggle);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-mobile-drawer', handleToggle);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-(--z-drawer)">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => setIsOpen(false)}
        aria-label="关闭菜单"
      />
      <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-70 min-w-50 bg-base-200 border-l border-base-300 p-6">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square absolute top-4 right-4"
          onClick={() => setIsOpen(false)}
          aria-label="关闭菜单"
        >
          <X className="w-5 h-5" />
        </button>
        <nav className="mt-12 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg font-medium text-base-content hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
