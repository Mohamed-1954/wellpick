const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-26" or Date → "26 Sep 2026" (UTC, no locale drift between build machines). */
export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
