import { motion } from 'framer-motion';
import { mockAcquisition, sensitivityData } from '../../data/mockData';
import { formatCurrency } from '../ui/utils';

const financials = [
  { label: 'Purchase Price', value: formatCurrency(8_200_000, true), note: 'As-is', color: 'slate' },
  { label: 'Current NOI', value: '$612K', note: 'T12', color: 'blue' },
  { label: 'Stabilized NOI', value: '$740K', note: 'Yr 2', color: 'emerald' },
  { label: 'Cap Rate (Current)', value: '7.46%', note: 'On price', color: 'blue' },
  { label: 'Stabilized Cap Rate', value: '9.02%', note: 'On price', color: 'emerald' },
  { label: 'Loan Amount', value: '$5.33M', note: '65% LTV', color: 'slate' },
  { label: 'Interest Rate', value: '6.75%', note: '10-yr fixed', color: 'slate' },
  { label: 'Debt Service', value: '$444K', note: 'Annual', color: 'amber' },
  { label: 'DSCR (Current)', value: '1.38x', note: 'Min 1.25x', color: 'blue' },
  { label: 'Cash-on-Cash', value: '10.1%', note: 'Year 1', color: 'emerald' },
];

const colorMap = {
  slate: 'bg-slate-50 border-slate-200 text-slate-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
};

export default function Slide08_NOIFinancing() {
  const { nois, capRates, values } = sensitivityData;

  const getCellColor = (val) => {
    if (val > 8_200_000) return 'bg-emerald-50 text-emerald-800 font-semibold';
    if (val > 7_200_000) return 'bg-blue-50 text-blue-800';
    if (val < 6_000_000) return 'bg-red-50 text-red-700';
    return 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 08</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">NOI &amp; Financing Structure</h2>
        <p className="text-slate-500 text-sm mt-1">Underwriting assumptions, debt analysis, and sensitivity</p>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Left: financial metrics */}
        <div className="flex flex-col gap-3 w-56 flex-shrink-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Financial Metrics</p>
          <div className="grid grid-cols-2 gap-1.5">
            {financials.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-lg border p-2.5 ${colorMap[f.color]}`}
              >
                <p className="text-xs opacity-70">{f.label}</p>
                <p className="text-base font-bold mt-0.5">{f.value}</p>
                <p className="text-xs opacity-60">{f.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: sensitivity table */}
        <div className="flex-1 flex flex-col">
          {/* Debt service visualization */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3 bg-blue-900 rounded-xl p-4"
          >
            <p className="text-white/60 text-xs mb-2">NOI vs. Debt Service Coverage</p>
            <div className="flex items-end gap-2 h-12">
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 bg-blue-400 rounded-t" style={{ height: '100%' }} />
                <p className="text-white/70 text-xs">NOI $612K</p>
              </div>
              <div className="flex-1 flex items-center gap-2 pb-5">
                <div className="flex-1 h-0.5 bg-white/20" />
                <span className="text-white text-sm font-bold">DSCR 1.38x</span>
                <div className="flex-1 h-0.5 bg-white/20" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 bg-amber-400/80 rounded-t" style={{ height: `${444/612 * 100}%` }} />
                <p className="text-white/70 text-xs">DS $444K</p>
              </div>
            </div>
          </motion.div>

          {/* Sensitivity table */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-3 overflow-hidden"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Valuation Sensitivity — NOI vs. Cap Rate
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="bg-slate-800 text-white px-2 py-1.5 text-left rounded-tl-lg">NOI \ Cap</th>
                    {capRates.map(c => (
                      <th key={c} className="bg-slate-800 text-white px-2 py-1.5 text-center">
                        {(c * 100).toFixed(1)}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nois.map((noi, ri) => (
                    <tr key={ri}>
                      <td className="bg-slate-200 font-semibold px-2 py-1.5 text-slate-800">
                        ${(noi / 1000).toFixed(0)}K
                      </td>
                      {values[ri].map((val, ci) => (
                        <td key={ci} className={`px-2 py-1.5 text-center border border-white/50 ${getCellColor(val)}`}>
                          {formatCurrency(val, true)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 inline-block" /> Above ask</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 inline-block" /> Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Below ask</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
