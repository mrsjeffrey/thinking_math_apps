import { useMemo, useState } from 'react';
import {
  Info,
  Calculator,
  History,
  BookOpen,
  MousePointer2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

type Spot = {
  x: number;
  y: number;
};

type Feedback = {
  text: string;
  type: 'info' | 'success' | 'warning';
} | null;

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

const nCr = (n: number, r: number): number => {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;

  let result = 1;
  for (let i = 1; i <= r; i += 1) {
    result = (result * (n - i + 1)) / i;
  }

  return Math.round(result);
};

const calculateMaxRegions = (n: number): number => {
  return nCr(n, 4) + nCr(n, 2) + 1;
};

export default function CirclesAndSpotsExplorer() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [conjecture, setConjecture] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showGeneralization, setShowGeneralization] = useState(false);

  const n = spots.length;
  const regions = useMemo(() => calculateMaxRegions(n), [n]);

  const handleCircleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (n >= 12) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const transformed = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const centerX = 200;
    const centerY = 200;
    const radius = 160;

    const angle = Math.atan2(transformed.y - centerY, transformed.x - centerX);

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    setSpots((prev) => [...prev, { x, y }]);
    setFeedback(null);
  };

  const reset = () => {
    setSpots([]);
    setConjecture('');
    setFeedback(null);
    setShowGeneralization(false);
  };

  const checkConjecture = () => {
    const normalized = conjecture.toLowerCase().replace(/\s/g, '');

    if (
      normalized === '2^(n-1)' ||
      normalized === '2**(n-1)' ||
      normalized === '2^{n-1}' ||
      normalized === '2^(n−1)'
    ) {
      if (n < 6) {
        setFeedback({
          text: 'That fits the early data, but test more values before trusting the pattern.',
          type: 'info',
        });
      } else {
        setFeedback({
          text: 'Good guess, but the doubling pattern breaks at N = 6.',
          type: 'warning',
        });
      }
      return;
    }

    if (
      normalized.includes('choose') ||
      normalized.includes('binom') ||
      normalized.includes('ncr') ||
      (normalized.includes('n') && normalized.includes('4'))
    ) {
      setFeedback({
        text: 'Nice thinking — that points toward the deeper combinatorial pattern.',
        type: 'success',
      });
      return;
    }

    setFeedback({
      text: 'Interesting idea. Compare it against several values in the table.',
      type: 'info',
    });
  };

  const loadPresetSpots = (value: number) => {
    const newSpots: Spot[] = [];
    const centerX = 200;
    const centerY = 200;
    const radius = 160;

    for (let i = 0; i < value; i += 1) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / value;
      newSpots.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }

    setSpots(newSpots);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Circle and Spots Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Place points on a circle, connect every pair with straight chords, and investigate
            how many regions can be formed. Look for patterns, test conjectures, and uncover the
            deeper structure.
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              Place <InlineMath math="N" /> spots around a circle and join every pair with a
              straight line. What is the greatest number of regions into which the circle can be
              divided?
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                    Circle Visualizer
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    <MousePointer2 size={14} />
                    Click edge to add spots
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
                <div className="mx-auto max-w-3xl rounded-2xl border border-black/5 bg-white p-5 shadow-inner">
                  <div className="relative mx-auto aspect-square w-full max-w-[520px]">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 400 400"
                      onClick={handleCircleClick}
                      className="cursor-crosshair"
                    >
                      <circle
                        cx="200"
                        cy="200"
                        r="160"
                        fill="none"
                        stroke="#D1D5DB"
                        strokeWidth="2"
                      />

                      {spots.map((s1, i) =>
                        spots.slice(i + 1).map((s2, j) => (
                          <motion.line
                            key={`line-${i}-${j}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.45 }}
                            transition={{ duration: 0.3 }}
                            x1={s1.x}
                            y1={s1.y}
                            x2={s2.x}
                            y2={s2.y}
                            stroke="#64748B"
                            strokeWidth="1.1"
                          />
                        ))
                      )}

                      {spots.map((spot, i) => (
                        <motion.circle
                          key={`spot-${i}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.18 }}
                          cx={spot.x}
                          cy={spot.y}
                          r="5.5"
                          fill="#111827"
                        />
                      ))}
                    </svg>

                    {n === 0 && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full border border-dashed border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-gray-400 shadow-sm">
                          Click the circumference to begin
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-black/5 bg-gray-900 px-5 py-4 text-white">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Spots (N)
                      </div>
                      <div className="mt-1 text-3xl font-bold">{n}</div>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-blue-600 px-5 py-4 text-white">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-100">
                        Regions (R)
                      </div>
                      <div className="mt-1 text-3xl font-bold">{regions}</div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={reset}
                      className="rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <span className="inline-flex items-center gap-2">
                        <RotateCcw size={15} />
                        Reset
                      </span>
                    </button>

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
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Calculator size={16} className="text-blue-500" />}
                title="Conjecture Check"
              />
              <div className="space-y-6 px-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Formula</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={conjecture}
                      onChange={(e) => setConjecture(e.target.value)}
                      placeholder="e.g. 2^(n-1)"
                      className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 pr-28 text-xl font-semibold text-gray-900 outline-none ring-0 transition focus:border-blue-200 focus:bg-white"
                    />
                    <button
                      onClick={checkConjecture}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                    >
                      Check
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.div
                      key={feedback.text}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`rounded-2xl px-6 py-6 ${
                        feedback.type === 'warning'
                          ? 'border border-rose-100 bg-rose-50'
                          : feedback.type === 'success'
                            ? 'border border-emerald-100 bg-emerald-50'
                            : 'border border-slate-100 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {feedback.type === 'warning' ? (
                          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rose-500" />
                        ) : feedback.type === 'success' ? (
                          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                        ) : (
                          <Lightbulb size={20} className="mt-0.5 shrink-0 text-slate-500" />
                        )}

                        <div>
                          <div
                            className={`font-semibold ${
                              feedback.type === 'warning'
                                ? 'text-rose-800'
                                : feedback.type === 'success'
                                  ? 'text-emerald-800'
                                  : 'text-slate-800'
                            }`}
                          >
                            {feedback.type === 'warning'
                              ? 'Pattern Warning'
                              : feedback.type === 'success'
                                ? 'Strong Direction'
                                : 'Keep Testing'}
                          </div>
                          <p
                            className={`mt-1 text-sm leading-7 ${
                              feedback.type === 'warning'
                                ? 'text-rose-700'
                                : feedback.type === 'success'
                                  ? 'text-emerald-700'
                                  : 'text-slate-700'
                            }`}
                          >
                            {feedback.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Investigation Log"
              />
              <div className="px-6 py-6">
                <div className="overflow-hidden rounded-2xl border border-black/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">N</th>
                        <th className="px-4 py-3 font-semibold">Maximum Regions</th>
                        <th className="px-4 py-3 font-semibold">Pattern Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 bg-white">
                      {Array.from({ length: Math.max(10, n) }, (_, i) => i + 1).map((rowN) => {
                        const rowR = calculateMaxRegions(rowN);
                        const isVisible = rowN <= n;
                        const isBreak = rowN === 6 && n >= 6;

                        return (
                          <tr key={rowN} className={rowN === n ? 'bg-gray-50' : ''}>
                            <td className="px-4 py-3 font-medium text-gray-900">{rowN}</td>
                            <td className="px-4 py-3 text-gray-700">{isVisible ? rowR : '—'}</td>
                            <td
                              className={`px-4 py-3 ${
                                isBreak ? 'font-medium text-rose-600' : 'text-gray-500'
                              }`}
                            >
                              {!isVisible
                                ? '—'
                                : rowN < 6
                                  ? 'Looks like doubling'
                                  : rowN === 6
                                    ? 'Doubling breaks here'
                                    : 'Needs deeper rule'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5">
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Jump to a case
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
                      const isCurrent = value === n;
                      return (
                        <button
                          key={value}
                          className={`rounded-md px-3 py-3 text-sm font-semibold transition ${
                            isCurrent
                              ? 'scale-105 bg-blue-600 text-white'
                              : value <= n
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                          onClick={() => loadPresetSpots(value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <AnimatePresence>
          {showGeneralization && (
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
                    <h3 className="text-lg font-semibold text-gray-900">The pattern trap</h3>

                    <p className="text-sm leading-7 text-gray-600">
                      Early values can make it seem like the number of regions is doubling each
                      time. That is a tempting conjecture, but it eventually fails.
                    </p>

                    <p className="text-sm leading-7 text-gray-600">
                      This is a good reminder that matching a few cases is not the same as proving
                      a pattern.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
                      <div className="text-lg font-semibold text-amber-700">
                        Maximum regions formula
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/70 bg-white px-4 py-5 text-center">
                        <BlockMath math="R(n)=\binom{n}{4}+\binom{n}{2}+1" />
                      </div>

                      <p className="mt-4 text-sm text-gray-700">
                        The number of interior intersections contributes{' '}
                        <InlineMath math="\binom{n}{4}" />, the chords contribute{' '}
                        <InlineMath math="\binom{n}{2}" />, and the original undivided region adds
                        1.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}