import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Download, MapPin } from 'lucide-react';
import { AcquisitionForm } from './AcquisitionForm';
import { DashboardKPIs } from './DashboardKPIs';
import { RecommendationPanel } from './RecommendationPanel';
import { RiskHeatmap } from './RiskHeatmap';
import { NOITrendChart, OccupancyChart, RevenueMixChart, ExpenseChart } from './DashboardCharts';
import { useCalculations } from '../../hooks/useCalculations';
import { defaultFormValues, mockAcquisition } from '../../data/mockData';
import { formatCurrency } from '../ui/utils';

export function AcquisitionDashboard() {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const calcs = useCalculations(formValues);

  const handleReset = () => setFormValues(defaultFormValues);
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Property header banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900 text-white px-4 sm:px-6 py-3"
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <MapPin size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{mockAcquisition.propertyName}</p>
              <p className="text-white/60 text-xs">{mockAcquisition.address} · {mockAcquisition.totalSqFt.toLocaleString()} sf · {mockAcquisition.totalUnits} units</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-white/60">Ask Price: <strong className="text-white">{formatCurrency(mockAcquisition.purchasePrice, true)}</strong></span>
            <span className="text-white/60">Year Built: <strong className="text-white">{mockAcquisition.yearBuilt}</strong></span>
            <span className="text-white/60">Market: <strong className="text-white">{mockAcquisition.submarket}</strong></span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Acquisition Evaluation Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">Adjust inputs to recalculate all metrics in real time</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Download size={12} /> Export PDF
            </button>
          </div>
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-4">
            <AcquisitionForm values={formValues} onChange={setFormValues} />
          </div>

          {/* Center: KPIs + charts */}
          <div className="lg:col-span-6 space-y-4">
            <DashboardKPIs formValues={formValues} calcs={calcs} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NOITrendChart />
              <OccupancyChart />
              <RevenueMixChart />
              <ExpenseChart />
            </div>
          </div>

          {/* Right: recommendation + risk */}
          <div className="lg:col-span-3 space-y-4">
            <RecommendationPanel
              recommendation={calcs.recommendation}
              scores={calcs.scores}
              weightedScore={calcs.weightedScore}
              calcs={calcs}
            />
            <RiskHeatmap scores={calcs.scores} />
          </div>
        </div>
      </div>
    </div>
  );
}
