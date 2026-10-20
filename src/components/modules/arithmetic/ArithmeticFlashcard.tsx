import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { SegmentedControl } from '../../common/SegmentedControl';
import { useGameStore } from '../../../store/useGameStore';
import { getTableHint } from '../../../utils/formulas';
import { Lightbulb, FastForward, CheckCircle2 } from 'lucide-react';
import { OperationType, ArithmeticMode } from '../../../types';
import { useGridStore } from '../../../store/useGridStore';

interface ArithmeticFlashcardProps {
  operation: OperationType;
}

export const ArithmeticFlashcard: React.FC<ArithmeticFlashcardProps> = ({ operation }) => {
  const { arithmeticMode, setArithmeticMode } = useGridStore();
  const [range, setRange] = useState<string>('teens');
  const [question, setQuestion] = useState<{
    prompt: string;
    subtext: string;
    targetVal: string;
    num1: number;
    num2: number;
    hintTag: string;
    hintFormula: string;
    hintExplanation: string;
  } | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState('0.0s');
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { recordAttempt } = useGameStore();

  const opSign = operation === 'multiply' ? '×' : operation === 'add' ? '+' : '−';

  const nextQuestion = useCallback(() => {
    let n1 = 0;
    let n2 = 0;

    if (operation === 'multiply') {
      if (range === 'single') {
        n1 = Math.floor(Math.random() * 8) + 2;
        n2 = Math.floor(Math.random() * 8) + 2;
      } else if (range === 'teens') {
        n1 = Math.floor(Math.random() * 9) + 11;
        n2 = Math.floor(Math.random() * 8) + 2;
      } else {
        // 1-30
        n1 = Math.floor(Math.random() * 20) + 11;
        n2 = Math.floor(Math.random() * 11) + 2;
      }
    } else if (operation === 'add') {
      if (range === 'single') {
        n1 = Math.floor(Math.random() * 8) + 2;
        n2 = Math.floor(Math.random() * 8) + 2;
      } else if (range === 'teens') {
        n1 = Math.floor(Math.random() * 9) + 11;
        n2 = Math.floor(Math.random() * 9) + 11;
      } else {
        // 2-digit (11-99)
        n1 = Math.floor(Math.random() * 70) + 15;
        n2 = Math.floor(Math.random() * 70) + 15;
      }
    } else {
      // subtraction (ensure n1 > n2)
      if (range === 'single') {
        n2 = Math.floor(Math.random() * 8) + 2;
        n1 = n2 + Math.floor(Math.random() * 9) + 2;
      } else if (range === 'teens') {
        n2 = Math.floor(Math.random() * 9) + 11;
        n1 = n2 + Math.floor(Math.random() * 15) + 3;
      } else {
        // 2-digit
        n2 = Math.floor(Math.random() * 50) + 15;
        n1 = n2 + Math.floor(Math.random() * 45) + 10;
      }
    }

    let target = 0;
    if (operation === 'multiply') target = n1 * n2;
    else if (operation === 'add') target = n1 + n2;
    else target = n1 - n2;

    const hint = getTableHint(n1, n2, operation);

    let subtext = '';
    if (operation === 'multiply') subtext = 'Tens split & merge or base expansion';
    else if (operation === 'add') subtext = 'Round base jump or left-to-right addition';
    else subtext = '10-complement subtraction or round base drop';

    setQuestion({
      prompt: `${n1} ${opSign} ${n2} = ?`,
      subtext,
      targetVal: target.toString(),
      num1: n1,
      num2: n2,
      hintTag: hint.tag,
      hintFormula: hint.formula,
      hintExplanation: hint.explanation,
    });

    setInputVal('');
    setShowHint(false);
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [operation, range, opSign]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sec = Math.max(0, (Date.now() - startTime) / 1000);
      setElapsed(`${sec.toFixed(1)}s`);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleSubmit = (valToTest: string) => {
    if (!question) return;
    const clean = valToTest.trim();
    if (!clean) return;

    const timeSpent = Math.max(0.1, (Date.now() - startTime) / 1000);
    const isCorrect = clean === question.targetVal;

    recordAttempt(isCorrect, timeSpent, {
      expression: question.prompt,
      userValue: clean,
      correctValue: question.targetVal,
      timeSpent,
      errorCount: isCorrect ? 0 : 1,
      module: operation === 'multiply' ? 'multiplication' : operation === 'add' ? 'addition' : 'subtraction',
    });

    if (isCorrect) {
      nextQuestion();
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 350);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(inputVal);
    } else if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      setShowHint((prev) => !prev);
    } else if (e.code === 'Space') {
      e.preventDefault();
      nextQuestion();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value.replace(/[^0-9]/g, '');
    setInputVal(nextVal);
    if (question && nextVal === question.targetVal) {
      handleSubmit(nextVal);
    }
  };

  const rangeOptions =
    operation === 'multiply'
      ? [
          { label: 'Single (2-9)', value: 'single' },
          { label: 'Teens (11-19)', value: 'teens' },
          { label: '1 to 30', value: '1-30' },
        ]
      : operation === 'add'
      ? [
          { label: 'Single (2-9)', value: 'single' },
          { label: 'Teens (11-19)', value: 'teens' },
          { label: '2-Digit (11-99)', value: '2-digit' },
        ]
      : [
          { label: 'Under 20', value: 'single' },
          { label: 'Teens Jump', value: 'teens' },
          { label: '2-Digit (11-99)', value: '2-digit' },
        ];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 p-4">
      <GlassCard className="w-full p-6 md:p-8 flex flex-col items-center gap-6">
        {/* Top bar mode & range controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <SegmentedControl
            size="sm"
            value={range}
            onChange={setRange}
            options={rangeOptions}
          />

          <SegmentedControl<ArithmeticMode>
            size="sm"
            value={arithmeticMode}
            onChange={setArithmeticMode}
            options={[
              { label: '10×10 Grid', value: 'grid' },
              { label: 'Flashcard Drill', value: 'flashcard' },
            ]}
          />
        </div>

        {/* Prompt Equation Box */}
        {question && (
          <div className="w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] relative">
            <span className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white mb-2">
              {question.prompt}
            </span>
            <span className="text-xs font-semibold text-zinc-400">{question.subtext}</span>
            <span className="absolute top-3 right-4 font-mono text-xs font-bold text-zinc-500 bg-white/[0.06] px-2 py-0.5 rounded">
              {elapsed}
            </span>
          </div>
        )}

        {/* Answer Input Row */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputVal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Answer"
            maxLength={6}
            className={`w-full py-3 px-4 text-center text-2xl font-mono font-black bg-white/[0.06] border rounded-xl text-white placeholder-zinc-600 focus:outline-none transition-all ${
              isError
                ? 'animate-shake border-rose-500 bg-rose-950/40 text-rose-300'
                : 'border-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
            }`}
          />
          <button
            type="button"
            onClick={() => handleSubmit(inputVal)}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center gap-1.5 active:scale-95 transition-all shadow-none"
          >
            <span>Submit</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Hint Box */}
        {showHint && question && (
          <div className="w-full p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-left flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                💡 {question.hintTag}
              </span>
              <span className="text-[10px] text-zinc-400">Shortcut (H)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 font-mono text-xs md:text-sm font-bold text-amber-300">
              {question.hintFormula}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {question.hintExplanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Mental Trick [H]</span>
          </button>

          <button
            type="button"
            onClick={nextQuestion}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all"
          >
            <FastForward className="w-4 h-4 text-zinc-400" />
            <span>Skip [Space]</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
