import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Percent, BarChart2, Shield, Layers } from 'lucide-react';
import { OccupancyGauge } from '../ui/OccupancyGauge';
import { formatCurrency } from '../ui/utils';

function MetricBadge({ value, threshold, higherIsBetter = true, formatter }) {
  const numVal = parseFloat(value);
  const numThreshold = parseFloat(threshold);
  let good;
  if (higherIsBetter) good = numVal >= numThreshold;
  else good = numVal <= numThreshold;
  const display = formatter ? formatter(numVal) : value;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${good ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
      {display}
    </span>
  );
}

export function DashboardKPIs({ formValues, calcs }) {
  const occupancy = parseFloat(formValues.occupancyRate);
  const marketOcc = parseFloat(formValues.marketOccupancy);

  return (
    <div className="space-y-4">
      {/* Gauges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
      >
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Occupancy Dashboard</p>
        <div className="flex justify-around">
          <div className="text-center">
            <OccupancyGauge value={occupancy} label="Physical" size={120} />
            <MetricBadge value={occupancy} threshold={82} formatter={v => `${v.toFixed(1)}%`} />
          </div>
          <div className="text-center">
            <OccupancyGauge value={marketOcc} label="Market" size={120} />
            <MetricBadge value={marketOcc} threshold={88} formatter={v => `${v.toFixed(1)}%`} />
          </div>
        </div>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: Percent,
            label: 'Cap Rate',
            value: `${calcs.capRate}%`,
            subValue: `Stab: ${calcs.stabCapRate}%`,
            good: parseFloat(calcs.capRate) >= 6.5,
            color: 'blue',
            delay: 0.05,
          },
          {
            icon: Shield,
            label: 'DSCR',
            value: `${calcs.dscr}x`,
            subValue: `Stab: ${calcs.stabDSCR}x`,
            good: parseFloat(calcs.dscr) >= 1.25,
            color: 'emerald',
            delay: 0.1,
          },
          {
            icon: TrendingUp,
            label: 'Cash-on-Cash',
            value: `${calcs.cashOnCash}%`,
            subValue: 'Year 1 equity return',
            good: parseFloat(calcs.cashOnCash) >= 8,
            color: 'green',
            delay: 0.15,
          },
          {
            icon: Layers,
            label: 'LTV',
            value: `${calcs.ltv}%`,
            subValue: `Equity: ${formatCurrency(calcs.equity, true)}`,
            good: parseFloat(calcs.ltv) <= 70,
            color: 'slate',
            delay: 0.2,
          },
          {
            icon: DollarSign,
            label: 'Debt Service',
            value: formatCurrency(calcs.annualDebtService, true),
            subValue: `${formatCurrency(calcs.monthlyPayment, true)}/mo`,
            good: calcs.cashAfterDebt > 0,
            color: 'amber',
            delay: 0.25,
          },
          {
            icon: BarChart2,
            label: 'NOI Margin',
            value: `${calcs.noiMargin}%`,
            subValue: 'Benchmark: >55%',
            good: parseFloat(calcs.noiMargin) >= 55,
            color: 'purple',
            delay: 0.3,
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: kpi.delay }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-3"
          >
            <div className="flex items-start justify-between mb-1.5">
              <p className="text-xs text-slate-500 font-medium leading-tight">{kpi.label}</p>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${kpi.good ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <kpi.icon size={11} className={kpi.good ? 'text-emerald-600' : 'text-red-500'} />
              </span>
            </div>
            <p className={`text-xl font-bold ${kpi.good ? 'text-slate-900' : 'text-red-600'}`}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.subValue}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
