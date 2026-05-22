import { motion } from 'framer-motion';

const riskCategories = [
  {
    category: 'Market Risk',
    factors: [
      { name: 'Population Decline', impact: 'HIGH', probability: 'LOW' },
      { name: 'Oversupply', impact: 'HIGH', probability: 'MED' },
      { name: 'REIT Expansion', impact: 'MED', probability: 'MED' },
    ]
  },
  {
    category: 'Operational Risk',
    factors: [
      { name: 'Management Change', impact: 'MED', probability: 'LOW' },
      { name: 'Delinquency Spike', impact: 'MED', probability: 'LOW' },
      { name: 'Rate Compression', impact: 'HIGH', probability: 'LOW' },
    ]
  },
  {
    category: 'Financial Risk',
    factors: [
      { name: 'Rate Increase', impact: 'HIGH', probability: 'LOW' },
      { name: 'Tax Reassessment', impact: 'MED', probability: 'MED' },
      { name: 'CapEx Overrun', impact: 'LOW', probability: 'MED' },
    ]
  },
  {
    category: 'Physical Risk',
    factors: [
      { name: 'Roof Failure', impact: 'MED', probability: 'LOW' },
      { name: 'Flood / Storm', impact: 'HIGH', probability: 'LOW' },
      { name: 'Security Breach', impact: 'LOW', probability: 'LOW' },
    ]
  },
];

const impactColors = {
  HIGH: 'text-red-700',
  MED: 'text-amber-600',
  LOW: 'text-emerald-700',
};

const cellColors = {
  'HIGH-HIGH': 'bg-red-500 text-white',
  'HIGH-MED': 'bg-orange-400 text-white',
  'HIGH-LOW': 'bg-amber-300 text-slate-900',
  'MED-HIGH': 'bg-orange-400 text-white',
  'MED-MED': 'bg-amber-300 text-slate-900',
  'MED-LOW': 'bg-yellow-100 text-slate-700',
  'LOW-HIGH': 'bg-amber-300 text-slate-900',
  'LOW-MED': 'bg-yellow-100 text-slate-700',
  'LOW-LOW': 'bg-emerald-100 text-emerald-900',
};

export function RiskHeatmap({ scores }) {
  const avgScore = scores ? Object.values(scores).reduce((s, v) => s + v, 0) / Object.values(scores).length : 75;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-slate-900">Risk Heatmap</p>
        <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          avgScore >= 70 ? 'bg-emerald-100 text-emerald-700' :
          avgScore >= 55 ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {avgScore >= 70 ? 'LOW' : avgScore >= 55 ? 'MODERATE' : 'HIGH'} OVERALL RISK
        </div>
      </div>

      <div className="space-y-3">
        {riskCategories.map((cat, ci) => (
          <motion.div
            key={ci}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ci * 0.08 }}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{cat.category}</p>
            <div className="space-y-1">
              {cat.factors.map((f, fi) => {
                const cellKey = `${f.impact}-${f.probability}`;
                const cellColor = cellColors[cellKey] || 'bg-slate-100 text-slate-600';
                return (
                  <div key={fi} className="flex items-center gap-2">
                    <p className="text-xs text-slate-600 w-32 flex-shrink-0">{f.name}</p>
                    <div className="flex-1 flex gap-1">
                      <span className={`flex-1 text-center text-xs font-medium py-0.5 rounded ${
                        f.impact === 'HIGH' ? 'bg-red-50 text-red-600' :
                        f.impact === 'MED' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {f.impact} impact
                      </span>
                      <span className={`flex-1 text-center text-xs font-medium py-0.5 rounded ${
                        f.probability === 'HIGH' ? 'bg-red-50 text-red-600' :
                        f.probability === 'MED' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {f.probability} prob.
                      </span>
                    </div>
                    <span className={`w-16 text-center text-xs font-bold py-0.5 rounded ${cellColor}`}>
                      {cellKey === 'HIGH-HIGH' || cellKey === 'HIGH-MED' || cellKey === 'MED-HIGH' ? 'WATCH' :
                       cellKey === 'HIGH-LOW' || cellKey === 'MED-MED' ? 'MONITOR' : 'LOW'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" /> Watch</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-300 inline-block" /> Monitor</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-100 inline-block" /> Low</span>
      </div>
    </div>
  );
}
