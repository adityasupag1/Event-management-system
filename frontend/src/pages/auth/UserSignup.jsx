import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../components/ui/Primitives';
import { getColor } from '../../utils/theme';
import AuthShell from './AuthShell';
import { getComplimentaryPlanByDbPlan } from '../../constants/membershipPlans';
import MembershipPlanModal from '../../components/user/MembershipPlanModal';

const pwStrength = (pw) => {
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) n++;
  if (/\d/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return n;
};

export default function UserSignup() {
  const { signup, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
  const [membershipPlan, setMembershipPlan] = useState('6 month');
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const strength = useMemo(() => pwStrength(form.password), [form.password]);
  const selectedPlan = useMemo(() => getComplimentaryPlanByDbPlan(membershipPlan), [membershipPlan]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (!form.agree) return toast.error('Please accept the terms');
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'user',
        membershipPlan,
      });
      toast.success('Account created!');
      nav('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  const barColors = [
    getColor('line'),
    getColor('cat-catering'),
    getColor('vendor-yellow'),
    getColor('user-green'),
    getColor('user-green-dark'),
  ];

  return (
    <AuthShell role="user">
      <MembershipPlanModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        selectedPlan={membershipPlan}
        onApply={(plan) => setMembershipPlan(plan)}
      />

      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-user-green-light text-user-green mx-auto flex items-center justify-center mb-3">
          <Icon name="celebration" className="text-[28px]" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Create Your Account</h1>
        <p className="text-sm text-ink-soft mt-1">Complimentary membership included — default is 6 months</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input className="input" placeholder="Enter your name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Enter your email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Create a password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: i < strength ? barColors[strength] : barColors[0] }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input type="password" className="input" placeholder="Repeat your password" value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
        </div>

        <div className="rounded-xl border-2 border-user-green-dark bg-user-green-light/40 p-4">
          <p className="label mb-1">Your membership</p>
          <div className="flex items-start gap-2 mb-2">
            <Icon name="workspace_premium" className="text-[22px] text-user-green-dark shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">
                {selectedPlan.label} complimentary — {selectedPlan.headline}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-ink-soft">
                {selectedPlan.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2">
                    <Icon name="check" className="text-[14px] text-user-green shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPlanModalOpen(true)}
            className="w-full mt-2 text-sm font-medium text-admin-blue hover:underline py-1"
          >
            Choose another plan
          </button>
          <p className="text-xs text-ink-soft mt-2">
            No payment method required. You can switch length before signing up.
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm text-ink-soft">
          <input type="checkbox" className="mt-1 accent-user-green"
            checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
          <span>I agree to <Link to="#" className="text-admin-blue">Terms of Service</Link> and{' '}
            <Link to="#" className="text-admin-blue">Privacy Policy</Link></span>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => nav('/')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary-user flex-1">
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </div>
        <p className="text-center text-sm text-ink-soft pt-2">
          Already have an account? <Link to="/login/user" className="text-user-green font-medium">Sign In</Link>
        </p>
      </form>
    </AuthShell>
  );
}
