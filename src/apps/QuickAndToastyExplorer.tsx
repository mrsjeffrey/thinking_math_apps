import React, { useEffect, useState } from 'react';
import {
  Timer,
  Flame,
  RotateCw,
  Plus,
  History,
  Info,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  Lightbulb,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TOAST_TIME = 30;
const IN_OUT_TIME = 5;
const TURN_TIME = 3;

type SliceSide = 'A' | 'B';
type SliceLocation = 'counter' | 'slot-0' | 'slot-1';

interface Slice {
  id: number;
  sideA: number;
  sideB: number;
  facing: SliceSide;
  location: SliceLocation;
}

interface LogEntry {
  time: number;
  duration: number;
  action: string;
  id: number;
  type: 'move' | 'turn' | 'toast';
}

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

const initialSlices = (): Slice[] => [
  { id: 1, sideA: 0, sideB: 0, facing: 'A', location: 'counter' },
  { id: 2, sideA: 0, sideB: 0, facing: 'A', location: 'counter' },
  { id: 3, sideA: 0, sideB: 0, facing: 'A', location: 'counter' },
];

export default function QuickAndToastyExplorer() {
  const [slices, setSlices] = useState<Slice[]>(initialSlices());
  const [masterTime, setMasterTime] = useState(0);
  const [isToasting, setIsToasting] = useState(false);
  const [toastProgress, setToastProgress] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const allToasted = slices.every((s) => s.sideA >= 100 && s.sideB >= 100);
  const anyBurned = slices.some((s) => s.sideA > 100 || s.sideB > 100);
  const slicesInSlots = slices.filter((s) => s.location !== 'counter');

  useEffect(() => {
    if (anyBurned && !showFailure) {
      setShowFailure(true);
    } else if (allToasted && !showSuccess && !anyBurned) {
      setShowSuccess(true);
    }
  }, [allToasted, anyBurned, showSuccess, showFailure]);

  const addLog = (
    action: string,
    duration: number,
    type: LogEntry['type'],
    id: number = 0
  ) => {
    setLog((prev) => [...prev, { time: masterTime, duration, action, id, type }]);
  };

  const moveSlice = (id: number) => {
    if (isToasting) return;

    const slice = slices.find((s) => s.id === id);
    if (!slice) return;

    let action = '';
    let newLoc: SliceLocation = 'counter';

    if (slice.location === 'counter') {
      const occupied = slices.map((s) => s.location);
      if (!occupied.includes('slot-0')) newLoc = 'slot-0';
      else if (!occupied.includes('slot-1')) newLoc = 'slot-1';
      else return;
      action = `In: Slice ${id}`;
    } else {
      newLoc = 'counter';
      action = `Out: Slice ${id}`;
    }

    setSlices((prev) => prev.map((s) => (s.id === id ? { ...s, location: newLoc } : s)));
    addLog(action, IN_OUT_TIME, 'move', id);
    setMasterTime((t) => t + IN_OUT_TIME);
  };

  const turnOver = (id: number) => {
    if (isToasting) return;

    const slice = slices.find((s) => s.id === id);
    if (!slice || slice.location === 'counter') return;

    setSlices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, facing: s.facing === 'A' ? 'B' : 'A' } : s
      )
    );
    setMasterTime((t) => t + TURN_TIME);
    addLog(`Turn: Slice ${id}`, TURN_TIME, 'turn', id);
  };

  const startToasting = () => {
    if (slicesInSlots.length === 0 || isToasting) return;

    setIsToasting(true);
    setToastProgress(0);

    const duration = 2000;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      setToastProgress(progress * 100);

      if (progress >= 1) {
        clearInterval(interval);
        setIsToasting(false);
        setToastProgress(0);

        setSlices((prev) =>
          prev.map((s) => {
            if (s.location !== 'counter') {
              return {
                ...s,
                sideA: s.facing === 'A' ? s.sideA + 100 : s.sideA,
                sideB: s.facing === 'B' ? s.sideB + 100 : s.sideB,
              };
            }
            return s;
          })
        );

        addLog('Toasted', TOAST_TIME, 'toast');
        setMasterTime((t) => t + TOAST_TIME);
      }
    }, 16);
  };

  const reset = () => {
    setSlices(initialSlices());
    setMasterTime(0);
    setLog([]);
    setShowSuccess(false);
    setShowFailure(false);
    setIsToasting(false);
    setToastProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Quick and Toasty Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Explore an optimization puzzle: three slices of bread must be toasted on
            both sides using a two-slot grill, while accounting for loading,
            unloading, and turning time.
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              Three slices of bread must be toasted on both sides. The grill can hold
              only two slices at once, and each side needs exactly 30 seconds. What is
              the fastest possible strategy?
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <SectionCard>
              <SectionHeader
                icon={<Flame size={16} className="text-blue-500" />}
                title="Grill"
              />
              <div className="space-y-6 px-6 py-6">
                <div className="overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className="h-2 bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${toastProgress}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Elapsed Time
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-2xl font-semibold text-gray-900">
                      <Timer size={20} className="text-blue-600" />
                      {masterTime}s
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={startToasting}
                      disabled={isToasting || slicesInSlots.length === 0}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        isToasting || slicesInSlots.length === 0
                          ? 'cursor-not-allowed border border-black/5 bg-gray-100 text-gray-400'
                          : 'border border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Play size={16} fill="currentColor" />
                      {isToasting ? 'Toasting...' : 'Start Grill'}
                    </button>

                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <RefreshCw size={16} />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {[0, 1].map((slotIdx) => {
                    const sliceInSlot = slices.find((s) => s.location === `slot-${slotIdx}`);

                    return (
                      <div
                        key={slotIdx}
                        className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5"
                      >
                        <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                          Slot {slotIdx + 1}
                        </div>

                        <div className="flex aspect-square items-center justify-center rounded-2xl border border-black/5 bg-white shadow-inner">
                          <AnimatePresence mode="wait">
                            {sliceInSlot ? (
                              <motion.div
                                key={sliceInSlot.id}
                                layoutId={`slice-${sliceInSlot.id}`}
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.85, opacity: 0 }}
                                className="h-40 w-40"
                              >
                                <BreadSlice
                                  slice={sliceInSlot}
                                  onAction={() => moveSlice(sliceInSlot.id)}
                                  onTurn={() => turnOver(sliceInSlot.id)}
                                  isToasting={isToasting}
                                />
                              </motion.div>
                            ) : (
                              <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-gray-300">
                                Empty
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Plus size={16} className="text-blue-500" />}
                title="Counter"
              />
              <div className="px-6 py-6">
                <div className="flex flex-wrap gap-6">
                  {slices
                    .filter((s) => s.location === 'counter')
                    .map((slice) => (
                      <motion.div key={slice.id} layoutId={`slice-${slice.id}`} className="h-32 w-32">
                        <BreadSlice
                          slice={slice}
                          onAction={() => moveSlice(slice.id)}
                          isToasting={isToasting}
                        />
                      </motion.div>
                    ))}

                  {slices.filter((s) => s.location === 'counter').length === 0 && (
                    <div className="flex h-32 items-center text-sm italic text-gray-400">
                      Counter is empty.
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Action Timeline"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="flex h-8 overflow-hidden rounded-xl border border-black/5 bg-gray-100">
                  {log.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex h-full items-center justify-center border-r border-white/20 px-1 text-[9px] font-bold text-white ${
                        entry.type === 'toast'
                          ? 'bg-orange-500'
                          : entry.type === 'move'
                          ? 'bg-blue-600'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${(entry.duration / Math.max(1, masterTime)) * 100}%`,
                        minWidth: '6px',
                      }}
                      title={`${entry.action} (${entry.duration}s)`}
                    >
                      {entry.duration >= 10 ? entry.duration : ''}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {log.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm italic text-gray-500">
                      No actions recorded yet.
                    </div>
                  ) : (
                    [...log].reverse().map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              entry.type === 'toast'
                                ? 'bg-orange-500'
                                : entry.type === 'move'
                                ? 'bg-blue-600'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="text-gray-700">{entry.action}</span>
                        </div>
                        <span className="font-mono text-gray-500">{entry.duration}s</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <SectionCard>
              <SectionHeader
                icon={<Settings size={16} className="text-blue-500" />}
                title="Rules"
              />
              <div className="grid grid-cols-1 gap-4 px-6 py-6">
                <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4 text-center">
                  <div className="text-lg font-semibold text-blue-600">30s</div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">
                    Toast one side
                  </div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4 text-center">
                  <div className="text-lg font-semibold text-blue-600">5s</div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">
                    Move in / out
                  </div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4 text-center">
                  <div className="text-lg font-semibold text-blue-600">3s</div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">
                    Turn over
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<CheckCircle2 size={16} className="text-blue-500" />}
                title="Slice Status"
              />
              <div className="space-y-4 px-6 py-6">
                {slices.map((slice) => (
                  <div
                    key={slice.id}
                    className="space-y-3 rounded-2xl border border-black/5 bg-gray-50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Slice {slice.id}</span>
                      <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
                        {slice.location}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="mb-1 flex justify-between text-[11px] uppercase tracking-wide text-gray-500">
                          <span>Side A</span>
                          <span>{slice.sideA}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${Math.min(100, slice.sideA)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-[11px] uppercase tracking-wide text-gray-500">
                          <span>Side B</span>
                          <span>{slice.sideB}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${Math.min(100, slice.sideB)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
                title="Inquiry Prompt"
              />
              <div className="px-6 py-6 text-sm leading-7 text-gray-600">
                Can you finish the puzzle with every side perfectly toasted and no
                burning? Then try to justify why your sequence is optimal.
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={34} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Perfectly Toasted</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                You completed the challenge in <span className="font-semibold">{masterTime} seconds</span>.
                Can you explain why your strategy is efficient?
              </p>
              <button
                onClick={reset}
                className="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}

        {showFailure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle size={34} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Burned</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                One side was toasted too long. In this challenge, each side needs exactly
                30 seconds.
              </p>
              <button
                onClick={reset}
                className="mt-6 w-full rounded-2xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700"
              >
                Reset and Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BreadSlice({
  slice,
  onAction,
  onTurn,
  isToasting,
}: {
  slice: Slice;
  onAction: () => void;
  onTurn?: () => void;
  isToasting: boolean;
}) {
  const currentToast = slice.facing === 'A' ? slice.sideA : slice.sideB;
  const isToasted = currentToast >= 100;
  const isBurned = currentToast > 100;
  const inSlot = slice.location !== 'counter';

  return (
    <div className="group relative h-full w-full">
      <div
        onClick={!inSlot ? onAction : undefined}
        className={`relative h-full w-full overflow-hidden rounded-2xl border-4 transition-all duration-500 ${
          isBurned
            ? 'border-zinc-900 bg-zinc-800 shadow-inner'
            : isToasted
            ? 'border-amber-300 bg-amber-100 shadow-inner'
            : 'border-gray-200 bg-white'
        } ${!inSlot ? 'cursor-pointer hover:border-blue-300' : ''}`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isBurned ? 'bg-black/40' : 'bg-amber-900/20'
          }`}
          style={{ opacity: Math.min(100, currentToast) / 100 }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-black ${
              isBurned ? 'text-zinc-400' : isToasted ? 'text-amber-800' : 'text-gray-300'
            }`}
          >
            {slice.id}
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400">
            {isBurned ? 'Burned' : `Side ${slice.facing}`}
          </span>
        </div>

        {onTurn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTurn();
            }}
            disabled={isToasting}
            className="absolute bottom-2 right-2 rounded-lg bg-white/90 p-2 shadow-sm transition hover:bg-gray-900 hover:text-white disabled:opacity-50"
            title="Turn Over"
          >
            <RotateCw size={12} />
          </button>
        )}

        {inSlot && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            disabled={isToasting}
            className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[8px] font-bold uppercase text-white shadow transition hover:bg-red-600 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      {!inSlot && !isToasting && (
        <div className="pointer-events-none absolute -right-2 -top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-blue-600 p-1 text-white shadow-lg">
            <Plus size={10} />
          </div>
        </div>
      )}
    </div>
  );
}
