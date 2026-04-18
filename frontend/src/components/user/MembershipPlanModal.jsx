import { useEffect, useState } from 'react';
import { COMPLIMENTARY_MEMBERSHIP_PLANS } from '../../constants/membershipPlans';
import { Icon } from '../ui/Primitives';

export default function MembershipPlanModal({ open, onClose, selectedPlan, onApply }) {
  const [draft, setDraft] = useState(selectedPlan);

  useEffect(() => {
    if (open) setDraft(selectedPlan);
  }, [open, selectedPlan]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const apply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-line">
        <div className="sticky top-0 bg-white border-b border-line px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div>
            <h2 className="text-lg font-bold text-ink">Choose your complimentary plan</h2>
            <p className="text-sm text-ink-soft mt-0.5">
              All plans are free at signup — no payment method required. Pick the length that fits your planning horizon.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-surface-soft shrink-0" aria-label="Close">
            <Icon name="close" className="text-[22px] text-ink" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPLIMENTARY_MEMBERSHIP_PLANS.map((p) => {
            const active = draft === p.dbPlan;
            return (
              <button
                key={p.dbPlan}
                type="button"
                onClick={() => setDraft(p.dbPlan)}
                className={`text-left rounded-xl border-2 p-4 transition-all flex flex-col h-full ${
                  active
                    ? 'border-user-green-dark bg-user-green-light shadow-card'
                    : 'border-line bg-white hover:border-ink-mute'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-ink">{p.label}</span>
                  {active && <Icon name="check_circle" className="text-user-green-dark text-[22px] shrink-0" />}
                </div>
                <p className="text-xs font-medium text-user-green-dark mb-3">{p.headline}</p>
                <ul className="text-xs text-ink-soft space-y-2 flex-1">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <Icon name="check" className="text-[14px] text-user-green shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-line px-5 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button type="button" onClick={onClose} className="btn-outline sm:min-w-[120px]">
            Cancel
          </button>
          <button type="button" onClick={apply} className="btn-primary-user sm:min-w-[140px]">
            Apply plan
          </button>
        </div>
      </div>
    </div>
  );
}
