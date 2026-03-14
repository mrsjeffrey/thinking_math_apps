/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RotateCcw, Info, CheckCircle2, AlertCircle, Undo2, Sparkles } from 'lucide-react';

// Mathematical functions driven by structure
const getSegments = (n: number) => Math.pow(2, n);
const getTotalCreases = (n: number) => Math.pow(2, n) - 1;
const getNewCreases = (n: number) => n === 0 ? 0 : Math.pow(2, n - 1);

export default function PaperFoldingExplorer() {
  const [n, setN] = useState(0); // Max folds performed (mathematical state)
  const [physicalFoldLevel, setPhysicalFoldLevel] = useState(0); // Current physical state (0 to n)
  const [animationType, setAnimationType] = useState<'folding' | 'unfolding' | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [showFormula, setShowFormula] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [history, setHistory] = useState<{ n: number; newCreases: number; totalCreases: number; segments: number }[]>([
    { n: 0, newCreases: 0, totalCreases: 0, segments: 1 }
  ]);

  const nextFold = n + 1;
  const expectedNextCreases = getTotalCreases(nextFold);

  const handleFold = async () => {
    if (n >= 10 || animationType) return;

    setAnimationType('folding');
    
    // Wait for the "folding" animation to complete
    setTimeout(() => {
      const nextLevel = physicalFoldLevel + 1;
      
      // Only update mathematical state if we are performing a NEW fold
      if (nextLevel > n) {
        const nextN = nextLevel;
        const newFoldData = {
          n: nextN,
          newCreases: getNewCreases(nextN),
          totalCreases: getTotalCreases(nextN),
          segments: getSegments(nextN)
        };

        setHistory([...history, newFoldData]);
        setN(nextN);
        setPrediction('');
        setFeedback({ type: null, message: '' });
      }

      setPhysicalFoldLevel(nextLevel);
      setAnimationType(null);
    }, 800); // Duration of the fold animation
  };

  const handleUndo = () => {
    if (physicalFoldLevel === 0 || animationType) return;
    
    setAnimationType('unfolding');

    setTimeout(() => {
      setPhysicalFoldLevel(physicalFoldLevel - 1);
      setAnimationType(null);
    }, 800); // Duration of the unfold animation
  };

  const checkPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(prediction);
    if (isNaN(val)) return;

    if (val === expectedNextCreases) {
      setFeedback({ type: 'success', message: `Correct! There will be ${val} creases.` });
    } else {
      setFeedback({ type: 'error', message: `Not quite. Try thinking about how many new creases are added between existing segments.` });
    }
  };

  const reset = () => {
    setN(0);
    setPhysicalFoldLevel(0);
    setHistory([{ n: 0, newCreases: 0, totalCreases: 0, segments: 1 }]);
    setPrediction('');
    setShowFormula(false);
    setFeedback({ type: null, message: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-black/10 pb-6">
        <h1 className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
          Paper Folding Explorer
        </h1>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Sourced from **Thinking Mathematically** (Burton et al.)
          </p>
        </header>

        {/* Problem Statement */}
        <section className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-black/5 bg-gray-50/50 flex items-center gap-2">
            <Info size={16} className="text-blue-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">The Problem</h2>
          </div>
          <div className="p-6">
            <blockquote className="text-gray-700 italic border-l-4 border-blue-100 pl-4 py-1 leading-relaxed">
              "Imagine a long thin strip of paper. Fold it in half. Fold it in half again and then again. How many creases are there? How many creases will there be after 10 folds?"
            </blockquote>
            <p className="mt-4 text-xs text-gray-500 font-medium">
              — Thinking Mathematically, Chapter 1
            </p>
          </div>
        </section>

        {/* Visual Strip Area */}
        <section className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">Visual Representation</h2>
            <div className="flex gap-4 text-xs font-mono text-gray-400">
              <span>Math Folds (n): {n}</span>
              <span>Physical State: {physicalFoldLevel === 0 ? 'Flat' : `Folded x${physicalFoldLevel}`}</span>
            </div>
          </div>
          
          <div className="relative h-24 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center border border-black/5 perspective-2000">
            {/* The Paper Strip */}
            <AnimatePresence mode="wait">
              {!animationType ? (
                <motion.div 
                  key={`paper-${physicalFoldLevel}-${n}`}
                  style={{ width: `${100 / Math.pow(2, physicalFoldLevel)}%` }}
                  className="h-full bg-white shadow-inner overflow-hidden border-r border-gray-200 relative origin-left"
                  initial={{ opacity: 0, scaleX: 0.95 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Creases rendered relative to the full paper width */}
                  {Array.from({ length: getTotalCreases(n) }).map((_, i) => {
                    const leftPos = (i + 1) * 100 / Math.pow(2, n - physicalFoldLevel);
                    if (leftPos >= 100) return null; // Hide creases outside current segment
                    return (
                      <div 
                        key={i} 
                        className="absolute top-0 bottom-0 w-[1px] bg-blue-400/40"
                        style={{ left: `${leftPos}%` }}
                      />
                    );
                  })}
                </motion.div>
              ) : animationType === 'folding' ? (
                <motion.div 
                  key="folding-animation"
                  className="absolute inset-0 flex"
                  style={{ width: `${100 / Math.pow(2, physicalFoldLevel)}%` }}
                >
                  {/* Left Half (Static) */}
                  <div className="w-1/2 h-full bg-white shadow-inner border-r border-gray-200 z-10" />
                  
                  {/* Right Half (Folding over) */}
                  <motion.div 
                    className="w-1/2 h-full bg-white shadow-inner origin-left z-20"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 bg-gray-50 border-l border-gray-200" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }} />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="unfolding-animation"
                  className="absolute inset-0 flex"
                  style={{ width: `${100 / Math.pow(2, physicalFoldLevel - 1)}%` }}
                >
                  {/* Left Half (Static) */}
                  <div className="w-1/2 h-full bg-white shadow-inner border-r border-gray-200 z-10" />
                  
                  {/* Right Half (Unfolding from back) */}
                  <motion.div 
                    className="w-1/2 h-full bg-white shadow-inner origin-left z-20"
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 bg-gray-50 border-l border-gray-200" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleFold}
                disabled={n >= 10 || !!animationType}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                {animationType === 'folding' ? 'Folding...' : physicalFoldLevel < n ? 'Refold Paper' : 'Fold Paper'} <ChevronRight size={16} />
              </button>
              <button
                onClick={handleUndo}
                disabled={physicalFoldLevel === 0 || !!animationType}
                className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-full hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <Undo2 size={16} className={animationType === 'unfolding' ? 'animate-spin' : ''} /> 
                {animationType === 'unfolding' ? 'Unfolding...' : 'Unfold'}
              </button>
              <button
                onClick={reset}
                disabled={!!animationType}
                className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-full hover:bg-gray-50 disabled:opacity-30 transition-all text-sm font-medium"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFormula(!showFormula)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  showFormula ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'border border-black/10 hover:bg-gray-50'
                }`}
              >
                <Info size={16} /> {showFormula ? 'Hide Formula' : 'Show Formula'}
              </button>
            </div>
          </div>
        </section>

        {/* Prediction & Feedback */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Specializing: Predict the Next Step</h2>
            <p className="text-xs text-gray-500">How many total creases will there be after <span className="font-bold text-black">{n + 1}</span> folds?</p>
            
            <form onSubmit={checkPrediction} className="flex gap-2">
              <input
                type="number"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                placeholder="Your guess..."
                className="flex-1 px-4 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Check
              </button>
            </form>

            <AnimatePresence mode="wait">
              {feedback.type && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`flex items-start gap-2 p-3 rounded-lg text-xs ${
                    feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {feedback.type === 'success' ? <CheckCircle2 size={14} className="mt-0.5" /> : <AlertCircle size={14} className="mt-0.5" />}
                  <span>{feedback.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <AnimatePresence>
            {showFormula && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ backgroundColor: '#fafcf5' }}
                className="text-emerald-900 border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  Generalizing: The Pattern
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-mono mb-1">Segments (S)</p>
                    <p className="text-2xl font-serif italic">2<sup>n</sup></p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-mono mb-1">Total Creases (C)</p>
                    <p className="text-2xl font-serif italic">2<sup>n</sup> - 1</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed opacity-80 italic">
                  Notice that each fold doubles the number of segments. A new crease is formed between every existing segment, adding 2<sup>n-1</sup> new creases to the total. (Where <strong>n</strong> is the number of times the paper is folded).
                </p>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Data Table */}
        <section className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-black/5 bg-gray-50/50">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">Data Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 text-gray-400 font-mono text-[10px] uppercase tracking-tighter">
                  <th className="px-6 py-3 font-medium">Folds (n)</th>
                  <th className="px-6 py-3 font-medium">New Creases</th>
                  <th className="px-6 py-3 font-medium">Total Creases (C)</th>
                  <th className="px-6 py-3 font-medium">Total Segments (S)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {history.map((row) => (
                  <motion.tr 
                    key={row.n}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{row.n}</td>
                    <td className="px-6 py-4 text-gray-500">{row.newCreases}</td>
                    <td className="px-6 py-4 font-mono text-blue-600 font-semibold">{row.totalCreases}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{row.segments}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="text-center pb-12">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">
            "Specializing helps you see patterns; Generalizing helps you understand them."
          </p>
        </footer>
      </div>
    </div>
  );
}
