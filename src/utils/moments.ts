import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { Moment } from '../types/blog';

function mapToMoment(entry: CollectionEntry<'moments'>): Moment {
  return {
    id: entry.id,
    data: entry.data,
    body: entry.body,
  };
}

export async function getAllMoments(): Promise<Moment[]> {
  const moments = await getCollection('moments');
  return moments
    .sort(
      (a: CollectionEntry<'moments'>, b: CollectionEntry<'moments'>) =>
        b.data.pubDate - a.data.pubDate
    )
    .map((entry: CollectionEntry<'moments'>) => mapToMoment(entry));
}

export async function getLatestMoments(count: number): Promise<Moment[]> {
  const moments = await getAllMoments();
  return moments.slice(0, count);
}
