import React, { useMemo, useState } from 'react';
import {
  Info,
  RotateCcw,
  Play,
  SkipForward,
  History,
  Lightbulb,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Frog = 'L' | 'R' | '_';

type MoveRecord = {
  from: number;
  to: number;
  frog: 'L' | 'R';
  type: 'slide' | 'jump';
  state: Frog[];
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

function buildInitialState(n: number): Frog[] {
  return [...Array(n).fill('R'), '_', ...Array(n).fill('L')];
}

function buildGoalState(n: number): Frog[] {
  return [...Array(n).fill('L'), '_', ...Array(n).fill('R')];
}

function statesEqual(a: Frog[], b: Frog[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function getValidMoves(state: Frog[]): MoveRecord[] {
  const moves: MoveRecord[] = [];

  for (let i = 0; i < state.length; i++) {
    const frog = state[i];
    if (frog === '_') continue;

    if (frog === 'R') {
      if (i + 1 < state.length && state[i + 1] === '_') {
        const next = [...state];
        next[i] = '_';
        next[i + 1] = 'R';
        moves.push({ from: i, to: i + 1, frog: 'R', type: 'slide', state: next });
      }
      if (i + 2 < state.length && state[i + 1] === 'L' && state[i + 2] === '_') {
        const next = [...state];
        next[i] = '_';
        next[i + 2] = 'R';
        moves.push({ from: i, to: i + 2, frog: 'R', type: 'jump', state: next });
      }
    }

    if (frog === 'L') {
      if (i - 1 >= 0 && state[i - 1] === '_') {
        const next = [...state];
        next[i] = '_';
        next[i - 1] = 'L';
        moves.push({ from: i, to: i - 1, frog: 'L', type: 'slide', state: next });
      }
      if (i - 2 >= 0 && state[i - 1] === 'R' && state[i - 2] === '_') {
        const next = [...state];
        next[i] = '_';
        next[i - 2] = 'L';
        moves.push({ from: i, to: i - 2, frog: 'L', type: 'jump', state: next });
      }
    }
  }

  return moves;
}

function findShortestSolution(n: number): Frog[][] {
  const start = buildInitialState(n);
  const goal = buildGoalState(n);

  const queue: { state: Frog[]; path: Frog[][] }[] = [{ state: start, path: [start] }];
  const visited = new Set<string>([start.join('')]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (statesEqual(current.state, goal)) return current.path;

    for (const move of getValidMoves(current.state)) {
      const key = move.state.join('');
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: move.state, path: [...current.path, move.state] });
      }
    }
  }

  return [start];
}

export default function LeapfrogsExplorer() {
  const [frogCount, setFrogCount] = useState(3);
  const [board, setBoard] = useState<Frog[]>(buildInitialState(3));
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [showGeneralization, setShowGeneralization] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);

  const goal = useMemo(() => buildGoalState(frogCount), [frogCount]);
  const solved = statesEqual(board, goal);
  const validMoves = getValidMoves(board);
  const shortestMoves = frogCount * (frogCount + 2);

  const reset = (n = frogCount) => {
    setBoard(buildInitialState(n));
    setHistory([]);
    setAutoPlaying(false);
  };

  const changeFrogCount = (n: number) => {
    setFrogCount(n);
    setBoard(buildInitialState(n));
    setHistory([]);
    setAutoPlaying(false);
  };

  const applyMove = (move: MoveRecord) => {
    if (autoPlaying) return;
    setBoard(move.state);
    setHistory((prev) => [...prev, move]);
  };

  const autoSolve = async () => {
    if (autoPlaying) return;
    setAutoPlaying(true);

    const solution = findShortestSolution(frogCount);
    reset(frogCount);

    await new Promise((r) => setTimeout(r, 150));

    for (let i = 1; i < solution.length; i++) {
      const prev = solution[i - 1];
      const next = solution[i];
      const moves = getValidMoves(prev);
      const chosen = moves.find((m) => statesEqual(m.state, next));
      if (chosen) {
        setBoard(chosen.state);
        setHistory((h) => [...h, chosen]);
      }
      await new Promise((r) => setTimeout(r, 450));
    }

    setAutoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Leapfrogs Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Investigate the classic leapfrogs puzzle. How can two groups switch sides
            using only slides and jumps, and how many moves are needed in general?
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              A group of frogs on the left and a group of frogs on the right want to
              swap sides. A frog may slide into the empty space next to it or jump over
              exactly one frog into the empty space. What pattern governs the minimum
              number of moves?
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Visual Representation
                </h2>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
                <div className="mx-auto max-w-4xl space-y-8">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {board.map((cell, index) => {
                      const moveHere = validMoves.find((m) => m.from === index);
                      return (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => moveHere && applyMove(moveHere)}
                            disabled={!moveHere || autoPlaying}
                            className={`flex h-14 w-14 items-center justify-center rounded-xl border text-3xl font-bold shadow-sm transition
                            ${
                              cell === 'R'
                                ? 'border-black bg-white text-black'
                                : cell === 'L'
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 bg-gray-100 text-gray-300'
                            }
                            ${
                              moveHere && !autoPlaying
                                ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md'
                                : 'cursor-default'
                            }`}
                          >
                            {cell === 'R' ? '→' : cell === 'L' ? '←' : ''}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => reset()}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>

                    <button
                      onClick={autoSolve}
                      disabled={autoPlaying}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        autoPlaying
                          ? 'cursor-not-allowed border border-black/5 bg-gray-100 text-gray-400'
                          : 'border border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Play size={16} fill="currentColor" />
                      {autoPlaying ? 'Solving...' : 'Auto Solve'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {solved && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto max-w-md rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2.5 text-center text-sm font-medium text-emerald-700"
                      >
                        Solved in {history.length} moves
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Move Log"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Frogs Per Side
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {frogCount}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Current Moves
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-blue-600">
                      {history.length}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Minimum
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {shortestMoves}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Status
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {solved ? 'Solved' : 'In Progress'}
                    </div>
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm italic text-gray-500">
                    No moves yet. Click a movable frog or run the auto solver.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...history].reverse().map((move, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              move.frog === 'R' ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}
                          />
                          <span className="text-gray-700">
                            {move.type === 'slide' ? 'Slide' : 'Jump'} frog from {move.from} to{' '}
                            {move.to}
                          </span>
                        </div>
                        <span className="font-mono text-gray-500">
                          {move.state.map((x) => (x === '_' ? '·' : x)).join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
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
                      key="generalization"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Minimum move pattern
                        </h3>
                        <p className="text-sm leading-7 text-gray-600">
                          For <span className="font-semibold text-gray-900">n</span> frogs on each
                          side, the minimum number of moves is:
                        </p>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
                          <div className="text-2xl font-semibold text-amber-700">
                            n(n + 2)
                          </div>
                        </div>

                        <p className="text-sm leading-7 text-gray-600">
                          This can also be seen as <span className="font-semibold text-gray-900">n² + 2n</span>.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Why this happens
                        </h3>
                        <p className="text-sm leading-7 text-gray-600">
                          Every frog must cross the middle, and many moves involve one
                          frog jumping another. The puzzle naturally alternates slides
                          and jumps in a tightly constrained way.
                        </p>
                        <p className="text-sm leading-7 text-gray-600">
                          Testing small cases helps reveal the pattern:
                        </p>

                        <div className="rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 font-mono text-sm text-gray-800">
                          n = 1 → 3 moves
                          <br />
                          n = 2 → 8 moves
                          <br />
                          n = 3 → 15 moves
                          <br />
                          n = 4 → 24 moves
                        </div>
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
                      Try n = 1, 2, 3, and 4. Record the minimum number of moves each
                      time. What pattern do you notice?
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <SectionCard>
              <SectionHeader
                icon={<Settings size={16} className="text-blue-500" />}
                title="Configuration"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium text-gray-700">Frogs Per Side</label>
                    <span className="font-mono text-blue-600">{frogCount}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={frogCount}
                    onChange={(e) => changeFrogCount(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<SkipForward size={16} className="text-blue-500" />}
                title="Available Moves"
              />
              <div className="px-6 py-6">
                {validMoves.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm italic text-gray-500">
                    No legal moves available.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {validMoves.map((move, i) => (
                      <button
                        key={i}
                        onClick={() => applyMove(move)}
                        disabled={autoPlaying}
                        className="flex w-full items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-3 text-left text-sm transition hover:bg-gray-100 disabled:opacity-50"
                      >
                        <span className="text-gray-700">
                          {move.type === 'slide' ? 'Slide' : 'Jump'} {move.frog} from {move.from} to{' '}
                          {move.to}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${
                            move.frog === 'R'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {move.frog}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<CheckCircle2 size={16} className="text-amber-500" />}
                title="Mathematical Idea"
              />
              <div className="px-6 py-6 text-sm leading-7 text-gray-600">
                Leapfrogs is a good example of how trying small cases, organizing data,
                and looking for structure can lead to a general formula.
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
