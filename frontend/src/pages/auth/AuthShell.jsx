import { Link, useNavigate } from 'react-router-dom';
import { Icon, Logo } from '../../components/ui/Primitives';
import { ROLE_THEME, getColor } from '../../utils/theme';

export default function AuthShell({ role, children, footerNote }) {
  const theme = ROLE_THEME[role];
  const bgGradients = {
    user: `linear-gradient(to bottom right, ${getColor('user-green-light')}99, white, ${getColor('user-green-light')}66)`,
    vendor: `linear-gradient(to bottom right, ${getColor('vendor-yellow-light')}99, white, ${getColor('vendor-yellow-light')}66)`,
    admin: `linear-gradient(to bottom right, ${getColor('admin-blue-light')}99, white, ${getColor('admin-blue-light')}66)`,
  };
  const nav = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: bgGradients[role] }}
    >
      <header className="h-16 bg-white/70 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => nav('/')}
            className="btn-outline text-sm border-current"
            style={{ color: getColor(theme.primary) }}
          >
            <Icon name="arrow_back" className="text-[18px]" /> Back
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div
            className="card p-8 animate-fade-slide-up"
            style={{ borderColor: getColor(theme.primary) }}
          >
            {children}
          </div>
          {footerNote && <p className="text-center text-sm text-ink-soft mt-4">{footerNote}</p>}
        </div>
      </main>
    </div>
  );
}
