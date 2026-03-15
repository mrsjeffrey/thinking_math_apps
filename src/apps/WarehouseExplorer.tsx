/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Calculator, DollarSign, Info, Percent, RefreshCw } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { SectionCard } from '../components/SectionCard';
import { SectionHeader } from '../components/SectionHeader';
import { TogglePill } from '../components/TogglePill';
import { ChartWrapper } from '../components/warehouse/ChartWrapper';
import { InsightCard } from '../components/warehouse/InsightCard';
import { ParameterSlider } from '../components/warehouse/ParameterSlider';
import { ResultPathCard } from '../components/warehouse/ResultPathCard';
import { StackedBar } from '../components/warehouse/StackedBar';
import { appStyles } from '../styles/appStyles';
import { cn } from '../lib/cn';

export default function WarehouseExplorer() {
  const [price, setPrice] = useState(100);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [taxPercent, setTaxPercent] = useState(15);
  const [showInsight, setShowInsight] = useState(false);
  const [showVisual, setShowVisual] = useState(false);

  const discountMultiplier = useMemo(() => (100 - discountPercent) / 100, [discountPercent]);
  const taxMultiplier = useMemo(() => (100 + taxPercent) / 100, [taxPercent]);

  const pathA_step1 = useMemo(() => price * discountMultiplier, [price, discountMultiplier]);
  const pathA_final = useMemo(() => pathA_step1 * taxMultiplier, [pathA_step1, taxMultiplier]);

  const pathB_step1 = useMemo(() => price * taxMultiplier, [price, taxMultiplier]);
  const pathB_final = useMemo(() => pathB_step1 * discountMultiplier, [pathB_step1, discountMultiplier]);

  const randomize = () => {
    setPrice(Math.floor(Math.random() * 950) + 50);
    setDiscountPercent(Math.floor(Math.random() * 40) + 5);
    setTaxPercent(Math.floor(Math.random() * 20) + 5);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className={appStyles.page}>
      <div className={cn(appStyles.container, 'max-w-5xl')}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <AppHeader
            title="Warehouse Explorer"
            subtitle={
              <>
                Sourced from <strong>Thinking Mathematically</strong> (Burton et al.)
              </>
            }
            titleClassName="text-4xl tracking-tight text-gray-900"
            titleStyle={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          />
          <Button onClick={randomize} className="mt-1">
            <RefreshCw size={16} /> Randomize
          </Button>
        </div>

        <SectionCard className="overflow-hidden">
          <SectionHeader icon={<Info size={16} className="text-blue-500" />} title="The Problem" />
          <div className={appStyles.cardSection}>
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              "In a warehouse you obtain {discountPercent}% discount but you must pay a {taxPercent}% sales tax. Which
              would you prefer to have calculated first: discount or tax?"
            </blockquote>
          </div>
        </SectionCard>

        <SectionCard className="space-y-8 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={appStyles.sectionLabel}>Parameters</h2>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400">
              <span>Price: {formatCurrency(price)}</span>
              <span>Discount: {discountPercent}%</span>
              <span>Tax: {taxPercent}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ParameterSlider
              label="Price"
              valueLabel={formatCurrency(price)}
              value={price}
              min={10}
              max={1000}
              step={10}
              onChange={setPrice}
              icon={<DollarSign size={16} className="text-gray-400" />}
              accentClassName="accent-black"
            />

            <ParameterSlider
              label="Discount"
              valueLabel={`${discountPercent}%`}
              value={discountPercent}
              min={0}
              max={90}
              onChange={setDiscountPercent}
              icon={<Percent size={16} className="text-emerald-500" />}
              valueClassName="text-emerald-700"
              accentClassName="accent-emerald-600"
            />

            <ParameterSlider
              label="Tax"
              valueLabel={`${taxPercent}%`}
              value={taxPercent}
              min={0}
              max={50}
              onChange={setTaxPercent}
              icon={<Calculator size={16} className="text-violet-500" />}
              valueClassName="text-violet-700"
              accentClassName="accent-violet-600"
            />
          </div>
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <SectionHeader icon={<BarChart3 size={16} className="text-blue-500" />} title="Calculation Results" />

          <div className="space-y-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
             <div className="flex flex-wrap gap-2">
              <Button
                variant={!showVisual ? "primary" : "secondary"}
                onClick={() => setShowVisual(false)}
              >
                <Calculator size={16} /> Steps
              </Button>

              <Button
                variant={showVisual ? "primary" : "secondary"}
                onClick={() => setShowVisual(true)}
              >
                <BarChart3 size={16} /> Visual
              </Button>
            </div>

              <TogglePill active={showInsight} onClick={() => setShowInsight((prev) => !prev)}>
                {showInsight ? 'Hide Insight' : 'Show Insight'}
              </TogglePill>
            </div>

            <AnimatePresence mode="wait">
              {!showVisual ? (
                <motion.div
                  key="steps"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <ResultPathCard
                    title="Path A: Discount then Tax"
                    dotClassName="bg-emerald-500"
                    stepOneLabel="Step 1: Discount"
                    stepOneAccentClassName="text-emerald-600"
                    stepOneEquation={`${formatCurrency(price)} × ${discountMultiplier.toFixed(2)} = ${formatCurrency(pathA_step1)}`}
                    stepTwoLabel="Step 2: Tax"
                    stepTwoAccentClassName="text-violet-600"
                    stepTwoEquation={`${formatCurrency(pathA_step1)} × ${taxMultiplier.toFixed(2)} = ${formatCurrency(pathA_final)}`}
                    finalPrice={formatCurrency(pathA_final)}
                  />

                  <ResultPathCard
                    title="Path B: Tax then Discount"
                    dotClassName="bg-violet-500"
                    stepOneLabel="Step 1: Tax"
                    stepOneAccentClassName="text-violet-600"
                    stepOneEquation={`${formatCurrency(price)} × ${taxMultiplier.toFixed(2)} = ${formatCurrency(pathB_step1)}`}
                    stepTwoLabel="Step 2: Discount"
                    stepTwoAccentClassName="text-emerald-600"
                    stepTwoEquation={`${formatCurrency(pathB_step1)} × ${discountMultiplier.toFixed(2)} = ${formatCurrency(pathB_final)}`}
                    finalPrice={formatCurrency(pathB_final)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <ChartWrapper title="Path A: Discount then Tax" price={price} formatCurrency={formatCurrency}>
                      <StackedBar label="Start" segments={[{ height: 100 / 1.5, color: 'bg-gray-300', tooltip: '100%' }]} />
                      <StackedBar
                        label="Price after discount applied"
                        segments={[{ height: (discountMultiplier * 100) / 1.5, color: 'bg-emerald-300/80', tooltip: `${(discountMultiplier * 100).toFixed(0)}%` }]}
                      />
                      <StackedBar
                        label="Tax added to discount price"
                        segments={[
                          { height: (discountMultiplier * 100) / 1.5, color: 'bg-emerald-300/80' },
                          {
                            height: (((pathA_final - pathA_step1) / price) * 100) / 1.5,
                            color: 'bg-violet-400/80',
                            tooltip: `+${taxPercent}% Tax`,
                          },
                        ]}
                      />
                      <StackedBar
                        label="Final"
                        segments={[{ height: ((pathA_final / price) * 100) / 1.5, color: 'bg-black', tooltip: formatCurrency(pathA_final) }]}
                      />
                    </ChartWrapper>

                    <ChartWrapper title="Path B: Tax then Discount" price={price} formatCurrency={formatCurrency}>
                      <StackedBar label="Start" segments={[{ height: 100 / 1.5, color: 'bg-gray-300', tooltip: '100%' }]} />
                      <StackedBar
                        label="Price after tax applied"
                        segments={[{ height: (taxMultiplier * 100) / 1.5, color: 'bg-violet-300/80', tooltip: `${(taxMultiplier * 100).toFixed(0)}%` }]}
                      />
                      <StackedBar
                        label="Discount subtracted from taxed price"
                        segments={[
                          { height: ((pathB_final / price) * 100) / 1.5, color: 'bg-violet-300/80' },
                          {
                            height: (((pathB_step1 - pathB_final) / price) * 100) / 1.5,
                            color: 'border-t border-dashed border-emerald-500 bg-emerald-200/70',
                            tooltip: `-${discountPercent}% Disc`,
                          },
                        ]}
                      />
                      <StackedBar
                        label="Final"
                        segments={[{ height: ((pathB_final / price) * 100) / 1.5, color: 'bg-black', tooltip: formatCurrency(pathB_final) }]}
                      />
                    </ChartWrapper>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {Math.abs(pathA_final - pathB_final) < 0.001 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-black/5 bg-gray-50 px-4 py-3 text-center text-sm font-medium text-gray-600"
                >
                  The final results are mathematically identical.
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </SectionCard>

        <AnimatePresence>
          {showInsight ? (
            <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <InsightCard discountMultiplier={discountMultiplier} taxMultiplier={taxMultiplier} />
            </motion.section>
          ) : null}
        </AnimatePresence>

        <footer className="pb-12 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            "Specializing helps you test examples; Generalizing helps you explain why they work."
          </p>
        </footer>
      </div>
    </div>
  );
}
