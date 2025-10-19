import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/context/auth";
import { api } from "@/utils/api";
import SignInWithGoogle from "@/components/SignInWithGoogle";

export default function AuthPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  // Mode determines if we are logging in or registering
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  console.log("AuthPage rendered. Current email state:", email);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const payload =
      mode === "login" ? { email, password } : { email, password, name };

    try {
      const res = await api.post(endpoint, payload);
      setAuth(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error || `An error occurred during ${mode}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 mt-12">
      <h1 className="text-2xl font-bold text-center mb-4">
        {mode === "login" ? "Welcome Back!" : "Create an Account"}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Sign in with your favorite provider.
      </p>

      <div className="mb-4">
        <SignInWithGoogle />
      </div>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm text-gray-500">
          Or continue with email
        </span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-600">{error}</div>}

        {mode === "signup" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => {
            console.log("Email input changed:", e.target.value);
            setEmail(e.target.value);
          }}
          placeholder="Email Address"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button onClick={toggleMode} className="text-sm text-blue-600 hover:underline">
          {mode === "login"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}