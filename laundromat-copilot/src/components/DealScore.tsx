"use client";
import { DealScore } from "@/types/deal";

interface Props {
  score: DealScore;
}

const gradeColors: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-green-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
};

const recommendationColors: Record<string, string> = {
  "Strong Buy": "text-emerald-700 bg-emerald-50 border-emerald-200",
  Buy: "text-green-700 bg-green-50 border-green-200",
  Watch: "text-yellow-700 bg-yellow-50 border-yellow-200",
  Pass: "text-orange-700 bg-orange-50 border-orange-200",
  "Hard Pass": "text-red-700 bg-red-50 border-red-200",
};

function CategoryBar({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}) {
  const pct = (score / maxScore) * 100;
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
      ? "bg-green-500"
      : pct >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DealScoreCard({ score }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Deal Score</h2>
      </div>

      <div className="p-6">
        {/* Main score */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                gradeColors[score.grade] || "bg-gray-500"
              }`}
            >
              {score.grade}
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900">
              {score.totalScore}
              <span className="text-xl text-gray-400">/100</span>
            </div>
            <div
              className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                recommendationColors[score.recommendation] ||
                "text-gray-700 bg-gray-50 border-gray-200"
              }`}
            >
              {score.recommendation}
            </div>
          </div>
        </div>

        {/* Category bars */}
        <div className="mb-6">
          <CategoryBar
            label="Pricing"
            score={score.categories.pricing.score}
            maxScore={score.categories.pricing.maxScore}
          />
          <CategoryBar
            label="Cash Flow"
            score={score.categories.cashFlow.score}
            maxScore={score.categories.cashFlow.maxScore}
          />
          <CategoryBar
            label="Market"
            score={score.categories.market.score}
            maxScore={score.categories.market.maxScore}
          />
          <CategoryBar
            label="Operations"
            score={score.categories.operations.score}
            maxScore={score.categories.operations.maxScore}
          />
          <CategoryBar
            label="Risk Profile"
            score={score.categories.risk.score}
            maxScore={score.categories.risk.maxScore}
          />
        </div>

        {/* Strengths */}
        {score.strengths.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-1">
              <span>✓</span> Strengths
            </h3>
            <ul className="space-y-1">
              {score.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {score.weaknesses.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-1">
              <span>⚠</span> Weaknesses
            </h3>
            <ul className="space-y-1">
              {score.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Red flags */}
        {score.redFlags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <span>⛔</span> Red Flags
            </h3>
            <ul className="space-y-1">
              {score.redFlags.map((f, i) => (
                <li key={i} className="text-sm text-red-600 flex gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
