export const prerender = true;

import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';
import type { BlogPost } from '../types/blog';
import { generateHashMap } from '../utils/hash';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const posts = allPosts.filter((p: CollectionEntry<'blog'>) => !p.data.draft) as BlogPost[];

  // 生成 hash 映射
  const ids = posts.map((p: BlogPost) => p.id);
  const hashMap = generateHashMap(ids);

  // 按日期排序（最新的在前）
  const sortedPosts = posts.sort((a: BlogPost, b: BlogPost) => b.data.pubDate - a.data.pubDate);

  // 获取所有标签
  const tagSet = new Set<string>();
  sortedPosts.forEach((post: BlogPost) => {
    post.data.tags.forEach((tag: string) => {
      tagSet.add(tag);
    });
  });
  const tags = Array.from(tagSet).sort();

  // 获取所有分类
  const categorySet = new Set<string>();
  sortedPosts.forEach((post: BlogPost) => {
    if (post.data.category) {
      categorySet.add(post.data.category);
    }
  });
  const categories = Array.from(categorySet).sort();

  // 构建最近文章列表（最多 20 篇）
  const recentPosts = sortedPosts.slice(0, 20);
  const site = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;

  let content = `# ${SITE_TITLE}\n\n`;
  content += `${SITE_DESCRIPTION}\n\n`;
  content += `${site} 是一个专注于技术分享、AI 前沿研究和个人成长思考的个人博客。\n\n`;

  content += `## 关于博主\n\n`;
  content += `博主 ${AUTHOR_NAME} 是一名热爱技术的开发者，关注 Astro、React、TypeScript 等前端技术，以及 AI 领域的最新进展。\n\n`;

  content += `## 核心内容分类\n\n`;
  content += categories.map((cat) => `- ${cat}`).join('\n');
  content += '\n\n';

  content += `## 内容标签\n\n`;
  content += tags.map((tag) => `- ${tag}`).join('\n');
  content += '\n\n';

  content += `## 站点结构\n\n`;
  content += `- 首页：${site}/\n`;
  content += `- 文章归档：${site}/blog/\n`;
  content += `- 标签云：${site}/tags/\n`;
  content += `- 关于博主：${site}/about/\n\n`;

  content += `## 最近文章\n\n`;
  content += recentPosts
    .map((post: BlogPost) => {
      const hash = hashMap.get(post.id) ?? post.id;
      let section = `### ${post.data.title}\n`;
      section += `- 链接：${site}/blog/${hash}/\n`;
      section += `- 日期：${new Date(post.data.pubDate).toISOString().split('T')[0]}\n`;
      if (post.data.category) {
        section += `- 分类：${post.data.category}\n`;
      }
      if (post.data.tags.length > 0) {
        section += `- 标签：${post.data.tags.join(', ')}\n`;
      }
      if (post.data.summary) {
        section += `- 摘要：${post.data.summary}`;
      } else if (post.data.description) {
        section += `- 摘要：${post.data.description}`;
      }
      return section;
    })
    .join('\n\n');

  content += '\n\n---\n\n';
  content +=
    '本文件（llms.txt）专为 AI 搜索引擎和生成式引擎优化（GEO）而创建，帮助 AI 系统更好地理解和索引本站内容。';

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
