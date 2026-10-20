export type ModuleTab =
  | 'multiplication'
  | 'addition'
  | 'subtraction'
  | 'tables'
  | 'squares'
  | 'cubes'
  | 'fractions'
  | 'primes'
  | 'reasoning';

export type OperationType = 'multiply' | 'add' | 'subtract';

export type ArithmeticMode = 'grid' | 'flashcard';

export type RangeMode = 'teens' | 'single' | '1-20' | '1-30';

export type PracticeMode = 'free' | 'guided';

export interface GridCell {
  rowVal: number;
  colVal: number;
  target: number;
  solved: boolean;
  userValue?: string;
  errorCount: number;
  timeSpent: number; // in seconds
  firstFocusedTime?: number;
}

export interface WeakSpotRecord {
  id: string;
  expression: string;
  userValue: string;
  correctValue: string;
  timeSpent: number;
  errorCount: number;
  timestamp: number;
  module: ModuleTab;
}

export interface PlayerRank {
  title: string;
  level: number;
  minXP: number;
  maxXP: number;
}

export interface DrillQuestion {
  prompt: string;
  subtext: string;
  targetVal: string;
  hintTag?: string;
  hintFormula?: string;
  hintExplanation?: string;
  meta?: any;
}
