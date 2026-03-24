import React, { useEffect, useMemo, useState } from 'react';
import {
  Info,
  Calculator,
  History,
  BookOpen,
  RotateCcw,
  Lightbulb,
  Brain,
  Send,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Trophy,
  HelpCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface SequenceAttempt {
  sequence: [number, number, number];
  isCorrect: boolean;
  hypothesisAtTime: string;
}

interface Rule {
  id: string;
  description: string;
  check: (a: number, b: number, c: number) => boolean;
  hint: string;
}

const RULES: Rule[] = [
  {
    id: 'ascending',
    description: 'The numbers are in strictly ascending order.',
    check: (a, b, c) => a < b && b < c,
    hint: 'Try testing whether the order matters.',
  },
  {
    id: 'all-even',
    description: 'All three numbers are even.',
    check: (a, b, c) => a % 2 === 0 && b % 2 === 0 && c % 2 === 0,
    hint: 'Try testing odd numbers.',
  },
  {
    id: 'sum-third',
    description: 'The sum of the first two numbers equals the third.',
    check: (a, b, c) => a + b === c,
    hint: 'Test whether the third number is specifically tied to the first two.',
  },
  {
    id: 'first-smaller-third',
    description: 'The first number is smaller than the third.',
    check: (a, _b, c) => a < c,
    hint: 'Does the second number really matter?',
  },
  {
    id: 'multiples-10',
    description: 'All three numbers are multiples of 10.',
    check: (a, b, c) => a % 10 === 0 && b % 10 === 0 && c % 10 === 0,
    hint: 'Try numbers that end in 5.',
  },
  {
    id: 'any',
    description: 'Any three numbers.',
    check: () => true,
    hint: "This is a trap. Can you find a sequence that gives a 'NO'?",
  },
  {
    id: 'arithmetic',
    description: 'The numbers form an arithmetic progression.',
    check: (a, b, c) => b - a === c - b,
    hint: 'Look at the gaps between the numbers.',
  },
];

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

export default function EurekaExplorer() {
  const [currentRule, setCurrentRule] = useState<Rule>(RULES[0]);
  const [history, setHistory] = useState<SequenceAttempt[]>([]);
  const [input, setInput] = useState<string[]>(['', '', '']);
  const [hypothesis, setHypothesis] = useState('');
  const [isEurekaModalOpen, setIsEurekaModalOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomRule = RULES[Math.floor(Math.random() * RULES.length)];
    setCurrentRule(randomRule);
    setHistory([]);
    setInput(['', '', '']);
    setHypothesis('');
    setIsEurekaModalOpen(false);
    setIsGameOver(false);
    setUserGuess('');
    setShowReflection(false);
  };

  const handleSubmitSequence = (e: React.FormEvent) => {
    e.preventDefault();
    const nums = input.map((n) => parseInt(n, 10));
    if (nums.some(isNaN)) return;

    const isCorrect = currentRule.check(nums[0], nums[1], nums[2]);

    const newAttempt: SequenceAttempt = {
      sequence: [nums[0], nums[1], nums[2]],
      isCorrect,
      hypothesisAtTime: hypothesis,
    };

    setHistory((prev) => [newAttempt, ...prev]);
    setInput(['', '', '']);
  };

  const skepticismStats = useMemo(() => {
    if (history.length === 0) return 0;
    const noCount = history.filter((h) => !h.isCorrect).length;
    return (noCount / history.length) * 100;
  }, [history]);

  const yesCount = history.filter((h) => h.isCorrect).length;
  const noCount = history.filter((h) => !h.isCorrect).length;

  const insightMessage =
    skepticismStats < 30
      ? "You are mostly testing sequences you think will work. Try to look for a 'NO' case."
      : 'Good. You are testing the boundaries of the rule instead of only hunting for confirmation.';

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <h1
                className="text-4xl tracking-tight text-gray-900"
                style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
              >
                Eureka Explorer
              </h1>

              <p className="max-w-4xl text-sm leading-7 text-gray-600">
                Test number sequences against a hidden rule. The real challenge is not just finding
                examples that work, but learning how to disprove your own idea and test the edges
                of a pattern.
              </p>
            </div>

            <button
              onClick={resetGame}
              className="rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={15} />
                New Rule
              </span>
            </button>
          </div>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              I have a secret rule that determines which three-number sequences work. Your goal is
              to test sequences, refine a hypothesis, and avoid confirmation bias by checking what
              the rule is <span className="font-semibold">not</span>, not just what it is.
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard>
              <SectionHeader
                icon={<Calculator size={16} className="text-blue-500" />}
                title="Test a Sequence"
              />
              <div className="space-y-6 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">Enter three numbers</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Hidden rule investigation
                  </div>
                </div>

                <form onSubmit={handleSubmitSequence} className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {input.map((val, i) => (
                      <input
                        key={i}
                        type="number"
                        value={val}
                        onChange={(e) => {
                          const next = [...input];
                          next[i] = e.target.value;
                          setInput(next);
                        }}
                        placeholder="?"
                        className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-6 text-center text-3xl font-bold text-gray-900 outline-none ring-0 transition focus:border-blue-200 focus:bg-white"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={input.some((v) => v === '')}
                    className="w-full rounded-2xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Send size={16} />
                      Submit Sequence
                    </span>
                  </button>
                </form>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<ShieldAlert size={16} className="text-amber-500" />}
                title="Skepticism Meter"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm leading-7 text-gray-600">
                    Strong mathematical thinking means testing cases you expect to fail, not just
                    cases that support your guess.
                  </p>
                  <HelpCircle
                    size={16}
                    className="shrink-0 text-gray-300"
                    title="High skepticism means you are testing possible counterexamples."
                  />
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skepticismStats}%` }}
                    className="h-full bg-gray-900"
                  />
                </div>

                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  <span>Confirmation Bias</span>
                  <span>Scientific Rigor</span>
                </div>

                <div
                  className={`rounded-2xl px-5 py-4 text-sm leading-7 ${
                    skepticismStats < 30
                      ? 'border border-rose-100 bg-rose-50 text-rose-700'
                      : 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {insightMessage}
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
                title="Current Hypothesis"
              />
              <div className="space-y-6 px-6 py-6">
                <textarea
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="What do you think the rule is right now?"
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-black/5 bg-gray-50 px-5 py-4 text-sm text-gray-800 outline-none ring-0 transition focus:border-blue-200 focus:bg-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEurekaModalOpen(true)}
                    className="flex-1 rounded-full border border-emerald-500 bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Zap size={15} />
                      EUREKA!
                    </span>
                  </button>

                  <button
                    onClick={() => setShowReflection((prev) => !prev)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      showReflection
                        ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {showReflection ? 'Hide Reflection' : 'Reveal Reflection'}
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<History size={16} className="text-blue-500" />}
                title="Investigation Log"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Total</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">{history.length}</div>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-emerald-600">YES</div>
                    <div className="mt-1 text-2xl font-semibold text-emerald-700">{yesCount}</div>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-rose-600">NO</div>
                    <div className="mt-1 text-2xl font-semibold text-rose-700">{noCount}</div>
                  </div>
                </div>

                <div className="max-h-[420px] overflow-hidden rounded-2xl border border-black/5">
                  <div className="max-h-[420px] overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Sequence</th>
                          <th className="px-4 py-3 font-semibold">Result</th>
                          <th className="px-4 py-3 font-semibold">Hypothesis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 bg-white">
                        {history.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center italic text-gray-500">
                              No sequences tested yet.
                            </td>
                          </tr>
                        ) : (
                          history.map((item, i) => (
                            <tr key={`${item.sequence.join('-')}-${i}`}>
                              <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                                {item.sequence.join(', ')}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
                                    item.isCorrect
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-rose-50 text-rose-600'
                                  }`}
                                >
                                  {item.isCorrect ? 'YES' : 'NO'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {item.hypothesisAtTime || '—'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <SectionCard>
                <SectionHeader
                  icon={<BookOpen size={16} className="text-amber-500" />}
                  title="Mathematical Reflection"
                />

                <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      The confirmation trap
                    </h3>

                    <p className="text-sm leading-7 text-gray-600">
                      Many people test only examples that seem likely to work. That can make a weak
                      rule feel convincing, even when it has not really been tested.
                    </p>

                    <p className="text-sm leading-7 text-gray-600">
                      A strong investigator deliberately searches for counterexamples. In this task,
                      a “NO” answer is often more informative than a “YES.”
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
                      <div className="text-lg font-semibold text-amber-700">Big idea</div>

                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        Inductive reasoning is powerful, but it is also risky. Patterns can look
                        true before they are truly understood. The goal is not just to notice a
                        pattern, but to test its limits carefully.
                      </p>

                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        Good mathematical thinking asks:
                        <br />
                        <span className="font-medium text-gray-900">
                          “What would disprove my current idea?”
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEurekaModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEurekaModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative w-full max-w-lg space-y-6 rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl"
              >
                <div className="space-y-2 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Zap size={28} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">EUREKA!</h2>
                  <p className="text-sm text-gray-500">State your final rule clearly.</p>
                </div>

                <textarea
                  autoFocus
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Describe the rule in detail..."
                  className="min-h-[160px] w-full resize-none rounded-2xl border border-black/5 bg-gray-50 px-5 py-4 text-sm text-gray-800 outline-none ring-0 transition focus:border-emerald-200 focus:bg-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEurekaModalOpen(false)}
                    className="flex-1 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsGameOver(true);
                      setIsEurekaModalOpen(false);
                    }}
                    className="flex-1 rounded-full border border-gray-900 bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Reveal the Truth
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isGameOver && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/55 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl space-y-8 rounded-[2.5rem] border border-black/5 bg-white p-10 shadow-2xl"
              >
                <div className="absolute right-8 top-8 opacity-[0.05]">
                  <Trophy size={160} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-500">
                      The Reveal
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                      The Rule Was...
                    </h2>

                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-5">
                      <p className="text-2xl italic text-emerald-900">
                        “{currentRule.description}”
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Your Final Guess
                      </h4>
                      <div className="min-h-[100px] rounded-2xl border border-black/5 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-700">
                        {userGuess || 'No guess provided.'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Learning Review
                      </h4>
                      <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">YES Cases</span>
                            <span className="font-semibold text-emerald-700">{yesCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">NO Cases</span>
                            <span className="font-semibold text-rose-700">{noCount}</span>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-black/5 pt-4 text-sm leading-7 text-gray-600">
                          {skepticismStats < 30
                            ? 'You leaned toward confirmation. Next time, try to design more tests that could prove your hypothesis wrong.'
                            : 'Strong work. You tested the boundaries of the pattern instead of only collecting supportive evidence.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={resetGame}
                    className="w-full rounded-2xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <span className="inline-flex items-center gap-2">
                      <RotateCcw size={16} />
                      Play Again
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}