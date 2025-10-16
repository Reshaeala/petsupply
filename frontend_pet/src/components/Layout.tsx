import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/context/auth";
import { useCartStore } from "@/context/cart";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const { count, fetchCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">Pet Shop</Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/shop" className="text-sm">Shop</NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className="text-sm">Orders</NavLink>
                <NavLink to="/cart" className="text-sm">Cart ({count()})</NavLink>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-sm">Login</NavLink>
                <NavLink to="/register" className="text-sm">Register</NavLink>
                <NavLink to="/cart" className="text-sm">Cart (0)</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Pet Shop
        </div>
      </footer>
    </div>
  );
}
