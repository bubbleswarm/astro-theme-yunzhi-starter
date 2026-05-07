interface ViewAllButtonProps {
  href: string;
}

export function ViewAllButton({ href }: ViewAllButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-6 py-2.5 bg-(--accent-primary) text-white rounded-lg font-medium text-sm transition-all duration-fast no-underline hover:brightness-110 hover:no-underline"
    >
      查看全部
    </a>
  );
}
