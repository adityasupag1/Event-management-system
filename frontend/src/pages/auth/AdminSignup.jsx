import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { toastAuthFormError } from '../../utils/apiErrorMessage';
import { Icon } from '../../components/ui/Primitives';
import { getColor } from '../../utils/theme';
import AuthShell from './AuthShell';

const pwStrength = (pw) => {
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) n++;
  if (/\d/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return n;
};

export default function AdminSignup() {
  const { signup, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '', userId: '', email: '', password: '', confirm: '', agree: false,
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
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (!form.agree) return toast.error('Please confirm the admin notice');
    try {
      await signup({
        name: form.name,
        userId: form.userId,
        email: form.email,
        password: form.password,
        role: 'admin',
      });
      toast.success('Admin account created!');
      nav('/admin/dashboard');
    } catch (err) {
      toastAuthFormError(err, 'Signup failed');
    }
  };

  return (
    <AuthShell role="admin">
      <div className="text-center mb-6">
        <Icon name="shield" className="text-[36px] text-admin-blue mx-auto" />
        <h1 className="text-2xl font-bold text-ink mt-2">Create Admin Account</h1>
        <p className="text-sm text-ink-soft mt-1">Only authorized personnel should create admin accounts</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <div className="input-icon-wrap">
            <Icon name="person" className="input-icon" />
            <input className="input" placeholder="Enter your full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="label">Admin User ID</label>
          <div className="input-icon-wrap">
            <Icon name="badge" className="input-icon" />
            <input className="input" placeholder="Enter your admin ID" value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="input-icon-wrap">
            <Icon name="mail" className="input-icon" />
            <input type="email" className="input" placeholder="Enter your email address" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="input-icon-wrap">
            <Icon name="lock" className="input-icon" />
            <input type="password" className="input" placeholder="Create a strong password" value={form.password}
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
        <div>
          <label className="label">Confirm Password</label>
          <div className="input-icon-wrap">
            <Icon name="lock" className="input-icon" />
            <input type="password" className="input" placeholder="Repeat your password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-ink-soft">
          <input type="checkbox" className="mt-1 accent-admin-blue"
            checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
          <span>I understand admin actions are auditable</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => nav('/')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary-admin flex-1">
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </div>
        <p className="text-center text-sm text-ink-soft pt-2">
          Already have an admin account? <Link to="/login/admin" className="text-admin-blue font-medium">Sign In</Link>
        </p>
      </form>
    </AuthShell>
  );
}
