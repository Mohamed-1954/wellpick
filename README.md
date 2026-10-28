# Wellpick

Independent software picks for small service businesses: client intake (Fillout), client portals (Softr) and portal plus team operations (Noloco), priced and sourced. Built with [Astro](https://astro.build) as a static site.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies (Node 22 or newer) |
| `pnpm build` | Build to `dist/`, then run `scripts/verify.mjs` (links, media manifest, claims, disclosure) |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm check` | Type-check pages, components and the content schema |

## Environments

`PUBLIC_SITE_ENV` decides indexing:

| Value | Robots | Preview ribbon | Needs `SITE_URL` |
| --- | --- | --- | --- |
| `local` (default) | noindex | yes | no |
| `staging` | noindex | no | yes |
| `production` | index, sitemap in robots.txt | no | yes |

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. It reads `PUBLIC_SITE_ENV` and `SITE_URL` from the repository variables of the same names (defaults: `staging`, `https://wellpickhq.com`).

## Content

- Guides, comparisons, pages and blog posts: `src/content/articles/` (MDX).
- Prices, limits and vendor claims: `src/data/claims.json`, with sources in `src/data/sources.json`.
- Vendor images: `public/img/vendor/`, each listed in `src/data/media-manifest.ts`.

Design and editorial notes live in `DESIGN.md`, `PRODUCT.md` and `DESIGN-HANDOFF.md`.

## Corrections

Open an issue: https://github.com/Mohamed-1954/wellpick/issues
