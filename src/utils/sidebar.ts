import type { CollectionEntry } from 'astro:content';
import { getEntry } from 'astro:content';
import type { BlogTag, Moment } from '../types/blog';
import { getLatestMoments } from './moments';
import { getAllTags } from './posts';

export interface SidebarData {
  tags: BlogTag[];
  site: CollectionEntry<'site'> | undefined;
  moments: Moment[];
}

export async function getSidebarData(): Promise<SidebarData> {
  const [tags, site, moments] = await Promise.all([
    getAllTags(),
    getEntry('site', 'sidebar'),
    getLatestMoments(5),
  ]);
  return { tags, site, moments };
}
