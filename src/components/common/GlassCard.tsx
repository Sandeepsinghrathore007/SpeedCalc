import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'emerald' | 'amber' | 'coral' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  ...props
}) => {
  const glowClass = {
    emerald: 'border-emerald-500/30 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]',
    amber: 'border-amber-500/30 shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)]',
    coral: 'border-rose-500/30 shadow-[0_0_20px_-3px_rgba(239,68,68,0.25)]',
    none: 'border-white/[0.08]',
  }[glow];

  return (
    <div
      className={twMerge(
        clsx(
          'bg-[#0d1410]/80 backdrop-blur-xl border rounded-2xl transition-all duration-200',
          glowClass,
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
