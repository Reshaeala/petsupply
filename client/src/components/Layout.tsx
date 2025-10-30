// components/Layout.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const count = () => 0; // TODO: wire to cart state

  async function handleLogout() {
    try {
      setSigningOut(true);
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout failed", e);
      // optional: show a toast
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">
            Pet Shop
          </Link>
          <nav className="flex items-center gap-4">
            {/* NOTE: your routes use /products, not /shop. If that's unintentional, change this to /products */}
            {/* <NavLink to="/products" className="text-sm">
              Shop
            </NavLink> */}

            {user ? (
              <>
                <NavLink to="/orders" className="text-sm">
                  Orders
                </NavLink>
                <NavLink to="/cart" className="text-sm">
                  Cart ({count()})
                </NavLink>
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                >
                  {signingOut ? "Logging out…" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-sm">
                  Login
                </NavLink>
                <NavLink to="/register" className="text-sm">
                  Register
                </NavLink>
                <NavLink to="/cart" className="text-sm">
                  Cart (0)
                </NavLink>
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
