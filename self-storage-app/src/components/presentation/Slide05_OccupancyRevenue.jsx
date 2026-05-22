import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { occupancyTrendData } from '../../data/mockData';
import { OccupancyGauge } from '../ui/OccupancyGauge';

const kpis = [
  { label: 'Physical Occupancy', value: '87.0%', delta: '+2.4%', good: true },
  { label: 'Economic Occupancy', value: '83.0%', delta: '+1.8%', good: true },
  { label: 'Delinquency Rate', value: '2.4%', delta: '-0.6%', good: true },
  { label: 'Avg Rent / SF', value: '$1.39', delta: '+$0.09', good: true },
  { label: 'Market Rent / SF', value: '$1.52', delta: 'Upside', good: true },
  { label: 'Move-in Rate', value: '11.2%', delta: '+0.8%', good: true },
];

export default function Slide05_OccupancyRevenue() {
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 05</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Occupancy &amp; Revenue Analysis</h2>
        <p className="text-slate-500 text-sm mt-1">Trailing 12-month operational performance — Sundance Storage, Frisco TX</p>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Left: KPIs + gauges */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3">
          <div className="flex gap-2 justify-center">
            <OccupancyGauge value={87} label="Physical" size={110} />
            <OccupancyGauge value={83} label="Economic" size={110} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {kpis.map((k, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-sm"
              >
                <p className="text-xs text-slate-500 leading-tight">{k.label}</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{k.value}</p>
                <p className={`text-xs font-medium ${k.good ? 'text-emerald-600' : 'text-red-600'}`}>{k.delta}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-900">Occupancy Trend — TTM</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-900 inline-block rounded" />Physical</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />Economic</span>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[70, 96]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  formatter={(v, name) => [`${v}%`, name === 'physical' ? 'Physical' : 'Economic']}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="physical" stroke="#1e3a8a" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="economic" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Move-in/out trend */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
            {[
              { label: 'Net Move-ins (Q4)', value: '+22', color: 'text-emerald-600' },
              { label: 'Concessions Active', value: '8%', color: 'text-amber-600' },
              { label: 'Revenue Growth YoY', value: '+4.4%', color: 'text-blue-700' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
