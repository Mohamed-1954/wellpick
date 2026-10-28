// Benchmark capture: full-page screenshots at 1440 and 390 plus computed-style
// measurements and a motion log, for our pages and the benchmark sites.
// Run: node scripts/bench/capture.mjs <pages.json> <outDir> [concurrency]
// pages.json: [{ "id": "clickup-pricing", "url": "https://..." }
//              | { "id": "...", "discoverFrom": "https://...", "match": "regex" }]
// Playwright is not a project dependency; it resolves from the npx cache.
import fs from 'node:fs/promises';
import path from 'node:path';

const { chromium } = await import(
  'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs'
);

const [pagesFile, outDir, conc = '3'] = process.argv.slice(2);
const pages = JSON.parse(await fs.readFile(pagesFile, 'utf8'));
const WIDTHS = [
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: '390', width: 390, height: 844, mobile: true },
];
const MAX_SHOT_H = 16000;
await fs.mkdir(outDir, { recursive: true });

const HIDE_CSS = `
  .env-ribbon, #onetrust-banner-sdk, #onetrust-consent-sdk, #CybotCookiebotDialog, .osano-cm-window,
  #hs-eu-cookie-confirmation, [class*="cookie-banner"], [id*="cookie-banner"], [class*="CookieBanner"],
  [aria-label*="cookie" i][role="dialog"], #intercom-container, .intercom-lightweight-app,
  #drift-widget-container, #hubspot-messages-iframe-container { display: none !important; }
`;

async function dismissConsent(page) {
  const re = /^(accept|accept all|accept all cookies|allow all|allow|agree|i agree|got it|ok|okay)$/i;
  for (const btn of await page.locator('button, a[role="button"]').all()) {
    try {
      const t = ((await btn.innerText({ timeout: 300 })) || '').trim();
      if (re.test(t) && (await btn.isVisible())) { await btn.click({ timeout: 1000 }); return t; }
    } catch { /* ignore */ }
  }
  return null;
}

