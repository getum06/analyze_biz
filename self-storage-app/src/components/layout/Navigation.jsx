import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Presentation, Moon, Sun, Menu, X,
  Building2, ChevronRight
} from 'lucide-react';
import { cn } from '../ui/utils';

export function Navigation({ mode, onModeChange, darkMode, onToggleDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: 'presentation', label: 'Slide Deck', icon: Presentation },
    { id: 'dashboard', label: 'Acquisition Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className={cn(
      'sticky top-0 z-50 border-b backdrop-blur-sm',
      darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'
    )}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-900 rounded-lg">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className={cn('text-sm font-bold leading-tight', darkMode ? 'text-white' : 'text-slate-900')}>
                StorageIQ
              </p>
              <p className="text-xs text-slate-500">Acquisition Intelligence</p>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onModeChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  mode === tab.id
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              className={cn(
                'p-2 rounded-lg transition-colors',
                darkMode ? 'bg-slate-700 text-amber-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { onModeChange(tab.id); setMobileOpen(false); }}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium',
                    mode === tab.id
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon size={16} />
                    {tab.label}
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
