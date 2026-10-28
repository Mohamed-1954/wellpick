# REBENCHMARK.md (3 Oct 2026, v12)

A fresh, section-by-section benchmark of the **current** site (branch `redesign/media-pass` at `b4ae269`, the v11 media pass), taken before any v12 UI change. `GAP.md` (30 Sep) and `BENCHMARK.md` (29 Sep) were treated as hypotheses and rechecked against the new captures. Implementation outcomes are appended at the end.

## Evidence

Root: `.impeccable/live/rebenchmark-2026-10-03/` (excluded from git by `.git/info/exclude`: `.impeccable/live/`).

- **B** = `baseline/`: 1,283 files. `scripts/bench/sections.mjs` on the static build (`astro preview :4322`), HEAD `b4ae269`, reduced motion (every reveal complete), `.env-ribbon` hidden. Routes: `/`, the 3 hubs, the 3 pricing pages, `/guides/`, `/compare/`, `/start/`, `/guides/portal-costs/`, `/compare/softr-vs-noloco/`, `/compare/softr-forms-vs-fillout/`, `/guides/build-noloco-client-portal/`, `/about/`, `/404/`. Each at 1440 and 390, light and dark: `<id>__<w>__<theme>__full.png` plus one crop per section `__NN-<label>.png`. Chrome states on home: `__chrome-header-scrolled`, `__chrome-nav-hover`, `__chrome-nav-focus` (1440), `__chrome-menu-open` (390). `index.json` records route, viewport, theme and state.
  - Capture defect found and fixed: on the first run, lazy images that a fast scroll passes over had not loaded in headless Edge (blank white planes in the Noloco chapter and the scroller). Probed directly (`tmp/lazy.mjs`): the files load after a normal scroll, so this is a capture artifact, not a site bug. The tool now switches lazy images to eager and waits. Home and Softr were recaptured; the other routes keep the first-run crops, so a blank plane in those crops is not evidence of a site defect.
- **R** = `references/fresh/`: 66 files from `scripts/bench/chrome-refs.mjs`, captured 2026-10-03: header at top and after scroll, every desktop dropdown the script could open, the mobile menu open, and the footer at 1440 and 390, for airtable.com, airtable.com/platform/app-building, clickup.com, customer.io, mintlify.com, amplemarket.com, huly.io, unicorn.studio. `chrome-log.json` lists each state. Observations: `references/notes.md`.
- **A** = archived `.impeccable/live/bench-2026-09-29/bench/` (436 files, captured 2026-09-29): full pages and slices of home, pricing, blog, article and compare routes of the same seven sites (`bench.json` lists the URLs; `airtable-platform` is `/platform/app-building`). Reused where legible. The archive's `before/`, `after/` and `media/` folders cited by older documents no longer exist.

**Unavailable or not captured.** ClickUp and Unicorn Studio desktop dropdowns: no announced trigger, so the script could not open them (logged). Airtable mobile menu: the scripted tap did not open it (logged). Huly and ClickUp `<footer>` elements are only their base rows; their full page ends are in the archive (`huly-home__1440__s06.png`, `clickup-home__1440__s08.png`). Unicorn Studio pricing redirects to a login (29 Sep). Mintlify diagrams render to canvas and are blank in stills (29 Sep).

## What changed since GAP.md

GAP.md described v10. The v11 pass (`1995ac0` to `b4ae269`) already shipped most of its fixes; the fresh captures confirm:

