# DESIGN-PLAN.md: v12 rebenchmark, rename, media, motion, header and footer (3 Oct 2026)

Branch `redesign/rebenchmark-media-pass`, created from the actual state: `redesign/media-pass` at `b4ae269` (v11 media pass, clean tree). The earlier brief expected `redesign/benchmark-pass` at `caaf8a6`; that commit is v10, two branches back, and is history only. Evidence: `.impeccable/live/rebenchmark-2026-10-03/` (`baseline/`, `references/`, `after/`), excluded through `.git/info/exclude` (`.impeccable/live/`). The earlier run folder `.impeccable/live/bench-2026-09-29/` now holds only `bench/` (436 reference files, 29 Sep); the `before/`, `after/` and `media/` folders the older documents cite no longer exist.

## Owner decisions carried in (30 Sep, restated 3 Oct)

D1 to D4 below (v11) stay in force: techniques relaxed (gradients, glow, grain, texture allowed), media from vendor assets and own captures, motion at benchmark density with reduced-motion fallbacks, Airtable/Customer.io tier as the target with Huly and Unicorn Studio studied for details only.

New for v12:

| # | Decision | Rule for this pass |
| --- | --- | --- |
| D5 | Fresh benchmark | Every distinct section is re-captured on the current build and compared again, section by section, in `REBENCHMARK.md`. `GAP.md` and `BENCHMARK.md` are hypotheses to recheck, not the diagnosis. |
| D6 | Header and footer | Both are redesigned (composition, hierarchy, responsive behavior), benchmarked on their own. The v10/v11 "modest footer" limit and "header: retain" verdict are withdrawn. |
| D7 | Rename | "The Client Stack" is replaced with **Wellpick** (record below). Routes, configured domain, canonical URLs and affiliate tracking stay. No domain purchase or account rename in this pass. |

Still binding: real assets only, every vendor file in `src/data/media-manifest.ts`, no captions, alt text, AA on rendered pixels, reduced-motion fallbacks with complete content, one footer `[data-disclosure]`, no stamps, no em or en dashes in visible copy, no stock people, `.env-ribbon` out of screenshots and production.

## Naming record (P0.5, checks dated 3 Oct 2026)

Full research with sources: `.impeccable/live/rebenchmark-2026-10-03/brand-research.md`.

**Round 1 (rejected).** Candidates leaned on workshop metaphors (Quartersawn, Benchlight, Trysquare, Plumbline, Loupe, Kerf, Fettle, Plinth, Joinery …). Most short real words had a same-name software product or a live USPTO mark in class 9 or 42. The clean ones were rejected anyway: `PRODUCT.md` says the identity must not read as workshop or mechanic, and "Quartersawn" is hard to spell on first hearing.

**Round 2 candidates.** Pickwell, Setwise, Usewell, Fairmark, Sortwell, Plotwell, Wellset, Keenly, plus Rightly, Plainly, Clearpick, Truepick, Fairworth, Askwell, Wellpick, Worthpick, Trueword. All but three had a material conflict, for example: Pickwell (ingredient-scanner app), Fairmark (note app; Fairmarkit marks in 35/42), Plotwell (landscaping SaaS with client quotes), Keenly (live class 9 mark), Clearpick (a B2B software review site), Fairworth (a studio selling tool selection), Askwell (field-service software with a client portal).

**Shortlist.**

| | Wellpick | Worthpick | Trueword |
| --- | --- | --- | --- |
| Audience fit | "Well picked": the job of the site in one phrase; reads as advice | Reads as value or deals | Reads as honesty, less as choosing software |
| Distinctiveness | Coined compound; no software or publication found | Coined; nothing found | Generic phrase |
| Saying and spelling | Two easy syllables, spelled as heard | Two syllables, "worth" softens in speech | Easy |
| Memorability | High: a common phrase made one word | Medium | Medium |
| Visual potential | W that ends in a tick; "pick one of a set" motif | Weaker | Quotation motif |
| Residue | WELLPICK class 26 (hair accessories) live; wellpick.com a dormant shop with old complaints; the "Pickwell" app is its reverse | worthpick.com parked | .com/.co/.io all registered |

**Chosen: Wellpick.** It says what a reader wants from the site (a well-made pick, including "pick nothing"), is not tied to forms, portals or any vendor, and gives a mark and motif that grow beyond three tools. USPTO tmsearch: no live WELLPICK mark in classes 9, 35, 41 or 42. Domains (RDAP/WHOIS "no record", 3 Oct): wellpick.co, wellpick.io, wellpick.guide, readwellpick.com, wellpickhq.com. Registered: wellpick.com (2016, dormant shop), thewellpick.com (2025).

