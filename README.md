# Astro Theme Yunzhi Starter

一款基于 Astro 6.x + React 19 + Tailwind CSS v4 + DaisyUI v5 构建的精美博客主题模板，支持浅色/深色双主题、响应式布局、文章目录、标签系统、可选搜索/评论/统计等完整博客功能。

> **yunzhi（云知）** 寓意「云间知性」，主题以温润的铜色（浅色）和静谧的藏青（深色）为主色调。

## 特性

- **双主题切换** — 浅色（yunzhi）与深色（yunzhi-dark）模式，自动跟随系统偏好
- **响应式设计** — 完美适配桌面端、平板和手机
- **文章目录** — 自动根据文章标题生成目录，滚动时高亮当前章节
- **标签系统** — 文章标签分类，支持标签云和按标签筛选
- **分页功能** — 文章列表自动分页，支持选择每页数量
- **可选搜索** — 基于 Pagefind 的站内全文搜索（默认关闭）
- **可选评论** — 基于 Giscus + GitHub Discussions 的评论系统（默认关闭）
- **可选统计** — 基于 Umami 的隐私友好统计（默认关闭）
- **SEO 优化** — 内置 astro-seo、JSON-LD 结构化数据、Open Graph、Twitter Card
- **RSS 订阅** — 自动生成 RSS feed
- **说说/短动态** — 支持轻量级的短内容发布
- **毛玻璃效果** — 现代化的玻璃拟态 UI 设计
- **代码复制** — 一键复制代码块内容
- **字体优化** — 内置 HarmonyOS Sans SC 分片字体加载

## 快速开始

### 使用 Astro CLI 创建（推荐）

```bash
npm create astro@latest -- --template your-username/astro-theme-yunzhi-starter
```

### 手动克隆

```bash
git clone https://github.com/your-username/astro-theme-yunzhi-starter.git my-blog
cd my-blog
npm install
npm run dev
```

开发服务器将在 `http://localhost:8080` 启动。

## 配置站点

所有站点级配置集中在 `src/config.ts`，修改此文件即可自定义你的博客：

```typescript
export const config = {
  site: {
    title: 'My Blog',              // 站点标题
    description: 'A personal blog built with Astro',  // 站点描述
    url: 'https://example.com',    // 站点 URL
    favicon: '/favicon.svg',       // 浏览器图标
    logo: '📝',                    // Logo（支持字符/emoji/图片URL）
    lang: 'zh-CN',                 // 语言
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
  ],
  features: {
    search: false,      // 是否启用搜索
    comments: false,    // 是否启用评论
    analytics: false,   // 是否启用统计
    rss: true,          // 是否显示 RSS 链接
    githubLink: false,  // 是否在页脚显示 GitHub 链接
    moments: true,      // 是否启用说说功能
  },
  // ...
};
```

## 撰写文章

在 `src/content/blog/` 目录下创建 `.md` 文件：

```bash
src/content/blog/my-post.md
```

