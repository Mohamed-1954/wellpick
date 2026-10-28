import { MEDIA, VIDEO } from '../data/media-manifest';

const WIDTHS = [640, 1200, 2000] as const;

/**
 * Responsive sources for a vendor capture in public/img/vendor/.
 * Variants come from scripts/optimize-vendor.mjs (public/img/vendor/w/).
 * Width descriptors are the real output widths, so small captures never
 * advertise a size they do not have. Throws for a file that is not in the
 * media manifest, so nothing ships without a provenance entry.
 */
export function vendorImage(name: string) {
  const dims = MEDIA[name];
  if (!dims) throw new Error(`[media] Not in src/data/media-manifest.ts: ${name}`);
  const base = name.replace(/\.[a-z]+$/i, '');
  const seen = new Set<number>();
  const candidates: string[] = [];
  for (const w of WIDTHS) {
    const real = Math.min(w, dims.w);
    if (seen.has(real)) continue;
    seen.add(real);
    candidates.push(`/img/vendor/w/${base}-${w}.webp ${real}w`);
  }
  return {
    src: `/img/vendor/w/${base}-${dims.w >= 1200 ? 1200 : 640}.webp`,
    srcset: candidates.join(', '),
    width: dims.w,
    height: dims.h,
  };
}

/** A vendor recording in public/media/ with its poster's responsive sources. */
export function vendorVideo(name: string) {
  const v = VIDEO[name];
  if (!v) throw new Error(`[media] Not in src/data/media-manifest.ts: ${name}`);
  return { src: `/media/${name}`, width: v.w, height: v.h, poster: vendorImage(v.poster) };
}
