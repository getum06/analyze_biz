"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { MarketDataCard } from "@/components/MarketDataCard";
import { CashFlowTable } from "@/components/CashFlowTable";
import { DealScoreCard } from "@/components/DealScore";
import { InvestmentMemoCard } from "@/components/InvestmentMemo";
import {
  ExtractedListing,
  MarketData,
  CashFlowModel,
  DealScore,
  InvestmentMemo,
} from "@/types/deal";

interface FullDeal {
  id: string;
  businessName: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  askingPrice: number | null;
  grossRevenue: number | null;
  sde: number | null;
  ebitda: number | null;
  rent: number | null;
  leaseTerms: string | null;
  squareFeet: number | null;
  employees: number | null;
  machines: ExtractedListing["machines"] | null;
  services: ExtractedListing["services"] | null;
  sellerNotes: string | null;
  sourceUrl: string | null;
  extractionConfidence: number | null;
  missingFields: string[];
  marketData: MarketData | null;
  cashFlowModel: CashFlowModel | null;
  dealScore: DealScore | null;
  investmentMemo: InvestmentMemo | null;
  status: string;
}

type Tab = "overview" | "market" | "model" | "score" | "memo";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Deal Overview", icon: "📋" },
  { id: "market", label: "Market Data", icon: "🗺️" },
  { id: "model", label: "Cash Flow Model", icon: "📈" },
  { id: "score", label: "Deal Score", icon: "⭐" },
  { id: "memo", label: "Investment Memo", icon: "📝" },
];

