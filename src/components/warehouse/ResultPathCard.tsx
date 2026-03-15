import React from 'react';

type ResultPathCardProps = {
  title: string;
  dotClassName: string;
  stepOneLabel: string;
  stepOneAccentClassName: string;
  stepOneEquation: string;
  stepTwoLabel: string;
  stepTwoAccentClassName: string;
  stepTwoEquation: string;
  finalPrice: string;
};

export function ResultPathCard({
  title,
  dotClassName,
  stepOneLabel,
  stepOneAccentClassName,
  stepOneEquation,
  stepTwoLabel,
  stepTwoAccentClassName,
  stepTwoEquation,
  finalPrice,
}: ResultPathCardProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-black/5 bg-gray-50/50 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className={`mb-1 text-[10px] font-mono uppercase tracking-wider ${stepOneAccentClassName}`}>{stepOneLabel}</p>
          <p className="font-mono text-gray-700">{stepOneEquation}</p>
        </div>
        <div>
          <p className={`mb-1 text-[10px] font-mono uppercase tracking-wider ${stepTwoAccentClassName}`}>{stepTwoLabel}</p>
          <p className="font-mono text-gray-700">{stepTwoEquation}</p>
        </div>
      </div>

      <div className="border-t border-black/5 pt-4">
        <p className="mb-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">Final Price</p>
        <p className="text-2xl font-semibold text-gray-900">{finalPrice}</p>
      </div>
    </div>
  );
}
