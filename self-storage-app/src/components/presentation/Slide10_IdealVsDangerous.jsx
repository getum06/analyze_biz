import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const goodDeal = [
  { point: 'Growing market with strong population & household formation', emphasis: false },
  { point: 'Under-managed operations with clear NOI upside', emphasis: true },
  { point: 'Limited new supply pipeline (<1 facility in 3mi)', emphasis: false },
  { point: 'Expansion land or vertical unit potential on-site', emphasis: false },
  { point: 'Occupancy ≥85% with healthy market absorption', emphasis: true },
  { point: 'Modern security, kiosk, and online rental systems', emphasis: false },
  { point: 'DSCR >1.25x at current NOI; >1.4x at stabilized', emphasis: true },
  { point: 'Expense ratio <50% with benchmarked cost structure', emphasis: false },
];

const badDeal = [
  { point: 'Oversupplied market (>10 sf/capita or high pipeline)', emphasis: true },
  { point: 'Sub-80% occupancy with no clear demand catalyst', emphasis: true },
  { point: 'Heavy discounting — first month free + ongoing concessions', emphasis: false },
  { point: 'Significant deferred maintenance (roof, asphalt, HVAC)', emphasis: false },
  { point: 'Seller pro forma using aspirational rents, not T12 actuals', emphasis: true },
  { point: 'Tax reassessment risk post-sale not modeled in underwriting', emphasis: true },
  { point: 'REIT competitor within 1mi with superior product', emphasis: false },
  { point: 'Poor digital presence with no SEO or paid acquisition', emphasis: false },
];

export default function Slide10_IdealVsDangerous() {
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 10</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ideal vs. Dangerous Deals</h2>
        <p className="text-slate-500 text-sm mt-1">Pattern recognition framework for rapid deal screening</p>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Good Deal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500">
              <Check size={16} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-emerald-700">Strong Acquisition Candidate</h3>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-600 px-4 py-2">
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Green Flag Characteristics</p>
            </div>
            <div className="p-4 space-y-2">
              {goodDeal.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className={`flex items-start gap-3 p-2.5 rounded-lg ${item.emphasis ? 'bg-emerald-50 border border-emerald-100' : ''}`}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-emerald-600" />
                  </div>
                  <p className={`text-sm leading-relaxed ${item.emphasis ? 'text-emerald-900 font-medium' : 'text-slate-700'}`}>
                    {item.point}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center justify-center w-8">
          <div className="w-px h-full bg-slate-300" />
        </div>

        {/* Bad Deal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500">
              <X size={16} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-red-700">High-Risk / Pass Criteria</h3>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
            <div className="bg-red-600 px-4 py-2">
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Red Flag Characteristics</p>
            </div>
            <div className="p-4 space-y-2">
              {badDeal.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className={`flex items-start gap-3 p-2.5 rounded-lg ${item.emphasis ? 'bg-red-50 border border-red-100' : ''}`}
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X size={11} className="text-red-600" />
                  </div>
                  <p className={`text-sm leading-relaxed ${item.emphasis ? 'text-red-900 font-medium' : 'text-slate-700'}`}>
                    {item.point}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 p-3 bg-blue-900 rounded-xl"
      >
        <p className="text-white/90 text-xs">
          <strong className="text-white">Rule of thumb:</strong> If a deal has 2+ red flags from the emphasis items, it should require significant price reduction or exceptional circumstances to proceed. One red flag = investigate deeper before committing.
        </p>
      </motion.div>
    </div>
  );
}
