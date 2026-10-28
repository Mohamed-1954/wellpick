// Editorial data for the three product hubs and their pricing pages.
// Facts carry a source id from src/data/sources.json; prices live only in
// src/data/claims.json and are read through lib/pricing.ts.
import type { ProductId } from '../lib/site';

export interface ShotRef {
  name: string;
  alt: string;
}
/** A screen in the hub showcase: a tab title and one line on what to look at. */
export interface ShowcaseShot extends ShotRef {
  title: string;
  note: string;
  /** Portrait phone screens sit centered at full height */
  portrait?: boolean;
}
export interface Fact {
  text: string;
  source: string;
}
export interface PlanPick {
  who: string;
  watch?: string;
  start?: boolean;
}
/** One text node on a fit diagram: a title and an optional detail line */
export interface FitItem {
  title: string;
  detail?: string;
  /** Named third-party sources' marks (components/SourceMark.astro) */
  marks?: ('airtable' | 'googlesheets' | 'stripe')[];
  /** Otherwise a motif glyph for what the node is (components/Glyph.astro) */
  glyph?: 'intake' | 'portal' | 'team' | 'records' | 'gate' | 'client';
  /** Chapter color of the glyph, when the node is one of the three products */
  product?: ProductId;
}
/** One stop along a fit diagram's connector, in reading order */
export interface FitStop {
  /** node: text on the canvas; focal: solid chapter block; gate: access boundary */
  kind?: 'node' | 'focal' | 'gate';
  /** Handoff label set on the connector segment that leads into this stop */
  via?: string;
  /** Zone label above a node group or boundary */
  zone?: string;
  /** Parallel items in a node group; a focal block or boundary uses the first */
  items: FitItem[];
  /** Chapter color of a focal block (defaults to the diagram's product) */
  product?: ProductId;
  /** A quieter closing line under a node group */
  note?: string;
  /** A focal block's product crop: a file in /img/vendor/ (decorative, top-left) */
  shot?: string;
  /** A real vendor screen of this stop (a node or the boundary), shown as a
      small plane under its text: a file in /img/vendor/ with its alt text */
  ui?: { name: string; alt: string; position?: string };
}
export interface Hub {
  title: string;
  description: string;
  headline: string;
  lead: string;
  guide: { href: string; label: string };
  heroShot: ShotRef;
  /** Gallery intro: whose screens these are and what to look for */
  galleryLead: string;
  shots: ShowcaseShot[];
  /** "How it fits your workflow": the one-line description and the diagram stops */
  fit: { description: string; stops: FitStop[] };
  video: { id: string; title: string; note: string; channelNote?: string };
  facts: Fact[];
  specs: { key: string; label: string }[];
  picks: Record<string, PlanPick>;
  planNote: string;
  billFacts: Fact[];
  verdict: { choose: string[]; elsewhere: string[] };
  next: { to: string; title: string; product?: ProductId }[];
  sources: string[];
}

