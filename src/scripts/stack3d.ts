// Three.js hero scene: the three vendor screens as physical layers, a colored
// slab with thickness per chapter and the screen printed on its face.
// One responsibility (the stack), DPR capped, renders only while visible,
// pauses on hidden documents, disposes everything, falls back on context loss.
import {
  AmbientLight,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type Texture,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StackHandle } from './hero-stack';

interface TextureSpec {
  src: string;
  w: number;
  h: number;
  chapter: string;
}

const SCREEN_VERT = /* glsl */ `
  uniform float uBend;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += uBend * (p.x * p.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// Rounded-rect mask via SDF; the screen image is "covered" from the top-left
// like the DOM poster (object-position: top left).
const SCREEN_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uSize;
  uniform vec2 uCrop;
  uniform float uRadius;
  uniform float uDim;
  varying vec2 vUv;
  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRound(p, uSize * 0.5, uRadius);
    float aa = fwidth(d);
    float alpha = 1.0 - smoothstep(-aa, aa, d);
    vec2 uv = vec2(vUv.x * uCrop.x, 1.0 - (1.0 - vUv.y) * uCrop.y);
    vec4 c = texture2D(uMap, uv);
    gl_FragColor = vec4(c.rgb * (1.0 - uDim), alpha);
    #include <colorspace_fragment>
  }
`;

