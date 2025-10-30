import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function GreetingBar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div className="font-semibold">
        Hey{user?.name ? `, ${user.name}` : ", friend"}!
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Welcome back</div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
