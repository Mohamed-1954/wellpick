// Page checks: horizontal overflow at five widths, page errors, and WCAG
// contrast of rendered text colors against their painted backgrounds.
// Run: node scripts/bench/check.mjs <route> [--contrast ".sel1,.sel2"] [--dark]
// Playwright resolves from the npx cache (see capture.mjs).
import { chromium } from 'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs';

const [route, ...rest] = process.argv.slice(2);
if (!route) {
  console.error('usage: node scripts/bench/check.mjs <route> [--contrast ".sel1,.sel2"] [--dark]');
  process.exit(1);
}
const dark = rest.includes('--dark');
const csel = rest.find((a) => a.startsWith('--contrast='))?.slice('--contrast='.length).split(',').filter(Boolean) ?? [];
const BASE = process.env.BENCH_BASE || 'http://localhost:4322';
const WIDTHS = [320, 390, 768, 1024, 1440];

// Runs in the page. Converts any computed CSS color to sRGB via canvas, then
// composites over the first non-transparent painted ancestor background.
function contrastReport(selectors) {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  // Paint the color and read the pixel back: computed styles and canvas
  // fillStyle keep oklch() strings, so string parsing is not reliable.
  const toSrgb = (css) => {
    if (!css || css === 'transparent' || /rgba\(0, 0, 0, 0\)/.test(css)) return [0, 0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.globalAlpha = 1;
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return [0, 0, 0, 0];
    // Un-premultiplied bytes; alpha kept for compositing.
    return [r / 255, g / 255, b / 255, a / 255];
  };
  const lum = ([r, g, b]) => {
    const f = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const paintOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const c = toSrgb(bg);
      if (c && c[3] > 0.99) return c;
      if (c && c[3] > 0) {
        // translucent bg: composite onto the next painted ancestor
        let under = null;
        for (let p = n.parentElement; p && !under; p = p.parentElement) {
          const c2 = toSrgb(getComputedStyle(p).backgroundColor);
          if (c2 && c2[3] > 0.99) under = c2;
        }
        under ??= toSrgb(getComputedStyle(document.body).backgroundColor) ?? [1, 1, 1, 1];
        return [0, 1, 2].map((i) => c[i] * c[3] + under[i] * (1 - c[3])).concat(1);
      }
    }
    return [1, 1, 1, 1];
  };
  const out = [];
  for (const sel of selectors) {
    for (const el of document.querySelectorAll(sel)) {
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none' || !el.textContent.trim()) continue;
      const fg0 = toSrgb(s.color);
      if (!fg0) { out.push({ sel, text: el.textContent.trim().slice(0, 40), error: `unparsed ${s.color}` }); continue; }
      const bg = paintOf(el);
      const fg = fg0[3] >= 1 ? fg0 : [0, 1, 2].map((i) => fg0[i] * fg0[3] + bg[i] * (1 - fg0[3])).concat(1);
      const [l1, l2] = [lum(fg), lum(bg)];
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      out.push({
        sel,
        text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 48),
        size: s.fontSize, weight: s.fontWeight,
        fg: s.color, bg: getComputedStyle(el).backgroundColor,
        ratio: Math.round(ratio * 100) / 100,
      });
    }
  }
  return out;
}

const browser = await chromium.launch({ channel: 'msedge' });
const pageErrors = new Set();
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => pageErrors.add(e.message.slice(0, 140)));
  try {
    await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
    await page.addStyleTag({ content: '.env-ribbon{display:none!important}' });
    if (dark) await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await page.waitForTimeout(500);
    const res = await page.evaluate(() => ({
      sw: document.scrollingElement.scrollWidth,
      cw: document.scrollingElement.clientWidth,
    }));
    console.log(`${route} @${w}: scrollWidth ${res.sw} ${res.sw > res.cw ? '> OVERFLOW' : '<= clientWidth ' + res.cw}`);
  } catch (e) {
    console.log(`${route} @${w}: FAIL ${e.message.slice(0, 160)}`);
  } finally {
    await ctx.close();
  }
}
if (csel.length) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => pageErrors.add(e.message.slice(0, 140)));
  await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
  if (dark) await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(500);
  const rows = await page.evaluate(contrastReport, csel);
  for (const r of rows) {
    if (r.error) { console.log(`  contrast ${r.sel}: ${r.error}`); continue; }
    const need = parseFloat(r.size) >= 24 || (parseFloat(r.size) >= 18.66 && parseInt(r.weight) >= 700) ? 3 : 4.5;
    console.log(`  contrast ${r.sel} "${r.text}" ${r.size}/${r.weight} → ${r.ratio}:1 (needs ${need})${r.ratio < need ? '  ✗ FAIL' : ''}`);
  }
  await ctx.close();
}
for (const e of pageErrors) console.log(`  page error: ${e}`);
await browser.close();
