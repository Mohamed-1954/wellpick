import { getEntry } from 'astro:content';
import type { ProductId } from './site';
import { isoDate } from './format';

export interface Plan {
  name: string;
  /** Price per month on monthly billing */
  monthly: number | null;
  /** Per-month equivalent on annual billing */
  yearlyMonthly: number | null;
  [spec: string]: unknown;
}

/** The dated pricing claim for a product (src/data/claims.json → "<product>-pricing"). */
export async function getPricing(product: ProductId) {
  const claim = await getEntry('claims', `${product}-pricing`);
  if (!claim) throw new Error(`[pricing] No pricing claim for ${product}`);
  const plans = (claim.data.value as { plans: Plan[] }).plans;
  const sources = await Promise.all(
    claim.data.sourceIds.map(async (ref) => {
      const s = await getEntry('sources', ref.id);
      if (!s) throw new Error(`[pricing] Unknown source ${ref.id}`);
      return { id: ref.id, url: s.data.url, title: s.data.title };
    }),
  );
  return { plans, verifiedAt: isoDate(claim.data.verifiedAt), statement: claim.data.statement, sources };
}

/** Cheapest paid plan, annual-billing monthly equivalent. */
export function entryPrice(plans: Plan[]) {
  const paid = plans.filter((p) => (p.yearlyMonthly ?? 0) > 0);
  return paid[0];
}
