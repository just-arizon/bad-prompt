// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = `
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .auth-card {
    width: 100%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 36px;
  }
  .auth-logo {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 22px;
    color: var(--text-hi);
    margin-bottom: 32px;
    letter-spacing: -0.02em;
  }
  .auth-logo span { color: var(--acid); }
  .auth-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-hi);
    margin-bottom: 6px;
  }
  .auth-sub {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 28px;
    line-height: 1.5;
  }
  .field { margin-bottom: 16px; }
  .field-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
    display: block;
  }
  .auth-submit {
    width: 100%;
    margin-top: 8px;
    padding: 13px;
    font-size: 13px;
  }
  .auth-footer {
    margin-top: 20px;
    font-size: 12px;
    color: var(--muted);
    text-align: center;
  }
  .auth-footer a {
    color: var(--acid);
    cursor: pointer;
  }
  .auth-footer a:hover { text-decoration: underline; }
`;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-card anim-fade">
          <div className="auth-logo">bad<span>prompt</span></div>
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your account to continue.</div>

          {error && <div className="error-box" style={{ marginBottom: 20 }}>⚠ {error}</div>}

          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>

          <button className="btn btn-primary auth-submit" onClick={handleSubmit}
            disabled={!email || !password || loading}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <div className="auth-footer">
            No account? <Link to="/signup">Sign up free</Link>
          </div>
        </div>
      </div>
    </>
  );
}