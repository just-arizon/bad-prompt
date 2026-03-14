// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  plan: "free" | "paid";
  usageCount: number;
  usageLimit: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  isPaid: boolean;
  usageLeft: number;
  atLimit: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  incrementUsage: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token).finally(() => setLoading(false));
  }, []);

  async function fetchMe(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Invalid session");
      const data = await res.json();
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function signup(email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  function incrementUsage() {
    setUser((prev) => prev ? { ...prev, usageCount: prev.usageCount + 1 } : prev);
  }

  const isLoggedIn = !!user;
  const isPaid     = user?.plan === "paid";
  const usageLeft  = user ? Math.max(0, user.usageLimit - user.usageCount) : 0;
  const atLimit    = user?.plan === "free" && usageLeft <= 0;

  return (
    <AuthContext.Provider value={{
      user, loading,
      isLoggedIn, isPaid, usageLeft, atLimit,
      login, signup, logout, incrementUsage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook 
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}