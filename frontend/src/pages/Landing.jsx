import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Primitives';
import Footer from '../components/layout/Footer';
import PublicNavbar from '../components/layout/PublicNavbar';
import { getColor } from '../utils/theme';

export default function Landing() {
  return (
    <>
      <PublicNavbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-admin-blue-light/50 via-white to-user-green-light/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-admin-blue-light rounded-full blur-3xl opacity-60 -z-10" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-user-green-light rounded-full blur-3xl opacity-60 -z-10" />
          <div className="relative max-w-4xl mx-auto text-center px-6 pt-24 pb-32">
            <h1 className="text-4xl md:text-6xl font-bold text-ink leading-tight mb-6 font-display">
              Plan Your Perfect Event
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-admin-blue to-user-green">
                All in One Place
              </span>
            </h1>
            <p className="text-lg text-ink-soft mb-10 max-w-2xl mx-auto">
              The curated workspace for event planning. Connect with top-tier vendors, manage guests, and oversee logistics with warm precision.
            </p>
            {/* Category chips */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="chip-catering"><Icon name="restaurant" className="text-[18px]" />Catering</span>
              <span className="chip-florist"><Icon name="local_florist" className="text-[18px]" />Florist</span>
              <span className="chip-decoration"><Icon name="palette" className="text-[18px]" />Decoration</span>
              <span className="chip-lighting"><Icon name="lightbulb" className="text-[18px]" />Lighting</span>
            </div>
          </div>
        </section>

        {/* Role Selection */}
        <section id="roles" className="bg-surface-soft py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-xl font-semibold text-ink mb-10">Sign in as</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RoleCard
                role="user"
                icon="person"
                title="I'm a User"
                desc="Browse vendors, manage your event checklist, and track bookings seamlessly."
                to="/login/user"
                cta="Continue as User"
                footnote="Sign up includes complimentary membership — 6 months by default, or choose 1–2 years at registration."
              />
              <RoleCard
                role="vendor"
                icon="storefront"
                title="I'm a Vendor"
                desc="Sell services, manage inquiries, and showcase your portfolio to event planners."
                to="/login/vendor"
                cta="Continue as Vendor"
              />
              <RoleCard
                role="admin"
                icon="admin_panel_settings"
                title="I'm an Admin"
                desc="Manage users, oversee transactions, and maintain platform integrity."
                to="/login/admin"
                cta="Continue as Admin"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function RoleCard({ role, icon, title, desc, to, cta, footnote }) {
  const colorMap = {
    user: 'user-green',
    vendor: 'vendor-yellow-dark',
    admin: 'admin-blue',
  };
  const btnClassMap = {
    user: 'btn-primary-user',
    vendor: 'btn-primary-vendor',
    admin: 'btn-primary-admin',
  };
  const color = colorMap[role];
  return (
    <div
      className="card card-hover p-8 flex flex-col"
      style={{ borderColor: getColor(color) }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
        style={{
          backgroundColor: getColor(color) + '20',
          color: getColor(color),
        }}
      >
        <Icon name={icon} className="text-[24px]" />
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-ink-soft text-sm mb-4 flex-grow">{desc}</p>
      {footnote && (
        <p className="text-xs text-user-green-dark font-medium mb-4 leading-snug">{footnote}</p>
      )}
      <Link to={to} className={`${btnClassMap[role]} w-full`}>{cta}</Link>
    </div>
  );
}
