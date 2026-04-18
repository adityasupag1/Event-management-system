import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { toastAuthFormError } from '../../utils/apiErrorMessage';
import { Icon } from '../../components/ui/Primitives';
import { getColor } from '../../utils/theme';
import AuthShell from './AuthShell';

const CATS = [
  { name: 'Catering', icon: 'restaurant', color: 'cat-catering' },
  { name: 'Florist', icon: 'local_florist', color: 'cat-florist' },
  { name: 'Decoration', icon: 'palette', color: 'cat-decoration' },
  { name: 'Lighting', icon: 'lightbulb', color: 'cat-lighting' },
];

const pwStrength = (pw) => {
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) n++;
  if (/\d/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return n;
};

export default function VendorSignup() {
  const { signup, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    businessName: '', email: '', password: '', confirm: '', category: '', agree: false,
  });
  const strength = useMemo(() => pwStrength(form.password), [form.password]);
  const barColors = [
    getColor('line'),
    getColor('cat-catering'),
    getColor('vendor-yellow'),
    getColor('user-green'),
    getColor('user-green-dark'),
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Pick a service category');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (!form.agree) return toast.error('Please accept the vendor terms');
    try {
      await signup({
        name: form.businessName,
        businessName: form.businessName,
        email: form.email,
        password: form.password,
        role: 'vendor',
        category: form.category,
      });
      toast.success('Vendor account created!');
      nav('/vendor/dashboard');
    } catch (err) {
      toastAuthFormError(err, 'Signup failed');
    }
  };

  return (
    <AuthShell role="vendor">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-vendor-yellow-light text-vendor-yellow-dark mx-auto flex items-center justify-center mb-3">
          <Icon name="storefront" className="text-[28px]" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Become a Vendor</h1>
        <p className="text-sm text-ink-soft mt-1">Fill details and pick your service category</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="input-icon-wrap">
          <Icon name="person" className="input-icon" />
          <input className="input" placeholder="Business or Full Name" value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
        </div>
        <div className="input-icon-wrap">
          <Icon name="mail" className="input-icon" />
          <input type="email" className="input" placeholder="Email Address" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <div className="input-icon-wrap">
            <Icon name="lock" className="input-icon" />
            <input type="password" className="input" placeholder="Create a password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
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
        <div className="input-icon-wrap">
          <Icon name="lock" className="input-icon" />
          <input type="password" className="input" placeholder="Confirm Password" value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
        </div>
        <div>
          <p className="label mb-2">Service Category</p>
          <div className="grid grid-cols-2 gap-3">
            {CATS.map((c) => {
              const active = form.category === c.name;
              return (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setForm({ ...form, category: c.name })}
                  className={`relative p-4 rounded-lg border-2 transition-all text-sm font-medium flex flex-col items-center gap-1
                    ${active ? 'border-vendor-yellow-dark bg-vendor-yellow-light' : 'border-line bg-white hover:border-ink-mute'}`}
                >
                  <Icon
                    name={c.icon}
                    className="text-[22px]"
                    style={{ color: getColor(c.color) }}
                  />
                  <span className="text-ink">{c.name}</span>
                  {active && (
                    <span className="absolute top-1 right-1 text-vendor-yellow-dark">
                      <Icon name="check_circle" className="text-[18px]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-ink-soft">
          <input type="checkbox" className="mt-1 accent-vendor-yellow-dark"
            checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
          <span>I agree to <Link to="#" className="text-admin-blue">Vendor Terms</Link> and{' '}
            <Link to="#" className="text-admin-blue">Commission Policy</Link></span>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => nav('/')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary-vendor flex-1">
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </div>
        <p className="text-center text-sm text-ink-soft pt-2">
          Already registered? <Link to="/login/vendor" className="text-vendor-yellow-dark font-medium">Sign In</Link>
        </p>
      </form>
    </AuthShell>
  );
}
