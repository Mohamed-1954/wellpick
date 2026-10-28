// On-page SEO audit of the built site (dist/), after the seo-audit skill's
// on-page checklist: one title, one H1, description length, canonical,
// robots, Open Graph, html lang, image alt, JSON-LD that parses, and
// duplicate titles or descriptions across pages.
// Run after a build: node scripts/seo-check.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') files.push(p);
  }
})(DIST);

const issues = [];
const seen = { title: new Map(), desc: new Map() };
const one = (html, re) => (html.match(re) ?? [])[1];
const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  if (/http-equiv="refresh"/.test(html)) continue; // redirect stubs
  const note = (m) => issues.push(`${route}: ${m}`);
  const title = decode(one(html, /<title>([^<]*)<\/title>/));
  const desc = decode(one(html, /<meta name="description" content="([^"]*)"/));
  if (!title) note('no <title>');
  else if (title.length > 65) note(`title ${title.length} chars: ${title}`);
  if (!desc) note('no meta description');
  else if (desc.length < 70 || desc.length > 170) note(`description ${desc.length} chars`);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) note(`${h1} <h1>`);
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) note('no canonical');
  else if (!canonical.endsWith(route)) note(`canonical ${canonical} does not end with ${route}`);
  if (!/<meta name="robots"/.test(html)) note('no robots meta');
  if (!/<html lang="/.test(html)) note('no html lang');
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!html.includes(`property="${p}"`)) note(`no ${p}`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\balt="/.test(img)) note(`img without alt: ${img.slice(0, 80)}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { note('JSON-LD does not parse'); }
  }
  if (title) seen.title.set(title, [...(seen.title.get(title) ?? []), route]);
  if (desc) seen.desc.set(desc, [...(seen.desc.get(desc) ?? []), route]);
}
for (const [kind, map] of Object.entries(seen)) for (const [v, routes] of map) if (routes.length > 1) issues.push(`duplicate ${kind} on ${routes.join(', ')}: ${v.slice(0, 60)}`);

console.log(`${files.length} pages checked`);
console.log(issues.length ? issues.join('\n') : 'No on-page issues found.');
process.exitCode = issues.length ? 1 : 0;
