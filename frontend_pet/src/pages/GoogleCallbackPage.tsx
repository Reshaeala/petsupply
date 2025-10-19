import { useEffect, useState } from "react";
import { useAuthStore } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";

interface GoogleCallbackResponse {
  token: string;
  user: any; // You might want to define a proper user type
}

export default function GoogleCallbackPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
          const redirect_uri = `${window.location.origin}/google-callback`;

          const res = await api<GoogleCallbackResponse>("/api/auth/google/callback", {
            method: "POST",
            body: JSON.stringify({ code, redirect_uri }),
          });
          
          setAuth(res.token, res.user);
          navigate("/");
        } else {
          setError("Google callback code not found in URL");
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    handleGoogleCallback();
  }, [navigate, setAuth]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-semibold mb-4">Google Sign-In Callback</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!error && <div>Processing Google sign-in...</div>}
    </div>
  );
}
