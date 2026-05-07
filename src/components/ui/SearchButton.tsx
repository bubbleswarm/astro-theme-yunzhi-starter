import { Search } from 'lucide-react';
import { config } from '../../config';

export function SearchButton() {
  if (!config.features.search) return null;

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn btn-ghost btn-sm btn-square"
      aria-label="搜索"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}
