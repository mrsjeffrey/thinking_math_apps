import React, { useMemo, useState } from 'react';
import {
  Info,
  Calculator,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Grid3X3,
  History,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const isPalindrome = (n: number) => {
  const s = n.toString();
  return s.length === 4 && s[0] === s[3] && s[1] === s[2];
};

const getAllPalindromes = () => {
  const palindromes: number[] = [];
  for (let i = 1000; i <= 9999; i++) {
    if (isPalindrome(i)) palindromes.push(i);
  }
  return palindromes;
};

const ALL_PALINDROMES = getAllPalindromes();

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

type HistoryItem = {
  val: number;
  diff: number | null;
};

export default function PalindromeDivisibilityExplorer() {
  const [currentPalindrome, setCurrentPalindrome] = useState<number>(1221);
  const [history, setHistory] = useState<HistoryItem[]>([{ val: 1221, diff: null }]);
  const [showGeneralization, setShowGeneralization] = useState(false);
  const [trackerTab, setTrackerTab] = useState<'grid' | 'history'>('grid');

  const digits = useMemo(() => {
    const s = currentPalindrome.toString().padStart(4, '0');
    return s.split('').map(Number);
  }, [currentPalindrome]);

  const isValidPalindrome = isPalindrome(currentPalindrome);
  const isDivisibleBy11 = currentPalindrome % 11 === 0;
  const quotient = Math.floor(currentPalindrome / 11);
  const remainder = currentPalindrome % 11;

  const addToHistory = (val: number) => {
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].val === val) return prev;
      const last = prev[prev.length - 1];
      const diff = last ? val - last.val : null;
      return [...prev, { val, diff }].slice(-100);
    });
  };

  const selectPalindrome = (val: number) => {
    setCurrentPalindrome(val);
    addToHistory(val);
  };

  const handleRandom = () => {
    const rand = ALL_PALINDROMES[Math.floor(Math.random() * ALL_PALINDROMES.length)];
    selectPalindrome(rand);
  };

  const handleNext = () => {
    const idx = ALL_PALINDROMES.indexOf(currentPalindrome);
    const next = ALL_PALINDROMES[(idx + 1) % ALL_PALINDROMES.length];
    selectPalindrome(next);
  };

  const handlePrev = () => {
    const idx = ALL_PALINDROMES.indexOf(currentPalindrome);
    const prev = ALL_PALINDROMES[(idx - 1 + ALL_PALINDROMES.length) % ALL_PALINDROMES.length];
    selectPalindrome(prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setCurrentPalindrome(val);
      if (isPalindrome(val)) addToHistory(val);
    } else if (e.target.value === '') {
      setCurrentPalindrome(0);
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Palindrome Divisibility Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Investigate whether every 4-digit palindrome is divisible by 11. Test
            examples, organize the structure, and build a convincing generalization.
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              “A friend claims that all 4-digit palindromes are exactly divisible by 11.
              Are they?”
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard>
              <SectionHeader
                icon={<Calculator size={16} className="text-blue-500" />}
                title="Palindrome Tester"
              />
              <div className="space-y-8 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                    Specializing
                  </div>

                  <div className="flex gap-1 rounded-full border border-black/10 bg-white p-1">
                    <button
                      onClick={handlePrev}
                      className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      title="Previous"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      title="Next"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={handleRandom}
                      className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      title="Random"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-4 py-2">
                  {digits.map((d, i) => (
                    <motion.div
                      key={`${i}-${d}`}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`flex h-24 w-16 items-center justify-center rounded-2xl border text-4xl font-bold shadow-sm ${
                        i === 0 || i === 3
                          ? 'border-blue-100 bg-blue-50 text-blue-700'
                          : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {d}
                    </motion.div>
                  ))}
                </div>

                <div className="mx-auto max-w-xs space-y-3">
                  <input
                    type="number"
                    value={currentPalindrome || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-center text-3xl font-bold text-gray-900 outline-none transition focus:border-blue-200 focus:bg-white"
                  />

                  {!isValidPalindrome && (
                    <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-rose-600">
                      <AlertCircle size={12} />
                      Not a 4-digit palindrome
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-6">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Quotient
                    </div>
                    <div className="mt-1 font-mono text-2xl font-semibold text-gray-900">
                      {quotient}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Remainder
                    </div>
                    <div
                      className={`mt-1 font-mono text-2xl font-semibold ${
                        remainder === 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {remainder}
                    </div>
                  </div>
                </div>

                <motion.div
                  key={isDivisibleBy11 ? 'yes' : 'no'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${
                    isDivisibleBy11
                      ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                      : 'border-rose-100 bg-rose-50 text-rose-700'
                  }`}
                >
                  {isDivisibleBy11 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">
                    {isDivisibleBy11 ? 'Exactly divisible by 11' : 'Not divisible by 11'}
                  </span>
                </motion.div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<BookOpen size={16} className="text-amber-500" />}
                title="Generalization"
              />
              <div className="space-y-5 px-6 py-6">
                <button
                  onClick={() => setShowGeneralization((prev) => !prev)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    showGeneralization
                      ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {showGeneralization ? 'Hide Generalization' : 'Reveal Generalization'}
                </button>

                <AnimatePresence mode="wait">
                  {showGeneralization ? (
                    <motion.div
                      key="proof"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Place value structure
                        </h3>
                        <p className="text-sm leading-7 text-gray-600">
                          A 4-digit palindrome has the form <span className="font-mono font-semibold text-gray-900">abba</span>.
                          Using place value:
                        </p>
                        <div className="rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-center font-mono text-sm text-gray-800">
                          1000a + 100b + 10b + a
                        </div>

                        <p className="text-sm leading-7 text-gray-600">
                          Combine like terms:
                        </p>
                        <div className="rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-center font-mono text-lg font-semibold text-gray-900">
                          1001a + 110b
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Factoring out 11
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4 text-center">
                            <div className="text-[11px] uppercase tracking-wide text-gray-500">
                              1001
                            </div>
                            <div className="mt-1 font-mono text-sm font-semibold text-gray-900">
                              11 × 91
                            </div>
                          </div>
                          <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4 text-center">
                            <div className="text-[11px] uppercase tracking-wide text-gray-500">
                              110
                            </div>
                            <div className="mt-1 font-mono text-sm font-semibold text-gray-900">
                              11 × 10
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
                          <div className="font-mono text-xl font-semibold text-amber-700">
                            1001a + 110b = 11(91a + 10b)
                          </div>
                        </div>

                        <p className="text-sm leading-7 text-gray-600">
                          Since every 4-digit palindrome can be written as 11 times an
                          integer, every 4-digit palindrome is divisible by 11.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-sm leading-7 text-gray-600"
                    >
                      Test several examples first. Then ask: how can any 4-digit palindrome
                      be written using place value?
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard>
              <SectionHeader
                icon={trackerTab === 'grid'
                  ? <Grid3X3 size={16} className="text-blue-500" />
                  : <History size={16} className="text-blue-500" />}
                title="Tracker"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="flex rounded-full border border-black/10 bg-white p-1">
                  <button
                    onClick={() => setTrackerTab('grid')}
                    className={`flex-1 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                      trackerTab === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setTrackerTab('history')}
                    className={`flex-1 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                      trackerTab === 'history'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    History
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {trackerTab === 'grid' ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
                        Palindrome Matrix (abba)
                      </p>

                      <div className="overflow-x-auto">
                        <div className="grid min-w-[400px] grid-cols-11 gap-1">
                          <div className="h-8 w-8" />
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => (
                            <div
                              key={b}
                              className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700"
                            >
                              {b}
                            </div>
                          ))}

                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((a) => (
                            <React.Fragment key={a}>
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-700">
                                {a}
                              </div>

                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => {
                                const val = a * 1001 + b * 110;
                                const isActive = val === currentPalindrome;

                                return (
                                  <button
                                    key={b}
                                    onClick={() => selectPalindrome(val)}
                                    className={`h-8 w-8 rounded-md border transition ${
                                      isActive
                                        ? 'scale-110 border-blue-600 bg-blue-600 shadow-sm'
                                        : 'border-black/5 bg-white hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                    title={val.toString()}
                                    aria-label={`Select palindrome ${val}`}
                                  />
                                );
                              })}

                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-black/5 pt-4 text-xs leading-6 text-gray-500">
                        Moving horizontally changes <span className="font-semibold text-emerald-700">b</span>.
                        Moving vertically changes <span className="font-semibold text-blue-700">a</span>.
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
                          Recent Tests
                        </p>
                        <button
                          onClick={clearHistory}
                          className="text-[11px] font-medium uppercase tracking-[0.08em] text-rose-600 hover:underline"
                        >
                          Clear
                        </button>
                      </div>

                      {history.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm italic text-gray-500">
                          No history yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {[...history].reverse().map((h, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-3"
                            >
                              <span className="font-mono text-sm font-semibold text-gray-900">
                                {h.val}
                              </span>
                              <span className="font-mono text-xs font-medium text-blue-600">
                                {h.diff !== null ? (h.diff > 0 ? `+${h.diff}` : h.diff) : '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
                title="Mathematical Idea"
              />
              <div className="px-6 py-6 text-sm leading-7 text-gray-600">
                The claim becomes easier to prove when you stop looking at individual
                examples and instead represent every 4-digit palindrome with letters and
                place value.
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
