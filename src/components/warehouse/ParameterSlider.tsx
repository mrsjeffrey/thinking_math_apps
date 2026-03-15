import React from 'react';

type ParameterSliderProps = {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  valueClassName?: string;
  accentClassName?: string;
};

export function ParameterSlider({
  label,
  valueLabel,
  value,
  min,
  max,
  step,
  onChange,
  icon,
  valueClassName = 'text-gray-900',
  accentClassName = 'accent-black',
}: ParameterSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-gray-400">{label}</label>
        <span className={`text-sm font-semibold ${valueClassName}`}>{valueLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        {icon}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 ${accentClassName}`}
        />
      </div>
    </div>
  );
}