文章 frontmatter 格式：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2026-05-01          // 发布时间（时间戳或日期字符串）
tags: ['标签1', '标签2']      // 标签数组
category: 分类名称            // 分类
draft: false                 // 草稿状态（true 时不发布）
heroImage: ''                // 封面图路径（可选）
summary: ''                  // 文章摘要（可选）
---
```

文章内容支持标准 Markdown 语法，包括代码块、表格、引用、图片等。

## 第三方集成配置

### 站内搜索（Pagefind）

1. 将 `src/config.ts` 中的 `features.search` 设为 `true`
2. 构建时运行 `npm run build:search`（会先执行 Astro 构建，再生成搜索索引）
3. 页面右上角会出现搜索按钮，支持 `Ctrl/Command + K` 快捷键

### 评论系统（Giscus）

1. 将 `src/config.ts` 中的 `features.comments` 设为 `true`
2. 前往 [giscus.app](https://giscus.app)，选择你的 GitHub 仓库并生成配置
3. 在 `src/config.ts` 的 `integrations.giscus` 中填写配置，或在项目根目录创建 `.env` 文件：

```env
PUBLIC_GISCUS_REPO=your-username/your-repo
PUBLIC_GISCUS_REPO_ID=xxx
PUBLIC_GISCUS_CATEGORY=Announcements
PUBLIC_GISCUS_CATEGORY_ID=xxx
```

### 网站统计（Umami）

1. 将 `src/config.ts` 中的 `features.analytics` 设为 `true`
2. 在 [Umami](https://umami.is) 创建站点获取 Tracking ID
3. 在项目根目录创建 `.env` 文件：

```env
UMAMI_WEBSITE_ID=your-website-id
UMAMI_HOST=https://your-umami-instance.com
```

## 自定义主题颜色

编辑 `src/styles/theme.css`，修改 DaisyUI 主题变量：

```css
@plugin "daisyui/theme" {
  name: "yunzhi";
  default: true;
  --color-primary: #b87333;    /* 主色调 */
  --color-secondary: ...;      /* 次色调 */
  --color-accent: ...;         /* 强调色 */
  /* ... */
}
```

你也可以复制一份主题配置，创建自己的主题名称，然后在 `src/config.ts` 的 `theme` 中引用。

## 部署

构建静态站点：

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到任何静态托管平台：

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)

### Cloudflare Pages 部署注意

如果你使用 Cloudflare Pages，需要安装适配器：

```bash
npm install @astrojs/cloudflare
```

然后修改 `astro.config.mjs`：

```javascript
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  // ...
});
```

## 目录结构

```
├── src/
│   ├── components/        # UI 组件
│   │   ├── blog/          # 博客相关组件
│   │   ├── layout/        # 布局组件（Header、Footer、Nav）
│   │   ├── ui/            # 通用 UI 组件
│   │   ├── sidebar/       # 侧边栏组件
│   │   ├── giscus/        # Giscus 评论组件
│   │   ├── seo/           # SEO 结构化数据组件
│   │   └── hero/          # 首页 Hero 组件
│   ├── layouts/           # Astro 布局层
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/             # 页面路由
│   ├── content/           # 内容集合
│   │   ├── blog/          # 博客文章（Markdown）
│   │   ├── site/          # 站点信息（About 等）
│   │   └── moments/       # 说说/短动态
│   ├── styles/            # 全局样式
│   │   ├── theme.css      # DaisyUI 主题定义
│   │   ├── global.css     # 全局样式和自定义类
│   │   └── fonts.css      # 字体引入
│   ├── stores/            # nanostores 状态管理
│   ├── utils/             # 工具函数
│   ├── types/             # TypeScript 类型
│   ├── hooks/             # React Hooks
│   ├── config.ts          # 站点主配置
│   └── consts.ts          # 兼容层常量导出
├── public/                # 静态资源
│   └── fonts/             # 字体文件
├── astro.config.mjs
├── tsconfig.json
├── biome.json
├── package.json
└── .env.example
```

## 技术栈

- [Astro](https://astro.build) 6.1.8 — 现代静态站点生成器
- [React](https://react.dev) 19.2.4 — UI 组件框架
- [Tailwind CSS](https://tailwindcss.com) 4.2.2 — 原子化 CSS
- [DaisyUI](https://daisyui.com) 5.5.19 — Tailwind 组件库
- [nanostores](https://github.com/nanostores/nanostores) — 轻量级状态管理
- [lucide-react](https://lucide.dev) — 图标库
- [Pagefind](https://pagefind.app) — 静态搜索（可选）
- [Giscus](https://giscus.app) — 基于 GitHub Discussions 的评论（可选）
- [Umami](https://umami.is) — 隐私友好统计（可选）
- [astro-seo](https://github.com/jonasmerlin/astro-seo) — SEO 组件

## 许可证

[MIT](LICENSE)

## 致谢

- 灵感来源于 [Astro](https://astro.build) 生态系统中的优秀主题
- 配色方案参考中国传统色彩「霁红」与「藏青」
- 字体使用 [HarmonyOS Sans SC](https://developer.harmonyos.com/cn/docs/design/font-0000001157868583)
