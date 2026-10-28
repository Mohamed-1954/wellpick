// Section capture for our served build: full page plus one crop per section
// (header, every top-level block in <main>, footer) at 1440 and 390, light and dark,
// reduced motion so every reveal shows its complete state. Also chrome states:
// header after scroll, mobile menu open, nav hover and keyboard focus.
// Run: node scripts/bench/sections.mjs <outDir> [routeFilterRegex]
// Writes <outDir>/<id>__<w>__<theme>__full.png, __NN-<label>.png, and index.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs';

const [outDir, filter = ''] = process.argv.slice(2);
if (!outDir) {
  console.error('usage: node scripts/bench/sections.mjs <outDir> [routeFilterRegex]');
  process.exit(1);
}
const BASE = process.env.BENCH_BASE || 'http://localhost:4322';
const ROUTES = [
  ['home', '/'],
  ['softr', '/softr/'],
  ['noloco', '/noloco/'],
  ['fillout', '/fillout/'],
  ['softr-pricing', '/softr/pricing/'],
  ['noloco-pricing', '/noloco/pricing/'],
  ['fillout-pricing', '/fillout/pricing/'],
  ['guides', '/guides/'],
  ['compare', '/compare/'],
  ['start', '/start/'],
  ['costs', '/guides/portal-costs/'],
  ['vs', '/compare/softr-vs-noloco/'],
  ['vs-forms', '/compare/softr-forms-vs-fillout/'],
  ['guide-noloco', '/guides/build-noloco-client-portal/'],
  ['about', '/about/'],
  ['notfound', '/404/'],
].filter(([id]) => new RegExp(filter).test(id));
const WIDTHS = [
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: '390', width: 390, height: 844, mobile: true },
];
const HIDE = '.env-ribbon{display:none!important}';
let head = 'unknown';
try { head = execSync('git rev-parse --short HEAD').toString().trim(); } catch {}

await fs.mkdir(outDir, { recursive: true });
const index = [];
const browser = await chromium.launch({ channel: 'msedge' });

// Labels each capturable block: header, direct children of main (descending into
// wrapper divs), the footer's closing band and the footer.
function blocks() {
  const out = [];
  const label = (el) =>
    (el.getAttribute('aria-label') || el.querySelector('h1,h2')?.textContent || el.className || el.tagName)
      .toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40).replace(/-$/, '');
  const add = (el) => {
    const r = el.getBoundingClientRect();
    if (r.height < 40 || r.width < 200) return;
    out.push({ sel: el, label: label(el) });
  };
  document.querySelector('.site-header') && add(document.querySelector('.site-header'));
  const main = document.querySelector('main') || document.body;
  const walk = (parent) => {
    for (const el of parent.children) {
      if (['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName)) continue;
      const tag = el.tagName;
      if ((tag === 'DIV' || tag === 'ARTICLE') && !el.matches('section,[class*="hero"]') && el.children.length > 1 && el.getBoundingClientRect().height > 1600) walk(el);
      else add(el);
    }
  };
  walk(main);
  document.querySelector('.closing') && !main.contains(document.querySelector('.closing')) && add(document.querySelector('.closing'));
  document.querySelector('.site-footer') && add(document.querySelector('.site-footer'));
  out.forEach((b, i) => b.sel.setAttribute('data-cap', String(i)));
  return out.map((b, i) => ({ i, label: b.label }));
}

for (const [id, route] of ROUTES) {
  for (const w of WIDTHS) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({
        viewport: { width: w.width, height: w.height }, isMobile: w.mobile, hasTouch: w.mobile,
        deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: theme,
      });
      await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message.slice(0, 160)));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
      const stem = `${id}__${w.name}__${theme}`;
      try {
        await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
        // Lazy images that a quick scroll passes over may not load in headless
        // Edge; switch them to eager and wait for every image to settle.
        await page.evaluate(async () => {
          document.querySelectorAll('img[loading="lazy"]').forEach((im) => { im.loading = 'eager'; });
          for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
          window.scrollTo(0, 0);
          await document.fonts.ready;
          const imgs = Promise.all([...document.images].map((im) => (im.complete && im.naturalWidth ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
          await Promise.race([imgs, new Promise((r) => setTimeout(r, 15000))]);
        });
        await page.addStyleTag({ content: HIDE });
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outDir, `${stem}__full.png`), fullPage: true });
        const list = await page.evaluate(blocks);
        for (const b of list) {
          const file = `${stem}__${String(b.i).padStart(2, '0')}-${b.label}.png`;
          const el = page.locator(`[data-cap="${b.i}"]`);
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(120);
          await el.screenshot({ path: path.join(outDir, file) });
          index.push({ head, route, viewport: w.name, theme, state: 'reduced-motion, section', file });
        }
        index.push({ head, route, viewport: w.name, theme, state: 'reduced-motion, full page', file: `${stem}__full.png`, errors });
        // Chrome states, once per width/theme on home only.
        if (id === 'home') {
          await page.evaluate(() => window.scrollTo(0, 1600));
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(outDir, `${stem}__chrome-header-scrolled.png`), clip: { x: 0, y: 0, width: w.width, height: 160 } });
          index.push({ head, route, viewport: w.name, theme, state: 'header after scroll', file: `${stem}__chrome-header-scrolled.png` });
          await page.evaluate(() => window.scrollTo(0, 0));
          if (w.mobile) {
            await page.click('.nav-toggle');
            await page.waitForTimeout(500);
            await page.screenshot({ path: path.join(outDir, `${stem}__chrome-menu-open.png`) });
            index.push({ head, route, viewport: w.name, theme, state: 'mobile menu open', file: `${stem}__chrome-menu-open.png` });
            await page.keyboard.press('Escape');
          } else {
            await page.hover('.nav-desktop .nav-item >> nth=1');
            await page.waitForTimeout(250);
            await page.screenshot({ path: path.join(outDir, `${stem}__chrome-nav-hover.png`), clip: { x: 0, y: 0, width: w.width, height: 120 } });
            await page.mouse.move(5, 600);
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.waitForTimeout(200);
            await page.screenshot({ path: path.join(outDir, `${stem}__chrome-nav-focus.png`), clip: { x: 0, y: 0, width: w.width, height: 120 } });
            index.push({ head, route, viewport: w.name, theme, state: 'nav hover', file: `${stem}__chrome-nav-hover.png` });
            index.push({ head, route, viewport: w.name, theme, state: 'nav keyboard focus (3rd tab stop)', file: `${stem}__chrome-nav-focus.png` });
          }
        }
        console.log(`${stem}: ${list.length} sections${errors.length ? ' ERR ' + errors.join(' | ') : ''}`);
      } catch (e) {
        console.log(`FAIL ${stem}: ${e.message.slice(0, 200)}`);
      } finally {
        await ctx.close();
      }
    }
  }
}
await browser.close();
const idxFile = path.join(outDir, 'index.json');
let prev = [];
try { prev = JSON.parse(await fs.readFile(idxFile, 'utf8')); } catch {}
const files = new Set(index.map((x) => x.file));
await fs.writeFile(idxFile, JSON.stringify([...prev.filter((x) => !files.has(x.file)), ...index], null, 1));