**Unverified.** WIPO Global Brand Database (bot challenge), EUIPO/TMview (JS-only app, API reset) and UKIPO were not queried; common-law use only by web search. Search silence is not clearance: a professional knockout search and a registrar check are needed before launch. Nothing was registered or bought.

## Phases (one commit each after its gate)

- [x] P0 Baseline captures, reference inventory and fresh captures, `REBENCHMARK.md` (`35d470d`)
- [x] P0.5 Name: candidates, shortlist, checks, choice, rebrand (`b466847`)
- [x] P1 Assets: glyph system (`dff46cc`); two mobile screens added to the manifest with vendor usage terms (`929bf84`)
- [x] P2 Header and footer (`928fd86`)
- [x] P3 to P5 Sections (`09d956d`), then the owner review of 4 Oct (`929bf84`, `c598978`): see `REBENCHMARK.md` outcomes
- [x] P6 Verification and documents (this commit); remaining issues in `DESIGN-HANDOFF.md` v12

**Owner review, 4 Oct.** The owner rejected the pick-stage hero ("the previous one was better") and asked for live study of the references rather than stills. Reverted: pick stage. Kept and improved: WebGL stack. Rebuilt: details accordion, Noloco ladder, hub flow, hub gallery, home rail, footer disclosure (link only), breadcrumbs (removed), dark theme, hero copy and spacing.

---

# DESIGN-PLAN.md: v11 media pass (30 Sep 2026)

Brief: `GAP.md` (six missing layers, failures F1 to F8). Branch `redesign/media-pass` from `caaf8a6`. Evidence: `.impeccable/live/bench-2026-09-29/media/`. Final state goes to `DESIGN-HANDOFF.md` (v11) and `DESIGN.md` (v11).

## Owner decisions (30 Sep 2026)

These override every earlier rule in this file, `PRODUCT.md` and `DESIGN.md` that conflicts with them.

| # | Decision | Rule for this pass |
| --- | --- | --- |
| D1 | Techniques fully relaxed | Gradient fields, grain, texture and glow are allowed anywhere the benchmarks use them. The v9/v10 "flat surfaces only; no gradients, glass or grain" rule is withdrawn. |
| D2 | Media from both sources | Official vendor marketing assets and self-produced captures (free accounts, staged data). Every vendor file is logged in `src/data/media-manifest.ts` with source URL and license note. Self-captures need the owner's accounts; vendor assets carry the pass until then. |
| D3 | Motion at benchmark density | A reveal per section, scroll progress on the rail, media enter animations, looped recordings. Every moment has a reduced-motion fallback that shows the complete state. |
| D4 | Target tier | Airtable / Customer.io: media-rich sections, carousels, progress rails, real captures. Huly / Unicorn spectacle is not the target. |

Still binding: real assets only (no fake or AI product shots, no benchmark IP), no captions, alt text on every image, AA contrast on rendered values, one disclosure, no stamps, no em or en dashes in visible text, no stock people, `.env-ribbon` out of screenshots and production.

## Phases (one commit each; gate at 1440 and 390, plus dark where color fields change)

- [x] P0 Assets: vendor pulls + manifest, motif library, texture, self-capture shot list for the owner
- [x] P1 Composition system in `global.css`
- [x] P2 Hero + home (F1, F5)
- [x] P3 StackMap + FitDiagram (F2, F4, F7)
- [x] P4 Pricing + indexes + footer (F3, F6, F8)
- [x] P5 Motion pass + finish

---

# DESIGN-PLAN.md: v10 "one route, three stations" (29 Sep 2026)

Working plan for this pass. The checklist at the end is updated as work lands. The final state is recorded in `DESIGN-HANDOFF.md`. The v9 plan (28 Sep) is superseded; its results are recorded in the handoff history.

