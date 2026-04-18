import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Icon } from '../../components/ui/Primitives';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';
import { fmtINR } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function Cart() {
  const { user } = useAuth();
  const { cart, itemCount, subtotal, updateItem, removeItem, clear } = useCart();
  const nav = useNavigate();

  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + deliveryFee + tax;

  const handleQty = async (productId, q) => {
    try { await updateItem(productId, q); }
    catch (err) { toast.error('Failed to update'); }
  };
  const handleRemove = async (productId) => {
    try { await removeItem(productId); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  };
  const clearAll = async () => { await clear(); toast.success('Cart cleared'); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/user/dashboard' }, { label: 'Cart' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-3">
          Your Cart
          <span className="bg-user-green-light text-user-green-dark text-sm font-medium px-3 py-1 rounded-full">
            {itemCount} items
          </span>
        </h1>
        <Link to="/user/vendors" className="btn-outline self-start sm:self-auto">Continue Shopping</Link>
      </div>

      <div className="mb-6 max-w-2xl">
        <UserMembershipCallout user={user} variant="compact" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items table */}
        <div className="lg:col-span-2 card border-user-green p-0 overflow-hidden">
          {cart.items?.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="shopping_cart" className="text-[56px] text-ink-mute mb-3" />
              <h3 className="text-lg text-ink font-semibold mb-1">Your cart is empty</h3>
              <p className="text-sm text-ink-soft mb-5">Start browsing vendors to add items.</p>
              <Link to="/user/vendors" className="btn-primary-user">Browse Vendors</Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-ink-soft border-b border-line">
                    <th className="text-left py-3 px-5">Item</th>
                    <th className="text-left py-3 px-3">Price</th>
                    <th className="text-left py-3 px-3">Qty</th>
                    <th className="text-left py-3 px-3">Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((i) => (
                    <tr key={i.product._id} className="border-b border-line table-row-hover">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon name="image" className="text-[24px] text-ink-mute" />
                          </div>
                          <div>
                            <div className="font-medium text-ink text-sm">{i.product.name}</div>
                            <div className="text-xs text-ink-soft">Vendor: {i.product.vendor?.businessName || i.product.vendor?.name || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-sm">₹{fmtINR(i.product.price)}</td>
                      <td className="py-4 px-3">
                        <div className="inline-flex items-center bg-gray-100 rounded-full">
                          <button onClick={() => handleQty(i.product._id, i.quantity - 1)}
                            className="w-8 h-8 rounded-full hover:bg-gray-200">−</button>
                          <span className="w-10 text-center text-sm">{i.quantity}</span>
                          <button onClick={() => handleQty(i.product._id, i.quantity + 1)}
                            className="w-8 h-8 rounded-full hover:bg-gray-200">+</button>
                        </div>
                      </td>
                      <td className="py-4 px-3 font-semibold text-user-green">₹{fmtINR(i.product.price * i.quantity)}</td>
                      <td className="py-4 px-3">
                        <button onClick={() => handleRemove(i.product._id)}
                          className="text-cat-catering hover:bg-cat-catering-light p-2 rounded">
                          <Icon name="delete" className="text-[20px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile stacked cards */}
              <div className="md:hidden divide-y divide-line">
                {cart.items.map((i) => (
                  <div key={i.product._id} className="p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Icon name="image" className="text-[24px] text-ink-mute" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-ink text-sm">{i.product.name}</div>
                        <div className="text-xs text-ink-soft">Vendor: {i.product.vendor?.businessName || '—'}</div>
                        <div className="text-sm mt-1 font-semibold text-user-green">₹{fmtINR(i.product.price * i.quantity)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center bg-gray-100 rounded-full">
                        <button onClick={() => handleQty(i.product._id, i.quantity - 1)} className="w-8 h-8 rounded-full">−</button>
                        <span className="w-10 text-center text-sm">{i.quantity}</span>
                        <button onClick={() => handleQty(i.product._id, i.quantity + 1)} className="w-8 h-8 rounded-full">+</button>
                      </div>
                      <button onClick={() => handleRemove(i.product._id)} className="text-cat-catering p-2">
                        <Icon name="delete" className="text-[20px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Order summary */}
        <div className="card border-user-green p-6 h-fit">
          <h2 className="text-lg font-semibold text-ink mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm border-b border-line pb-4">
            <Row label={`Subtotal (${itemCount} items)`} value={`₹${fmtINR(subtotal)}`} />
            <Row label="Delivery & Setup" value={`₹${fmtINR(deliveryFee)}`} />
            <Row label="Estimated Tax (8%)" value={`₹${fmtINR(tax)}`} />
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="font-semibold text-ink">Grand Total</span>
            <span className="font-bold text-xl text-user-green">₹{fmtINR(grandTotal)}</span>
          </div>
          <div className="flex gap-2 mb-4">
            <input className="input flex-1" placeholder="Enter coupon code" />
            <button className="text-vendor-yellow-dark font-medium px-3">Apply</button>
          </div>
          <button
            onClick={() => nav('/user/checkout')}
            disabled={cart.items?.length === 0}
            className="btn-primary-user w-full"
          >
            Proceed to Checkout <Icon name="arrow_forward" className="text-[18px]" />
          </button>
          <div className="flex justify-around mt-5 pt-5 border-t border-line text-xs text-ink-soft">
            <div className="text-center"><Icon name="lock" className="text-[20px] block mx-auto" />SECURE</div>
            <div className="text-center"><Icon name="local_shipping" className="text-[20px] block mx-auto" />FAST</div>
            <div className="text-center"><Icon name="undo" className="text-[20px] block mx-auto" />RETURNS</div>
          </div>
        </div>
      </div>

      {cart.items?.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between mt-6 gap-3">
          <Link to="/user/vendors" className="btn-outline">
            <Icon name="arrow_back" className="text-[18px]" />Continue Shopping
          </Link>
          <button onClick={clearAll} className="text-cat-catering font-medium flex items-center gap-2">
            <Icon name="delete" className="text-[20px]" /> Delete All Items
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
