import React from 'react';

type ChartWrapperProps = {
  children: React.ReactNode;
  title: string;
  price: number;
  formatCurrency: (value: number) => string;
};

export function ChartWrapper({ children, title, price, formatCurrency }: ChartWrapperProps) {
  return (
    <div className="flex flex-col space-y-4">
      <p className="text-center text-[10px] font-mono uppercase tracking-wider text-gray-400">{title}</p>
      <div className="relative flex h-[450px] items-end overflow-hidden rounded-2xl border border-black/5 bg-gray-50/50 p-4 pl-20 pr-6">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-12 pl-20 pr-6 pt-4">
          {[1.5, 1.25, 1, 0.75, 0.5, 0.25, 0].map((factor) => (
            <div key={factor} className="relative flex h-0 w-full items-center border-b border-black/5">
              <span className="absolute -left-16 text-[9px] font-semibold text-gray-400">{formatCurrency(price * factor)}</span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex justify-around pb-12 pl-20 pr-6 pt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-full border-l border-black/5" />
          ))}
        </div>

        <div className="flex h-full w-full items-end justify-around">{children}</div>
      </div>
    </div>
  );
}
