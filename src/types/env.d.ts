/// <reference types="astro/client" />
/// <reference path="../../.astro/types.d.ts" />

// CSS 模块声明
declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Astro 客户端指令类型扩展
declare global {
  namespace React {
    interface HTMLAttributes<T> {
      'client:load'?: boolean;
      'client:idle'?: boolean;
      'client:visible'?: boolean;
      'client:media'?: string;
      'client:only'?: string;
    }
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_GISCUS_REPO: string;
  readonly PUBLIC_GISCUS_REPO_ID: string;
  readonly PUBLIC_GISCUS_CATEGORY: string;
  readonly PUBLIC_GISCUS_CATEGORY_ID: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
