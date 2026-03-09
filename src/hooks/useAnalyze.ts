// src/hooks/useAnalyze.js
// Encapsulates the analyze API call, loading, error, and result state.

import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export function useAnalyze() {
  const { incrementUsage } = useAuth();
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const analyze = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/analyze-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setResult(data);
      incrementUsage();
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [incrementUsage]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, analyze, reset };
}