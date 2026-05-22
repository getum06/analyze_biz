import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, AlertTriangle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ScoreBar } from '../ui/ScoreBar';
import { formatCurrency } from '../ui/utils';

const ratingConfig = {
  'Strong Buy': {
    icon: CheckCircle,
    bg: 'bg-emerald-900',
    border: 'border-emerald-700',
    accent: '#10b981',
    badge: 'bg-emerald-500',
  },
  'Moderate Buy': {
    icon: TrendingUp,
    bg: 'bg-blue-900',
    border: 'border-blue-700',
    accent: '#3b82f6',
    badge: 'bg-blue-500',
  },
  'Investigate': {
    icon: AlertTriangle,
    bg: 'bg-amber-900',
    border: 'border-amber-700',
    accent: '#f59e0b',
    badge: 'bg-amber-500',
  },
  'High Risk': {
    icon: AlertCircle,
    bg: 'bg-orange-900',
    border: 'border-orange-700',
    accent: '#f97316',
    badge: 'bg-orange-500',
  },
  'Reject': {
    icon: XCircle,
    bg: 'bg-red-900',
    border: 'border-red-700',
    accent: '#ef4444',
    badge: 'bg-red-500',
  },
};

const scoreLabels = {
  marketAttractiveness: 'Market Attractiveness',
  occupancyQuality: 'Occupancy Quality',
  noiQuality: 'NOI Quality',
  competitionRisk: 'Competition Risk',
  expansionPotential: 'Expansion Potential',
  financingViability: 'Financing Viability',
};

const scoreWeights = {
  marketAttractiveness: 22,
  occupancyQuality: 20,
  noiQuality: 20,
  competitionRisk: 14,
  expansionPotential: 12,
  financingViability: 12,
};

export function RecommendationPanel({ recommendation, scores, weightedScore, calcs }) {
  const [expanded, setExpanded] = useState(false);
  const config = ratingConfig[recommendation.label] || ratingConfig['Investigate'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      {/* Main recommendation card */}
      <div className={`rounded-xl border ${config.border} ${config.bg} p-4 text-white`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${config.badge} flex-shrink-0`}>
            <Icon size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-lg text-white">{recommendation.label}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/60 text-xs">Score:</span>
                <span className="text-2xl font-bold" style={{ color: config.accent }}>{weightedScore}</span>
              </div>
            </div>
            <p className="text-white/75 text-xs mt-1 leading-relaxed">{recommendation.description}</p>
          </div>
        </div>

        {/* Key metrics */}
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
          {[
            { label: 'Cap Rate', value: `${calcs.capRate}%` },
            { label: 'DSCR', value: `${calcs.dscr}x` },
            { label: 'Cash-on-Cash', value: `${calcs.cashOnCash}%` },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-bold text-white">{m.value}</p>
              <p className="text-white/50 text-xs">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Score breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <p className="text-sm font-bold text-slate-900">Score Breakdown</p>
          <button className="text-slate-400 hover:text-slate-600">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              {Object.entries(scores).map(([key, val]) => (
                <ScoreBar
                  key={key}
                  label={scoreLabels[key] || key}
                  score={val}
                  weight={scoreWeights[key]}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar when collapsed */}
        {!expanded && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Weighted Score</span>
              <span className="font-bold text-slate-900">{weightedScore} / 100</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                key={weightedScore}
                initial={{ width: 0 }}
                animate={{ width: `${weightedScore}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: config.accent }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Issues & Strengths */}
      {(recommendation.issues?.length > 0 || recommendation.strengths?.length > 0) && (
        <div className="space-y-2">
          {recommendation.issues?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wider">Critical Issues</p>
              {recommendation.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <AlertCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-800">{issue}</p>
                </div>
              ))}
            </div>
          )}
          {recommendation.strengths?.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wider">Key Strengths</p>
              {recommendation.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-800">{s}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Financial summary */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Financial Summary</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Annual Debt Service', value: formatCurrency(calcs.annualDebtService) },
            { label: 'Cash After Debt', value: formatCurrency(Math.max(0, calcs.cashAfterDebt)) },
            { label: 'LTV', value: `${calcs.ltv}%` },
            { label: 'NOI Margin', value: `${calcs.noiMargin}%` },
            { label: 'Stab. Cap Rate', value: `${calcs.stabCapRate}%` },
            { label: 'Equity', value: formatCurrency(calcs.equity, true) },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0 col-span-1">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
