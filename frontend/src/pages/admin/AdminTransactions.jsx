import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderAPI } from '../../api/services';
import { Icon, StatusBadge } from '../../components/ui/Primitives';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { fmtINR } from '../../utils/theme';

export default function AdminTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .all()
      .then(setOrders)
      .catch(() => toast.error('Could not load transactions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-admin-blue-light/60 rounded-xl p-6 mb-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'All Transactions' }]} />
        <h1 className="text-2xl md:text-3xl font-bold text-ink mt-2">All transactions</h1>
        <p className="text-sm text-ink-soft mt-1">
          Every order on the platform: customer, totals, status, and payment method.
        </p>
      </div>

      <div className="card border-admin-blue p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-soft">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-ink-soft">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-soft border-b border-line bg-gray-50">
                  <th className="text-left py-3 px-4">Order #</th>
                  <th className="text-left py-3 px-3">Customer</th>
                  <th className="text-left py-3 px-3">Items</th>
                  <th className="text-right py-3 px-3">Subtotal</th>
                  <th className="text-right py-3 px-3">Total</th>
                  <th className="text-left py-3 px-3">Payment</th>
                  <th className="text-left py-3 px-3">Status</th>
                  <th className="text-left py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-line table-row-hover">
                    <td className="py-3 px-4 font-mono text-sm text-admin-blue font-medium">{o.orderNumber}</td>
                    <td className="py-3 px-3 text-sm">
                      <div className="text-ink font-medium">{o.user?.name || '—'}</div>
                      <div className="text-xs text-ink-soft">{o.user?.email || ''}</div>
                    </td>
                    <td className="py-3 px-3 text-sm text-ink-soft">{o.items?.length ?? 0}</td>
                    <td className="py-3 px-3 text-sm text-right">₹{fmtINR(o.subtotal || 0)}</td>
                    <td className="py-3 px-3 text-sm text-right font-semibold text-ink">₹{fmtINR(o.grandTotal || 0)}</td>
                    <td className="py-3 px-3 text-sm uppercase">{o.paymentMethod || '—'}</td>
                    <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                    <td className="py-3 px-3 text-sm text-ink-soft whitespace-nowrap">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-line flex justify-between items-center text-sm text-ink-soft">
          <span>{orders.length} transaction{orders.length !== 1 ? 's' : ''}</span>
          <Link to="/admin/dashboard" className="text-admin-blue font-medium hover:underline inline-flex items-center gap-1">
            <Icon name="arrow_back" className="text-[18px]" /> Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
