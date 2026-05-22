import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react';
import { cn } from '../ui/utils';

import Slide1 from './Slide01_Title';
import Slide2 from './Slide02_InvestmentThesis';
import Slide3 from './Slide03_MarketFundamentals';
import Slide4 from './Slide04_SupplyCompetition';
import Slide5 from './Slide05_OccupancyRevenue';
import Slide6 from './Slide06_RevenueOptimization';
import Slide7 from './Slide07_ExpenseStructure';
import Slide8 from './Slide08_NOIFinancing';
import Slide9 from './Slide09_InfraCapex';
import Slide10 from './Slide10_IdealVsDangerous';
import Slide11 from './Slide11_AcquisitionScorecard';
import Slide12 from './Slide12_FinalRecommendation';

const slides = [
  { id: 1, component: Slide1, title: 'Title' },
  { id: 2, component: Slide2, title: 'Investment Thesis' },
  { id: 3, component: Slide3, title: 'Market Fundamentals' },
  { id: 4, component: Slide4, title: 'Supply & Competition' },
  { id: 5, component: Slide5, title: 'Occupancy & Revenue' },
  { id: 6, component: Slide6, title: 'Revenue Optimization' },
  { id: 7, component: Slide7, title: 'Expense Structure' },
  { id: 8, component: Slide8, title: 'NOI & Financing' },
  { id: 9, component: Slide9, title: 'Infrastructure & CapEx' },
  { id: 10, component: Slide10, title: 'Ideal vs Dangerous' },
  { id: 11, component: Slide11, title: 'Acquisition Scorecard' },
  { id: 12, component: Slide12, title: 'Recommendation Framework' },
];

export function PresentationViewer({ darkMode }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const go = useCallback((idx) => {
    if (idx < 0 || idx >= slides.length) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const prev = () => go(current - 1);
  const next = () => go(current + 1);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current]);

  const printSlides = () => window.print();

  const SlideComponent = slides[current].component;

  return (
    <div className={cn('flex flex-col', fullscreen && 'fixed inset-0 z-50 bg-slate-950')}>
      {/* Slide area */}
      <div className={cn('relative overflow-hidden bg-slate-950', fullscreen ? 'flex-1' : 'rounded-xl shadow-2xl')}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full"
            style={{ aspectRatio: fullscreen ? 'auto' : '16/9', minHeight: fullscreen ? '100%' : undefined }}
          >
            <div className={cn('w-full h-full', !fullscreen && 'aspect-video')}>
              <SlideComponent darkMode={darkMode} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Fullscreen toggle */}
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 text-white rounded-lg transition-colors no-print"
        >
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Slide counter */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/40 text-white text-xs rounded-full no-print">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Controls bar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-3 no-print',
        fullscreen ? 'absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur' : 'bg-slate-50 border border-slate-200 rounded-b-xl border-t-0'
      )}>
        {/* Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronLeft size={15} /> Prev
          </button>
          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>

        {/* Dot nav */}
        <div className="hidden sm:flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              title={s.title}
              className={cn(
                'rounded-full transition-all duration-200',
                i === current
                  ? 'w-6 h-2 bg-blue-900'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={printSlides}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Slide thumbnails */}
      <div className={cn('mt-4 no-print', fullscreen && 'hidden')}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center gap-1 p-1 rounded-lg border-2 transition-all',
                i === current ? 'border-blue-900' : 'border-transparent hover:border-slate-300'
              )}
            >
              <div className="w-20 h-12 bg-slate-800 rounded overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  {s.id}
                </div>
              </div>
              <span className="text-xs text-slate-500 w-20 text-center leading-tight truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
