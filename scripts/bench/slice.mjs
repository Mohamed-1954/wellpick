// Slice tall full-page screenshots into readable segments.
// Run: node scripts/bench/slice.mjs <dir> [filterRegex]
// Writes <name>__sNN.png next to each *__full.png (1440: 1800px, 390: 1500px segments).
import fs from 'node:fs/promises';
import path from 'node:path';


const { chromium } = await import(
  'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs'
);
const [dir, filter = ''] = process.argv.slice(2);
const re = new RegExp(filter);
const files = (await fs.readdir(dir)).filter((f) => f.endsWith('__full.png') && re.test(f));
const browser = await chromium.launch({ channel: 'msedge' });
for (const f of files) {
  const wide = f.includes('__1440__');
  const W = wide ? 1440 : 390;
  const SEG = wide ? 1800 : 1500;
  const page = await browser.newPage({ viewport: { width: W, height: SEG } });
  const b64 = (await fs.readFile(path.resolve(dir, f))).toString('base64');
  await page.setContent(`<style>*{margin:0}</style><img id=i src="data:image/png;base64,${b64}">`);
  await page.waitForFunction(() => document.getElementById('i').complete);
  const h = await page.evaluate(() => document.getElementById('i').naturalHeight);
  let n = 0;
  for (let y = 0; y < h; y += SEG) {
    n++;
    await page.screenshot({
      path: path.join(dir, f.replace('__full.png', `__s${String(n).padStart(2, '0')}.png`)),
      fullPage: true, clip: { x: 0, y, width: W, height: Math.min(SEG, h - y) }
    });
  }
  console.log(`${f}: ${n} segments (${h}px)`);
  await page.close();
}
await browser.close();
