import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Wraps routes that require auth and (optionally) a specific role
export function ProtectedRoute({ role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Outlet />;
}

// Light layout — used by landing & auth pages (own chrome per page)
export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col page-enter">
      <Outlet />
    </div>
  );
}
