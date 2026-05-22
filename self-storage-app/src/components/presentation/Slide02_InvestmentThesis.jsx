import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, Shield, Users, Building, Zap } from 'lucide-react';

const pillars = [
  {
    icon: RefreshCw,
    title: 'Recurring Revenue',
    desc: 'Month-to-month leases provide predictable cash flow with minimal tenant default risk vs. multi-family.',
    stat: '94%', statLabel: 'avg renewal rate',
    color: 'blue',
  },
  {
    icon: TrendingUp,
    title: 'Inflation Resistance',
    desc: 'Rents can be increased monthly. No long-term lease lock-in means pricing adjusts with market conditions.',
    stat: '+6.2%', statLabel: 'avg annual rent growth',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Operational Leverage',
    desc: 'Revenue scales without proportional expense growth. Digital automation reduces labor requirements.',
    stat: '42%', statLabel: 'avg expense ratio',
    color: 'purple',
  },
  {
    icon: Users,
    title: 'Low Labor Intensity',
    desc: '1–2 FTE staff can operate 300–600 unit facilities. Unmanned kiosk models further compress payroll.',
    stat: '1.4', statLabel: 'avg FTEs per facility',
    color: 'amber',
  },
  {
    icon: Building,
    title: 'Real Estate Appreciation',
    desc: 'Land value appreciation + NOI growth creates dual return engines. Self-storage cap rates compress over time.',
    stat: '18%', statLabel: 'total return (10-yr avg)',
    color: 'blue',
  },
  {
    icon: Shield,
    title: 'NOI Optimization',
    desc: 'Underperforming assets offer upside through dynamic pricing, ancillary revenue, and marketing improvements.',
    stat: '30–40%', statLabel: 'NOI upside potential',
    color: 'emerald',
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100', stat: 'text-blue-700' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100', stat: 'text-emerald-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100', stat: 'text-purple-700' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100', stat: 'text-amber-700' },
};

export default function Slide02_InvestmentThesis() {
  return (
    <div className="w-full h-full bg-white flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 02</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Investment Thesis</h2>
            <p className="text-slate-500 text-sm mt-1">Why self-storage delivers superior risk-adjusted returns</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-right">
            <div>
              <p className="text-2xl font-bold text-blue-900">$54B</p>
              <p className="text-xs text-slate-500">US market size</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-emerald-600">3.5%</p>
              <p className="text-xs text-slate-500">10-yr CAGR</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pillars grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
        {pillars.map((p, i) => {
          const c = colorMap[p.color];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl border p-4 ${c.bg} ${c.border} flex flex-col`}
            >
              <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm`}>
                <p.icon size={16} className={c.icon} />
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-1.5">{p.title}</p>
              <p className="text-slate-600 text-xs leading-relaxed flex-1">{p.desc}</p>
              <div className="mt-3 pt-3 border-t border-white/60">
                <span className={`text-lg font-bold ${c.stat}`}>{p.stat}</span>
                <span className="text-xs text-slate-500 ml-1.5">{p.statLabel}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 p-3 bg-blue-900 rounded-xl flex items-center gap-3"
      >
        <div className="w-1.5 h-8 bg-emerald-400 rounded-full flex-shrink-0" />
        <p className="text-white/90 text-xs">
          <strong className="text-white">Key thesis:</strong> Self-storage occupies the intersection of real estate appreciation, operating business cash flow, and inflation-indexed revenue — with markedly lower labor and management complexity than alternatives.
        </p>
      </motion.div>
    </div>
  );
}
