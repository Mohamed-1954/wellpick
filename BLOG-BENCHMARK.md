# BLOG-BENCHMARK.md (27 Oct 2026, v13)

Benchmark and outcome for the new blog: the `/blog/` index, the post template and the "Blog" navigation item. The site had no blog before this pass, so the baseline is the closest existing templates: the guides index (`/guides/`) and the article page (`/compare/softr-vs-noloco/`), captured in `.impeccable/live/rebenchmark-2026-10-03/after/final/` (v12, 4 Oct).

Evidence: `.impeccable/live/blog-2026-10-27/` (excluded from git). `references/` holds fresh captures taken 27 Oct with `tmp/blogrefs.mjs` (index and one post per site, 1440 and 390, two viewports plus full page; `log.json` records final URLs). `wip/` holds our captures. Live visits in a browser the same day for daily.dev (index and post), Mintlify and Customer.io, to read motion, hover and layout behaviour rather than stills only.

## References considered

| Site | URL (final) | What it does | Transferable to Wellpick |
| --- | --- | --- | --- |
| daily.dev (the owner's added reference) | https://daily.dev/blog/ | Short head (label, 2-line H1 with a colored second clause, one lead), a featured carousel with a real screenshot, a search field, then a dense list: topic tag, date, minutes, title, one line, author. Posts: breadcrumb, title, author/date/minutes, hero image, sticky right contents with the active item highlighted, FAQs at the end, "More like this". Prose 18px / 1.62, about 714px measure. | The dense ruled list (our rows), the head with a muted second clause, the post hero image, contents with an active marker, a FAQ-style "Questions" block and "More like this". Not: author avatars (we publish as the editorial team), the carousel (one lead story is enough for 24 posts), share buttons. |
| Mintlify | https://www.mintlify.com/blog | Featured post as a wide split card, category tabs under it, then a 3-column grid of drawn covers in one illustration system. | Category tabs with an underline, and one drawn cover system for every post. |
| Customer.io | https://customer.io/blog/ (served `/learn` to the headless capture) | Lead story large on the left with four stacked rows beside it, each with a color-field cover; topic list with counts. | The lead plus stacked latest rows, color-field covers, counts on topic tabs. |
| Airtable | https://www.airtable.com/articles | Dark head with "quick start" topic pills, a featured illustration, a left topic tree with counts, a grid of covers drawn as icons on gridded color fields. | Confirms the cover idea: a product-language icon on a gridded color field. Not: the topic tree (6 topics do not need one). |
| ClickUp | https://clickup.com/blog/ | Big H1 beside a featured post, newsletter form, Recent/Popular toggle, product-screenshot covers. | Nothing new: no newsletter exists here, and we have no popularity data. |
| Amplemarket | https://www.amplemarket.com/blog | Pill filters with search, two large cards with the title set inside the cover. | Not adopted: text inside covers conflicts with the no-caption, title-as-link rule. |
| Huly | https://huly.io/blog | Editorial stacked list: tag, date, large title, excerpt, AI-generated imagery. | Large titles in rows. Not: generated imagery (hard rule). |
| Unicorn Studio | https://www.unicorn.studio/blog | Redirects to `/login?redirect=/blog` in a headless browser: no public blog to benchmark. Logged as unavailable. | n/a |

## Section decisions

| Section | Baseline (closest) | Strongest reference | Decision | Outcome |
| --- | --- | --- | --- | --- |
| Navigation | Header: Tools, Guides, Compare, Costs | daily.dev and Mintlify put Blog in the top level | "Blog" added to the header bar, the phone drawer's reading list and the footer's Read column. Active state on `/blog/` and every post. | Done; fits at 1024 and 1280 with no overflow. |
| Index head | Guides index: H1, lead, mini stack | daily.dev | H1 with a muted second clause ("Field notes for client work. Forms, portals, AI and the web."), one lead. No media in the head; the lead story carries it. | Done. |
| Lead + latest | Guides index wide card | Customer.io, Mintlify | Lead story with a large drawn cover, meta and description; three latest beside it as rows with small covers. Stacks on phones. | Done. |
| Topic filter | Guides tool filter (underline tabs) | Mintlify tabs, Customer.io counts | Six topics as underline tabs with counts and a one-line blurb that updates (`aria-live`). Scrolls sideways on phones. Rows hide with JS; with JS off all rows stay. | Done; verified Operations filter shows 4 of 24 and back to 24. |
| Post list | none | daily.dev | Ruled rows: topic glyph tile, topic tag, date, minutes, title, one line, arrow on wide screens; hover tint and arrow nudge. | Done. |
| Covers | Guide covers use vendor screens | Mintlify, Airtable, Customer.io | `PostArt.astro`: original drawn art. Topic color field (chapter colors for intake, portals, operations; an ink field lit in the mark's three colors for AI, web, buying), a fading grid, the topic glyph on a halo, two ghost glyphs, the mark's rising stroke in the far corner. Seeded by slug so covers differ. Container-height units keep it whole at card and banner ratios. Decorative (`aria-hidden`), no text. | Done. |
| Post header | Article: back link, H1, lead, product tags, minutes | daily.dev | Same template plus the topic tag and date (posts are dated; guides stay undated), and a banner cover (21:8 on wide screens). | Done. |
| Post body | Article prose with sticky left contents | daily.dev | Kept the site's left contents with active marker; posts open with the rule-led short answer and end with a "Questions" section where useful. | Done. |
| Post end | NextSteps, Sources | daily.dev "More like this" | Sources from frontmatter `sourceIds`, then "More like this": three posts, same topic first, with covers. | Done. |
| Structured data | Article + BreadcrumbList | n/a | `Blog` with `BlogPosting` items on the index; `BlogPosting` with publisher, `mainEntityOfPage` and image per post; breadcrumb mirrors Home > Blog > post. | Done; rendered JSON-LD checked. |

## Content (24 posts, 27 Oct 2026)

Pillars follow the site's jobs plus the wider subjects the owner asked for. Every claim about a product, standard or regulation comes from a source listed at the end of the post; new sources were read on 27 Oct and added to `src/data/sources.json`. No post claims hands-on testing we did not do.

| Topic | Posts |
| --- | --- |
| Intake (4) | client intake form questions; hidden fields; update links are keys; deposits in the intake form |
| Portals (4) | what a client portal is; who counts as a user; record-level permissions; offboarding |
| Operations (4) | live vs scheduled sync; workflow runs; exit plan for no-code apps; status fields |
| AI (5) | AI app builders for portals (lead); AI form generators; AI data policy; vibe-coded app or no-code; AI actions in workflows |
| Web basics (4) | Core Web Vitals; WCAG 2.2 checklist; portal invitations in spam (SPF, DKIM, DMARC); how Wellpick is built |
| Buying software (3) | when a vendor changes hands; how review sites make money; monthly or yearly billing |

Each post links to the guide or comparison that goes deeper, so the blog feeds the existing pages instead of competing with them for the same query.
