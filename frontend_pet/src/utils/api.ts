import { useAuthStore } from "@/context/auth";

const BASE = ""; // use proxy, so empty = same origin

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(opts.headers || {});
  if (!headers.has("Content-Type") && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try { const j = JSON.parse(text); message = j.error || JSON.stringify(j); } catch {}
    throw new Error(message || `${res.status} ${res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? await res.json() : (await res.text() as unknown as T);
}
