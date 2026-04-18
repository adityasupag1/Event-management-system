import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderAPI } from '../../api/services';
import { Icon } from '../../components/ui/Primitives';
import { fmtINR } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const STATUS_OPTIONS = [
  { key: 'received', label: 'Received', desc: 'Order has been acknowledged.', icon: 'inbox', color: 'admin-blue' },
  { key: 'ready', label: 'Ready for Shipping', desc: 'Items are packed and ready.', icon: 'inventory_2', color: 'vendor-yellow' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Package is on the way.', icon: 'local_shipping', color: 'user-green' },
  { key: 'delivered', label: 'Delivered', desc: 'Order successfully delivered.', icon: 'home', color: 'user-green' },
];

export default function UpdateOrderStatus() {
  const { orderId } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    orderAPI.get(orderId).then((o) => {
      setOrder(o);
      setSelected(o.status);
    }).catch(() => {});
  }, [orderId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (selected === order.status && !note) return toast.error('No change to save');
    setLoading(true);
    try {
      await orderAPI.updateStatus(orderId, selected, note);
      toast.success('Status updated');
      nav('/vendor/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div className="p-6 text-center text-ink-soft">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[
        { label: 'Home', to: '/vendor/dashboard' },
        { label: 'Product Status', to: '/vendor/orders' },
        { label: `Update Order #${order.orderNumber}` },
      ]} />

      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-6">Update Order Status</h1>

      <div className="card border-vendor-yellow-dark overflow-hidden">
        {/* Order header */}
        <div className="bg-admin-blue-light/40 p-5 flex flex-wrap justify-between gap-3">
          <div>
            <div className="text-xs text-admin-blue uppercase tracking-wider">Order ID</div>
            <div className="text-xl font-bold text-ink">#{order.orderNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-ink-soft uppercase tracking-wider">Total Amount</div>
            <div className="text-xl font-bold text-ink">₹{fmtINR(order.grandTotal)}/-</div>
          </div>
        </div>

        <div className="p-5 flex items-center gap-3 border-b border-line">
          <div className="w-10 h-10 rounded-full bg-user-green text-white flex items-center justify-center font-semibold">
            {order.deliveryDetails?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <div className="text-xs text-ink-soft">Customer</div>
            <div className="font-medium text-ink">{order.deliveryDetails?.fullName}</div>
          </div>
          <span className="text-sm text-admin-blue flex items-center gap-1">
            {order.items?.length || 0} items <Icon name="open_in_new" className="text-[16px]" />
          </span>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <h2 className="font-semibold text-ink mb-4">Select Current Status</h2>
          <div className="space-y-3 mb-5">
            {STATUS_OPTIONS.map((opt) => {
              const active = selected === opt.key;
              return (
                <label key={opt.key}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    active ? `border-${opt.color} bg-${opt.color}/10` : 'border-line bg-white hover:border-ink-mute'
                  }`}>
                  <div className={`w-10 h-10 rounded-full bg-${opt.color}/15 text-${opt.color} flex items-center justify-center`}>
                    <Icon name={opt.icon} className="text-[20px]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-ink">{opt.label}</div>
                    <div className="text-xs text-ink-soft">{opt.desc}</div>
                  </div>
                  <input type="radio" name="status" value={opt.key} checked={active}
                    onChange={() => setSelected(opt.key)}
                    className={`w-5 h-5 accent-${opt.color}`} />
                </label>
              );
            })}
          </div>

          <div className="mb-5">
            <label className="label">Note to Customer (Optional)</label>
            <textarea className="input min-h-[100px]" placeholder="Add any details about shipping or delays..."
              value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button type="button" onClick={() => nav('/vendor/orders')} className="btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary-vendor">
              {loading ? 'Updating…' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
