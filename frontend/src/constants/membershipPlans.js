/** Values persisted in MongoDB as `membership.plan`. */
export const MEMBERSHIP_DB_PLANS = ['6 month', '1 year', '2 years'];

export function isDbMembershipPlan(plan) {
  return MEMBERSHIP_DB_PLANS.includes(plan);
}

export function monthsFromDbPlan(plan) {
  if (plan === '1 year') return 12;
  if (plan === '2 years') return 24;
  return 6;
}

/** Complimentary tiers shown at signup (links to DB `plan` string). */
export const COMPLIMENTARY_MEMBERSHIP_PLANS = [
  {
    dbPlan: '6 month',
    durationMonths: 6,
    label: '6 months',
    headline: 'Starter access',
    benefits: [
      'Unlimited browsing of vendors, products, and categories',
      'Member pricing on eligible listings where marked',
      'Saved carts and faster repeat checkout',
      'Standard email support for orders and events',
    ],
  },
  {
    dbPlan: '1 year',
    durationMonths: 12,
    label: '1 year',
    headline: 'Extended perks',
    benefits: [
      'Everything in the 6-month plan',
      'Early access to seasonal vendor promotions',
      'Multiple saved delivery addresses',
      'Quarterly event planning tips from EventMS',
    ],
  },
  {
    dbPlan: '2 years',
    durationMonths: 24,
    label: '2 years',
    headline: 'Best long-term value',
    benefits: [
      'Everything in the 1-year plan',
      'Priority support response window',
      'Curated vendor shortlists for large events (when available)',
      'Eligible for platform highlight campaigns when we run them',
    ],
  },
];

export function getComplimentaryPlanByMonths(months) {
  const n = Number(months);
  return COMPLIMENTARY_MEMBERSHIP_PLANS.find((p) => p.durationMonths === n) || COMPLIMENTARY_MEMBERSHIP_PLANS[0];
}

export function getComplimentaryPlanByDbPlan(plan) {
  return COMPLIMENTARY_MEMBERSHIP_PLANS.find((p) => p.dbPlan === plan) || COMPLIMENTARY_MEMBERSHIP_PLANS[0];
}
