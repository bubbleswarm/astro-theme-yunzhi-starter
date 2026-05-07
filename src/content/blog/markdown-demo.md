---
title: Markdown 渲染示例
description: 展示博客支持的各种 Markdown 渲染效果
pubDate: 1746192000000
tags: ['markdown', '示例']
category: 技术
---

这篇文章展示了模板支持的各种 Markdown 渲染效果，方便你了解文章排版样式。

## 标题

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

## 段落与文本样式

这是一个普通段落。你可以使用 **粗体**、*斜体*、~~删除线~~ 等样式。

## 代码

行内代码：`const greeting = 'Hello World';`

代码块：

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet('Astro'));
```

## 引用

> 这是一段引用文字。引用可以包含多行内容。
>
> —— 作者名

## 列表

### 无序列表

- 第一项
- 第二项
- 第三项
  - 嵌套项 1
  - 嵌套项 2

### 有序列表

1. 第一步
2. 第二步
3. 第三步

## 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| 主题切换 | 已完成 | 支持浅色/深色双主题 |
| 响应式 | 已完成 | 适配各种屏幕尺寸 |
| 搜索 | 可选 | 基于 Pagefind |
| 评论 | 可选 | 基于 Giscus |

## 链接与图片

[Astro 官网](https://astro.build)

图片示例（请确保图片路径正确）：

![示例图片](/og-default.png)

## 分割线

---

以上就是常见的 Markdown 元素渲染效果。
