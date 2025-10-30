// pages/GoogleCallbackPage.tsx
import { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function GoogleCallbackPage() {
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(() => navigate("/", { replace: true }))
      .catch((e: any) => setErr(e?.message ?? "Google redirect failed"));
  }, [navigate]);

  if (err) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "#b91c1c" }}>{err}</p>
        <Link to="/login">Back to login</Link>
      </div>
    );
  }
  return <div style={{ padding: 24 }}>Signing you in…</div>;
}
