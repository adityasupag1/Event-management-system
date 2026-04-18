import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { vendorAPI, orderAPI } from '../../api/services';
import { Icon } from '../../components/ui/Primitives';
import { CATEGORY_THEME, fmtINR, getColor } from '../../utils/theme';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';

export default function UserDashboard() {
  const { user } = useAuth();
  const { itemCount, subtotal } = useCart();
  const [counts, setCounts] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    vendorAPI.categoryCounts().then(setCounts).catch(() => {});
    vendorAPI.list().then((v) => setTopVendors(v.slice(0, 3))).catch(() => {});
    orderAPI.mine().then((o) => setOrderCount(o.filter((x) => x.status !== 'delivered' && x.status !== 'cancelled').length)).catch(() => {});
  }, []);

  const cats = ['Catering', 'Florist', 'Decoration', 'Lighting'];
  const countMap = Object.fromEntries(counts.map((c) => [c.category, c.count]));

  return (
    <div className="page-enter">
      {/* Welcome banner */}
      <section className="bg-user-green-light/60 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">Welcome, {user?.name} 👋</h1>
            <p className="text-sm text-ink-soft mt-1">What are you planning today?</p>
            <div className="mt-3 max-w-xl">
              <UserMembershipCallout user={user} />
            </div>
          </div>
          <div className="w-full md:w-[420px] relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-line text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-user-green"
              placeholder="Search vendors, products, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Browse by Category */}
        <h2 className="text-lg font-semibold text-ink mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cats.map((c) => {
            const t = CATEGORY_THEME[c];
            return (
              <Link
                key={c}
                to={`/user/vendors/${c}`}
                className="card card-hover p-5 block"
                style={{
                  borderColor: getColor(t.color),
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: getColor(t.light),
                    color: getColor(t.color),
                  }}
                >
                  <Icon name={t.icon} className="text-[24px]" />
                </div>
                <h3 className="font-semibold text-ink">{c}</h3>
                <p className="text-xs text-ink-soft mt-1">
                  {c === 'Catering' && 'Food, drinks and menus'}
                  {c === 'Florist' && 'Bouquets and arrangements'}
                  {c === 'Decoration' && 'Theme and setup'}
                  {c === 'Lighting' && 'Ambience and effects'}
                </p>
                <span className="inline-block mt-3 text-xs bg-gray-100 rounded-full px-3 py-1 text-ink-soft">
                  {countMap[c] || 0} vendors
                </span>
              </Link>
            );
          })}
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <QuickCard to="/user/cart" color="user-green" icon="shopping_cart" title="My Cart"
            subtitle={`${itemCount} items · ₹${fmtINR(subtotal)}`} />
          <QuickCard to="/user/dashboard" color="vendor-yellow" icon="group" title="Guest List" subtitle="12 guests added" />
          <QuickCard to="/user/orders" color="admin-blue" icon="receipt_long" title="Order Status"
            subtitle={`${orderCount} active orders`} />
        </div>

        {/* Top-rated vendors */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink mb-4">Top-rated vendors for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topVendors.map((v) => (
              <Link key={v._id} to={`/user/vendor/${v._id}`} className="block group">
                <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-ink to-ink-soft mb-3 flex items-center justify-center text-white text-lg font-semibold overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform">{v.businessName || v.name}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-ink">{v.businessName || v.name}</h3>
                  <span className="text-sm flex items-center gap-0.5 text-ink">
                    <Icon name="star" className="text-[16px] text-vendor-yellow" />
                    {v.rating?.toFixed?.(1) || '—'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className={`chip-${v.category?.toLowerCase()}`}>{v.category}</span>
                </div>
                <span className="text-sm text-admin-blue font-medium">View details</span>
              </Link>
            ))}
            {topVendors.length === 0 && (
              <p className="col-span-full text-sm text-ink-soft text-center py-8">No vendors yet — seed the database.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ to, color, icon, title, subtitle }) {
  return (
    <Link to={to} className="card card-hover p-5 flex items-center gap-4"
      style={{
        borderColor: getColor(color),
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: getColor(color) + '20',
          color: getColor(color),
        }}
      >
        <Icon name={icon} className="text-[24px]" />
      </div>
      <div>
        <div className="font-semibold text-ink">{title}</div>
        <div className="text-sm text-ink-soft">{subtitle}</div>
      </div>
    </Link>
  );
}