function roundedRect(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Resolve a CSS color (oklch included) to sRGB through a 1px canvas. */
function cssColor(value: string): Color {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Color('#444');
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
}

export async function createStackScene(root: HTMLElement): Promise<StackHandle | null> {
  const stage = root.querySelector<HTMLElement>('.stack-stage');
  const specs = JSON.parse(root.dataset.textures ?? '[]') as TextureSpec[];
  if (!stage || specs.length !== 3) return null;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  const camera = new PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0.6, 1.1, 12.6);
  camera.lookAt(0, 0, 0);

  scene.add(new AmbientLight(0xffffff, 1.35));
  const key = new DirectionalLight(0xffffff, 2.1);
  key.position.set(-3, 5, 6);
  scene.add(key);

  const loader = new TextureLoader();
  let textures: Texture[];
  try {
    textures = await Promise.all(specs.map((s) => loader.loadAsync(s.src)));
  } catch {
    renderer.dispose();
    return null;
  }

  const group = new Group();
  group.position.x = -0.35;
  scene.add(group);
  const W = 3.3;
  const SCREEN_ASPECT = 1.6;
  const H = W / SCREEN_ASPECT;
  // v12: thinner bezels so the screens read; the slab is now an edge of
  // chapter color, not a frame.
  const PAD = 0.06;
  const DEPTH = 0.08;
  const slabShape = roundedRect(W + PAD * 2, H + PAD * 2, 0.13);
  const slabGeo = new ExtrudeGeometry(slabShape, { depth: DEPTH, bevelEnabled: false, curveSegments: 10 });
  slabGeo.translate(0, 0, -DEPTH);
  const screenGeo = new PlaneGeometry(W, H, 24, 1);

  const cards: { card: Group; screen: ShaderMaterial; base: { x: number; y: number; z: number } }[] = [];
  const slabMats: MeshStandardMaterial[] = [];

  specs.forEach((spec, i) => {
    const tex = textures[i];
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const imgAspect = spec.w / spec.h;
    // Crop factors so the texture covers a 16:10 screen from the top-left.
    const crop = imgAspect > SCREEN_ASPECT ? new Vector2(SCREEN_ASPECT / imgAspect, 1) : new Vector2(1, imgAspect / SCREEN_ASPECT);

    const chapterColor = getComputedStyle(root).getPropertyValue(`--${spec.chapter}`).trim();
    const slabMat = new MeshStandardMaterial({ color: cssColor(chapterColor), roughness: 0.62, metalness: 0.05 });
    slabMats.push(slabMat);
    const screenMat = new ShaderMaterial({
      vertexShader: SCREEN_VERT,
      fragmentShader: SCREEN_FRAG,
      transparent: true,
      uniforms: {
        uMap: { value: tex },
        uSize: { value: new Vector2(W, H) },
        uCrop: { value: crop },
        uRadius: { value: 0.09 },
        uDim: { value: 0 },
        uBend: { value: 0 },
      },
    });

    const card = new Group();
    const slab = new Mesh(slabGeo, slabMat);
    const screen = new Mesh(screenGeo, screenMat);
    screen.position.z = 0.004;
    card.add(slab, screen);
    const base = { x: (i - 1) * 1.35, y: (i - 1) * 0.95, z: (i - 1) * 0.9 };
    card.position.set(base.x, base.y, base.z);
    card.rotation.set(-0.5, -0.46, -0.1);
    group.add(card);
    cards.push({ card, screen: screenMat, base });
  });

  stage.prepend(canvas);

  // The canvas is larger than the stage (see HeroStack.astro). The scene was
  // framed with a 26° lens on a canvas 1.16× the stage height; widen the lens
  // by the extra ratio so the stack keeps that size and the added canvas only
  // adds room around it.
  const BASE_FOV = 26;
  const FRAMED_RATIO = 1.16;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const stageH = stage.getBoundingClientRect().height;
    if (!r.width || !r.height || !stageH) return;
    renderer.setSize(r.width, r.height, false);
    const k = r.height / stageH / FRAMED_RATIO;
    camera.fov = (2 * Math.atan(k * Math.tan((BASE_FOV * Math.PI) / 360)) * 180) / Math.PI;
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // State driven by GSAP (intro, scroll, focus) and pointer; read each frame.
  const state = { spread: 0.35, intro: 0, bend: 0, tiltX: 0, tiltY: 0 };
  const pointer = { x: 0, y: 0 };
  const lifts = [0, 0, 0];

  const onPointer = (e: PointerEvent) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  };
  const onBlur = () => {
    pointer.x = 0;
    pointer.y = 0;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('blur', onBlur);

  let visible = true;
  let running = false;
  let frame = 0;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  });
  io.observe(stage);

  const render = () => {
    frame = 0;
    running = false;
    state.tiltX += (pointer.y * 0.18 - state.tiltX) * 0.06;
    state.tiltY += (pointer.x * 0.28 - state.tiltY) * 0.06;
    group.rotation.x = state.tiltX;
    group.rotation.y = state.tiltY;
    cards.forEach(({ card, screen, base }, i) => {
      const drop = (1 - state.intro) * (2.6 + i * 0.6);
      card.position.set(base.x * state.spread, base.y * state.spread - drop, base.z * state.spread + lifts[i]);
      screen.uniforms.uBend.value = state.bend;
    });
    renderer.render(scene, camera);
    const settling = Math.abs(pointer.y * 0.18 - state.tiltX) > 0.0005 || Math.abs(pointer.x * 0.28 - state.tiltY) > 0.0005;
    if (settling || gsap.isTweening(state) || gsap.isTweening(lifts)) schedule();
  };
  function schedule() {
    if (running || !visible || document.hidden) return;
    running = true;
    frame = requestAnimationFrame(render);
  }
  gsap.registerPlugin(ScrollTrigger);
  const intro = gsap.to(state, { intro: 1, spread: 1, duration: 1.8, ease: 'expo.out', onUpdate: () => schedule() });
  const scroll = gsap.to(state, {
    spread: 1.55,
    bend: 0.06,
    ease: 'none',
    onUpdate: () => schedule(),
    scrollTrigger: { trigger: root, start: 'top 15%', end: 'bottom top', scrub: 0.8 },
  });

  const onVisibility = () => schedule();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pointermove', schedule, { passive: true });

  const onLost = (e: Event) => {
    e.preventDefault();
    root.classList.remove('is-webgl');
  };
  canvas.addEventListener('webglcontextlost', onLost);

  schedule();

  return {
    focus(index) {
      cards.forEach(({ screen }, i) => {
        gsap.to(screen.uniforms.uDim, { value: index === null || index === i ? 0 : 0.35, duration: 0.5, ease: 'power3.out' });
      });
      gsap.to(lifts, {
        0: index === 0 ? 0.6 : 0,
        1: index === 1 ? 0.6 : 0,
        2: index === 2 ? 0.6 : 0,
        duration: 0.8,
        ease: 'expo.out',
        onUpdate: schedule,
      });
    },
    destroy() {
      cancelAnimationFrame(frame);
      gsap.ticker.remove(schedule);
      intro.kill();
      scroll.scrollTrigger?.kill();
      scroll.kill();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointermove', schedule);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      slabGeo.dispose();
      screenGeo.dispose();
      slabMats.forEach((m) => m.dispose());
      cards.forEach(({ screen }) => screen.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}
