// Derives UI-only crops from the fillout.com marketing captures in
// public/img/vendor/ (those files include site nav, cookie banner and
// headline fragments — the crops isolate the depicted UI region).
// Run: node scripts/crop-vendor.mjs
import sharp from '../node_modules/.pnpm/sharp@0.35.4/node_modules/sharp/dist/index.mjs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../public/img/vendor/', import.meta.url));

const crops = [
  // fillout-home-2.png (1440x900): four marketing cards
  { src: 'fillout-home-2.png', out: 'fillout-workflow.png', left: 740, top: 95, width: 555, height: 295 },
  { src: 'fillout-home-2.png', out: 'fillout-form.png', left: 160, top: 100, width: 520, height: 285 },
  // fillout-airtable-2.png (1440x900): form → Airtable composite, bottom right
  { src: 'fillout-airtable-2.png', out: 'fillout-airtable-sync.png', left: 690, top: 505, width: 720, height: 345 },
  // fillout-home-3.png (1440x900): form + theme designer panel
  { src: 'fillout-home-3.png', out: 'fillout-designer.png', left: 550, top: 135, width: 760, height: 500 },
];

for (const c of crops) {
  await sharp(DIR + c.src)
    .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
    .toFile(DIR + c.out);
  console.log('wrote', c.out);
}
