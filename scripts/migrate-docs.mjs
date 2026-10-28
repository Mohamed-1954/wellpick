// Migrates Docusaurus MDX docs into the Astro articles collection.
// Usage: node scripts/migrate-docs.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../../website/docs', import.meta.url));
const ARTICLES = fileURLToPath(new URL('../src/content/articles', import.meta.url));
const DOCS = fileURLToPath(new URL('../src/content/docs', import.meta.url));

const PRODUCT_RE = /product="(softr|noloco|fillout)"/g;

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith('.mdx')) yield p;
  }
}

function parseFm(fm) {
  const out = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v === 'null') v = null;
    out[m[1]] = v;
  }
  return out;
}

const DIAGRAMS = new Set(['EntityDiagram', 'FlowDiagram', 'LayerDiagram']);
let count = 0;

for (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  const dir = dirname(rel); // '', 'guides', 'compare'
  const name = basename(rel, '.mdx');
  let text = readFileSync(file, 'utf8');

  // --- frontmatter ---
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n/);
  const oldFm = fmMatch ? parseFm(fmMatch[1]) : {};
  const body = fmMatch ? text.slice(fmMatch[0].length) : text;

  const type = dir === 'guides' ? 'guide' : dir === 'compare' ? 'comparison' : 'page';
  const slugPath = dir ? `${dir}/${name}` : name;
  const products = [
    ...new Set([
      ...[...body.matchAll(PRODUCT_RE)].map((m) => m[1]),
      ...(slugPath.includes('softr') ? ['softr'] : []),
      ...(slugPath.includes('noloco') ? ['noloco'] : []),
      ...(slugPath.includes('fillout') ? ['fillout'] : []),
    ]),
  ];
  const newFm = [
    '---',
    `title: ${oldFm.title ?? name}`,
    `description: ${oldFm.description ?? ''}`,
    `type: ${type}`,
    `products: [${products.join(', ')}]`,
    `publishedAt: 2026-09-18`,
    `updatedAt: 2026-09-18`,
    '---',
  ].join('\n');

  // --- imports ---
  // articles/guides/x.mdx → ../../../components/; articles/x.mdx → ../../components/
  const depth = dir === '.' ? '../../' : '../../../';
  const lines = body.split('\n').map((line) => {
    // default import: import X from "@site/src/components/X";
    let m = line.match(/^import (\w+) from "@site\/src\/components\/(\w+)";/);
    if (m) return `import ${m[1]} from "${depth}components/${m[2]}.astro";`;
    // named diagram imports: import { EntityDiagram } from "@site/src/components/Diagrams";
    m = line.match(/^import \{ ([^}]+) \} from "@site\/src\/components\/Diagrams";/);
    if (m) {
      return m[1]
        .split(',')
        .map((n) => n.trim())
        .filter((n) => DIAGRAMS.has(n))
        .map((n) => `import ${n} from "${depth}components/${n}.astro";`)
        .join('\n');
    }
    return line;
  });

  // --- JSX fixes ---
  const out = lines
    .join('\n')
    .replace(/className=/g, 'class=')
    .replace(/to="\//g, 'href="/'); // NextSteps items use to= — keep? NextSteps.astro expects `to` in item objects, not JSX attr

  const destDir = dir === 'guides' ? join(DOCS, 'guides') : join(ARTICLES, dir);
  mkdirSync(destDir, { recursive: true });
  writeFileSync(join(destDir, name + '.mdx'), newFm + '\n' + out);
  count++;
}
console.log(`migrated ${count} files → ${ARTICLES} + ${DOCS}`);
