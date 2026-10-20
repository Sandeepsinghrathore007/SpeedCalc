import React, { useState, useEffect } from 'react';
import { useGridStore } from '../../../store/useGridStore';
import { useGameStore } from '../../../store/useGameStore';
import { getTableHint } from '../../../utils/formulas';
import { SegmentedControl } from '../../common/SegmentedControl';
import { GlassCard } from '../../common/GlassCard';
import {
  Grid3X3,
  Zap,
  Shuffle,
  RefreshCw,
  Lightbulb,
  FastForward,
  CheckCircle2,
  Target,
} from 'lucide-react';
import { RangeMode, PracticeMode, ArithmeticMode } from '../../../types';

export const GridSidePanel: React.FC = () => {
  const {
    operation,
    rangeMode,
    setRangeMode,
    practiceMode,
    setPracticeMode,
    arithmeticMode,
    setArithmeticMode,
    activeRow,
    activeCol,
    cells,
    solvedCount,
    totalCells,
    currentCellStartTime,
    regenerateGrid,
    resetGridAnswers,
    advanceGuided,
  } = useGridStore();

  const { openModal, totalAttempts, totalErrors } = useGameStore();

  const [elapsed, setElapsed] = useState('0.0s');

  useEffect(() => {
    const interval = setInterval(() => {
      const sec = Math.max(0, (Date.now() - currentCellStartTime) / 1000);
      setElapsed(`${sec.toFixed(1)}s`);
    }, 100);
    return () => clearInterval(interval);
  }, [currentCellStartTime]);

  const activeKey = `${activeRow},${activeCol}`;
  const cell = cells[activeKey];
  const opSign = operation === 'multiply' ? '×' : operation === 'add' ? '+' : '−';

  const opTitle =
    operation === 'multiply'
      ? 'Multiplication (×)'
      : operation === 'add'
      ? 'Addition (+)'
      : 'Subtraction (−)';

  const handleOpenHint = () => {
    if (!cell) return;
    const hint = getTableHint(cell.rowVal, cell.colVal, operation);
    openModal('hint', {
      heading: `${cell.rowVal} ${opSign} ${cell.colVal}`,
      tag: hint.tag,
      formula: hint.formula,
      explanation: hint.explanation,
    });
  };

  const accuracy =
    totalAttempts === 0
      ? 100
      : Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100);

  const rangeOptions: { label: string; value: RangeMode }[] = [
    { label: 'Teens (11-19)', value: 'teens' },
    { label: 'Single (2-9)', value: 'single' },
    { label: '1 to 20', value: '1-20' },
    { label: '1 to 30', value: '1-30' },
  ];

  return (
    <GlassCard className="w-full lg:w-80 p-4 flex flex-col gap-4 text-xs font-sans shadow-none">
      {/* 1. Operation Title & Mode Switcher */}
      <div className="flex flex-col gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-extrabold text-xs text-emerald-400">
              {opSign}
            </span>
            <span className="font-extrabold text-sm text-white">{opTitle}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Grid vs Flashcard Toggle */}
        <SegmentedControl<ArithmeticMode>
          size="sm"
          value={arithmeticMode}
          onChange={setArithmeticMode}
          options={[
            {
              label: '10×10 Grid',
              value: 'grid',
              icon: <Grid3X3 className="w-3 h-3" />,
            },
            {
              label: 'Flashcard Drill',
              value: 'flashcard',
              icon: <Zap className="w-3 h-3" />,
            },
          ]}
        />
      </div>

      {/* 2. Range Selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Preset Range:
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRangeMode(opt.value)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                rangeMode === opt.value
                  ? 'bg-emerald-500 text-black font-extrabold'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Grid Practice Mode */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Matrix Mode:
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setPracticeMode('free')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
              practiceMode === 'free'
                ? 'bg-emerald-500 text-black font-extrabold'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Free Matrix
          </button>
          <button
            type="button"
            onClick={() => setPracticeMode('guided')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
              practiceMode === 'guided'
                ? 'bg-emerald-500 text-black font-extrabold'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Guided Drill
          </button>
        </div>
      </div>

      {/* 4. Active Cell Target & Live Hint */}
      {cell && (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {practiceMode === 'guided' ? 'Target Equation' : 'Focused Cell'}
            </span>
            <span className="font-mono text-xs font-bold text-amber-400 bg-white/[0.06] px-1.5 py-0.5 rounded">
              {elapsed}
            </span>
          </div>

          <div className="py-2 px-3 rounded-lg bg-black/40 border border-white/[0.05] text-center font-mono">
            <span className="text-xl md:text-2xl font-black text-white">
              {cell.rowVal} <span className="text-amber-400">{opSign}</span> {cell.colVal} = ?
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleOpenHint}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint [H]</span>
            </button>

            {practiceMode === 'guided' && (
              <button
                type="button"
                onClick={advanceGuided}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 text-xs font-bold transition-colors"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Matrix Progress Mini-Card */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Grid Progress
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {solvedCount} / {totalCells}
          </span>
        </div>

        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(solvedCount / totalCells) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
          <span>Accuracy: {accuracy}%</span>
          <span>Errors: {totalErrors}</span>
        </div>
      </div>

      {/* 6. Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={regenerateGrid}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-emerald-500/15 hover:text-emerald-400 border border-white/[0.08] hover:border-emerald-500/30 text-xs font-bold text-zinc-300 transition-all shadow-none"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>

        <button
          type="button"
          onClick={resetGridAnswers}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-rose-500/15 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 text-xs font-bold text-zinc-300 transition-all shadow-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </GlassCard>
  );
};
