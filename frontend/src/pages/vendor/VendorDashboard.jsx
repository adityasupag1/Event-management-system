import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, orderAPI, requestAPI } from '../../api/services';
import { Icon } from '../../components/ui/Primitives';
import { fmtINR, getColor } from '../../utils/theme';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    productAPI.mine().then(setProducts).catch(() => {});
    orderAPI.vendor().then(setOrders).catch(() => {});
    requestAPI.list().then(setRequests).catch(() => {});
  }, []);

  const pending = orders.filter((o) => ['received', 'ready'].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === 'delivered').length;
  const revenue = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + (o.grandTotal || 0), 0);
  const newRequests = requests.filter((r) => r.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome banner */}
      <div className="bg-vendor-yellow-light/60 rounded-xl px-6 py-5 mb-6">
        <h1 className="text-2xl font-bold text-ink">Welcome, {user?.businessName || user?.name} 👋</h1>
        <p className="text-sm text-ink-soft mt-1">
          You have {pending} pending orders and {newRequests} new request{newRequests !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard color="admin-blue" label="Total Products" value={products.length} icon="inventory_2" />
        <StatCard color="vendor-yellow" label="Pending Orders" value={pending} icon="pending_actions" />
        <StatCard color="user-green" label="Completed Orders" value={completed} icon="check_circle" />
        <StatCard color="user-green" label="Revenue This Month" value={`₹${fmtINR(revenue)}`} icon="payments" />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <FeatureCard to="/vendor/products" icon="grid_view" bg="admin-blue" title="Your Items"
          desc="Manage your existing product catalog, update prices, and track inventory." cta="View Catalog" />
        <FeatureCard to="/vendor/products/new" icon="add_circle" bg="user-green" title="Add New Item"
          desc="List new products or services to offer to event planners and vendors." cta="Create Listing" />
        <FeatureCard to="/vendor/requests" icon="inbox" bg="vendor-yellow" title="Request Items"
          desc="Review custom requests from users and provide quotes or alternatives." cta="Check Inbox" />
        <FeatureCard to="/vendor/orders" icon="receipt_long" bg="cat-catering" title="Transactions"
          desc="View your payment history, generate invoices, and track earnings." cta="View History" />
      </div>

      {/* Recent Activity */}
      <div className="card border-vendor-yellow-dark p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-ink">Recent Activity</h2>
          <Link to="/vendor/orders" className="text-sm font-medium text-admin-blue uppercase">View All</Link>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 3).map((o) => (
            <ActivityItem key={o._id} dotColor="user-green"
              title={`New order #${o.orderNumber} received`}
              subtitle={`${o.items?.length || 0} item(s) from ${o.deliveryDetails?.fullName}.`}
              time={new Date(o.createdAt).toLocaleDateString()} />
          ))}
          {requests.slice(0, 2).map((r) => (
            <ActivityItem key={r._id} dotColor="admin-blue"
              title={`New request: '${r.title}'`}
              subtitle={r.description}
              time={new Date(r.createdAt).toLocaleDateString()} />
          ))}
          {orders.length === 0 && requests.length === 0 && (
            <p className="text-center text-sm text-ink-soft py-8">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, label, value, icon }) {
  return (
    <div
      className="card p-5 flex items-start justify-between"
      style={{ borderColor: getColor(color) }}
    >
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-soft">{label}</div>
        <div className="text-2xl font-bold text-ink mt-1">{value}</div>
      </div>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: getColor(color) + '19',
          color: getColor(color),
        }}
      >
        <Icon name={icon} className="text-[20px]" />
      </div>
    </div>
  );
}

function FeatureCard({ to, icon, bg, title, desc, cta }) {
  return (
    <Link to={to} className="card card-hover border-vendor-yellow-dark p-5 block">
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-3"
        style={{
          backgroundColor: getColor(bg) + '26',
          color: getColor(bg),
        }}
      >
        <Icon name={icon} className="text-[22px]" />
      </div>
      <h3 className="font-semibold text-ink mb-1">{title}</h3>
      <p className="text-xs text-ink-soft line-clamp-2 mb-3">{desc}</p>
      <span className="text-sm text-admin-blue font-medium flex items-center gap-1">
        {cta} <Icon name="arrow_forward" className="text-[16px]" />
      </span>
    </Link>
  );
}

function ActivityItem({ dotColor, title, subtitle, time }) {
  return (
    <div className="flex gap-3 border-l-2 border-line pl-4 py-1">
      <span
        className="w-2 h-2 rounded-full mt-2 -ml-[21px]"
        style={{ backgroundColor: getColor(dotColor) }}
      />
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="font-medium text-ink text-sm">{title}</div>
          <div className="text-xs text-ink-mute whitespace-nowrap">{time}</div>
        </div>
        <p className="text-xs text-ink-soft mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
