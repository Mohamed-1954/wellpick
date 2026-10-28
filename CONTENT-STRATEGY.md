# CONTENT-STRATEGY.md — The Client Stack

Researched 26–27 September 2026. Companion to `PRODUCT.md` (voice, honesty rules) and `DESIGN.md` (visual system).

## 1. What the research found

### Readers

Small service businesses (studios, agencies, bookkeepers, consultants, contractors) and the freelance builders who set up portals for them. They ask where records live, who can see what, and what the monthly bill will be once real clients log in.

Reddit blocked this network, so reader language came from the vendors' own public forums (Discourse JSON API): community.softr.io and community.noloco.io. Those forums are the watering hole for exactly this audience. Bias: forum posters skew toward builders and people with problems.

| Theme                                                                                                                                  | Evidence (thread, date)                                                                                                                                                    | Confidence                             |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Nobody understands who counts as a paid user.** Team vs client, email-domain rules, "what is an app user".                           | Softr 16820 (Aug 2026), 11527 (Dec 2024), 10834 (Oct 2024); Noloco 2329 (Jan–Mar 2026: users on another domain still billed as team)                                       | High: 4+ threads, 2 vendors, recurring |
| **Price and limit changes break budgets built on old numbers.**                                                                        | Softr 14375 (Nov–Dec 2025: Business users 2,500→500; 500 extra users quoted at $150/mo); Noloco 1666 (synced-row caps); Softr 16820 ("recent pricing update… fewer users") | High                                   |
| **One portal for many client companies: how to separate them.**                                                                        | Softr 4722, 1533, 15970 (Mar 2026); Noloco 2450 (May 2026), 2137 (workspace per client for separate billing)                                                               | High                                   |
| **Getting intake into the right record.** Prefill the logged-in user, update rather than create, link to the company.                  | Softr 9609, 2614, 10052, 11790, 11819                                                                                                                                      | High                                   |
| **Sync lag and stale data.** Softr showed old Airtable formula/lookup values; Noloco lookup-of-lookup not populating; import slowness. | Softr 14607 (Dec 2025, 72 posts), 14705; Noloco 1392, 2337                                                                                                                 | Medium: real, but partly fixed since   |
| **Sign-up hygiene.** No email verification lets junk users fill paid user caps.                                                        | Softr 3931 (2023)                                                                                                                                                          | Low: old, single thread                |

### What currently ranks, and why it is weak

