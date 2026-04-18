import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { vendorAPI, productAPI } from '../../api/services';
import { useCart } from '../../context/CartContext';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';
import { Icon, StatusBadge, Chip } from '../../components/ui/Primitives';
import { CATEGORY_THEME, fmtINR, getColor } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function VendorProducts() {
  const { user } = useAuth();
  const { vendorId } = useParams();
  const nav = useNavigate();
  const { addItem } = useCart();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [qty, setQty] = useState({});

  useEffect(() => {
    vendorAPI.get(vendorId).then(setVendor).catch(() => {});
    productAPI.list({ vendor: vendorId }).then(setProducts).catch(() => {});
  }, [vendorId]);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (p) => {
    try {
      await addItem(p._id, qty[p._id] || 1);
      toast.success(`Added to cart! ${p.name} × ${qty[p._id] || 1}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add');
    }
  };

  if (!vendor) return <div className="p-6 text-center text-ink-soft">Loading…</div>;

  const theme = CATEGORY_THEME[vendor.category];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <Breadcrumbs items={[
        { label: 'Home', to: '/user/dashboard' },
        { label: 'Vendors', to: '/user/vendors' },
        { label: vendor.category, to: `/user/vendors/${vendor.category}` },
        { label: vendor.businessName || vendor.name },
      ]} />

      <div className="mb-4 max-w-2xl">
        <UserMembershipCallout user={user} variant="compact" />
      </div>

      {/* Vendor hero */}
      <div className="bg-white rounded-xl overflow-hidden shadow-card mb-6">
        <div
          className="h-32"
          style={{
            background: `linear-gradient(to bottom right, ${getColor(theme.color)}, ${getColor(theme.color)}99)`,
          }}
        />
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-5 -mt-10">
          <div className={`w-20 h-20 rounded-xl bg-ink text-white flex items-center justify-center font-bold text-lg shadow-card`}>
            {(vendor.businessName || vendor.name).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-ink">{vendor.businessName || vendor.name}</h1>
              <Chip category={vendor.category} />
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-soft mt-1">
              <span className="flex items-center gap-1">
                <Icon name="star" className="text-[16px] text-vendor-yellow" />
                {vendor.rating?.toFixed?.(1) || '—'} ({vendor.totalReviews || 0} Reviews)
              </span>
              <span>·</span>
              <span>{vendor.description}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/user/vendors/${vendor.category}`} className="btn-text text-admin-blue">
              Back to Vendors
            </Link>
            <button className="btn-outline">Contact Vendor</button>
          </div>
        </div>
      </div>

      {/* Search + count */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="input-icon-wrap min-w-[240px] flex-1 max-w-sm">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder="Search products..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="text-sm text-ink-soft flex items-center gap-4">
          <span>{filtered.length} products available</span>
          <select className="input py-2 text-sm">
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <article key={p._id} className={`card card-hover border-${theme.color} overflow-hidden`}>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center text-ink-soft">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <Icon name="image" className="text-[40px] text-ink-mute" />
              )}
              <button className="absolute top-2 right-2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                <Icon name="favorite_border" className="text-[20px] text-ink" />
              </button>
              <div className="absolute bottom-2 left-2">
                <StatusBadge status={p.status} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-ink text-sm leading-tight mb-1 line-clamp-1">{p.name}</h3>
              <p className="text-xs text-ink-soft line-clamp-2 mb-3 min-h-[32px]">{p.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-user-green">₹{fmtINR(p.price)}/-</div>
                {p.status !== 'out_of_stock' && (
                  <div className="flex items-center bg-gray-100 rounded-full">
                    <button onClick={() => setQty({ ...qty, [p._id]: Math.max(1, (qty[p._id] || 1) - 1) })}
                      className="w-7 h-7 rounded-full hover:bg-gray-200 text-ink">−</button>
                    <span className="w-8 text-center text-sm">{qty[p._id] || 1}</span>
                    <button onClick={() => setQty({ ...qty, [p._id]: (qty[p._id] || 1) + 1 })}
                      className="w-7 h-7 rounded-full hover:bg-gray-200 text-ink">+</button>
                  </div>
                )}
              </div>
              {p.status === 'out_of_stock' ? (
                <button disabled className="btn-outline w-full opacity-50">Notify When Available</button>
              ) : (
                <button onClick={() => handleAdd(p)} className="btn-primary-user w-full">
                  <Icon name="shopping_cart" className="text-[18px]" />
                  Add to Cart
                </button>
              )}
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-ink-soft">No products found.</div>
        )}
      </div>
    </div>
  );
}
