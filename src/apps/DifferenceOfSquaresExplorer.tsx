import { useEffect, useMemo, useState } from 'react';
import {
  Info,
  Calculator,
  Grid3X3,
  History,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Search,
  BookOpen,
  Square,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface SquareResult {
  n: number;
  x: number | null;
  y: number | null;
  possible: boolean;
  mod4: number;
  factors: { u: number; v: number } | null;
}

const solveSquareDifference = (n: number): SquareResult => {
  const mod4 = n % 4;

  if (n < 0) return { n, x: null, y: null, possible: false, mod4, factors: null };
  if (n === 0) {
    return { n, x: 0, y: 0, possible: true, mod4, factors: { u: 0, v: 0 } };
  }

  for (let u = 1; u <= Math.sqrt(n); u++) {
    if (n % u === 0) {
      const v = n / u;
      if ((u + v) % 2 === 0) {
        return {
          n,
          x: (u + v) / 2,
          y: (v - u) / 2,
          possible: true,
          mod4,
          factors: { u, v },
        };
      }
    }
  }

  return { n, x: null, y: null, possible: false, mod4, factors: null };
};

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

export default function DifferenceOfSquaresExplorer() {
  const [inputN, setInputN] = useState<number>(15);
  const [history, setHistory] = useState<SquareResult[]>([]);
  const [showPossibleOnly, setShowPossibleOnly] = useState(false);
  const [showGeneralization, setShowGeneralization] = useState(false);

  const result = useMemo(() => solveSquareDifference(inputN), [inputN]);

  useEffect(() => {
    if (!history.find((h) => h.n === inputN)) {
      setHistory((prev) => [result, ...prev].slice(0, 12));
    }
  }, [inputN, result, history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setInputN(0);
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1000) {
      setInputN(parsed);
    }
  };

  const reset = () => {
    setInputN(15);
    setHistory([]);
    setShowPossibleOnly(false);
    setShowGeneralization(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Difference of Squares Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Investigate which whole numbers can be written as the difference of two
            perfect squares, and look for a pattern in the numbers that work.
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              Which numbers can be expressed as the difference of two perfect
              squares? Test examples, organize your findings, and make a
              generalization.
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard>
              <SectionHeader
                icon={<Calculator size={16} className="text-blue-500" />}
                title="Difference Engine"
              />
              <div className="space-y-6 px-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Target Number (N)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={inputN || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 pr-28 text-4xl font-bold text-gray-900 outline-none ring-0 transition focus:border-blue-200 focus:bg-white"
                      placeholder="0"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-right">
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          result.possible ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {result.possible ? 'Possible' : 'Impossible'}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-gray-400">
                        N ≡ {result.mod4} (mod 4)
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {result.possible ? (
                    <motion.div
                      key="possible"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-6"
                    >
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 size={18} />
                        <span className="text-sm font-semibold uppercase tracking-[0.12em]">
                          Solution Found
                        </span>
                      </div>

                      <div className="mt-4 text-2xl font-semibold text-gray-900">
                        {result.x}² − {result.y}² = {result.n}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                          <div className="text-[11px] uppercase tracking-wide text-gray-500">
                            x + y
                          </div>
                          <div className="mt-1 text-2xl font-semibold text-gray-900">
                            {result.factors?.v}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                          <div className="text-[11px] uppercase tracking-wide text-gray-500">
                            x − y
                          </div>
                          <div className="mt-1 text-2xl font-semibold text-gray-900">
                            {result.factors?.u}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                          <div className="text-[11px] uppercase tracking-wide text-gray-500">
                            Product
                          </div>
                          <div className="mt-1 text-2xl font-semibold text-blue-600">
                            {result.n}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="impossible"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-6"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-500" />
                        <div>
                          <div className="font-semibold text-rose-800">No integer solution</div>
                          <p className="mt-1 text-sm leading-7 text-rose-700">
                            If N = (x − y)(x + y), then the two factors must have the same
                            parity. Numbers that are 2 mod 4 do not work.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={reset}
                    className="rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Reset
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
            </SectionCard>

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
                        <th className="px-4 py-3 font-semibold">Expression</th>
                        <th className="px-4 py-3 font-semibold">Factors</th>
                        <th className="px-4 py-3 font-semibold">mod 4</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 bg-white">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm italic text-gray-500">
                            No tests recorded yet.
                          </td>
                        </tr>
                      ) : (
                        history.map((item, i) => (
                          <tr
                            key={`${item.n}-${i}`}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setInputN(item.n)}
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">{item.n}</td>
                            <td className="px-4 py-3 text-gray-700">
                              {item.possible ? `${item.x}² − ${item.y}²` : '—'}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {item.possible ? `(${item.factors?.u}, ${item.factors?.v})` : '—'}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{item.mod4}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
                                  item.possible
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-600'
                                }`}
                              >
                                {item.possible ? 'Possible' : 'Impossible'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </SectionCard>

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
                      <h3 className="text-lg font-semibold text-gray-900">
                        The parity insight
                      </h3>

                      <p className="text-sm leading-7 text-gray-600">
                        If N = (x − y)(x + y), then the sum of the two factors is 2x,
                        which must be even. Therefore the two factors must have the
                        same parity: both odd or both even.
                      </p>

                      <p className="text-sm leading-7 text-gray-600">
                        This explains why odd numbers and multiples of four work.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
                        <div className="text-lg font-semibold text-amber-700">
                          A number N can be written as a difference of squares iff:
                        </div>

                        <ul className="mt-4 space-y-3 text-sm text-gray-700">
                          <li>• N is odd</li>
                          <li>• or N is divisible by 4</li>
                        </ul>

                        <p className="mt-4 text-sm text-rose-600">
                          Numbers where N ≡ 2 (mod 4) cannot be written as a difference
                          of squares.
                        </p>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>

          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Gnomon Visualizer
                </h2>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
                <div className="mx-auto flex min-h-[360px] max-w-md flex-col items-center justify-center rounded-2xl border border-black/5 bg-white shadow-inner">
                  {result.possible && result.x && result.x <= 20 ? (
                    <div className="space-y-5 text-center">
                      <svg
                        width="220"
                        height="220"
                        viewBox={`0 0 ${result.x * 20} ${result.x * 20}`}
                        className="mx-auto"
                      >
                        {Array.from({ length: result.x }).map((_, row) =>
                          Array.from({ length: result.x }).map((_, col) => {
                            const isRemoved = row < (result.y || 0) && col < (result.y || 0);

                            return (
                              <rect
                                key={`${row}-${col}`}
                                x={col * 20}
                                y={row * 20}
                                width="18"
                                height="18"
                                rx="3"
                                fill={isRemoved ? '#F3F4F6' : '#111827'}
                                stroke={isRemoved ? '#D1D5DB' : 'none'}
                              />
                            );
                          })
                        )}
                      </svg>

                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                          Large Square: {result.x} × {result.x}
                        </p>
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-blue-600">
                          Gnomon Area: {result.n}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="px-10 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-300">
                        <Square size={30} />
                      </div>
                      <p className="mt-4 text-sm text-gray-500">
                        {result.x && result.x > 20
                          ? 'This number is too large for the current visualizer.'
                          : 'Enter a value that can be written as a difference of squares.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Grid3X3 size={16} className="text-blue-500" />}
                title="Pattern Grid"
              />
              <div className="space-y-4 px-6 py-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPossibleOnly((prev) => !prev)}
                    className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                      showPossibleOnly
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-black/10 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {showPossibleOnly ? 'Show All' : 'Filter Possible'}
                  </button>
                </div>

                <div className="grid grid-cols-10 gap-1.5">
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
                    const res = solveSquareDifference(n);
                    const isCurrent = n === inputN;

                    if (showPossibleOnly && !res.possible) {
                      return <div key={n} className="aspect-square rounded-md bg-gray-50" />;
                    }

                    return (
                      <button
                        key={n}
                        onClick={() => setInputN(n)}
                        className={`aspect-square rounded-md text-[10px] font-semibold transition ${
                          isCurrent ? 'scale-110 ring-2 ring-blue-600' : ''
                        } ${
                          res.possible
                            ? 'bg-gray-900 text-white hover:bg-gray-700'
                            : 'bg-rose-50 text-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
                title="Mathematical Idea"
              />
              <div className="px-6 py-6 text-sm leading-7 text-gray-600">
                Writing a number as x² − y² is the same as factoring it as
                (x − y)(x + y). The parity of those two factors determines whether
                integer values of x and y are possible.
              </div>
            </SectionCard>
          </div>
        </div>

       
      </div>
    </div>
  );
}