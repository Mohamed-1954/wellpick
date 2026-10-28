import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

// llms.txt (https://llmstxt.org): a plain index of the site for AI assistants,
// after the ai-seo skill. Built from the same content collection as the pages,
// so it never lists a page that does not exist.
export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', (a) => !a.data.draft);
  const url = (id: string) => new URL(`/${id}/`, SITE.url).href;
  const list = (type: string) =>
    articles
      .filter((a) => a.data.type === type)
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
      .map((a) => `- [${a.data.title}](${url(a.id)}): ${a.data.description}`)
      .join('\n');
  const body = `# ${SITE.name}

> ${SITE.description}

Prices, limits and vendor claims carry a source and a check date on each page. No affiliate links are active; product links go to the vendors' official sites.

## Tools

- [Fillout](${url('fillout')}): intake forms that write records ([pricing](${url('fillout/pricing')}))
- [Softr](${url('softr')}): a client portal on your records ([pricing](${url('softr/pricing')}))
- [Noloco](${url('noloco')}): portal and team operations in one app ([pricing](${url('noloco/pricing')}))

## Guides

${list('guide')}

## Comparisons

${list('comparison')}

## Blog

${list('post')}

## About

${list('page')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
