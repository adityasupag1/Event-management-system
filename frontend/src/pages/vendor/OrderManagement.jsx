import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../api/services';
import { Icon, StatusBadge } from '../../components/ui/Primitives';
import { fmtINR } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { orderAPI.vendor().then(setOrders).catch(() => {}); }, []);

  const countByStatus = (s) => orders.filter((o) => o.status === s).length;

  const filtered = orders
    .filter((o) => filter === 'all' || o.status === filter)
    .filter((o) =>
      !search ||
      o.orderNumber.includes(search) ||
      o.deliveryDetails?.fullName?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-vendor-yellow-light/60 rounded-xl p-6 mb-6 border-l-4 border-vendor-yellow-dark">
        <Breadcrumbs items={[{ label: 'Home', to: '/vendor/dashboard' }, { label: 'Product Status' }]} />
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-3">
          Order Management
          <span className="bg-cat-catering text-white text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center">
            {countByStatus('received')}
          </span>
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatusStatCard color="vendor-yellow" label="New Orders" count={countByStatus('received')} icon="inventory" />
        <StatusStatCard color="admin-blue" label="Received" count={countByStatus('received')} icon="inbox" />
        <StatusStatCard color="vendor-yellow" label="Ready for Shipping" count={countByStatus('ready')} icon="local_shipping" />
        <StatusStatCard color="user-green" label="Out for Delivery" count={countByStatus('out_for_delivery')} icon="pedal_bike" />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="input-icon-wrap flex-1 min-w-[200px]">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder="Search by customer name, email, order ID..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { k: 'all', l: 'All' },
            { k: 'received', l: 'Received' },
            { k: 'ready', l: 'Ready for Shipping' },
            { k: 'out_for_delivery', l: 'Out for Delivery' },
            { k: 'delivered', l: 'Delivered' },
          ].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                filter === f.k ? 'bg-vendor-yellow-dark text-white' : 'bg-gray-100 text-ink-soft'
              }`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="card border-vendor-yellow-dark overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-ink-soft">No orders found.</div>
        ) : (
          <>
            <table className="hidden md:table w-full">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-soft border-b border-line">
                  <th className="text-left py-3 px-5">Order ID</th>
                  <th className="text-left py-3 px-3">Customer</th>
                  <th className="text-left py-3 px-3">Email</th>
                  <th className="text-left py-3 px-3">Items</th>
                  <th className="text-left py-3 px-3">Total</th>
                  <th className="text-left py-3 px-3">Status</th>
                  <th className="text-left py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id} className="border-b border-line table-row-hover">
                    <td className="py-4 px-5 text-admin-blue font-medium">#{o.orderNumber}</td>
                    <td className="py-4 px-3 font-medium text-ink text-sm">{o.deliveryDetails?.fullName}</td>
                    <td className="py-4 px-3 text-sm text-ink-soft">{o.deliveryDetails?.email}</td>
                    <td className="py-4 px-3">
                      <span className="bg-admin-blue-light text-admin-blue text-xs px-2 py-0.5 rounded-full">
                        {o.items?.length || 0} items
                      </span>
                    </td>
                    <td className="py-4 px-3 font-semibold text-user-green text-sm">₹{fmtINR(o.grandTotal)}/-</td>
                    <td className="py-4 px-3"><StatusBadge status={o.status} /></td>
                    <td className="py-4 px-3">
                      <Link to={`/vendor/orders/${o._id}/update`} className="btn-outline text-xs py-1.5">Update</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden divide-y divide-line">
              {filtered.map((o) => (
                <div key={o._id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-admin-blue font-semibold">#{o.orderNumber}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-sm font-medium text-ink">{o.deliveryDetails?.fullName}</div>
                  <div className="text-xs text-ink-soft">{o.deliveryDetails?.email}</div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-semibold text-user-green">₹{fmtINR(o.grandTotal)}/-</span>
                    <Link to={`/vendor/orders/${o._id}/update`} className="btn-outline text-xs py-1.5">Update</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusStatCard({ color, label, count, icon }) {
  return (
    <div className={`card border-${color} p-5 flex items-start justify-between`}>
      <div>
        <div className="text-sm text-ink-soft">{label}</div>
        <div className="text-2xl font-bold text-ink mt-1">{count}</div>
      </div>
      <div className={`w-10 h-10 rounded-full bg-${color}/15 text-${color} flex items-center justify-center`}>
        <Icon name={icon} className="text-[20px]" />
      </div>
    </div>
  );
}
