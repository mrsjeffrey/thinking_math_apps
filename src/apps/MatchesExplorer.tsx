import React, { useEffect, useMemo, useState } from 'react';
import {
  Info,
  Calculator,
  History,
  BookOpen,
  RotateCcw,
  Lightbulb,
  Grid3X3,
  Maximize,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

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
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">{title}</h2>
    </div>
  );
}

function MatchesVisualizer({
  mode,
  n,
  highlight,
}: {
  mode: 'row' | 'grid';
  n: number;
  highlight: boolean;
}) {
  const size = 60;
  const gap = 4;
  const padding = 36;

  const matches = useMemo(() => {
    const list: { id: string; x1: number; y1: number; x2: number; y2: number; type: 'h' | 'v' }[] =
      [];

    if (mode === 'row') {
      for (let i = 0; i < n; i++) {
        list.push({
          id: `h-top-${i}`,
          x1: i * size + gap,
          y1: 0,
          x2: (i + 1) * size - gap,
          y2: 0,
          type: 'h',
        });
        list.push({
          id: `h-bot-${i}`,
          x1: i * size + gap,
          y1: size,
          x2: (i + 1) * size - gap,
          y2: size,
          type: 'h',
        });
      }

      for (let i = 0; i <= n; i++) {
        list.push({
          id: `v-${i}`,
          x1: i * size,
          y1: gap,
          x2: i * size,
          y2: size - gap,
          type: 'v',
        });
      }
    } else {
      for (let r = 0; r <= n; r++) {
        for (let c = 0; c < n; c++) {
          list.push({
            id: `gh-${r}-${c}`,
            x1: c * size + gap,
            y1: r * size,
            x2: (c + 1) * size - gap,
            y2: r * size,
            type: 'h',
          });
        }
      }

      for (let c = 0; c <= n; c++) {
        for (let r = 0; r < n; r++) {
          list.push({
            id: `gv-${c}-${r}`,
            x1: c * size,
            y1: r * size + gap,
            x2: c * size,
            y2: (r + 1) * size - gap,
            type: 'v',
          });
        }
      }
    }

    return list;
  }, [mode, n]);

  const viewBoxWidth = n * size;
  const viewBoxHeight = mode === 'row' ? size : n * size;

  return (
    <div className="w-full rounded-[1.75rem] border border-black/5 bg-white shadow-inner">
      <div className="flex min-h-[360px] items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-8">
        <svg
          viewBox={`-${padding} -${padding} ${viewBoxWidth + padding * 2} ${viewBoxHeight + padding * 2}`}
          className="max-h-[420px] w-full max-w-[620px]"
        >
          {matches.map((m) => (
            <motion.line
              key={m.id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              x1={m.x1}
              y1={m.y1}
              x2={m.x2}
              y2={m.y2}
              stroke={highlight ? (m.type === 'h' ? '#f59e0b' : '#3b82f6') : '#111827'}
              strokeWidth={highlight ? 6 : 5}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function MatchesExplorer() {
  const [mode, setMode] = useState<'row' | 'grid'>('row');
  const [n, setN] = useState(4);
  const [highlight, setHighlight] = useState(false);
  const [conjecture, setConjecture] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const actualCount = useMemo(() => {
    return mode === 'row' ? 3 * n + 1 : 2 * n * (n + 1);
  }, [mode, n]);

  useEffect(() => {
    setN(mode === 'row' ? 4 : 2);
    setConjecture('');
    setIsCorrect(null);
    setShowReveal(false);
  }, [mode]);

  const checkFormula = () => {
    if (!conjecture.trim()) return;

    try {
      const clean = conjecture.toLowerCase().replace(/\s/g, '').replace(/n/g, '(x)');
      const mathExpr = clean
        .replace(/(\d)\(/g, '$1*(')
        .replace(/\)\(/g, ')*(')
        .replace(/\)x/g, ')*x')
        .replace(/(\d)x/g, '$1*x');

      const func = new Function('x', `return ${mathExpr}`);

      let correct = true;
      for (let testN = 1; testN <= 10; testN++) {
        const expected = mode === 'row' ? 3 * testN + 1 : 2 * testN * (testN + 1);
        const result = func(testN);
        if (typeof result !== 'number' || isNaN(result) || Math.abs(result - expected) > 0.01) {
          correct = false;
          break;
        }
      }

      setIsCorrect(correct);
    } catch {
      setIsCorrect(false);
    }
  };

  const reset = () => {
    setN(mode === 'row' ? 4 : 2);
    setConjecture('');
    setIsCorrect(null);
    setShowReveal(false);
    setHighlight(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Matches Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Investigate how many matchsticks are needed to build growing patterns. Look for
            structure, test a conjecture, and find a rule that works for any value of n.
          </p>
        </header>

        <SectionCard>
          <SectionHeader icon={<Info size={16} className="text-blue-500" />} title="The Problem" />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              {mode === 'row'
                ? 'How many matchsticks are required to make a row of n squares?'
                : 'How many matchsticks are required to make an n × n square grid?'}
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                    Pattern Visualizer
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {mode === 'row' ? <Maximize size={14} /> : <Grid3X3 size={14} />}
                    {mode === 'row' ? 'Linear row' : 'Grid array'}
                  </div>
                </div>
              </div>

              <div className="space-y-6 bg-gradient-to-b from-slate-50 to-white px-8 py-8">
                <MatchesVisualizer mode={mode} n={n} highlight={highlight} />

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-black/5 bg-gray-900 px-5 py-4 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                      n
                    </div>
                    <div className="mt-1 text-3xl font-bold">{n}</div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-blue-600 px-5 py-4 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-100">
                      Total Matches
                    </div>
                    <div className="mt-1 text-3xl font-bold">{actualCount}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Change n
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-blue-600">{n}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setN(Math.max(1, n - 1))}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        −
                      </button>
                      <button
                        onClick={() => setN(Math.min(mode === 'row' ? 20 : 10, n + 1))}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max={mode === 'row' ? 20 : 10}
                    value={n}
                    onChange={(e) => setN(parseInt(e.target.value, 10))}
                    className="matches-slider w-full cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setMode('row')}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      mode === 'row'
                        ? 'bg-blue-600 text-white'
                        : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Row Pattern
                  </button>

                  <button
                    onClick={() => setMode('grid')}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      mode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Grid Pattern
                  </button>

                  <button
                    onClick={() => setHighlight((prev) => !prev)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      highlight
                        ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Layers size={15} />
                      {highlight ? 'Hide Structure' : 'Show Structure'}
                    </span>
                  </button>

                  <button
                    onClick={reset}
                    className="rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <span className="inline-flex items-center gap-2">
                      <RotateCcw size={15} />
                      Reset
                    </span>
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard>
              <SectionHeader
                icon={<Calculator size={16} className="text-blue-500" />}
                title="Formula Lab"
              />
              <div className="space-y-6 px-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Conjecture</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={conjecture}
                      onChange={(e) => setConjecture(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkFormula()}
                      placeholder={mode === 'row' ? 'e.g. 3n + 1' : 'e.g. 2n(n + 1)'}
                      className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 pr-14 text-xl font-semibold text-gray-900 outline-none ring-0 transition focus:border-blue-200 focus:bg-white"
                    />
                    {isCorrect !== null && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isCorrect ? (
                          <CheckCircle2 size={22} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={22} className="text-rose-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={checkFormula}
                    className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Check Formula
                  </button>

                  <button
                    onClick={() => setShowReveal((prev) => !prev)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      showReveal
                        ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {showReveal ? 'Hide Reveal' : 'Reveal Strategy'}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isCorrect !== null && (
                    <motion.div
                      key={String(isCorrect)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`rounded-2xl px-6 py-6 ${
                        isCorrect
                          ? 'border border-emerald-100 bg-emerald-50'
                          : 'border border-rose-100 bg-rose-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                        ) : (
                          <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-500" />
                        )}

                        <div>
                          <div
                            className={`font-semibold ${
                              isCorrect ? 'text-emerald-800' : 'text-rose-800'
                            }`}
                          >
                            {isCorrect ? 'That works' : 'Not quite'}
                          </div>
                          <p
                            className={`mt-1 text-sm leading-7 ${
                              isCorrect ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {isCorrect
                              ? 'Your formula matches the pattern for the tested values.'
                              : 'Try checking how many new matches are added each time n increases.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Data Table"
              />
              <div className="px-6 py-6">
                <div className="max-h-[420px] overflow-hidden rounded-2xl border border-black/5">
                  <div className="max-h-[420px] overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">n</th>
                          <th className="px-4 py-3 font-semibold">Matches</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 bg-white">
                        {Array.from({ length: mode === 'row' ? 20 : 10 }, (_, i) => i + 1).map(
                          (value) => {
                            const count = mode === 'row' ? 3 * value + 1 : 2 * value * (value + 1);
                            const isActive = value === n;

                            return (
                              <tr key={value} className={isActive ? 'bg-gray-50' : ''}>
                                <td
                                  className={`px-4 py-3 font-medium ${
                                    isActive ? 'text-blue-600' : 'text-gray-900'
                                  }`}
                                >
                                  {value}
                                </td>
                                <td
                                  className={`px-4 py-3 ${
                                    isActive ? 'font-semibold text-blue-600' : 'text-gray-700'
                                  }`}
                                >
                                  {count}
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-black/5 bg-gray-50 px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Observation
                  </div>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    When <span className="font-semibold text-blue-600">n = {n}</span>, the pattern
                    uses <span className="font-semibold text-blue-600">{actualCount}</span>{' '}
                    matchsticks.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <AnimatePresence>
          {showReveal && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <SectionCard>
                <SectionHeader
                  icon={<BookOpen size={16} className="text-amber-500" />}
                  title="Generalization"
                />

                <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Counting structure</h3>

                    <p className="text-sm leading-7 text-gray-600">
                      {mode === 'row'
                        ? 'In the row pattern, the first square needs 4 matches. Every additional square shares one side, so it only adds 3 more.'
                        : 'In the grid pattern, it helps to count horizontal and vertical matches separately rather than trying to count everything at once.'}
                    </p>

                    <p className="text-sm leading-7 text-gray-600">
                      {mode === 'row'
                        ? 'That gives a constant growth pattern: start with 4, then add 3 for each extra square.'
                        : 'There are (n + 1) horizontal rows of n matches and (n + 1) vertical columns of n matches.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
                      <div className="text-lg font-semibold text-amber-700">
                        General formula
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/70 bg-white px-4 py-5 text-center">
                        <BlockMath math={mode === 'row' ? '3n+1' : '2n(n+1)'} />
                      </div>

                      <p className="mt-4 text-sm text-gray-700">
                        {mode === 'row'
                          ? 'This works because one square needs 4 matches, and each new square adds 3 more shared-edge matches.'
                          : 'This works because total matches = horizontal matches + vertical matches = n(n + 1) + n(n + 1).'}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .matches-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 9999px;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }

        .matches-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 9999px;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}