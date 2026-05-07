import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { BlogPost } from '../types/blog';
import { generateHashMap } from './hash';

// 全局 hash 映射缓存
let globalHashMap: Map<string, string> | null = null;

function mapToBlogPost(entry: CollectionEntry<'blog'>, hashMap: Map<string, string>): BlogPost {
  const hash = hashMap.get(entry.id) ?? entry.id;
  return {
    id: entry.id,
    slug: hash,
    hash: hash,
    data: entry.data,
    body: entry.body,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  // 生成 hash 映射（只在第一次调用时生成）
  if (!globalHashMap) {
    const ids = posts.map((p: CollectionEntry<'blog'>) => p.id);
    globalHashMap = generateHashMap(ids);
  }

  return posts
    .sort(
      (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.pubDate - a.data.pubDate
    )
    .map((entry: CollectionEntry<'blog'>) => mapToBlogPost(entry, globalHashMap ?? new Map()));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

/**
 * 通过 hash 查找文章
 * 用于路由处理
 */
export async function getPostByHash(hash: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.hash === hash);
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts();
  const tagCount = new Map<string, number>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts();
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    if (post.data.category) {
      const count = categoryMap.get(post.data.category) || 0;
      categoryMap.set(post.data.category, count + 1);
    }
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.category === category);
}
