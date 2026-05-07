---
title: Hello World
description: 欢迎使用 Astro Theme Yunzhi Starter！
pubDate: 1746105600000
tags: ['astro', '主题', '博客']
category: 随笔
---

欢迎来到你的新博客！这是一篇示例文章，帮助你快速了解这个模板的功能。

## 特性一览

这个主题模板基于 **Astro 6.x + React 19 + Tailwind CSS v4 + DaisyUI v5** 构建，提供了以下特性：

- **双主题切换**：浅色（yunzhi）和深色（yunzhi-dark）模式，支持跟随系统偏好
- **响应式布局**：完美适配桌面端、平板和手机
- **文章目录**：自动根据文章标题生成目录，支持滚动高亮
- **标签系统**：文章标签分类，支持标签云展示
- **分页功能**：文章列表自动分页
- **可选搜索**：基于 Pagefind 的站内搜索（默认关闭）
- **可选评论**：基于 Giscus 的评论系统（默认关闭）
- **可选统计**：基于 Umami 的网站统计（默认关闭）
- **SEO 优化**：内置 astro-seo、JSON-LD 结构化数据、Open Graph、Twitter Card
- **RSS 订阅**：自动生成 RSS feed

## 快速开始

1. 编辑 `src/config.ts` 配置你的站点信息
2. 在 `src/content/blog/` 目录下创建 Markdown 文件撰写文章
3. 运行 `npm run dev` 启动开发服务器
4. 运行 `npm run build` 构建静态站点

##  frontmatter 格式

每篇文章需要包含以下 frontmatter：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2026-05-01
tags: ['标签1', '标签2']
category: 分类
draft: false      # 可选：设为 true 则草稿状态不发布
heroImage: ''     # 可选：文章封面图路径
summary: ''       # 可选：文章摘要
---
```

祝你写作愉快！
