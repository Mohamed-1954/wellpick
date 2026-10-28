import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const products = defineCollection({
  loader: file('src/data/products.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tagline: z.string(),
    hue: z.number(),
    officialUrl: z.string().url(),
    pricingUrl: z.string().url(),
    affiliateUrl: z.string().url().nullable().default(null),
    affiliateStatus: z.enum(['none', 'applied', 'approved']).default('none'),
    videoIds: z.array(z.string()).default([]),
    order: z.number(),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** Shorter <title> for search results when the H1 runs long (≤ 54 chars + " | Wellpick") */
    seoTitle: z.string().max(54).optional(),
    description: z.string(),
    type: z.enum([
      'hub',
      'review',
      'pricing',
      'guide',
      'comparison',
      'alternatives',
      'use-case',
      'page',
      'post',
    ]),
    products: z.array(reference('products')).default([]),
    sourceIds: z.array(reference('sources')).default([]),
    claimIds: z.array(reference('claims')).default([]),
    author: reference('authors').default({ collection: 'authors', id: 'editorial' }),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    /** Where the guide sits in the reader's job: decide → build → launch */
    stage: z.enum(['decide', 'build', 'launch']).optional(),
    /** Sort order inside its stage */
    order: z.number().default(99),
    /** Vendor capture shown in the article hero (file in public/img/vendor/) */
    cover: z
      .object({ name: z.string(), alt: z.string() })
      .optional(),
    draft: z.boolean().default(false),
    /** Blog posts (type: post): the topic that sets cover color and filter */
    topic: z.enum(['intake', 'portals', 'operations', 'ai', 'web', 'buying']).optional(),
    /** Blog posts: the one post staged as the lead on /blog/ */
    featured: z.boolean().default(false),
  }),
});

const sources = defineCollection({
  loader: file('src/data/sources.json'),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    publisher: z.string(),
    accessedAt: z.coerce.date(),
  }),
});

const claims = defineCollection({
  loader: file('src/data/claims.json'),
  schema: z.object({
    subject: z.string(),
    category: z.enum([
      'pricing',
      'limit',
      'capability',
      'affiliate-terms',
      'video',
    ]),
    statement: z.string(),
    value: z.unknown().optional(),
    sourceIds: z.array(reference('sources')).min(1),
    verifiedAt: z.coerce.date(),
    reviewBy: z.coerce.date().optional(),
  }),
});

const authors = defineCollection({
  loader: file('src/data/authors.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
  }),
});

export const collections = { products, articles, sources, claims, authors };