| GAP row | State in the fresh baseline |
| --- | --- |
| Layer 1 composed media | **Resolved in part.** Lit chapter scenes, scroller, StackMap screens, FitDiagram crops, covers exist (B `home__1440__light__03`, `__04`, `start__1440__light__04`, `softr__1440__light__06`). Open: hero screens unreadable inside thick colored bezels (B `home__1440__light__01`); index heroes repeat the same tilted-tablet stack (B `guides__1440__light__01`); article heroes have no media (B `vs__1440__light__01`); the mobile menu has none. |
| Layer 2 depth | **Resolved** on home panels and FitDiagram. |
| Layer 3 motion | **Partly.** Reveals, rail progress, loop video exist. Articles had a 3px CSS scroll-timeline progress bar fixed to the viewport top (motion only, not in the reduced-motion captures; corrected 4 Oct, it was first logged here as missing). No motion in the header or footer. |
| Layer 4 texture | **Partly.** Lit fields with grain on home and StackMap; hub hero bands are still flat color (B `softr__1440__light__01`). |
| Layer 5 iconography | **Superseded.** The glyph library speaks the old three-slab logo language, which the rename retires. |
| Layer 6 chrome | **Open.** Header and footer were not redesigned (B `home__1440__light__00`, `__11`); no dropdown; mobile sheet is text only (B `home__390__light__chrome-menu-open`). |
| F1 rail + connectors | **Resolved** (progress fill, crossfade, arrows removed). New defect: under reduced motion the crossfade stack shows the previous line as a ghost under the current one (B `tmp/noloco-scene.png`: "your base." under "The same records run the team."). Panels: actions float alone at the right with large empty color (B `home__1440__light__03`). |
| F2 FitDiagram | **Resolved.** New defect: the `requests` label collides with the focal crop's edge (B `softr__1440__light__06`). |
| F3 PlanLadder | **Resolved** (toggle, groups, marks, hover; B `softr__1440__light__07`). |
| F4 StackMap | **Resolved** (B `start__1440__light__04`). |
| F5 hero | **Open, reframed.** The WebGL slab stack is the old identity; see Hero. |
| F6 guide covers | **Partly.** Covers exist, but a 3-column grid with 2 cards leaves a hole (B `guides__1440__light__02`), and the Softr cover is an inventory demo ("Neon-x Mechanical Keyboard") unrelated to client work. |
| F7 article diagrams | **Resolved** through FitDiagram. |
| F8 footer | **Open**, now a full redesign (D6). |

## Section matrix

Each row: local section and routes; baseline evidence; references considered (A archived, R fresh); observed gaps (O = observed in captures, I = inference); selected reference and why; decision; GAP mapping. "Improvement" means: better hierarchy and media at 1440 and 390, both themes, AA on rendered pixels, reduced motion complete.

### Global chrome