export const HUBS: Record<ProductId, Hub> = {
  fillout: {

    title: 'Fillout: intake forms into your records',
    description:
      'Fillout for small service businesses: conditional intake, Airtable create and update, login forms, file limits, payments and plans.',
    headline: 'Collect a brief you can actually work from.',
    lead: 'Conditional forms that create or update Airtable records directly, with uploads, payments and login pages. Best when incomplete briefs are the real problem.',
    guide: { href: '/guides/fillout-intake-to-airtable/', label: 'Build the intake form, step by step' },
    heroShot: {
      name: 'fillout-designer.png',
      alt: 'Fillout form builder: a branded intake form beside a form designer panel with theme colors',
    },
    galleryLead: 'Screens from Fillout’s product pages. Check where each answer lands before you publish.',
    shots: [
      { name: 'fillout-airtable-sync.png', title: 'Answers become a row', note: 'Each question maps to a field in your base. That mapping decides how much cleanup your team does later.', alt: 'A Fillout lead form mapped to an Airtable deals table, with the new row highlighted' },
      { name: 'fillout-workflow.png', title: 'A submission runs its steps', note: 'Branches and actions fire after submit. Decide who reviews a brief before any automation acts on it.', alt: 'Fillout submission workflow: a trigger, an AI qualification step, a branch, then Slack and email actions' },
      { name: 'fillout-intake-mobile.png', title: 'The brief on a phone', note: 'Fillout’s public client-intake template, opened at phone width: the form most clients will actually fill in.', alt: 'Fillout client intake template on a phone: personal information with email, phone, date and address fields', portrait: true },
    ],
    fit: {
      description: 'A Fillout form applies conditional logic, creates or updates an Airtable record, and can be embedded inside a Softr portal.',
      stops: [
        {
          zone: 'Client',
          items: [{ title: 'Opens the form', detail: 'A prefilled email in the URL is context, not verified identity.', glyph: 'client' }],
          ui: { name: 'fillout-login-card.png', alt: 'A Fillout form behind a "Sign in to access" page' },
        },
        { kind: 'focal', via: 'answers', shot: 'fillout-designer.png', items: [{ title: 'Fillout form', detail: 'Conditional logic shows or hides fields' }] },
        {
          zone: 'Where answers land',
          via: 'mapped fields',
          items: [{ title: 'Airtable record', detail: 'Create or update, with mapped fields', marks: ['airtable'] }],
          ui: { name: 'fillout-airtable-sync.png', alt: "A Fillout form's answers arriving as a new row in an Airtable table", position: '100% 50%' },
        },
        { via: 'embedded form', items: [{ title: 'Softr portal', detail: 'Custom code block on a paid Softr plan', glyph: 'portal', product: 'softr' }] },
      ],
    },
    video: {
      id: 'ZhdKHlztgsk',
      title: 'Getting Started with Fillout Forms',
      note: 'The official getting-started tutorial. Watch how a question maps to a field in a connected base. That mapping is the part to test hardest with your own data.',
      channelNote: 'Fillout’s channel, now branded Zite',
    },
    facts: [
      { text: 'Fields can show or hide based on previous answers, URL parameters, integration data or dates, on every plan.', source: 'filloutLogic' },
      { text: 'A form connects to one Airtable base and table at a time. A separate multi-table feature exists for more.', source: 'filloutAirtable' },
      { text: 'An update link is a key to the whole record: anyone who opens it can see every field unless “Restrict prefilled data” is on. A link without an id creates a new record.', source: 'filloutUpdate' },
      { text: 'Login pages (email code, password or SSO) start on Starter. A prefilled email in the URL is context, not verified identity.', source: 'filloutLogin' },
      { text: 'Stripe payment pages work on every plan with no Fillout fee. Stripe’s own fees apply, and VAT is not added automatically.', source: 'filloutPayments' },
      { text: 'Embedding in Softr needs a paid Softr plan and a Custom code block; several field types need at least 600 px of height.', source: 'filloutEmbed' },
    ],
    specs: [
      { key: 'responses', label: 'Responses a month' },
      { key: 'fileSize', label: 'Max file size' },
    ],
    picks: {
      Free: { who: 'Try it on real intake. 1,000 responses a month is enough for most small studios.' },
      Starter: { who: 'Most service businesses start here: login forms and 2,000 responses.', start: true },
      Pro: { who: 'Heavier volume, or several teams sending forms.' },
      Business: { who: 'Unlimited responses, duplicate prevention and partial submissions.', watch: 'Files stay at 20 MB each until this plan.' },
    },
    planNote: 'A Team bundle ($250 a month billed yearly) and custom Enterprise plans also exist. Fillout does not charge per seat. Its parent company, Zite, also sells its own app and portal builder.',
    billFacts: [
      { text: 'Over the response limit, forms keep collecting. You can upgrade, buy bulk submissions or wait for next month.', source: 'filloutPricing' },
      { text: 'File uploads: 20 MB per file on Free, Starter and Pro; 1 GB on Business and Team; 5 GB on Enterprise.', source: 'filloutFiles' },
      { text: 'Duplicate prevention for Airtable is Business only and checks email or single-line fields.', source: 'filloutDuplicates' },
      { text: 'Pre-fetching record data is Business and Enterprise, but update forms that prefill work on Free.', source: 'filloutPrefetch' },
    ],
    verdict: {
      choose: [
        'Incomplete briefs are the bottleneck and the questions change by service type.',
        'Intake should land straight in Airtable, including updates to a known record instead of duplicates.',
        'You need something a portal’s own forms lack: page branching, payments, update links or login forms.',
      ],
      elsewhere: [
        'Softr’s free standalone forms already cover the requirement.',
        'Nobody owns reviewing submissions yet. A form is not a process.',
        'An update link would expose internal fields and you cannot separate them yet.',
      ],
    },
    next: [
      { to: '/guides/fillout-intake-to-airtable/', title: 'Send a Fillout form into Airtable', product: 'fillout' },
      { to: '/compare/softr-forms-vs-fillout/', title: 'Softr Forms or Fillout for intake?', product: 'softr' },
      { to: '/compare/fillout-vs-tally/', title: 'Fillout or free Tally for intake?', product: 'fillout' },
    ],
    sources: ['filloutPricing', 'filloutLogic', 'filloutAirtable', 'filloutUpdate', 'filloutLogin', 'filloutPayments', 'filloutFiles', 'filloutDuplicates', 'filloutPrefetch', 'filloutEmbed', 'zite', 'ziteHome'],
  },
  softr: {

    title: 'Softr: client portals on your records',
    description:
      'Softr for small service businesses: data sources, portal pages, forms, user groups, permissions and plan limits.',
    headline: 'Give clients a page with their work on it.',
    lead: 'Connect Airtable, Google Sheets or Softr’s own database, then give each client a page with only their records. Best when project data already lives in a table.',
    guide: { href: '/guides/build-softr-client-portal/', label: 'Follow the eight-step build' },
    heroShot: {
      name: 'softr-portal.webp',
      alt: 'A published Softr client portal: project cards with status labels and a table of recent invoices',
    },
    galleryLead: 'Screens from Softr’s demos. The pages and access rules are yours to set.',
    shots: [
      { name: 'softr-dashboard.webp', title: 'Status at a glance', note: 'Metric tiles and charts read the same records your team updates, so nobody re-types a report.', alt: 'Softr dashboard with metric tiles and charts' },
      { name: 'softr-crm.webp', title: 'One record per detail page', note: 'A detail page shows one record: the unit your permission rules must scope to the right client.', alt: 'A Softr CRM record detail page with linked information' },
      { name: 'softr-portal-mobile.webp', title: 'The portal on a phone', note: 'Softr’s own mobile view of a client portal: a task list with status labels and a tab bar.', alt: "Softr's published client portal on a phone: an All tasks list with status labels and a bottom tab bar", portrait: true },
    ],
    fit: {
      description: 'A data source feeds list and detail pages. User groups with global data restrictions decide which records a signed-in client can reach.',
      stops: [
        {
          zone: 'Data source',
          items: [
            { title: 'Airtable', marks: ['airtable'] },
            { title: 'Google Sheets', marks: ['googlesheets'] },
            { title: 'Softr Databases', glyph: 'records', product: 'softr' },
          ],
        },
        { kind: 'focal', via: 'records', shot: 'softr-portal.webp', items: [{ title: 'Softr pages', detail: 'List and detail blocks read live records' }] },
        {
          kind: 'gate',
          via: 'requests',
          zone: 'Access boundary',
          items: [{ title: 'User groups + global data restrictions', detail: 'Rules per table and group, for view, create, edit and delete', glyph: 'gate' }],
        },
        {
          zone: 'Client',
          via: 'allowed records',
          items: [{ title: 'Signed-in client view', detail: 'Sees only the records the rules allow', glyph: 'client' }],
          ui: { name: 'softr-uc-projects.webp', alt: 'A Softr portal page listing projects in progress and in review' },
        },
      ],
    },
    video: {
      id: '9QHOcQMY2RA',
      title: 'How to Setup Users in Softr: Database, Syncing & Permissions',
      note: 'Softr’s own walkthrough of users, syncing and permissions. Those three decisions are the real work behind a portal, more than the page layout.',
    },
    facts: [
      { text: 'Softr’s client portal tutorial uses Clients, Projects, Tasks and Invoices, with Stripe invoice payment. That is template behavior, not default permissions.', source: 'softrSetup' },
      { text: 'Softr recommends its own database for a fresh build and supports keeping an external source when other tools depend on it.', source: 'softrData' },
      { text: 'Standalone Softr Forms allow unlimited forms and submissions, even on Free.', source: 'softrForms' },
      { text: 'The in-app conditional form tier is unclear: the pricing page lists conditional form logic on Basic, while the forms docs say Professional and higher. Confirm before you rely on it.', source: 'softrPricing' },
      { text: 'View restrictions work on every plan. Create, edit and delete restrictions need Business. Conflicting group rules resolve to “Can’t”.', source: 'softrRestrictions' },
      { text: 'Team users share a builder’s business email domain. Anyone on Gmail or another free domain counts as a client user.', source: 'softrPricing' },
    ],
    specs: [
      { key: 'users', label: 'App users' },
      { key: 'builders', label: 'Builders' },
      { key: 'records', label: 'Records' },
    ],
    picks: {
      Free: { who: 'Prototype the portal with fictional data.', watch: '5 app users in total, team and client combined.' },
      Basic: { who: 'A first real portal for up to five clients.', watch: 'No extra users. The sixth client means Pro.', start: true },
      Pro: { who: 'A growing client list, up to 50 clients before add-ons.' },
      Business: { who: 'When clients create or edit records and you need write restrictions.', watch: 'Create, edit and delete restrictions start here.' },
    },
    planNote: 'Enterprise is custom. Pro and Business can add users; Basic cannot. A 7-day trial gives Business features.',
    billFacts: [
      { text: 'Pro adds team users at $3 and client users at $1 each; Business at $5 and $2. Basic has no add-ons.', source: 'softrPlansDocs' },
      { text: 'Extra builders cost $5, $10 or $20 a month on Basic, Pro and Business (billed yearly).', source: 'softrPlansDocs' },
      { text: 'Staff on Gmail, Outlook or other free addresses count as client users, not team. Only a builder’s business domain makes someone team.', source: 'softrPlansDocs' },
      { text: 'Extra users are billed monthly, even when the plan is paid yearly. Softr counts users once a day and emails the owner, then waits 7 days before charging; a lower count is not refunded mid-cycle.', source: 'softrPlansDocs' },
      { text: 'Past a plan’s maximum, new users are created but stay deactivated, so an invited client cannot sign in.', source: 'softrPlansDocs' },
      { text: 'Deactivated users do not count toward the limit; their record is kept.', source: 'softrUserSync' },
      { text: 'Non-profits and education get 50% off.', source: 'softrPricing' },
    ],
    verdict: {
      choose: [
        'Your work already lives in structured records and each client needs a clear subset of them.',
        'Someone can own the app: statuses, access problems and outdated content.',
        'You want list and detail pages, forms and user groups without building a web app.',
      ],
      elsewhere: [
        'Clients need to create or edit records and Business is outside the budget.',
        'Your team also needs a CRM and task board on the same records. Look at Noloco.',
        'The only real problem is a missing brief. Fix intake first.',
      ],
    },
    next: [
      { to: '/guides/build-softr-client-portal/', title: 'Build the smallest useful Softr portal', product: 'softr' },
      { to: '/compare/softr-vs-noloco/', title: 'Softr or Noloco for the same job?', product: 'noloco' },
      { to: '/guides/client-portal-launch/', title: 'Run the two-client launch test', product: 'softr' },
    ],
    sources: ['softrPricing', 'softrPlansDocs', 'softrPortal', 'softrSetup', 'softrData', 'softrForms', 'softrConditionalForms', 'softrUserSync', 'softrRestrictions'],
  },
  noloco: {

    title: 'Noloco: client portal and team operations',
    description:
      'Noloco for small service businesses: client portal, CRM, shared records, roles, permissions, sync, workflows and plan limits.',
    headline: 'Run the portal and the team on the same records.',
    lead: 'Client portal, CRM, projects and tasks in one app, with record-level permissions between staff and clients. Best when your team and clients share the same data.',
    guide: { href: '/guides/build-noloco-client-portal/', label: 'Build a Noloco portal, step by step' },
    heroShot: {
      name: 'noloco-portal-canvas.png',
      alt: 'A Noloco client portal: a client-facing project table with a tasks panel',
    },
    galleryLead: 'Screens from Noloco’s product pages and templates. They all read one set of records.',
    shots: [
      { name: 'noloco-crm-canvas.png', title: 'The pipeline', note: 'Deals move across kanban columns with totals on top, in the same app your clients log into.', alt: 'Noloco deal pipeline: kanban columns of deals with pipeline totals' },
      { name: 'noloco-dash-canvas.png', title: 'The team dashboard', note: 'Budget, workload and priorities, built from the projects and tasks your clients see a slice of.', alt: 'Noloco project health dashboard with budget, workload and priorities' },
      { name: 'noloco-workflows.png', title: 'A project and its tasks', note: 'A task’s required Project field is the link that client permission rules compare.', alt: 'A Noloco project record with a Tasks tab and an Add a Task form' },
    ],
    fit: {
      description: 'Sources sync into Noloco tables. Permissions decide what data reaches the user at all.',
      stops: [
        {
          zone: 'Data sources',
          items: [
            { title: 'Live sync', detail: 'Airtable, SmartSuite, Stripe', marks: ['airtable', 'stripe'] },
            { title: 'Scheduled sync', detail: 'Google Sheets, SQL databases, Xano (depends on plan)', marks: ['googlesheets'] },
          ],
        },
        { kind: 'focal', via: 'synced records', shot: 'noloco-portal-canvas.png', items: [{ title: 'Noloco tables', detail: 'Portal and team views on the same records' }] },
        {
          kind: 'gate',
          via: 'requests',
          zone: 'Access boundary',
          items: [{ title: 'Permissions', detail: 'Record and field access, enforced on the server. Filters only shape the screen.', glyph: 'gate' }],
          ui: { name: 'noloco-permissions.png', alt: "Noloco's roles table with read, edit and create switches for each role" },
        },
        {
          zone: 'Your team and clients',
          via: 'allowed records',
          items: [
            { title: 'Team views', detail: 'CRM, projects and tasks', glyph: 'team', product: 'noloco' },
            { title: 'Client portal', detail: 'Record rule: Company equals the user’s Company', glyph: 'client' },
          ],
          ui: { name: 'noloco-frame1.png', alt: "A Noloco client portal home: the client's projects, a meeting link and bills to pay", position: '0% 30%' },
        },
      ],
    },
    video: {
      id: '6GT82uz0QrM',
      title: 'How to show your users their own records in your Noloco app',
      note: 'Noloco’s tutorial on record-level access, the control that decides whether a client sees only their own records.',
    },
    facts: [
      { text: 'Permissions are enforced on the server. Visibility rules only change the screen, and filters only organize a view. Neither protects data.', source: 'nolocoAccess' },
      { text: 'The client portal pattern is a record rule: Company equals the logged-in user’s Company. It needs a user-to-company relationship.', source: 'nolocoRecordRules' },
      { text: 'Roles add up across a user’s roles. Two record rules inside one role narrow access to records both allow.', source: 'nolocoRoles' },
      { text: 'Anyone outside your team’s email domains and roles counts as a client user. A seat is used once someone logs in.', source: 'nolocoPricingGuide' },
      { text: 'Airtable, SmartSuite and Stripe sync live. Google Sheets, SQL databases and Xano sync on a schedule.', source: 'nolocoSync' },
      { text: 'A workflow that changes records does not trigger other workflows, which prevents loops.', source: 'nolocoWorkflow' },
    ],
    specs: [
      { key: 'teamUsers', label: 'Team seats' },
      { key: 'clientUsers', label: 'Active clients' },
      { key: 'records', label: 'Records' },
      { key: 'workflowRuns', label: 'Workflow runs a month' },
    ],
    picks: {
      Free: { who: 'Model the portal on Noloco Tables with a few clients.', watch: 'Only 2 roles, no Airtable or Sheets connection, 100 workflow runs.' },
      Build: { who: 'The working plan: portal plus team operations.', watch: 'Field permissions and unlimited roles start here.', start: true },
    },
    planNote: 'Extra team seats cost $5 (yearly) or $6 (monthly). Records add in blocks of 25,000 for $25 up to 250,000. Every app starts with a 14-day Build trial, no card needed.',
    billFacts: [
      { text: 'Free is limited to Noloco Tables and CSV import. Airtable, Google Sheets, SQL and HubSpot connections start on Build.', source: 'nolocoPricing' },
      { text: 'File storage: 1 GB on Free, 20 GB on Build, then $15 a month per 10 GB.', source: 'nolocoPricing' },
      { text: 'A team seat is anyone on the workspace’s email domain, or with a team member or data admin role. A user counts once they log in.', source: 'nolocoPricingGuide' },
      { text: 'Deactivating a user releases the seat from the next billing cycle; the records stay.', source: 'nolocoPricingGuide' },
      { text: 'Non-profits get 50% off any paid plan.', source: 'nolocoPricing' },
      { text: 'Reviews that quote Noloco Pro or Business describe legacy plans. Earlier subscribers keep them; new apps choose Free, Build or Enterprise.', source: 'nolocoLegacyPlans' },
    ],
    verdict: {
      choose: [
        'The portal needs an operating system behind it: CRM, projects, tasks and invoices on shared records.',
        'Staff and clients must work on the same data, with record and field permissions between them.',
        'You have more than five clients who need logins, which pushes Softr past Basic.',
      ],
      elsewhere: [
        'You only need a public brief form. Intake alone does not justify an operating system.',
        'You need multi-page forms or payment steps. Pair it with Fillout or look at Softr plus Fillout.',
        'A simple read-only view would do. Do not build a bigger model than the work needs.',
      ],
    },
    next: [
      { to: '/guides/build-noloco-client-portal/', title: 'Build a client portal in Noloco', product: 'noloco' },
      { to: '/compare/airtable-portals-vs-softr/', title: 'Already on Airtable? Compare its Portals', product: 'noloco' },
      { to: '/compare/softr-vs-noloco/', title: 'Softr or Noloco for the same job?', product: 'softr' },
    ],
    sources: ['nolocoPricing', 'nolocoPricingGuide', 'nolocoLegacyPlans', 'nolocoAccess', 'nolocoRoles', 'nolocoRecordRules', 'nolocoSync', 'nolocoWorkflow', 'nolocoPortal', 'nolocoSetup', 'nolocoExport'],
  },
};
