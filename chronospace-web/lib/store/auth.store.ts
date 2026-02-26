import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setHasHydrated: (val: boolean) => void;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, token) => {
        // Write to both localStorage (via persist) AND cookie (for middleware)
        setCookie("chronospace_token", token);
        if (typeof window !== "undefined") {
          localStorage.setItem("chronospace_token", token);
        }
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        deleteCookie("chronospace_token");
        if (typeof window !== "undefined") {
          localStorage.removeItem("chronospace_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: "chronospace_auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sync cookie after page reload (persist restores localStorage but not cookie)
        if (state?.token) {
          setCookie("chronospace_token", state.token);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
