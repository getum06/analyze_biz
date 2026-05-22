import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './components/layout/Navigation';
import { PresentationViewer } from './components/presentation/PresentationViewer';
import { AcquisitionDashboard } from './components/dashboard/AcquisitionDashboard';

export default function App() {
  const [mode, setMode] = useState('presentation');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50">
        <Navigation
          mode={mode}
          onModeChange={setMode}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
        />

        <AnimatePresence mode="wait">
          {mode === 'presentation' ? (
            <motion.main
              key="presentation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6"
            >
              <PresentationViewer darkMode={darkMode} />
            </motion.main>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AcquisitionDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
