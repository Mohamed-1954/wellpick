import type { APIRoute } from 'astro';
import { IS_PRODUCTION, SITE } from '../lib/site';

// Production: crawl everything and point at the sitemap. Every other build
// allows crawling but sends no sitemap: crawlers must be able to fetch a page
// to read its noindex tag (a robots.txt block would hide the tag and can
// still leave bare URLs in an index).
export const GET: APIRoute = () => {
  const body = IS_PRODUCTION
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', SITE.url).href}\n`
    : `User-agent: *\nAllow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
