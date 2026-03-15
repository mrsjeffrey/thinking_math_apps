import React from 'react';
import { motion } from 'motion/react';

type Segment = {
  height: number;
  color: string;
  tooltip?: string;
};

type StackedBarProps = {
  segments: Segment[];
  label: string;
};

export function StackedBar({ segments, label }: StackedBarProps) {
  return (
    <div className="z-10 flex h-full w-16 flex-col items-center justify-end gap-2">
      <div className="relative flex flex-1 flex-col justify-end w-full">
        {segments.map((seg, i) => (
          <motion.div
            key={`${label}-${i}`}
            initial={{ height: 0 }}
            animate={{ height: `${seg.height}%` }}
            className={`group relative w-full transition-colors ${seg.color} ${i === segments.length - 1 ? 'rounded-t-sm' : ''}`}
          >
            {seg.tooltip ? (
              <div className="absolute -top-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[8px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {seg.tooltip}
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
      <span className="flex h-8 shrink-0 items-center text-center text-[8px] font-bold uppercase leading-tight tracking-tighter text-gray-500">
        {label}
      </span>
    </div>
  );
}
