// Site-wide motion: one smooth-scroll engine (Lenis) driving GSAP ScrollTrigger,
// plus the site's authored moments outside the home hero stack (which runs its
// own module, hero-stack.ts, on this same engine):
//   1. the home hero H1 (`.hero-title[data-split="now"]`), revealed word by word
//      on load;
//   2. `data-draw`: an SVG path, or an element containing stroked paths, draws
//      on once when it enters the viewport;
//   3. `data-reveal`: a section head, card row or media scene rises in once
//      when it enters (`data-reveal="media"` rises further and scales from
//      0.97; `--rd` delays one element, `data-reveal-stagger` on a parent
//      staggers its revealed children);
//   4. `data-drift`: a media plane drifts a few percent against the scroll
//      while its scene crosses the viewport;
//   5. `video[data-loop]`: a muted vendor recording plays only while visible.
//
// Contract: the static page is complete. BaseLayout adds `.motion-ok` to <html>
// before paint only when reduced motion is NOT requested; CSS hides the hero
// H1, undrawn `data-draw` targets and unrevealed `data-reveal` elements only
// under that class. If this module never runs, BaseLayout's 2.5s timeout
// removes the class and everything stays visible. Loop videos ship with
// native controls and no autoplay; only this module removes the controls and
// plays them, so reduced motion gets a still poster with a play control.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

declare global {
  interface Window {
    __motion?: boolean;
    __lenis?: Lenis;
  }
}

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
// The site's one curve (--ease-out in global.css).
const EASE_OUT = 'cubic-bezier(0.33, 1, 0.68, 1)';
const DRAW_MS = 1200;

function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -96 }, prevent: (node) => node.closest('dialog') !== null });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('pagehide', () => lenis.destroy(), { once: true });
}

function initHeroHeading() {
  const el = document.querySelector<HTMLElement>('.hero-title[data-split="now"]');
  if (!el) return;
  // Decorative word spans are hidden from assistive tech; the heading keeps
  // its full text as an aria-label (SplitText aria: 'auto').
  const split = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'split-word', aria: 'auto' });
  gsap.set(el, { visibility: 'visible' });
  gsap.from(split.words, { yPercent: 115, duration: 1.15, ease: 'expo.out', stagger: 0.055, delay: 0.1 });
}

type Stroke = SVGGeometryElement & { style: CSSStyleDeclaration };

const strokesOf = (el: Element): Stroke[] =>
  (el instanceof SVGGeometryElement
    ? [el]
    : [...el.querySelectorAll<SVGGeometryElement>('path, line, polyline')]
  ).filter((s) => getComputedStyle(s).stroke !== 'none') as Stroke[];

// Solid strokes draw along their length (pathLength 1 normalizes the dash
// maths). Dashed strokes keep their dash pattern and are wiped on instead.
function prepare(s: Stroke) {
  if (getComputedStyle(s).strokeDasharray === 'none') {
    s.setAttribute('pathLength', '1');
    s.style.strokeDasharray = '1';
    s.style.strokeDashoffset = '1';
  } else {
    s.style.clipPath = 'inset(0 100% 0 0)';
  }
}

function draw(target: HTMLElement | SVGElement) {
  const strokes = strokesOf(target);
  // Segments of one path draw in document order, as a single continuous line.
  const each = DRAW_MS / Math.max(1, strokes.length);
  strokes.forEach((s, i) => {
    const last = i === strokes.length - 1;
    const timing: KeyframeAnimationOptions = {
      duration: strokes.length > 1 ? each : DRAW_MS,
      delay: i * each,
      easing: last ? EASE_OUT : 'linear',
      fill: 'backwards',
    };
    const anim = s.style.clipPath
      ? s.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], timing)
      : s.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], timing);
    // Clear the hidden state now; `fill: backwards` holds it through the delay.
    s.style.strokeDashoffset = '';
    s.style.clipPath = '';
    anim.finished
      .then(() => {
        s.style.strokeDasharray = '';
        s.removeAttribute('pathLength');
      })
      .catch(() => {});
  });
  target.dataset.drawState = 'done';
}

function initDraw() {
  const targets = [...document.querySelectorAll<HTMLElement | SVGElement>('[data-draw]')];
  if (!targets.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        draw(entry.target as HTMLElement | SVGElement);
      }
    },
    { threshold: 0.35 },
  );
  for (const t of targets) {
    strokesOf(t).forEach(prepare);
    t.dataset.drawState = 'ready';
    io.observe(t);
  }
}

function initReveal() {
  for (const parent of document.querySelectorAll<HTMLElement>('[data-reveal-stagger]')) {
    const step = Number(parent.dataset.revealStagger) || 90;
    [...parent.querySelectorAll<HTMLElement>('[data-reveal]')].forEach((el, i) => {
      if (!el.style.getPropertyValue('--rd')) el.style.setProperty('--rd', `${i * step}ms`);
    });
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        (entry.target as HTMLElement).dataset.revealed = '';
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}

function initDrift() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-drift]')) {
    const amount = Number(el.dataset.drift) || 6;
    gsap.fromTo(
      el,
      { yPercent: amount },
      { yPercent: -amount, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  }
}

function initLoops() {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')];
  if (!videos.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const v = target as HTMLVideoElement;
        if (isIntersecting) v.play().catch(() => {});
        else v.pause();
      }
    },
    { threshold: 0.25 },
  );
  for (const v of videos) {
    v.controls = false;
    v.preload = 'auto';
    io.observe(v);
  }
}

function init() {
  if (reduce.matches || !root.classList.contains('motion-ok')) {
    root.classList.remove('motion-ok');
    return;
  }
  window.__motion = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  initSmoothScroll();
  initDraw();
  initReveal();
  initDrift();
  initLoops();
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  fontsReady.then(initHeroHeading);
}

init();
