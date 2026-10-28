// Reference chrome capture: header at top and after scroll, each desktop nav
// dropdown, the mobile menu open, and the full footer, for live reference sites.
// Run: node scripts/bench/chrome-refs.mjs <outDir> [idFilterRegex]
// Best effort per site: every attempted state is logged to <outDir>/chrome-log.json,
// including the ones that could not be opened.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs';

const [outDir, filter = ''] = process.argv.slice(2);
const SITES = [
  ['airtable', 'https://www.airtable.com/'],
  ['airtable-platform', 'https://www.airtable.com/platform/app-building'],
  ['clickup', 'https://clickup.com/'],
  ['customerio', 'https://customer.io/'],
  ['mintlify', 'https://www.mintlify.com/'],
  ['amplemarket', 'https://www.amplemarket.com/'],
  ['huly', 'https://huly.io/'],
  ['unicorn', 'https://www.unicorn.studio/'],
].filter(([id]) => new RegExp(filter).test(id));
const HIDE = `#onetrust-banner-sdk,#onetrust-consent-sdk,#CybotCookiebotDialog,.osano-cm-window,#hs-eu-cookie-confirmation,
[class*="cookie-banner"],[id*="cookie-banner"],[class*="CookieBanner"],#intercom-container,.intercom-lightweight-app,
#drift-widget-container,#hubspot-messages-iframe-container{display:none!important}`;
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
await fs.mkdir(outDir, { recursive: true });
const log = [];
const browser = await chromium.launch({ channel: 'msedge' });

async function dismiss(page) {
  const re = /^(accept|accept all|accept all cookies|allow all|allow|agree|i agree|got it|ok|okay)$/i;
  for (const btn of await page.locator('button, a[role="button"]').all()) {
    try {
      const t = ((await btn.innerText({ timeout: 300 })) || '').trim();
      if (re.test(t) && (await btn.isVisible())) { await btn.click({ timeout: 1000 }); return; }
    } catch {}
  }
}
async function open(ctx, url) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);
  await dismiss(page);
  await page.addStyleTag({ content: HIDE });
  await page.waitForTimeout(500);
  return page;
}
const shot = async (page, id, state, file, opts) => {
  try {
    await page.screenshot({ path: path.join(outDir, file), ...opts });
    log.push({ id, state, file, url: page.url(), captured: '2026-10-03', ok: true });
  } catch (e) {
    log.push({ id, state, file, url: page.url(), ok: false, error: e.message.slice(0, 120) });
  }
};

for (const [id, url] of SITES) {
  // Desktop
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    const page = await open(ctx, url);
    await shot(page, id, 'header top', `${id}__1440__header-top.png`, { clip: { x: 0, y: 0, width: 1440, height: 180 } });
    // Dropdown triggers: header elements announcing a popup, or nav buttons.
    const triggers = await page.evaluate(() => {
      const hdr = document.querySelector('header') || document.querySelector('nav');
      if (!hdr) return [];
      const els = [...hdr.querySelectorAll('[aria-haspopup],[aria-expanded],nav button,[class*="dropdown" i] > a,[class*="dropdown" i] > button,[class*="trigger" i]')]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 10 && r.top < 140 && r.left < 1100; });
      const seen = new Set();
      return els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 24) }; })
        .filter((t) => t.t && !seen.has(t.t) && seen.add(t.t)).slice(0, 4);
    });
    if (!triggers.length) log.push({ id, state: 'desktop dropdown', ok: false, error: 'no dropdown trigger found in header' });
    for (const [n, t] of triggers.entries()) {
      await page.mouse.move(t.x, t.y);
      await page.waitForTimeout(900);
      let opened = await page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().height > 200 || !!document.querySelector('[aria-expanded="true"]'));
      if (!opened) { await page.mouse.click(t.x, t.y).catch(() => {}); await page.waitForTimeout(900); }
      await shot(page, id, `dropdown "${t.t}"`, `${id}__1440__dropdown-${n + 1}.png`, { clip: { x: 0, y: 0, width: 1440, height: 760 } });
      await page.keyboard.press('Escape');
      await page.mouse.move(1400, 880);
      await page.waitForTimeout(500);
      if (!page.url().startsWith(url.replace(/\/$/, ''))) await page.goto(url, { waitUntil: 'domcontentloaded' }).then(() => page.waitForTimeout(2500));
    }
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.waitForTimeout(1200);
    await shot(page, id, 'header after scroll', `${id}__1440__header-scrolled.png`, { clip: { x: 0, y: 0, width: 1440, height: 180 } });
    await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 1500)); window.scrollTo(0, document.body.scrollHeight); });
    await page.waitForTimeout(1500);
    const foot = page.locator('footer').last();
    if (await foot.count()) {
      try {
        await foot.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await foot.screenshot({ path: path.join(outDir, `${id}__1440__footer.png`) });
        log.push({ id, state: 'footer', file: `${id}__1440__footer.png`, url: page.url(), captured: '2026-10-03', ok: true });
      } catch (e) { log.push({ id, state: 'footer', ok: false, error: e.message.slice(0, 120) }); }
    } else log.push({ id, state: 'footer', ok: false, error: 'no <footer> element' });
  } catch (e) {
    log.push({ id, state: 'desktop load', ok: false, error: e.message.slice(0, 160) });
  }
  await ctx.close();

  // Mobile
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: UA_MOBILE, deviceScaleFactor: 1 });
  try {
    const page = await open(mctx, url);
    await shot(page, id, 'mobile header', `${id}__390__header.png`, { clip: { x: 0, y: 0, width: 390, height: 160 } });
    const btn = await page.evaluate(() => {
      const cands = [...document.querySelectorAll('header button, nav button, [aria-label*="menu" i], [aria-label*="navigation" i], [class*="hamburger" i], [class*="burger" i], [class*="menu-button" i], [class*="nav-toggle" i]')]
        .filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 12 && r.top < 120 && r.left > 200 && s.visibility !== 'hidden' && s.display !== 'none'; });
      const e = cands.sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left)[0];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (btn) {
      await page.mouse.click(btn.x, btn.y);
      await page.waitForTimeout(1200);
      await shot(page, id, 'mobile menu open', `${id}__390__menu-open.png`, {});
    } else log.push({ id, state: 'mobile menu open', ok: false, error: 'no menu button found' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await page.addStyleTag({ content: HIDE });
    await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 1500)); window.scrollTo(0, document.body.scrollHeight); });
    await page.waitForTimeout(1200);
    const foot = page.locator('footer').last();
    if (await foot.count()) {
      try {
        await foot.screenshot({ path: path.join(outDir, `${id}__390__footer.png`) });
        log.push({ id, state: 'mobile footer', file: `${id}__390__footer.png`, url: page.url(), captured: '2026-10-03', ok: true });
      } catch (e) { log.push({ id, state: 'mobile footer', ok: false, error: e.message.slice(0, 120) }); }
    }
  } catch (e) {
    log.push({ id, state: 'mobile load', ok: false, error: e.message.slice(0, 160) });
  }
  await mctx.close();
  console.log(id, log.filter((l) => l.id === id).map((l) => `${l.state}:${l.ok ? 'ok' : 'FAIL'}`).join(', '));
}
await browser.close();
await fs.writeFile(path.join(outDir, 'chrome-log.json'), JSON.stringify(log, null, 1));
