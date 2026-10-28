// Picks the first plan that fits a reader's numbers on each product and
// prices it on both billing bases. Inputs are people and needs; all limits
// and prices come from the dated pricing claims in src/data/claims.json.
import type { Plan } from './pricing';

export interface Needs {
  /** Staff who log in, builders included */
  staff: number;
  /** Staff who edit the app itself (Softr builders) */
  builders: number;
  /** Staff who log in with Gmail, Outlook or another free address */
  staffFreeEmail: number;
  /** Client contacts who log in (people, not companies) */
  clients: number;
  /** Records across every table */
  records: number;
  /** Data stays in Airtable, Sheets or another external source */
  externalData: boolean;
  /** More than 2 roles, or field-level permissions */
  granularRoles: boolean;
  /** Clients create or edit records under enforced global rules */
  writeRestrictions: boolean;
  /** Add Fillout for intake */
  fillout: boolean;
  responses: number;
  largestFileMb: number;
  loginForm: boolean;
  duplicatePrevention: boolean;
}

export interface Fit {
  product: 'softr' | 'noloco' | 'fillout';
  /** null = no self-serve plan fits (Enterprise / contact sales) */
  plan: string | null;
  yearly: number | null;
  monthly: number | null;
  /** Why this plan and not a cheaper one, plus extras added */
  notes: string[];
}

const n = (v: unknown) => Number(v ?? 0);
const money = (v: number) => `$${v.toLocaleString('en-US')}`;

export function fitSoftr(plans: Plan[], x: Needs): Fit {
  const freeStaff = Math.min(x.staffFreeEmail, Math.max(0, x.staff - x.builders));
  const team = Math.max(0, x.staff - x.builders - freeStaff);
  const client = x.clients + freeStaff;
  const notes: string[] = [];
  if (freeStaff > 0) notes.push(freeStaff === 1 ? 'One staff member on a free email address counts as a client user.' : `${freeStaff} staff on free email addresses count as client users.`);
  if (x.externalData) notes.push('Softr record caps apply to Softr Databases; ask Softr which limit applies to an external source.');

  for (const p of plans) {
    const why: string[] = [];
    if (x.writeRestrictions && !p.writeRestrictions) continue;
    if (p.name === 'Free') {
      if (team + client > n(p.totalUsersMax) || x.builders > n(p.buildersMax)) continue;
      if (!x.externalData && x.records > n(p.records)) continue;
      return { product: 'softr', plan: 'Free', yearly: 0, monthly: 0, notes: [...notes, `${team + client} app users fit the 5-user allowance.`] };
    }
    if (team > n(p.teamMax) || client > n(p.clientMax)) continue;
    if (!x.externalData && x.records > n(p.records)) continue;
    const extraTeam = Math.max(0, team - n(p.teamIncluded)) * n(p.teamExtra);
    const extraClient = Math.max(0, client - n(p.clientIncluded)) * n(p.clientExtra);
    const extraBuilders = Math.max(0, x.builders - n(p.builders));
    const yearly = n(p.yearlyMonthly) + extraTeam + extraClient + extraBuilders * n(p.builderExtraYearly);
    const monthly = n(p.monthly) + extraTeam + extraClient + extraBuilders * n(p.builderExtraMonthly);
    if (extraTeam) why.push(`${team - n(p.teamIncluded)} extra team user${team - n(p.teamIncluded) === 1 ? '' : 's'}: ${money(extraTeam)}/mo.`);
    if (extraClient) why.push(`${client - n(p.clientIncluded)} extra client user${client - n(p.clientIncluded) === 1 ? '' : 's'}: ${money(extraClient)}/mo.`);
    if (extraBuilders) why.push(`${extraBuilders} extra builder${extraBuilders === 1 ? '' : 's'}.`);
    if (p.name !== 'Basic' && !x.writeRestrictions) {
      // Name the cheaper plan that was just ruled out, not always Basic.
      const below = plans[plans.indexOf(p) - 1];
      if (below?.name === 'Basic' && (team > n(below.teamMax) || client > n(below.clientMax))) {
        why.unshift(`Basic caps you at ${n(below.teamMax)} team and ${n(below.clientMax)} client users with no add-ons.`);
      } else if (below && below.name !== 'Free' && (team > n(below.teamMax) || client > n(below.clientMax))) {
        why.unshift(`${below.name} stops at ${n(below.teamMax)} team and ${n(below.clientMax)} client users.`);
      }
    }
    if (x.writeRestrictions) why.unshift('Global create, edit and delete restrictions start on Business.');
    return { product: 'softr', plan: p.name, yearly, monthly, notes: [...notes, ...why] };
  }
  return { product: 'softr', plan: null, yearly: null, monthly: null, notes: [...notes, 'Past the Business maximum (100 team, 500 client users): Enterprise, custom price.'] };
}

