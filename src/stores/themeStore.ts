import { atom } from 'nanostores';

export type Theme = 'yunzhi' | 'yunzhi-dark';

export const $theme = atom<Theme>('yunzhi');

export function toggleTheme() {
  const next: Theme = $theme.get() === 'yunzhi' ? 'yunzhi-dark' : 'yunzhi';
  $theme.set(next);
}
