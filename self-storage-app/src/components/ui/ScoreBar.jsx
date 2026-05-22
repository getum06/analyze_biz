import { motion } from 'framer-motion';
import { getScoreBarColor } from './utils';

export function ScoreBar({ label, score, weight, className }) {
  const color = getScoreBarColor(score);

  return (
    <div className={`mb-3 ${className || ''}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-slate-700 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {weight && <span className="text-xs text-slate-400">wt: {weight}%</span>}
          <span className="text-sm font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
