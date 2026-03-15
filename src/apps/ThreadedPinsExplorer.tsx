import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Info,
  Play,
  Square,
  RotateCcw,
  Lightbulb,
  Settings,
  History,
  CircleDashed,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Point = {
  x: number;
  y: number;
  index: number;
};

type ThreadPath = {
  points: Point[];
  color: string;
  pinIndices: number[];
};

type TestResult = {
  pins: number;
  gap: number;
  threads: number;
  gcdValue: number;
};

const COLORS = [
  '#4f46e5',
  '#0f766e',
  '#7c3aed',
  '#ea580c',
  '#2563eb',
  '#db2777',
  '#16a34a',
  '#dc2626',
];

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
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

export default function ThreadedPinsExplorer() {
  const [numPins, setNumPins] = useState(12);
  const [gap, setGap] = useState(3);
  const [speed, setSpeed] = useState(450);

  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPin, setCurrentPin] = useState(0);
  const [visitedPins, setVisitedPins] = useState<Set<number>>(new Set());
  const [threads, setThreads] = useState<ThreadPath[]>([]);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [showGeneralization, setShowGeneralization] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pins = useMemo(() => {
    const p: Point[] = [];
    const radius = 185;
    const centerX = 250;
    const centerY = 250;

    for (let i = 0; i < numPins; i++) {
      const angle = (i * 2 * Math.PI) / numPins - Math.PI / 2;
      p.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        index: i,
      });
    }

    return p;
  }, [numPins]);

  const actualGcd = useMemo(() => gcd(numPins, gap), [numPins, gap]);

  const stopSimulation = () => {
    setIsAnimating(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetSimulation = () => {
    stopSimulation();
    setIsComplete(false);
    setCurrentPin(0);
    setVisitedPins(new Set());
    setThreads([]);
  };

  const startSimulation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsComplete(false);
    setCurrentPin(0);
    setVisitedPins(new Set([0]));
    setThreads([{ points: [pins[0]], color: COLORS[0], pinIndices: [0] }]);
  };

  useEffect(() => {
    if (!isAnimating) return;

    timerRef.current = setInterval(() => {
      setThreads((prev) => {
        if (prev.length === 0) return prev;

        const currentThread = prev[prev.length - 1];
        const nextPinIndex = (currentPin + gap) % numPins;
        const startPinOfCurrentThread = currentThread.pinIndices[0];

        if (nextPinIndex === startPinOfCurrentThread) {
          const updatedThread: ThreadPath = {
            ...currentThread,
            points: [...currentThread.points, pins[nextPinIndex]],
            pinIndices: [...currentThread.pinIndices, nextPinIndex],
          };

          const newVisited = new Set(visitedPins);
          updatedThread.pinIndices.forEach((idx) => newVisited.add(idx));

          if (newVisited.size === numPins) {
            stopSimulation();
            setIsComplete(true);

            const result: TestResult = {
              pins: numPins,
              gap,
              threads: prev.length,
              gcdValue: actualGcd,
            };

            setHistory((existing) => {
              const alreadyExists = existing.some(
                (r) => r.pins === result.pins && r.gap === result.gap
              );
              if (alreadyExists) return existing;
              return [result, ...existing].slice(0, 10);
            });

            return [...prev.slice(0, -1), updatedThread];
          }

          let nextStart = 0;
          for (let i = 0; i < numPins; i++) {
            if (!newVisited.has(i)) {
              nextStart = i;
              break;
            }
          }

          setCurrentPin(nextStart);
          setVisitedPins(newVisited);

          return [
            ...prev.slice(0, -1),
            updatedThread,
            {
              points: [pins[nextStart]],
              color: COLORS[prev.length % COLORS.length],
              pinIndices: [nextStart],
            },
          ];
        }

        setCurrentPin(nextPinIndex);

        return [
          ...prev.slice(0, -1),
          {
            ...currentThread,
            points: [...currentThread.points, pins[nextPinIndex]],
            pinIndices: [...currentThread.pinIndices, nextPinIndex],
          },
        ];
      });
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnimating, currentPin, gap, numPins, pins, speed, visitedPins, actualGcd]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Threaded Pins Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Investigate what happens when you move around a circle of pins using a
            constant gap. How many separate thread loops are needed before every pin
            is used?
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              Imagine placing a number of pins around a circle. Starting at one pin,
              move clockwise by a fixed gap each time and connect the pins with
              thread. How many separate pieces of thread are needed in general?
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Visual Representation
                </h2>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
                <div className="mx-auto flex max-w-3xl flex-col items-center">
                  <div className="relative flex h-[520px] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-white shadow-inner">
                    <svg
                      width="500"
                      height="500"
                      viewBox="0 0 500 500"
                      className="max-h-full max-w-full"
                    >
                      <circle
                        cx="250"
                        cy="250"
                        r="185"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1.5"
                        strokeDasharray="5 7"
                      />

                      {threads.map((thread, i) => (
                        <motion.path
                          key={i}
                          d={thread.points
                            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                            .join(' ')}
                          stroke={thread.color}
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0.6 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.25 }}
                        />
                      ))}

                      {pins.map((pin) => {
                        const isVisited = visitedPins.has(pin.index);
                        const isCurrent = currentPin === pin.index && isAnimating;

                        return (
                          <g key={pin.index}>
                            <motion.circle
                              cx={pin.x}
                              cy={pin.y}
                              r={isCurrent ? 9 : 6}
                              fill={
                                isCurrent
                                  ? '#2563eb'
                                  : isVisited
                                  ? '#cbd5e1'
                                  : '#f8fafc'
                              }
                              stroke={
                                isCurrent
                                  ? '#dbeafe'
                                  : isVisited
                                  ? '#94a3b8'
                                  : '#cbd5e1'
                              }
                              strokeWidth="2"
                              animate={{ scale: isCurrent ? 1.15 : 1 }}
                            />
                            <text
                              x={pin.x}
                              y={pin.y + (pin.y > 250 ? 24 : -14)}
                              textAnchor="middle"
                              className="fill-slate-400 text-[10px] font-mono font-bold"
                            >
                              {pin.index}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={isAnimating ? stopSimulation : startSimulation}
                      disabled={isComplete}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        isComplete
                          ? 'cursor-not-allowed border border-black/5 bg-gray-100 text-gray-400'
                          : isAnimating
                          ? 'border border-red-100 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isAnimating ? (
                        <>
                          <Square size={16} fill="currentColor" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play size={16} fill="currentColor" />
                          Run Threading
                        </>
                      )}
                    </button>

                    <button
                      onClick={resetSimulation}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>

                  <AnimatePresence>
                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700"
                      >
                        Complete: {threads.length} {threads.length === 1 ? 'thread' : 'threads'} needed
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
                title="Generalization"
              />
              <div className="px-6 py-6">
                {history.length < 3 ? (
                  <p className="text-sm leading-7 text-gray-600">
                    Try at least <span className="font-semibold text-gray-900">3 different tests</span> and look
                    for a relationship between the number of pins, the gap size, and
                    the number of thread loops.
                  </p>
                ) : !showGeneralization ? (
                  <div className="space-y-4">
                    <p className="text-sm leading-7 text-gray-600">
                      You now have enough evidence to make a conjecture. What do you
                      notice?
                    </p>
                    <button
                      onClick={() => setShowGeneralization(true)}
                      className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                      Reveal Formula
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
                      <div className="text-xl font-semibold text-amber-700">
                        Threads = gcd(P, G)
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-gray-600">
                      The number of separate thread loops is always the greatest common
                      divisor of the number of pins and the gap size.
                    </p>
                  </motion.div>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard>
              <SectionHeader
                icon={<Settings size={16} className="text-blue-500" />}
                title="Configuration"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium text-gray-700">Number of Pins (P)</label>
                    <span className="font-mono text-blue-600">{numPins}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    step="1"
                    value={numPins}
                    onChange={(e) => {
                      setNumPins(parseInt(e.target.value, 10));
                      resetSimulation();
                    }}
                    disabled={isAnimating}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium text-gray-700">Gap Size (G)</label>
                    <span className="font-mono text-blue-600">{gap}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={Math.max(1, numPins - 1)}
                    step="1"
                    value={gap}
                    onChange={(e) => {
                      setGap(parseInt(e.target.value, 10));
                      resetSimulation();
                    }}
                    disabled={isAnimating}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium text-gray-700">Animation Speed</label>
                    <span className="font-mono text-gray-500">{speed}ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer accent-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Predicted Threads
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {actualGcd}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Status
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {isAnimating ? 'Running' : isComplete ? 'Complete' : 'Ready'}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Discovery Log"
              />
              <div className="px-6 py-6">
                {history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm italic text-gray-500">
                    No tests recorded yet.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-black/5">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Pins</th>
                          <th className="px-4 py-3 font-semibold">Gap</th>
                          <th className="px-4 py-3 font-semibold">Threads</th>
                          {showGeneralization && (
                            <th className="px-4 py-3 font-semibold">GCD</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 bg-white">
                        {history.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{item.pins}</td>
                            <td className="px-4 py-3">{item.gap}</td>
                            <td className="px-4 py-3 font-medium text-blue-600">
                              {item.threads}
                            </td>
                            {showGeneralization && (
                              <td className="px-4 py-3 text-blue-600">
                                {item.gcdValue}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<CircleDashed size={16} className="text-blue-500" />}
                title="Mathematical Idea"
              />
              <div className="px-6 py-6 text-sm leading-7 text-gray-600">
                Each move jumps forward by the same amount around a circle. Sometimes
                that single jump pattern reaches every pin, and sometimes it splits
                into multiple repeating loops. This is what makes the greatest common
                divisor show up naturally.
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}