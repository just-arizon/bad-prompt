// src/pages/UpgradePage.jsx
// Shows pricing and triggers Stripe Checkout.
// Replace STRIPE_PAYMENT_LINK with your actual Stripe payment link.

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/your_link_here";

const styles = `
  .upgrade-page {
    min-height: 100vh; display: flex;
    flex-direction: column; align-items: center;
    padding: 64px 24px 80px;
  }
  .upgrade-eyebrow {
    font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--acid);
    margin-bottom: 16px;
  }
  .upgrade-heading {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800; color: var(--text-hi);
    text-align: center; letter-spacing: -0.02em;
    margin-bottom: 12px; line-height: 1.1;
  }
  .upgrade-heading span { color: var(--acid); }
  .upgrade-desc {
    font-size: 13px; color: var(--muted);
    text-align: center; max-width: 380px;
    line-height: 1.6; margin-bottom: 52px;
  }
  .plans {
    display: flex; gap: 20px; flex-wrap: wrap;
    justify-content: center; width: 100%; max-width: 780px;
  }
  .plan-card {
    flex: 1; min-width: 280px; max-width: 360px;
    background: var(--surface); border: 1px solid var(--border);
    padding: 32px;
  }
  .plan-card.featured {
    border-color: var(--acid);
    background: rgba(200,241,53,0.03);
  }
  .plan-tag {
    font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted); margin-bottom: 20px;
  }
  .plan-card.featured .plan-tag { color: var(--acid); }
  .plan-price {
    font-family: var(--font-display);
    font-size: 44px; font-weight: 800;
    color: var(--text-hi); line-height: 1;
    margin-bottom: 4px;
  }
  .plan-price sup {
    font-size: 20px; vertical-align: super; line-height: 0;
  }
  .plan-period {
    font-size: 12px; color: var(--muted);
    margin-bottom: 28px;
  }
  .plan-features {
    display: flex; flex-direction: column;
    gap: 10px; margin-bottom: 28px;
  }
  .plan-feature {
    font-size: 12px; color: var(--text);
    display: flex; align-items: flex-start; gap: 10px; line-height: 1.4;
  }
  .plan-feature-icon { color: var(--good); flex-shrink: 0; margin-top: 1px; }
  .plan-feature-icon.no { color: var(--muted); }
  .plan-cta { width: 100%; padding: 13px; font-size: 13px; }
`;

const FREE_FEATURES = [
  { text: "5 analyses per day",        yes: true },
  { text: "Prompt quality scores",     yes: true },
  { text: "Improved prompt rewrite",   yes: true },
  { text: "Prompt history",            yes: false },
  { text: "Unlimited analyses",        yes: false },
  { text: "Prompt templates",          yes: false },
];

const PRO_FEATURES = [
  { text: "Unlimited analyses",        yes: true },
  { text: "Prompt quality scores",     yes: true },
  { text: "Improved prompt rewrite",   yes: true },
  { text: "Full prompt history",       yes: true },
  { text: "Prompt templates library",  yes: true },
  { text: "Priority support",          yes: true },
];

export default function UpgradePage() {
  return (
    <>
      <style>{styles}</style>
      <div className="upgrade-page">
        <div className="upgrade-eyebrow">Pricing</div>
        <h2 className="upgrade-heading">
          Simple pricing.<br /><span>No surprises.</span>
        </h2>
        <p className="upgrade-desc">
          Start free. Upgrade when you need more.
        </p>

        <div className="plans">
          {/* Free */}
          <div className="plan-card">
            <div className="plan-tag">Free</div>
            <div className="plan-price"><sup>$</sup>0</div>
            <div className="plan-period">forever</div>
            <div className="plan-features">
              {FREE_FEATURES.map((f) => (
                <div key={f.text} className="plan-feature">
                  <span className={`plan-feature-icon ${f.yes ? "" : "no"}`}>
                    {f.yes ? "✓" : "×"}
                  </span>
                  {f.text}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost plan-cta"
              onClick={() => window.location.href = "/signup"}>
              Get started free
            </button>
          </div>

          {/* Pro */}
          <div className="plan-card featured">
            <div className="plan-tag">Pro</div>
            <div className="plan-price"><sup>$</sup>9</div>
            <div className="plan-period">per month, cancel anytime</div>
            <div className="plan-features">
              {PRO_FEATURES.map((f) => (
                <div key={f.text} className="plan-feature">
                  <span className="plan-feature-icon">✓</span>
                  {f.text}
                </div>
              ))}
            </div>
            <button className="btn btn-primary plan-cta"
              onClick={() => window.location.href = STRIPE_PAYMENT_LINK}>
              Upgrade to Pro →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}