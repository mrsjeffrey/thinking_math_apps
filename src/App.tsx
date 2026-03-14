import { useEffect, useState } from 'react';
import { Box, Scissors, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import PaperFoldingExplorer from './apps/PaperFoldingExplorer';
import WarehouseExplorer from './apps/WarehouseExplorer';

type RouteKey = 'home' | 'paper-folding' | 'warehouse';

const apps = [
  {
    key: 'paper-folding' as const,
    title: 'Paper Folding Explorer',
    description: 'Explore folds, doubling, creases, and pattern growth.',
    icon: Scissors,
  },
  {
    key: 'warehouse' as const,
    title: 'Warehouse Problem Explorer',
    description: 'Compare discount-first and tax-first visually and numerically.',
    icon: Box,
  },
];

function getRouteFromHash(): RouteKey {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'paper-folding' || hash === 'warehouse') return hash;
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState<RouteKey>(getRouteFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: RouteKey) => {
    window.location.hash = next === 'home' ? '/' : next;
    setRoute(next);
  };

  const renderScreen = () => {
    if (route === 'paper-folding') {
      return (
        <motion.div
          key="paper-folding"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-brand-bg"
        >
          <button
            onClick={() => navigate('home')}
            className="fixed left-4 top-4 z-[60] inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <PaperFoldingExplorer />
        </motion.div>
      );
    }

    if (route === 'warehouse') {
      return (
        <motion.div
          key="warehouse"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-brand-bg"
        >
          <button
            onClick={() => navigate('home')}
            className="fixed left-4 top-4 z-[60] inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <WarehouseExplorer />
        </motion.div>
      );
    }

    return (
      <motion.div
        key="home"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 border-b border-black/10 pb-6">
            <p className="mb-3 text-xs font-mono uppercase tracking-[0.25em] text-gray-500">
              Interactive Math Library
            </p>
            <h1 className="text-4xl font-light tracking-tight text-gray-900 italic">
              Thinking Math Apps
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
              Explore mathematical ideas through clean, visual, interactive applets.
              Click any card to open a full-screen tool.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.key}
                  onClick={() => navigate(app.key)}
                  className="group overflow-hidden rounded-3xl border border-black/5 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="border-b border-black/5 bg-gray-50/60 px-7 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                        <Icon className="h-7 w-7 text-gray-700" />
                      </div>
                      <div className="text-sm font-medium text-blue-600">Open →</div>
                    </div>
                  </div>

                  <div className="px-7 py-6">
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {app.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {app.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>;
}