// Runs in the page. Returns measured computed styles.
function measure() {
  const vw = document.documentElement.clientWidth;
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05;
  };
  const px = (v) => Math.round(parseFloat(v) * 10) / 10;
  const type = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 70),
      family: s.fontFamily.split(',')[0].replace(/"/g, ''),
      size: px(s.fontSize), weight: s.fontWeight,
      lh: s.lineHeight === 'normal' ? 'normal' : px(s.lineHeight),
      ls: s.letterSpacing, color: s.color, width: Math.round(r.width),
      wdth: s.fontVariationSettings !== 'normal' ? s.fontVariationSettings : undefined,
    };
  };
  const all = [...document.querySelectorAll('body *')];
  const visible = all.filter(vis);
  const hist = (arr, n = 8) => {
    const m = new Map();
    for (const [k, w] of arr) m.set(k, (m.get(k) || 0) + (w ?? 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, c]) => `${k} ×${Math.round(c)}`);
  };
  const header = document.querySelector('header') || document.querySelector('nav');
  const hr = header?.getBoundingClientRect();
  const navLinks = header ? [...header.querySelectorAll('a, button')].filter(vis).slice(0, 8).map(type) : [];
  const isTransparent = (c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
  const buttons = visible
    .filter((el) => el.matches('a, button'))
    .filter((el) => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      return !isTransparent(s.backgroundColor) && r.height >= 30 && r.height <= 72 && r.width < 420 && el.textContent.trim().length > 1;
    })
    .slice(0, 6)
    .map((el) => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      return { text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), bg: s.backgroundColor, color: s.color,
        radius: s.borderRadius, pad: s.padding, size: px(s.fontSize), weight: s.fontWeight,
        h: Math.round(r.height), border: s.borderTopWidth !== '0px' ? `${s.borderTopWidth} ${s.borderTopColor}` : 'none' };
    });
  const centered = visible
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width < vw - 8 && r.width > 280 && r.height > 60 && Math.abs(r.left - (vw - r.right)) < 2)
    .map((r) => [Math.round(r.width), 1]);
  const sections = [...document.querySelectorAll('main > *, main > * > section, section, [class*="section" i]')]
    .filter(vis)
    .map((el) => getComputedStyle(el))
    .filter((s) => parseFloat(s.paddingTop) >= 24 || parseFloat(s.paddingBottom) >= 24)
    .map((s) => [`${px(s.paddingTop)}/${px(s.paddingBottom)}`, 1]);
  const radii = visible
    .map((el) => [el, getComputedStyle(el)])
    .filter(([el, s]) => s.borderRadius !== '0px' && (!isTransparent(s.backgroundColor) || parseFloat(s.borderTopWidth) > 0 || el.tagName === 'IMG'))
    .map(([, s]) => [s.borderRadius, 1]);
  const bgs = visible
    .map((el) => [getComputedStyle(el).backgroundColor, el.getBoundingClientRect()])
    .filter(([c]) => !isTransparent(c))
    .map(([c, r]) => [c, (r.width * r.height) / 1e4]);
  const inkColors = visible
    .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 20))
    .map((el) => [getComputedStyle(el).color, 1]);
  const borders = visible
    .map((el) => getComputedStyle(el))
    .filter((s) => parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderBottomWidth) > 0)
    .map((s) => [`${s.borderTopWidth || s.borderBottomWidth} ${s.borderTopColor}`, 1]);
  const paras = [...document.querySelectorAll('main p, article p, p')]
    .filter((p) => vis(p) && p.textContent.trim().length > 90).slice(0, 3).map(type);
  const table = document.querySelector('table');
  const tableInfo = table && vis(table) ? {
    th: type(table.querySelector('th')), td: type(table.querySelector('td')),
    tdPad: table.querySelector('td') ? getComputedStyle(table.querySelector('td')).padding : null,
    rowBorder: table.querySelector('td') ? `${getComputedStyle(table.querySelector('td')).borderBottomWidth} ${getComputedStyle(table.querySelector('td')).borderBottomColor}` : null,
    width: Math.round(table.getBoundingClientRect().width),
  } : null;
  const footer = document.querySelector('footer');
  const fs = footer ? getComputedStyle(footer) : null;
  return {
    title: document.title,
    docHeight: document.documentElement.scrollHeight,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0],
    header: header ? { h: Math.round(hr.height), bg: getComputedStyle(header).backgroundColor, position: getComputedStyle(header).position,
      borderBottom: getComputedStyle(header).borderBottomWidth + ' ' + getComputedStyle(header).borderBottomColor } : null,
    navLinks,
    h1: type([...document.querySelectorAll('h1')].find(vis)),
    h2: [...document.querySelectorAll('h2')].filter(vis).slice(0, 4).map(type),
    h3: [...document.querySelectorAll('h3')].filter(vis).slice(0, 3).map(type),
    paras, buttons,
    containerWidths: hist(centered, 6),
    sectionPadding: hist(sections, 8),
    radii: hist(radii, 8),
    bgByArea: hist(bgs, 8),
    textColors: hist(inkColors, 6),
    borders: hist(borders, 6),
    table: tableInfo,
    footer: footer ? { h: Math.round(footer.getBoundingClientRect().height), bg: fs.backgroundColor, pad: fs.padding,
      links: type([...footer.querySelectorAll('a')].find(vis)), heads: type([...footer.querySelectorAll('h2,h3,h4,h5,h6,strong,p')].find(vis)) } : null,
    libs: {
      gsap: !!window.gsap, scrollTrigger: !!(window.ScrollTrigger || window.gsap?.plugins?.scrollTrigger),
      lenis: document.documentElement.classList.contains('lenis') || !!window.lenis,
      framer: !!document.querySelector('[data-framer-name], [data-framer-component-type]'),
      webflowIx: !!document.querySelector('[data-w-id]'),
      lottie: !!document.querySelector('lottie-player, dotlottie-player, [data-animation-type="lottie"], .lottie'),
      rive: !!document.querySelector('canvas[class*="rive" i]'),
      videos: document.querySelectorAll('video').length, canvases: document.querySelectorAll('canvas').length,
    },
  };
}

