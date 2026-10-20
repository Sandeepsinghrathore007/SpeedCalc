import React from 'react';
import { clsx } from 'clsx';

interface Option<T> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex items-center p-1 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl gap-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              'flex items-center gap-1.5 font-semibold transition-all duration-150 rounded-lg',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs md:text-sm',
              active
                ? 'bg-emerald-500 text-black font-bold shadow-sm shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            )}
          >
            {opt.icon && <span className="w-3.5 h-3.5">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
