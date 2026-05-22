import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { noiTrendData, occupancyTrendData, revenueMixData, expenseData } from '../../data/mockData';
import { formatCurrency } from '../ui/utils';

function ChartCard({ title, subtitle, children, className }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 ${className || ''}`}>
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function NOITrendChart() {
  return (
    <ChartCard title="NOI & Revenue Trend" subtitle="Historical and projected (2021–2026E)">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={noiTrendData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `$${v/1000}K`} />
          <Tooltip
            formatter={(v, name) => [formatCurrency(v), name === 'noi' ? 'NOI' : 'Revenue']}
            contentStyle={{ fontSize: 11, borderRadius: 8 }}
          />
          <Legend formatter={v => v === 'noi' ? 'NOI' : 'Revenue'} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="revenue" fill="#dbeafe" radius={[4, 4, 0, 0]} name="Revenue" />
          <Bar dataKey="noi" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="NOI" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function OccupancyChart() {
  return (
    <ChartCard title="Occupancy Trends" subtitle="Physical vs. economic occupancy — TTM">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={occupancyTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <YAxis domain={[72, 96]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={(v, n) => [`${v}%`, n === 'physical' ? 'Physical' : 'Economic']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          <Line type="monotone" dataKey="physical" stroke="#1e3a8a" strokeWidth={2.5} dot={false} name="physical" />
          <Line type="monotone" dataKey="economic" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" dot={false} name="economic" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueMixChart() {
  return (
    <ChartCard title="Revenue Mix" subtitle="By unit type and ancillary income">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={160}>
          <PieChart>
            <Pie data={revenueMixData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={2}>
              {revenueMixData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {revenueMixData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              <p className="text-xs text-slate-600 flex-1">{item.name}</p>
              <p className="text-xs font-bold text-slate-900">{item.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export function ExpenseChart() {
  const chartData = expenseData.map(e => ({
    name: e.category.split(' ')[0],
    actual: e.amount,
    benchmark: e.benchmark,
  }));

  return (
    <ChartCard title="Expense Breakdown" subtitle="Actual vs. industry benchmark">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `$${v/1000}K`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={55} />
          <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ fontSize: 10 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="actual" fill="#1e3a8a" radius={[0, 3, 3, 0]} name="Actual" barSize={8} />
          <Bar dataKey="benchmark" fill="#10b981" radius={[0, 3, 3, 0]} name="Benchmark" barSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