// Runs in the page at each scroll step: which elements are animating right now.
function animSnapshot() {
  const out = new Map();
  for (const a of document.getAnimations()) {
    if (a.playState !== 'running') continue;
    const t = a.effect?.target;
    if (!t || !(t instanceof Element)) continue;
    const r = t.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const name = a.animationName || a.transitionProperty || 'waapi';
    const cls = (typeof t.className === 'string' ? t.className : t.getAttribute('class') || '').split(/\s+/).slice(0, 2).join('.');
    const key = `${t.tagName.toLowerCase()}${cls ? '.' + cls.slice(0, 40) : ''}:${name}`;
    out.set(key, (out.get(key) || 0) + 1);
  }
  return [...out.entries()].slice(0, 12).map(([k, n]) => `${k}${n > 1 ? ' ×' + n : ''}`);
}

async function resolveUrl(browser, p) {
  if (p.url) return p.url;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await page.goto(p.discoverFrom, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
    const re = new RegExp(p.match);
    return hrefs.find((h) => re.test(h) && h !== p.discoverFrom) || null;
  } finally { await ctx.close(); }
}

async function capture(browser, p) {
  const url = await resolveUrl(browser, p).catch(() => null);
  if (!url) return { id: p.id, error: 'could not resolve url' };
  const result = { id: p.id, url, widths: {} };
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width: w.width, height: w.height }, isMobile: w.mobile, hasTouch: w.mobile,
      deviceScaleFactor: 1, reducedMotion: 'no-preference', locale: 'en-US',
      userAgent: w.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
        : undefined,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)));
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2500);
      const consent = await dismissConsent(page);
      await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
      const heroAnims = await page.evaluate(animSnapshot);
      await page.screenshot({ path: path.join(outDir, `${p.id}__${w.name}__hero.png`) });
      // Scroll in steps so lazy images load and scroll-triggered motion fires; log motion per step.
      const motion = [];
      let y = 0;
      for (let i = 0; i < 80; i++) {
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        if (y >= h - w.height) break;
        y += Math.round(w.height * 0.7);
        await page.mouse.wheel(0, Math.round(w.height * 0.7));
        await page.waitForTimeout(350);
        const snap = await page.evaluate(animSnapshot);
        if (snap.length) motion.push({ y, anims: snap });
      }
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);
      const m = await page.evaluate(measure);
      const clipH = Math.min(m.docHeight, MAX_SHOT_H);
      await page.screenshot({ path: path.join(outDir, `${p.id}__${w.name}__full.png`), fullPage: true,
        clip: { x: 0, y: 0, width: w.width, height: clipH } }).catch(async () => {
        await page.screenshot({ path: path.join(outDir, `${p.id}__${w.name}__full.png`), fullPage: true });
      });
      result.widths[w.name] = { status: resp?.status(), consent, heroAnims, motion, errors, measure: m,
        truncated: m.docHeight > MAX_SHOT_H };
    } catch (e) {
      result.widths[w.name] = { error: e.message.slice(0, 200) };
    } finally { await ctx.close(); }
  }
  await fs.writeFile(path.join(outDir, `${p.id}.json`), JSON.stringify(result, null, 2));
  console.log(`${p.id}: ${Object.entries(result.widths).map(([k, v]) => `${k}=${v.error ? 'ERR ' + v.error.slice(0, 60) : v.status}`).join(' ')} ${url}`);
  return result;
}

const browser = await chromium.launch({ channel: 'msedge' });
const queue = [...pages];
await Promise.all(Array.from({ length: +conc }, async () => {
  while (queue.length) await capture(browser, queue.shift()).catch((e) => console.log('FAIL', e.message));
}));
await browser.close();
