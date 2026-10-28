// Every vendor image and video the site ships, with where it came from.
// Files live in public/img/vendor/ (stills; responsive variants in w/ from
// scripts/optimize-vendor.mjs) and public/media/ (video). lib/media.ts reads
// dimensions from here and throws on a file that is not listed, so nothing
// ships without a provenance entry. scripts/verify.mjs checks that every
// listed file exists and every file in those folders is listed.
//
// Licensing (checked 3 Oct 2026; quotes and URLs in
// .impeccable/live/rebenchmark-2026-10-03/vendor-media.md):
// - Softr: affiliate terms grant "use Softr IP solely to promote Softr" and
//   forbid derivative works; they apply once the site is an approved affiliate.
// - Noloco: partner terms allow "marketing materials and trademarks in
//   accordance with our guidelines"; the guidelines are not public.
// - Fillout: no express grant for marketing images; site terms forbid
//   derivative works. Weakest basis; ask Fillout before launch.
// Until then every file is shown as editorial reference in an independent
// review that links back to the vendor, and is removed on request. Entries
// marked CROP are derivatives under the Softr and Fillout wording and are the
// first to replace with own captures.

export type Vendor = 'fillout' | 'softr' | 'noloco';

export interface MediaEntry {
  w: number;
  h: number;
  vendor: Vendor;
  /** Direct file URL, or the page it was captured or cropped from */
  source: string;
  /** Marketing page the file appears on */
  page: string;
  /** How the file was obtained and what was changed */
  note: string;
  /** Date pulled (YYYY-MM-DD) */
  pulled: string;
}

const SOFTR_CDN = 'https://cdn.prod.website-files.com/6772e8855f7859bc8df95c78/';
const NOLOCO_CDN = 'https://cdn.prod.website-files.com/6777c60fe010fa2ddf45acb6/';
const FILLOUT_MEDIA = 'https://www.fillout.com/_next/static/media/';
const FILE = 'Vendor-published file, downloaded as served; resized for the site.';
const CAPTURE = 'Viewport capture of the vendor marketing page (1440 × 900), taken before v11; exact capture date not recorded.';
const CROP = 'Crop of the capture named in source (scripts/crop-vendor.mjs).';
const LEGACY = 'Pulled before v11 from the vendor marketing page; direct file URL not recorded.';

