import { motion } from 'framer-motion';
import { mockAcquisition } from '../../data/mockData';
import { formatCurrency } from '../ui/utils';

const items = [
  { category: 'Roof', condition: 'Fair', age: '16 yrs', cost: 45000, risk: 'medium', urgency: 'Yr 1-2', note: 'Partial replacement needed on Unit C' },
  { category: 'Asphalt', condition: 'Fair', age: '12 yrs', cost: 18000, risk: 'low', urgency: 'Yr 1', note: 'Crack seal & restripe; no full replacement needed' },
  { category: 'Security Systems', condition: 'Outdated', age: '8 yrs', cost: 22000, risk: 'medium', urgency: 'Immediate', note: 'Upgrade to IP cameras + smart access gates' },
  { category: 'LED Lighting', condition: 'Poor', age: '15 yrs', cost: 14500, risk: 'low', urgency: 'Yr 1', note: 'Full LED retrofit reduces utility 18%' },
  { category: 'Gate System', condition: 'Fair', age: '8 yrs', cost: 8500, risk: 'low', urgency: 'Yr 2', note: 'Keypads functional; software upgrade needed' },
  { category: 'Exterior Paint', condition: 'Worn', age: '7 yrs', cost: 12000, risk: 'low', urgency: 'Yr 1-2', note: 'Cosmetic; impacts marketing appeal' },
  { category: 'Climate HVAC', condition: 'Mixed', age: '9 yrs', cost: 28000, risk: 'medium', urgency: 'Yr 1-2', note: '3 units approaching end of life' },
];

const riskColors = {
  low: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: '#10b981' },
  medium: { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: '#f59e0b' },
  high: { badge: 'bg-red-50 text-red-700 border-red-200', bar: '#ef4444' },
};

const conditionMap = {
  'Good': { color: 'text-emerald-600', score: 90 },
  'Fair': { color: 'text-amber-600', score: 60 },
  'Worn': { color: 'text-amber-700', score: 50 },
  'Outdated': { color: 'text-red-600', score: 35 },
  'Poor': { color: 'text-red-600', score: 30 },
  'Mixed': { color: 'text-amber-600', score: 55 },
};

export default function Slide09_InfraCapex() {
  const total = mockAcquisition.capex.total;

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 09</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Infrastructure &amp; CapEx</h2>
            <p className="text-slate-500 text-sm mt-1">Physical condition assessment and capital expenditure planning</p>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(total, true)}</p>
              <p className="text-xs text-slate-500">Total CapEx reserve</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">$2.16/sf</p>
              <p className="text-xs text-slate-500">CapEx per sq ft</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk matrix grid */}
      <div className="flex gap-4 flex-1">
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead className="bg-slate-900 text-white">
                <tr>
                  {['Component', 'Condition', 'Age', 'Est. Cost', 'Risk', 'Urgency', 'Notes'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const cond = conditionMap[item.condition] || conditionMap['Fair'];
                  const rc = riskColors[item.risk];
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                    >
                      <td className="px-3 py-2.5 font-semibold text-slate-900">{item.category}</td>
                      <td className={`px-3 py-2.5 font-medium ${cond.color}`}>{item.condition}</td>
                      <td className="px-3 py-2.5 text-slate-500">{item.age}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">{formatCurrency(item.cost, true)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded border text-xs font-medium capitalize ${rc.badge}`}>
                          {item.risk}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{item.urgency}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs max-w-40 truncate" title={item.note}>
                        {item.note}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-amber-50 border-t border-amber-200">
                <tr>
                  <td colSpan={3} className="px-3 py-2.5 font-bold text-amber-800">Total CapEx Reserve</td>
                  <td className="px-3 py-2.5 font-bold text-amber-800">{formatCurrency(total)}</td>
                  <td colSpan={3} className="px-3 py-2.5 text-amber-600 text-xs">Recommended contingency: +10%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Condition score mini */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex flex-col w-44 gap-2"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Condition Score</p>
            {items.map((item, i) => {
              const score = conditionMap[item.condition]?.score || 50;
              const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-slate-600">{item.category}</span>
                    <span className="font-semibold" style={{ color }}>{score}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.5 + i * 0.07 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-900 rounded-xl p-3">
            <p className="text-white/60 text-xs mb-1">Overall Rating</p>
            <p className="text-white font-bold text-xl">Fair</p>
            <p className="text-white/70 text-xs mt-1">No critical deferred maintenance. CapEx addressable within 24 months.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
