import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { expenseData } from '../../data/mockData';
import { formatCurrency } from '../ui/utils';

const totalExpenses = expenseData.reduce((s, e) => s + e.amount, 0);
const totalBenchmark = expenseData.reduce((s, e) => s + e.benchmark, 0);

const COLORS = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#10b981', '#34d399', '#6366f1', '#a78bfa'];

export default function Slide07_ExpenseStructure() {
  const pieData = expenseData.map((e, i) => ({ name: e.category, value: e.amount }));

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 07</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Expense Structure</h2>
            <p className="text-slate-500 text-sm mt-1">Operating cost analysis with industry benchmarks</p>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpenses, true)}</p>
              <p className="text-xs text-slate-500">Total OpEx (current)</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">42.0%</p>
              <p className="text-xs text-slate-500">Expense ratio</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Waterfall / bar table */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Expense Waterfall vs. Benchmark</p>
          <div className="space-y-2">
            {expenseData.map((e, i) => {
              const vsB = e.amount - e.benchmark;
              const over = vsB > 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <p className="text-xs text-slate-700 w-28 flex-shrink-0 font-medium">{e.category}</p>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(e.amount / 100000) * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                        className="h-full rounded"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <div
                        className="absolute top-0 h-full border-r-2 border-dashed border-slate-400"
                        style={{ left: `${(e.benchmark / 100000) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-900 font-semibold w-16 text-right flex-shrink-0">
                      {formatCurrency(e.amount, true)}
                    </span>
                    <span className={`text-xs font-medium w-12 text-right flex-shrink-0 ${over ? 'text-red-500' : 'text-emerald-600'}`}>
                      {over ? '+' : ''}{formatCurrency(vsB, true)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3 h-3 bg-blue-900 rounded-sm" /> Current
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3 h-px border-t-2 border-dashed border-slate-400" /> Benchmark
            </div>
            <div className="ml-auto text-xs text-slate-500">
              vs. Benchmark: <span className="font-semibold text-amber-600">+{formatCurrency(totalExpenses - totalBenchmark, true)}</span>
            </div>
          </div>
        </div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex flex-col w-48 bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">OpEx Mix</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1">
            {expenseData.slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-600 flex-1 truncate">{e.category}</span>
                <span className="text-xs font-medium text-slate-900">{e.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
