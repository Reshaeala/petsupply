import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import LandingPage from "./pages/LandingPage";
import CategoryResultsPage from "./pages/CategoryResultsPage";
import SpeciesResultsPage from "./pages/SpeciesResultsPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while authentication is being determined
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/login"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={user ? <OrdersPage /> : <Navigate to="/login" />}
        />
        <Route path="/category/:slug" element={<CategoryResultsPage />} />
        <Route path="/species/:species" element={<SpeciesResultsPage />} />
        {/* <Route path="/google-callback" element={<GoogleCallbackPage />} /> */}
      </Routes>
    </Layout>
  );
}
