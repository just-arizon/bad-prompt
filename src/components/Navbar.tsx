// src/components/Navbar.jsx
const styles = `
  .navbar {
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .navbar-inner {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .navbar-logo {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 16px;
    color: var(--text-hi);
    cursor: pointer;
    letter-spacing: -0.02em;
  }
  .navbar-logo span { color: var(--acid); }
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .plan-chip {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .plan-chip.paid {
    border-color: var(--acid);
    color: var(--acid);
  }
  .usage-text {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-text.low { color: var(--warn); }
`;

export default function Navbar() {


  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            bad<span>prompt</span>
          </div>
        </div>
      </nav>
    </>
  );
}