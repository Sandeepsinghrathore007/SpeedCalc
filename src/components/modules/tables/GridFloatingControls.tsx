import React, { useState, useEffect, useRef } from 'react';
import { useGridStore } from '../../../store/useGridStore';
import { SlidersHorizontal, Shuffle, RefreshCw, X } from 'lucide-react';
import { RangeMode, PracticeMode } from '../../../types';

export const GridFloatingControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const {
    rangeMode,
    setRangeMode,
    practiceMode,
    setPracticeMode,
    regenerateGrid,
    resetGridAnswers,
  } = useGridStore();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const rangeOptions: { label: string; value: RangeMode }[] = [
    { label: 'Teens (11-19)', value: 'teens' },
    { label: 'Single (2-9)', value: 'single' },
    { label: '1 to 20', value: '1-20' },
    { label: '1 to 30', value: '1-30' },
  ];

  return (
    <div ref={popoverRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Floating Popover Menu */}
      {isOpen && (
        <div className="w-80 p-5 rounded-2xl bg-[#0c1310]/95 border border-white/[0.14] backdrop-blur-2xl shadow-2xl flex flex-col gap-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-white">Grid Controls</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Range Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Select Range Preset:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {rangeOptions.map((opt) => {
                const isSelected = rangeMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setRangeMode(opt.value);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20'
                        : 'bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Practice Mode */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Practice Mode:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setPracticeMode('free')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                  practiceMode === 'free'
                    ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20'
                    : 'bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1]'
                }`}
              >
                Free Matrix
              </button>
              <button
                type="button"
                onClick={() => setPracticeMode('guided')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                  practiceMode === 'guided'
                    ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20'
                    : 'bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1]'
                }`}
              >
                Guided Drill
              </button>
            </div>
          </div>

          {/* 3. Action Buttons (Shuffle & Clear) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                regenerateGrid();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/[0.08] hover:border-emerald-500/30 text-xs font-bold text-zinc-200 transition-all shadow-none"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shuffle</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetGridAnswers();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 text-xs font-bold text-zinc-200 transition-all shadow-none"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0d1410]/95 hover:bg-emerald-950/90 border border-emerald-500/40 hover:border-emerald-400 text-white font-bold text-xs backdrop-blur-xl shadow-2xl transition-all hover:scale-105 active:scale-95 group"
        title="Open Range & Grid Controls"
      >
        <SlidersHorizontal className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
        <span className="font-semibold text-xs">Range & Settings</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase">
          {rangeMode}
        </span>
      </button>
    </div>
  );
};
