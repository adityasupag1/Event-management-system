import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage } from '../../utils/apiErrorMessage';
import { Icon } from '../../components/ui/Primitives';
import AuthShell from './AuthShell';

export default function UserLogin() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawIdentifier = form.userId.trim();
      const credential = rawIdentifier.includes('@')
        ? { email: rawIdentifier.toLowerCase(), password: form.password, role: 'user' }
        : { userId: rawIdentifier, password: form.password, role: 'user' };
      await login(credential);
      toast.success('Welcome back!');
      nav('/user/dashboard');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <AuthShell
      role="user"
      footerNote={
        <>
          New to EventMS? <Link to="/signup/user" className="text-user-green font-medium">Create an account</Link>
          <div className="mt-2 text-xs text-ink-soft">
            New signups get complimentary membership (6 months by default, or 1–2 years if you choose).
          </div>
        </>
      }
    >
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-user-green-light text-user-green mx-auto flex items-center justify-center mb-3">
          <Icon name="person" className="text-[28px]" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Welcome Back</h1>
        <p className="text-sm text-ink-soft mt-1">Sign in to plan your next event</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">User ID</label>
          <div className="input-icon-wrap">
            <Icon name="person" className="input-icon" />
            <input
              className="input"
              placeholder="Enter your User ID or email"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink"
              aria-label="Toggle password visibility"
            >
              <Icon name={showPw ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to="#" className="text-sm text-user-green font-medium">Forgot password?</Link>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => nav('/')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary-user flex-1">
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
