import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ROLE_THEME, getColor } from '../../utils/theme';
import { getMembershipNavLabel } from '../../utils/membership';
import { Icon, Logo } from '../ui/Primitives';

const NAV_BY_ROLE = {
  user: [
    { to: '/user/dashboard', label: 'Dashboard' },
    { to: '/user/vendors', label: 'Vendors' },
    { to: '/user/cart', label: 'Cart', cartBadge: true },
    { to: '/user/orders', label: 'Order Status' },
  ],
  vendor: [
    { to: '/vendor/dashboard', label: 'Dashboard' },
    { to: '/vendor/products', label: 'Your Items' },
    { to: '/vendor/products/new', label: 'Add New Item' },
    { to: '/vendor/requests', label: 'Request Items' },
    { to: '/vendor/orders', label: 'Product Status' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Maintain User' },
    { to: '/admin/vendors', label: 'Maintain Vendor' },
    { to: '/admin/transactions', label: 'Transactions' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [open]);

  const theme = user ? ROLE_THEME[user.role] : null;
  const links = user ? NAV_BY_ROLE[user.role] || [] : [];
  const memberLabel = user?.role === 'user' ? getMembershipNavLabel(user) : null;

  const onLogout = () => {
    logout();
    nav('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  return (
    <>
      <nav className="sticky top-0 z-40 w-full h-16 bg-white/90 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'border-b-2'
                      : 'text-ink-soft hover:text-ink hover:bg-surface-soft'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? getColor(theme?.primary) : 'inherit',
                  borderBottomColor: isActive ? getColor(theme?.primary) : 'transparent',
                })}
              >
                {l.label}
                {l.cartBadge && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cat-catering text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  {memberLabel && (
                    <span
                      className="hidden lg:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{
                        color: getColor(theme?.primaryDark || 'user-green-dark'),
                        borderColor: getColor(theme?.primary || 'user-green'),
                        backgroundColor: getColor(theme?.primaryLight || 'user-green-light'),
                      }}
                      title="Complimentary membership"
                    >
                      {memberLabel}
                    </span>
                  )}
                  <div
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: getColor(theme?.primary) }}
                  >
                    {initials}
                  </div>
                  <button
                    onClick={onLogout}
                    className="hidden md:inline-flex text-sm text-ink-soft hover:text-cat-catering transition-colors px-3 py-2"
                  >
                    Logout
                  </button>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="md:hidden p-2 rounded-md hover:bg-surface-soft"
                  aria-label="Open menu"
                >
                  <Icon name="menu" className="text-[24px] text-ink" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login/user" className="hidden sm:inline-flex btn-text text-sm text-admin-blue">
                  Log In
                </Link>
                <Link
                  to="/"
                  className="btn bg-gradient-to-br from-admin-blue to-admin-blue-dark text-white shadow-card"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {user && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
              open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
              open ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div
              className="px-5 py-5 flex items-center justify-between"
              style={{ backgroundColor: getColor(theme?.primaryLight) }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold"
                  style={{ backgroundColor: getColor(theme?.primary) }}
                >
                  {initials}
                </div>
                <div>
                  <div className="font-medium text-ink text-sm leading-tight">{user.name}</div>
                  <div className="text-xs text-ink-soft">{theme?.label}</div>
                  {memberLabel && (
                    <div className="text-[11px] font-semibold text-user-green-dark mt-1">{memberLabel}</div>
                  )}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/60" aria-label="Close">
                <Icon name="close" className="text-[22px] text-ink" />
              </button>
            </div>
            <nav className="py-4 px-3 flex flex-col">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? '' : 'text-ink hover:bg-surface-soft'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? getColor(theme?.primary) : 'inherit',
                    backgroundColor: isActive ? getColor(theme?.primaryLight) : 'transparent',
                  })}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getColor(theme?.primary) }}
                  />
                  {l.label}
                  {l.cartBadge && itemCount > 0 && (
                    <span className="ml-auto bg-cat-catering text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-line">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cat-catering-light text-cat-catering font-medium text-sm hover:bg-cat-catering hover:text-white transition-colors"
              >
                <Icon name="logout" className="text-[20px]" />
                Log Out
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
