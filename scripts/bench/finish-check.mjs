// Finish-phase checks on every sitemap route (static build on :4322).
// Run: node scripts/bench/finish-check.mjs [base=http://localhost:4322]
// Reports per route and width: horizontal overflow, H1 count, em/en dashes in
// visible text, stamp phrases, figcaptions, [data-disclosure] count, page
// errors. Then harden passes on key routes: images blocked, very long strings
// injected into headings/labels, and 200% root text at 390/768/1280.
const { chromium } = await import(
  'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs'
);
const BASE = process.argv[2] ?? 'http://localhost:4322';
const WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const STAMPS = /prices checked|facts checked|checked on|last checked|updated on|how we work/i;
const KEY = ['/', '/softr/', '/noloco/', '/fillout/', '/softr/pricing/', '/start/', '/guides/portal-costs/', '/compare/softr-vs-noloco/'];

const browser = await chromium.launch({ channel: 'msedge' });
const sm = await (await fetch(`${BASE}/sitemap-0.xml`)).text();
const routes = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const problems = [];
const note = (r, w, msg) => { problems.push(`${r} @${w}: ${msg}`); };

async function inspect(page) {
  return page.evaluate((stampSrc) => {
    const stamp = new RegExp(stampSrc, 'i');
    const main = document.querySelector('main') ?? document.body;
    // Visible text only (excludes nav/footer labels for the stamp check: nav links may legitimately name pages).
    const text = main.innerText;
    return {
      overflow: document.scrollingElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      dashes: (document.body.innerText.match(/[\u2013\u2014]/g) || []).length,
      stamp: (text.match(stamp) || [])[0] || null,
      figcaptions: document.querySelectorAll('figcaption').length,
      disclosure: document.querySelectorAll('[data-disclosure]').length,
      ribbon: document.querySelectorAll('.env-ribbon').length,
      wideEls: [...document.querySelectorAll('main *')]
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== 'fixed')
        .slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`),
    };
  }, STAMPS.source);
}

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const r of routes) {
    const errors = [];
    const onErr = (e) => errors.push(e.message.slice(0, 100));
    page.on('pageerror', onErr);
    const resp = await page.goto(BASE + r, { waitUntil: 'load' });
    const m = await inspect(page);
    page.off('pageerror', onErr);
    if (resp.status() >= 400) note(r, w, `HTTP ${resp.status()}`);
    if (m.overflow > 0) note(r, w, `overflow ${m.overflow}px ${m.wideEls.join(' ')}`);
    if (m.h1 !== 1 && !/refresh/.test(await page.content().slice(0, 600))) note(r, w, `h1=${m.h1}`);
    if (w === 1440) {
      if (m.dashes) note(r, w, `${m.dashes} em/en dashes`);
      if (m.stamp) note(r, w, `stamp phrase "${m.stamp}"`);
      if (m.figcaptions) note(r, w, `${m.figcaptions} figcaptions`);
      if (m.disclosure !== 1) note(r, w, `data-disclosure=${m.disclosure}`);
    }
    if (errors.length) note(r, w, `page error: ${errors[0]}`);
  }
  await ctx.close();
}
console.log(`Routes: ${routes.length} × widths ${WIDTHS.join('/')}`);

// Harden: images blocked, long strings, 200% text.
const LONG = 'Supercalifragilisticexpialidocious-intake-portal-operations-configuration-review';
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.route(/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/, (route) => route.abort());
  const page = await ctx.newPage();
  for (const r of KEY) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    const blocked = await inspect(page);
    if (blocked.overflow > 0) note(r, w, `images blocked: overflow ${blocked.overflow}px`);
    await page.evaluate((s) => {
      for (const el of document.querySelectorAll('main :is(h1,h2,h3,.pl-name strong,.sm-job,.hf-title,.chapter-title,th,.btn)')) {
        if (el.children.length === 0) el.textContent = `${el.textContent} ${s}`;
      }
    }, LONG);
    const long = await inspect(page);
    if (long.overflow > 0) note(r, w, `long strings: overflow ${long.overflow}px ${long.wideEls.join(' ')}`);
  }
  await ctx.close();
}
for (const w of [390, 768, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    await page.addStyleTag({ content: 'html{font-size:200%!important}' });
    await page.waitForTimeout(50);
    const m = await inspect(page);
    if (m.overflow > 0) note(r, w, `200% text: overflow ${m.overflow}px ${m.wideEls.join(' ')}`);
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join('\n') : 'No problems found.');
console.log(`\n${problems.length} problem(s)`);
