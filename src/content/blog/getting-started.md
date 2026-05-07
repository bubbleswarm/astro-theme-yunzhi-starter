---
title: 快速上手指南
description: 如何配置和使用这个 Astro 博客主题模板
pubDate: 1746278400000
tags: ['指南', 'astro']
category: 教程
---

本文将引导你完成从安装到部署的全过程。

## 安装

你可以通过 Astro CLI 一键创建基于此模板的项目：

```bash
npm create astro@latest -- --template your-username/astro-theme-yunzhi-starter
```

或者手动克隆：

```bash
git clone https://github.com/your-username/astro-theme-yunzhi-starter.git my-blog
cd my-blog
npm install
```

## 配置站点信息

打开 `src/config.ts`，修改以下配置：

```typescript
export const config = {
  site: {
    title: '你的博客标题',
    description: '你的博客描述',
    url: 'https://your-domain.com',
    logo: '🚀',  // 可以是字符、emoji 或图片 URL
  },
  author: {
    name: '你的名字',
    email: 'your@email.com',
    github: 'https://github.com/yourusername',
    bio: '一句话介绍你自己',
  },
  // ...
};
```

## 撰写文章

在 `src/content/blog/` 目录下创建 `.md` 文件即可：

```bash
src/content/blog/my-first-post.md
```

文章需要包含 frontmatter，格式如下：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2026-05-01
tags: ['标签1', '标签2']
category: 分类名称
---
```

## 启用第三方功能

### 站内搜索（Pagefind）

1. 将 `src/config.ts` 中的 `features.search` 设为 `true`
2. 构建时运行 `npm run build:search`
3. 搜索功能即可生效

### 评论系统（Giscus）

1. 将 `src/config.ts` 中的 `features.comments` 设为 `true`
2. 在 [Giscus 官网](https://giscus.app) 配置你的仓库
3. 填写 `src/config.ts` 中的 `integrations.giscus` 配置项，或在 `.env` 中设置环境变量

### 网站统计（Umami）

1. 将 `src/config.ts` 中的 `features.analytics` 设为 `true`
2. 在 [Umami](https://umami.is) 创建站点获取 Tracking ID
3. 在 `.env` 文件中设置 `UMAMI_WEBSITE_ID` 和 `UMAMI_HOST`

## 自定义主题颜色

编辑 `src/styles/theme.css`，修改 DaisyUI 主题变量：

```css
@plugin "daisyui/theme" {
  name: "yunzhi";
  --color-primary: #b87333;  /* 修改为主色调 */
  /* ... */
}
```

## 部署

构建静态站点：

```bash
npm run build
```

构建产物在 `dist/` 目录，可以部署到任何静态托管平台：

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)

祝你使用愉快！