export const MEDIA: Record<string, MediaEntry> = {
  // ---------- Fillout ----------
  'fillout-home-2.png': { w: 1440, h: 900, vendor: 'fillout', source: 'https://www.fillout.com/', page: 'https://www.fillout.com/', note: CAPTURE, pulled: '2026-09' },
  'fillout-home-3.png': { w: 1440, h: 900, vendor: 'fillout', source: 'https://www.fillout.com/', page: 'https://www.fillout.com/', note: CAPTURE, pulled: '2026-09' },
  'fillout-airtable-2.png': { w: 1440, h: 900, vendor: 'fillout', source: 'https://www.fillout.com/airtable', page: 'https://www.fillout.com/airtable', note: CAPTURE, pulled: '2026-09' },
  'fillout-designer.png': { w: 760, h: 500, vendor: 'fillout', source: 'fillout-home-3.png', page: 'https://www.fillout.com/', note: CROP, pulled: '2026-09' },
  'fillout-form.png': { w: 520, h: 285, vendor: 'fillout', source: 'fillout-home-2.png', page: 'https://www.fillout.com/', note: CROP, pulled: '2026-09' },
  'fillout-workflow.png': { w: 555, h: 295, vendor: 'fillout', source: 'fillout-home-2.png', page: 'https://www.fillout.com/', note: CROP, pulled: '2026-09' },
  'fillout-airtable-sync.png': { w: 720, h: 345, vendor: 'fillout', source: 'fillout-airtable-2.png', page: 'https://www.fillout.com/airtable', note: CROP, pulled: '2026-09' },
  'fillout-airtable-form.png': { w: 2063, h: 933, vendor: 'fillout', source: `${FILLOUT_MEDIA}airtable.184b70f2.png`, page: 'https://www.fillout.com/airtable', note: FILE, pulled: '2026-09-30' },
  'fillout-workflow-run.png': { w: 1480, h: 662, vendor: 'fillout', source: `${FILLOUT_MEDIA}workflowRun.8e69c288.png`, page: 'https://www.fillout.com/workflows', note: FILE, pulled: '2026-09-30' },
  'fillout-workflow-canvas.png': { w: 2304, h: 1408, vendor: 'fillout', source: `${FILLOUT_MEDIA}workflowsMain.b538a86b.png`, page: 'https://www.fillout.com/workflows', note: FILE, pulled: '2026-09-30' },
  'fillout-approval.png': { w: 1338, h: 1094, vendor: 'fillout', source: `${FILLOUT_MEDIA}approvalProcess2.1c76da6b.png`, page: 'https://www.fillout.com/workflows', note: FILE, pulled: '2026-09-30' },
  'fillout-builder-card.png': { w: 1080, h: 560, vendor: 'fillout', source: `${FILLOUT_MEDIA}CreateWithDragAndDrop.fcfe7848.png`, page: 'https://www.fillout.com/', note: FILE, pulled: '2026-09-30' },
  'fillout-automation-card.png': { w: 1080, h: 560, vendor: 'fillout', source: `${FILLOUT_MEDIA}AutomateWithSmartForms.34b3cce0.png`, page: 'https://www.fillout.com/', note: FILE, pulled: '2026-09-30' },
  'fillout-login-card.png': { w: 1084, h: 512, vendor: 'fillout', source: `${FILLOUT_MEDIA}SecureForms.77078269.png`, page: 'https://www.fillout.com/', note: FILE, pulled: '2026-09-30' },
  'fillout-results-card.png': { w: 1084, h: 512, vendor: 'fillout', source: `${FILLOUT_MEDIA}AnalyzeReviewAndCollaborate.a78d35de.png`, page: 'https://www.fillout.com/', note: FILE, pulled: '2026-09-30' },
  'fillout-payments.png': { w: 3456, h: 1908, vendor: 'fillout', source: `${FILLOUT_MEDIA}paymentsScreenshot.82f73e21.png`, page: 'https://www.fillout.com/payments', note: FILE, pulled: '2026-09-30' },
  'fillout-scheduling.png': { w: 1902, h: 840, vendor: 'fillout', source: `${FILLOUT_MEDIA}schedulingScreenshotImage2.4dfeecf0.png`, page: 'https://www.fillout.com/scheduling', note: FILE, pulled: '2026-09-30' },
  // Our own capture (v12): Fillout's public client-intake template form, opened at
  // https://forms.fillout.com/t/ehs3KMeDJaus (page 2) in a 390 × 844 viewport at 3×.
  // The product UI and template content are Fillout's; no vendor file was copied.
  'fillout-intake-mobile.png': { w: 1170, h: 2532, vendor: 'fillout', source: 'https://forms.fillout.com/t/ehs3KMeDJaus', page: 'https://www.fillout.com/templates/client-intake-form-2', note: 'Own screenshot of a vendor-hosted public template form (review use); not a vendor file. Re-capture from our own account when one exists.', pulled: '2026-10-03' },

  // ---------- Softr ----------
  'softr-portal.webp': { w: 2432, h: 1504, vendor: 'softr', source: `${SOFTR_CDN}6864e900cd7036a463c36c74_343b37c1fef200e723f67b448e13d427_Portal.webp`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published file, downloaded as served (byte-identical to the 30 Sep pull).', pulled: '2026-09' },
  'softr-crm.webp': { w: 2432, h: 1504, vendor: 'softr', source: `${SOFTR_CDN}67a8b75aede1a0f937c9e325_dcc167971aa04c0dd3e945d76d0f76ce_CRM.webp`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published file; same file name and size as the one served on the page on 30 Sep.', pulled: '2026-09' },
  'softr-dashboard.webp': { w: 2432, h: 1504, vendor: 'softr', source: `${SOFTR_CDN}67a8b789beee69ea0c35ae45_dda0e26afb5514d92266a2591c650022_Dashboard.webp`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published file; same file name and size as the one served on the page on 30 Sep.', pulled: '2026-09' },
  'softr-ai-builder-poster.jpg': { w: 1600, h: 711, vendor: 'softr', source: 'softr-ai-builder.mp4', page: 'https://www.softr.io/', note: 'Frame at 23.9 s of the vendor recording (see VIDEO), exported at 1600px wide as the poster.', pulled: '2026-09-30' },
  'softr-intranet.webp': { w: 2432, h: 1504, vendor: 'softr', source: `${SOFTR_CDN}67ac086a6242c505c66022fe_b045c9229ab600c5c6f10fbe74e1f35d_intranet-hero-desktop.webp`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published file; same file name and size as the one served on the page on 30 Sep.', pulled: '2026-09' },
  'softr-inventory.webp': { w: 2432, h: 1504, vendor: 'softr', source: 'https://www.softr.io/', page: 'https://www.softr.io/', note: LEGACY, pulled: '2026-09' },
  'softr-kb.webp': { w: 2432, h: 1504, vendor: 'softr', source: 'https://www.softr.io/', page: 'https://www.softr.io/', note: LEGACY, pulled: '2026-09' },
  'softr-form.webp': { w: 2432, h: 1504, vendor: 'softr', source: `${SOFTR_CDN}67a005d1741ee16bbd1322dd_6494b3fbcabf44dddea03d4a2f6e0945_Form.webp`, page: 'https://www.softr.io/use-cases/client-portal', note: FILE, pulled: '2026-09-30' },
  'softr-uc-onboarding.webp': { w: 1272, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa784ba5b1a4e0ebf9e2aa_1%20-%20Vendor%20Onboarding.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-account.webp': { w: 1273, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa784bb9154f8b33e05e5a_2%20-%20Account%20Management.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-communication.webp': { w: 1272, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67cff487fab7a01219dc2f81_Client%20Communication.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-documents.webp': { w: 1272, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa784c9424a4788e524bff_4%20-%20Document%20Management-1.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-projects.webp': { w: 1272, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa7c66bb8021e46577a14d_5%20-%20Project%20Management.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-billing.webp': { w: 1273, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa784b2d13af7c28895056_6%20-%20Billing%20%26%20Payments.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-reporting.webp': { w: 1272, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa7f70399b616cd8c2985e_6%20-%20Reporting%20and%20Dashboards.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-uc-support.webp': { w: 1272, h: 1272, vendor: 'softr', source: `${SOFTR_CDN}67aa784bdb8385549115a2f4_8%20-%20Support%20%26%20Resources.avif`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published AVIF, converted to WebP.', pulled: '2026-09-30' },
  'softr-portal-mobile.webp': { w: 608, h: 1248, vendor: 'softr', source: `${SOFTR_CDN}6864e1d4bfd99b2301f5227f_Client%20Portal%E2%80%94Mobile.webp`, page: 'https://www.softr.io/use-cases/client-portal', note: 'Vendor-published file, downloaded as served. Basis: Softr affiliate terms ("use Softr IP solely to promote Softr", no derivative works), which apply once the site is an approved affiliate; shown unmodified.', pulled: '2026-10-03' },

  // ---------- Noloco ----------
  'noloco-crm-canvas.png': { w: 2880, h: 1680, vendor: 'noloco', source: `${NOLOCO_CDN}6a69c67f1540bdc22abebb0f_crm%20deal%20pipeline%20canvas.png`, page: 'https://noloco.io/', note: 'Vendor-published file; same size as the one served on the page on 30 Sep.', pulled: '2026-09' },
  'noloco-dash-canvas.png': { w: 2880, h: 1680, vendor: 'noloco', source: `${NOLOCO_CDN}6a69cbbf379fac74899a30f4_dashboard%20canvas.png`, page: 'https://noloco.io/', note: 'Vendor-published file; same size as the one served on the page on 30 Sep.', pulled: '2026-09' },
  'noloco-portal-canvas.png': { w: 2880, h: 1680, vendor: 'noloco', source: `${NOLOCO_CDN}6a68d0cead452cc1600accf2_client%20portal%20canvas%20(1).png`, page: 'https://noloco.io/', note: 'Vendor-published file; same size as the one served on the page on 30 Sep.', pulled: '2026-09' },
  'noloco-frame1.png': { w: 1632, h: 1205, vendor: 'noloco', source: `${NOLOCO_CDN}69bc397eb6992f3908980b5e_Frame%202087326336%20(1).png`, page: 'https://noloco.io/', note: 'Vendor-published file (byte-identical to the 30 Sep pull).', pulled: '2026-09' },
  'noloco-dashboard.png': { w: 1600, h: 1181, vendor: 'noloco', source: 'https://noloco.io/', page: 'https://noloco.io/', note: LEGACY, pulled: '2026-09' },
  'noloco-workflows.png': { w: 1600, h: 1181, vendor: 'noloco', source: 'https://noloco.io/', page: 'https://noloco.io/', note: LEGACY, pulled: '2026-09' },
  'noloco-overview.png': { w: 1632, h: 1205, vendor: 'noloco', source: `${NOLOCO_CDN}69cbe0fbbffc7bae5ae0a30e_Noloco%20Overview%20Dashboard.png`, page: 'https://noloco.io/', note: FILE, pulled: '2026-09-30' },
  'noloco-project-canvas.png': { w: 2880, h: 1680, vendor: 'noloco', source: `${NOLOCO_CDN}6a68ccd5b18e66c8948a793e_7bddfcfbca62dd6ef09dfd7996685797_project%20tracker%20Canvas.png`, page: 'https://noloco.io/', note: FILE, pulled: '2026-09-30' },
  'noloco-hr-canvas.png': { w: 2880, h: 1680, vendor: 'noloco', source: `${NOLOCO_CDN}6a69d435e0896e4f7b801057_HR%20canvas.png`, page: 'https://noloco.io/', note: FILE, pulled: '2026-09-30' },
  'noloco-permissions.png': { w: 1604, h: 1106, vendor: 'noloco', source: `${NOLOCO_CDN}697081a5a04fa788bdfca198_Permisisons.svg`, page: 'https://noloco.io/', note: 'Vendor-published SVG, rendered to PNG at 2×.', pulled: '2026-09-30' },
  'noloco-invite.png': { w: 583, h: 430, vendor: 'noloco', source: `${NOLOCO_CDN}6a1800edd3521b59036e5fc9_invite.png`, page: 'https://noloco.io/', note: FILE, pulled: '2026-09-30' },
  'noloco-rbac-dark.png': { w: 525, h: 406, vendor: 'noloco', source: `${NOLOCO_CDN}6862235fb77e9bc415ff198a_1.%20SSO%20%26%20Role-Based%20Access%20Control%20(DARK).png`, page: 'https://noloco.io/', note: FILE, pulled: '2026-09-30' },
  'noloco-sources.png': { w: 1569, h: 1221, vendor: 'noloco', source: `${NOLOCO_CDN}69c3f9997a40cc343cb5d73f_Frame%202087326348.png`, page: 'https://noloco.io/', note: FILE, pulled: '2026-09-30' },
  'noloco-limit-access.png': { w: 1050, h: 812, vendor: 'noloco', source: `${NOLOCO_CDN}6810996dc82bb106b1a60490_Client%20Portal%203.png`, page: 'https://noloco.io/solutions/client-portal', note: FILE, pulled: '2026-09-30' },
};

/** Videos in public/media/ (poster is a still in public/img/vendor/). */
export const VIDEO: Record<string, MediaEntry & { poster: string; seconds: number }> = {
  'softr-ai-builder.mp4': {
    w: 2560,
    h: 1138,
    seconds: 24,
    poster: 'softr-ai-builder-poster.jpg',
    vendor: 'softr',
    source: 'https://assets.softr-files.com/website/softr_ai_app_builder_large_2x.mp4',
    page: 'https://www.softr.io/',
    note: 'Vendor-published screen recording, downloaded as served. Poster: its last frame.',
    pulled: '2026-09-30',
  },
};
