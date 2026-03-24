import { useEffect, useState } from 'react';
import { Sigma, Layers, ArrowLeft, Orbit, Compass, Binary, Flame, ScanText, BookOpen, Rabbit, Users, Divide } from 'lucide-react';
import LeapfrogsExplorer from './apps/LeapfrogsExplorer';
import { AnimatePresence, motion } from 'motion/react';
import DifferenceOfSquaresExplorer from './apps/DifferenceOfSquaresExplorer';
import PaperFoldingExplorer from './apps/PaperFoldingExplorer';
import WarehouseExplorer from './apps/WarehouseExplorer';
import ThreadedPinsExplorer from './apps/ThreadedPinsExplorer';
import TetheredGoatExplorer from './apps/TetheredGoatExplorer';
import QuickAndToastyExplorer from './apps/QuickAndToastyExplorer';
import PalindromesExplorer from './apps/PalindromesExplorer';
import LadiesLuncheonExplorer from './apps/LadiesLuncheonExplorer';
import GreatDivideExplorer from './apps/GreatDivideExplorer';
import CirclesAndSpotsExplorer from './apps/CirclesAndSpotsExplorer';
import EurekaExplorer from './apps/EurekaExplorer';

type RouteKey =
  | 'home'
  | 'paper-folding'
  | 'warehouse'
  | 'threaded-pins'
  | 'tethered-goat'
  | 'difference-of-squares'
  | 'quick-and-toasty'
  | 'palindromes'
  | 'leapfrogs'
  | 'ladiesluncheon'
  | 'great-divide'
  | 'circles-and-spots'
  | 'eureka';

const apps = [
  {
    key: 'paper-folding' as const,
    title: 'Paper Folding Explorer',
    description: 'Explore folds, doubling, creases, and pattern growth.',
    icon: Layers,
  },
  {
    key: 'warehouse' as const,
    title: 'Warehouse Problem Explorer',
    description: 'Compare discount-first and tax-first visually and numerically.',
    icon: Sigma,
  },
  {
    key: 'threaded-pins' as const,
    title: 'Threaded Pins Explorer',
    description: 'Explore loops, gaps, and why gcd appears in circular patterns.',
    icon: Orbit,
  },
  {
    key: 'tethered-goat' as const,
    title: 'Tethered Goat Explorer',
    description: 'Investigate grazing area around a rectangular shed.',
    icon: Compass,
  },
  {
    key: 'difference-of-squares' as const,
    title: 'Difference of Squares Explorer',
    description: 'Test which numbers can be written as x² − y² and find the pattern.',
    icon: Binary,
  },
  {
  key: 'quick-and-toasty' as const,
  title: 'Quick and Toasty Explorer',
  description: 'Optimize the fastest strategy for toasting three slices on both sides.',
  icon: Flame,
  },
  {
  key: 'palindromes' as const,
  title: 'Palindromes Explorer',
  description: 'Test and prove why every 4-digit palindrome is divisible by 11.',
  icon: ScanText,
},

{
  key: 'leapfrogs' as const,
  title: 'Leapfrogs Explorer',
  description: 'Swap two groups of frogs and investigate the minimum move pattern.',
  icon: Rabbit,
},

{
  key: 'ladiesluncheon' as const,
  title: 'Ladies Lunch Explorer',
  description: 'A name pairing and seating deductive logic puzzle.',
  icon: Users,
},

{
  key: 'great-divide' as const,
  title: 'The Great Divide Explorer',
  description: 'Use remainders, LCM, and structure to find the smallest solution.',
  icon: Divide,
},

{
  key: 'circles-and-spots' as const,
  title: 'Circles and Spots Explorer',
  description: 'Connect spots to create the maximum number of regions.',
  icon: Divide,
},

{
  key: 'eureka' as const,
  title: 'Eureka Explorer',
  description: 'Can you determine the sequence rule?',
  icon: Divide,
},


];

