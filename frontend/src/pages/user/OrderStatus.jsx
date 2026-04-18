import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../api/services';
import { Icon, StatusBadge } from '../../components/ui/Primitives';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';
import { fmtINR } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const STEPS = [
  { key: 'received', label: 'Received', icon: 'inventory_2' },
  { key: 'ready', label: 'Ready', icon: 'check_circle' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'local_shipping' },
  { key: 'delivered', label: 'Delivered', icon: 'home' },
];

export default function OrderStatus() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => orderAPI.mine().then(setOrders).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id);
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.orderNumber.includes(search)) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-user-green-light/60 rounded-xl p-6 mb-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/user/dashboard' }, { label: 'Order Status' }]} />
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-3">
          My Orders
          <span className="bg-user-green text-white text-sm font-medium px-3 py-1 rounded-full">
            {orders.length} TOTAL
          </span>
        </h1>
        <div className="mt-4 max-w-xl">
          <UserMembershipCallout user={user} variant="compact" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="input-icon-wrap flex-1 min-w-[200px]">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder="Search by order ID, vendor name..."
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.k ? 'bg-user-green text-white' : 'bg-gray-100 text-ink-soft hover:bg-gray-200'
              }`}>{f.l}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card border-user-green p-12 text-center">
          <Icon name="receipt_long" className="text-[56px] text-ink-mute mb-3" />
          <h3 className="text-ink font-semibold">No orders yet</h3>
          <p className="text-sm text-ink-soft mb-4">Start shopping to see orders here.</p>
          <Link to="/user/vendors" className="btn-primary-user inline-flex">Browse Vendors</Link>
        </div>
      )}

      {/* Orders */}
      <div className="space-y-5">
        {filtered.map((o) => {
          const stepIdx = STEPS.findIndex((s) => s.key === o.status);
          const canCancel = !['delivered', 'out_for_delivery', 'cancelled'].includes(o.status);
          return (
            <div key={o._id} className="card border-user-green p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-ink text-lg">Order #{o.orderNumber}</h3>
                  <p className="text-xs text-ink-soft">
                    Placed {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-ink mb-1">Customer Details</div>
                  <div className="text-sm text-ink-soft">
                    {o.deliveryDetails?.fullName}<br />
                    {o.deliveryDetails?.email}<br />
                    {o.deliveryDetails?.address}, {o.deliveryDetails?.city}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-right flex flex-col items-end justify-center">
                  <div className="text-sm text-ink-soft">Total Amount</div>
                  <div className="text-2xl font-bold text-user-green">₹{fmtINR(o.grandTotal)}/-</div>
                </div>
              </div>

              {/* Tracker */}
              {o.status !== 'cancelled' ? (
                <div className="relative py-4">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-line" />
                  <div className="absolute left-0 top-1/2 h-0.5 bg-user-green transition-all duration-500"
                    style={{ width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }} />
                  <div className="relative flex justify-between">
                    {STEPS.map((s, i) => {
                      const done = i <= stepIdx;
                      const active = i === stepIdx;
                      return (
                        <div key={s.key} className="flex flex-col items-center gap-2 z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            done ? 'bg-user-green text-white' : 'bg-gray-200 text-ink-mute'
                          } ${active ? 'ring-4 ring-user-green-light animate-pulse' : ''}`}>
                            <Icon name={done ? 'check' : s.icon} className="text-[18px]" />
                          </div>
                          <span className={`text-xs ${done ? 'text-ink font-medium' : 'text-ink-soft'}`}>{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-cat-catering font-medium">
                  <Icon name="cancel" className="text-[18px]" /> This order was cancelled
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-line">
                <button className="text-admin-blue font-medium text-sm">View Details</button>
                <div className="flex gap-2">
                  {canCancel && (
                    <button onClick={() => handleCancel(o._id)} className="text-cat-catering font-medium text-sm">
                      Cancel Order
                    </button>
                  )}
                  <button className="btn-outline text-sm py-2">
                    {o.status === 'delivered' ? 'Reorder' : 'Track Order'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