**Design read.** Reading this as: a redesign (overhaul of key sections, identity preserved) of an editorial affiliate publication for small service business owners, with a product-marketing language (ClickUp discipline over Airtable chapter color), built in Astro with native CSS tokens + Tailwind 4, Archivo Variable, restrained motion.
**Dials.** `DESIGN_VARIANCE 7`, `MOTION_INTENSITY 4`, `VISUAL_DENSITY 5`. Motion stays at 4 because the owner wants "a few meaningful moments".
**Skills used.** `redesign-existing-projects` as the audit workflow (its fixed "Design values" such as Geist, gradient hero text, glass island nav and grain are not applied: the owner bans gradient/glass decoration and PRODUCT.md is the brief). `design-taste-frontend` (installed file is the v2 content: brief inference, dials, section 4.7 layout rules, section 14 pre-flight). Impeccable 4.3.1: `impeccable context`, craft floor, `layout` (diagrams, hero, pricing), `typeset` (hero headline, workflow type), `adapt` (mobile workflow and diagram), `animate` (one draw moment), then `polish`, `harden`, `audit`. Live slop catalog read 29 Sep. No subagents (owner instruction).
**Evidence.** Local static build (`pnpm build`, served by `astro preview` on :4322), reduced motion, light theme, env ribbon hidden. Before captures: `.impeccable/live/redesign-2026-09-29/before/` (11 families × 1440/390 full page, plus section crops in `before/crop/`). Reference captures and Refero text: `.impeccable/live/redesign-2026-09-29/refs/`.

---

## 1. Handoff findings (v9 record) checked against the build

| Finding in DESIGN-HANDOFF.md | Status | Evidence |
| --- | --- | --- |
| Owner 1: StackMap bars gone, one path with nodes, bypass arc, mobile spine | **Partly verified.** Bars are gone and text is ink on canvas. But the bypass note sits in a knock-out on the arc so the arc's legs read as a box; numbers (14px, muted) float above the job instead of belonging to the node; on 390 the handoff labels hang between steps like captions. | `before/crop/start-1440-top.jpg`, `start-390-map.jpg` |
| Owner 1: home "Three jobs, three tools." rail + panels | **Verified as described, still weak.** Title is two lines. The section is three stacked 20px-radius color cards (3,400px tall at 1440) with body text, three fact paragraphs, two buttons and a tilted screen inside each card: a repeated rounded card with nested content. The number/job/tool hierarchy is split between a small rail and the card. | `before/crop/home-1440-chapters-a.jpg`, `home-390-chapters.jpg` |
| Owner 2: FitDiagram zones, one connector, focal block | **Verified as described; the owner's critique still holds.** One 2px line with 12px rings, 14px zone labels, 19–21px titles, a lot of empty canvas below; the Noloco focal block floats high. On phones it is a thin spine with labels. | `before/crop/softr-1440-fit.jpg`, `noloco-1440-fit.jpg`, `fillout-1440-fit.jpg`, `softr-390-fit.jpg` |
| Owner 3: trust copy removed | **Mostly verified, some left.** Remaining: home FAQ "Did you test these products hands on?" + "How we work" link; hub facts lead "each linked to its source"; Softr hub meta description "Every fact links to its source."; `softr-vs-noloco.mdx` "it is not a speed or usability benchmark". | grep of `src`, rendered pages |
| Owner 4: hero breadcrumbs removed, square band, panel top-aligned | **Verified.** The composition is still a text column beside a plan list, with the screen hanging below the band: the product and the price never share a line of sight, and the pricing page repeats the plan list the ladder shows directly under it. | `before/crop/softr-1440-hero.jpg`, `pricing-1440-hero.jpg` |
| Env ribbon gated by `IS_PRODUCTION` | **Verified in source** (`BaseLayout.astro:73`); re-checked with a production build in F3. | |
| Tables (`.data-table`), `PlanLadder` joined grid | **Verified.** Retain. | `before/crop/softr-1440-plans.jpg`, `cmp-1440-table.jpg` |
| Header, footer, wordmark | **Verified.** Retain; identity does not lack one. | `before/crop/home-1440-footer.jpg` |
| WebGL ghost fixed, no clipping | Re-checked in R1 with motion on. | |
| "Remaining: hub hero focus order differs from visual order" | **Verified**, fixed by the new hero (DOM order = visual order). | |

## 2. Owner corrections on the rendered site

