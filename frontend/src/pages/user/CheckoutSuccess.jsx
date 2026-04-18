import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../api/services';
import { Icon, Logo } from '../../components/ui/Primitives';
import UserMembershipCallout from '../../components/user/UserMembershipCallout';
import { fmtINR } from '../../utils/theme';

export default function CheckoutSuccess() {
  const { user } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    orderAPI.get(orderId).then(setOrder).catch(() => {});
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, [orderId]);

  if (!order) return <div className="p-8 text-center text-ink-soft">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Brand */}
      <div className="text-center mb-6">
        <Logo className="justify-center text-xl" />
      </div>

      {showConfetti && <Confetti />}

      <div className="card border-user-green p-8 animate-fade-slide-up">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-user-green-light mx-auto flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-user-green-dark flex items-center justify-center text-white">
              <Icon name="check" className="text-[32px]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-ink">Thank You!</h1>
          <p className="text-sm text-ink-soft mt-2">Your order has been placed successfully.</p>
          <div className="mt-4 text-left max-w-md mx-auto">
            <UserMembershipCallout user={user} variant="compact" />
          </div>
          <span className="inline-block mt-4 px-4 py-1.5 bg-user-green-light text-user-green-dark font-medium rounded-full text-sm">
            ORDER #{order.orderNumber}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-5 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-ink-soft uppercase tracking-wider">Total Amount</div>
            <div className="text-2xl font-bold text-user-green">₹{fmtINR(order.grandTotal)}/-</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-ink-soft uppercase tracking-wider">Payment Method</div>
            <div className="font-semibold text-ink uppercase">{order.paymentMethod}</div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-ink mb-3">Customer Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-5">
            <Field label="NAME" value={order.deliveryDetails?.fullName} />
            <Field label="EMAIL" value={order.deliveryDetails?.email} />
            <Field label="PHONE" value={order.deliveryDetails?.phone} />
          </div>
          <Field label="DELIVERY ADDRESS" value={
            [order.deliveryDetails?.address, order.deliveryDetails?.city, order.deliveryDetails?.state, `Pin Code: ${order.deliveryDetails?.pinCode}`]
              .filter(Boolean).join(', ')
          } />
        </div>

        <div className="bg-admin-blue-light/50 rounded-lg p-4 my-6 flex items-center gap-3">
          <Icon name="local_shipping" className="text-[24px] text-admin-blue" />
          <div className="text-sm text-ink">
            Expected delivery: <strong>3–5 business days</strong>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/user/vendors" className="btn-primary-user w-full">Continue Shopping</Link>
          <Link to="/user/orders" className="btn-outline w-full">View Order Status</Link>
          <button className="flex items-center justify-center gap-2 w-full py-2 text-admin-blue font-medium">
            <Icon name="download" className="text-[18px]" /> RECEIPT
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-ink-soft mt-6">
        Thanks for choosing EventMS! Share your experience — tag us
        <strong className="block">@EventMS</strong>
      </p>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs text-ink-soft uppercase tracking-wider">{label}</div>
      <div className="text-sm text-ink mt-1">{value || '—'}</div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 40 });
  const colors = ['#1a73e8', '#0f9d58', '#f9ab00', '#d93025'];
  return (
    <div className="confetti">
      {pieces.map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            width: 8,
            height: 14,
            background: colors[i % colors.length],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`@keyframes confetti-fall {
        to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }`}</style>
    </div>
  );
}
