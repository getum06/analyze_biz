import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { scorecardWeights } from '../../data/mockData';
import { getScoreBarColor } from '../ui/utils';

const weightedScore = scorecardWeights.reduce((s, i) => s + (i.score * i.weight) / 100, 0).toFixed(1);

const radarData = scorecardWeights.map(s => ({
  subject: s.category.split(' ')[0],
  score: s.score,
  min: 50,
}));

export default function Slide11_AcquisitionScorecard() {
  const score = parseFloat(weightedScore);
  const rating = score >= 75 ? 'Strong Buy' : score >= 62 ? 'Moderate Buy' : score >= 50 ? 'Investigate' : 'Pass';
  const ratingColor = score >= 75 ? '#10b981' : score >= 62 ? '#3b82f6' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full h-full bg-white flex flex-col p-6 md:p-10" style={{ minHeight: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-blue-900 rounded-full" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 11</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Acquisition Scorecard</h2>
            <p className="text-slate-500 text-sm mt-1">Weighted investment rating — Sundance Storage, Frisco TX</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden sm:flex flex-col items-end"
          >
            <div className="px-5 py-2 rounded-xl border-2 text-center" style={{ borderColor: ratingColor, backgroundColor: `${ratingColor}10` }}>
              <p className="text-3xl font-bold" style={{ color: ratingColor }}>{weightedScore}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: ratingColor }}>{rating}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1">
        {/* Scorecard bars */}
        <div className="flex-1 space-y-3">
          {scorecardWeights.map((item, i) => {
            const color = getScoreBarColor(item.score);
            const weighted = (item.score * item.weight / 100).toFixed(1);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-sm font-semibold text-slate-800">{item.category}</p>
                    <span className="text-xs text-slate-400">wt: {item.weight}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">contrib: {weighted}</span>
                    <span className="text-base font-bold" style={{ color }}>{item.score}</span>
                  </div>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Radar + score summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex flex-col w-52 gap-3"
        >
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Score Radar</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar name="Score" dataKey="score" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-900 rounded-xl p-4 flex flex-col items-center">
            <p className="text-white/60 text-xs mb-1">Weighted Score</p>
            <p className="text-4xl font-bold text-white">{weightedScore}</p>
            <div className="w-full h-2 bg-white/10 rounded-full mt-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: ratingColor }}
              />
            </div>
            <p className="text-sm font-bold mt-1" style={{ color: ratingColor }}>{rating}</p>
            <p className="text-white/50 text-xs mt-1 text-center">Based on weighted criteria</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
