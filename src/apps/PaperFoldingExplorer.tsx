/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { SectionCard } from '../components/SectionCard';
import { SectionHeader } from '../components/SectionHeader';
import { FormulaCard } from '../components/paper-folding/FormulaCard';
import { HistoryTable } from '../components/paper-folding/HistoryTable';
import { PaperFoldVisualization } from '../components/paper-folding/PaperFoldVisualization';
import { PredictionCard } from '../components/paper-folding/PredictionCard';
import { appStyles } from '../styles/appStyles';

const getSegments = (n: number) => Math.pow(2, n);
const getTotalCreases = (n: number) => Math.pow(2, n) - 1;
const getNewCreases = (n: number) => (n === 0 ? 0 : Math.pow(2, n - 1));

type FeedbackState = {
  type: 'success' | 'error' | null;
  message: string;
};

type HistoryRow = {
  n: number;
  newCreases: number;
  totalCreases: number;
  segments: number;
};

const initialHistory: HistoryRow[] = [{ n: 0, newCreases: 0, totalCreases: 0, segments: 1 }];

export default function PaperFoldingExplorer() {
  const [n, setN] = useState(0);
  const [physicalFoldLevel, setPhysicalFoldLevel] = useState(0);
  const [animationType, setAnimationType] = useState<'folding' | 'unfolding' | null>(null);
  const [prediction, setPrediction] = useState('');
  const [showFormula, setShowFormula] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '' });
  const [history, setHistory] = useState<HistoryRow[]>(initialHistory);

  const nextFold = n + 1;
  const expectedNextCreases = getTotalCreases(nextFold);

  const handleFold = () => {
    if (n >= 10 || animationType) return;

    setAnimationType('folding');

    window.setTimeout(() => {
      const nextLevel = physicalFoldLevel + 1;

      if (nextLevel > n) {
        const nextN = nextLevel;
        const newFoldData: HistoryRow = {
          n: nextN,
          newCreases: getNewCreases(nextN),
          totalCreases: getTotalCreases(nextN),
          segments: getSegments(nextN),
        };

        setHistory((prev) => [...prev, newFoldData]);
        setN(nextN);
        setPrediction('');
        setFeedback({ type: null, message: '' });
      }

      setPhysicalFoldLevel(nextLevel);
      setAnimationType(null);
    }, 800);
  };

  const handleUndo = () => {
    if (physicalFoldLevel === 0 || animationType) return;

    setAnimationType('unfolding');

    window.setTimeout(() => {
      setPhysicalFoldLevel((prev) => prev - 1);
      setAnimationType(null);
    }, 800);
  };

  const checkPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(prediction, 10);
    if (isNaN(val)) return;

    if (val === expectedNextCreases) {
      setFeedback({ type: 'success', message: `Correct! There will be ${val} creases.` });
      return;
    }

    setFeedback({
      type: 'error',
      message: 'Not quite. Try thinking about how many new creases are added between existing segments.',
    });
  };

  const reset = () => {
    setN(0);
    setPhysicalFoldLevel(0);
    setHistory(initialHistory);
    setPrediction('');
    setShowFormula(false);
    setFeedback({ type: null, message: '' });
  };

  return (
    <div className={appStyles.page}>
      <div className={appStyles.container}>
        <AppHeader
          title="Paper Folding"
		subtitle={
		  <span className="mt-2 block">
		    Sourced from <em>Thinking Mathematically</em> (Burton et al.)
		  </span>
		}    
      titleClassName="text-4xl tracking-tight text-gray-900"
          titleStyle={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
        />

        <SectionCard className="overflow-hidden">
          <SectionHeader icon={<Info size={16} className="text-blue-500" />} title="The Problem" />
          <div className={appStyles.cardSection}>
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              "Imagine a long thin strip of paper. Fold it in half. Fold it in half again and then again. How many
              creases are there? How many creases will there be after 10 folds?"
            </blockquote>
          </div>
        </SectionCard>

        <PaperFoldVisualization
          n={n}
          physicalFoldLevel={physicalFoldLevel}
          animationType={animationType}
          showFormula={showFormula}
          onFold={handleFold}
          onUndo={handleUndo}
          onReset={reset}
          onToggleFormula={() => setShowFormula((prev) => !prev)}
          getTotalCreases={getTotalCreases}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <PredictionCard
            n={n}
            prediction={prediction}
            feedback={feedback}
            onPredictionChange={setPrediction}
            onSubmit={checkPrediction}
          />
          <FormulaCard show={showFormula} />
        </div>

        <HistoryTable history={history} />

        <footer className="pb-12 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            "Specializing helps you see patterns; Generalizing helps you understand them."
          </p>
        </footer>
      </div>
    </div>
  );
}
