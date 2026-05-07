export const prerender = true;

import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { generateHashMap } from '../utils/hash';

export async function GET(context: { site: string }) {
  const posts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => !data.draft);

  // 生成 hash 映射
  const ids = posts.map((p: CollectionEntry<'blog'>) => p.id);
  const hashMap = generateHashMap(ids);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post: CollectionEntry<'blog'>) => {
      const hash = hashMap.get(post.id) ?? post.id;
      return {
        title: post.data.title,
        description: post.data.description,
        link: `/blog/${hash}/`,
        pubDate: new Date(post.data.pubDate),
      };
    }),
  });
}
