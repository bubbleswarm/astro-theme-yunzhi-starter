'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      // 静默失败
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn btn-ghost btn-xs btn-square"
      aria-label={copied ? '已复制' : '复制代码'}
      title={copied ? '已复制' : '复制代码'}
    >
      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}