**Header** (every route). B `home__1440__light__00-site-header`, `__chrome-header-scrolled`, `__chrome-nav-hover`, `__chrome-nav-focus`, dark variants.
- Considered: Airtable R `airtable__1440__header-top`, `__dropdown-1..3`; Customer.io R `customerio__1440__dropdown-1`; Mintlify R `mintlify__1440__dropdown-1`; Huly R `huly__1440__dropdown-1`; Amplemarket R `amplemarket__1440__dropdown-*`; ClickUp and Unicorn R `__header-top` (dropdowns not openable).
- Gaps (O): 64px bar identical at top and after scroll; old three-slab logo at 28px with an 18px wordmark; products shown as three swatch links with no description, price or media; no dropdown, so pricing pages are two clicks deep; one ink "Find your stack" button. Silhouette and hierarchy equal Mintlify's simplest state, without its panels. (I) A first-time reader cannot tell from the header what each tool does.
- Selected: **Airtable** mega panel (item = icon + title + one-line job, plus a feature panel staging real product media on a tinted field), because our three tools are a genuine small content set where a job line and a real screen help the choice. Secondary: **Mintlify** for the floating rounded panel and centered nav proportion; **Customer.io** for custom glyph per item.
- Decision: new 72px bar that condenses to 60px with a surface and hairline after scroll; new wordmark left; nav: **Tools** (panel: three tools with glyph, job, entry price, guide and pricing links, plus a feature pane with the hovered tool's real screen on its lit field), Guides, Compare, Costs; right: theme toggle and one ink "Start here" action to `/start/`. Panel opens on click and on hover with intent delay, closes on Escape (focus returns to trigger), outside click and focus leaving; arrow keys move within it. Long pages (articles, hubs) get a 2px reading-progress line on the header's lower edge. Keep: sticky, theme toggle, skip link.
- Mobile: right-side drawer with scrim (Customer.io R `customerio__390__menu-open`) rather than the empty full-screen sheet: tools as rows with glyph, job, price and a pricing link; reading links; action pinned at the foot. `<dialog>` keeps focus trapping and Escape.
- GAP: layer 6, D6.

**Footer** (every route) and **closing band** (`closing` prop: home, `/guides/`, `/compare/`, `/start/` and others). B `home__1440__light__11-site-footer`, `__10-where-to-start`, `home__390__light__11`, dark variants.
- Considered: Airtable R `airtable__1440__footer`; Customer.io R `customerio__1440__footer`; Mintlify R `mintlify__1440__footer`; Amplemarket R `amplemarket__1440__footer`; Huly A `huly-home__1440__s06`; Unicorn R `unicorn__1440__footer`; ClickUp A `clickup-home__1440__s08`.
- Gaps (O): light footer on the light canvas, so the page has no clear end; the chapter band repeats the Tools column's links in a heavier form; the closing band is a separate statement on the canvas above it; theme control only in the header; brand presence is a 28px logo. (I) It reads as a template footer.
- Selected: **Customer.io** for the dark full-bleed surface with the brand alone in a wide first column and sub-grouped columns; **Huly** (secondary) for closing statement + large lit brand artwork + footer as one stage, scaled down to our register; **Mintlify** (detail) for the theme switch in the base row and texture only at the edges.
- Decision: one dark stage in both themes: the closing statement (where `closing` is set) and action at the top, a large drawn wordmark artwork with the motif's light, then the brand column (wordmark, one sentence) and grouped links: Tools (each tool with its guide and pricing as a pair), Read, Publication; base row with copyright, the single `[data-disclosure]` sentence linking `/disclosure/`, and the theme switch. Remove the chapter slab band. Mobile: stacked groups in two columns, artwork scaled, base row stacked.
- GAP: F8, D6.

### Home (`/`)

**Hero.** B `home__1440__light__01`, `home__390__light__01`, dark variants.
- Considered: Airtable A `airtable-home__1440__hero` (media stage under the headline); Customer.io A `customerio-home__1440__hero`; ClickUp A `clickup-home__1440__hero`; Huly R `huly__1440__dropdown-1` (hero visible); Unicorn A `unicorn-home__1440__hero`.
- Gaps (O): screens shrunk inside thick colored bezels are unreadable at 1440 and smaller at 390; the canvas behind is flat; a band of empty space under the legend; the WebGL stack only animates on capable desktops, so reduced motion and phones see a static poster. (I) The slab stack is the retired brand's metaphor.
- Selected: **Airtable** home: the stage carries the hero. Secondary: Unicorn/Huly for one light field behind the stage, kept subtle.
- Decision: replace the WebGL stack with a "pick" stage: three real screens (intake, portal, team) as planes on a lit, grained field; the picked one comes forward and its legend entry highlights; on motion, the pick advances every few seconds and on hover/focus of a legend item (no autoplay under reduced motion: the portal is picked and all three are visible). Headline, lead and actions keep their words and beats. Removes three.js from the bundle.
- GAP: F5, layers 1, 2, 4.

**Problems ("Start with the job that is broken.")**. B `home__1440__light__02`.
- Considered: ClickUp A `clickup-home__1440__s02` (list rows), Customer.io A `customerio-home__1440__s03`.
- Gaps (O): three quote rows with swatch and arrow; clean and scannable. Known 200%-text overflow at 390 (v11 remaining issue).
- Decision: **keep**; the rows get the new chapter glyph instead of the swatch for recognition. Evidence: it already does its job (choose by pain) at both widths.

**Chapters (rail + lit panels).** B `home__1440__light__03`, `home__390__light__03`, `tmp/noloco-scene.png`.
- Considered: Airtable A `airtable-home__1440__s02`, `airtable-platform__1440__s02`; Customer.io A `customerio-home__1440__s02`.
- Gaps (O): reduced-motion ghost of the previous rail line; actions float alone right of the facts with an empty color block below them; rail markers use the old circle nodes.
- Selected: **Airtable platform** (chapter icon showing the active member of a set; mosaic bleeding off the edge).
- Decision: fix the crossfade (inactive lines hidden, not stacked); actions sit under the facts; rail nodes become the new chapter glyphs; panels keep their scenes.
- GAP: F1.

**Screens scroller.** B `home__1440__light__04`.
- Considered: Airtable A `airtable-platform__1440__s03` (workflow cards with edge peek); Mintlify A `mintlify-home__1440__s03` (carousel dimming).
- Gaps (O): works (arrows, progress, edge peek, keyboard focusable track); lead "Screens from each vendor's own product images" is defensive copy.
- Decision: **keep**; lead rewritten to what the reader gets. Cards gain a hover lift already present.

**Cost.** B `home__1440__light__05`. Considered ClickUp A `clickup-pricing__1440__s01`. Gaps (O): joined grid with two totals and three rows; clear. Decision: **keep**; evidence: numbers lead, AA verified in v11.

**Compare cards (`CompareList`, also `/compare/`).** B `home__1440__light__06`, `compare__1440__light__02`. Considered Mintlify A `mintlify-blog__1440__s01`. Gaps (O): cover cards carry glyphs in the old slab style. Decision: covers adopt the new glyphs; layout kept.

**Guides by stage.** B `home__1440__light__07`. Considered Mintlify A `mintlify-blog__1440__s02`. Gaps (O): three text columns, adequate. Decision: **keep** (text lists suit a 3 × 2 set; covers live on `/guides/`).

**Downloads.** B `home__1440__light__08`. Considered Customer.io A `customerio-home__1440__s04`. Gaps (O): a quiet row of three files; adequate. Decision: **keep**.

**FAQ.** B `home__1440__light__09`. Considered ClickUp A `clickup-pricing__1440__s04` (FAQ accordion near the page end). Decision: **keep** (definition list, no accordion needed for three answers).

### Hubs (`/fillout/`, `/softr/`, `/noloco/`) and pricing pages

**Program hero** (hubs; pricing pages without the screen). B `softr__1440__light__01`, `softr__390__light__01`, `softr-pricing__1440__light__01`.
- Considered: ClickUp A `clickup-vs__1440__s01`; Airtable A `airtable-platform__1440__hero`.
- Gaps (O): strong plan panel; flat chapter band without the light and grain the home fields use, so hub and home read as two systems.
- Decision: band becomes a lit `.field` (same tokens as home); composition kept. AA re-measured on the lit band.

**Verdict, Facts, Details, Video, Next steps + Sources, Hub end band.** B `softr__1440__light__02`, `__05`, `__08`, `__09`, `__10`, `__11`. Considered ClickUp A `clickup-vs__1440__s02`, Mintlify A `mintlify-article__1440__s02`. Gaps (O): ruled, readable, consistent with v10/v11 gates. Decision: **keep**; hub end band gets the lit field like the hero.

**Annotated shot (Softr) and Gallery.** B `softr__1440__light__03`, `__04`. Considered Airtable A `airtable-home__1440__s02`. Decision: **keep** (wash tiles already follow Airtable).

**FitDiagram (hubs).** B `softr__1440__light__06`, noloco and fillout `__05`. Considered Mintlify A `mintlify-home__1440__s02`; Airtable A `airtable-platform__1440__s02` (tile rows). Gaps (O): `requests` label collides with the crop; old-style glyphs. Decision: label collision fixed; glyphs replaced. GAP F2.

**PlanLadder (hubs, pricing).** B `softr__1440__light__07`. Considered ClickUp A `clickup-pricing__1440__s01`. Decision: **keep**; no further data exists for more groups or billing options. GAP F3 resolved.

**Pricing: worked examples, yearly vs monthly, what changes the bill, end.** B `softr-pricing__1440__light__03..06`. Considered ClickUp A `clickup-pricing__1440__s02..s04`. Decision: **keep**; tables and fact lists carry real numbers.

### Indexes

**`/guides/` hero and `/compare/` hero (`MiniStack`).** B `guides__1440__light__01`, `compare__1440__light__01`. Considered Mintlify A `mintlify-blog__1440__hero`; Airtable A `airtable-blog__1440__hero`. Gaps (O): repeats the retired slab-tablet stack. Decision: replaced by the same "pick" stage as the home hero at a smaller scale, static (the pick follows the guide filter on `/guides/`).

**Guide stage grids with covers.** B `guides__1440__light__02..04`. Considered Mintlify A `mintlify-blog__1440__s01`. Gaps (O): 3-column grid with 2 cards leaves a hole; an unrelated inventory demo as the Softr cover. Decision: stage head in its own left column with the cards in a 2-column grid to its right at ≥64rem; covers use client-work screens. GAP F6.

**`/compare/` glance table.** B `compare__1440__light__03`. Considered ClickUp A `clickup-vs__1440__s02`. Decision: **keep**.

### Articles (guides, comparisons, `/start/`, `/guides/portal-costs/`, pages)

**Article hero.** B `vs__1440__light__01`, `guide-noloco__1440__light__01`. Considered Mintlify A `mintlify-article__1440__hero` (cover art card); ClickUp A `clickup-article__1440__hero`. Gaps (O): text only, right half empty at 1440. Decision: articles about products carry a cover (lit field + glyphs + real screen, the card cover at hero scale) to the right on wide screens and under the lead on phones; pages (`/about/`, `/privacy/` …) stay text-only.

**TOC, short answer, prose, tables, `PlanCalculator`, `PlanStrip`, `Shot`, decision actions.** B `vs__1440__light__02..`, `costs__1440__light__*`. Considered Mintlify A `mintlify-article__1440__s01`; ClickUp A `clickup-article__1440__s02`. Decision: **keep**; the header's reading-progress line adds the missing position cue.

**StackMap (`/start/`).** B `start__1440__light__04`. Considered Customer.io A `customerio-home__1440__s02`. Decision: **keep** (F4 resolved); badges use the new glyphs.

**FlowDiagram / FitDiagram (articles), LayerDiagram, EntityDiagram.** B `vs__1440__light__07`, `__08`, `guide-noloco__1440__light__*`. Considered Mintlify A `mintlify-home__1440__s02`. Decision: inherit glyph changes; LayerDiagram 200%-text overflow stays a known issue.

**404.** B `notfound__1440__light__01`. Decision: copy "This page is not in the stack." rewritten for the new brand; layout kept.

## Direction

One identity carries the pass: **Wellpick** (see `DESIGN-PLAN.md` for the naming record). Its motif is the *pick*: a set of options with one brought forward and marked. The same idea runs through the wordmark (a W whose last stroke rises into a tick), the chapter glyphs (each with a small tick accent), the hero and index stages (one real screen picked from three), the header panel (the hovered tool's screen comes forward), and the footer artwork. Light comes from the existing chapter fields and grain; the footer gives the page a dark end. No section borrows a benchmark's look wholesale.

## Implementation order

1. Rename and identity: brand config, wordmark, favicon, Open Graph image, structured data, copy (P0.5, P1).
2. Glyph library in the new language (P1).
3. Header and footer (P2).
4. Hero pick stage, index stages, chapters fixes (P3).
5. FitDiagram label fix, covers, guide grid, article cover, hub band light (P4, P5).
6. Motion (pick cycling, header progress, footer artwork reveal) with reduced-motion fallbacks; verification (P6).

## Outcomes (3 to 4 Oct 2026)

Evidence: `after/p2/` (header and footer states, light and dark, 1440 and 390), `after/p3/` (first section pass), `after/fb/` (owner review fixes). Interaction checks: Escape closes the Tools panel and returns focus to its trigger; Escape closes the drawer and returns focus to the menu button (both themes, `tmp/chrome.mjs` log); accordion open height animates 72 → 247px over ~450ms with motion and opens at once under reduced motion.

### First pass (3 Oct)

| Section | Outcome |
| --- | --- |
| Header | **Redesigned.** 76px open bar that condenses to 60px on a blurred surface after scroll; Wellpick wordmark; Tools panel after Airtable (glyph, job, entry price, pricing link per tool; the pointed-at tool's real screen on its lit field); reading-progress line on long pages; right-hand drawer with scrim on phones. Replaces the article-only CSS progress bar. |
| Footer | **Redesigned.** One dark stage in both themes after Customer.io and Huly: closing statement with the lit mark, brand column, tools with paired pricing links, Read and Publication groups, theme switch, poster wordmark as the last line. |
| Rename | **Done.** Wellpick across config, wordmark, favicon, Open Graph card (`public/og.jpg`), Organization and Article schema, about and 404 copy. |
| Glyphs | **Redrawn** in the mark's stroke language with the pick tick. |
| Hero | Pick stage built, then **reverted at owner review** (below). |
| Guide grid, covers | **Done.** Stage head column, odd counts open with one wide card, no holes; the keyboard-demo cover replaced. |
| Comparison hero | **Done.** Cover beside the title on wide screens. |
| Hub bands | **Done.** Lit field with grain on hero and end bands. |
| FitDiagram label | **Done**, then superseded by the flow stage (below). |
| Chapter rail line | **Done.** No ghost under reduced motion; actions under the facts. |

### Owner review (4 Oct) and what changed

The owner reviewed the rendered site and asked for these changes. The reference sites were revisited live in a browser this time (airtable.com, airtable.com/platform/app-building, customer.io/pricing, mintlify.com, huly.io, unicorn.studio), not only from stills.

| Owner note | Reference studied live | Change |
| --- | --- | --- |
| Details accordion: plus/minus broken, text appears abruptly | Customer.io pricing FAQ (heading in its own column, one list of rows, rotating control) | Root cause: the hub's local `rotate` stacked on the global `transform: rotate`, so the closed row drew a minus. Rebuilt globally: round plus control that fills ink and turns to a minus; open rows grow with `::details-content` + `interpolate-size` and the text fades in (`@starting-style`); instant under reduced motion. Hub section now has the heading sticky on the left and one list on the right, so an open row never leaves a hole beside a closed one. |
| Noloco plans pushed left | Customer.io pricing ("Enterprise: Let's talk" column) | Two-plan ladders add Noloco's custom Enterprise tier (the pricing claim says "Enterprise custom") as a text-only third column with a link to Noloco's plan page; the grid spans the page. No prices or limits invented. |
| "How it fits your workflow" looks like a sketch | Mintlify home bento (fine line bundles through UI cards; "Control who has access", "Connect with your systems") | New `FlowStage` on the hubs: source tiles, a bundle of fine gradient lines running behind the product's real screen to a lock where it narrows to the lines that pass, then the people who see the result; a light travels along the passing lines (motion only). Under it, one card per stop. Phones read the cards joined by a chapter line, with the product screen in its card. Dot grid, hatching and knock-out labels removed. |
| Gallery bento is plain | Airtable home hero tabs and Customer.io product tabs | New `HubShowcase`: tabs on the left (title + what to look at, fill line while it auto-advances), the chosen screen staged large on the lit field. Stops for good once the reader picks; no auto-advance under reduced motion; arrow keys, Home and End. Phone screens (new: Softr's mobile portal, our capture of Fillout's intake template) sit in a device edge. The unrelated inventory demo is gone. |
| Rail looks cheap | Airtable app-building rail (ruled rows, small marker) | Ruled rows with the chapter glyph, job, tool and number; the current row lifts onto a surface and its glyph takes color; a bar under each row fills with that chapter's share of the scroll, reading as one segmented progress line. |
| Remove the footer disclosure sentence | n/a | Removed. The footer base row keeps one `[data-disclosure]` link to `/disclosure/` (the hard rule and `verify.mjs` still pass). Risk noted in the handoff: once affiliate links go live, a link alone may not be a clear enough disclosure next to them. |
| Remove breadcrumbs | Mintlify article ("All articles" back control) | Removed on `/guides/`, `/compare/` and every article (including the costs guide); nested articles get one "All guides" / "All comparisons" back link with a round arrow. Breadcrumb structured data is kept. `Breadcrumbs.astro` deleted. |
| Dark mode backgrounds | n/a | Canvas lifted from near-black (`#0b0e14`) to a slate night (`#13171f`), with larger steps to surface and rules; `theme-color` updated; the footer stays deeper so it still ends the page. |
| Hero: catchier copy, less top space, the pick stage looked like a cheap copy, the previous stack was better | Airtable hero (one big staged media; slow field color shifts), Unicorn Studio (lit field behind the scene) | Copy: "Better briefs. Clearer portals. Calmer teams." with a lead that names the three tools and the "buy nothing" answer. Top padding cut to about half. The WebGL slab stack is restored (owner preference) and improved: bezels halved so the screens read, plus a slowly drifting three-color light field behind it (static under reduced motion). The pick stage component is deleted; index heroes go back to the mini stack with the same thinner bezels. |
