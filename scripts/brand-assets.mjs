// Renders the brand's raster files from their sources:
//   public/favicon.ico  32px PNG-in-ICO from public/favicon.svg
//   public/og.jpg       1200 × 630 Open Graph card (drawn here; no vendor media)
// Run after changing the mark: node scripts/brand-assets.mjs
// Playwright is not a project dependency; it resolves from the npx cache.
import fs from 'node:fs/promises';
import { chromium } from 'file:///C:/Users/SAMSUNG/AppData/Local/npm-cache/_npx/1efdf6826795197b/node_modules/playwright/index.mjs';

const font = (await fs.readFile('node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')).toString('base64');
const favicon = await fs.readFile('public/favicon.svg', 'utf8');
const browser = await chromium.launch({ channel: 'msedge' });

// Favicon: PNG bytes wrapped in a one-image ICO container.
const fp = await browser.newPage({ viewport: { width: 32, height: 32 } });
await fp.setContent(`<style>*{margin:0}body{background:transparent}</style>${favicon.replace('<svg ', '<svg width="32" height="32" ')}`);
const png = await fp.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 32, height: 32 } });
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
await fs.writeFile('public/favicon.ico', Buffer.concat([head, png]));

// Open Graph card: the mark at poster scale on the footer's dark stage.
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<!doctype html><style>
@font-face{font-family:A;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:A;color:#f4f5f2;overflow:hidden;position:relative;
background:radial-gradient(70% 90% at 82% 18%,#24324f 0%,transparent 60%),radial-gradient(60% 70% at 8% 110%,#3a1c12 0%,transparent 60%),#11141a}
body:before{content:"";position:absolute;inset:0;opacity:.35;mix-blend-mode:soft-light;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.mark{position:absolute;right:-40px;top:40px;width:640px;height:640px;filter:drop-shadow(0 0 60px rgba(90,120,255,.35))}
.copy{position:absolute;left:80px;bottom:84px}
.word{font-size:132px;font-weight:800;font-variation-settings:"wdth" 104;letter-spacing:-.045em;line-height:1}
.line{margin-top:22px;font-size:34px;font-weight:500;color:#c9cdd6;letter-spacing:-.01em;max-width:620px;line-height:1.25}
</style><svg class="mark" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="3" y1="0" x2="29.5" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e0622c"/><stop offset=".52" stop-color="#5b7bf0"/><stop offset="1" stop-color="#36a571"/></linearGradient></defs><path d="M3.6 10.4 9.4 24.2 16 13.4 22.4 24.2 29.2 5.2" fill="none" stroke="url(#g)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div class="copy"><p class="word">Wellpick</p><p class="line">Software picks for small service businesses, priced and sourced.</p></div>`);
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 86 });
await browser.close();
console.log('public/favicon.ico, public/og.jpg');
