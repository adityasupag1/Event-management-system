import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon, Logo } from '../ui/Primitives';
const linkBase =
  'px-3 py-2 rounded-md text-sm font-medium transition-colors';
const inactive = 'text-ink-soft hover:text-admin-blue';
const active = 'text-admin-blue border-b-2 border-admin-blue';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const navClass = ({ isActive }) => `${linkBase} ${isActive ? active : inactive}`;

  const links = (
    <>
      <NavLink to="/" end className={navClass}>
        Home
      </NavLink>
      <NavLink to="/features" className={navClass}>
        Features
      </NavLink>
      <NavLink to="/how-it-works" className={navClass}>
        How It Works
      </NavLink>
      <NavLink to="/categories" className={navClass}>
        Categories
      </NavLink>
      <NavLink to="/contact" className={navClass}>
        Contact
      </NavLink>
    </>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <Logo />
          <div className="hidden md:flex items-center gap-1">{links}</div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login/user"
              className="hidden sm:inline-flex text-admin-blue font-medium text-sm px-3 py-2 rounded-md hover:bg-admin-blue-light/50"
            >
              Log In
            </Link>
            <Link
              to="/#roles"
              className="btn bg-gradient-to-br from-admin-blue to-admin-blue-dark text-white shadow-card text-sm px-4 py-2"
            >
              Get Started
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-surface-soft"
              aria-label="Open menu"
            >
              <Icon name="menu" className="text-[24px] text-ink" />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-xl md:hidden flex flex-col animate-fade-slide-up border-l border-line">
            <div className="flex items-center justify-between px-4 py-4 border-b border-line bg-admin-blue-light/30">
              <span className="font-semibold text-ink text-sm">Menu</span>
              <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/80" aria-label="Close">
                <Icon name="close" className="text-[22px] text-ink" />
              </button>
            </div>
            <nav className="flex flex-col p-3 gap-1">
              <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/features" className={navClass} onClick={() => setOpen(false)}>
                Features
              </NavLink>
              <NavLink to="/how-it-works" className={navClass} onClick={() => setOpen(false)}>
                How It Works
              </NavLink>
              <NavLink to="/categories" className={navClass} onClick={() => setOpen(false)}>
                Categories
              </NavLink>
              <NavLink to="/contact" className={navClass} onClick={() => setOpen(false)}>
                Contact
              </NavLink>
              <Link
                to="/login/user"
                className="mt-4 text-center text-sm font-medium text-admin-blue py-3 rounded-lg hover:bg-admin-blue-light/40"
                onClick={() => setOpen(false)}
              >
                Log In
              </Link>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
