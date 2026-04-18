import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../components/ui/Primitives';
import AuthShell from './AuthShell';

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawIdentifier = form.userId.trim();
      const cred = rawIdentifier.includes('@')
        ? { email: rawIdentifier.toLowerCase(), password: form.password, role: 'admin' }
        : { userId: rawIdentifier, password: form.password, role: 'admin' };
      await login(cred);
      toast.success('Admin authenticated.');
      nav('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthShell
      role="admin"
      footerNote={
        <span className="flex items-center justify-center gap-1 text-ink-soft">
          <Icon name="lock" className="text-[16px]" />
          Admin sessions are monitored and logged
        </span>
      }
    >
      <div className="text-center mb-6">
        <Icon name="shield" className="text-[36px] text-admin-blue mx-auto" />
        <h1 className="text-2xl font-bold text-ink mt-2">Admin Login</h1>
        <p className="text-sm text-ink-soft mt-1">Restricted access — admin credentials only</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">User ID</label>
          <div className="input-icon-wrap">
            <Icon name="person" className="input-icon" />
            <input
              className="input"
              placeholder="Enter your admin ID"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="input-icon-wrap">
            <Icon name="lock" className="input-icon" />
            <input
              type={showPw ? 'text' : 'password'}
              className="input pr-10"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute"
            >
              <Icon name={showPw ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to="#" className="text-sm text-admin-blue font-medium">Forgot password?</Link>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => nav('/')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary-admin flex-1">
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
