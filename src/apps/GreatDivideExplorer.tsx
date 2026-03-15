import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Divide,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Lightbulb,
  Search,
  ChevronRight,
  Info,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';

const DIVISORS = [2, 3, 4, 5, 6];
const TARGET_DIVISOR = 7;
const LCM = 60;

function SectionCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-black/5 bg-gray-50/60 px-6 py-4">
      {icon}
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
    </div>
  );
}

export default function GreatDivideExplorer() {
  const [number, setNumber] = useState(1);
  const [showStructure, setShowStructure] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const remainders = useMemo(() => {
    return DIVISORS.map((d) => ({
      divisor: d,
      remainder: number % d,
      isValid: number % d === 1,
    }));
  }, [number]);

  const targetRemainder = useMemo(
    () => ({
      divisor: TARGET_DIVISOR,
      remainder: number % TARGET_DIVISOR,
      isValid: number % TARGET_DIVISOR === 0,
    }),
    [number]
  );

  const allConditionsMet = useMemo(() => {
    return remainders.every((r) => r.isValid) && targetRemainder.isValid;
  }, [remainders, targetRemainder]);

  const firstFiveMet = useMemo(() => {
    return remainders.every((r) => r.isValid);
  }, [remainders]);

  useEffect(() => {
    if (allConditionsMet && !history.includes(number)) {
      setHistory((prev) => [...prev, number].sort((a, b) => a - b));
    }
  }, [allConditionsMet, number, history]);

  const reset = () => {
    setNumber(1);
    setShowStructure(false);
  };

  const findNext = (step: number) => {
    setNumber((prev) => prev + step);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-4xl tracking-tight text-gray-900"
                style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
              >
                The Great Divide Explorer
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-600">
                Search for the smallest number that leaves remainder 1 when divided by
                2, 3, 4, 5, and 6, but is exactly divisible by 7.
              </p>
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              title="Reset Explorer"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <p className="text-gray-700 leading-relaxed text-lg">
              “A number is divided by <span className="font-semibold text-gray-900">2, 3, 4, 5, and 6</span>.
              In each case, the remainder is <span className="font-medium text-blue-600">1</span>.
              However, the number is exactly <span className="font-medium text-emerald-600">divisible by 7</span>.
              What is the smallest such number?”
            </p>
          </div>
        </SectionCard>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-stretch">
          <main className="space-y-8">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Number Scanner
                </h2>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
                <div className="mx-auto max-w-4xl space-y-10">
                  <div className="flex flex-col items-center space-y-4">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-gray-500">
                      Current Value
                    </span>

                    <motion.div
                      key={number}
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl font-bold tracking-tight text-gray-900 md:text-8xl"
                    >
                      {number}
                    </motion.div>
                  </div>

                  <div className="w-full max-w-2xl mx-auto">
                    <div className="grid grid-cols-5 gap-4 mb-8">
                      {remainders.map((r) => (
                        <div key={r.divisor} className="flex flex-col items-center gap-3">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                              r.isValid
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {r.isValid ? (
                              <CheckCircle2 size={24} />
                            ) : (
                              <AlertCircle size={24} />
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-mono uppercase text-gray-400">
                              ÷ {r.divisor}
                            </p>
                            <p
                              className={`text-xs font-semibold ${
                                r.isValid ? 'text-blue-600' : 'text-gray-500'
                              }`}
                            >
                              rem {r.remainder}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <div
                        className={`flex items-center gap-5 rounded-3xl border px-6 py-6 transition-all ${
                          targetRemainder.isValid
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-black/5 bg-white'
                        }`}
                      >
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                            targetRemainder.isValid
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Target size={28} />
                        </div>
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-wide text-gray-500">
                            Target Divisor: 7
                          </p>
                          <h3
                            className={`text-xl font-semibold ${
                              targetRemainder.isValid ? 'text-emerald-700' : 'text-gray-700'
                            }`}
                          >
                            {targetRemainder.isValid
                              ? 'Exactly divisible'
                              : `Remainder ${targetRemainder.remainder}`}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-xl mx-auto space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-mono uppercase tracking-wide text-gray-500">
                        <span>Scan Range</span>
                        <span>N = {number}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="1000"
                        value={number}
                        onChange={(e) => setNumber(parseInt(e.target.value, 10))}
                        className="w-full cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => findNext(1)}
                        className="group flex items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-medium text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50"
                      >
                        <div className="rounded-lg bg-gray-100 p-2 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                          <ArrowRight size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">
                            Specializing
                          </p>
                          <p>Step +1</p>
                        </div>
                      </button>

                      <button
                        onClick={() => findNext(LCM)}
                        className="group flex items-center justify-center gap-3 rounded-2xl border border-blue-600 bg-blue-600 px-5 py-4 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <div className="rounded-lg bg-white/10 p-2">
                          <Zap size={16} className="text-amber-300" />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] uppercase tracking-wide text-blue-100">
                            Generalizing
                          </p>
                          <p>Jump +60</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {allConditionsMet && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto max-w-md rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2.5 text-center text-sm font-medium text-emerald-700"
                      >
                        Solution found: {number}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="overflow-hidden">
              <button
                onClick={() => setShowStructure(!showStructure)}
                className="flex w-full items-center justify-between bg-gray-900 px-6 py-5 text-left transition-colors hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb size={18} className="text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    Structure Reveal: The LCM Strategy
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-gray-300 transition-transform ${
                    showStructure ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {showStructure && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 border-t border-gray-800 bg-gray-900 px-6 py-6 text-sm leading-7 text-gray-300">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-white">The Pattern</h4>
                          <p>
                            To have remainder 1 when divided by 2, 3, 4, 5, and 6, the
                            number must be exactly 1 more than a common multiple of all
                            those numbers.
                          </p>
                          <div className="rounded-xl bg-white/5 px-4 py-4 font-mono text-sm text-blue-300">
                            N = LCM(2, 3, 4, 5, 6) × k + 1
                            <br />
                            N = 60k + 1
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-white">The Search</h4>
                          <div className="rounded-xl bg-white/5 px-4 py-4 font-mono text-sm text-gray-300">
                            <div className={number >= 61 ? 'text-white' : 'text-gray-500'}>
                              k = 1 → 61 → rem 5
                            </div>
                            <div className={number >= 121 ? 'text-white' : 'text-gray-500'}>
                              k = 2 → 121 → rem 2
                            </div>
                            <div className={number >= 181 ? 'text-white' : 'text-gray-500'}>
                              k = 3 → 181 → rem 6
                            </div>
                            <div className={number >= 241 ? 'text-white' : 'text-gray-500'}>
                              k = 4 → 241 → rem 3
                            </div>
                            <div
                              className={
                                number >= 301 ? 'font-bold text-emerald-400' : 'text-gray-500'
                              }
                            >
                              k = 5 → 301 → rem 0 ✓
                            </div>
                          </div>
                          <p>
                            So the smallest solution is <span className="font-semibold text-white">301</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          </main>

          <aside className="space-y-6">
            <SectionCard>
              <SectionHeader
                icon={<BookOpen size={16} className="text-blue-500" />}
                title="Thinking Rubric"
              />
              <div className="space-y-6 px-6 py-6">
                <div className="relative border-l-2 border-gray-100 pl-5">
                  <div className="absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full border-2 border-gray-200 bg-white" />
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-900">
                    Entry
                  </h3>
                  <p className="text-sm leading-7 text-gray-600">
                    Start by specializing. Try small numbers and notice basic
                    constraints.
                  </p>
                  {number > 10 && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-600">
                      Insight: N must be odd, and N ≡ 1 (mod 5).
                    </div>
                  )}
                </div>

                <div
                  className={`relative border-l-2 pl-5 ${
                    firstFiveMet ? 'border-blue-200' : 'border-gray-100'
                  }`}
                >
                  <div
                    className={`absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full border-2 ${
                      firstFiveMet ? 'border-blue-500 bg-blue-500' : 'border-gray-200 bg-white'
                    }`}
                  />
                  <h3
                    className={`mb-2 text-xs font-bold uppercase tracking-wide ${
                      firstFiveMet ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    Attack
                  </h3>
                  <p className="text-sm leading-7 text-gray-600">
                    Look for a structure. When the first five conditions hold, what is
                    the gap to the next such number?
                  </p>
                  {firstFiveMet && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-600">
                      Discovery: the repeating gap is 60.
                    </div>
                  )}
                </div>

                <div
                  className={`relative border-l-2 pl-5 ${
                    allConditionsMet ? 'border-emerald-200' : 'border-gray-100'
                  }`}
                >
                  <div
                    className={`absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full border-2 ${
                      allConditionsMet
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-200 bg-white'
                    }`}
                  />
                  <h3
                    className={`mb-2 text-xs font-bold uppercase tracking-wide ${
                      allConditionsMet ? 'text-emerald-600' : 'text-gray-900'
                    }`}
                  >
                    Review
                  </h3>
                  <p className="text-sm leading-7 text-gray-600">
                    Generalize the result. Once one solution is found, what do all the
                    others look like?
                  </p>

                  {history.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">
                        Solutions Found
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {history.map((h) => (
                          <span
                            key={h}
                            className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Divide size={16} className="text-blue-500" />}
                title="Remainder Engine"
              />
              <div className="space-y-2 px-6 py-6">
                {[...DIVISORS, TARGET_DIVISOR].map((d) => {
                  const rem = number % d;
                  const isTarget = d === TARGET_DIVISOR;
                  const isValid = isTarget ? rem === 0 : rem === 1;

                  return (
                    <div
                      key={d}
                      className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-3 text-sm"
                    >
                      <span className="font-mono text-gray-600">
                        {number} ÷ {d}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-500">rem</span>
                        <span
                          className={`w-6 text-center font-mono font-semibold ${
                            isValid
                              ? isTarget
                                ? 'text-emerald-600'
                                : 'text-blue-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {rem}
                        </span>
                        {isValid && (
                          <CheckCircle2
                            size={14}
                            className={isTarget ? 'text-emerald-500' : 'text-blue-500'}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Search size={16} className="text-amber-500" />}
                title="Mathematical Idea"
              />
              <div className="px-6 py-6 text-sm leading-7 text-gray-600">
                This puzzle becomes much easier once you stop testing every number and
                instead test only numbers of the form{' '}
                <span className="font-semibold text-gray-900">60k + 1</span>.
              </div>
            </SectionCard>

            <div className="flex justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Reset Explorer
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}