export function fitNoloco(plans: Plan[], x: Needs): Fit {
  const notes: string[] = [];
  if (x.staffFreeEmail > 0) notes.push('Staff with a team member role count as team seats whatever their email domain.');
  for (const p of plans) {
    if (p.name === 'Free') {
      if (x.externalData || x.granularRoles || x.clients > n(p.clientMax) || x.records > n(p.records)) continue;
      return { product: 'noloco', plan: 'Free', yearly: 0, monthly: 0, notes: [...notes, 'Free fits: Noloco Tables only, 2 roles, 100 workflow runs a month.'] };
    }
    if (x.clients > n(p.clientMax) || x.records > n(p.recordsMax)) continue;
    const why: string[] = [];
    const free = plans.find((q) => q.name === 'Free');
    if (free) {
      if (x.externalData) why.push('External sources such as Airtable start on Build.');
      else if (x.granularRoles) why.push('More than 2 roles or field-level permissions start on Build.');
      else if (x.clients > n(free.clientMax)) why.push(`Free stops at ${n(free.clientMax)} active clients.`);
      else if (x.records > n(free.records)) why.push(`Free stops at ${n(free.records).toLocaleString('en-US')} records.`);
    }
    const seats = Math.max(0, x.staff - n(p.teamIncluded));
    const blocks = Math.ceil(Math.max(0, x.records - n(p.records)) / n(p.recordBlock));
    const recordCost = blocks * n(p.recordBlockPrice);
    if (seats) why.push(`${seats} extra team seat${seats === 1 ? '' : 's'}.`);
    if (blocks) why.push(`${blocks} extra record block${blocks === 1 ? '' : 's'} of 25,000: ${money(recordCost)}/mo.`);
    return {
      product: 'noloco',
      plan: p.name,
      yearly: n(p.yearlyMonthly) + seats * n(p.seatExtraYearly) + recordCost,
      monthly: n(p.monthly) + seats * n(p.seatExtraMonthly) + recordCost,
      notes: [...notes, ...why],
    };
  }
  return { product: 'noloco', plan: null, yearly: null, monthly: null, notes: [...notes, 'Past 1,000 active clients or 250,000 records: Enterprise, custom price.'] };
}

export function fitFillout(plans: Plan[], x: Needs): Fit {
  for (const p of plans) {
    const max = p.responsesMax === null ? Infinity : n(p.responsesMax);
    if (x.responses > max || x.largestFileMb > n(p.fileMb)) continue;
    if (x.loginForm && !p.login) continue;
    if (x.duplicatePrevention && !p.duplicates) continue;
    const why: string[] = [];
    if (x.duplicatePrevention && p.name === 'Business') why.push('Airtable duplicate prevention is on Business only.');
    else if (x.largestFileMb > 20) why.push('Files over 20 MB need Business.');
    else if (x.loginForm && p.name === 'Starter') why.push('Login pages start on Starter.');
    else if (p.name !== 'Free') why.push(`Response volume sets the plan.`);
    return { product: 'fillout', plan: p.name, yearly: n(p.yearlyMonthly), monthly: n(p.monthly), notes: why };
  }
  return { product: 'fillout', plan: null, yearly: null, monthly: null, notes: ['Files over 1 GB need Enterprise, custom price.'] };
}
