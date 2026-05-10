"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DealScore } from "@/types/deal";

interface DealSummary {
  id: string;
  businessName: string | null;
  city: string | null;
  state: string | null;
  askingPrice: number | null;
  grossRevenue: number | null;
  sde: number | null;
  status: string;
  extractionConfidence: number | null;
  createdAt: string;
  dealScore: DealScore | null;
}

function fmt(n?: number | null): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  analyzed: "bg-blue-100 text-blue-700",
  scored: "bg-purple-100 text-purple-700",
  memo_ready: "bg-emerald-100 text-emerald-700",
};

const gradeColors: Record<string, string> = {
  A: "text-emerald-600",
  B: "text-green-600",
  C: "text-yellow-600",
  D: "text-orange-600",
  F: "text-red-600",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<DealSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((d) => {
        setDeals(d.deals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Delete this deal?")) return;
    await fetch(`/api/deals/${id}`, { method: "DELETE" });
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading deals...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Deals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
        >
          + New Analysis
        </Link>
      </div>

      {deals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">🪣</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No deals yet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Start by analyzing a laundromat listing
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
          >
            Analyze Your First Deal
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => {
            const multiple =
              deal.askingPrice && deal.sde
                ? (deal.askingPrice / deal.sde).toFixed(2)
                : null;

            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="block bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-base font-semibold text-gray-900 truncate">
                        {deal.businessName || "Unnamed Laundromat"}
                      </h2>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${
                          statusColors[deal.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {deal.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {[deal.city, deal.state].filter(Boolean).join(", ") ||
                        "Location unknown"}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Price: </span>
                        <span className="font-semibold text-gray-800">
                          {fmt(deal.askingPrice)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Revenue: </span>
                        <span className="font-semibold text-gray-800">
                          {fmt(deal.grossRevenue)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">SDE: </span>
                        <span className="font-semibold text-gray-800">
                          {fmt(deal.sde)}
                        </span>
                      </div>
                      {multiple && (
                        <div>
                          <span className="text-gray-400">Multiple: </span>
                          <span className="font-semibold text-gray-800">
                            {multiple}x
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                    {deal.dealScore && (
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${
                            gradeColors[deal.dealScore.grade] || "text-gray-600"
                          }`}
                        >
                          {deal.dealScore.grade}
                        </div>
                        <div className="text-xs text-gray-400">
                          {deal.dealScore.totalScore}/100
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => handleDelete(deal.id, e)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-lg"
                      title="Delete deal"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  {new Date(deal.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
