# Release: 28 October 2026, staging deploy on GitHub Pages

- **Domain:** wellpickhq.com (the owner buys it; wellpick.com is a premium listing, and any new .com costs about $11 a year, so the Wellpick name stays). `public/CNAME` and `SITE_URL` point at it.
- **Environments:** `PUBLIC_SITE_ENV=staging` is new: noindex, no preview ribbon, real canonical URLs; `SITE_URL` is required for staging and production. robots.txt allows crawling in every environment (so noindex can be read) and lists the sitemap only in production.
- **Removed from the shipped site and repo:** the "still in local review" notes on About and Privacy (replaced with the GitHub issue tracker as the corrections contact and GitHub Pages' documented logging), `public/_redirects` (a Netlify file; the build's redirect stubs cover GitHub Pages), the starter README, and local agent tooling (`.agents/`, `.mcp.json`, `.impeccable/` are now ignored).
- **SEO (seo-audit, ai-seo skills):** `scripts/seo-check.mjs` audits the build (one title and H1, title ≤ 65 and description 70 to 170 characters, canonical, robots, Open Graph, lang, alt, JSON-LD, duplicates); it found 22 long blog titles and 17 long descriptions, fixed with a `seoTitle` field (the H1 keeps the full title) and shorter descriptions. `/llms.txt` lists every page from the content collection.
- **Referral slots:** no affiliate URLs exist (`affiliateUrl: null`), so every `OfficialCta` falls back to the vendor's official pages; all six official and pricing URLs returned 200 on 28 Oct.
- **Deploy:** `.github/workflows/deploy.yml` (pnpm install, `pnpm build` with verify, `seo-check`, Pages artifact, deploy) on pushes to `main`. To launch, set the repository variable `PUBLIC_SITE_ENV=production`.
- **Enlarged text (200%) on phones, fixed 28 Oct:** the seven long-standing failures had five causes, found by measuring text runs, not boxes (the finish-check's element list pointed at clipped images). Home: a problem quote's long word (`.pl-quote` breaks words). Compare index: the glance table's 14rem row header kept its width when stacked (auto under 40rem). Pricing pages: `nowrap` prices in stacked tables (wrap under 40rem), and at 320px the billing switch and its grid track (switch wraps, `.ladder-wrap` column `minmax(0, 1fr)`). Guides: "Permissions" in `LayerDiagram` and "Companies" in `EntityDiagram` (text columns break long words). Stacked table cells break long words site-wide. `finish-check.mjs` now reports 0 problems on 49 routes × 6 widths; the 7 routes also pass at 320px. Normal-size layouts unchanged (checked the pricing switch at 390 and the Noloco ladder at 1440).

---

# Design handoff: 27 October 2026, v13 blog

Branch `redesign/rebenchmark-media-pass`, on top of v12. Benchmark, references and section outcomes: `BLOG-BENCHMARK.md`. System: `DESIGN.md` v13 ("Blog"). Evidence: `.impeccable/live/blog-2026-10-27/` (`references/` fresh captures of eight blogs at 1440 and 390 with `log.json`; `wip/` our captures).

## What changed

- **Navigation:** "Blog" in the header bar, the phone drawer and the footer's Read column; active on `/blog/` and every post.
- **`/blog/` index:** head with a muted second clause; lead story and three latest (Customer.io); topic tabs with counts and a live blurb (Mintlify); every post as a ruled row with its topic glyph (daily.dev). `Blog` + `BlogPosting` JSON-LD.
- **Posts:** `ArticleLayout kind="post"` with topic tag, date, minutes, a drawn banner cover, sources from frontmatter and "More like this". `BlogPosting` JSON-LD with publisher and `mainEntityOfPage`; breadcrumb Home > Blog > post.
- **Covers:** `PostArt.astro`, original drawn art in the glyph language (no screenshots, no text, decorative).
- **Content:** 24 posts across six topics (`src/data/blog.ts`), written for the site's readers and linked into the guides and comparisons. Eleven sources added to `src/data/sources.json`, all read on 27 Oct 2026 (web.dev Web Vitals, W3C WCAG 2.2 and its "what's new", Gmail sender guidelines, the FTC Endorsement Guides FAQ, NIST AI RMF, Softr's AI app builder, Fillout's AI form builder, Noloco's homepage, Astro docs). Schema: `type: post`, `topic`, `featured`.
- **Site-wide fixes found by the checks:** Markdown tables now get the same focusable `.table-scroll` region as hand-written tables (`tableLabels.mjs`); inline code wraps; four community source titles lost their en dashes ("Oct to Nov 2024").

## Content rules kept

No post claims hands-on testing we did not do; the AI builder posts say they read the vendors' pages. Quotes are verbatim from the cited pages. No em or en dashes in visible copy; no stamp phrases. The review-sites post states that no affiliate links are active today.

## Validation

Build 50 pages; `verify.mjs` 0 errors; `astro check` 0 errors (Zod deprecation hints only); production build has `env-ribbon` in 0 HTML files and all 24 posts in the sitemap. Interaction check: topic filter (Operations 4 of 24, back to 24, `aria-pressed`, blurb), header fits at 1024 and 1280 with no overflow, drawer lists Blog, rendered JSON-LD (`Blog`, `BlogPosting`, `BreadcrumbList`). `finish-check.mjs` (49 routes × 6 widths): the first run found two en dashes (source titles), two stamp phrases, inline code and Markdown tables overflowing with 200% text, and the index's side rows squeezing at 200%; all fixed. Seven problems remain, all pre-existing "200% text @390" (`/`, `/compare/`, three pricing pages, two guides); no blog route fails. Contrast on rendered pixels: post meta and list text 6.54 (light) and 8.07 (dark); topic tags are ink on the canvas; covers carry no text.

Remaining: the blog has no RSS feed or search (not requested; daily.dev and Mintlify have both); all 24 posts share one publish date because they were written in one pass.

---

# Design handoff: 3 to 4 October 2026, v12 rebenchmark, Wellpick, chrome

Branch `redesign/rebenchmark-media-pass`, created from the actual state (`redesign/media-pass` at `b4ae269`, v11). Plan, owner decisions D5 to D7 and the naming record: `DESIGN-PLAN.md`. Section-by-section benchmark, evidence index and outcomes (including the owner review of 4 Oct): `REBENCHMARK.md`. System: `DESIGN.md` v12. Evidence: `.impeccable/live/rebenchmark-2026-10-03/` (`baseline/` 1,283 files at HEAD `b4ae269`; `references/fresh/` 66 live captures; `after/p2`, `after/p3`, `after/fb`, `after/final`; `brand-research.md`, `vendor-media.md`).

## Identity

**Wellpick** replaces The Client Stack. Chosen from two rounds of candidates (round 1 rejected: workshop metaphors that `PRODUCT.md` rules out). Checked 3 Oct: USPTO tmsearch shows no live WELLPICK mark in classes 9, 35, 41 or 42 (one in class 26, hair accessories); no same-name software, SaaS or publication found; wellpick.co, .io, .guide, readwellpick.com and wellpickhq.com had no registration record; wellpick.com is a dormant shop (2016). **Not verified:** WIPO, EUIPO/TMview and UKIPO (blocked or JS-only); common-law use beyond web search; registrar availability. Nothing was bought or registered. Routes, configured domain, canonical URLs and affiliate tracking are unchanged. The only "Client Stack" left in the build is the about page's sentence naming the former title.

## What changed

| Area | Change | Reference studied |
| --- | --- | --- |
| Rename | Brand config, W-tick mark and wordmark, favicon (svg + ico), Open Graph card `public/og.jpg`, Organization schema, Article author, about/methodology/404 copy | n/a |
| Header | Condensing bar, Tools panel with job, price and the picked tool's screen, reading progress, right drawer with scrim | Airtable mega panel, Mintlify floating card, Customer.io drawer (live) |
| Footer | One dark stage: closing statement with the lit mark, grouped links, theme switch, single disclosure link, poster wordmark | Customer.io, Huly, Amplemarket, Mintlify footers (live) |
| Glyphs | Redrawn in the mark's stroke with the pick tick | n/a |
| Hero | Copy "Better briefs. Clearer portals. Calmer teams."; about half the top space; WebGL stack kept (owner preference) with thinner bezels and a drifting light field | Airtable hero stage, Unicorn Studio lit field (live) |
| Home rail | Ruled rows, glyph, segmented progress | Airtable app-building rail (live) |
| Hub showcase | Tabbed screens on the lit field, auto-advance with fill line, new phone screens | Airtable hero tabs, Customer.io product tabs |
| Hub flow | `FlowStage`: line bundle through the real screen to the access lock, narrowing to what passes | Mintlify line-bundle cards (live) |
| Details | Accordion fixed and rebuilt (round plus to minus, height and fade animation) in a sticky-heading layout | Customer.io pricing FAQ (live) |
| Pricing | Noloco's custom Enterprise tier as a third, text-only column | Customer.io pricing "Let's talk" |
| Indexes and articles | No breadcrumbs; "All guides" / "All comparisons" back link; guide stage grid with no holes; comparison hero cover | Mintlify blog and article (live) |
| Bands | Hub hero and end bands lit with grain (the Fillout band unlit and deeper for AA) | Airtable fields |
| Dark theme | Canvas lifted from `#0b0e14` to `#13171f`, larger steps to surfaces and rules | n/a |
| Media | `softr-portal-mobile.webp` (vendor file) and `fillout-intake-mobile.png` (our capture of Fillout's public intake template) added to the manifest; usage terms per vendor recorded in the manifest header | Vendor sites |

## Reverted or replaced in this pass

- The "pick stage" hero (three screens fanned on a lit field, auto-advancing) and the compact pick stage on `/guides/` and `/compare/`: removed after the owner review; `PickStage.astro` deleted; WebGL stack and mini stack restored with thinner bezels.
- The first FitDiagram label fix on hubs: superseded by `FlowStage`. Articles keep `FitDiagram`.
- The footer disclosure sentence: removed at the owner's request; the `[data-disclosure]` link remains.

## Validation

- `astro build`: 25 pages. `verify.mjs`: 0 errors. `astro check`: 0 errors (Zod deprecation hints only).
- Production build (`PUBLIC_SITE_ENV=production SITE_URL=https://example.com`): `env-ribbon` in 0 HTML files, robots `index,follow`, `og:image` absolute; local build restored.
- `finish-check.mjs` (24 routes × 6 widths, harden passes): the same 8 problems as v10/v11, all "200% text @390"; none new. A new 174px overflow at 1280 with 200% text (the Tools panel hung from its trigger) and a showcase min-width overflow were found and fixed in-pass.
- Interactions: Tools panel Escape closes and returns focus; drawer Escape closes and returns focus; accordion grows 72 → 247px over ~450ms with motion and opens at once under reduced motion.
- Contrast on rendered pixels (`tmp/contrast.mjs`, 2nd-percentile background, grain included): hub hero bands 4.63 (Fillout) to 4.85; footer text ≥ 8.9; dark-theme muted text 6.5 to 8.1 on canvas and surfaces (token calculation).

## Remaining issues

- 200% text at 390: data tables (pricing ×3, Fillout guide), LayerDiagram labels, the home chapter scene and comparison cover planes (pre-existing).
- The hub end band's muted second clause is about 3:1 on chapter color (large text); the pixel tool cannot isolate an inline span, so it is not re-measured.
- Licensing: Softr's and Noloco's terms grant use of marketing materials only to approved affiliates/partners (and Softr forbids derivatives, which the legacy CROP files are); Fillout grants nothing explicit. Confirm with each vendor before launch; replace CROP files with own captures.
- Own captures and recordings still need owner accounts (`CAPTURE-LIST.md`).
- Disclosure: once affiliate links go live, a footer link alone may not be a clear and conspicuous disclosure near those links; revisit then.
- `FitDiagram` still carries its hub-only crop styles, now unused by the hubs (articles use the row layout only).
- WebGL, video autoplay and the accordion animation were exercised in headless Chromium/Edge only.

---

# Design handoff: 30 September 2026, v11 media pass

Brief: `GAP.md` (six missing layers, failures F1 to F8). Owner decisions D1 to D4 (30 Sep) in `DESIGN-PLAN.md`. Branch `redesign/media-pass` from `caaf8a6`. Evidence: `.impeccable/live/bench-2026-09-29/media/` (P0 to P5 captures, contact sheets of every pulled asset, `fieldcheck.mjs` pixel contrast tool).

## What changed, per phase

| Phase | Commit | Change | Benchmark |
| --- | --- | --- | --- |
| P0 assets | `1995ac0` | 28 new vendor files (Fillout product shots, Softr use-case set, Noloco canvases, permissions, invite, sources) and the Softr AI-builder recording with a poster. `src/data/media-manifest.ts` replaces `vendorImages.ts`: every file has source URL, page, note and date; `lib/media.ts` throws on an unlisted file; `verify.mjs` fails on a file without an entry, an entry without a file, or a missing `src`/`srcset`/`poster`. Glyph library (`Glyph.astro`: intake, portal, team, records, gate, client, in the logo's 16° slab language). `CAPTURE-LIST.md` for the owner. | GAP layers 1, 5 |
| P1 system | `f159d1b` | `global.css`: `.field` (lit chapter color with grain; light position and lift as variables), `.field-wash`, `.plane`, `.plane-angle`, `.float`, `.glow`, lift tokens. `Scene.astro` (field, main plane or looped video, overlapping float). `motion.ts`: `data-reveal` (with stagger), `data-drift`, `video[data-loop]`. | GAP layers 2, 3, 4 |
| P2 home (F1, F5) | `877b068` | Chapter panels are lit fields with staged scenes bleeding off the right and bottom edges (Fillout form to Airtable with a login float; Softr recording looping with an invoices float; Noloco angled project tracker with a roles float). Rail: chapter-colored progress fill on the spine, larger current tab, crossfading chapter line. Invented arrow connectors removed. Hero: lead and actions reveal after the headline beats; a three-chapter light under the slab stack. New "What clients and your team would look at." scroller: 9 real screens, edge peek, arrows, progress bar. | Airtable home chapters (`bench/airtable-home__1440__s02`), Airtable platform workflows row (`s02`) |
| P3 diagrams (F2, F4, F7) | `89aa751` | StackMap bars carry each job's real screen at the top of the lit field. FitDiagram: dotted canvas; nodes as UI blocks with real source marks (Airtable, Google Sheets, Stripe; Simple Icons, CC0) or glyphs; a vendor screen per stop; hatched access-boundary column with a lock glyph; the focal crop larger and running off its column. Article flows inherit marks, glyphs and lit focal rows. | Customer.io capability strip; Mintlify product canvas |
| P4 pricing, indexes, footer (F3, F6, F8) | `300c6a9` | PlanLadder: billing toggle (radiogroup with arrow keys; hidden without JS, which shows yearly and monthly together), "Included" group head, marked spec rows (check or dash), column hover, lit start column. `Cover.astro` (lit field, product glyphs, staged screens; two products blend) unlocks card grids on `/guides/` and the comparisons (home and `/compare/`), each comparison with its own screens. Footer: a three-slab chapter band linking the tools. | ClickUp pricing (`bench/clickup-pricing__1440__s01`), Mintlify blog grid (`s01`) |
| P5 finish | final commit | Type fix on the guides cover; docs. | |

## GAP rows: disposition

| Row | Status |
| --- | --- |
| Layer 1 composed media | Adopted: home panels, scroller, StackMap, FitDiagram, covers. |
| Layer 2 depth | Adopted: angled plane, floats, bleeds, lifts. |
| Layer 3 motion | Adopted: hero beats, section reveals, rail progress and crossfade, looped recording, draw-on arrows, hover lifts. `data-drift` is built but unused: no scene earned it at the gate. |
| Layer 4 texture | Adopted: lit fields with grain, chapter light, dotted canvas, hatched boundary. |
| Layer 5 iconography | Adopted: glyph library, source marks. |
| Layer 6 chrome | Adopted: scroller with progress, rail progress, billing toggle. Expandable `+` columns not built (no content to expand). |
| F1 to F8 | All adopted as above. F5's optional staged media plane beside the stack dropped: the slab stack already shows three real screens. |

## Reverted at the gate

None. Revised in-gate: chapter scenes moved below the facts (under the title they read as an empty gap); phone scenes enlarged; field light moves to the foot on phones but stays on top where media is on top (StackMap, ladder, footer); focal detail text raised from 90% to full `--on-chapter` for AA; the Fillout float moved off the table row; comparison covers given distinct screens.

## Hard rules: rendered check

- Real assets only, all in the manifest; no AI imagery, no benchmark IP, no stock people. Source marks are factual references to named data sources.
- No captions. Every content image has alt text and the video has an `aria-label`; covers and diagram crops are decorative (`alt=""`, `aria-hidden`).
- AA on rendered pixels (`fieldcheck.mjs`: worst 2nd-percentile background under each text box, grain and gradients included): home panels 4.67 / 5.87 / 6.04 at 390 and 4.72+ at 1440; StackMap 4.67; FitDiagram focal 4.67 to 6.04; ladder start column 5.09; footer band 5.10.
- Reduced motion: no `.motion-ok`, 0 hidden reveals, the video paused on its poster with native controls. Motion on: the loop plays only in view, the rail `--p` tracks scroll.
- One disclosure, no stamps, no dashes (finish-check, 24 routes × 6 widths).

## Validation

- `astro build`: 25 pages. `verify.mjs`: 0 errors (includes the new media and manifest checks). `astro check`: 0 errors, 0 warnings.
- Production build: `env-ribbon` in 0 HTML files, robots `index,follow`; local build restored.
- `finish-check.mjs`: the same 8 problems as v10, all "200% text @390", same pixel counts; none new.

## Remaining issues

- 200% text at 390: the data tables (pricing ×3, Fillout guide, `/compare/` glance table), LayerDiagram labels, and the home "Start with the job that is broken." section (63px). No box in that section measures past the viewport, so the likely cause is a pseudo-element; v10 misattributed it to the CompareList plate.
- Self-captures and recordings need owner accounts: `CAPTURE-LIST.md`. Until then all media is vendor-published.
- Six legacy vendor files (`softr-inventory`, `softr-kb`, `noloco-dashboard`, `noloco-workflows`, two Fillout page captures) have no recorded direct file URL; the manifest says so.
- None of the vendor files carries an explicit license; the manifest records the editorial-reference basis and removal on request.
- WebGL and video autoplay tested in headless Edge only.

---

# History: v10 benchmark pass (29 September 2026)

This section describes the repository as it is now (branch `redesign/benchmark-pass`). `BENCHMARK.md` holds the section-by-section benchmark, the label for every section and the Step 2 outcomes; `DESIGN.md` (v10) documents the system; `DESIGN-PLAN.md` records owner decisions. Earlier records are kept unchanged under **History**.

**Process.** Step 1 benchmarked seven sites (airtable.com, clickup.com, customer.io, mintlify.com, amplemarket.com, huly.io, unicorn.studio) at 1440 and 390 with `scripts/bench/`. Step 2 rebuilt one section per commit, shared components first, and gated each at 1440 and 390 (dark too for S3 to S5) against the winner capture. Skills used: `redesign-existing-projects` as the workflow (its fixed Design Values such as Geist, gradient hero text, glass nav and grain were not applied; PRODUCT.md is the brief), `design-taste-frontend`, Impeccable `layout`, `typeset`, `adapt`, then `polish`, `harden`, `audit`. Evidence: `.impeccable/live/bench-2026-09-29/` (`before/`, `bench/`, `after/`), excluded through `.git/info/exclude`.

## What changed, per section

| Section | Benchmark adopted | Where | Commit |
| --- | --- | --- | --- |
| Section H2 scale, article H2, prose list markers, copy | ClickUp H2 (48px max, 740, lh 1.1); Mintlify article (visible markers); ClickUp/Customer.io short leads | `global.css`, `hubs.ts`, `softr-vs-noloco.mdx` | S1 `50ef197` |
| Footer | Mintlify: ~98px top padding, muted 14/500 heads over 16px ink links in 44px rows, hairline bottom row with the one disclosure | `SiteFooter.astro` | S0 `d00c094` |
| Program hero (3 hubs, 3 pricing pages) | ClickUp compare hero: H1 60px at 1440, lh 1.06, 14ch, ≤ 3 lines; screen on the shell grid (full width for Softr and Noloco, native 760px left-aligned for Fillout), band edge at 40% of the screen | `ProductHubLayout.astro` | S2 `8b2ba57` |
| Home "Three jobs, three tools." | Airtable stacked panels, structure kept per owner: 3px connector with arrowhead and handoff text between panels; phone badge row; phone title 1.75rem | `index.astro` | S3 `6a5c7c8` |
| `/start/` StackMap | Customer.io capability strip: adjoining chapter bars, chevron joints, badge top-left, content at the foot, handoff inside the receiving bar | `StackMap.astro` | S4 `b449ccb` |
| Hub "How it fits your workflow" | Mintlify framed canvas: ruled column per stop, chapter-filled focal column with the product crop, 2px ink access rule, arrows with `via` labels on the boundaries; rows on narrow containers | `FitDiagram.astro` | S5 `5d454b3` |
| Article flow diagrams | Same canvas (row layout at every width, max 44rem); `HubFlow` folded into `FitDiagram` | `FitDiagram.astro`, `FlowDiagram.astro` | S5b `1855886` |
| Finish | 44px header and footer targets, long-word wrapping in new sections, en dashes in two numeric ranges | header, footer, home, StackMap, FitDiagram, 2 MDX files | `652cf83` |

**Kept as-is (labels in `BENCHMARK.md`).** adopted-winner, verified at 1440 and 390: header and phone drawer, home hero (79px H1 kept with a written ink-mass justification against ClickUp's 60px one-liner), product imagery, comparison tables, pricing (`PlanLadder`), CTA band. constraint: blog index (Mintlify's grid depends on per-post artwork we do not have; titles stay 22 to 24px), wordmark (identity).

**Reverted at the gate.** None. Revisions inside the gate: S2 title measure 13ch → 14ch (Noloco ran to 4 lines); S4 wide layout fixed after the first build stacked the foot over itself; S5 wide knock-outs narrowed after they covered column text.

## Owner requirements: rendered check (desktop 1440 and phone 390)

- Copy: no stamp phrases, no hero disclosure, no figcaptions on any of 24 routes; exactly one `[data-disclosure]` per page (footer) plus `/disclosure/`; 0 em or en dashes in visible text.
- Program pages: no breadcrumbs; H1 and plan panel top-aligned; real vendor screens; plan panel with inverted entry plan, "Start here" and the official CTA; headline 60px/1.06/14ch; the screen no longer reads as an accidental inset.
- Workflow: light text on chapter colors measured AA (home badges 4.71 to 14.10:1; StackMap job 5.48 / 7.19 / 7.45:1 and detail 4.71 / 6.13 / 6.36:1 on ember / cobalt / pine; badges 11.74 to 14.10:1); a drawn connector with arrowhead replaces arrow captions; phones have their own badge row and stacked bars; no one-word lines at 320 and 390; rail title 2 lines at 1440.
- Diagram: one system on all three hubs, ≥ 520px at 1440 with the crop as the largest element, vertical rows on phones; light checked at 1440, 1024, 768, 390, 320 and dark at 1440 and 390.
- Landing 3D: no slab clipping at 1280, 1440, 1920 with motion on; reduced motion shows the static poster (no canvas).
- Dev overlay: hidden in every capture; the production build contains `env-ribbon` in 0 HTML files.

## Validation (final)

- Build: 25 pages; `node scripts/verify.mjs`: 0 errors, 0 warnings. `astro check`: 0 errors, 0 warnings, 50 hints (Zod deprecation).
- Production build (`PUBLIC_SITE_ENV=production SITE_URL=https://example.com`): 0 HTML files with `env-ribbon`, robots `index,follow`. Local build restored afterwards.
- `node scripts/bench/finish-check.mjs`: 24 routes × 320/390/768/1024/1440/1920: 0 overflow, one H1, 0 dashes, 0 stamps, 0 figcaptions, disclosure = 1, 0 page errors. Images blocked and long injected strings on 8 key routes at 390 and 1440: 0 overflow. 200% root text at 768 and 1280: 0 overflow.
- Impeccable detector (`detect.mjs src`): 1 finding, a false positive (the word `<img>` in a comment in `src/lib/vendorImages.ts`).
- Impeccable audit on `/`, the 3 hubs, `/softr/pricing/`, `/start/`, `/guides/fillout-intake-to-airtable/`, `/compare/softr-vs-noloco/` (checklist judgment from the checks above): accessibility 3 (AA contrast and focus met; standalone text links are 24 to 27px tall, above the 24px AA minimum but under 44px), performance 3 (no new runtime; diagram crops lazy-loaded), responsive 3 (see 200% note below), theming 3 (tokens and dark mode throughout; a few hard-coded oklch hairlines in the hero panel), anti-patterns 3 (no gradient, glass, glow, pills or captions; the home section is still three rounded panels, kept by owner decision) = **15/20, Good**.

## Remaining issues

- 390px with 200% root text still overflows in components this pass did not touch: data tables on the three pricing pages and two guides (27 to 65px), `LayerDiagram` labels, and `CompareList` plates on `/` and `/compare/` (62 to 94px). 768 and 1280 at 200% pass.
- Standalone text links (hero "See what it costs", hub guide links, plan-panel link) are 24 to 27px tall: AA, not 44px.
- Article diagrams are rows at every width; a column layout would need a wider article column.
- Carried over: `about.mdx` launch-blocker line (monitored contact), WebGL verified in headless Edge only, vendor captures rather than owner captures.

---

# History: v9 redesign pass (28 September 2026)

This file describes the repository as it is now. `DESIGN-PLAN.md` holds the plan, section briefs and review log for this pass; `DESIGN.md` (v9) documents the system. Earlier records are kept unchanged under **History** at the end.

**Design read.** Redesign of an editorial affiliate publication for small service business owners: ClickUp's product-marketing discipline over Airtable's three chapter colors, native CSS tokens + Tailwind 4 in Astro, Archivo Variable, restrained motion. Dials: variance 7, motion 4, density 5.

**Process.** Opus planned, researched, reviewed and verified; implementation ran in 6 subagents with exclusive file ownership (shared system and copy purge first, then hero/pricing, hub body/diagrams, home/workflow/compare, articles/indexes in parallel), two review rounds, then finish passes. The harness's task tool has no model selector, so the subagents ran on the default model, not an explicitly chosen Sonnet 5.5. Skills read and used: `redesign-existing-projects` (audit workflow; its fixed Design Values such as Geist, gradient hero text and a glass island nav were not applied because the owner bans gradient/glass decoration and PRODUCT.md is the brief), `design-taste-frontend` (installed version, v2 content: design read, dials, pre-flight), Impeccable `layout`, `typeset`, `adapt`, `animate`, `polish`, `harden`, `audit` and its craft floor, the live [slop catalog](https://impeccable.style/slop/). Impeccable's interview probe was skipped because the owner asked for no check-ins. `optimize` was not run: no performance problem was measured.

**Evidence.** Before: `.impeccable/live/redesign-2026-09-28/before/` (11 page families × 1440/390, full page). After: `.impeccable/live/redesign-2026-09-28/after/` (same set). Review crops were taken from the local static build (`astro preview`), with reduced motion except where WebGL was being checked, and the local-only env ribbon hidden.

## Owner corrections: status

| # | Correction | Result on the rendered site |
| --- | --- | --- |
| 1 | Workflow section (`StackMap` on `/start/`, home "Three jobs, three tools." rail) | Saturated bars with dark text are gone. One continuous path with a node per step; handoff labels sit on the path; "Or skip a layer" is a dashed bypass arc from step 1 to step 3. Hierarchy: number (14px, tabular, muted) → job (step-3, 780) → tool (swatch + 18px/700, links to the hub) → one-line explanation. Mobile has its own vertical spine with number and job on one baseline. The home rail title now sits in two lines ("Three jobs," + muted "three tools.") and the rail uses the same number/job/tool hierarchy. The path draws once on entry (motion moment 2). |
| 2 | "How it fits your workflow" | New `FitDiagram` on all three hubs: zones, one continuous connector with on-line labels, an access boundary rule where the product has one, and a chapter-colored focal block (Fillout and Softr show a crop of the hub screen; Noloco's hugs its text because the screen's blue header fought the pine). Titles 19–21px, details 16px, no gray panel, no caption, no step numbers. Noloco's two small panels became one diagram (sources → tables → permissions boundary → team and client views). Mobile: vertical spine. The 8 article diagrams (Flow/Layer/Entity) use the same language. |
| 3 | Trust-theater copy | Removed sitewide: every "Prices checked"/"Facts checked"/"Updated"/"Checked on" stamp, the `Checked` and `Disclosure` components (deleted), all hero/article/index disclosure blocks, every figure/diagram/video caption, stamp table captions, "Illustrative, not a quote.", "What we recorded on…", the home FAQ "How does this site make money?" (duplicated the disclosure), `requiresDisclosure`/`checkedAt` frontmatter. Defensive lines were rewritten (e.g. "We have not built the same portal in both products…" → "This comparison works from each vendor's documentation and list prices; it is not a speed or usability benchmark."). No copy claims hands-on testing. Alt text unchanged. The one disclosure is a sentence in the footer (`[data-disclosure]`) plus the `/disclosure/` page. |
| 4 | Program hero | Breadcrumbs removed from the hero (BreadcrumbList JSON-LD kept). Full-bleed band with a square top edge (the inset, top-clipped block is gone). Both columns top-aligned: H1 (3 lines at 1440, leading 0.98) + lead + guide link on the left; on the right a pricing panel from the pricing claim with every plan, the entry plan on a light fill with "Start here" as plain text, and the official CTA inside the panel (same `placement` values). The real vendor screen rises out of the band into the canvas. Env ribbon: gated by `IS_PRODUCTION`; a production build (`PUBLIC_SITE_ENV=production`) contains it in 0 of 28 HTML files, and it was hidden in every review capture. |
| 5 | Ambition | See "Reference patterns used" and the section list below. |

## Other priority areas

- **Tables/comparisons:** shared `.data-table`: ink rule on the table, muted 14px heads, product columns with swatch and 16px/700 name, 16px/650 row heads, first column 22% and equal product columns in prose, phone rows as labeled blocks. Sticky table heads were not added: `.table-scroll` owns the overflow, so a sticky head would pin inside the scroller.
- **Pricing:** `PlanLadder` is a ClickUp-style joined grid on subgrid rows (name, price, who, specs, watch align across columns); start plan column filled with AA text; Noloco's two plans sit in a left-aligned two-column grid. Hero panel as above.
- **Guides/articles:** rule-led short answer, ruled mobile TOC row, product links as swatch text instead of pills, rhythm tokens (more space above h2 than below), PlanStrip notes moved into body text, calculator stamp removed.
- **Header/footer/wordmark:** ClickUp-style left-grouped nav with underline active state; light footer with four short columns; the three-slab wordmark was kept (it already works as an identity). Header wraps under large text.
- **Imagery:** single `.frame` (no mats, no captions); hub gallery lead on a full-bleed wash band with an offset grid below.
- **3D:** the WebGL hero's ghost duplicate is gone (the CSS poster is hidden while the scene loads and runs; late scenes are discarded after 2.5s). No slab clipping at 1280/1440/1920. Reduced motion and no-WebGL keep the complete poster. `MiniStack` slabs no longer meet the header.
- **Motion:** three moments only (hero stack, workflow path draw, diagram connector draw). Generic SplitText headlines, fade-ups, count-ups, scroll tilt and parallax were removed.

## 28 Sep findings (first pass): final disposition

| Finding | Disposition |
| --- | --- |
| 1 Mobile hero | Verified fixed before this pass; still holds (headline, lead, actions above the stack at 390). |
| 1b Desktop WebGL clipping | Stale as stated; a different defect (ghost duplicate under the canvas) was found and fixed. |
| 2 Pricing table on phones | Verified fixed; retained. |
| 3 Article tables | Fixed before; captions that were stamps removed now; widths retuned. |
| 4 Edge states | Re-measured (see validation). One regression from this pass (header could not wrap at 200% text) was found and fixed. |
| 5 Screens | Resolved differently: the chapter mat was itself a nested surface; replaced by one frame. |
| 6 Spacing | Incorrect as "fixed" on hubs (dead space under the fit panel); resolved by the new diagram. |
| 7 Sources | Retained; per-source read dates removed. |
| 8 Logo | Retained. |
| 10 Footer banner | Resolved differently: footer redesigned light; closing band kept on three pages. |
| 11 `[example]` links | Retained fix. |
| 12 Detector | Re-run: 0 findings. |
| "Hero keeps price-check line and disclosure" | Overruled by the owner; removed. |

## Slop catalog: final dispositions

| Pattern | Where | Final |
| --- | --- | --- |
| Low-contrast/dark text on color | StackMap bars | Removed (bars gone). |
| Numbers without sequence | Softr entity rows, layer stacks, fit rows | Removed; kept only where order is the content (workflow, hero legend, rail, article flow diagrams). |
| Motion for its own sake | SplitText on every H2, block fade-ups, count-ups | Removed; three motion moments remain. |
| Nested cards | Shot mat, gray diagram panel, rounded facts band, verdict cards | Removed. |
| Large radii everywhere | 28px blocks | Reduced to 10/12/16/20 by role. |
| Captions as decoration | All figures, diagrams, video, stamp table captions | Removed. |
| Hero-metric template, mid-page theme flip | Home cost section | Redesigned as a joined grid on the canvas; figures kept because they are the content. |
| Identical card grid | Comparisons (home, `/compare/`) | Redesigned as `CompareList` rows with typographic plates. |
| Eyebrow above heading | Home chapter kicker | Folded into the chapter head as meta. |
| Pill clutter | Article tags, guides filters, TOC button, nav hover | Replaced with swatch text, underline tabs, ruled rows. |
| Three towers / uneven feature lists | Plan ladder | Joined subgrid columns. |
| Chrome in hero (breadcrumbs) | Program hero | Removed. |
| Glow/glass/gradients | None found | Nothing to remove; none added. |
| Em dashes | Visible copy | 0 on all 24 routes. |

## Reference patterns used

- **ClickUp:** left-grouped nav, compact labels and one dark button (header); muted second clause (home rail, closing band, hub end band); joined pricing grid with the recommended column inverted (`PlanLadder`); light footer with bold heads; hairline product frames; the `cubic-bezier(0.33, 1, 0.68, 1)` / 450ms easing; flat elevation throughout.
- **Airtable:** chapter color blocks (home chapters, hub band) and the numbered chapter rail.
- **Customer.io:** full-bleed bands instead of cards (hub hero, gallery wash band, facts band, hub end).
- **Mintlify:** hero screen rising out of the band into the canvas (program hero).
- **Amplemarket:** color as taxonomy (compare plates, swatches).
- **Warp:** size carries hierarchy in secondary headings (diagram titles, plan names).

## Validation (final build)

- `pnpm build`: 25 pages; `verify.mjs` 0 errors, 0 warnings (28 pages, 15 articles, 9 claims). `verify.mjs` now requires `[data-disclosure]` on commercial pages instead of the "Disclosure." string.
- `pnpm check`: 0 errors, 0 warnings, 49 hints (Zod `z` deprecation notices). The project has no lint or test scripts; `verify.mjs` is its integrity test.
- Production build (`PUBLIC_SITE_ENV=production`, placeholder `SITE_URL`): 0 files contain the env ribbon; robots `index,follow`.
- Scripted browser checks, all 24 sitemap routes at 320/390/768/1024/1440/1920 (reduced motion): 0 horizontal overflow, exactly one H1, 0 em dashes, 0 figcaptions, 0 stamp phrases, exactly one `[data-disclosure]` per page. 200% root text at 768 and 1280: 0 overflow on all routes.
- Contrast: 3,494 text nodes checked on 10 key routes in light and dark (oklch converted to sRGB): 0 failures except a false positive (the hero's light CTA measured against the band instead of its own fill). Agents' computed values: on-chapter muted ≥ 4.72:1; `.tone-2` on chapter bands 3.65–4.66:1 at 32–40px bold (large text).
- Keyboard: skip link, header, theme toggle, CTA and panel links all show a 2px outline in order.
- Harden: very long injected strings in hero, pricing panel, fit diagram, cost, compare and StackMap cause no overflow at 390; with all images blocked no layout collapses (width/height attributes hold space); no console or page errors on 11 key routes with motion on and a full scroll; `data-draw` connectors end fully drawn.
- Impeccable detector (`detect --json src`): 0 findings.
- Impeccable audit (checklist judgment, not field metrics): accessibility 3 (AA met in checks; focus order differs from visual order in the hub hero, see below), performance 3 (unchanged asset pipeline, Three.js lazy-loaded, fewer animations), responsive 4, theming 4, implementation integrity 4 = **18/20**, up from 17.
- Taste pre-flight: passes on em dashes, eyebrows, split headers, section numbers, captions, pills, CTA wrap, button contrast, reduced motion, nav on one line, real images. Documented exceptions: three chapter colors instead of one accent (the brief); chapter-colored bands (hub hero, home chapters, hub end) instead of a single page theme; home H1 is three short beats, not two lines; "Find your stack" appears in the header, home hero and closing band.

## Remaining issues

- At the extreme 320px + 200% root text case, a few home, hub and StackMap elements still exceed the viewport by 13–41px (header and StackMap were fixed). WCAG's 200% resize is met at 768 and 1280.
- Hub hero focus order: the pricing panel (with the CTA) comes before the guide link in DOM order, while desktop shows the link under the lead. The order matches the mobile layout.
- `about.mdx` still says "This site is still in local review. A monitored contact for corrections must be added before public launch." It records a real launch blocker; the owner should add the contact and remove the line.
- WebGL was verified in headless Chromium only; test on a GPU device and a touch laptop.
- Vendor screens are still vendor-published captures; owner captures would be sharper.
- Visual review covered the key routes at 1440/390 and dark mode on hub, pricing, StackMap, cost and footer; the remaining article pages were checked by script, not by eye.

---

# History: first 28 September correction pass (superseded above)

This file records the design correction pass that implemented the 27 September diagnostic. The diagnostic itself is kept, unchanged, under **History** at the end. Everything above History describes the repository as it is now.

**Design read.** Redesign, preserve: an editorial affiliate publication for small service business owners, trust-first and product-forward, built on native CSS tokens + Tailwind 4 in Astro, Archivo Variable, restrained motion. Dials: variance 6, motion 4, density 5.

**Methods actually used.** `redesign-existing-projects` (audit categories; its fixed "Design Values" such as Geist fonts, gradient hero text and a glass island nav were *not* applied, because PRODUCT.md and DESIGN.md are the brief), `design-taste-frontend` (current default, v2 content) for the anti-slop read and pre-flight, Impeccable `layout`, `typeset`, `animate`, `adapt`, `polish`, `harden`, `audit` and its craft floor, the live [Impeccable slop catalog](https://impeccable.style/slop/) (read in full on 28 Sep), and the Refero [Airtable](https://styles.refero.design/style/f4ef80f4-f6e5-4aea-8045-f99efaf208b8) and [ClickUp](https://styles.refero.design/style/efcb73cb-b84a-4ae7-9a2b-e1116f79f130) style pages. No subagents were used.

**How the references were used.**
- ClickUp: flat elevation (edges or background shifts, no card shadows), a plain top bar, heavy display type against compact 13–15px labels, dense data inside generous page whitespace, rules and dividers instead of boxes. This drove the header, tables, plan ladder, source lists, next steps and download rows.
- Airtable: the color-coded chapter surfaces and the dark primary action stay. The comparison "plates" (product names set large on their chapter colors) extend that idea to the comparison cards instead of empty color blocks.
- Neither palette nor component was copied; the cool chalk canvas, Archivo and the three chapter colors are unchanged.

## Verified and fixed

| # | Finding (27 Sep) | Verified? | What changed |
| --- | --- | --- | --- |
| 1 | Mobile hero covers its headline; action below the fold | Yes (390px: stack over "Team in sync.", CTA near y=1123). Desktop WebGL clipping **was reproduced** this time: the global `img, canvas { max-width: 100% }` capped the 3D canvas at 100% width, cutting the slabs at the canvas edge. | Mobile order is now headline → lead → actions → stack, with room above the tilted poster; the pill eyebrow is gone and the lead is 30 words, not 45. The canvas bleeds 18–22% past its stage (`max-width: none`, `pointer-events: none`), the lens widens by the same ratio (`stack3d.ts`), and the hero clips only horizontally. Also fixed a real `Cannot access … before initialization` page error in `stack3d.ts` (tweens called `schedule()` before the render loop existed). |
| 2 | Pricing billing table hides columns on phones | Yes | All pricing tables are `data-stack`: under 40rem each row becomes a labeled block, and plan plus prices share one line. |
| 3 | Article tables tall and cramped; data locked to prose width | Yes | New table system in `global.css`: ink rule, left caption, muted labels, hairline rows, chapter swatch on product columns, no outer box. The article column is now ~60rem (text still ~66ch), so tables and diagrams use the space beside the TOC; paired product columns get equal widths. On phones rows become labeled blocks. MDX tables get labels, product markers and ARIA roles at build time from `src/lib/tableLabels.mjs`, a Sätteri hast plugin (Astro's default MDX processor ignores rehype plugins). |
| 4 | Edge states: `body { overflow-x: clip }` hides content; PlanStrip overflow; Fillout muted text 3.91:1; footer link color-only | Yes | `body` no longer clips; no route scrolls sideways at 320/390/768/1024/1280/1440/1920 (motion on and off). PlanStrip reflows to blocks on phones. `--on-chapter-muted` raised to 90% (4.70:1 on Fillout ember, 6.1+ on the others). The footer disclosure link is underlined. |
| 5 | Screens soft or cropped | Yes | `Shot` no longer upscales past native width (was 1.3×); hub gallery shots are no longer cropped to 16:11. Small captures now display at native size, left-aligned in articles. |
| 6 | Mechanical section spacing | Yes | `--section` is 56–96px (was 72–144px). Prose uses separate intervals for paragraphs, before an artifact, directly after it, and before h2. The pricing "What we recorded" paragraph is now a list of clauses beside the billing table. |
| 7 | Source walls after decisions | Yes | `Sources` groups by publisher, drops the repeated "Publisher —" prefix, starts collapsed above 8 items with a one-line summary, and opens itself when a `#src-…` link targets it. |
| 8 | Generic logo mark | Yes (reads as stacked pills at 26px) | New mark: three slabs at the hero stack's tilt, overlapping in workflow order with knock-out gaps; favicon matches. The wordmark is set wider and heavier (wdth 116, 800). |
| 10 | Templated proof chrome, footer banner everywhere | Yes | The footer's closing statement now renders only on home, `/guides/` and `/compare/` (`BaseLayout closing`); legal and editorial pages end as themselves, and `/start/` no longer links to itself. (Caption boilerplate was already removed in the 27 Sep content pass.) |
| 11 | `[example]` source links | Yes | Renamed to what each thread shows: "updating a record from an embedded form" and "passing the logged-in user into the form". |
| 12 | Detector warnings | Re-run | Home guide-link padding animation removed; `PlanCalculator` result cards no longer use border + 6px top stripe + radius. The remaining `EntityDiagram.astro:69` "side-tab" is the arrowhead's border triangle: a false positive, kept. |

## Resolved differently

- **Finding 9 (CTA label vs destination)** was already fixed in the 27 Sep content pass (`OfficialCta to="pricing"`); nothing changed here.
- **"The short answer"** label stays. It is the one functional label on a callout that skimmers use, not an eyebrow above a heading.
- **Headline periods** ("Read the screen.") stay as the publication's voice.
- **Chapter color panels, verdict cards, guide and comparison cards** stay as cards: each is a clickable unit or a colored decision surface. Everything else lost its box.
- **Numbers** stay only where order is information: the hero legend's intake → portal → team steps and the matching chapter rail, where the number now fills with the chapter color when that chapter is in view. Removed from facts, problem rows, stage columns, comparison cards, hub and article kickers.
- **The extreme 320px + 200%-root-font test**: headings may now break inside a word only when a word is wider than the screen, and page grids let children shrink. Some large display figures (hub price card, footer statement) can still exceed 320px at that simulated size; the page now scrolls instead of hiding them. At 320px with normal text nothing overflows.

## Stale or incorrect findings

- The statement that desktop WebGL clipping was only theoretical: it was real, caused by the global `max-width: 100%` on `canvas`.
- DESIGN.md said every screen is captioned "Vendor-published screen · domain" and that `Shot` allows 1.3× upscaling. Both were stale; DESIGN.md is now v8.

## Slop catalog pass (28 Sep, live catalog)

| Pattern | Where it appeared | Disposition |
| --- | --- | --- |
| Small label or pill above headings (eyebrows, kickers) | Home hero pill with three dots; article kicker ("Comparison", "Guide · Build stage"); hub kicker "02 · Portal · Softr"; hub end-CTA kicker | **Removed.** Guide stage moved into the meta line; hub `n`/`job` data deleted. |
| Split section header (big headline left, small lead floating right) | Every home, hub and pricing section | **Replaced** with the headline, then one line under it. |
| Section numbers without a sequence | Facts, problem rows, stage columns, comparison cards | **Removed**; kept only for the real workflow sequence. |
| Side stripes and thick one-side borders | Read-next cards, cost rows, chapter rail active state, calculator cards | **Replaced** with top rules in the chapter color, square swatches, and a swatch-filled step number. |
| Border + shadow ghost cards, glass | Floating glass header island; comparison and guide cards with border, hover shadow and lift | **Replaced**: plain header bar; cards are background-only with an underline hover. |
| Cards inside cards | Download rows inside the gray panel; legend cards; each plan ladder row boxed | **Flattened** to ruled rows; the starting plan is a color band. |
| Placeholder-looking color blocks | Comparison cards' empty color bars | **Redesigned** as plates that name the products. |
| Grain overlay (`feTurbulence`) over everything, including screenshots | `body::after` | **Removed.** |
| Em dashes in copy | 74 in articles, 31 in source titles, plus site, author and claim strings | **Rewritten** with commas, colons, parentheses or full stops. 0 remain in visible HTML. |
| Middle-dot meta strips | Article meta ("Updated · Facts checked · 9 min read") | **Replaced** with spaced items. Dots inside data values (plan strips) kept. |
| Decorative dots | Home guide rows' triple product dots; legend and calculator dots | **Removed.** Nav, filter and footer product swatches kept as color identity. |
| Motion for its own sake | Card lifts, image nudges, flex-grow bar animation, padding animation | **Removed.** The hero stack remains the one authored moment; links answer with an underline and an arrow nudge. |
| Browser surfaces left default | Scrollbar, caret, form accent | **Themed** from tokens. |
| Hero-metric template | Cost section totals ($34 / $80) | **Kept**: the figures are the verified stack prices the section exists to show, with their conditions beside them. |

## Final validation (28 Sep)

- `pnpm build`: 25 pages, `verify.mjs` 0 errors, 0 warnings (28 pages, 15 articles, 9 claims checked). 37 JSON-LD blocks parse; 0 `sponsored` links.
- `pnpm check`: 0 errors, 0 warnings, 53 hints (pre-existing Zod `z` deprecation notices and one pre-existing unused `formatDate` import in `src/pages/index.astro`).
- Impeccable detector (`detect --json src`): 1 finding, the `EntityDiagram` arrowhead false positive.
- Browser (local `astro preview`): all 24 canonical routes have exactly one H1 and no horizontal scroll at 320, 390, 768 and 1440 (reduced motion); key routes also at 1024, 1280, 1440 and 1920 with motion; no page errors on home with WebGL. Hero clearances measured at 390 (static, animating and scrolled) and 1440. Visual checks: home, Softr pricing, Softr vs Noloco, Fillout hub, `/compare/`, `/guides/`, portal costs and About at desktop and mobile; pricing, article and portal costs in dark mode; the mobile menu opens and closes with Escape. No heading breaks inside a word at 320–1440.
- Contrast: muted text on the three chapter colors 4.70 / 6.13 / 6.36:1; muted on canvas 6.54:1; footer muted 7.87:1.
- Taste pre-flight: passes on em dashes, eyebrows, split headers, section numbers, decorative dots, CTA wrapping at desktop, duplicate CTA intent (the footer closing no longer repeats page endings), reduced motion and theme parity. Intentional exceptions: one chapter color per section rather than one site accent (the three-product system is the brief), and the hero keeps the price-check line plus the compact disclosure (required before vendor links).
- Impeccable audit (subjective, same rubric as 27 Sep): accessibility 3, performance 3, responsive 4, theming 4, implementation integrity 3 = **17/20**, up from 12/20. These are checklist judgments, not field metrics.

## Remaining genuine issues

- Vendor screens are still vendor-published captures, some small (the Fillout form is 520px wide). They now display sharp at native size; better images need owner-captured screenshots.
- WebGL was verified in headless Chromium only. Test the hero on a real GPU device and a touch laptop.
- At the simulated 320px + 200% root font size, the largest display figures (hub price, cost totals, footer statement) still exceed the viewport and scroll.

---

# History: 27 September diagnostic (read-only, superseded above)


**Scope and evidence.** Inspected all **24 canonical pages** from the local static build at **1440 × 900 desktop** and **390 × 844 mobile**, light mode: [48 full-page screenshots](.impeccable/live/visual-audit-2026-09-27/). Also captured six desktop-dark and four mobile-dark full pages (home; the three pricing pages on desktop; Softr pricing, Softr vs Noloco and portal costs on both) and a normal-motion desktop hero viewport. The page index below links each light-mode pair. Screenshots used reduced motion so real, static vendor-product imagery remains visible; the black “Local preview · noindex” chip is **local preview chrome**, not part of the design finding. These images represent the built local site, not a public deployment.

**Methods.** Applied the installed Impeccable [critique](.agents/skills/impeccable/reference/critique.md) and [audit](.agents/skills/impeccable/reference/audit.md), [Impeccable's slop taxonomy](https://impeccable.style/slop/), and the relevant anti-slop/content-density/redesign sections of [Taste Skill v2's published source](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md). Tasteskill v2 was **not installed locally**; its published guidance was read, not executed. Its own scope excludes dense data/product UIs, so its blanket aesthetic rules do not override this editorial publication's useful tables, three chapter colors or source citations. The two independent assessments rated the visual critique **24/32 (“good”)** and technical audit **12/20 (“acceptable”)** on their subjective checklists; these are **not certification or field metrics**. Impeccable's static detector returned three warnings: `EntityDiagram.astro:69` mistakes an arrowhead border for a side-tab, `PlanCalculator.astro:142` flags a useful vendor-colored band, and `index.astro:640` flags a minor padding transition. A live overlay on home, Softr pricing, Softr vs Noloco and portal costs additionally flagged long lines, cramped padding, and hairline borders with shadows; these are heuristic signals, not proof every highlighted node is wrong. The page-level evidence below controls priority.

**What works.** The cool-chalk palette and Fillout/Softr/Noloco chapter colors communicate the actual workflow. Dated prices, non-buy advice, real vendor-published UI, dark mode, clear plan ladders, keyboard-returning mobile menu and working cost calculator are strong foundations. Do **not** replace them with stock images, fabricated hands-on screens, a one-color generic SaaS template, or aesthetic rules that hide sourced facts.

## Findings, in repair order (recommendations only)

1. **P1 — Mobile home hero covers its own headline and buries the action.** The [390px hero crop](.impeccable/live/visual-audit-2026-09-27/overviews/mobile-home-hero.jpg) shows the green product screen crossing “Team in sync.”; “Find your stack” starts near **y=1123**, below an **844px** viewport. `src/pages/index.astro:425-434` moves `.hero-visual` before the lead/actions and applies negative top margin. Keep the product-led composition, but give the visual a bounded mobile region, stop it crossing letters, and bring a clear primary action into the first mobile screen. On desktop, `.hero { overflow: clip }` (`index.astro:420`) and `HeroStack.astro:101-153` canvas overscan warrant GPU-device inspection: **WebGL was unavailable in this headless browser, so live 3D clipping was not reproduced**. The mobile CSS-poster collision **was** reproduced; do not present a theoretical desktop canvas clip as observed.
2. **P1 — Price comparison hides columns without a usable cue.** All three `/[product]/pricing/` pages use a four-column table (`src/pages/[product]/pricing.astro:52-74`). At 390px Softr's table is about **487px** wide inside a **350px** scroll region: “Billed monthly” is cut, “Yearly saving” is offscreen ([crop](.impeccable/live/visual-audit-2026-09-27/overviews/mobile-softr-pricing-table.jpg)). The container is keyboard focusable, but there is no visible overflow instruction. Preserve all four values; show a clear scroll affordance and usable column headings, or recompose each plan into labeled small-screen rows. Check Fillout, Softr and Noloco in both themes.
3. **P1 — Dense article tables become tall, hard-to-compare columns on phones.** [Softr vs Noloco's “Who counts as a paid user”](.impeccable/live/visual-audit-2026-09-27/overviews/mobile-softr-vs-noloco-table.jpg) extends roughly **1,350px** vertically at mobile width; headers are far from the lower answers. Portal costs and the build/launch comparisons repeat the squeeze. On desktop, the `15rem` table of contents plus `.prose { max-width: 46rem }` (`src/layouts/ArticleLayout.astro:159-165`) constrains data even with free space beside it. Keep a readable prose measure; let substantial tables break out of it on wide screens, then use grouped labeled rows or anchored headers/clear horizontal scrolling on narrow screens. Do not simply shrink the type.
4. **P1 — Access to evidence and readability fail on measured edge states.** At a 320 CSS-pixel viewport after 200% text resizing, document width reached **397px on home** and **617px on Softr**; `body { overflow-x: clip }` (`src/styles/global.css:144`) can hide content. The horizontally scrolling `PlanStrip` on `/guides/portal-costs/` has a **312px** scroll width in a **282px** box with no focusable element (`src/components/PlanStrip.astro:19-34`). The Fillout chapter's small muted text measured **3.91:1** against its colored background (`global.css:45-46`; target is 4.5:1 for normal text). The footer `Disclosure` link has only color as its cue and **2.23:1** contrast to neighboring text (`SiteFooter.astro:67-73,139-149`). Treat these as concrete accessibility repair checks, not a claim that the whole site fails WCAG.
5. **P2 — Real vendor screenshots are sometimes too soft or cropped to teach.** Fillout's form source is **520 × 285** and workflow **555 × 295**; `Shot.astro:44,68` permits display up to **130%** of native width. `Shot.astro:86-90` applies a **16:11** `object-fit: cover` crop to later gallery images (`src/pages/[product]/index.astro:93`): roughly **20–23% of the right edge** of those two Fillout screens is removed; some Softr and Noloco screens lose about **10–15%**. The lead Fillout Airtable-sync screen is **not cropped**. Use higher-resolution authorized vendor images or owner-captured screens where possible, retain provenance, and avoid clipping the UI detail needed to judge a feature; a purposeful detail zoom must say what is shown. `/softr/` also delays its first product screenshot below the mobile first screen.
6. **P2 — Section spacing is mechanical where an artifact should lead.** `.prose h2 { margin-top: 2.6em }` (`global.css:334-341`) produces roughly **74px** above headings on mobile; figures/tables add `2em` margins (`ArticleLayout.astro:184-189`). On pricing pages, a three-row table is followed by a long unstructured `What we recorded:` research paragraph (`pricing.astro:74`), then a conspicuous blank stretch before “What changes the bill” ([same crop](.impeccable/live/visual-audit-2026-09-27/overviews/mobile-softr-pricing-table.jpg)). Keep breathing room between decisions, but tighten the table-to-explanation group, structure the limits in skimmable labels, and use content-specific rather than site-wide spacing changes. Do not remove the verified caveats.
7. **P2 — Editorial evidence overpowers some endings.** Open source lists contain **31 links** on `/compare/softr-vs-noloco/`, **23** on `/compare/fillout-vs-tally/`, **19** on the Fillout→Airtable guide and **18** on the Noloco-build guide (`src/components/Sources.astro:18`). That transparency is valuable; the wall of citations after a decision is not. Consider a compact source summary with expandable groups while keeping each claim's citation, keyboard access and `#src-…` deep links functional.
8. **P2 — Identity mark has meaning but little distinctiveness.** The header mark is three offset rounded rectangles at **26px** (`src/components/Logo.astro:10-14`) beside plain Archivo text; it reads as generic stacked bars at header scale ([home screenshot](.impeccable/live/visual-audit-2026-09-27/home-mobile-light.jpg)). Develop a bespoke, legible mark/wordmark from the intake→portal→team idea, test the 26px header and favicon together, and retain its chapter-color meaning. This is a design brief, **not a request to replace the logo now**.
9. **P2 — Promise and destination disagree at the decision point.** The **15** “pricing/plans” vendor CTAs on seven pages open vendor homepages although `pricingUrl` is stored; this was verified in the general handoff, §6–7. Fix label/destination together in a later implementation pass; do not claim a conversion effect without traffic.
10. **P3 — Repeated proof-chrome starts to look templated.** `Shot.astro:63` prints the same `Vendor-published screen · domain` line **28** times, often beneath several screens on one hub (see the general handoff, §6). `SiteFooter.astro:17` repeats the large “Pick the broken job first. The tool comes second.” banner even after short legal/editorial pages. The fixed “The short answer” preface (`global.css:390-398`), TOC and metadata also recur on nearly every article. Give each distinct gallery one clear provenance trail and reserve per-image captions for an actual UI/buyer insight; keep decisions and necessary disclosures, but let a legal page end as a legal page. Repetition is **not evidence of AI authorship**.
11. **P3 — One comparison visibly has generic source labels.** `/compare/fillout-vs-tally/` shows two adjacent `[example]` links to different vendor discussions (`src/content/articles/compare/fillout-vs-tally.mdx:105`). Name each for the precise issue it proves; the source links themselves are useful. No other literal placeholder was found in the targeted content check.
12. **P3 — Use detector warnings proportionately.** Live detector highlights were dominated by hairline-plus-shadow on useful surfaces, while it found **18** long-line and **4** cramped-padding targets on the desktop Softr/Noloco comparison, and **12** long-line/**5** cramped-padding on portal costs. Review actual paragraphs/cells before adjusting width or padding; the chapter color bands, numbered stages and information-rich tables are intentional, not automatic “AI slop.” The homepage guide-link padding animation (`index.astro:640`) is a legitimate minor polish item.

**Page-by-page evidence.** Each pair is a full-page capture; cross-cutting findings above apply where noted. “No separate defect” means no additional page-specific visual issue was observed, not that the page is certified.

| Canonical page | Desktop / mobile | First page-specific review point |
| --- | --- | --- |
| `/` | [D](.impeccable/live/visual-audit-2026-09-27/home-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/home-mobile-light.jpg) | Mobile title collision and primary action below fold; desktop live WebGL still unverified. |
| `/about/` | [D](.impeccable/live/visual-audit-2026-09-27/about-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/about-mobile-light.jpg) | Short editorial page inherits TOC/short-answer/footer chrome; no separate defect. |
| `/compare/` | [D](.impeccable/live/visual-audit-2026-09-27/compare-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/compare-mobile-light.jpg) | Comparison-card rhythm is consistent but repetitive; chapter-color strip is meaningful. |
| `/compare/airtable-portals-vs-softr/` | [D](.impeccable/live/visual-audit-2026-09-27/compare__airtable-portals-vs-softr-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/compare__airtable-portals-vs-softr-mobile-light.jpg) | Three-way cost discussion and one narrow comparison table need an artifact-width check. |
| `/compare/fillout-vs-tally/` | [D](.impeccable/live/visual-audit-2026-09-27/compare__fillout-vs-tally-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/compare__fillout-vs-tally-mobile-light.jpg) | Two tables, 23 end sources and the adjacent “example” links. |
| `/compare/softr-forms-vs-fillout/` | [D](.impeccable/live/visual-audit-2026-09-27/compare__softr-forms-vs-fillout-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/compare__softr-forms-vs-fillout-mobile-light.jpg) | One dense comparison table constrained to prose width. |
| `/compare/softr-vs-noloco/` | [D](.impeccable/live/visual-audit-2026-09-27/compare__softr-vs-noloco-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/compare__softr-vs-noloco-mobile-light.jpg) | Paid-user table, four table blocks and 31-link source ending; [mobile table detail](.impeccable/live/visual-audit-2026-09-27/overviews/mobile-softr-vs-noloco-table.jpg). |
| `/disclosure/` | [D](.impeccable/live/visual-audit-2026-09-27/disclosure-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/disclosure-mobile-light.jpg) | Legal content and small table inherit the large generic footer treatment. |
| `/fillout/` | [D](.impeccable/live/visual-audit-2026-09-27/fillout-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/fillout-mobile-light.jpg) | Form/workflow native resolution, crop and repeated gallery credits. |
| `/fillout/pricing/` | [D](.impeccable/live/visual-audit-2026-09-27/fillout__pricing-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/fillout__pricing-mobile-light.jpg) | Hidden fourth billing column and dense `What we recorded` note. |
| `/guides/` | [D](.impeccable/live/visual-audit-2026-09-27/guides-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides-mobile-light.jpg) | Decide/build/launch groupings make the cards useful; no separate defect. |
| `/guides/build-noloco-client-portal/` | [D](.impeccable/live/visual-audit-2026-09-27/guides__build-noloco-client-portal-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides__build-noloco-client-portal-mobile-light.jpg) | Two tables, ten-step article rhythm and 18-link source ending. |
| `/guides/build-softr-client-portal/` | [D](.impeccable/live/visual-audit-2026-09-27/guides__build-softr-client-portal-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides__build-softr-client-portal-mobile-light.jpg) | Product screenshot followed by repeated provenance caption and large heading spacing. |
| `/guides/client-portal-launch/` | [D](.impeccable/live/visual-audit-2026-09-27/guides__client-portal-launch-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides__client-portal-launch-mobile-light.jpg) | Access-test table is long vertically on mobile; preserve its actual checklist. |
| `/guides/fillout-intake-to-airtable/` | [D](.impeccable/live/visual-audit-2026-09-27/guides__fillout-intake-to-airtable-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides__fillout-intake-to-airtable-mobile-light.jpg) | Real workflow imagery but small source UI; two tables and 19 end sources. |
| `/guides/portal-costs/` | [D](.impeccable/live/visual-audit-2026-09-27/guides__portal-costs-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides__portal-costs-mobile-light.jpg) | Working calculator; inaccessible PlanStrip overflow and crowded cost tables. |
| `/guides/portal-data-model/` | [D](.impeccable/live/visual-audit-2026-09-27/guides__portal-data-model-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/guides__portal-data-model-mobile-light.jpg) | Concept model and one narrow reference table; no separate defect. |
| `/methodology/` | [D](.impeccable/live/visual-audit-2026-09-27/methodology-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/methodology-mobile-light.jpg) | Strong trust content; article/template footer feels oversized for an evidence page. |
| `/noloco/` | [D](.impeccable/live/visual-audit-2026-09-27/noloco-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/noloco-mobile-light.jpg) | Some later dashboard imagery loses its right edge under gallery crop. |
| `/noloco/pricing/` | [D](.impeccable/live/visual-audit-2026-09-27/noloco__pricing-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/noloco__pricing-mobile-light.jpg) | Four-column billing table and dense research note. |
| `/privacy/` | [D](.impeccable/live/visual-audit-2026-09-27/privacy-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/privacy-mobile-light.jpg) | Plain legal copy is readable; generic article preface/footer are disproportionate. |
| `/softr/` | [D](.impeccable/live/visual-audit-2026-09-27/softr-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/softr-mobile-light.jpg) | First actual screen below mobile fold; gallery crops and repeated credits. |
| `/softr/pricing/` | [D](.impeccable/live/visual-audit-2026-09-27/softr__pricing-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/softr__pricing-mobile-light.jpg) | Strong plan cards; incomplete mobile billing table, overlong note, large following gap. |
| `/start/` | [D](.impeccable/live/visual-audit-2026-09-27/start-desktop-light.jpg) · [M](.impeccable/live/visual-audit-2026-09-27/start-mobile-light.jpg) | Useful choose-or-buy-nothing decision flow; no separate defect beyond shared chrome. |

**Acceptance gates for a later, authorized design pass.** At 390px and 320px/200% text, the home headline and action stay visible without overlap; every price/permission value and PlanStrip choice is discoverable with touch, keyboard and screen reader; article tables use available desktop width and remain scannable on mobile; real screenshot UI stays legible without losing needed controls; light/dark contrast checks pass; test the live 3D hero on a GPU-capable browser as well as its reduced-motion poster. No site UI, copy, URLs, styles or components were modified for this audit.
