import { useState, useCallback } from "react";

const GOOGLE_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap";

const styleTag = `
  @import url('${GOOGLE_FONT_URL}');

`;

const BAD_EXAMPLES = [
  "Write me a story",
  "Help me with my code",
  "Make it better",
  "Explain AI",
  "Give me ideas for my project",
];
const GOOD_EXAMPLES = [
  "Build a React landing page with hero and pricing",
  "Summarize top 5 AI writing tool competitors",
  "Write a pitch deck for a SaaS targeting small businesses.",
];

const scoreColor = (val: number) => {
  if (val <= 40) return { text: "color-bad", fill: "fill-bad" };
  if (val <= 70) return { text: "color-mid", fill: "fill-mid" };
  return { text: "color-good", fill: "fill-good" };
};

// Points to your Express backend — update for production
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function analyzePrompt(userPrompt: string) {
  const response = await fetch(`${API_BASE}/api/analyze-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userPrompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data;
}

  interface AnalysisResult {
    overallScore: number;
    clarity: number;
    specificity: number;
    context: number;
    issues: string[];
    improvedPrompt: string;
  }


export function PromptOptimizer() {

  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzePrompt(input.trim());
      setResult(data);
    } catch (e) {
      const err = e as Error;
      setError(
        err.message || "Something went wrong. Check your API connection.",
      );
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleCopy = () => {
    if (!result?.improvedPrompt) return;
    navigator.clipboard.writeText(result.improvedPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError(null);
  };

  return (
    <>
      <style>{styleTag}</style>
      <div className="app">
        <div className="header">
          <div className="badge">Prompt Intelligence</div>
          <h1>
            Stop writing
            <br />
            <span>bad prompts.</span>
          </h1>
          <p className="subtitle">
            Paste any prompt. Get an instant quality score, diagnosis of what's
            wrong, and a rewritten version that actually works.
          </p>
        </div>

        {/* Input Card */}
        <div className="card">
          <div className="label">Your Prompt</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. write me a story about a robot..."
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
                handleAnalyze();
            }}
          />
          <div className="actions">
            <span className="char-count">
              {input.length} chars · ⌘↵ to analyze
            </span>
            {result && (
              <button className="btn btn-ghost" onClick={handleClear}>
                Clear
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={!input.trim() || loading}
            >
              {loading ? "Analyzing…" : "Analyze →"}
            </button>
          </div>
        </div>

        {/* Example bad prompts and good prompts */}
        {!result && !loading && (
          <div className="examples">
            <div className="examples-label">Try a bad prompt →</div>
            <div className="example-pills">
              {BAD_EXAMPLES.map((ex) => (
                <button key={ex} className="pill" onClick={() => setInput(ex)}>
                  {ex}
                </button>
              ))}
            </div>

            <div className="examples-label" style={{ marginTop: "16px" }}>
              Try a good prompt →
            </div>
            <div className="example-pills">
              {GOOD_EXAMPLES.map((ex) => (
                <button key={ex} className="pill" onClick={() => setInput(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card">
            <div className="loading-state">
              <div className="spinner" />
              <div className="loading-text">Diagnosing your prompt…</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card">
            <div className="error-box">⚠ {error}</div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="card result-card">
            {/* Scores */}
            <div className="label">Quality Scores</div>
            <div className="score-row">
              {[
                { label: "Overall", val: result.overallScore },
                { label: "Clarity", val: result.clarity },
                { label: "Specificity", val: result.specificity },
                { label: "Context", val: result.context },
              ].map(({ label, val }) => {
                const c = scoreColor(val);
                return (
                  <div key={label} className="score-chip">
                    <div className="metric-label">{label}</div>
                    <div className={`metric-val ${c.text}`}>{val}</div>
                    <div className="bar">
                      <div
                        className={`bar-fill ${c.fill}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Issues */}
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

            {/* Improved Prompt */}
            <div className="divider-label">Improved Prompt</div>
            <div className="improved-prompt">{result.improvedPrompt}</div>
            <div className="copy-row">
              {copied && <span className="copy-success">✓ Copied</span>}
              <button
                className="btn btn-primary"
                onClick={handleCopy}
                style={{ marginLeft: 12 }}
              >
                Copy Prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
