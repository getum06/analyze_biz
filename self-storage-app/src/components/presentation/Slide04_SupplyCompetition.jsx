import { motion } from 'framer-motion';
import { competitorData } from '../../data/mockData';

const supplyMetrics = [
  { label: 'Sq Ft Per Capita', value: '7.2', benchmark: '< 9.0', risk: 'low', note: 'Below oversupply threshold' },
  { label: 'Competitor Count (3mi)', value: '6', benchmark: '< 8', risk: 'low', note: 'Manageable density' },
  { label: 'Market Occupancy', value: '91.2%', benchmark: '> 88%', risk: 'low', note: 'Healthy absorption' },
  { label: 'New Supply Pipeline', value: '42K sf', benchmark: '< 80K', risk: 'medium', note: '1 facility in permitting' },
  { label: 'REIT Presence', value: '2 locations', benchmark: '< 3', risk: 'medium', note: 'Public Storage nearby' },
  { label: 'Pricing Pressure', value: 'Moderate', benchmark: 'Low-Med', risk: 'medium', note: 'Concessions at 2 comps' },
];

const riskColors = {
  low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  medium: 'bg-amber-50 border-amber-200 text-amber-700',
  high: 'bg-red-50 border-red-200 text-red-700',
};

const riskDots = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

export default function Slide04_SupplyCompetition() {
  return (
    <div className="w-full h-full bg-white flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 04</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Supply &amp; Competition</h2>
            <p className="text-slate-500 text-sm mt-1">Competitive positioning and new supply risk analysis</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {['Low', 'Medium', 'High'].map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className={`w-2 h-2 rounded-full ${['bg-emerald-500','bg-amber-500','bg-red-500'][i]}`} />
                {r} Risk
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Left: supply metrics */}
        <div className="w-64 flex-shrink-0 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Supply Risk Indicators</p>
          {supplyMetrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-lg border p-3 ${riskColors[m.risk]}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-xs">{m.label}</p>
                  <p className="text-lg font-bold mt-0.5">{m.value}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${riskDots[m.risk]}`} />
              </div>
              <p className="text-xs opacity-75 mt-1">{m.note}</p>
              <p className="text-xs opacity-60 mt-0.5">Benchmark: {m.benchmark}</p>
            </motion.div>
          ))}
        </div>

        {/* Right: competitive table */}
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Competitive Landscape — 4mi Radius</p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-900 text-white">
                <tr>
                  {['Competitor', 'Distance', 'Occupancy', 'Sq Ft', 'Climate', 'Rating'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitorData.map((c, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-900">{c.name}</td>
                    <td className="px-3 py-2.5 text-slate-600">{c.distance}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full max-w-12">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.occupancy}%`,
                              backgroundColor: c.occupancy >= 90 ? '#10b981' : c.occupancy >= 80 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span className="font-semibold">{c.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{(c.sqft / 1000).toFixed(0)}K sf</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${c.climate ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {c.climate ? '✓ CC' : 'Non-CC'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-amber-600 font-semibold">★ {c.rating}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Risk summary box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-3 grid grid-cols-3 gap-2"
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <p className="text-emerald-700 font-bold text-lg">LOW</p>
              <p className="text-emerald-600 text-xs">Supply Risk</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-amber-700 font-bold text-lg">MOD</p>
              <p className="text-amber-600 text-xs">REIT Risk</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <p className="text-emerald-700 font-bold text-lg">LOW</p>
              <p className="text-emerald-600 text-xs">Pricing Risk</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
