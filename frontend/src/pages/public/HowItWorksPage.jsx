import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Primitives';
import PublicPageShell from './PublicPageShell';
import { getColor } from '../../utils/theme';

const STEPS = [
  { n: 1, title: 'Choose your role', desc: 'Sign in or sign up as a user, vendor, or admin. Each journey is tailored to how you work with events.', icon: 'badge' },
  { n: 2, title: 'Discover & shortlist', desc: 'Users browse categories and vendor storefronts. Compare offerings and add items to the cart with transparent totals.', icon: 'search' },
  { n: 3, title: 'Checkout & coordinate', desc: 'Enter delivery details, pick a payment method, and place the order. Vendors see requests and update status as they fulfill.', icon: 'local_shipping' },
  { n: 4, title: 'Track to completion', desc: 'Follow orders from received through delivered. Admins can review transactions and export reports when needed.', icon: 'task_alt' },
];

export default function HowItWorksPage() {
  return (
    <PublicPageShell heroClassName="flex-1">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-user-green-light/40 via-white to-admin-blue-light/40" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm font-semibold text-user-green-dark uppercase tracking-wide mb-2">How it works</p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink font-display mb-4">
            Four calm steps from idea to delivered event
          </h1>
          <p className="text-lg text-ink-soft">
            Whether you are planning a wedding or running a vendor kitchen, the flow stays simple and visible.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <div className="relative border-l-2 border-line pl-8 ml-3 space-y-12">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <span
                className="absolute -left-[41px] top-1 w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold ring-4 ring-white"
                style={{ backgroundColor: getColor('admin-blue') }}
              >
                {s.n}
              </span>
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: getColor('admin-blue-light'), color: getColor('admin-blue') }}
                >
                  <Icon name={s.icon} className="text-[22px]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-ink mb-2">{s.title}</h2>
                  <p className="text-sm text-ink-soft leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-outline">Back to home</Link>
          <Link to="/signup/user" className="btn-primary-user">Get started as user</Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
