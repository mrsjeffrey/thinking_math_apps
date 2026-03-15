import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Info, RotateCcw, Undo2 } from 'lucide-react';
import { Button } from '../Button';
import { SectionCard } from '../SectionCard';
import { TogglePill } from '../TogglePill';
import { appStyles } from '../../styles/appStyles';

type PaperFoldVisualizationProps = {
  n: number;
  physicalFoldLevel: number;
  animationType: 'folding' | 'unfolding' | null;
  showFormula: boolean;
  onFold: () => void;
  onUndo: () => void;
  onReset: () => void;
  onToggleFormula: () => void;
  getTotalCreases: (n: number) => number;
};

export function PaperFoldVisualization({
  n,
  physicalFoldLevel,
  animationType,
  showFormula,
  onFold,
  onUndo,
  onReset,
  onToggleFormula,
  getTotalCreases,
}: PaperFoldVisualizationProps) {
  return (

  <SectionCard className="overflow-hidden p-0">
    <div className="flex flex-wrap items-center justify-between border-b border-black/5 bg-gray-50/70 px-6 py-4">
      <h2 className={appStyles.sectionLabel}>Visual Representation</h2>

      <div className="flex flex-wrap gap-2 text-[11px] font-medium">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
          Math Folds: <strong>{n}</strong>
        </span>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
          Physical State: {physicalFoldLevel === 0 ? 'Flat' : `Folded ×${physicalFoldLevel}`}
        </span>
      </div>
    </div>

    <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex h-44 w-full items-center overflow-hidden rounded-2xl border border-black/5 bg-white shadow-inner mb-6">
          {/* animation */}

        <AnimatePresence mode="wait">
          {!animationType ? (
            <motion.div
              key={`paper-${physicalFoldLevel}-${n}`}
              style={{ width: `${100 / Math.pow(2, physicalFoldLevel)}%` }}
              className="relative h-full origin-left overflow-hidden border-r border-gray-200 bg-white shadow-inner"
              initial={{ opacity: 0, scaleX: 0.95 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {Array.from({ length: getTotalCreases(n) }).map((_, i) => {
                const leftPos = ((i + 1) * 100) / Math.pow(2, n - physicalFoldLevel);
                if (leftPos >= 100) return null;

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
              <div className="z-10 h-full w-1/2 border-r border-gray-200 bg-white shadow-inner" />
              <motion.div
                className="z-20 h-full w-1/2 origin-left bg-white shadow-inner"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute inset-0 border-l border-gray-200 bg-gray-50"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="unfolding-animation"
              className="absolute inset-0 flex"
              style={{ width: `${100 / Math.pow(2, physicalFoldLevel - 1)}%` }}
            >
              <div className="z-10 h-full w-1/2 border-r border-gray-200 bg-white shadow-inner" />
              <motion.div
                className="z-20 h-full w-1/2 origin-left bg-white shadow-inner"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute inset-0 border-l border-gray-200 bg-gray-50"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onFold}
            disabled={n >= 10 || !!animationType}
          >
            {animationType === 'folding'
              ? 'Folding...'
              : physicalFoldLevel < n
                ? 'Refold Paper'
                : 'Fold Paper'}
            <ChevronRight size={14} />
          </Button>

          <Button
            size="sm"
            onClick={onUndo}
            disabled={physicalFoldLevel === 0 || !!animationType}
          >
            <Undo2 size={14} className={animationType === 'unfolding' ? 'animate-spin' : ''} />
            {animationType === 'unfolding' ? 'Unfolding...' : 'Unfold'}
          </Button>

          <Button
            size="sm"
            onClick={onReset}
            disabled={!!animationType}
          >
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>

        <TogglePill
          active={showFormula}
          onClick={onToggleFormula}
          icon={<Info size={16} />}
        >
          {showFormula ? 'Hide Formula' : 'Show Formula'}
        </TogglePill>

        </div>
       </div>
      </div>
    </SectionCard>
  );
}
