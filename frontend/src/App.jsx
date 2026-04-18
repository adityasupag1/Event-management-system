import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout, AuthLayout, ProtectedRoute } from './components/layout/Layout';

// Public / auth
import Landing from './pages/Landing';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import CategoriesPage from './pages/public/CategoriesPage';
import ContactPage from './pages/public/ContactPage';
import UserLogin from './pages/auth/UserLogin';
import VendorLogin from './pages/auth/VendorLogin';
import AdminLogin from './pages/auth/AdminLogin';
import UserSignup from './pages/auth/UserSignup';
import VendorSignup from './pages/auth/VendorSignup';
import AdminSignup from './pages/auth/AdminSignup';

// User flow
import UserDashboard from './pages/user/UserDashboard';
import VendorList from './pages/user/VendorList';
import VendorProducts from './pages/user/VendorProducts';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import CheckoutSuccess from './pages/user/CheckoutSuccess';
import OrderStatus from './pages/user/OrderStatus';

// Vendor flow
import VendorDashboard from './pages/vendor/VendorDashboard';
import ManageProducts from './pages/vendor/ManageProducts';
import CustomerRequests from './pages/vendor/CustomerRequests';
import OrderManagement from './pages/vendor/OrderManagement';
import UpdateOrderStatus from './pages/vendor/UpdateOrderStatus';

// Admin flow
import AdminDashboard from './pages/admin/AdminDashboard';
import MaintainUsers from './pages/admin/MaintainUsers';
import MaintainVendors from './pages/admin/MaintainVendors';
import AdminTransactions from './pages/admin/AdminTransactions';

export default function App() {
  return (
    <Routes>
      {/* Public / auth — no persistent chrome */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/vendor" element={<VendorLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/signup/user" element={<UserSignup />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/signup/admin" element={<AdminSignup />} />
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute role="user" />}>
        <Route element={<AppLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/vendors" element={<VendorList />} />
          <Route path="/user/vendors/:category" element={<VendorList />} />
          <Route path="/user/vendor/:vendorId" element={<VendorProducts />} />
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/user/checkout" element={<Checkout />} />
          <Route path="/user/success/:orderId" element={<CheckoutSuccess />} />
          <Route path="/user/orders" element={<OrderStatus />} />
        </Route>
      </Route>

      {/* Vendor routes */}
      <Route element={<ProtectedRoute role="vendor" />}>
        <Route element={<AppLayout />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<ManageProducts />} />
          <Route path="/vendor/products/new" element={<ManageProducts addMode />} />
          <Route path="/vendor/requests" element={<CustomerRequests />} />
          <Route path="/vendor/orders" element={<OrderManagement />} />
          <Route path="/vendor/orders/:orderId/update" element={<UpdateOrderStatus />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<MaintainUsers />} />
          <Route path="/admin/vendors" element={<MaintainVendors />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
