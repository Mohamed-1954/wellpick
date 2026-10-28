// Hero stack controller. Decides between the CSS 3D poster (always present)
// and the Three.js scene (desktop enhancement), and wires the legend.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface StackHandle {
  focus(index: number | null): void;
  destroy(): void;
}

function canUseWebGL(): boolean {
  if (!window.matchMedia('(min-width: 64rem) and (pointer: fine)').matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function initHeroStack() {
  const root = document.querySelector<HTMLElement>('[data-stack3d]');
  if (!root) return;
  const layers = [...root.querySelectorAll<HTMLElement>('.layer')];
  const links = [...root.querySelectorAll<HTMLElement>('[data-layer-link]')];
  const motion = document.documentElement.classList.contains('motion-ok');
  let scene: StackHandle | null = null;

  const focus = (i: number | null) => {
    root.classList.toggle('is-focus', i !== null);
    layers.forEach((l, j) => l.classList.toggle('is-active', j === i));
    scene?.focus(i);
  };
  for (const link of links) {
    const i = Number(link.dataset.layerLink);
    link.addEventListener('pointerenter', () => focus(i));
    link.addEventListener('pointerleave', () => focus(null));
    link.addEventListener('focus', () => focus(i));
    link.addEventListener('blur', () => focus(null));
  }

  if (!motion) return; // Reduced motion: the static poster is the complete experience.

  gsap.registerPlugin(ScrollTrigger);
  const poster = root.querySelector<HTMLElement>('.stack-poster');
  const playPoster = () => {
    gsap.from(layers, {
      y: 140,
      rotateX: -18,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.14,
      delay: 0.15,
    });
    if (poster) {
      gsap.to(poster, {
        rotateX: 30,
        rotateY: -14,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 20%', end: 'bottom top', scrub: 0.8 },
      });
    }
  };

  if (!canUseWebGL()) {
    playPoster();
    return;
  }

  // Exactly one stack renders. The poster is not painted while the scene
  // loads (the scene's own intro is the entrance); if the scene fails or is
  // late, the poster plays instead and a late scene is discarded.
  root.classList.add('is-loading-3d');
  let settled = false;
  const fallback = () => {
    if (settled) return;
    settled = true;
    root.classList.remove('is-loading-3d');
    playPoster();
  };
  const timer = window.setTimeout(fallback, 2500);
  import('./stack3d')
    .then(({ createStackScene }) => createStackScene(root))
    .then((handle) => {
      if (settled) {
        handle?.destroy();
        return;
      }
      if (!handle) {
        fallback();
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      scene = handle;
      root.classList.add('is-webgl');
      root.classList.remove('is-loading-3d');
    })
    .catch(fallback);

  window.addEventListener('pagehide', () => scene?.destroy(), { once: true });
}