export default function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [deal, setDeal] = useState<FullDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [generating, setGenerating] = useState<string | null>(null);
  const [modelOverrides, setModelOverrides] = useState({
    holdingPeriodYears: 10,
    revenueGrowthRate: 3,
    downPaymentPercent: 10,
    sbaRate: 8.5,
    sbaTerm: 10,
    exitMultiple: 3.5,
  });

  useEffect(() => {
    fetchDeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDeal = async () => {
    try {
      const res = await fetch(`/api/deals/${id}`);
      const data = await res.json();
      setDeal(data.deal);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  const runEnrichment = async () => {
    if (!deal?.city || !deal?.state) return;
    setGenerating("market");
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: deal.city,
          state: deal.state,
          address: deal.address,
          dealId: id,
        }),
      });
      const data = await res.json();
      if (data.marketData) {
        setDeal((prev) =>
          prev ? { ...prev, marketData: data.marketData } : prev
        );
        setActiveTab("market");
      }
    } catch {
      // handle silently
    } finally {
      setGenerating(null);
    }
  };

  const runModel = async () => {
    setGenerating("model");
    try {
      const res = await fetch("/api/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId: id,
          overrides: modelOverrides,
        }),
      });
      const data = await res.json();
      if (data.cashFlowModel) {
        setDeal((prev) =>
          prev ? { ...prev, cashFlowModel: data.cashFlowModel } : prev
        );
        setActiveTab("model");
      }
    } catch {
      // handle silently
    } finally {
      setGenerating(null);
    }
  };

  const runScore = async () => {
    setGenerating("score");
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: id }),
      });
      const data = await res.json();
      if (data.dealScore) {
        setDeal((prev) =>
          prev ? { ...prev, dealScore: data.dealScore } : prev
        );
        setActiveTab("score");
      }
    } catch {
      // handle silently
    } finally {
      setGenerating(null);
    }
  };

  const runMemo = async () => {
    setGenerating("memo");
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: id }),
      });
      const data = await res.json();
      if (data.memo) {
        setDeal((prev) =>
          prev ? { ...prev, investmentMemo: data.memo } : prev
        );
        setActiveTab("memo");
      }
    } catch {
      // handle silently
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading deal...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Deal not found</p>
        <Link href="/deals" className="text-blue-600 hover:underline text-sm mt-2 block">
          Back to deals
        </Link>
      </div>
    );
  }

  const listing: ExtractedListing = {
    businessName: deal.businessName ?? undefined,
    address: deal.address ?? undefined,
    city: deal.city ?? undefined,
    state: deal.state ?? undefined,
    askingPrice: deal.askingPrice ?? undefined,
    grossRevenue: deal.grossRevenue ?? undefined,
    sde: deal.sde ?? undefined,
    ebitda: deal.ebitda ?? undefined,
    rent: deal.rent ?? undefined,
    leaseTerms: deal.leaseTerms ?? undefined,
    squareFeet: deal.squareFeet ?? undefined,
    employees: deal.employees ?? undefined,
    machines: deal.machines ?? undefined,
    services: deal.services ?? undefined,
    sellerNotes: deal.sellerNotes ?? undefined,
    sourceUrl: deal.sourceUrl ?? "",
    extractionConfidence: deal.extractionConfidence ?? 0.5,
    missingFields: deal.missingFields ?? [],
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/deals"
          className="text-sm text-gray-400 hover:text-gray-600 mb-3 block"
        >
          ← All Deals
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {deal.businessName || "Unnamed Laundromat"}
            </h1>
            {(deal.city || deal.state) && (
              <p className="text-gray-500 text-sm mt-0.5">
                {[deal.address, deal.city, deal.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
          {deal.dealScore && (
            <div className="text-center bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div
                className={`text-3xl font-bold ${
                  deal.dealScore.grade === "A"
                    ? "text-emerald-600"
                    : deal.dealScore.grade === "B"
                    ? "text-green-600"
                    : deal.dealScore.grade === "C"
                    ? "text-yellow-600"
                    : deal.dealScore.grade === "D"
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {deal.dealScore.grade}
              </div>
              <div className="text-xs text-gray-400">
                {deal.dealScore.totalScore}/100
              </div>
              <div className="text-xs font-medium text-gray-600 mt-0.5">
                {deal.dealScore.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {!deal.marketData && deal.city && deal.state && (
          <button
            onClick={runEnrichment}
            disabled={!!generating}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-medium rounded-xl flex items-center gap-2"
          >
            {generating === "market" && (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            🗺️ Enrich Market Data
          </button>
        )}

        {!deal.cashFlowModel && (
          <button
            onClick={runModel}
            disabled={!!generating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-xl flex items-center gap-2"
          >
            {generating === "model" && (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            📈 Build Cash Flow Model
          </button>
        )}

        {!deal.dealScore && (
          <button
            onClick={runScore}
            disabled={!!generating}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-xl flex items-center gap-2"
          >
            {generating === "score" && (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            ⭐ Score Deal
          </button>
        )}

        {!deal.investmentMemo && (
          <button
            onClick={runMemo}
            disabled={!!generating}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-medium rounded-xl flex items-center gap-2"
          >
            {generating === "memo" && (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            📝 Generate Memo
          </button>
        )}

        {/* Re-run buttons for existing data */}
        {deal.cashFlowModel && (
          <button
            onClick={runModel}
            disabled={!!generating}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl"
          >
            ↻ Re-run Model
          </button>
        )}
        {deal.investmentMemo && (
          <button
            onClick={runMemo}
            disabled={!!generating}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl"
          >
            ↻ Re-gen Memo
          </button>
        )}
      </div>

      {/* Model assumptions quick-edit */}
      {!deal.cashFlowModel && (
        <details className="mb-6 bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-700 cursor-pointer">
            ⚙️ Model Assumptions (click to customize)
          </summary>
          <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { key: "holdingPeriodYears", label: "Holding Period (yrs)", step: 1, min: 5, max: 10 },
              { key: "revenueGrowthRate", label: "Revenue Growth (%)", step: 0.5, min: 0, max: 10 },
              { key: "downPaymentPercent", label: "Down Payment (%)", step: 1, min: 5, max: 30 },
              { key: "sbaRate", label: "SBA Rate (%)", step: 0.25, min: 5, max: 12 },
              { key: "sbaTerm", label: "SBA Term (yrs)", step: 1, min: 7, max: 25 },
              { key: "exitMultiple", label: "Exit Multiple (x)", step: 0.5, min: 2, max: 6 },
            ].map(({ key, label, step, min, max }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input
                  type="number"
                  step={step}
                  min={min}
                  max={max}
                  value={modelOverrides[key as keyof typeof modelOverrides]}
                  onChange={(e) =>
                    setModelOverrides((prev) => ({
                      ...prev,
                      [key]: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            } ${
              (tab.id === "market" && !deal.marketData) ||
              (tab.id === "model" && !deal.cashFlowModel) ||
              (tab.id === "score" && !deal.dealScore) ||
              (tab.id === "memo" && !deal.investmentMemo)
                ? "opacity-50"
                : ""
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <ListingCard listing={listing} />}

      {activeTab === "market" && (
        deal.marketData ? (
          <MarketDataCard
            data={deal.marketData}
            city={deal.city ?? undefined}
            state={deal.state ?? undefined}
          />
        ) : (
          <EmptyState
            icon="🗺️"
            title="No market data yet"
            description={
              deal.city && deal.state
                ? "Click 'Enrich Market Data' to fetch Census demographics and competitor laundromats"
                : "City and state are required for market enrichment. Edit the deal to add location data."
            }
          />
        )
      )}

      {activeTab === "model" && (
        deal.cashFlowModel ? (
          <CashFlowTable model={deal.cashFlowModel} />
        ) : (
          <EmptyState
            icon="📈"
            title="No cash flow model yet"
            description="Click 'Build Cash Flow Model' to generate a 10-year projection with IRR, DSCR, and MOIC"
          />
        )
      )}

      {activeTab === "score" && (
        deal.dealScore ? (
          <DealScoreCard score={deal.dealScore} />
        ) : (
          <EmptyState
            icon="⭐"
            title="Deal not scored yet"
            description="Click 'Score Deal' to evaluate pricing, cash flow, market, operations, and risk"
          />
        )
      )}

      {activeTab === "memo" && (
        deal.investmentMemo ? (
          <InvestmentMemoCard
            memo={deal.investmentMemo}
            onPrint={() => window.print()}
          />
        ) : (
          <EmptyState
            icon="📝"
            title="No investment memo yet"
            description="Click 'Generate Memo' to create a first-pass investment memo using GPT-4o"
          />
        )
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
