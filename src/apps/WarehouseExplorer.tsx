/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Percent, 
  DollarSign, 
  RefreshCw, 
  Info, 
  Lightbulb, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WarehouseExplorer() {
  const [price, setPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(15);
  const [showInsight, setShowInsight] = useState<boolean>(false);
  const [showVisual, setShowVisual] = useState<boolean>(false);

  // Multipliers
  const discountMultiplier = useMemo(() => (100 - discountPercent) / 100, [discountPercent]);
  const taxMultiplier = useMemo(() => (100 + taxPercent) / 100, [taxPercent]);

  // Path A: Discount then Tax
  const pathA_step1 = useMemo(() => price * discountMultiplier, [price, discountMultiplier]);
  const pathA_final = useMemo(() => pathA_step1 * taxMultiplier, [pathA_step1, taxMultiplier]);

  // Path B: Tax then Discount
  const pathB_step1 = useMemo(() => price * taxMultiplier, [price, taxMultiplier]);
  const pathB_final = useMemo(() => pathB_step1 * discountMultiplier, [pathB_step1, discountMultiplier]);

  const randomize = () => {
    setPrice(Math.floor(Math.random() * 950) + 50);
    setDiscountPercent(Math.floor(Math.random() * 40) + 5);
    setTaxPercent(Math.floor(Math.random() * 20) + 5);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const StackedBar = ({ segments, label }: { segments: { height: number, color: string, tooltip?: string }[], label: string }) => (
    <div className="flex flex-col items-center gap-2 w-16 h-full justify-end z-10">
      <div className="relative w-full flex-1 flex flex-col justify-end">
        {segments.map((seg, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${seg.height}%` }}
            className={`w-full ${seg.color} ${i === segments.length - 1 ? 'rounded-t-sm' : ''} relative group transition-colors`}
          >
            {seg.tooltip && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold font-mono bg-brand-primary text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                {seg.tooltip}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <span className="text-[8px] font-bold text-brand-secondary uppercase tracking-tighter shrink-0 text-center leading-tight h-8 flex items-center">{label}</span>
    </div>
  );

  const ChartWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="space-y-4 flex flex-col">
      <p className="text-[10px] font-bold uppercase text-brand-secondary text-center">{title}</p>
      <div className="relative flex items-end h-[450px] bg-brand-bg/50 rounded border border-brand-border p-4 pl-20 pr-6 overflow-hidden">
        {/* Y-Axis & Horizontal Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-4 pb-12 pl-20 pr-6">
          {[1.5, 1.25, 1, 0.75, 0.5, 0.25, 0].map((factor) => (
            <div key={factor} className="relative w-full border-b border-brand-border/40 flex items-center h-0">
              <span className="absolute -left-16 text-[9px] font-bold text-brand-secondary/70">{formatCurrency(price * factor)}</span>
            </div>
          ))}
        </div>
        {/* Vertical Gridlines */}
        <div className="absolute inset-0 flex justify-around pointer-events-none pt-4 pb-12 pl-20 pr-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-full border-l border-brand-border/30"></div>
          ))}
        </div>
        <div className="flex items-end justify-around w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary font-sans selection:bg-brand-blue/20">
      {/* Header */}
      <header className="py-12 px-6 max-w-5xl mx-auto">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Warehouse Explorer</h1>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <button 
              onClick={randomize}
              className="hover:text-brand-blue transition-colors flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Random
            </button>
          </div>
        </nav>
        <p className="mt-2 text-sm text-brand-secondary">Mathematical Thinking: Specializing & Generalizing</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24 space-y-12">
        {/* The Question */}
        <section className="prose prose-sm max-w-none border-l-4 border-brand-blue pl-6 py-2 bg-brand-blue/5 rounded-r-lg">
          <p className="text-lg leading-relaxed italic text-brand-primary/90">
            "In a warehouse you obtain {discountPercent}% discount but you must pay a {taxPercent}% sales tax. Which would you prefer to have calculated first: discount or tax?"
          </p>
          <footer className="mt-2 text-xs text-brand-secondary uppercase tracking-widest">— Thinking Mathematically</footer>
        </section>

        {/* Controls Section */}
        <section className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-sm space-y-8">
          <header className="flex items-center justify-between border-b border-brand-border pb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-black">
              <Percent size={16} />
              Parameters
            </h2>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Price Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-brand-blue uppercase tracking-widest">Price</label>
                <span className="text-sm font-mono font-bold text-brand-blue">{formatCurrency(price)}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="1000" 
                step="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>

            {/* Discount Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-brand-green uppercase tracking-widest">Discount</label>
                <span className="text-sm font-mono font-bold text-brand-green">{discountPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-green"
              />
            </div>

            {/* Tax Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-brand-purple uppercase tracking-widest">Tax</label>
                <span className="text-sm font-mono font-bold text-brand-purple">{taxPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
            </div>
          </div>

          <div className="pt-4">
            {/* Insight button removed from here */}
          </div>
        </section>

        {/* Results Area */}
        <section className="bg-brand-card border border-brand-border rounded-lg shadow-sm overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-bg/20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Calculation Results</h2>
          <div className="flex bg-brand-bg p-1 rounded-md border border-brand-border gap-1">
              <button 
                onClick={() => setShowInsight(!showInsight)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${showInsight ? 'bg-black text-white shadow-sm' : 'text-brand-secondary hover:text-black'}`}
              >
                <Lightbulb size={12} />
                Insight
              </button>
              <div className="w-px h-4 bg-brand-border self-center mx-1"></div>
              <button 
                onClick={() => setShowVisual(false)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${!showVisual ? 'bg-black text-white shadow-sm' : 'text-brand-secondary hover:text-black'}`}
              >
                Steps
              </button>
              <button 
                onClick={() => setShowVisual(true)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${showVisual ? 'bg-black text-white shadow-sm' : 'text-brand-secondary hover:text-black'}`}
              >
                Visual
              </button>
            </div>
          </header>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {!showVisual ? (
                <motion.div 
                  key="step-by-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Path A */}
                  <div className="bg-brand-bg/30 border border-brand-border p-6 rounded-lg space-y-6 hover:border-brand-green/30 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest border-b border-brand-border pb-2 flex items-center justify-between">
                      Path A: Discount First
                      <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                    </h3>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <p className="text-brand-green text-[10px] uppercase font-bold mb-1">Step 1: Discount</p>
                        <p className="font-mono">{formatCurrency(price)} × {discountMultiplier.toFixed(2)} = {formatCurrency(pathA_step1)}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-brand-purple text-[10px] uppercase font-bold mb-1">Step 2: Tax</p>
                        <p className="font-mono">{formatCurrency(pathA_step1)} × {taxMultiplier.toFixed(2)} = {formatCurrency(pathA_final)}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-brand-border">
                      <p className="text-[10px] uppercase font-bold text-brand-secondary mb-1">Final Price</p>
                      <p className="text-2xl font-bold text-black">{formatCurrency(pathA_final)}</p>
                    </div>
                  </div>

                  {/* Path B */}
                  <div className="bg-brand-bg/30 border border-brand-border p-6 rounded-lg space-y-6 hover:border-brand-purple/30 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest border-b border-brand-border pb-2 flex items-center justify-between">
                      Path B: Tax First
                      <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
                    </h3>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <p className="text-brand-purple text-[10px] uppercase font-bold mb-1">Step 1: Tax</p>
                        <p className="font-mono">{formatCurrency(price)} × {taxMultiplier.toFixed(2)} = {formatCurrency(pathB_step1)}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-brand-green text-[10px] uppercase font-bold mb-1">Step 2: Discount</p>
                        <p className="font-mono">{formatCurrency(pathB_step1)} × {discountMultiplier.toFixed(2)} = {formatCurrency(pathB_final)}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-brand-border">
                      <p className="text-[10px] uppercase font-bold text-brand-secondary mb-1">Final Price</p>
                      <p className="text-2xl font-bold text-black">{formatCurrency(pathB_final)}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="visual"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <ChartWrapper title="Path A: Discount then Tax">
                      <StackedBar 
                        label="Start" 
                        segments={[{ height: 100 / 1.5, color: 'bg-brand-secondary/30', tooltip: '100%' }]} 
                      />
                      <StackedBar 
                        label="Price after discount applied" 
                        segments={[{ height: (discountMultiplier * 100) / 1.5, color: 'bg-brand-green/40', tooltip: `${(discountMultiplier * 100).toFixed(0)}%` }]} 
                      />
                      <StackedBar 
                        label="Tax added to discount price" 
                        segments={[
                          { height: (discountMultiplier * 100) / 1.5, color: 'bg-brand-green/40' },
                          { height: ((pathA_final - pathA_step1) / price * 100) / 1.5, color: 'bg-brand-purple/60', tooltip: `+${taxPercent}% Tax` }
                        ]} 
                      />
                      <StackedBar 
                        label="Final" 
                        segments={[{ height: (pathA_final / price * 100) / 1.5, color: 'bg-brand-blue', tooltip: formatCurrency(pathA_final) }]} 
                      />
                    </ChartWrapper>

                    <ChartWrapper title="Path B: Tax then Discount">
                      <StackedBar 
                        label="Start" 
                        segments={[{ height: 100 / 1.5, color: 'bg-brand-secondary/30', tooltip: '100%' }]} 
                      />
                      <StackedBar 
                        label="Price after tax applied" 
                        segments={[{ height: (taxMultiplier * 100) / 1.5, color: 'bg-brand-purple/40', tooltip: `${(taxMultiplier * 100).toFixed(0)}%` }]} 
                      />
                      <StackedBar 
                        label="Discount subtracted from taxed price" 
                        segments={[
                          { height: (pathB_final / price * 100) / 1.5, color: 'bg-brand-blue/60' },
                          { height: ((pathB_step1 - pathB_final) / price * 100) / 1.5, color: 'bg-brand-green/20 border-t border-dashed border-brand-green', tooltip: `-${discountPercent}% Disc` }
                        ]} 
                      />
                      <StackedBar 
                        label="Final" 
                        segments={[{ height: (pathB_final / price * 100) / 1.5, color: 'bg-brand-blue', tooltip: formatCurrency(pathB_final) }]} 
                      />
                    </ChartWrapper>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Message */}
            <AnimatePresence>
              {Math.abs(pathA_final - pathB_final) < 0.001 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center p-4 border border-brand-border bg-brand-bg/50 rounded text-sm font-medium text-brand-secondary"
                >
                  The final results are mathematically identical.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Insight Section */}
        <AnimatePresence>
          {showInsight && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-md border-t-4 border-t-black space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b border-brand-border pb-2 text-black">Mathematical Insight</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-black">
                  <div className="space-y-4">
                    <p>
                      This problem demonstrates the <strong>commutative property</strong> of multiplication. 
                      Whether you apply a discount (multiplier &lt; 1) or tax (multiplier &gt; 1) first, the final product remains unchanged.
                    </p>
                  </div>
                  <div className="bg-brand-bg p-6 rounded font-mono text-xs space-y-2 border border-brand-border">
                    <p className="text-brand-green">Path A: P × 0.80 × 1.15</p>
                    <p className="text-brand-purple">Path B: P × 1.15 × 0.80</p>
                    <p className="pt-2 border-t border-brand-border font-bold text-black">A = B</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-brand-border text-[10px] text-brand-secondary uppercase tracking-widest flex justify-between">
        <p>© 2026 Mathematical Thinking</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-green transition-colors">Specializing</a>
          <a href="#" className="hover:text-brand-purple transition-colors">Generalizing</a>
        </div>
      </footer>
    </div>
  );
}
