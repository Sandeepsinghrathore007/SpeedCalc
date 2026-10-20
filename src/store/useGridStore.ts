import { create } from 'zustand';
import { GridCell, OperationType, RangeMode, PracticeMode, ArithmeticMode } from '../types';
import { useGameStore } from './useGameStore';

interface GridState {
  operation: OperationType;
  rangeMode: RangeMode;
  practiceMode: PracticeMode;
  arithmeticMode: ArithmeticMode;
  
  rowHeaders: number[];
  colHeaders: number[];
  cells: Record<string, GridCell>;
  
  activeRow: number;
  activeCol: number;
  focusedKey: string;
  
  solvedCount: number;
  totalCells: number;
  
  // Guided Mode
  guidedQueue: string[];
  currentGuidedIndex: number;
  
  // Re-drill Mode
  redrillQueue: string[]; // cell keys with errors
  currentRedrillIndex: number;
  
  // Cell Timer
  currentCellStartTime: number;

  // Actions
  setOperation: (op: OperationType) => void;
  setRangeMode: (range: RangeMode) => void;
  setPracticeMode: (mode: PracticeMode) => void;
  setArithmeticMode: (mode: ArithmeticMode) => void;
  
  setActiveCell: (row: number, col: number) => void;
  moveActiveCell: (dRow: number, dCol: number) => void;
  
  submitCellValue: (key: string, val: string) => boolean;
  regenerateGrid: () => void;
  resetGridAnswers: () => void;
  
  // Guided & Redrill Nav
  advanceGuided: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateHeaders(op: OperationType, range: RangeMode): { rows: number[]; cols: number[] } {
  let rowPool: number[] = [];
  let colPool: number[] = [];

  if (op === 'subtract') {
    if (range === 'single') {
      rowPool = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      colPool = [2, 3, 4, 5, 6, 7, 8, 9, 3, 5];
    } else if (range === 'teens') {
      rowPool = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
      colPool = [11, 12, 13, 14, 15, 16, 17, 18, 19, 10];
    } else {
      rowPool = Array.from({ length: 20 }, (_, i) => i + 31);
      colPool = [4, 6, 7, 8, 9, 12, 14, 15, 18, 20];
    }
  } else if (range === 'teens') {
    rowPool = [11, 12, 13, 14, 15, 16, 17, 18, 19, 12];
    colPool = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  } else if (range === 'single') {
    rowPool = [2, 3, 4, 5, 6, 7, 8, 9, 3, 7];
    colPool = [2, 3, 4, 5, 6, 7, 8, 9, 6, 8];
  } else if (range === '1-20') {
    rowPool = Array.from({ length: 20 }, (_, i) => i + 1);
    colPool = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  } else {
    // 1-30
    rowPool = Array.from({ length: 20 }, (_, i) => i + 11);
    colPool = [2, 3, 4, 5, 6, 7, 8, 9, 12, 15];
  }

  const rows = shuffle(rowPool).slice(0, 10);
  const cols = shuffle(colPool).slice(0, 10);

  return { rows, cols };
}

function calculateTarget(rVal: number, cVal: number, op: OperationType): number {
  if (op === 'multiply') return rVal * cVal;
  if (op === 'add') return rVal + cVal;
  return rVal - cVal;
}

function buildGrid(rows: number[], cols: number[], op: OperationType): Record<string, GridCell> {
  const cells: Record<string, GridCell> = {};
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const rowVal = rows[r];
      const colVal = cols[c];
      const target = calculateTarget(rowVal, colVal, op);
      cells[`${r},${c}`] = {
        rowVal,
        colVal,
        target,
        solved: false,
        userValue: '',
        errorCount: 0,
        timeSpent: 0,
      };
    }
  }
  return cells;
}

const initialHeaders = generateHeaders('multiply', 'teens');
const initialCells = buildGrid(initialHeaders.rows, initialHeaders.cols, 'multiply');
const initialGuidedQueue = shuffle(Object.keys(initialCells));

