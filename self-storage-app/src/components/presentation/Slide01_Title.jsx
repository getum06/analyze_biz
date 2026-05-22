import { motion } from 'framer-motion';
import { Building2, TrendingUp, Shield, BarChart3 } from 'lucide-react';

export default function Slide01_Title() {
  return (
    <div className="relative w-full h-full bg-blue-950 overflow-hidden flex flex-col" style={{ minHeight: '100%' }}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-700/15 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-8 md:p-14">
        {/* Header bar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-auto"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg border border-white/20">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white/90 font-semibold text-sm tracking-wide">StorageIQ</p>
            <p className="text-white/50 text-xs">Acquisition Intelligence Platform</p>
          </div>
          <div className="ml-auto h-px flex-1 max-w-xs bg-white/10" />
          <p className="text-white/40 text-xs">CONFIDENTIAL — INVESTMENT USE ONLY</p>
        </motion.div>

        {/* Main title */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Due Diligence Framework</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Self-Storage<br />
              <span className="text-emerald-400">Acquisition</span><br />
              Evaluation Framework
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-lg font-light">
              Investment Evaluation &amp; Operational Due Diligence
            </p>
          </motion.div>
        </div>

        {/* Bottom pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mt-8"
        >
          {[
            { icon: TrendingUp, label: 'Market Analysis', sub: 'Demand & supply dynamics' },
            { icon: BarChart3, label: 'Financial Underwriting', sub: 'NOI, cap rate & DSCR' },
            { icon: Shield, label: 'Risk Scoring', sub: 'Weighted decision framework' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm"
            >
              <item.icon size={20} className="text-emerald-400 mb-2" />
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-white/50 text-xs mt-0.5">{item.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mt-6 pt-4 border-t border-white/10"
        >
          <p className="text-white/30 text-xs">Self-Storage Acquisition Intelligence Framework v2.1</p>
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} StorageIQ Partners</p>
        </motion.div>
      </div>
    </div>
  );
}
