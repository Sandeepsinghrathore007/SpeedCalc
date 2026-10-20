import React, { useState, useEffect, useRef } from 'react';
import { GridCell as IGridCell } from '../../../types';
import { useGameStore } from '../../../store/useGameStore';
import { getTableHint } from '../../../utils/formulas';
import { clsx } from 'clsx';

interface GridCellProps {
  r: number;
  c: number;
  cell: IGridCell;
  isActive: boolean;
  isRowActive: boolean;
  isColActive: boolean;
  operation: 'multiply' | 'add' | 'subtract';
  onFocus: () => void;
  onSubmit: (val: string) => boolean;
  onNavigate: (dRow: number, dCol: number) => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  r,
  c,
  cell,
  isActive,
  isRowActive,
  isColActive,
  operation,
  onFocus,
  onSubmit,
  onNavigate,
}) => {
  const [val, setVal] = useState(cell.userValue || '');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useGameStore();

  useEffect(() => {
    if (isActive && inputRef.current && !cell.solved) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isActive, cell.solved]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cell.solved) return;
    const nextVal = e.target.value.replace(/[^0-9]/g, '');
    setVal(nextVal);

    // Instant verification if length matches target
    const targetStr = cell.target.toString();
    if (nextVal.length >= targetStr.length) {
      const ok = onSubmit(nextVal);
      if (!ok) {
        setIsError(true);
        setTimeout(() => setIsError(false), 350);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate(-1, 0);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate(1, 0);
    } else if (e.key === 'ArrowLeft') {
      if (inputRef.current?.selectionStart === 0 || val === '') {
        e.preventDefault();
        onNavigate(0, -1);
      }
    } else if (e.key === 'ArrowRight') {
      if (inputRef.current?.selectionEnd === val.length || val === '') {
        e.preventDefault();
        onNavigate(0, 1);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (val.trim()) {
        const ok = onSubmit(val);
        if (!ok) {
          setIsError(true);
          setTimeout(() => setIsError(false), 350);
        }
      }
    } else if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      const hint = getTableHint(cell.rowVal, cell.colVal, operation);
      const opSign = operation === 'multiply' ? '×' : operation === 'add' ? '+' : '−';
      openModal('hint', {
        heading: `${cell.rowVal} ${opSign} ${cell.colVal}`,
        tag: hint.tag,
        formula: hint.formula,
        explanation: hint.explanation,
      });
    }
  };

  return (
    <div
      onClick={onFocus}
      className={clsx(
        'relative aspect-square flex items-center justify-center rounded-lg border transition-all duration-100 cursor-pointer select-none text-sm md:text-base font-mono font-bold',
        cell.solved
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 font-extrabold shadow-sm shadow-emerald-500/10'
          : isActive
          ? 'bg-emerald-950/20 border-emerald-400 ring-2 ring-emerald-400/40 text-white z-10'
          : isRowActive || isColActive
          ? 'bg-white/[0.04] border-white/[0.12] text-zinc-300'
          : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/[0.15] hover:bg-white/[0.03]',
        isError ? 'animate-shake bg-rose-950/60 border-rose-500 text-rose-300' : ''
      )}
    >
      {cell.solved ? (
        <span className="leading-none">{cell.target}</span>
      ) : (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={val}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          maxLength={5}
          className="w-full h-full text-center bg-transparent focus:outline-none text-white font-mono font-bold text-sm md:text-base caret-emerald-400"
        />
      )}

      {/* Tiny hesitation or error indicator */}
      {cell.errorCount > 0 && !cell.solved && (
        <span className="absolute top-0.5 right-1 text-[9px] font-mono font-bold text-rose-400">
          ×{cell.errorCount}
        </span>
      )}
    </div>
  );
};
