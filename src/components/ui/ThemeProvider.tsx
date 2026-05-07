import { useStore } from '@nanostores/react';
import { type ReactNode, useEffect } from 'react';
import { $theme } from '../../stores/themeStore';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const theme = useStore($theme);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'yunzhi' | 'yunzhi-dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: 'yunzhi' | 'yunzhi-dark' = saved ?? (prefersDark ? 'yunzhi-dark' : 'yunzhi');
    $theme.set(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
}
