// Editorial integrity checks — run after `astro build` (pnpm verify).
// Errors fail the build; warnings report staleness/debt.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const DATA = join(ROOT, 'src', 'data');
const CONTENT_DIRS = [
  join(ROOT, 'src', 'content', 'articles'),
];
const today = new Date().toISOString().slice(0, 10);

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function* walk(dir, exts) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p, exts);
    else if (exts.some((x) => p.endsWith(x))) yield p;
  }
}

// ---------- 1. Data integrity ----------
const sources = JSON.parse(readFileSync(join(DATA, 'sources.json'), 'utf8'));
const claims = JSON.parse(readFileSync(join(DATA, 'claims.json'), 'utf8'));
const products = JSON.parse(readFileSync(join(DATA, 'products.json'), 'utf8'));

for (const [id, c] of Object.entries(claims)) {
  for (const sid of c.sourceIds ?? []) {
    if (!sources[sid]) err(`claims["${id}"] references missing source "${sid}"`);
  }
  if (!c.verifiedAt) err(`claims["${id}"] missing verifiedAt`);
  if (c.reviewBy && c.reviewBy < today)
    warn(`claims["${id}"] is stale (reviewBy ${c.reviewBy} < ${today}): ${c.subject}`);
}
for (const [id, s] of Object.entries(sources)) {
  if (!s.url?.startsWith('http')) err(`sources["${id}"] has no url`);
  if (!s.accessedAt) warn(`sources["${id}"] missing accessedAt`);
}
for (const [id, p] of Object.entries(products)) {
  if (p.affiliateStatus === 'approved' && !p.affiliateUrl)
    err(`products["${id}"] marked approved but has no affiliateUrl`);
  if (p.affiliateUrl && p.affiliateStatus !== 'approved')
    warn(`products["${id}"] has affiliateUrl but status is "${p.affiliateStatus}"`);
}

// ---------- 2. Content reference integrity ----------
const SOURCE_REF = /source:\s*'([A-Za-z]+)'|ids=\{\[([^\]]+)\]\}|#src-([A-Za-z]+)/g;
const SRC_ID_IN_LIST = /'([A-Za-z]+)'/g;
let mdxCount = 0;
for (const CONTENT of CONTENT_DIRS) {
  if (!existsSync(CONTENT)) continue;
  for (const f of walk(CONTENT, ['.mdx', '.md'])) {
    mdxCount++;
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(SOURCE_REF)) {
      if (m[1] && !sources[m[1]]) err(`${relative(ROOT, f)}: FactList source "${m[1]}" not in sources.json`);
      if (m[2]) {
        for (const idm of m[2].matchAll(SRC_ID_IN_LIST)) {
          if (!sources[idm[1]]) err(`${relative(ROOT, f)}: Sources id "${idm[1]}" not in sources.json`);
        }
      }
    }
  }
}

// ---------- 3. Built HTML checks ----------
const pages = [...walk(DIST, ['.html'])];
if (!pages.length) err('dist/ is empty — run astro build first');

const canonicals = new Map();
const routes = new Set(pages.map((p) => '/' + relative(DIST, p).replace(/\\/g, '/').replace(/index\.html$/, '')));
const isProd = process.env.PUBLIC_SITE_ENV === 'production';

for (const f of pages) {
  const rel = '/' + relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  const html = readFileSync(f, 'utf8');
  // Redirect stubs from astro.config `redirects` carry the target's canonical by design.
  if (/<meta http-equiv="refresh"/.test(html)) continue;

  // robots
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  if (!robots) err(`${rel}: missing robots meta`);
  else if (!isProd && robots !== 'noindex,nofollow') err(`${rel}: robots is "${robots}" outside production build`);
  else if (isProd && robots !== 'index,follow') err(`${rel}: production page is "${robots}"`);

  // canonical
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canon) err(`${rel}: missing canonical`);
  else if (canonicals.has(canon)) err(`${rel}: duplicate canonical ${canon} (also ${canonicals.get(canon)})`);
  else canonicals.set(canon, rel);

  // images need alt
  for (const im of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/alt="/.test(im[0])) err(`${rel}: <img> without alt — ${im[0].slice(0, 120)}`);
  }

  // internal links resolve — paths with an extension are static assets
  for (const lm of html.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)) {
    const target = lm[1];
    if (/\.[a-z0-9]+$/i.test(target)) {
      if (!existsSync(join(DIST, target))) err(`${rel}: broken asset link ${target}`);
      continue;
    }
    const normalized = target.endsWith('/') ? target : target + '/';
    if (!routes.has(normalized)) err(`${rel}: broken internal link ${target}`);
  }

  // every image, video and poster file the page asks for exists
  for (const sm of html.matchAll(/\s(?:src|poster|srcset)="([^"]+)"/g)) {
    for (const part of sm[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (!url.startsWith('/') || url.startsWith('//')) continue;
      if (!existsSync(join(DIST, decodeURI(url.split('?')[0])))) err(`${rel}: missing media file ${url}`);
    }
  }
  for (const vm of html.matchAll(/<video\b[^>]*>/g)) {
    if (!/aria-label="|aria-hidden="true"/.test(vm[0])) err(`${rel}: <video> without aria-label or aria-hidden`);
  }

  // sponsored rel only on affiliate links
  for (const am of html.matchAll(/<a\b[^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g)) {
    if (!/data-affiliate/.test(am[0])) err(`${rel}: rel="sponsored" on non-affiliate link`);
  }

  // commercial pages need disclosure
  if (rel.startsWith('/softr/') || rel.startsWith('/noloco/') || rel.startsWith('/fillout/') || rel.startsWith('/compare/')) {
    if (!/\sdata-disclosure[\s=>]/.test(html)) err(`${rel}: commercial page missing disclosure`);
  }
}

// ---------- 4. Media manifest ----------
// Every file in public/img/vendor/ and public/media/ has a provenance entry
// in src/data/media-manifest.ts, and every entry has its file.
{
  const manifest = readFileSync(join(DATA, 'media-manifest.ts'), 'utf8');
  const listed = new Set([...manifest.matchAll(/^\s+'([^']+\.(?:png|webp|jpe?g|mp4))': \{/gm)].map((m) => m[1]));
  const onDisk = [
    ...readdirSync(join(ROOT, 'public', 'img', 'vendor')).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)),
    ...(existsSync(join(ROOT, 'public', 'media')) ? readdirSync(join(ROOT, 'public', 'media')) : []),
  ];
  for (const f of onDisk) if (!listed.has(f)) err(`media file without manifest entry: ${f}`);
  for (const f of listed) if (!onDisk.includes(f)) err(`manifest entry without file: ${f}`);
  const withSource = (manifest.match(/\bsource: /g) ?? []).length;
  if (withSource < listed.size) err(`media manifest: ${listed.size - withSource} entr(ies) without a source`);
}

// ---------- report ----------
console.log(`checked ${pages.length} pages, ${mdxCount} articles, ${Object.keys(claims).length} claims`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
for (const e of errors) console.log(`  ✗ ${e}`);
if (errors.length) {
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\n0 errors, ${warnings.length} warning(s)`);
