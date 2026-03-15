import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

type FormulaCardProps = {
  show: boolean;
};

export function FormulaCard({ show }: FormulaCardProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{ backgroundColor: '#fafcf5' }}
          className="space-y-4 rounded-2xl border border-emerald-100 p-6 text-emerald-900 shadow-sm"
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} className="text-emerald-500" />
            Generalizing: The Pattern
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-emerald-600">Segments (S)</p>
              <p className="text-2xl italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                2<sup>n</sup>
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-emerald-600">Total Creases (C)</p>
              <p className="text-2xl italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                2<sup>n</sup> - 1
              </p>
            </div>
          </div>
          <p className="text-xs italic leading-relaxed opacity-80">
            Notice that each fold doubles the number of segments. A new crease is formed between every existing
            segment, adding 2<sup>n-1</sup> new creases to the total. (Where <strong>n</strong> is the number of
            times the paper is folded).
          </p>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
