import React from 'react';
import { Lightbulb } from 'lucide-react';
import { SectionCard } from '../SectionCard';

type InsightCardProps = {
  discountMultiplier: number;
  taxMultiplier: number;
};

export function InsightCard({ discountMultiplier, taxMultiplier }: InsightCardProps) {
  return (
    <SectionCard className="space-y-4 border-emerald-100 bg-[#fafcf5] p-6 text-emerald-900">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb size={16} className="text-emerald-500" />
        Mathematical Insight
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 text-sm leading-relaxed opacity-90">
          <p>
            This problem demonstrates the <strong>commutative property</strong> of multiplication. Whether you apply a
            discount multiplier or a tax multiplier first, the final product stays the same.
          </p>
          <p>
            In other words, multiplying by <strong>{discountMultiplier.toFixed(2)}</strong> and then{' '}
            <strong>{taxMultiplier.toFixed(2)}</strong> gives the same result as doing those same multiplications in the
            reverse order.
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-emerald-100 bg-white p-4 font-mono text-xs shadow-sm">
          <p className="text-emerald-700">Path A: P × {discountMultiplier.toFixed(2)} × {taxMultiplier.toFixed(2)}</p>
          <p className="text-violet-700">Path B: P × {taxMultiplier.toFixed(2)} × {discountMultiplier.toFixed(2)}</p>
          <p className="border-t border-emerald-100 pt-2 font-bold text-gray-900">A = B</p>
        </div>
      </div>
    </SectionCard>
  );
}
