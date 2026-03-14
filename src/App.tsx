import { useEffect, useState } from 'react';
import { Box, Scissors, ArrowLeft } from 'lucide-react';
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

  if (route === 'paper-folding') {
    return (
      <div className="relative">
        <button
          onClick={() => navigate('home')}
          className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Home
        </button>
        <PaperFoldingExplorer />
      </div>
    );
  }

  if (route === 'warehouse') {
    return (
      <div className="relative">
        <button
          onClick={() => navigate('home')}
          className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Home
        </button>
        <WarehouseExplorer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-6 py-10 text-[#1a1a1a]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Mega App</p>
          <h1 className="text-4xl font-bold tracking-tight">Math Explorer Hub</h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600">
            A single Vite + React app that contains your Google AI Studio explorers. Click a card to open each tool inside the same codebase.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.key}
                onClick={() => navigate(app.key)}
                className="group rounded-3xl border border-black/10 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-semibold group-hover:text-blue-600">{app.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{app.description}</p>
                <div className="mt-6 text-sm font-semibold text-blue-600">Open app →</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