| # | What the render shows now | Plan |
| --- | --- | --- |
| 1 | No dark-on-color text is left (stale), but the workflow is two different compositions (StackMap, home cards) with weak connective logic. | One **route** language for both: numbered chapter nodes (the number sits inside the node), colored segments, handoff labels set on the segment with an arrowhead. Home section rebuilt as three stations on one continuous spine; StackMap uses the same nodes horizontally, with the bypass as a separate dashed route below. |
| 2 | Holds. | `FitDiagram` rebuilt as a lane diagram: zone header row, nodes at readable scale, bracket buses for grouped inputs/outputs, arrowed connectors with labels, a large focal block, an access boundary drawn as a full-height rule the flow crosses. Phones: a stacked diagram with arrow connectors. The 3 hubs and 4 article flow diagrams share it. |
| 3 | Mostly done; four lines remain. | Remove/rewrite them; keep the single footer `[data-disclosure]` sentence and `/disclosure/`. |
| 4 | Breadcrumbs gone; composition still weak. | Hero: copy + actions left, real vendor screen right (top-aligned with H1, bleeding to the band's right edge), a joined plan strip across the band's foot with the entry plan inverted and the official CTA at its end. Pricing pages: same hero with the screen; no plan strip (the ladder follows). Headline 3 lines max at 1440. |
| 5 | | Briefs below. |

## 3. New defects found in this pass

- **D1** Home FAQ keeps a defensive question (see 1).
- **D2** Home chapters: body text on chapter color at 17px is AA on cobalt/pine but the three stacked cards make the section 3,400px tall.
- **D3** Hub facts lead and meta description carry source-stamp copy.
- **D4** Hub hero: the lead is 40+ words.

## 4. Slop catalog matches by page family

| Family | Catalog pattern | Disposition |
| --- | --- | --- |
| Home | Repeated rounded cards / nested content (chapter cards with screen, facts, buttons inside) | **Redesign** as stations on a spine; color moves to the image field. |
| Home | Tiny numbers beside headings (rail 01/02/03) | **Retain** as node numbers: the order is the content (intake → portal → team). |
| Home | Hero-metric template (cost totals) | **Retain**: the totals are the verified prices the section exists for. |
| Home | Low-contrast text on colored surface | None left after the redesign (no text on chapter color except the focal block title and plan strip, checked for AA). |
| Hub | Flat rows with thin lines, tiny labels (fit diagram) | **Redesign** (2). |
| Hub | Split hero with stranded panel | **Redesign** (4). |
| Hub | Label above heading | None (zone labels are diagram labels, not eyebrows). |
| Pricing | Three towers | Already joined grid; **retain**. |
| Start | Captions as connectors ("answers become records" floating) | **Redesign** as labels on arrowed segments. |
| Articles | Border on every row | **Retain** in data tables (row tracking), no outer boxes. |
| All | Gradient, glow, glass, grain | None found; none added. |
| All | Motion for its own sake | None; motion stays at three moments. |
| All | Em dashes | 0; re-checked after copy edits. |

## 5. Section briefs

**B1 Route language (shared).** Node: 2.25rem circle filled with the chapter color, number inside in `--on-chapter` 15px/700 tabular (AA: white on ember 4.9:1, cobalt 7.9:1, pine 7.9:1). Segment: 3px stroke in the color of the step it leaves, arrowhead into the next node. Handoff label: 15px/620 `--ink-2`, set above the segment (wide) or beside it (narrow). Draws on entry once (motion moment 2). Draws on ClickUp's "context" line illustration (a continuous line joining the parts) and Airtable's numbered chapters.

**B2 Home workflow ("Three jobs, three tools.").** Head: H2 two lines max, one lead line. Body: three stations on one spine in the left gutter (desktop grid: spine 3rem | copy 5 cols | image 7 cols). Each station: node + job (step-4, 780) on one line axis, tool + entry price (18px/700 + 16px muted), one explanation (20px ink-2, 36ch), facts as a compact ruled list (16px, source link), actions (ink button + text link). Image: vendor screen on a chapter-color field (the only color in the station), 16px radius field, frame inside. Between stations: handoff label on the spine. Phones: spine at the left edge, node aligned to the job's first line, image field full width under the copy, job 1.75rem. Spacing: 96px between stations desktop, 64px phones. Draws on Airtable (chapter color holding product imagery), ClickUp (large product UI, compact labels against heavy display), Customer.io (text on canvas, color as a field).

**B3 StackMap (/start/).** Wide: three columns under one track: node (B1) → segment with handoff label above it → node → segment → node. Under each node: job (step-3), tool line, one line of explanation. Bypass: a second, dashed track below the columns from under step 1 to under step 3 with an arrowhead and its note under the line. Narrow: vertical track, node beside the job's first line, segment label beside the segment, bypass as a dashed branch after step 3. Draws on ClickUp's hairline/label discipline.

**B4 FitDiagram (hubs, article flows).** Wide (container ≥ 60rem): columns per stop with arrow connectors between; a header row of zone labels over a hairline; items centered on one flow axis; grouped items joined by a bracket bus; titles 22px/700, details 16px; focal block 1.4fr, product name at step-3/4, product crop; gate as a full-height 2px ink rule with its label at the top and the rule's text beside it. Phones: stops stacked full width, arrow connectors 3.5rem tall with the label beside, groups as ruled lists, gate as a full-width rule with label above. No caption, no gray panel. Numbered variant (articles) puts the number in the node marker. Draws on Airtable's product-diagram blocks and ClickUp's flat, labeled UI diagrams.

**B5 Program hero.** Band full bleed, square top. Desktop 12 cols: copy 5 cols (H1 `clamp(2.25rem, 1.3rem + 2.6vw, 3.75rem)`, leading 1.0, 3 lines max; lead ≤ 30 words; actions: official CTA light button + guide text link), screen 7 cols bleeding to the band's right edge, top-aligned with H1. Foot of the band: joined plan strip (ClickUp pricing header): one column per plan with name, price, monthly note; entry plan inverted (paper fill, ink text, "Start here" plain text); last cell links to the full plan comparison. Phones: title, lead, actions, screen, plans as rows. Pricing pages: same without the strip. Draws on ClickUp pricing header + hero screen, Mintlify screen-in-band.

**B6 Copy.** Remove D1/D3 lines; lead trims; no new claims.

## 6. Reference patterns (never assets or copy)

ClickUp: left-grouped nav + one dark button (kept), muted second clause (kept), joined pricing header with the recommended column inverted (hero plan strip, PlanLadder), large product UI (hero, stations), one easing curve, flat elevation, light footer (kept). Airtable: chapter colors and numbered chapters (stations, route nodes). Customer.io: full-bleed bands, text on canvas. Mintlify: product in the hero band. Amplemarket: color as taxonomy (swatches, fields). Warp: size carries hierarchy (diagram titles).

## 7. Checklist

- [x] P1 Plan written (this file)
- [x] ~~S1 Shared route tokens~~ and ~~S2 Home workflow stations~~: built, then **reverted at the owner's request** (29 Sep). The owner prefers the original sticky "Three jobs, three tools." rail with the chapter panels. Home is back to its previous markup and CSS (the chapters section renders identical to `before/crop/home-1440-chapters-a.jpg`; `global.css` is byte-identical to its original). Only the FAQ copy change (D1) was kept. Brief B2 is withdrawn.
- [x] G1 Hub gallery (owner screenshots 2, 4, 6): the half-height wash band behind the lead screen and the scattered native-size screens are replaced by a bento of chapter-wash tiles after Airtable's "path to 10x" tiles. The lead screen is full width, centered and rising from the tile edge; the other two share a 7/5 row. Checked at 1440 and 390, light and dark.
- [x] S4 Hub "How it fits your workflow" (owner screenshots 1, 3, 5): new `HubFlow` component after Mintlify's converging-lines pattern (replaces brief B4 on hubs). A chapter tile holds the real product screen as the focal point, sources converge on it as curves, and the flow crosses the access boundary (an ink rule with the rule's text) before fanning out. Handoff labels sit on their own lines. Phones get a purpose-built vertical version. On all 3 hubs; articles keep `FitDiagram`.
- [ ] S3 StackMap (B3)
- [ ] S5 Program hero + plan strip (B5), pricing hero
- [x] S6 Copy: home FAQ "hands on" item replaced; hub facts lead trimmed; Noloco note folded into the gate
- [ ] S6b Remaining copy: Softr meta description, `softr-vs-noloco.mdx` benchmark line; stamp scan on built HTML
- [ ] R1 Review round 1, desktop + mobile, defect list, fixes
- [ ] R2 Review round 2 (changed areas only)
- [ ] F1 Polish, harden, audit; detector
- [ ] F2 Taste pre-flight
- [ ] F3 `pnpm build`, `pnpm check`, production build ribbon check
- [ ] F4 DESIGN.md and DESIGN-HANDOFF.md updated

## 8. Review log

**29 Sep, owner review.** The owner rejected the home "stations" rewrite (it lost the sticky title rail) and sent six screenshots of the hub gallery and fit diagram, zoomed out to show whole sections. Actions: revert home; restudy the live reference sites (Airtable's bento and layered workflow planes, Mintlify's lines converging into the product, Customer.io's bordered grid, ClickUp's product UI); rebuild the gallery and the hub diagram.

**Gallery/diagram pass, defects found and fixed in-pass:** container query set on the element it styled (the wide grid never applied; fixed with an inner `.hf-grid`); output rings at the item's top-left (a narrow rule outranked the wide one); handoff labels clipped by the focal ring in narrow connector cells (columns widened, one label per line); on phones the sources converged into the title text (the title now leads the vertical diagram); the narrow gallery tile left a band of empty wash above its screen (that screen now shows larger). Checks: build 0 errors, `verify.mjs` 0 errors, 3 hubs × 320/390/768/1024/1440/1920 with no horizontal overflow.
