import { motion } from 'framer-motion';
import { cn } from './utils';

export function KPICard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'blue', className, delay = 0 }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-100' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow duration-200',
        c.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={cn('p-2 rounded-lg', c.bg)}>
            <Icon size={16} className={c.icon} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trend >= 0 ? 'text-emerald-600' : 'text-red-600')}>
          <span>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend)}% {trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
