/** Stored membership.plan values (exact strings in MongoDB). */
export const MEMBERSHIP_PLANS = ['6 month', '1 year', '2 years'];

export function isValidMembershipPlan(plan) {
  return MEMBERSHIP_PLANS.includes(plan);
}

export function monthsFromPlan(plan) {
  if (plan === '1 year') return 12;
  if (plan === '2 years') return 24;
  return 6;
}

/** @param {number} months 6 | 12 | 24 */
export function planFromDurationMonths(months) {
  const n = parseInt(months, 10);
  if (n === 12) return '1 year';
  if (n === 24) return '2 years';
  return '6 month';
}
