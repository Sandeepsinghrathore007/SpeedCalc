import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Lightbulb, X } from 'lucide-react';

export const HintModal: React.FC = () => {
  const { activeModal, closeModal, hintData } = useGameStore();

  if (activeModal !== 'hint' || !hintData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#0c1310] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span>Mental Math Strategy</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Heading & Rule Tag */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black font-mono text-white">
            {hintData.heading}
          </span>
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {hintData.tag}
          </span>
        </div>

        {/* Formula breakdown */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] font-mono text-sm md:text-base font-bold text-emerald-300">
          {hintData.formula}
        </div>

        {/* Explanation */}
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
          {hintData.explanation}
        </p>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm active:scale-95 transition-all shadow-none"
          >
            Got It! Return to Cell (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
