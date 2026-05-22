import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const metrics = [
  { label: 'Population Growth', value: 88, benchmark: 70, unit: '3.8% YoY', status: 'strong' },
  { label: 'Household Growth', value: 82, benchmark: 65, unit: '3.1% YoY', status: 'strong' },
  { label: 'Apartment Density', value: 74, benchmark: 60, unit: '31% of units', status: 'good' },
  { label: 'Small Biz Density', value: 71, benchmark: 55, unit: '18 per 1K pop', status: 'good' },
  { label: 'Income Levels', value: 85, benchmark: 70, unit: '$118K median HHI', status: 'strong' },
  { label: 'Employment Growth', value: 79, benchmark: 65, unit: '2.9% YoY', status: 'good' },
  { label: 'Residential Turnover', value: 68, benchmark: 60, unit: '14.2% annually', status: 'moderate' },
];

const radarData = metrics.map(m => ({ subject: m.label.split(' ')[0], score: m.value, benchmark: m.benchmark }));

const statusColors = {
  strong: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  good: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  moderate: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  weak: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200' },
};

export default function Slide03_MarketFundamentals() {
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 03</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Market Fundamentals</h2>
            <p className="text-slate-500 text-sm mt-1">Demand-driver analysis — Frisco / Collin County, TX</p>
          </div>
          <div className="hidden sm:block px-3 py-1.5 bg-emerald-100 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 text-xs font-bold">Market Score: 84 / 100</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Left: scorecard */}
        <div className="flex-1 space-y-2">
          {metrics.map((m, i) => {
            const c = statusColors[m.status];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                <p className="text-sm font-medium text-slate-800 w-36 flex-shrink-0">{m.label}</p>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                    className="h-full rounded-full bg-blue-900"
                  />
                </div>
                <span className="text-xs text-slate-500 w-24 text-right flex-shrink-0">{m.unit}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${c.badge} flex-shrink-0`}>
                  {m.value}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Right: radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex flex-col w-56 bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Market Radar</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar name="Score" dataKey="score" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-900" />
              <span className="text-slate-500">Market score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-emerald-500 border-dashed" />
              <span className="text-slate-500">Benchmark</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
