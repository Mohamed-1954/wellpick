// Element crop helper: screenshots one element on a served page at 1440x900
// and 390x844, optionally again in dark theme.
// Run: node scripts/bench/crop.mjs <route> <cssSelector> <outPrefix> [--dark]
// Produces <outPrefix>-1440.png and <outPrefix>-390.png (and -dark- variants
// with --dark). Playwright resolves from the npx cache (see capture.mjs).
import { chromium } from 'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs';

const [route, selector, outPrefix, ...flags] = process.argv.slice(2);
if (!route || !selector || !outPrefix) {
  console.error('usage: node scripts/bench/crop.mjs <route> <cssSelector> <outPrefix> [--dark]');
  process.exit(1);
}
const dark = flags.includes('--dark');
const BASE = process.env.BENCH_BASE || 'http://localhost:4322';
const WIDTHS = [
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: '390', width: 390, height: 844, mobile: true },
];

const browser = await chromium.launch({ channel: 'msedge' });
for (const w of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: w.width, height: w.height },
    isMobile: w.mobile,
    hasTouch: w.mobile,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)));
  try {
    await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
    await page.addStyleTag({ content: '.env-ribbon{display:none!important}' });
    await page.waitForTimeout(600);
    const take = async (suffix) => {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await el.screenshot({ path: `${outPrefix}-${suffix}.png` });
      console.log(`${outPrefix}-${suffix}.png`);
    };
    await take(w.name);
    if (dark) {
      await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
      await page.waitForTimeout(300);
      await take(`dark-${w.name}`);
    }
    if (errors.length) console.log(`  page errors @${w.name}:`, errors);
  } catch (e) {
    console.log(`FAIL ${w.name}: ${e.message.slice(0, 200)}`);
  } finally {
    await ctx.close();
  }
}
await browser.close();
