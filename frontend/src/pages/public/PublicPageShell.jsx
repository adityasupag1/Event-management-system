import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';

/** Shared wrapper for marketing pages (same chrome as landing). */
export default function PublicPageShell({ children, heroClassName = '' }) {
  return (
    <div className="min-h-screen flex flex-col page-enter bg-white">
      <PublicNavbar />
      <div className={heroClassName}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
