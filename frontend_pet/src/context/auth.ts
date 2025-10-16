import { create } from "zustand";

type User = { id: number; email: string; name?: string; role?: string };

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const KEY = "petshop_auth";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...(load() || { token: null, user: null }),
  setAuth: (token, user) => {
    localStorage.setItem(KEY, JSON.stringify({ token, user }));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(KEY);
    set({ token: null, user: null });
  }
}));