export const useGridStore = create<GridState>((set, get) => ({
  operation: 'multiply',
  rangeMode: 'teens',
  practiceMode: 'free',
  arithmeticMode: 'grid',

  rowHeaders: initialHeaders.rows,
  colHeaders: initialHeaders.cols,
  cells: initialCells,

  activeRow: 0,
  activeCol: 0,
  focusedKey: '0,0',

  solvedCount: 0,
  totalCells: 100,

  guidedQueue: initialGuidedQueue,
  currentGuidedIndex: 0,

  redrillQueue: [],
  currentRedrillIndex: 0,

  currentCellStartTime: Date.now(),

  setOperation: (op) => {
    set({ operation: op });
    get().regenerateGrid();
  },

  setRangeMode: (range) => {
    set({ rangeMode: range });
    get().regenerateGrid();
  },

  setPracticeMode: (mode) => {
    set({ practiceMode: mode });
    if (mode === 'guided') {
      const q = shuffle(Object.keys(get().cells).filter((k) => !get().cells[k].solved));
      set({ guidedQueue: q, currentGuidedIndex: 0 });
      if (q.length > 0) {
        const [r, c] = q[0].split(',').map(Number);
        get().setActiveCell(r, c);
      }
    }
  },

  setArithmeticMode: (mode) => set({ arithmeticMode: mode }),

  setActiveCell: (row, col) => {
    const validRow = Math.max(0, Math.min(9, row));
    const validCol = Math.max(0, Math.min(9, col));
    const key = `${validRow},${validCol}`;
    set({
      activeRow: validRow,
      activeCol: validCol,
      focusedKey: key,
      currentCellStartTime: Date.now(),
    });
  },

  moveActiveCell: (dRow, dCol) => {
    const { activeRow, activeCol } = get();
    get().setActiveCell(activeRow + dRow, activeCol + dCol);
  },

  submitCellValue: (key, val) => {
    const state = get();
    const cell = state.cells[key];
    if (!cell || cell.solved) return false;

    const parsedNum = parseInt(val.trim(), 10);
    const now = Date.now();
    const timeSpent = Math.max(0.1, (now - state.currentCellStartTime) / 1000);
    const isCorrect = parsedNum === cell.target;

    const opSymbol = state.operation === 'multiply' ? '×' : state.operation === 'add' ? '+' : '−';
    const expr = `${cell.rowVal} ${opSymbol} ${cell.colVal}`;

    // Record in global game store for XP & Stats
    useGameStore.getState().recordAttempt(isCorrect, timeSpent, {
      expression: expr,
      userValue: val,
      correctValue: cell.target.toString(),
      timeSpent,
      errorCount: cell.errorCount + (isCorrect ? 0 : 1),
      module: 'tables',
    });

    if (isCorrect) {
      const updatedCells = {
        ...state.cells,
        [key]: {
          ...cell,
          solved: true,
          userValue: val,
          timeSpent,
        },
      };

      const newSolved = state.solvedCount + 1;
      set({
        cells: updatedCells,
        solvedCount: newSolved,
      });

      if (state.practiceMode === 'guided') {
        get().advanceGuided();
      } else {
        // Auto advance to next unsolved in row or column
        const [r, c] = key.split(',').map(Number);
        let nextKey: string | null = null;
        for (let nextC = c + 1; nextC < 10; nextC++) {
          if (!updatedCells[`${r},${nextC}`].solved) {
            nextKey = `${r},${nextC}`;
            break;
          }
        }
        if (!nextKey) {
          for (let nextR = r + 1; nextR < 10; nextR++) {
            for (let nextC = 0; nextC < 10; nextC++) {
              if (!updatedCells[`${nextR},${nextC}`].solved) {
                nextKey = `${nextR},${nextC}`;
                break;
              }
            }
            if (nextKey) break;
          }
        }
        if (nextKey) {
          const [nr, nc] = nextKey.split(',').map(Number);
          get().setActiveCell(nr, nc);
        }
      }

      // Check if complete 100
      if (newSolved >= 100) {
        useGameStore.getState().openModal('audit');
      }

      return true;
    } else {
      // Incorrect attempt
      set({
        cells: {
          ...state.cells,
          [key]: {
            ...cell,
            errorCount: cell.errorCount + 1,
            timeSpent: cell.timeSpent + timeSpent,
          },
        },
        currentCellStartTime: Date.now(),
      });
      return false;
    }
  },

  advanceGuided: () => {
    const { guidedQueue, currentGuidedIndex, cells } = get();
    let nextIdx = currentGuidedIndex + 1;
    while (nextIdx < guidedQueue.length && cells[guidedQueue[nextIdx]]?.solved) {
      nextIdx++;
    }

    if (nextIdx < guidedQueue.length) {
      set({ currentGuidedIndex: nextIdx });
      const [r, c] = guidedQueue[nextIdx].split(',').map(Number);
      get().setActiveCell(r, c);
    } else {
      // All guided done
      useGameStore.getState().openModal('audit');
    }
  },

  regenerateGrid: () => {
    const { operation, rangeMode, practiceMode } = get();
    const headers = generateHeaders(operation, rangeMode);
    const newCells = buildGrid(headers.rows, headers.cols, operation);
    const newQueue = shuffle(Object.keys(newCells));

    set({
      rowHeaders: headers.rows,
      colHeaders: headers.cols,
      cells: newCells,
      solvedCount: 0,
      guidedQueue: newQueue,
      currentGuidedIndex: 0,
      activeRow: 0,
      activeCol: 0,
      focusedKey: '0,0',
      currentCellStartTime: Date.now(),
    });

    if (practiceMode === 'guided' && newQueue.length > 0) {
      const [r, c] = newQueue[0].split(',').map(Number);
      get().setActiveCell(r, c);
    }
  },

  resetGridAnswers: () => {
    const { cells } = get();
    const cleared: Record<string, GridCell> = {};
    for (const k in cells) {
      cleared[k] = {
        ...cells[k],
        solved: false,
        userValue: '',
        errorCount: 0,
        timeSpent: 0,
      };
    }
    set({
      cells: cleared,
      solvedCount: 0,
      currentGuidedIndex: 0,
      currentCellStartTime: Date.now(),
    });
  },
}));