- **Vendor-authored comparisons dominate.** For "softr vs noloco" the results include noloco.io/noloco-vs-softr, softr.io/softr-vs-noloco, noloco.io/blog/softr-vs-stacker-vs-noloco, and softr.io/blog/noloco-pricing. Each vendor argues its own case.
- **Zite (Fillout's parent) is a publisher and a competitor too.** zite.com sells an app, portal and website builder ("No per user fees, ever") and ranks for "softr pricing". Readers comparing Fillout with Softr should know this.
- **Affiliate and AI-generated pages repeat retired numbers.** Examples: "20 / 100 / 500 app users" for Softr (retired; today it is 5+5 / 10+50 / 30+100), and "Tally Pro $29" without the billing basis. Multi-product listicles (zigpoll, appaca, taskip) rank without testing anything.
- **Nobody works the numbers for the reader's own team.** No ranking page answers "with 3 staff and 12 client contacts, which plan do I need and what does it cost on each product?"
- **Nobody separates visibility from permission** across the tools, or explains that staff on Gmail count as _client_ users in Softr.
- **Airtable Portals is barely covered from the buyer's side**, even though it is the "buy nothing new" option for Airtable users. Airtable's own docs show two surprises: read-only portal users are not billed, and a base can have only one portal.

### Our original contribution (what we can do that the results cannot)

1. Independence from all three vendors and from Zite. We name vendor conflicts and quote both sources.
2. Dated, sourced numbers with a recheck date, plus the conflicts between a vendor's pricing page and its docs.
3. Arithmetic done for the reader: crossovers (for example, the 6th client login moves Softr Basic to Pro), and a plan calculator.
4. Synthesis of real forum problems into checks and design rules. We cite the threads; we do not claim hands-on testing.
5. Test plans and templates (permission log CSV, cost worksheet, intake brief).

We do **not** have hands-on testing, screenshots of our own builds, customer data or traffic data. Pages must not imply otherwise. Keyword volumes were not available (no Ahrefs, Semrush or DataForSEO access). Search demand is judged qualitatively from SERP composition and forum frequency.

## 2. Content audit (before → decision)

| Page                                                                                                               | Words         | Decision                                                          | Reason                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/softr/`, `/noloco/`, `/fillout/` (hubs)                                                                          | data          | **Keep, improve**                                                 | They serve the product intent. Improvements: add who counts as a user (Softr, Noloco) and the Zite note (Fillout).                                                                            |
| `/{p}/pricing/`                                                                                                    | data          | **Keep, improve**                                                 | "X pricing" intent. Add how users are counted, with the forum-proven gotchas.                                                                                                                 |
| `/start/`                                                                                                          | 700           | **Keep, small fix**                                               | Decision entry point. Add the honest pointer that all-in-one client apps are a different category.                                                                                            |
| `/guides/portal-costs/`                                                                                            | 2,007         | **Keep, upgrade**                                                 | Whole-stack cost intent. Add an interactive plan calculator built on the same dated data; the no-JS fallback is the existing tables.                                                          |
| `/guides/portal-data-model/`                                                                                       | 1,202         | **Keep, absorb onboarding**                                       | Absorbs the five-state intake lifecycle from client-onboarding. Adds "one portal for all clients or one per client" (forum demand).                                                           |
| `/guides/client-onboarding/`                                                                                       | 801           | **Merge → data model, 301**                                       | Overlaps with the data model (status, intake review) and the Fillout guide (duplicates). Too thin to stand alone. "Client onboarding" as a generic query belongs to all-in-one CRMs, not us.  |
| `/guides/portal-permissions/` + `/guides/client-portal-launch/`                                                    | 1,187 + 831   | **Merge → `/guides/client-portal-launch/`, 301 from permissions** | Launch repeated the permission test by reference and added limits and rollback. One launch checklist with the two-client test at its core is stronger. The URL matches the more common query. |
| `/compare/softr-vs-noloco/` + `/compare/noloco-vs-softr-plus-fillout/`                                             | 1,278 + 2,444 | **Merge → `/compare/softr-vs-noloco/`, 301**                      | Cannibalization: both answer "Softr or Noloco?" with prices and picks. The merged page leads with the crossover math and keeps the permission, sync and exit details.                         |
| `/compare/softr-forms-vs-fillout/`                                                                                 | 1,087         | **Keep, rewrite weak rows**                                       | Distinct intent. Two table cells said "evaluate / verify" instead of giving facts.                                                                                                            |
| `/guides/build-softr-client-portal/`, `/guides/build-noloco-client-portal/`, `/guides/fillout-intake-to-airtable/` | 1.3–3k        | **Keep, relink**                                                  | Implementation intent; recently refreshed.                                                                                                                                                    |
| about, methodology, disclosure, privacy                                                                            | —             | **Keep**                                                          | Trust pages.                                                                                                                                                                                  |

Net: 11 articles → 11 (two merges out, two new pages in), each with a distinct intent.

## 3. New pages that pass the four tests

| Page                                                                          | Reader problem                                               | Why us                                                                                            | Angle                                                                                                                                                                                                                   | Original value                                                                                                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/compare/airtable-portals-vs-softr/`, _Airtable Portals vs Softr and Noloco_ | "My data is in Airtable. Do I need a portal builder at all?" | Most readers of this site are on Airtable. Vendors will not recommend the "no extra tool" option. | Airtable Portals is the incumbent. Price it and name its constraints: one portal per base, clients need an Airtable account, current-user filters need a user field, 3-level nesting limit, @mentions silently dropped. | Cost table at 5 / 15 / 50 client contacts on each route. Read-only-is-free insight. Bending Spoons ownership noted as a pricing risk, not a prediction. |
| `/compare/fillout-vs-tally/`, _Fillout vs Tally for client intake_            | "Tally is free. Why pay for Fillout?"                        | Fillout is one of our three products. Tally is the main alternative readers weigh.                | Judge only the intake-to-records job: update links, linked records, login, file sizes, payments.                                                                                                                        | Documented capability table on the portal-relevant rows. A clear "Tally is enough when…" verdict that can go against the product we cover.              |

## 4. Pages we will **not** create

- **"Best client portal software" listicle.** We cannot test 10–24 tools. The results are saturated with vendor lists, and the page would be generic.
- **Standalone "Softr review", "Noloco review" or "Fillout review".** No hands-on testing, so a "review" title would overclaim. The hubs serve the intent honestly as guides.
- **Per-product "alternatives" pages.** The real alternatives readers weigh (Noloco ↔ Softr, Airtable Portals, Tally) are covered by comparisons. A broad alternatives page would mean covering tools we have not researched.
- **Typeform vs Fillout, Jotform vs Fillout.** Survey-style buying criteria, not intake-to-records. Low fit.
- **SuiteDash / Assembly (ex-Copilot) comparisons.** A different category (all-in-one client management). One honest pointer on `/start/` instead.
- **Pricing-history page.** Useful, but dates we cannot verify would be guesses. Price changes are handled on the pricing pages ("numbers you may see elsewhere").
- **Glossary pages.** No reader demand in the research; definitions live inside the pages that need them.

## 5. Pillars, clusters, intent

```
Pillar A — Choose the stack (consideration / decision)
  /start/  ·  /guides/portal-costs/ (+ calculator)
  /softr/ /noloco/ /fillout/  +  /{p}/pricing/
  /compare/softr-vs-noloco/  ·  /compare/airtable-portals-vs-softr/
  /compare/softr-forms-vs-fillout/  ·  /compare/fillout-vs-tally/
Pillar B — Build it (implementation)
  /guides/portal-data-model/ (records, lifecycle, multi-client)
  /guides/build-softr-client-portal/  ·  /guides/build-noloco-client-portal/
  /guides/fillout-intake-to-airtable/
Pillar C — Launch safely (implementation → retention)
  /guides/client-portal-launch/ (two-client test, limits, rollback)
```

| URL                                            | Primary intent                   | Stage    |
| ---------------------------------------------- | -------------------------------- | -------- |
| /start/                                        | which stack do I need            | decide   |
| /guides/portal-costs/                          | client portal cost, which plan   | decide   |
| /{p}/                                          | what is X good for               | consider |
| /{p}/pricing/                                  | X pricing explained              | decide   |
| /compare/softr-vs-noloco/                      | softr vs noloco                  | consider |
| /compare/airtable-portals-vs-softr/            | airtable portal vs softr         | consider |
| /compare/softr-forms-vs-fillout/               | do I need Fillout with Softr     | consider |
| /compare/fillout-vs-tally/                     | fillout vs tally                 | consider |
| /guides/portal-data-model/                     | client portal database structure | build    |
| /guides/build-\*/ , fillout-intake-to-airtable | how to build X                   | build    |
| /guides/client-portal-launch/                  | client portal launch checklist   | launch   |

## 6. Architecture

- The header navigation is unchanged. It already carries the three hubs plus Guides, Compare and Costs.
- **Redirects (301):**
  - `/guides/client-onboarding/` → `/guides/portal-data-model/`
  - `/guides/portal-permissions/` → `/guides/client-portal-launch/`
  - `/compare/noloco-vs-softr-plus-fillout/` → `/compare/softr-vs-noloco/`
- **Breadcrumbs:** unchanged (Home › Guides|Compare › page).
- **Internal links (minimum):**
  - Every comparison links to `/guides/portal-costs/` and the hubs of the products it covers.
  - Every build guide links to the data model (before) and the launch checklist (after).
  - Each hub links to its pricing page, its build guide and its comparisons.
  - The launch checklist links back to costs, for plan gates.
  - No page is orphaned: the guides index, compare index, hubs and footer cover all of them.
- **Cannibalization rules:**
  - Only `/compare/softr-vs-noloco/` targets "Softr vs Noloco".
  - Only `/guides/portal-costs/` targets whole-stack cost.
  - `/{p}/pricing/` targets one product's plans and links to the costs page for combinations.

## 7. Briefs

### B1 `/compare/airtable-portals-vs-softr/` (new)

- **Reader:** an agency or studio running projects in Airtable, 3–10 staff, 5–60 client contacts.
- **Intent / question:** can Airtable's own Portals replace Softr or Noloco, and what does each cost for my client count?
- **Existing pages fail because:** vendor posts skip the free read-only seats and the one-portal-per-base limit. Third-party posts quote a flat $8 per guest.
- **Evidence:**
  - Airtable Portals doc, Interface Designer permissions doc, Airtable pricing FAQ.
  - Softr and Noloco pricing claims.
  - Bending Spoons press releases (4 Aug and 4 Sep 2026).
- **Must answer:**
  - who pays for a seat
  - how record scoping works
  - what clients must do to log in
  - limits
  - cost at 5, 15 and 50 clients
  - when each route wins
- **Structure:**
  1. Answer.
  2. How each route decides who sees a record.
  3. Billing rules.
  4. Cost table.
  5. Constraints that decide it.
  6. Picks.
- **Conversion:** a hub click to Softr or Noloco when Airtable Portals does not fit. Explicitly fine to end at "stay in Airtable".

### B2 `/compare/fillout-vs-tally/` (new)

- **Reader:** someone collecting client briefs into Airtable, considering free Tally.
- **Question:** is Fillout worth paying for when Tally is free?
- **Evidence:** Tally pricing, plans, Airtable integration, hidden-field and payment docs; Fillout sources already in sources.json.
- **Must answer:**
  - Can each update an existing record?
  - Can each write linked records?
  - Respondent login?
  - File size?
  - Payments?
  - Prefill?
  - Cost?
- **Structure:**
  1. Answer.
  2. The intake jobs table.
  3. Where Tally is enough.
  4. Where Fillout earns its fee.
  5. Costs.
  6. Picks.
- **Conversion:** a Fillout hub click only when a documented need exists.

### B3 `/compare/softr-vs-noloco/` (merge)

Lead with the crossover: Basic's 5-client cap. Then:

1. The permission-model table.
2. Where data lives and sync.
3. Intake: does either need Fillout?
4. Costs.
5. Five situations.
6. Exit.
7. Decision.

Add the Zite disclosure line, and name Airtable Portals as the third route with a link.

### B4 `/guides/client-portal-launch/` (merge)

Structure:

1. The fixture.
2. Product rules.
3. The checks table.
4. Evidence log.
5. Limits that bite at launch.
6. Ownership and rollback.
7. The invitation.
8. Launch to one client.

### B5 `/guides/portal-data-model/` (absorb)

Add the lifecycle states (from onboarding), with failure handling, and a new section: "One portal for every client, or one per client?"

- **Softr:** one app, company-linked restrictions. The logged-in user's linked fields become available once users are synced (forum 15970).
- **Noloco:** a workspace per client when billing must be separate (staff answer, forum 2137); an "active project" user field for staff who switch between clients (forum 2450).

### B6 `/guides/portal-costs/` (calculator)

- **Inputs:**
  - staff who log in (and how many use Gmail-type addresses)
  - client contacts
  - builders
  - records
  - form responses a month
  - needs: roles above 2, field permissions, create/edit restrictions, payment or update links
- **Output:** the first plan that fits on each product, the extras cost, and the total on both billing bases, with the rule that forced each step.
- **Data source:** `claims.json`.
- **No-JS fallback:** the existing tables.

### B7 Pricing pages and hubs

- Add "who counts as a user" rows. Include the forum-proven traps:
  - Gmail staff count as client users in Softr.
  - Noloco counts a same-domain user or a full-data-access role as team.
  - Users over a Softr cap are created deactivated.
- Fillout hub: disclose that Zite sells a competing portal builder.

## 8. Implementation status (27 September 2026)

- **Done:**
  - Merges and 301s (`astro.config.mjs` `redirects`).
  - B1–B7.
  - Methodology section on forum evidence and non-affiliate tools.
  - Article + BreadcrumbList JSON-LD.
  - Comparisons ordered by `order`.
- **Plan finder:**
  - Logic in `src/lib/stackPlan.ts`, UI in `components/PlanCalculator.astro`.
  - Reads the structured limits added to `claims.json` (`softr-pricing`, `noloco-pricing`, `fillout-pricing`).
  - Re-verify those fields at every price recheck.
- **Kept long on purpose:** hub `<title>`s (75–83 characters) and three older descriptions (build-noloco, fillout-intake, disclosure). They predate this pass; shorten them when those pages are next edited.
- **Not done (needs the owner):**
  - keyword volumes (no Ahrefs, Semrush or DataForSEO access);
  - AI-answer visibility baseline (needs a live, indexed site);
  - first-hand screenshots and testing.
