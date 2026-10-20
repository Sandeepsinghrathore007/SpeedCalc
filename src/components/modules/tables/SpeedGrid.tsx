import React from 'react';
import { useGridStore } from '../../../store/useGridStore';
import { GridCell } from './GridCell';
import { GuidedBanner } from './GuidedBanner';
import { clsx } from 'clsx';

export const SpeedGrid: React.FC = () => {
  const {
    rowHeaders,
    colHeaders,
    cells,
    activeRow,
    activeCol,
    operation,
    setActiveCell,
    moveActiveCell,
    submitCellValue,
  } = useGridStore();

  const opSign = operation === 'multiply' ? '×' : operation === 'add' ? '+' : '−';

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      {/* Target Guided Pill: Placed directly above the grid with a clean margin */}
      <GuidedBanner />

      <div className="w-full max-w-2xl md:max-w-3xl xl:max-w-4xl p-3 sm:p-4 rounded-2xl bg-[#0b100d]/90 border border-white/[0.08] backdrop-blur-xl shadow-none">
        {/* The 11x11 Grid Matrix (1 header col + 10 data cols, 1 header row + 10 data rows) */}
        <div className="grid grid-cols-11 gap-1.5 md:gap-2">
          {/* Top-Left Corner: Operation Symbol */}
          <div className="aspect-square flex items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm sm:text-base md:text-lg shadow-inner shadow-emerald-500/10">
            {opSign}
          </div>

          {/* Top Row: Column Multipliers (0 to 9) */}
          {colHeaders.map((colVal, c) => {
            const isColActive = c === activeCol;
            return (
              <div
                key={`col-${c}`}
                className={clsx(
                  'aspect-square flex items-center justify-center rounded-lg border font-mono font-extrabold text-xs sm:text-sm md:text-base transition-colors duration-150',
                  isColActive
                    ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
                )}
              >
                {colVal}
              </div>
            );
          })}

          {/* Matrix Rows (0 to 9) */}
          {rowHeaders.map((rowVal, r) => {
            const isRowActive = r === activeRow;
            return (
              <React.Fragment key={`row-${r}`}>
                {/* Left Row Header */}
                <div
                  className={clsx(
                    'aspect-square flex items-center justify-center rounded-lg border font-mono font-extrabold text-xs sm:text-sm md:text-base transition-colors duration-150',
                    isRowActive
                      ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 ring-1 ring-emerald-400/30'
                      : 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
                  )}
                >
                  {rowVal}
                </div>

                {/* 10 Cells for this row */}
                {colHeaders.map((_, c) => {
                  const key = `${r},${c}`;
                  const cell = cells[key];
                  const isActive = r === activeRow && c === activeCol;

                  return (
                    <GridCell
                      key={key}
                      r={r}
                      c={c}
                      cell={cell}
                      isActive={isActive}
                      isRowActive={isRowActive}
                      isColActive={c === activeCol}
                      operation={operation}
                      onFocus={() => setActiveCell(r, c)}
                      onSubmit={(val) => submitCellValue(key, val)}
                      onNavigate={(dRow, dCol) => moveActiveCell(dRow, dCol)}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
