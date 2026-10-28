import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'articles'>;

/** Words in the MDX source, minus import lines and tags: a fair reading estimate. */
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').replace(/^import .*$/gm, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 230));
}

/** Published blog posts, newest first (ties keep the title order). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('articles', (a) => a.data.type === 'post' && !a.data.draft);
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.data.title.localeCompare(b.data.title),
  );
}

export const postSlug = (p: Post) => `/${p.id}/`;
