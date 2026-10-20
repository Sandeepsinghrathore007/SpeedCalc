import React from 'react';
import { Delete, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useGridStore } from '../../store/useGridStore';
import { getTableHint } from '../../utils/formulas';
import { audioEngine } from '../../utils/audioEngine';

export const MobileNumpad: React.FC = () => {
  const { activeTab, openModal } = useGameStore();
  const { activeRow, activeCol, cells, operation, submitCellValue } = useGridStore();

  const handleKey = (digit: string) => {
    audioEngine.playKeyClick();
    // Dispatch a synthetic keyboard event or update focused input
    const activeEl = document.activeElement as HTMLInputElement;
    if (activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName)) {
      const start = activeEl.selectionStart || 0;
      const end = activeEl.selectionEnd || 0;
      const current = activeEl.value;
      const next = current.substring(0, start) + digit + current.substring(end);
      activeEl.value = next;
      // Dispatch input event so React state syncs
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      activeEl.setSelectionRange(start + digit.length, start + digit.length);
    }
  };

  const handleBackspace = () => {
    audioEngine.playKeyClick();
    const activeEl = document.activeElement as HTMLInputElement;
    if (activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName)) {
      const start = activeEl.selectionStart || 0;
      const end = activeEl.selectionEnd || 0;
      const current = activeEl.value;
      if (start > 0 || start !== end) {
        const from = start === end ? start - 1 : start;
        const next = current.substring(0, from) + current.substring(end);
        activeEl.value = next;
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        activeEl.setSelectionRange(from, from);
      }
    }
  };

  const handleHint = () => {
    if (activeTab === 'tables') {
      const key = `${activeRow},${activeCol}`;
      const cell = cells[key];
      if (cell) {
        const hint = getTableHint(cell.rowVal, cell.colVal, operation);
        const opSign = operation === 'multiply' ? '×' : operation === 'add' ? '+' : '−';
        openModal('hint', {
          heading: `${cell.rowVal} ${opSign} ${cell.colVal}`,
          tag: hint.tag,
          formula: hint.formula,
          explanation: hint.explanation,
        });
      }
    }
  };

  return (
    <div className="lg:hidden sticky bottom-0 left-0 right-0 z-30 p-2 bg-[#080d0a]/95 backdrop-blur-xl border-t border-white/[0.08]">
      <div className="grid grid-cols-6 gap-1.5 max-w-md mx-auto">
        {['1', '2', '3', '4', '5'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleKey(d)}
            className="h-11 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] active:bg-emerald-500/30 text-white font-mono font-bold text-lg flex items-center justify-center transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={handleHint}
          className="h-11 rounded-lg bg-amber-500/15 text-amber-400 font-bold text-xs flex items-center justify-center gap-1"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Hint</span>
        </button>

        {['6', '7', '8', '9', '0'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleKey(d)}
            className="h-11 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] active:bg-emerald-500/30 text-white font-mono font-bold text-lg flex items-center justify-center transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={handleBackspace}
          className="h-11 rounded-lg bg-rose-500/15 text-rose-400 font-bold text-sm flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
