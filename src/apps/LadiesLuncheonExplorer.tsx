import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Grid3X3,
  CheckCircle2,
  XCircle,
  Info,
  RotateCcw,
  Lightbulb,
  Search,
  ChevronRight,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FIRST_NAMES = ['Alice', 'Beatrice', 'Charity', 'Dorothy', 'Edith'];
const SURNAMES = ['Mrs. Archer', 'Mrs. Barber', 'Mrs. Carter', 'Mrs. Davis', 'Mrs. Edwards'];

const CLUES = [
  'Alice is sitting between Mrs. Davis and Edith.',
  'Beatrice is sitting between Mrs. Archer and Mrs. Carter.',
  'Mrs. Edwards is sitting between Mrs. Carter and Dorothy.',
  'Edith and Mrs. Edwards are sisters.',
  'Mrs. Davis is sitting opposite Mrs. Edwards.',
  'Alice and Mrs. Archer are sisters.',
  'Mrs. Barber is sitting between Alice and Edith.',
];

const SOLUTION = {
  Alice: 'Mrs. Carter',
  Beatrice: 'Mrs. Edwards',
  Charity: 'Mrs. Davis',
  Dorothy: 'Mrs. Archer',
  Edith: 'Mrs. Barber',
};

type CellState = 0 | 1 | 2; // 0 = TBD, 1 = No Match, 2 = Match

function SectionCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm ${className}`}>
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

function SortableItem({ id, surname }: { id: string; surname: string | null }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-colors ${
        isDragging
          ? 'border-transparent opacity-50 ring-2 ring-blue-500'
          : 'border-black/5 hover:border-gray-300'
      } cursor-grab active:cursor-grabbing`}
    >
      <GripVertical size={14} className="text-gray-300" />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-800">{id}</span>
        {surname && <span className="text-[10px] font-medium text-blue-600">{surname}</span>}
      </div>
    </div>
  );
}

