import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Building2, Settings } from 'lucide-react';

function InputField({ label, name, value, onChange, prefix, suffix, type = 'number', step, min, max, tooltip }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-300 text-slate-600 text-xs flex items-center justify-center cursor-help">?</span>
            <span className="absolute hidden group-hover:block left-0 top-5 z-50 w-48 text-xs bg-slate-900 text-white p-2 rounded-lg shadow-lg normal-case tracking-normal font-normal">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent transition-all">
        {prefix && <span className="px-2.5 text-slate-500 text-sm bg-slate-50 border-r border-slate-200 h-full flex items-center py-2">{prefix}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          max={max}
          className="flex-1 px-3 py-2 text-sm text-slate-900 outline-none bg-transparent min-w-0"
        />
        {suffix && <span className="px-2.5 text-slate-500 text-sm bg-slate-50 border-l border-slate-200 h-full flex items-center py-2">{suffix}</span>}
      </div>
    </div>
  );
}

const sections = [
  {
    title: 'Deal Basics',
    icon: DollarSign,
    color: 'blue',
    fields: [
      { label: 'Purchase Price', name: 'purchasePrice', prefix: '$', tooltip: 'Total acquisition price before closing costs' },
      { label: 'Current NOI', name: 'currentNOI', prefix: '$', tooltip: 'Trailing 12-month net operating income' },
      { label: 'Stabilized NOI', name: 'stabilizedNOI', prefix: '$', tooltip: 'Projected NOI at stabilized occupancy' },
      { label: 'Gross Revenue', name: 'grossRevenue', prefix: '$', tooltip: 'Total annual gross revenue (T12)' },
    ]
  },
  {
    title: 'Occupancy & Operations',
    icon: TrendingUp,
    color: 'emerald',
    fields: [
      { label: 'Physical Occupancy', name: 'occupancyRate', suffix: '%', min: 0, max: 100, step: 0.1, tooltip: 'Current physical occupancy rate' },
      { label: 'Market Occupancy', name: 'marketOccupancy', suffix: '%', min: 0, max: 100, step: 0.1, tooltip: 'Submarket average occupancy rate' },
      { label: 'Delinquency Rate', name: 'delinquencyRate', suffix: '%', min: 0, max: 20, step: 0.1, tooltip: 'Current delinquency as % of gross revenue' },
      { label: 'Expansion Potential', name: 'expansionPotential', suffix: '/100', min: 0, max: 100, tooltip: 'Score for on-site expansion opportunity' },
    ]
  },
  {
    title: 'Market Data',
    icon: Building2,
    color: 'purple',
    fields: [
      { label: 'Population Growth', name: 'populationGrowth', suffix: '%', step: 0.1, tooltip: 'Annual submarket population growth rate' },
      { label: 'Sq Ft per Capita', name: 'sqFtPerCapita', suffix: 'sf/cap', step: 0.1, tooltip: 'Total storage sf per capita in market — <9 is healthy' },
      { label: 'Competitor Count', name: 'competitorCount', suffix: 'facilities', min: 0, tooltip: 'Number of competing facilities within 3 miles' },
    ]
  },
  {
    title: 'Financing & CapEx',
    icon: Settings,
    color: 'amber',
    fields: [
      { label: 'Loan Amount', name: 'loanAmount', prefix: '$', tooltip: 'Proposed loan amount' },
      { label: 'Interest Rate', name: 'interestRate', suffix: '%', step: 0.125, tooltip: 'Annual interest rate on proposed debt' },
      { label: 'Amortization', name: 'amortizationYears', suffix: 'yrs', min: 15, max: 30, tooltip: 'Loan amortization period in years' },
      { label: 'CapEx Estimate', name: 'capexEstimate', prefix: '$', tooltip: 'Total capital expenditure reserve' },
    ]
  },
];

const iconColorMap = {
  blue: 'text-blue-600 bg-blue-50',
  emerald: 'text-emerald-600 bg-emerald-50',
  purple: 'text-purple-600 bg-purple-50',
  amber: 'text-amber-600 bg-amber-50',
};

export function AcquisitionForm({ values, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Acquisition Inputs</h3>
        <p className="text-xs text-slate-500">All calculations update live</p>
      </div>
      {sections.map((section, si) => (
        <motion.div
          key={si}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.08 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className={`p-1.5 rounded-lg ${iconColorMap[section.color]}`}>
              <section.icon size={13} />
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{section.title}</p>
          </div>
          <div className="p-4 grid grid-cols-1 gap-3">
            {section.fields.map((field) => (
              <InputField
                key={field.name}
                {...field}
                value={values[field.name] ?? ''}
                onChange={handleChange}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
