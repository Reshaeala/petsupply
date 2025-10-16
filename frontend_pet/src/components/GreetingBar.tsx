import { Link } from "react-router-dom";
import { useAuthStore } from "@/context/auth";

export default function GreetingBar() {
  const { user } = useAuthStore();
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div className="font-semibold">Hey{user?.name ? `, ${user.name}` : ", friend"}!</div>
      {user ? (
        <div className="text-sm text-gray-600">Welcome back</div>
      ) : (
        <Link to="/login" className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Sign in</Link>
      )}
    </div>
  );
}
