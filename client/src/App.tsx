import type { ReactElement } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AccountPage } from "./pages/AccountPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductPage } from "./pages/ProductPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { WishlistPage } from "./pages/WishlistPage";

const Protected = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="glass-panel p-8 text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="glass-panel p-8 text-white">Loading...</div>;
  }

  return <Navigate to={user ? "/home" : "/login"} replace />;
};

export default function App() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/home" element={<Protected><HomePage /></Protected>} />
        <Route path="/catalog" element={<Protected><CatalogPage onRequireAuth={() => navigate("/login")} /></Protected>} />
        <Route path="/products/:slug" element={<Protected><ProductPage /></Protected>} />
        <Route path="/wishlist" element={<Protected><WishlistPage /></Protected>} />
        <Route path="/cart" element={<Protected><CartPage /></Protected>} />
        <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
        <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
        <Route path="/account" element={<Protected><AccountPage /></Protected>} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
      </Routes>
    </AppLayout>
  );
}
