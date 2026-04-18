import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vendorAPI } from '../../api/services';
import { Icon } from '../../components/ui/Primitives';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';
import { CATEGORY_THEME, fmtINR, getColor } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const CATS = ['Catering', 'Florist', 'Decoration', 'Lighting'];

export default function VendorList() {
  const { user } = useAuth();
  const { category } = useParams();
  const nav = useNavigate();
  const [active, setActive] = useState(category || 'Catering');
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    vendorAPI.list({ category: active }).then(setVendors).catch(() => {});
  }, [active]);

  const theme = CATEGORY_THEME[active];

  const filtered = vendors
    .filter((v) =>
      !search ||
      (v.businessName || v.name).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (sort === 'rating' ? (b.rating || 0) - (a.rating || 0) : 0));

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/user/dashboard' }, { label: 'Vendors' }, { label: active }]} />

      <div className="mb-4 max-w-2xl">
        <UserMembershipCallout user={user} variant="compact" />
      </div>

      {/* Category header card */}
      <div
        className="card p-6 mb-6"
        style={{
          backgroundColor: getColor(theme.light),
          borderColor: getColor(theme.color),
          borderWidth: '1px',
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-card"
              style={{ color: getColor(theme.color) }}
            >
              <Icon name={theme.icon} className="text-[28px]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-ink">{active} Vendors</h1>
              <p className="text-sm text-ink-soft mt-1 max-w-lg">
                Discover premium {active.toLowerCase()} services for your next event.
              </p>
            </div>
          </div>
          <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-card flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getColor(theme.color) }}
            />
            {filtered.length} Available
          </span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="input-icon-wrap flex-1 min-w-[240px]">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder={`Search within ${active}...`}
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => {
            const t = CATEGORY_THEME[c];
            const isActive = active === c;
            return (
              <button key={c}
                onClick={() => { setActive(c); nav(`/user/vendors/${c}`); }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={isActive ? {
                  backgroundColor: getColor(t.light),
                  color: getColor(t.color),
                } : {
                  backgroundColor: '#f3f3f3',
                  color: '#80868b',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="input pr-10 appearance-none text-sm min-w-[140px]">
            <option value="rating">Sort by: Rating</option>
            <option value="name">Sort by: Name</option>
          </select>
          <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none" />
        </div>
      </div>

      {/* Vendor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((v) => (
          <article
            key={v._id}
            className="card card-hover overflow-hidden"
            style={{ borderColor: getColor(theme.color) }}
          >
            <div
              className="aspect-[4/3] relative flex items-center justify-center text-white font-semibold text-lg"
              style={{
                background: `linear-gradient(to bottom right, ${getColor(theme.color)}, ${getColor(theme.color)}99)`,
              }}
            >
              <span
                className={`absolute top-3 left-3 chip-${active.toLowerCase()} bg-white/95`}
              >
                <Icon name={theme.icon} className="text-[14px]" />{active.toUpperCase()}
              </span>
              {v.businessName || v.name}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-ink">{v.businessName || v.name}</h3>
                <span className="text-sm flex items-center gap-0.5 bg-gray-100 rounded px-2 py-0.5">
                  <Icon name="star" className="text-[14px] text-vendor-yellow" />
                  {v.rating?.toFixed?.(1) || '—'}
                </span>
              </div>
              <p className="text-sm text-ink-soft mt-2 line-clamp-2">{v.description || '—'}</p>
              {v.productCount > 0 && (
                <p className="text-xs text-ink-mute mt-3 flex items-center gap-1">
                  <Icon name="inventory_2" className="text-[16px]" />
                  {v.productCount} products
                </p>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t border-line">
                <button className="btn-outline flex-1">Contact</button>
                <Link to={`/user/vendor/${v._id}`} className="btn-primary-user flex-1">View Menu</Link>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-ink-soft">No vendors found.</div>
        )}
      </div>
    </div>
  );
}
