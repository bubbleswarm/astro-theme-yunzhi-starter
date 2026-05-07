/**
 * 站点主配置文件
 *
 * 修改此文件即可自定义你的博客，无需深入代码。
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: string;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: string;
  lang?: string;
}

export interface UmamiConfig {
  id: string;
  host: string;
}

export const config = {
  site: {
    title: 'My Blog',
    description: 'A personal blog built with Astro',
    url: 'https://example.com',
    favicon: '/favicon.svg',
    /** 支持：单个字符/字母（如 'B'）、emoji（如 '🚀'）、图片 URL（如 '/logo.png'） */
    logo: '📝',
    lang: 'zh-CN',
  },

  author: {
    name: 'Your Name',
    email: 'your@email.com',
    avatar: '/avatar.png',
    github: 'https://github.com/yourusername',
    twitter: '',
    bio: 'Write something about yourself here.',
  },

  nav: [
    { label: '首页', href: '/' },
    { label: '归档', href: '/blog' },
    { label: '说说', href: '/moments' },
    { label: '标签', href: '/tags' },
    { label: '关于', href: '/about' },
  ] as NavItem[],

  features: {
    /** Pagefind 站内搜索 */
    search: false,
    /** Giscus 评论系统 */
    comments: false,
    /** Umami 网站统计 */
    analytics: false,
    /** RSS 订阅 */
    rss: true,
    /** 页脚 GitHub 链接 */
    githubLink: false,
    /** 说说/短动态功能 */
    moments: true,
  },

  integrations: {
    giscus: {
      repo: '',
      repoId: '',
      category: 'Announcements',
      categoryId: '',
      mapping: 'pathname',
      reactionsEnabled: true,
      emitMetadata: false,
      inputPosition: 'top',
      lang: 'zh-CN',
    } as GiscusConfig,

    umami: {
      id: '',
      host: '',
    } as UmamiConfig,
  },

  theme: {
    light: 'yunzhi',
    dark: 'yunzhi-dark',
  },
} as const;

/** 兼容旧版常量导出，组件代码无需大规模修改 */
export const SITE_TITLE = config.site.title;
export const SITE_DESCRIPTION = config.site.description;
export const SITE_URL = config.site.url;
export const AUTHOR_NAME = config.author.name;
export const AUTHOR_EMAIL = config.author.email;
export const GITHUB_URL = config.author.github;
export const SHOW_GITHUB_LINK = config.features.githubLink;
export const SHOW_RSS_LINK = config.features.rss;
export const SITE_LOGO = config.site.logo;
export const SITE_FAVICON = config.site.favicon;

export const GISCUS_CONFIG = {
  REPO: import.meta.env.PUBLIC_GISCUS_REPO || config.integrations.giscus.repo,
  REPO_ID: import.meta.env.PUBLIC_GISCUS_REPO_ID || config.integrations.giscus.repoId,
  CATEGORY: import.meta.env.PUBLIC_GISCUS_CATEGORY || config.integrations.giscus.category,
  CATEGORY_ID: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || config.integrations.giscus.categoryId,
};

export const NAV_ITEMS = config.nav;
