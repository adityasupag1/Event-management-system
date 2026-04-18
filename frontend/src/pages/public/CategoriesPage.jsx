import { Link } from 'react-router-dom';
import { Icon, Chip } from '../../components/ui/Primitives';
import PublicPageShell from './PublicPageShell';
import { CATEGORY_THEME, getColor, getThemeStyles } from '../../utils/theme';

const CATS = ['Catering', 'Florist', 'Decoration', 'Lighting'];

export default function CategoriesPage() {
  return (
    <PublicPageShell heroClassName="flex-1">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-admin-blue-light/40 via-white to-vendor-yellow-light/30" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm font-semibold text-vendor-yellow-dark uppercase tracking-wide mb-2">Categories</p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink font-display mb-4">
            Four pillars of unforgettable events
          </h1>
          <p className="text-lg text-ink-soft">
            Every category is represented by vetted partners. Sign in as a user to browse live vendor lists and products.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CATS.map((name) => {
            const t = CATEGORY_THEME[name];
            return (
              <div
                key={name}
                className="card overflow-hidden border-2 card-hover flex flex-col h-full"
                style={{ ...getThemeStyles(t), borderColor: getColor(t.color) }}
              >
                <div
                  className="h-24 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${getColor(t.color)}22, ${getColor(t.color)}44)` }}
                >
                  <Icon name={t.icon} className="text-[40px]" style={{ color: getColor(t.color) }} />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-3"><Chip category={name} /></div>
                  <p className="text-sm text-ink-soft flex-1 leading-relaxed">
                    {name === 'Catering' && 'Menus, tastings, and service styles for receptions and corporate gatherings.'}
                    {name === 'Florist' && 'Bouquets, centerpieces, and installations matched to your palette and season.'}
                    {name === 'Decoration' && 'Draping, signage, and ambience that transform venues into branded experiences.'}
                    {name === 'Lighting' && 'Ambient, accent, and stage lighting to set mood and highlight every moment.'}
                  </p>
                  <p className="text-xs text-ink-mute mt-4">Browse vendors after you sign in.</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center space-y-4">
          <p className="text-sm text-ink-soft">Already have an account?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/login/user" className="btn-outline">Log in as user</Link>
            <Link to="/signup/user" className="btn-primary-user">Create account</Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
