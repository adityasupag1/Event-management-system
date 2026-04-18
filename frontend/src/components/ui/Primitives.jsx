// Reusable UI primitives used across pages
import { Link } from 'react-router-dom';

export const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
    {name}
  </span>
);

export const Logo = ({ className = 'text-lg' }) => (
  <Link to="/" className={`flex items-center gap-2 font-semibold text-ink ${className}`}>
    <span className="grid grid-cols-2 gap-0.5 w-5 h-5">
      <span className="bg-admin-blue rounded-sm" />
      <span className="bg-cat-catering rounded-sm" />
      <span className="bg-vendor-yellow rounded-sm" />
      <span className="bg-user-green rounded-sm" />
    </span>
    <span className="font-display">EventMS</span>
  </Link>
);

export const Chip = ({ category, children }) => {
  const map = {
    Catering: 'chip-catering',
    Florist: 'chip-florist',
    Decoration: 'chip-decoration',
    Lighting: 'chip-lighting',
  };
  return <span className={map[category] || 'chip'}>{children || category}</span>;
};

export const StatusBadge = ({ status }) => {
  const map = {
    active: ['text-user-green bg-user-green-light', 'Active'],
    inactive: ['text-ink-soft bg-gray-100', 'Inactive'],
    suspended: ['text-cat-catering bg-cat-catering-light', 'Suspended'],
    pending: ['text-vendor-yellow-dark bg-vendor-yellow-light', 'Pending'],
    expired: ['text-cat-catering bg-cat-catering-light', 'Expired'],
    in_stock: ['text-user-green bg-user-green-light', 'In Stock'],
    low_stock: ['text-vendor-yellow-dark bg-vendor-yellow-light', 'Low Stock'],
    out_of_stock: ['text-ink-soft bg-gray-200', 'Out of Stock'],
    received: ['text-admin-blue bg-admin-blue-light', 'Received'],
    ready: ['text-vendor-yellow-dark bg-vendor-yellow-light', 'Ready for Shipping'],
    out_for_delivery: ['text-user-green bg-user-green-light', 'Out for Delivery'],
    delivered: ['text-user-green bg-user-green-light', 'Delivered'],
    cancelled: ['text-cat-catering bg-cat-catering-light', 'Cancelled'],
    new: ['text-cat-catering bg-cat-catering-light', 'NEW'],
    in_progress: ['text-vendor-yellow-dark bg-vendor-yellow-light', 'IN PROGRESS'],
    fulfilled: ['text-user-green bg-user-green-light', 'FULFILLED'],
    rejected: ['text-ink-soft bg-gray-200', 'REJECTED'],
  };
  const [cls, text] = map[status] || ['text-ink-soft bg-gray-100', status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
};

export const Spinner = ({ className = '' }) => (
  <span
    className={`inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
  />
);

export const EmptyState = ({ icon = 'inbox', title, message }) => (
  <div className="text-center py-12">
    <Icon name={icon} className="text-5xl text-ink-mute mb-3" />
    <h3 className="text-ink mb-1">{title}</h3>
    {message && <p className="text-ink-soft text-sm">{message}</p>}
  </div>
);