function getRouteFromHash(): RouteKey {
  const hash = window.location.hash.replace(/^#\/?/, '');

  if (
    hash === 'paper-folding' ||
    hash === 'warehouse' ||
    hash === 'threaded-pins' ||
    hash === 'tethered-goat' ||
    hash === 'difference-of-squares' ||
    hash === 'quick-and-toasty' ||
    hash === 'palindromes' ||
    hash === "leapfrogs" ||
    hash === "ladiesluncheon" ||
    hash === 'great-divide' ||
    hash === 'circles-and-spots' ||
    hash === 'eureka'
  ) {
    return hash;
  }

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
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
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
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <WarehouseExplorer />
        </motion.div>
      );
    }

    if (route === 'difference-of-squares') {
  return (
    <motion.div
      key="difference-of-squares"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
    >
      <button
        onClick={() => navigate('home')}
        className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
      >
        <ArrowLeft size={16} />
        Home
      </button>
      <DifferenceOfSquaresExplorer />
    </motion.div>
  );
}
    if (route === 'threaded-pins') {
      return (
        <motion.div
          key="threaded-pins"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <ThreadedPinsExplorer />
        </motion.div>
      );
    }

    if (route === 'tethered-goat') {
      return (
        <motion.div
          key="tethered-goat"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <TetheredGoatExplorer />
        </motion.div>
      );
    }

    if (route === 'quick-and-toasty') {
      return (
        <motion.div
          key="quick-and-toasty"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <QuickAndToastyExplorer />
        </motion.div>
      );
    }

    if (route === 'palindromes') {
      return (
        <motion.div
          key="palindromes"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <PalindromesExplorer/>
        </motion.div>
      );
    }

    if (route === 'leapfrogs') {
      return (
        <motion.div
          key="leapfrogs"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <LeapfrogsExplorer />
        </motion.div>
      );
    }

    if (route === 'ladiesluncheon') {
      return (
        <motion.div
          key="ladiesluncheon"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <LadiesLuncheonExplorer />
        </motion.div>
      );
    }

    if (route === 'great-divide') {
      return (
        <motion.div
          key="great-divide"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <GreatDivideExplorer />
        </motion.div>
      );
    }

    
    if (route === 'circles-and-spots') {
      return (
        <motion.div
          key="circles-and-spots"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <CirclesAndSpotsExplorer/>
        </motion.div>
      );
    }

        if (route === 'eureka') {
      return (
        <motion.div
          key="eureka"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        >
          <button
            onClick={() => navigate('home')}
            className="sticky left-4 top-4 z-[60] ml-4 mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <EurekaExplorer/>
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
        <div className="mx-auto max-w-5xl space-y-8">
          <header className="space-y-4 border-b border-gray-200 pb-6">
            <h1
              className="text-4xl tracking-tight text-gray-900"
              style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
            >
              Interactive Mathematics Puzzle Library
            </h1>

            <p className="max-w-5xl text-sm leading-7 text-gray-600">
              Explore mathematical ideas through clean, visual, interactive applets inspired by
              <em> Thinking Mathematically</em>. Open an explorer below to investigate patterns,
              structure, and mathematical reasoning.
            </p>
          </header>

          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-black/5 bg-gray-50/50 p-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <h2 className="text-[14px] font-mono uppercase tracking-wider text-gray-800">
                Explorers
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => {
                const Icon = app.icon;

                return (
                  <button
                    key={app.key}
                    onClick={() => navigate(app.key)}
                    className="group aspect-[1/1] rounded-3xl border border-black/5 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-black/5 bg-gray-50">
                          <Icon className="h-8 w-8 text-gray-700" />
                        </div>

                        <div>
                          <h3
                            className="text-2xl text-gray-900"
                            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
                          >
                            {app.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {app.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-gray-500 transition-colors group-hover:text-blue-600">
                          Open Explorer
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </motion.div>
    );
  };

  return <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>;
}