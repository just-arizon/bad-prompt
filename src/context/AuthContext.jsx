// src/context/AuthContext.jsx
// Manages user session, plan, and usage count globally.
// In production, replace the mock with real API calls to your backend.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { id, email, plan, usageCount, usageLimit }
  const [loading, setLoading] = useState(true);

  // On mount, check if a session token exists and fetch the user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token).finally(() => setLoading(false));
  }, []);

  async function fetchMe(token) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/auth/me`, {
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

  async function login(email, password) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function signup(email, password) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/auth/signup`, {
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

  // Call this after a successful analysis to keep usage count in sync locally
  function incrementUsage() {
    setUser((prev) => prev ? { ...prev, usageCount: prev.usageCount + 1 } : prev);
  }

  const isLoggedIn  = !!user;
  const isPaid      = user?.plan === "paid";
  const usageLeft   = user ? Math.max(0, user.usageLimit - user.usageCount) : 0;
  const atLimit     = user?.plan === "free" && usageLeft <= 0;

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}