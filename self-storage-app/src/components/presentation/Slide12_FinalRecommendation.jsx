import { motion } from 'framer-motion';
import { Check, AlertTriangle, X, ChevronRight } from 'lucide-react';

const decisions = [
  {
    label: 'Strong Buy',
    color: '#10b981',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-300',
    icon: Check,
    iconBg: 'bg-emerald-500',
    criteria: [
      'Weighted score ≥ 75',
      'DSCR ≥ 1.30x at current NOI',
      'Market occupancy ≥ 88%',
      'Clear NOI upside path',
      'Limited new supply risk',
    ],
    action: 'Proceed to LOI & full due diligence immediately',
  },
  {
    label: 'Investigate Further',
    color: '#f59e0b',
    bgLight: 'bg-amber-50',
    border: 'border-amber-300',
    icon: AlertTriangle,
    iconBg: 'bg-amber-500',
    criteria: [
      'Score 50–74 with resolvable gaps',
      'One significant risk factor present',
      'Occupancy 78–85% with demand catalyst',
      'NOI at or above debt service',
      'CapEx addressable within budget',
    ],
    action: 'Order third-party reports; negotiate price adjustments',
  },
  {
    label: 'Reject',
    color: '#ef4444',
    bgLight: 'bg-red-50',
    border: 'border-red-300',
    icon: X,
    iconBg: 'bg-red-500',
    criteria: [
      'Score < 50',
      'DSCR < 1.10x at current NOI',
      'Oversupplied market or declining demand',
      '2+ major red flags unresolved',
      'Seller pro forma unsupportable',
    ],
    action: 'Pass or request significant price reduction (>15%)',
  },
];

const redFlags = [
  'Sub-1.0x DSCR at current operations',
  'Physical occupancy <75%',
  'Sq ft per capita >12 (oversupplied)',
  'Unresolved environmental or title issues',
  'Tax reassessment >$50K not modeled',
  'REIT within 0.5mi with dominant share',
];

export default function Slide12_FinalRecommendation() {
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 12</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Final Recommendation Framework</h2>
        <p className="text-slate-500 text-sm mt-1">Decision criteria, gating factors, and major red flags</p>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Decision cards */}
        <div className="flex-1 grid grid-cols-3 gap-3">
          {decisions.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className={`rounded-xl border-2 ${d.bgLight} ${d.border} flex flex-col overflow-hidden`}
            >
              <div className="px-4 py-3 flex items-center gap-2.5" style={{ backgroundColor: d.color }}>
                <div className={`w-7 h-7 rounded-full ${d.iconBg} flex items-center justify-center`}>
                  <d.icon size={15} className="text-white" />
                </div>
                <p className="text-white font-bold text-base">{d.label}</p>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <ul className="space-y-2 flex-1">
                  {d.criteria.map((c, ci) => (
                    <li key={ci} className="flex items-start gap-2">
                      <ChevronRight size={13} className="flex-shrink-0 mt-0.5" style={{ color: d.color }} />
                      <p className="text-xs text-slate-700 leading-relaxed">{c}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t" style={{ borderColor: `${d.color}30` }}>
                  <p className="text-xs font-semibold" style={{ color: d.color }}>{d.action}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Red flags sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex flex-col w-44 gap-3"
        >
          <div className="bg-red-900 rounded-xl p-3">
            <p className="text-white font-bold text-sm mb-3">⚠ Hard Red Flags</p>
            <p className="text-red-200 text-xs mb-2">Any single item = automatic review required</p>
            <ul className="space-y-1.5">
              {redFlags.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-start gap-1.5"
                >
                  <X size={11} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-200 text-xs leading-relaxed">{f}</p>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-900 rounded-xl p-3">
            <p className="text-white font-bold text-sm mb-2">Current Deal</p>
            <div className="text-center py-2">
              <p className="text-3xl font-bold text-emerald-400">79.7</p>
              <p className="text-emerald-300 text-sm font-bold mt-0.5">Moderate Buy</p>
              <p className="text-white/50 text-xs mt-2">Sundance Storage<br />Frisco, TX</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 p-3 bg-white border border-slate-200 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-800">DFW Mock Deal Verdict:</strong> Moderate Buy — All gating criteria met. DSCR adequate, market growth strong, CapEx manageable. Recommend LOI at $8.0M with Phase I environmental & independent appraisal.
          </p>
          <span className="flex-shrink-0 ml-4 px-3 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-lg">Proceed to Due Diligence</span>
        </div>
      </motion.div>
    </div>
  );
}