export default function LadiesLunchExplorer() {
  const [grid, setGrid] = useState<CellState[][]>(Array(5).fill(0).map(() => Array(5).fill(0)));
  const [checkedClues, setCheckedClues] = useState<boolean[]>(Array(CLUES.length).fill(false));
  const [seatingOrder, setSeatingOrder] = useState<string[]>([...FIRST_NAMES]);
  const [showGeneralization, setShowGeneralization] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleCell = (fIdx: number, sIdx: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((row) => [...row]);
      const currentState = newGrid[fIdx][sIdx];
      let nextState: CellState = 0;

      if (currentState === 0) nextState = 1;
      else if (currentState === 1) nextState = 2;
      else nextState = 0;

      if (nextState === 2) {
        for (let i = 0; i < 5; i++) {
          if (i !== sIdx) newGrid[fIdx][i] = 1;
          if (i !== fIdx) newGrid[i][sIdx] = 1;
        }
      }

      newGrid[fIdx][sIdx] = nextState;
      return newGrid;
    });

    setValidationResult(null);
  };

  const toggleClue = (idx: number) => {
    setCheckedClues((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const reset = () => {
    setGrid(Array(5).fill(0).map(() => Array(5).fill(0)));
    setCheckedClues(Array(CLUES.length).fill(false));
    setSeatingOrder([...FIRST_NAMES]);
    setValidationResult(null);
    setShowGeneralization(false);
  };

  const verifySolution = () => {
    let isCorrect = true;
    let isComplete = true;

    for (let fIdx = 0; fIdx < 5; fIdx++) {
      const confirmedSurnameIdx = grid[fIdx].indexOf(2);
      if (confirmedSurnameIdx === -1) {
        isComplete = false;
        continue;
      }

      const firstName = FIRST_NAMES[fIdx];
      const surname = SURNAMES[confirmedSurnameIdx];

      if (SOLUTION[firstName as keyof typeof SOLUTION] !== surname) {
        isCorrect = false;
      }
    }

    if (!isComplete) setValidationResult('error');
    else if (isCorrect) setValidationResult('success');
    else setValidationResult('error');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSeatingOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getConfirmedSurname = (fIdx: number) => {
    const sIdx = grid[fIdx].indexOf(2);
    return sIdx !== -1 ? SURNAMES[sIdx] : null;
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
                Ladies Lunch Explorer
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-600">
                Match each first name to the correct surname using the clues, a logic grid,
                and the seating arrangement around the table.
              </p>
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              title="Reset"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </header>

        <SectionCard>
          <SectionHeader icon={<Info size={16} className="text-blue-500" />} title="The Problem" />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              Five ladies are sitting in a circle for lunch. Match their first names with
              their surnames using the clues provided. Use the grid to manage the search
              and eliminate impossibilities.
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr_320px]">
          <div className="space-y-6">
            <SectionCard className="h-full">
              <SectionHeader
                icon={<Grid3X3 size={16} className="text-blue-500" />}
                title="Deductive Grid"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2" />
                        {SURNAMES.map((name, i) => (
                          <th
                            key={i}
                            className="h-24 p-2 align-bottom text-left text-[10px] font-mono uppercase tracking-tight text-gray-400"
                          >
                            <div className="origin-bottom-left -translate-x-1 translate-y-1 -rotate-45 transform whitespace-nowrap">
                              {name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FIRST_NAMES.map((fName, fIdx) => (
                        <tr key={fIdx} className="border-t border-black/5">
                          <td className="whitespace-nowrap p-3 pr-4 text-sm font-medium text-gray-700">
                            {fName}
                          </td>
                          {SURNAMES.map((_, sIdx) => (
                            <td key={sIdx} className="border-l border-black/5 p-1">
                              <button
                                onClick={() => toggleCell(fIdx, sIdx)}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                                  grid[fIdx][sIdx] === 0
                                    ? 'bg-white hover:bg-gray-50'
                                    : grid[fIdx][sIdx] === 1
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'border border-blue-100 bg-blue-50 text-blue-600'
                                }`}
                                title={
                                  grid[fIdx][sIdx] === 0
                                    ? 'TBD'
                                    : grid[fIdx][sIdx] === 1
                                    ? 'No Match'
                                    : 'Match'
                                }
                              >
                                {grid[fIdx][sIdx] === 1 && <XCircle size={18} />}
                                {grid[fIdx][sIdx] === 2 && <CheckCircle2 size={18} />}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-gray-500">
                    Click cell: <span className="font-medium">TBD</span> →{' '}
                    <span className="font-medium">No Match</span> →{' '}
                    <span className="font-medium">Match</span>
                  </p>

                  <button
                    onClick={verifySolution}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <Search size={14} />
                    Verify Logic
                  </button>
                </div>

                <AnimatePresence>
                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-3 rounded-xl border p-4 ${
                        validationResult === 'success'
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                          : 'border-amber-100 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {validationResult === 'success' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}
                      <p className="text-sm font-medium">
                        {validationResult === 'success'
                          ? 'Your deductions are consistent with the solution.'
                          : 'Some deductions are incomplete or inconsistent with the clues.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard className="h-full">
              <SectionHeader
                icon={<Users size={16} className="text-blue-500" />}
                title="Table Map"
              />
              <div className="flex h-full flex-col items-center justify-center space-y-8 px-6 py-6">
                <div className="relative h-72 w-72">
                  <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-gray-100 bg-gray-50/70 shadow-inner">
                    <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-gray-300">
                      Luncheon Table
                    </div>
                  </div>

                  {seatingOrder.map((name, i) => {
                    const angle = (i * 360) / 5 - 90;
                    const radius = 118;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    const fIdx = FIRST_NAMES.indexOf(name);
                    const confirmedSurname = getConfirmedSurname(fIdx);

                    return (
                      <motion.div
                        key={name}
                        initial={false}
                        animate={{ x, y }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-500 shadow-sm">
                          <Users size={18} />
                        </div>

                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-900">{name}</p>
                          <AnimatePresence>
                            {confirmedSurname && (
                              <motion.p
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-0.5 rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600"
                              >
                                {confirmedSurname}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="w-full max-w-xs space-y-2">
                  <p className="text-center text-[11px] uppercase tracking-[0.12em] text-gray-500">
                    Drag to Rearrange Seating
                  </p>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={seatingOrder} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {seatingOrder.map((name) => (
                          <SortableItem
                            key={name}
                            id={name}
                            surname={getConfirmedSurname(FIRST_NAMES.indexOf(name))}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                <p className="text-center text-[11px] italic text-gray-500">
                  Rearrange the names to match the seating clues.
                </p>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard className="h-full">
              <SectionHeader
                icon={<Search size={16} className="text-blue-500" />}
                title="Clue Checklist"
              />
              <div className="space-y-3 px-6 py-6">
                {CLUES.map((clue, i) => (
                  <button
                    key={i}
                    onClick={() => toggleClue(i)}
                    className={`w-full rounded-xl border p-3 text-left text-sm leading-relaxed transition-all ${
                      checkedClues[i]
                        ? 'border-gray-100 bg-gray-50 text-gray-400 italic line-through'
                        : 'border-black/5 bg-white text-gray-700 shadow-sm hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2 text-[10px] font-mono opacity-40">{i + 1}.</span>
                    {clue}
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard className="overflow-hidden">
          <button
            onClick={() => setShowGeneralization(!showGeneralization)}
            className="flex w-full items-center justify-between bg-gray-900 px-6 py-5 text-left transition-colors hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <Lightbulb size={18} className="text-amber-400" />
              <span className="text-sm font-medium text-white">Logic Insight: Generalizing the Search</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-gray-300 transition-transform ${showGeneralization ? 'rotate-90' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showGeneralization && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 border-t border-gray-800 bg-gray-900 px-6 py-6 text-sm leading-7 text-gray-300">
                  <p>
                    The <span className="font-medium text-white">Deductive Grid</span> helps manage
                    complexity when several variables interact.
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <strong className="text-white">Externalize memory:</strong> you do not need to
                      hold every clue in your head at once.
                    </li>
                    <li>
                      <strong className="text-white">Systematic elimination:</strong> every “No Match”
                      reduces the search space.
                    </li>
                    <li>
                      <strong className="text-white">Forced deduction:</strong> if four cells in a row
                      are eliminated, the fifth must be the match.
                    </li>
                  </ul>
                  <p className="text-xs italic text-gray-400">
                    This structure generalizes to many logic puzzles with multiple linked categories.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>
      </div>
    </div>
  );
}