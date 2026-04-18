import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { toastAuthFormError } from '../../utils/apiErrorMessage';
import { Icon } from '../../components/ui/Primitives';
import AuthShell from './AuthShell';

export default function VendorLogin() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawIdentifier = form.userId.trim();
      const cred = rawIdentifier.includes('@')
        ? { email: rawIdentifier.toLowerCase(), password: form.password, role: 'vendor' }
        : { userId: rawIdentifier, password: form.password, role: 'vendor' };
      await login(cred);
      toast.success('Welcome back!');
      nav('/vendor/dashboard');
    } catch (err) {
      toastAuthFormError(err, 'Login failed');
    }
  };

  return (
    <AuthShell
      role="vendor"
      footerNote="📦 Join 500+ vendors powering great events"
    >
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-vendor-yellow-light text-vendor-yellow-dark mx-auto flex items-center justify-center mb-3">
          <Icon name="storefront" className="text-[28px]" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Vendor Login</h1>
        <p className="text-sm text-ink-soft mt-1">Sign in to manage your products and orders</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">User ID</label>
          <div className="input-icon-wrap">
            <Icon name="person" className="input-icon" />
            <input
              className="input"
              placeholder="Enter your User ID"
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
          <Link to="#" className="text-sm text-vendor-yellow-dark font-medium">Forgot password?</Link>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => nav('/')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary-vendor flex-1">
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </div>
        <p className="text-center text-sm text-ink-soft pt-2">
          New vendor? <Link to="/signup/vendor" className="text-vendor-yellow-dark font-medium">Sign up here</Link>
        </p>
        <div className="border-t border-line pt-4">
          <p className="text-center text-sm text-ink mb-3">Sell in any of these categories</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="chip-catering"><Icon name="restaurant" className="text-[16px]" />Catering</span>
            <span className="chip-florist"><Icon name="local_florist" className="text-[16px]" />Florist</span>
            <span className="chip-decoration"><Icon name="palette" className="text-[16px]" />Decoration</span>
            <span className="chip-lighting"><Icon name="lightbulb" className="text-[16px]" />Lighting</span>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
