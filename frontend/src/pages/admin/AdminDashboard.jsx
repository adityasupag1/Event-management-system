import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI, orderAPI } from '../../api/services';
import { Icon } from '../../components/ui/Primitives';
import { fmtINR, getColor } from '../../utils/theme';

function csvCell(v) {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reporting, setReporting] = useState(false);

  useEffect(() => { adminAPI.stats().then(setStats).catch(() => {}); }, []);

  const downloadPlatformReport = useCallback(async () => {
    setReporting(true);
    try {
      const [s, orders] = await Promise.all([adminAPI.stats(), orderAPI.all()]);
      const rows = [];
      rows.push('EventMS — Platform report');
      rows.push(`Generated (UTC),${new Date().toISOString()}`);
      rows.push('');
      rows.push('Summary');
      rows.push(
        'Description,"Generate comprehensive reports on user growth, vendor sales, and platform revenue."',
      );
      rows.push('');
      rows.push('User growth');
      rows.push(`Total registered users,${s.totalUsers ?? 0}`);
      rows.push(`Total registered vendors,${s.totalVendors ?? 0}`);
      rows.push('');
      rows.push('Platform revenue & orders');
      rows.push(`Delivered orders (count),${s.completedOrders ?? 0}`);
      rows.push(`All orders (count),${s.totalOrders ?? 0}`);
      rows.push(`Active pipeline orders,${s.activeOrders ?? 0}`);
      rows.push(`Revenue from delivered orders (INR),${s.revenue ?? 0}`);
      rows.push('');
      rows.push('Order transactions (detail)');
      rows.push(
        [
          'OrderNumber',
          'CustomerName',
          'CustomerEmail',
          'Subtotal',
          'DeliveryFee',
          'Tax',
          'GrandTotal',
          'Status',
          'PaymentMethod',
          'CreatedAt',
        ].join(','),
      );
      for (const o of orders) {
        rows.push(
          [
            csvCell(o.orderNumber),
            csvCell(o.user?.name),
            csvCell(o.user?.email),
            o.subtotal ?? '',
            o.deliveryFee ?? '',
            o.tax ?? '',
            o.grandTotal ?? '',
            csvCell(o.status),
            csvCell(o.paymentMethod),
            csvCell(o.createdAt ? new Date(o.createdAt).toISOString() : ''),
          ].join(','),
        );
      }
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eventms-platform-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch {
      toast.error('Could not generate report');
    } finally {
      setReporting(false);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-br from-admin-blue-light to-admin-blue-light/50 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-20">
          <Icon name="shield" className="text-[80px] text-admin-blue" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-ink relative">Welcome, Admin 👋</h1>
        <p className="text-sm text-ink-soft mt-1 relative">System overview and quick management access.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Users" value={stats?.totalUsers ?? 0} delta="+12%" icon="group" color="user-green" />
        <KPICard label="Total Vendors" value={stats?.totalVendors ?? 0} delta="+5%" icon="storefront" color="vendor-yellow" />
        <KPICard label="Active Orders" value={stats?.activeOrders ?? 0} sub="Across 12 regions" icon="local_shipping" color="admin-blue" />
        <KPICard label="Revenue This Month" value={`₹${fmtINR(stats?.revenue ?? 0)}`} delta="+18%" icon="payments" color="cat-catering" />
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MgmtCard to="/admin/users" title="Maintain User" color="user-green" icon="person"
          desc="Manage user accounts, roles, permissions, and monitor user activity across the platform."
          actions={['Add', 'Update', 'Memberships']} />
        <MgmtCard to="/admin/vendors" title="Maintain Vendor" color="vendor-yellow-dark" icon="storefront"
          desc="Onboard new vendors, manage store details, review performance, and handle payouts."
          actions={['Add', 'Manage', 'Reviews']} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card border-admin-blue p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-lg bg-admin-blue-light text-admin-blue flex items-center justify-center">
              <Icon name="receipt_long" className="text-[22px]" />
            </div>
            <h3 className="text-lg font-semibold text-ink mt-1">Transactions</h3>
          </div>
          <p className="text-sm text-ink-soft mb-4">Review financial transactions, issue refunds, and monitor payment gateway status.</p>
          <Link to="/admin/transactions" className="btn-primary-admin w-full inline-flex items-center justify-center gap-2">
            View All Transactions <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
        <div className="card border-cat-catering p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-lg bg-cat-catering-light text-cat-catering flex items-center justify-center">
              <Icon name="bar_chart" className="text-[22px]" />
            </div>
            <h3 className="text-lg font-semibold text-ink mt-1">Reports</h3>
          </div>
          <p className="text-sm text-ink-soft mb-4">Generate comprehensive reports on user growth, vendor sales, and platform revenue.</p>
          <button
            type="button"
            disabled={reporting}
            onClick={downloadPlatformReport}
            className="btn-outline w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {reporting ? 'Preparing…' : 'Generate New Report'} <Icon name="download" className="text-[18px]" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card border-admin-blue p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-ink">Recent Activity</h2>
          <Link to="/admin/transactions" className="text-sm text-admin-blue font-medium">View All</Link>
        </div>
        <div className="space-y-4 relative border-l-2 border-line pl-5 ml-3">
          {(stats?.recent || []).map((o, i) => {
            const colors = ['user-green', 'vendor-yellow-dark', 'admin-blue', 'cat-catering'];
            return (
            <div key={o._id} className="relative">
              <span
                className="absolute -left-[29px] top-1 w-4 h-4 rounded-full ring-4 ring-white"
                style={{ backgroundColor: getColor(colors[i % 4]) }}
              />
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-ink text-sm">New Order #{o.orderNumber}</div>
                  <p className="text-xs text-ink-soft">₹{fmtINR(o.grandTotal)} from {o.user?.name || 'Customer'}</p>
                </div>
                <span className="text-xs text-ink-mute whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
          })}
          {(!stats?.recent || stats.recent.length === 0) && (
            <p className="text-sm text-ink-soft text-center py-6">No recent activity.</p>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-card p-4 mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-ink">
          <Icon name="shield" className="text-[20px] text-admin-blue" />
          System Status: <span className="text-user-green">Operational</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink-soft">
          {['Server', 'Database', 'Payments', 'Email Delivery'].map((s, i) => {
            const colors = ['user-green', 'user-green', 'admin-blue', 'vendor-yellow'];
            return (
            <span key={s} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getColor(colors[i]) }}
              />
              {s}
            </span>
          );
          })}
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, delta, sub, icon, color }) {
  return (
    <div className="card border-admin-blue p-5 flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-soft">{label}</div>
        <div className="text-2xl font-bold text-ink mt-1">{value}</div>
        {delta && (
          <div className="text-xs text-user-green mt-1 flex items-center gap-0.5">
            <Icon name="arrow_upward" className="text-[14px]" />{delta} vs last month
          </div>
        )}
        {sub && <div className="text-xs text-ink-soft mt-1">{sub}</div>}
      </div>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: getColor(color) + '26',
          color: getColor(color),
        }}
      >
        <Icon name={icon} className="text-[20px]" />
      </div>
    </div>
  );
}

function MgmtCard({ to, title, color, icon, desc, actions }) {
  return (
    <div
      className="card p-6"
      style={{ borderColor: getColor(color) }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: getColor(color) + '26',
            color: getColor(color),
          }}
        >
          <Icon name={icon} className="text-[22px]" />
        </div>
        <h3 className="text-lg font-semibold text-ink mt-1">{title}</h3>
      </div>
      <p className="text-sm text-ink-soft mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <Link key={a} to={to} className="btn-outline text-xs py-2">{a}</Link>
        ))}
      </div>
    </div>
  );
}
