import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Primitives';
import PublicPageShell from './PublicPageShell';
import { getColor } from '../../utils/theme';

const FEATURES = [
  {
    icon: 'hub',
    title: 'Unified marketplace',
    desc: 'Discover catering, florists, décor, and lighting in one curated catalog with clear pricing and availability.',
  },
  {
    icon: 'shopping_cart',
    title: 'Smart cart & checkout',
    desc: 'Build orders across multiple vendors with delivery details, tax, and payment options in a single flow.',
  },
  {
    icon: 'receipt_long',
    title: 'Order visibility',
    desc: 'Track status from received to delivered with history you can share with clients or your team.',
  },
  {
    icon: 'groups',
    title: 'Built for users & vendors',
    desc: 'Role-based dashboards: planners get discovery and checkout; vendors get listings, requests, and fulfillment tools.',
  },
  {
    icon: 'shield',
    title: 'Admin oversight',
    desc: 'Platform operators can maintain users, vendors, transactions, and exports from one control center.',
  },
  {
    icon: 'workspace_premium',
    title: 'Membership-ready',
    desc: 'Complimentary membership tiers at signup so planners can unlock perks without payment friction on day one.',
  },
];

export default function FeaturesPage() {
  return (
    <PublicPageShell heroClassName="flex-1">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-admin-blue-light/50 via-white to-user-green-light/30" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm font-semibold text-admin-blue uppercase tracking-wide mb-2">Features</p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink font-display mb-4">
            Everything you need to run events end-to-end
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl mx-auto">
            EventMS brings planners, vendors, and administrators onto one warm, precise workspace—without losing the human touch.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card border-line p-6 card-hover flex flex-col h-full"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: getColor('admin-blue-light'), color: getColor('admin-blue') }}
              >
                <Icon name={f.icon} className="text-[26px]" />
              </div>
              <h2 className="text-lg font-semibold text-ink mb-2">{f.title}</h2>
              <p className="text-sm text-ink-soft flex-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-ink-soft text-sm mb-4">Ready to explore categories and vendors?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/categories" className="btn-outline">View categories</Link>
            <Link to="/signup/user" className="btn-primary-user">Create user account</Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
