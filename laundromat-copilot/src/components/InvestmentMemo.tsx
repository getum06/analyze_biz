"use client";
import { InvestmentMemo } from "@/types/deal";
import ReactMarkdown from "react-markdown";

interface Props {
  memo: InvestmentMemo;
  onPrint?: () => void;
}

function MemoSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-3 pb-2 border-b border-gray-200">
        {title}
      </h3>
      <div className="prose prose-sm max-w-none text-gray-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export function InvestmentMemoCard({ memo, onPrint }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Investment Memo
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Generated {new Date(memo.generatedAt).toLocaleString()} · First-pass analysis only
          </p>
        </div>
        {onPrint && (
          <button
            onClick={onPrint}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 border border-blue-200 rounded-lg"
          >
            Print / Export
          </button>
        )}
      </div>

      <div className="p-6 lg:p-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">
            Executive Summary
          </h3>
          <div className="prose prose-sm max-w-none text-blue-900">
            <ReactMarkdown>{memo.executiveSummary}</ReactMarkdown>
          </div>
        </div>

        <MemoSection title="Deal Overview" content={memo.dealOverview} />
        <MemoSection
          title="Financial Analysis"
          content={memo.financialAnalysis}
        />
        <MemoSection title="Market Analysis" content={memo.marketAnalysis} />
        <MemoSection
          title="Operations Assessment"
          content={memo.operationsAssessment}
        />
        <MemoSection
          title="Investment Thesis"
          content={memo.investmentThesis}
        />
        <MemoSection title="Risk Factors" content={memo.riskFactors} />
        <MemoSection title="Deal Structure" content={memo.dealStructure} />

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Recommendation
          </h3>
          <div className="prose prose-sm max-w-none text-slate-700">
            <ReactMarkdown>{memo.recommendation}</ReactMarkdown>
          </div>
        </div>

        {memo.nextSteps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 pb-2 border-b border-gray-200">
              Next Steps
            </h3>
            <ol className="space-y-2">
              {memo.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            This is an AI-generated first-pass memo for informational purposes only. 
            All figures and projections should be independently verified through due diligence. 
            This does not constitute investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}
