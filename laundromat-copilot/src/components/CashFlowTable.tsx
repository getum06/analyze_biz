"use client";
import { CashFlowModel } from "@/types/deal";
import { useState } from "react";

interface Props {
  model: CashFlowModel;
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toFixed(0)}K`;
  }
  return `$${n.toLocaleString()}`;
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function CashFlowTable({ model }: Props) {
  const [showAllYears, setShowAllYears] = useState(false);
  const years = showAllYears ? model.years : model.years.slice(0, 5);

  const { summary, financing, assumptions } = model;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Cash Flow Model ({assumptions.holdingPeriodYears}-Year)
        </h2>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-gray-100">
        <div className="p-5 border-r border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            IRR
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {pct(summary.irr)}
          </div>
        </div>
        <div className="p-5 border-r border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            MOIC
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {summary.moic.toFixed(2)}x
          </div>
        </div>
        <div className="p-5 border-r border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Min DSCR
          </div>
          <div
            className={`text-2xl font-bold mt-1 ${
              summary.minDSCR >= 1.25
                ? "text-emerald-600"
                : summary.minDSCR >= 1.0
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {summary.minDSCR.toFixed(2)}x
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Exit Value
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {fmt(summary.exitValue)}
          </div>
        </div>
      </div>

      {/* Financing structure */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm">
        <div className="flex flex-wrap gap-4 text-gray-600">
          <span>
            <span className="font-medium text-gray-800">Down:</span>{" "}
            {fmt(financing.downPayment)}
          </span>
          <span>
            <span className="font-medium text-gray-800">SBA:</span>{" "}
            {fmt(financing.sbaLoanAmount)} @ {financing.sbaRate}%/
            {financing.sbaTerm}yr
          </span>
          {financing.sellerFinancingAmount > 0 && (
            <span>
              <span className="font-medium text-gray-800">Seller:</span>{" "}
              {fmt(financing.sellerFinancingAmount)} @{" "}
              {financing.sellerFinancingRate}%/{financing.sellerFinancingTerm}yr
            </span>
          )}
          <span>
            <span className="font-medium text-gray-800">Annual DS:</span>{" "}
            {fmt(financing.annualDebtService)}
          </span>
        </div>
      </div>

      {/* Year-by-year table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="text-left px-4 py-3 font-medium sticky left-0 bg-slate-800 z-10 min-w-[140px]">
                Metric
              </th>
              {years.map((y) => (
                <th
                  key={y.year}
                  className="text-right px-4 py-3 font-medium min-w-[90px]"
                >
                  Year {y.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: "Gross Revenue",
                values: years.map((y) => fmt(y.grossRevenue)),
                bold: false,
              },
              {
                label: "COGS",
                values: years.map((y) => `(${fmt(y.cogs)})`),
                bold: false,
              },
              {
                label: "Gross Profit",
                values: years.map((y) => fmt(y.grossProfit)),
                bold: false,
              },
              {
                label: "— Rent",
                values: years.map(
                  (y) => `(${fmt(y.operatingExpenses.rent)})`
                ),
                bold: false,
                indent: true,
              },
              {
                label: "— Utilities",
                values: years.map(
                  (y) => `(${fmt(y.operatingExpenses.utilities)})`
                ),
                bold: false,
                indent: true,
              },
              {
                label: "— Labor",
                values: years.map(
                  (y) => `(${fmt(y.operatingExpenses.labor)})`
                ),
                bold: false,
                indent: true,
              },
              {
                label: "— Maintenance",
                values: years.map(
                  (y) => `(${fmt(y.operatingExpenses.maintenance)})`
                ),
                bold: false,
                indent: true,
              },
              {
                label: "— Other OpEx",
                values: years.map((y) =>
                  fmt(
                    y.operatingExpenses.supplies +
                      y.operatingExpenses.insurance +
                      y.operatingExpenses.marketing +
                      y.operatingExpenses.other
                  )
                ),
                bold: false,
                indent: true,
              },
              {
                label: "EBITDA",
                values: years.map((y) => fmt(y.ebitda)),
                bold: true,
              },
              {
                label: "EBITDA Margin",
                values: years.map((y) => pct(y.ebitdaMargin)),
                bold: false,
                muted: true,
              },
              {
                label: "Debt Service",
                values: years.map((y) => `(${fmt(y.debtService)})`),
                bold: false,
              },
              {
                label: "Free Cash Flow",
                values: years.map((y) => fmt(y.freeCashFlow)),
                bold: true,
                highlight: true,
              },
              {
                label: "CoC Return",
                values: years.map((y) => pct(y.cashOnCashReturn)),
                bold: false,
                muted: true,
              },
              {
                label: "DSCR",
                values: years.map((y) =>
                  y.debtService > 0 ? `${y.dscr.toFixed(2)}x` : "—"
                ),
                bold: false,
                colored: true,
                colorValues: years.map((y) =>
                  y.dscr >= 1.25
                    ? "text-emerald-600"
                    : y.dscr >= 1.0
                    ? "text-yellow-600"
                    : "text-red-600"
                ),
              },
            ].map((row, i) => (
              <tr
                key={i}
                className={`${
                  row.highlight
                    ? "bg-blue-50 font-semibold"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } border-b border-gray-100`}
              >
                <td
                  className={`px-4 py-2.5 sticky left-0 z-10 border-r border-gray-100 ${
                    row.highlight ? "bg-blue-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${row.indent ? "pl-8 text-gray-500" : ""} ${
                    row.bold ? "font-semibold text-gray-900" : "text-gray-700"
                  }`}
                >
                  {row.label}
                </td>
                {row.values.map((v, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 text-right ${
                      row.bold ? "font-semibold text-gray-900" : ""
                    } ${row.muted ? "text-gray-500" : ""} ${
                      row.colored && row.colorValues
                        ? row.colorValues[j]
                        : ""
                    }`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-100">
        <button
          onClick={() => setShowAllYears(!showAllYears)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAllYears
            ? "Show 5 years"
            : `Show all ${assumptions.holdingPeriodYears} years`}
        </button>
        <span className="text-xs text-gray-400">
          Assumes {assumptions.revenueGrowthRate}% annual revenue growth •{" "}
          {assumptions.exitMultiple}x exit multiple
        </span>
      </div>
    </div>
  );
}
