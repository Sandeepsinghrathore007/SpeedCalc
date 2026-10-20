import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Keyboard, X } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { activeModal, closeModal } = useGameStore();

  if (activeModal !== 'shortcuts') return null;

  const shortcuts = [
    { key: '↑ ↓ ← →', desc: 'Navigate between 10×10 Grid cells' },
    { key: 'Enter', desc: 'Submit answer manually if not auto-verified' },
    { key: 'H / h', desc: 'Reveal Mental Math Strategy & Split-and-Merge Hint' },
    { key: 'Space', desc: 'Skip current flashcard drill' },
    { key: 'P / 1 or C / 2', desc: 'Choose Prime or Composite (in Primes Drill)' },
    { key: 'Y / 1 or N / 2', desc: 'Choose Yes or No (in Divisibility Drill)' },
    { key: 'Esc', desc: 'Close any active modal or hint drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#0c1310] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base md:text-lg">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <span>Keyboard Shortcuts & Quick Controls</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="flex flex-col gap-2.5">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-xs text-zinc-300 font-medium">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.15] text-xs font-mono font-extrabold text-amber-300">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm active:scale-95 transition-all shadow-none"
          >
            Close Shortcuts
          </button>
        </div>
      </div>
    </div>
  );
};
