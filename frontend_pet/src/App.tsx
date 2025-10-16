import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import { useAuthStore } from "./context/auth";
import LandingPage from "./pages/LandingPage";
import CategoryResultsPage from "./pages/CategoryResultsPage";
import SpeciesResultsPage from "./pages/SpeciesResultsPage";

export default function App() {
  const token = useAuthStore((s) => s.token);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={token ? <CartPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={token ? <OrdersPage /> : <Navigate to="/login" />}
        />
        <Route path="/category/:slug" element={<CategoryResultsPage />} />
        <Route path="/species/:species" element={<SpeciesResultsPage />} />
      </Routes>
    </Layout>
  );
}
