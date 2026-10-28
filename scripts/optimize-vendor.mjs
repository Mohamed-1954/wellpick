// Generates responsive WebP variants of every vendor capture in
// public/img/vendor/ → public/img/vendor/w/<name>-<width>.webp.
// Widths never exceed the source. Re-run after adding or replacing a capture:
//   node scripts/optimize-vendor.mjs
// sharp is not a direct dependency (Astro brings it); find its pnpm folder.
import { readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, parse } from 'node:path';

const PNPM = fileURLToPath(new URL('../node_modules/.pnpm/', import.meta.url));
const sharpDir = readdirSync(PNPM).find((d) => d.startsWith('sharp@'));
const { default: sharp } = await import(pathToFileURL(join(PNPM, sharpDir, 'node_modules/sharp/dist/index.mjs')).href);

const DIR = fileURLToPath(new URL('../public/img/vendor/', import.meta.url));
const OUT = join(DIR, 'w');
const WIDTHS = [640, 1200, 2000];
mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(DIR)) {
  if (!/\.(png|webp|jpe?g)$/i.test(file)) continue;
  const src = join(DIR, file);
  const { width } = await sharp(src).metadata();
  const { name } = parse(file);
  for (const w of WIDTHS) {
    const target = Math.min(w, width);
    await sharp(src)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log(`${file} → ${WIDTHS.map((w) => `${name}-${w}.webp`).join(', ')}`);
}
