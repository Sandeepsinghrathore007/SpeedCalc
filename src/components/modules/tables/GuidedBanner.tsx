import React, { useState, useEffect } from 'react';
import { useGridStore } from '../../../store/useGridStore';
import { useGameStore } from '../../../store/useGameStore';
import { getTableHint } from '../../../utils/formulas';
import { Lightbulb, FastForward, Target } from 'lucide-react';

export const GuidedBanner: React.FC = () => {
  const {
    practiceMode,
    activeRow,
    activeCol,
    cells,
    operation,
    currentCellStartTime,
    advanceGuided,
  } = useGridStore();

  const { openModal } = useGameStore();

  const [elapsed, setElapsed] = useState('0.0s');

  useEffect(() => {
    if (practiceMode !== 'guided') return;
    const interval = setInterval(() => {
      const now = Date.now();
      const sec = Math.max(0, (now - currentCellStartTime) / 1000);
      setElapsed(`${sec.toFixed(1)}s`);
    }, 100);
    return () => clearInterval(interval);
  }, [practiceMode, currentCellStartTime]);

  if (practiceMode !== 'guided') return null;

  const activeKey = `${activeRow},${activeCol}`;
  const cell = cells[activeKey];
  if (!cell) return null;

  const opSign = operation === 'multiply' ? '×' : operation === 'add' ? '+' : '−';

  const handleOpenHint = () => {
    const hint = getTableHint(cell.rowVal, cell.colVal, operation);
    openModal('hint', {
      heading: `${cell.rowVal} ${opSign} ${cell.colVal}`,
      tag: hint.tag,
      formula: hint.formula,
      explanation: hint.explanation,
    });
  };

  return (
    <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c1310]/95 border border-emerald-500/40 backdrop-blur-xl shadow-lg shadow-emerald-500/10 animate-fadeIn select-none">
      {/* Target Badge */}
      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <Target className="w-3 h-3" />
        <span>Target</span>
      </span>

      {/* Target Equation & Timer */}
      <div className="flex items-baseline gap-2 font-mono">
        <span className="text-base sm:text-lg md:text-xl font-black text-white">
          {cell.rowVal} <span className="text-amber-400">{opSign}</span> {cell.colVal} = ?
        </span>
        <span className="text-[11px] font-mono text-zinc-400 bg-white/[0.06] px-1.5 py-0.5 rounded">
          {elapsed}
        </span>
      </div>

      {/* Quick Actions (Hint & Skip) */}
      <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/[0.1]">
        <button
          type="button"
          onClick={handleOpenHint}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
          title="Show Mental Strategy Hint (H)"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hint [H]</span>
        </button>

        <button
          type="button"
          onClick={advanceGuided}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 text-xs font-bold transition-colors"
          title="Skip to Next Flashcard (Space)"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Skip</span>
        </button>
      </div>
    </div>
  );
};
