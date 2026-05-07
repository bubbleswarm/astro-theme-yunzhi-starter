import { useStore } from '@nanostores/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { $theme, toggleTheme } from '../../stores/themeStore';

export function ThemeToggle() {
  const theme = useStore($theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 水合完成前显示与默认值一致的占位，避免 hydration mismatch
  if (!mounted) {
    return (
      <button className="btn btn-ghost btn-sm btn-square" aria-label="切换主题" type="button">
        <Moon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm btn-square"
      aria-label={theme === 'yunzhi' ? '切换到深色模式' : '切换到浅色模式'}
      type="button"
    >
      {theme === 'yunzhi' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
