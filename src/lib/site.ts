import { getEntry } from 'astro:content';

export type ProductId = 'softr' | 'noloco' | 'fillout';

export const PRODUCT_IDS: ProductId[] = ['softr', 'noloco', 'fillout'];

/** Site environment: controls indexing and the preview ribbon.
 *  local       the safe default: noindex, ribbon on every page
 *  staging     deployed for review: noindex, no ribbon, real canonical URLs
 *  production  indexable, sitemap in robots.txt */
export const SITE_ENV = import.meta.env.PUBLIC_SITE_ENV ?? 'local';
export const IS_PRODUCTION = SITE_ENV === 'production';
export const IS_LOCAL = SITE_ENV !== 'production' && SITE_ENV !== 'staging';
export const ROBOTS_DIRECTIVE = IS_PRODUCTION ? 'index,follow' : 'noindex,nofollow';

export const SITE = {
  name: 'Wellpick',
  url: import.meta.env.SITE ?? 'http://localhost:4321',
  description:
    'Independent software picks for small service businesses: intake, client portals and team operations, priced and sourced.',
} as const;

export async function getProduct(id: ProductId) {
  const entry = await getEntry('products', id);
  if (!entry) throw new Error(`Unknown product: ${id}`);
  return entry.data;
}

export function productHue(id: ProductId): number {
  return { softr: 285, noloco: 195, fillout: 75 }[id];
}
