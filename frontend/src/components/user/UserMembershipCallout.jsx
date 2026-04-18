import { Icon } from '../ui/Primitives';
import { getComplimentarySummary } from '../../utils/membership';

/** Shows when the logged-in user has an active complimentary membership. */
export default function UserMembershipCallout({ user, variant = 'default' }) {
  const s = getComplimentarySummary(user);
  if (!s?.isActive) return null;

  if (variant === 'compact') {
    return (
      <p className="text-xs text-user-green-dark font-medium flex items-center gap-1.5 flex-wrap">
        <Icon name="workspace_premium" className="text-[16px]" />
        <span>
          {s.plan.label} member — until {s.expiresLabel}
        </span>
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-user-green bg-user-green-light/50 px-4 py-3 text-sm text-ink">
      <div className="font-semibold text-user-green-dark flex items-center gap-2 mb-1">
        <Icon name="workspace_premium" className="text-[20px]" />
        {s.plan.headline} · {s.plan.label}
      </div>
      <p className="text-ink-soft text-xs">
        Complimentary access is active until <span className="font-medium text-ink">{s.expiresLabel}</span>.
        Your plan includes: {s.plan.benefits[0]}
      </p>
    </div>
  );
}
