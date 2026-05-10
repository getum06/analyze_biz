"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type InputMode = "url" | "paste";
type Stage =
  | "idle"
  | "extracting"
  | "enriching"
  | "modeling"
  | "scoring"
  | "done"
  | "error";

const stageLabels: Record<Stage, string> = {
  idle: "",
  extracting: "Extracting deal data from listing...",
  enriching: "Enriching with market & demographic data...",
  modeling: "Building 10-year cash flow model...",
  scoring: "Scoring the deal...",
  done: "Analysis complete!",
  error: "Analysis failed",
};

const stageProgress: Record<Stage, number> = {
  idle: 0,
  extracting: 20,
  enriching: 50,
  modeling: 75,
  scoring: 90,
  done: 100,
  error: 0,
};

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const hasInput = mode === "url" ? url.trim() : pasteText.trim();
    if (!hasInput) {
      setError(
        mode === "url"
          ? "Please enter a listing URL"
          : "Please paste the listing text"
      );
      return;
    }

    setError(null);
    setStage("extracting");

    try {
      const body =
        mode === "url"
          ? { url: url.trim() }
          : { manualText: pasteText.trim() };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      setStage("enriching");
      await new Promise((r) => setTimeout(r, 300)); // Visual feedback
      setStage("modeling");
      await new Promise((r) => setTimeout(r, 300));
      setStage("scoring");
      await new Promise((r) => setTimeout(r, 300));

      const data = await res.json();
      setStage("done");

      await new Promise((r) => setTimeout(r, 500));
      router.push(`/deals/${data.dealId}`);
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const isLoading = !["idle", "done", "error"].includes(stage);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🪣</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Laundromat Underwriting Copilot
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Paste a listing URL or deal text. Get structured data extraction,
          market enrichment, 10-year cash flow model, deal score, and
          investment memo — in minutes.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {/* Mode tabs */}
        <div className="flex border border-gray-200 rounded-xl p-1 mb-6 bg-gray-50">
          <button
            onClick={() => setMode("url")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
              mode === "url"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🔗 Paste URL
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
              mode === "paste"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 Paste Listing Text
          </button>
        </div>

        {mode === "url" ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.bizbuysell.com/listing/..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <p className="mt-2 text-xs text-gray-400">
              Works best with BizBuySell, LoopNet, BizQuest, Sunbelt listings.
              If the site blocks scraping, use the paste mode instead.
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Text
            </label>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Paste the full listing text here. Include:
- Business name and location
- Asking price
- Gross revenue / SDE / EBITDA
- Monthly rent and lease terms
- Machine count and age
- Services offered (self-serve, wash & fold, etc.)
- Seller notes`}
              rows={12}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 font-mono resize-y"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        )}

        {/* Progress bar */}
        {isLoading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">
                {stageLabels[stage]}
              </span>
              <span className="text-sm text-gray-400">
                {stageProgress[stage]}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${stageProgress[stage]}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Deal →"
          )}
        </button>
      </div>

      {/* How it works */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: "🔍",
            title: "Extract",
            desc: "AI pulls deal data from any listing URL or pasted text",
          },
          {
            icon: "📊",
            title: "Enrich",
            desc: "Census demographics, renter rates, competitor laundromats",
          },
          {
            icon: "📈",
            title: "Model",
            desc: "10-year cash flow with IRR, DSCR, MOIC projections",
          },
          {
            icon: "📝",
            title: "Memo",
            desc: "Generate a first-pass investment memo in one click",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {item.title}
            </div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
