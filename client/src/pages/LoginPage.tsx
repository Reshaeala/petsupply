// pages/LoginPage.tsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e: any) {
      setErr(e?.message ?? "Auth failed");
    }
  }

  async function onGoogle() {
    setErr("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in failed");
    }
  }

  return (
    <div
      style={{ maxWidth: 420, margin: "4rem auto", fontFamily: "system-ui" }}
    >
      <h1 style={{ marginBottom: 8 }}>
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <form onSubmit={onEmailSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          style={{
            padding: 10,
            borderRadius: 8,
            border: 0,
            background: "#111827",
            color: "#fff",
          }}
        >
          {mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <button
        onClick={onGoogle}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "#fff",
        }}
      >
        Continue with Google
      </button>

      {err && (
        <div style={{ marginTop: 12, color: "#b91c1c", fontSize: 14 }}>
          {err}
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 14 }}>
        {mode === "signin" ? (
          <>
            No account?{" "}
            <button
              onClick={() => setMode("signup")}
              style={{
                border: 0,
                background: "none",
                color: "#2563eb",
                cursor: "pointer",
              }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("signin")}
              style={{
                border: 0,
                background: "none",
                color: "#2563eb",
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
