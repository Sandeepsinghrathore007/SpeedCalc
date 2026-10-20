import React from 'react';
import { useGridStore } from '../../../store/useGridStore';
import { SegmentedControl } from '../../common/SegmentedControl';
import { Shuffle, RefreshCw } from 'lucide-react';
import { OperationType, RangeMode, PracticeMode } from '../../../types';

export const TableControls: React.FC = () => {
  const {
    operation,
    setOperation,
    rangeMode,
    setRangeMode,
    practiceMode,
    setPracticeMode,
    regenerateGrid,
    resetGridAnswers,
  } = useGridStore();

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      {/* Operation selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Op:
        </span>
        <SegmentedControl<OperationType>
          size="sm"
          value={operation}
          onChange={setOperation}
          options={[
            { label: '× Mult', value: 'multiply' },
            { label: '+ Add', value: 'add' },
            { label: '− Sub', value: 'subtract' },
          ]}
        />
      </div>

      {/* Range selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Range:
        </span>
        <SegmentedControl<RangeMode>
          size="sm"
          value={rangeMode}
          onChange={setRangeMode}
          options={[
            { label: 'Teens (11-19)', value: 'teens' },
            { label: 'Single (2-9)', value: 'single' },
            { label: '1 to 20', value: '1-20' },
            { label: '1 to 30', value: '1-30' },
          ]}
        />
      </div>

      {/* Practice mode selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Mode:
        </span>
        <SegmentedControl<PracticeMode>
          size="sm"
          value={practiceMode}
          onChange={setPracticeMode}
          options={[
            { label: 'Free Grid', value: 'free' },
            { label: 'Guided Drill', value: 'guided' },
          ]}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={regenerateGrid}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500/15 hover:text-emerald-400 border border-white/[0.08] hover:border-emerald-500/30 text-xs font-bold text-zinc-300 transition-all"
          title="Generate New Random Numbers"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>

        <button
          type="button"
          onClick={resetGridAnswers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/15 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 text-xs font-bold text-zinc-300 transition-all"
          title="Clear Solved Grid Answers"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
