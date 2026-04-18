import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../api/services';
import { Icon } from '../../components/ui/Primitives';
import { fmtINR } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, itemCount, subtotal, refresh } = useCart();
  const nav = useNavigate();
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
  });
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + deliveryFee + tax;

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!cart.items?.length) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const order = await orderAPI.create({ deliveryDetails: form, paymentMethod: payment });
      await refresh();
      toast.success('Order placed!');
      nav(`/user/success/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-user-green-light/60 rounded-xl p-6 mb-6">
        <Breadcrumbs items={[
          { label: 'Home', to: '/user/dashboard' },
          { label: 'Cart', to: '/user/cart' },
          { label: 'Checkout' },
        ]} />
        <h1 className="text-2xl md:text-3xl font-bold text-ink">Checkout</h1>
        <div className="mt-4 max-w-xl">
          <UserMembershipCallout user={user} variant="compact" />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8 max-w-md mx-auto">
        <Step num={1} label="Cart" done />
        <div className="h-px flex-1 bg-user-green mx-2" />
        <Step num={2} label="Checkout" active />
        <div className="h-px flex-1 bg-line mx-2" />
        <Step num={3} label="Confirmation" />
      </div>

      <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card border-user-green p-6">
            <h2 className="font-semibold text-ink mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" required value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <label className="label">E-mail</label>
                <input type="email" className="input" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input min-h-[80px]" required value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Main St, Apt 4B" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input className="input" required value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className="label">State</label>
                  <select className="input" required value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}>
                    <option value="">Select State</option>
                    {['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'West Bengal'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Pin Code</label>
                  <input className="input" required value={form.pinCode}
                    onChange={(e) => setForm({ ...form, pinCode: e.target.value })} />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" required value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(555) 123-4567" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input type="checkbox" className="accent-user-green" />
                Save this address for next time
              </label>
            </div>
          </section>

          <section className="card border-user-green p-6">
            <h2 className="font-semibold text-ink mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PaymentOption
                id="cash" active={payment === 'cash'} onClick={() => setPayment('cash')}
                icon="payments" title="CASH" subtitle="Pay when you receive"
              />
              <PaymentOption
                id="upi" active={payment === 'upi'} onClick={() => setPayment('upi')}
                icon="account_balance" title="UPI / Online" subtitle="Pay now securely"
              />
            </div>
          </section>
        </div>

        {/* Summary sidebar */}
        <div className="card border-user-green p-6 h-fit lg:sticky lg:top-20">
          <h2 className="font-semibold text-ink mb-4">Your Order</h2>
          <div className="space-y-3 mb-4">
            {cart.items?.map((i) => (
              <div key={i.product._id} className="flex items-center gap-3 pb-3 border-b border-line last:border-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon name="image" className="text-[20px] text-ink-mute" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink line-clamp-1">{i.product.name}</div>
                  <div className="text-xs text-ink-soft">Qty: {i.quantity}</div>
                </div>
                <div className="text-sm font-medium text-ink">₹{fmtINR(i.product.price * i.quantity)}/-</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm pt-4 border-t border-line">
            <Row label="Subtotal" value={`₹${fmtINR(subtotal)}/-`} />
            <Row label="Delivery" value={`₹${fmtINR(deliveryFee)}/-`} />
            <Row label="Tax" value={`₹${fmtINR(tax)}/-`} />
          </div>
          <div className="flex justify-between items-center py-4 border-t border-line mt-3">
            <span className="font-semibold text-ink">Grand Total</span>
            <span className="font-bold text-xl text-user-green">₹{fmtINR(grandTotal)}/-</span>
          </div>
          <button type="submit" disabled={loading} className="btn-primary-user w-full">
            {loading ? 'Placing…' : 'Order Now'}
          </button>
          <div className="flex items-center gap-2 text-xs text-ink-soft justify-center mt-3">
            <Icon name="lock" className="text-[14px]" />
            256-bit SSL Encrypted
          </div>
        </div>
      </form>
    </div>
  );
}

function Step({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
        done ? 'bg-user-green text-white' : active ? 'bg-user-green text-white' : 'bg-gray-200 text-ink-soft'
      }`}>
        {done ? <Icon name="check" className="text-[16px]" /> : num}
      </div>
      <span className={`text-sm ${active ? 'text-ink font-medium' : 'text-ink-soft'}`}>{label}</span>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, title, subtitle }) {
  return (
    <button type="button" onClick={onClick}
      className={`p-5 rounded-lg border-2 text-left transition-all ${
        active ? 'border-vendor-yellow-dark bg-vendor-yellow-light' : 'border-line bg-white hover:border-ink-mute'
      }`}>
      <Icon name={icon} className={`text-[24px] ${active ? 'text-vendor-yellow-dark' : 'text-admin-blue'}`} />
      <div className="font-semibold text-ink mt-2">{title}</div>
      <div className="text-xs text-ink-soft">{subtitle}</div>
    </button>
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
