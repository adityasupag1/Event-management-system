import {
  getComplimentaryPlanByDbPlan,
  getComplimentaryPlanByMonths,
  isDbMembershipPlan,
  monthsFromDbPlan,
} from '../constants/membershipPlans';

/** Active complimentary membership summary, or null. */
export function getComplimentarySummary(user) {
  const m = user?.membership;
  if (!m?.expiresAt) return null;

  let planKey = m.plan;
  if (!isDbMembershipPlan(planKey) && (planKey == null || planKey === '')) {
    const dm = inferComplimentaryMonthsFromWindow(user);
    if (dm === 12) planKey = '1 year';
    else if (dm === 24) planKey = '2 years';
    else if (dm === 6) planKey = '6 month';
  }

  if (isDbMembershipPlan(planKey)) {
    const expiresAt = new Date(m.expiresAt);
    const durationMonths = monthsFromDbPlan(planKey);
    const plan = getComplimentaryPlanByDbPlan(planKey);
    const isActive = expiresAt.getTime() > Date.now();
    return {
      plan,
      durationMonths,
      expiresAt,
      isActive,
      expiresLabel: expiresAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
  }

  // Legacy documents (plan no longer written): infer from old fields if present
  if (m.plan === 'promo' && m.durationMonths) {
    const durationMonths = [6, 12, 24].includes(Number(m.durationMonths)) ? Number(m.durationMonths) : 6;
    const plan = getComplimentaryPlanByMonths(durationMonths);
    const expiresAt = new Date(m.expiresAt);
    const isActive = expiresAt.getTime() > Date.now();
    return {
      plan,
      durationMonths,
      expiresAt,
      isActive,
      expiresLabel: expiresAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
  }

  return null;
}

/** Short label for nav / badges, e.g. "Member · 12 mo". */
export function getMembershipNavLabel(user) {
  const s = getComplimentarySummary(user);
  if (!s?.isActive) return null;
  return `Member · ${s.durationMonths} mo`;
}

export function inferComplimentaryMonthsFromWindow(user) {
  const m = user?.membership;
  if (!m?.expiresAt || !user?.createdAt) return null;
  const exp = new Date(m.expiresAt).getTime();
  const start = new Date(user.createdAt).getTime();
  if (!(exp > start)) return null;
  const approxMonths = Math.round((exp - start) / (1000 * 60 * 60 * 24 * 30.44));
  if (approxMonths >= 18) return 24;
  if (approxMonths >= 9) return 12;
  return 6;
}

/** Admin tables: same strings as stored in DB, or legacy mapping. */
export function getMembershipDisplayLabel(user) {
  const m = user?.membership;
  if (!m || typeof m !== 'object') return 'Not assigned';

  if (isDbMembershipPlan(m.plan)) {
    return m.plan;
  }

  if (m.plan === 'promo' && m.durationMonths != null) {
    const dm = parseInt(m.durationMonths, 10);
    if (dm === 12) return '1 year';
    if (dm === 24) return '2 years';
    return '6 month';
  }

  // Mongoose may null `plan` when it failed an older strict enum, but `expiresAt` remains
  if ((m.plan == null || m.plan === '') && m.expiresAt) {
    const dm = inferComplimentaryMonthsFromWindow(user);
    if ([6, 12, 24].includes(dm)) {
      if (dm === 12) return '1 year';
      if (dm === 24) return '2 years';
      return '6 month';
    }
  }

  let dm = parseInt(m.durationMonths, 10);
  if (![6, 12, 24].includes(dm)) {
    dm = inferComplimentaryMonthsFromWindow(user);
  }
  if ([6, 12, 24].includes(dm) && m.expiresAt) {
    if (dm === 12) return '1 year';
    if (dm === 24) return '2 years';
    return '6 month';
  }

  if (['free', 'basic', 'premium'].includes(m.plan)) return 'Not assigned';

  return m.plan || 'Not assigned';
}
