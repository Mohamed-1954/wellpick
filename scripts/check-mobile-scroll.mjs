// One-off verification: horizontal scroll + console errors at 390px.
// Run: node scripts/check-mobile-scroll.mjs  (needs `astro dev --background` up)
// playwright is not a project dep; resolve it from the npx cache (see AGENTS.md note)
const { chromium } = await import(
  'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs'
);

const BASE = 'http://localhost:4321';
const ROUTES = [
  '/', '/softr/', '/noloco/', '/fillout/',
  '/softr/pricing/', '/noloco/pricing/', '/fillout/pricing/',
  '/guides/', '/compare/', '/start/', '/methodology/', '/about/',
  '/disclosure/', '/privacy/',
  '/guides/portal-costs/', '/guides/portal-data-model/', '/guides/client-portal-launch/',
  '/guides/build-softr-client-portal/', '/guides/build-noloco-client-portal/', '/guides/fillout-intake-to-airtable/',
  '/compare/softr-vs-noloco/', '/compare/fillout-vs-tally/', '/compare/airtable-portals-vs-softr/', '/compare/softr-forms-vs-fillout/',
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
let bad = 0;
for (const r of ROUTES) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE + r, { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => ({
    sw: document.scrollingElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    h1: document.querySelectorAll('h1').length,
  }));
  const scroll = m.sw > m.cw;
  if (scroll || errors.length || m.h1 !== 1) bad++;
  console.log(`${scroll ? 'XSCROLL ' : 'ok'} h1=${m.h1} ${errors.length ? 'JSERR ' + errors[0].slice(0, 60) : ''} ${r}`);
}
console.log(`\n${bad} problem page(s) of ${ROUTES.length}`);
await browser.close();
