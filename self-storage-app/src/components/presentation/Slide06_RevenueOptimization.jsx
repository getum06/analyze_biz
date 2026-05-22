import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockAcquisition } from '../../data/mockData';
import { formatCurrency } from '../ui/utils';

const opportunities = [
  { label: 'Dynamic Pricing', current: 0, upside: 48000, category: 'Revenue', effort: 'Low', timeframe: '30 days' },
  { label: 'Rate Increase to Mkt', current: 0, upside: 62000, category: 'Revenue', effort: 'Low', timeframe: '60 days' },
  { label: 'Insurance Revenue', current: 12000, upside: 22000, category: 'Ancillary', effort: 'Low', timeframe: '30 days' },
  { label: 'Admin / Move-in Fees', current: 4200, upside: 8400, category: 'Ancillary', effort: 'Low', timeframe: 'Immediate' },
  { label: 'Late Fee Optimization', current: 6800, upside: 11200, category: 'Ancillary', effort: 'Low', timeframe: '30 days' },
  { label: 'RV / Boat Storage', current: 0, upside: 18000, category: 'Expansion', effort: 'Med', timeframe: '90 days' },
  { label: 'Digital Marketing', current: 8000, upside: 15600, category: 'Demand', effort: 'Med', timeframe: '60 days' },
];

const chartData = opportunities.map(o => ({
  name: o.label.split(' ').slice(0, 2).join(' '),
  upside: o.upside,
}));

const categoryColors = {
  Revenue: '#1e3a8a',
  Ancillary: '#10b981',
  Expansion: '#8b5cf6',
  Demand: '#f59e0b',
};

const effortColors = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Med: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-red-50 text-red-700 border-red-200',
};

export default function Slide06_RevenueOptimization() {
  const totalUpside = opportunities.reduce((s, o) => s + o.upside, 0);
  const currentNOI = mockAcquisition.currentNOI;
  const stabilizedNOI = mockAcquisition.stabilizedNOI;

  return (
    <div className="w-full h-full bg-white flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 06</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Revenue Optimization</h2>
            <p className="text-slate-500 text-sm mt-1">Identified upside opportunities from current operations</p>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalUpside, true)}</p>
              <p className="text-xs text-slate-500">Total identified upside</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stabilizedNOI, true)}</p>
              <p className="text-xs text-slate-500">Stabilized NOI target</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NOI bridge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 p-3 bg-blue-900 rounded-xl mb-4"
      >
        <div className="text-white text-center px-4">
          <p className="text-xs text-white/60">Current NOI</p>
          <p className="text-xl font-bold">{formatCurrency(currentNOI, true)}</p>
        </div>
        <div className="flex-1 flex items-center gap-1">
          {opportunities.map((o, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-6 rounded" style={{ backgroundColor: categoryColors[o.category] || '#64748b', opacity: 0.8 }} />
              <p className="text-white/50 text-xs mt-0.5 hidden lg:block">+{(o.upside / 1000).toFixed(0)}K</p>
            </div>
          ))}
        </div>
        <div className="text-white text-center px-4">
          <p className="text-xs text-white/60">Stabilized NOI</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(stabilizedNOI, true)}</p>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Table */}
        <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Initiative', 'Category', 'Annual Upside', 'Effort', 'Timeline'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                >
                  <td className="px-3 py-2.5 font-medium text-slate-900">{o.label}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${categoryColors[o.category]}15`, color: categoryColors[o.category] }}>
                      {o.category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-bold text-emerald-700">{formatCurrency(o.upside)}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${effortColors[o.effort]}`}>{o.effort}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-500">{o.timeframe}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot className="bg-blue-900 text-white">
              <tr>
                <td colSpan={2} className="px-3 py-2.5 font-bold">Total Identified Revenue Upside</td>
                <td className="px-3 py-2.5 font-bold text-emerald-400">{formatCurrency(totalUpside)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex flex-col w-48 bg-slate-50 rounded-xl border border-slate-200 p-3"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upside by Item</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 8 }} tickFormatter={v => `$${v / 1000}K`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 8 }} width={60} />
                <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="upside" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={['#1e3a8a', '#1e40af', '#10b981', '#10b981', '#10b981', '#8b5cf6', '#f59e0b'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
