// src/pages/HomePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAnalyze } from "../hooks/useAnalyze";
import UpgradeGate from "../components/upgradeGate";

const BAD_EXAMPLES = [
  "Write me a story",
  "Help me with my code",
  "Make it better",
  "Explain AI",
  "Give me ideas for my project",
];

const scoreColor = (val: number) => {
  if (val <= 40) return { text: "color-bad", fill: "fill-bad" };
  if (val <= 70) return { text: "color-mid", fill: "fill-mid" };
  return { text: "color-good", fill: "fill-good" };
};

const styles = `
  .home-header {
    width: 100%;
    max-width: 780px;
    margin-bottom: 52px;
  }
  .home-header .badge { margin-bottom: 20px; }
  h1 {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2rem, 5vw, 3.4rem);
    line-height: 1.05;
    color: var(--text-hi);
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  h1 span { color: var(--acid); }
  .subtitle {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    max-width: 440px;
  }
  textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text);
    line-height: 1.7;
    min-height: 120px;
  }
  textarea::placeholder { color: var(--muted); opacity: 0.6; }
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    border-top: 1px solid var(--border);
    padding-top: 16px;
    gap: 12px;
    align-items: center;
  }
  .char-count { font-size: 11px; color: var(--muted); margin-right: auto; }
  .score-row { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .score-chip {
    flex: 1; min-width: 140px;
    background: var(--dim);
    border: 1px solid var(--border);
    padding: 16px;
  }
  .score-chip .metric-label {
    font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 8px;
  }
  .score-chip .metric-val {
    font-family: var(--font-display);
    font-size: 28px; font-weight: 800; line-height: 1;
  }
  .score-chip .bar {
    margin-top: 8px; height: 3px;
    background: var(--border); position: relative; overflow: hidden;
  }
  .score-chip .bar-fill {
    position: absolute; top: 0; left: 0; height: 100%;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .color-bad { color: var(--warn); }
  .color-mid { color: #ffc35a; }
  .color-good { color: var(--good); }
  .fill-bad { background: var(--warn); }
  .fill-mid { background: #ffc35a; }
  .fill-good { background: var(--good); }
  .issues-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .issue-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px; background: var(--dim);
    border-left: 3px solid var(--warn);
  }
  .issue-icon { font-size: 14px; margin-top: 1px; flex-shrink: 0; }
  .issue-text { font-size: 13px; color: #c8c4b8; line-height: 1.5; }
  .improved-prompt {
    font-size: 14px; line-height: 1.8; color: var(--text);
    background: var(--dim); padding: 20px;
    border-left: 3px solid var(--acid);
    white-space: pre-wrap; word-break: break-word;
  }
  .copy-row { display: flex; justify-content: flex-end; margin-top: 12px; align-items: center; gap: 12px; }
  .copy-success { color: var(--good); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
  .divider-label {
    display: flex; align-items: center; gap: 12px;
    font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 12px;
  }
  .divider-label::before, .divider-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .loading-state {
    display: flex; flex-direction: column;
    align-items: center; gap: 16px; padding: 48px 0;
  }
  .spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--acid);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  .loading-text {
    font-size: 12px; color: var(--muted);
    letter-spacing: 0.1em; text-transform: uppercase;
    animation: pulse 1.5s ease-in-out infinite;
  }
  .examples { width: 100%; max-width: 780px; margin-top: 8px; }
  .examples-label {
    font-size: 10px; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 12px;
  }
  .example-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .pill {
    font-family: var(--font-mono); font-size: 11px;
    padding: 6px 14px; border: 1px solid var(--border);
    background: transparent; color: var(--muted);
    cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .pill:hover { border-color: var(--acid); color: var(--acid); }
`;

export default function HomePage() {
  
  const { atLimit } = useAuth();
  const { result, loading, error, analyze, reset } = useAnalyze();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => analyze(input);

  const handleClear = () => {
    setInput("");
    reset();
  };

  const handleCopy = () => {
    if (!result?.improvedPrompt) return;
    navigator.clipboard.writeText(result.improvedPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        {/* Header */}
        <div className="home-header">
          <div className="badge">Prompt Intelligence</div>
          <h1>Stop writing<br /><span>bad prompts.</span></h1>
          <p className="subtitle">
            Paste any prompt. Get an instant quality score, diagnosis of what's wrong,
            and a rewritten version that actually works.
          </p>
        </div>

        {/* Upgrade gate if free user hit limit */}
        {atLimit && <UpgradeGate />}

        {/* Input */}
        {!atLimit && (
          <div className="card container">
            <div className="label">Your Prompt</div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. write me a story about a robot..."
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleAnalyze();
              }}
            />
            <div className="actions">
              <span className="char-count">{input.length} chars · ⌘↵ to analyze</span>
              {result && <button className="btn btn-ghost" onClick={handleClear}>Clear</button>}
              <button className="btn btn-primary" onClick={handleAnalyze}
                disabled={!input.trim() || loading}>
                {loading ? "Analyzing…" : "Analyze →"}
              </button>
            </div>
          </div>
        )}

        {/* Example pills */}
        {!result && !loading && !atLimit && (
          <div className="examples">
            <div className="examples-label">Try a bad prompt →</div>
            <div className="example-pills">
              {BAD_EXAMPLES.map((ex) => (
                <button key={ex} className="pill" onClick={() => setInput(ex)}>{ex}</button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card container">
            <div className="loading-state">
              <div className="spinner" />
              <div className="loading-text">Diagnosing your prompt…</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="container">
            <div className="error-box">⚠ {error}</div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="card container anim-slide">
            <div className="label">Quality Scores</div>
            <div className="score-row">
              {[
                { label: "Overall",     val: result.overallScore },
                { label: "Clarity",     val: result.clarity },
                { label: "Specificity", val: result.specificity },
                { label: "Context",     val: result.context },
              ].map(({ label, val }) => {
                const c = scoreColor(val);
                return (
                  <div key={label} className="score-chip">
                    <div className="metric-label">{label}</div>
                    <div className={`metric-val ${c.text}`}>{val}</div>
                    <div className="bar">
                      <div className={`bar-fill ${c.fill}`} style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {result.issues?.length > 0 && (
              <>
                <div className="label">What's Wrong</div>
                <div className="issues-list">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="issue-item">
                      <span className="issue-icon">↳</span>
                      <span className="issue-text">{issue}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="divider-label">Improved Prompt</div>
            <div className="improved-prompt">{result.improvedPrompt}</div>
            <div className="copy-row">
              {copied && <span className="copy-success">✓ Copied</span>}
              <button className="btn btn-primary" onClick={handleCopy}>Copy Prompt</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}