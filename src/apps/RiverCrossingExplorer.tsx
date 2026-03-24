import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Info,
  History,
  BookOpen,
  MousePointer2,
  RotateCcw,
  Lightbulb,
  Eye,
  Lock,
  Unlock,
  Trophy,
  Brain,
  Waves,
  ArrowRightLeft,
  User,
  Baby,
  Ship,
  ShieldAlert,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface AssumptionEntry {
  attempt: string;
  block: string;
}

interface Person {
  id: string;
  type: 'man' | 'boy';
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
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">{title}</h2>
    </div>
  );
}

const initialNearSide: Person[] = [
  { id: 'm1', type: 'man' },
  { id: 'm2', type: 'man' },
  { id: 'm3', type: 'man' },
];

const initialRaftPeople: Person[] = [
  { id: 'b1', type: 'boy' },
  { id: 'b2', type: 'boy' },
];

function RiverCrossing({
  onFail,
  onSolvedChange,
  onTripsChange,
}: {
  onFail: (block: string) => void;
  onSolvedChange: (solved: boolean) => void;
  onTripsChange: (trips: number) => void;
}) {
  const [nearSide, setNearSide] = useState<Person[]>(initialNearSide);
  const [farSide, setFarSide] = useState<Person[]>([]);
  const [raftPeople, setRaftPeople] = useState<Person[]>(initialRaftPeople);
  const [raftPosition, setRaftPosition] = useState<'near' | 'far'>('near');
  const [trips, setTrips] = useState(0);
  const [solved, setSolved] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const nearBankRef = useRef<HTMLDivElement>(null);
  const farBankRef = useRef<HTMLDivElement>(null);
  const raftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onTripsChange(trips);
  }, [trips, onTripsChange]);

  useEffect(() => {
    onSolvedChange(solved);
  }, [solved, onSolvedChange]);

  useEffect(() => {
    if (farSide.length === 5 && raftPeople.length === 0) {
      setSolved(true);
    }
  }, [farSide, raftPeople]);

  const reset = () => {
    setNearSide(initialNearSide);
    setFarSide([]);
    setRaftPeople(initialRaftPeople);
    setRaftPosition('near');
    setTrips(0);
    setSolved(false);
    setIsMoving(false);
  };

  const moveRaft = () => {
    if (raftPeople.length === 0 || isMoving || solved) return;

    const menCount = raftPeople.filter((p) => p.type === 'man').length;
    const boysCount = raftPeople.filter((p) => p.type === 'boy').length;

    if (menCount > 1 || (menCount === 1 && boysCount > 0) || boysCount > 2) {
      onFail('Overloaded the raft (Max: 1 Man OR 2 Boys)');
      return;
    }

    setIsMoving(true);
    const newPos = raftPosition === 'near' ? 'far' : 'near';

    setTimeout(() => {
      setRaftPosition(newPos);
      setTrips((prev) => prev + 1);
      setIsMoving(false);
    }, 800);
  };

  const handleDragEnd = (
    person: Person,
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } },
    from: 'near' | 'far' | 'raft',
  ) => {
    const { x, y } = info.point;

    const checkBounds = (ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const inNear = checkBounds(nearBankRef);
    const inFar = checkBounds(farBankRef);
    const inRaft = checkBounds(raftRef);

    if (from === 'near') {
      if (inRaft) {
        if (raftPosition !== 'near') {
          onFail('The raft is on the other side!');
        } else if (raftPeople.length >= 2) {
          onFail('Raft is full!');
        } else {
          setNearSide((prev) => prev.filter((p) => p.id !== person.id));
          setRaftPeople((prev) => [...prev, person]);
        }
      } else if (inFar) {
        onFail("You can't jump across the river. Use the raft.");
      }
    } else if (from === 'far') {
      if (inRaft) {
        if (raftPosition !== 'far') {
          onFail('The raft is on the other side!');
        } else if (raftPeople.length >= 2) {
          onFail('Raft is full!');
        } else {
          setFarSide((prev) => prev.filter((p) => p.id !== person.id));
          setRaftPeople((prev) => [...prev, person]);
        }
      } else if (inNear) {
        onFail("You can't jump across the river. Use the raft.");
      }
    } else if (from === 'raft') {
      if (inNear) {
        if (raftPosition !== 'near') {
          onFail("The raft isn't at the near bank!");
        } else {
          setRaftPeople((prev) => prev.filter((p) => p.id !== person.id));
          setNearSide((prev) => [...prev, person]);
        }
      } else if (inFar) {
        if (raftPosition !== 'far') {
          onFail("The raft isn't at the far bank!");
        } else {
          setRaftPeople((prev) => prev.filter((p) => p.id !== person.id));
          setFarSide((prev) => [...prev, person]);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">The River Crossing</h3>
          <p className="text-sm leading-7 text-gray-600">
            Drag people onto the raft. The raft can carry <span className="font-medium">1 man</span>{' '}
            or <span className="font-medium">2 boys</span>.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-3 text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Trips
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{trips}</div>
        </div>
      </div>

      <div className="relative h-[500px] overflow-hidden rounded-[2rem] border border-black/5 bg-slate-100">
        <div
          ref={farBankRef}
          className="relative z-10 flex h-32 items-center justify-center gap-4 border-b border-emerald-100 bg-emerald-50 p-4"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {farSide.map((p) => (
              <motion.div
                key={p.id}
                layoutId={p.id}
                drag
                dragSnapToOrigin
                whileDrag={{ zIndex: 100 }}
                onDragEnd={(e, info) => handleDragEnd(p, e, info, 'far')}
                className="relative z-30 cursor-grab rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
              >
                {p.type === 'man' ? (
                  <User className="text-slate-700" size={28} />
                ) : (
                  <Baby className="text-slate-400" size={24} />
                )}
              </motion.div>
            ))}
          </div>
          {farSide.length === 0 && (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">
              Far Bank
            </span>
          )}
        </div>

        <div className="relative flex flex-1 items-center justify-center bg-sky-400/20">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-around opacity-20">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 20, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
                className="flex gap-8"
              >
                {Array.from({ length: 10 }).map((_, j) => (
                  <Waves key={j} size={48} className="text-sky-600" />
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        <div
          ref={nearBankRef}
          className="relative z-10 flex h-32 items-center justify-center gap-4 border-t border-emerald-100 bg-emerald-50 p-4"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {nearSide.map((p) => (
              <motion.div
                key={p.id}
                layoutId={p.id}
                drag
                dragSnapToOrigin
                whileDrag={{ zIndex: 100 }}
                onDragEnd={(e, info) => handleDragEnd(p, e, info, 'near')}
                className="relative z-30 cursor-grab rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
              >
                {p.type === 'man' ? (
                  <User className="text-slate-700" size={28} />
                ) : (
                  <Baby className="text-slate-400" size={24} />
                )}
              </motion.div>
            ))}
          </div>
          {nearSide.length === 0 && (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">
              Near Bank
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="relative flex h-full w-full items-center justify-center">
            <motion.div
              layout
              animate={{
                y: raftPosition === 'near' ? 58 : -58,
                rotate: isMoving ? [0, -1, 1, 0] : 0,
              }}
              transition={{
                y: { duration: 0.8, ease: 'easeInOut' },
                rotate: isMoving
                  ? { duration: 0.2, repeat: Infinity }
                  : { duration: 0.2 },
              }}
              className="pointer-events-auto relative"
            >
              <div
                ref={raftRef}
                className="relative flex h-24 w-[180px] items-center justify-center gap-3 rounded-3xl border-b-8 border-amber-900 bg-amber-800 shadow-2xl"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-900">
                  <Ship size={40} />
                </div>

                <div className="flex gap-2">
                  {raftPeople.map((p) => (
                    <motion.div
                      key={p.id}
                      layoutId={p.id}
                      drag
                      dragSnapToOrigin
                      whileDrag={{ zIndex: 100 }}
                      onDragEnd={(e, info) => handleDragEnd(p, e, info, 'raft')}
                      className="relative z-30 cursor-grab rounded-xl bg-white/90 p-2 shadow-sm active:cursor-grabbing"
                    >
                      {p.type === 'man' ? (
                        <User size={24} className="text-slate-900" />
                      ) : (
                        <Baby size={20} className="text-slate-600" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {raftPeople.length === 0 && (
                  <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-amber-200/60">
                    Empty Raft
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={moveRaft}
          disabled={raftPeople.length === 0 || isMoving || solved}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRightLeft size={18} />
          {isMoving ? 'Crossing...' : 'Cross River'}
        </button>

        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
        >
          <RotateCcw size={14} />
          Reset Puzzle
        </button>
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-3 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 text-center"
        >
          <Trophy className="mx-auto text-emerald-500" size={56} />
          <div>
            <h4 className="text-2xl font-bold text-gray-900">Incredible!</h4>
            <p className="mt-2 text-sm leading-7 text-emerald-700">
              You solved the puzzle in {trips} trips by questioning the obvious strategy.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function RaftExplorer() {
  const [logs, setLogs] = useState<AssumptionEntry[]>([]);
  const [showReveal, setShowReveal] = useState(false);
  const [solved, setSolved] = useState(false);
  const [trips, setTrips] = useState(0);

  const assumption =
    "You assumed the raft should always carry as much as possible, or that the boys could not operate as the shuttle. The key is that the boys make the transfer system work.";

  const addLog = (block: string) => {
    const newEntry = {
      attempt: new Date().toLocaleTimeString(),
      block,
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  const uniqueBlocks = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.block))).length;
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Raft Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Solve the river crossing puzzle by paying attention to the hidden assumptions that make
            a problem feel harder than it really is.
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              Three men and two boys must cross a river. The raft can carry either one man or two
              boys. What efficient pattern gets everyone across?
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <SectionCard>
              <SectionHeader
                icon={<MousePointer2 size={16} className="text-blue-500" />}
                title="Interactive Puzzle"
              />
              <div className="px-6 py-6">
                <RiverCrossing
                  onFail={addLog}
                  onSolvedChange={setSolved}
                  onTripsChange={setTrips}
                />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <SectionCard>
              <SectionHeader
                icon={<Eye size={16} className="text-amber-500" />}
                title="Hidden Assumption"
              />
              <div className="space-y-6 px-6 py-6">
                <p className="text-sm leading-7 text-gray-600">
                  Many solvers get stuck because they import an unspoken rule into the puzzle.
                </p>

                <AnimatePresence mode="wait">
                  {showReveal ? (
                    <motion.div
                      key="reveal"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-5 text-white"
                    >
                      <div className="mb-3 flex items-center gap-2 text-amber-400">
                        <Unlock size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                          Assumption Broken
                        </span>
                      </div>

                      <p className="text-sm leading-7 italic text-slate-100">“{assumption}”</p>

                      <button
                        onClick={() => setShowReveal(false)}
                        className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 transition hover:text-white"
                      >
                        Hide
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setShowReveal(true)}
                      className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 px-5 py-8 text-gray-400 transition hover:border-gray-300 hover:text-gray-500"
                    >
                      <Lock size={22} />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                        Reveal Hidden Assumption
                      </span>
                    </button>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Mental Blocks"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Block Events
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">{logs.length}</div>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-amber-600">
                      Unique Blocks
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-amber-700">
                      {uniqueBlocks}
                    </div>
                  </div>
                </div>

                <div className="max-h-[320px] overflow-hidden rounded-2xl border border-black/5">
                  <div className="custom-scrollbar max-h-[320px] overflow-y-auto px-4 py-4">
                    <AnimatePresence initial={false}>
                      {logs.map((log, i) => (
                        <motion.div
                          key={`${log.attempt}-${i}`}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 last:mb-0"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400">
                              Attempt
                            </span>
                            <span className="text-[8px] text-gray-300">{log.attempt}</span>
                          </div>
                          <p className="text-xs font-medium leading-6 text-gray-600">{log.block}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {logs.length === 0 && (
                      <div className="py-10 text-center text-sm italic text-gray-400">
                        No blocks recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6"
          >
            <SectionCard>
              <SectionHeader
                icon={<BookOpen size={16} className="text-amber-500" />}
                title="Mathematical Reflection"
              />

              <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">The hidden constraint</h3>

                  <p className="text-sm leading-7 text-gray-600">
                    This puzzle is less about arithmetic and more about noticing an assumption you
                    quietly brought into the problem. Many people assume the raft should always be
                    used at full strength, but that assumption makes the puzzle harder.
                  </p>

                  <p className="text-sm leading-7 text-gray-600">
                    Once you treat the boys as the shuttle mechanism, the problem becomes a system
                    rather than a sequence of isolated trips.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
                    <div className="text-lg font-semibold text-amber-700">Big idea</div>

                    <p className="mt-4 text-sm leading-7 text-gray-700">
                      Strong problem solving often depends on asking:
                    </p>

                    <p className="mt-3 text-base font-semibold text-gray-900">
                      “What assumption am I making that the puzzle never actually stated?”
                    </p>

                    <div className="mt-4 border-t border-amber-200 pt-4 text-sm leading-7 text-gray-700">
                      {solved ? (
                        <>
                          You solved the puzzle in <span className="font-semibold">{trips}</span>{' '}
                          trips, which shows flexible thinking and a willingness to break the
                          obvious strategy.
                        </>
                      ) : (
                        <>
                          Try to notice whether you are optimizing the wrong thing. Efficiency in
                          this puzzle comes from coordination, not maximum load.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}