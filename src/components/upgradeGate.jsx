// src/components/UpgradeGate.jsx
// Shown inline when a free user hits their daily limit.

import { useNavigate } from "react-router-dom";

const styles = `
  .upgrade-gate {
    width: 100%;
    max-width: 780px;
    border: 1px solid var(--acid);
    padding: 28px;
    margin-bottom: 20px;
    background: rgba(200,241,53,0.04);
    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .upgrade-gate h2 {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    color: var(--text-hi);
    margin-bottom: 8px;
  }
  .upgrade-gate p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .upgrade-features {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 24px;
  }
  .upgrade-feature {
    font-size: 12px;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .upgrade-feature::before {
    content: '→';
    color: var(--acid);
  }
  .upgrade-gate-actions {
    display: flex;
    gap: 12px;
  }
`;

export default function UpgradeGate() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="upgrade-gate">
        <h2>You've hit your daily limit.</h2>
        <p>Free accounts get 5 analyses per day. Upgrade to Pro for unlimited access.</p>
        <div className="upgrade-features">
          {[
            "Unlimited prompt analyses",
            "Full prompt history saved",
            "Prompt templates library",
            "Export results to PDF",
          ].map((f) => (
            <div key={f} className="upgrade-feature">{f}</div>
          ))}
        </div>
        <div className="upgrade-gate-actions">
          <button className="btn btn-primary" onClick={() => navigate("/upgrade")}>
            Upgrade to Pro — $9/mo
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>
            Already paid? Log in
          </button>
        </div>
      </div>
    </>
  );
}