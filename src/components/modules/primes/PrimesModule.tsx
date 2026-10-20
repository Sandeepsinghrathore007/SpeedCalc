import React, { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { SegmentedControl } from '../../common/SegmentedControl';
import { useGameStore } from '../../../store/useGameStore';
import { Lightbulb, FastForward, Shield, Puzzle, CheckCircle, XCircle } from 'lucide-react';

type PrimeMode = 'primes' | 'divisibility';

const PRIMES_SET = new Set([
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
]);

export const PrimesModule: React.FC = () => {
  const [mode, setMode] = useState<PrimeMode>('primes');
  const [question, setQuestion] = useState<{
    prompt: string;
    subtext: string;
    correctAnswer: string;
    hintTag: string;
    hintFormula: string;
    hintExplanation: string;
  } | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState('0.0s');
  const { recordAttempt } = useGameStore();

  const nextQuestion = useCallback(() => {
    if (mode === 'primes') {
      // Pick random number 11 to 99
      const n = Math.floor(Math.random() * 88) + 11;
      const isPrime = PRIMES_SET.has(n);
      setQuestion({
        prompt: n.toString(),
        subtext: 'Is this number Prime or Composite?',
        correctAnswer: isPrime ? 'PRIME' : 'COMPOSITE',
        hintTag: isPrime ? 'Prime Number' : 'Composite Number',
        hintFormula: isPrime
          ? `${n} has only two factors: 1 and ${n}.`
          : `${n} is divisible by smaller primes (check 2, 3, 5, 7).`,
        hintExplanation:
          'Prime numbers cannot be divided evenly except by 1 and itself. Check square root bounds (√N).',
      });
    } else {
      // Divisibility drill: Divisors {3, 4, 7, 8, 9, 11}
      const divisors = [3, 4, 7, 8, 9, 11];
      const div = divisors[Math.floor(Math.random() * divisors.length)];
      const isDivisible = Math.random() > 0.5;
      let n = 0;
      if (isDivisible) {
        const mult = Math.floor(Math.random() * 80) + 12;
        n = mult * div;
      } else {
        const mult = Math.floor(Math.random() * 80) + 12;
        n = mult * div + (Math.floor(Math.random() * (div - 1)) + 1);
      }

      let rule = '';
      if (div === 3) rule = 'Sum of digits must be divisible by 3.';
      else if (div === 4) rule = 'Last two digits must be divisible by 4.';
      else if (div === 9) rule = 'Sum of digits must be divisible by 9.';
      else if (div === 11) rule = 'Alternating sum of digits difference must be 0 or multiple of 11.';
      else if (div === 8) rule = 'Last 3 digits must be divisible by 8.';
      else rule = 'Double the last digit and subtract from the rest.';

      setQuestion({
        prompt: `Is ${n} divisible by ${div}?`,
        subtext: `Rapid Divisibility Test for ${div}`,
        correctAnswer: n % div === 0 ? 'YES' : 'NO',
        hintTag: `Divisibility by ${div} Rule`,
        hintFormula: `${n} ÷ ${div} = ${(n / div).toFixed(2)}`,
        hintExplanation: rule,
      });
    }

    setShowHint(false);
    setStartTime(Date.now());
  }, [mode]);

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

  const handleChoice = (choice: string) => {
    if (!question) return;
    const timeSpent = Math.max(0.1, (Date.now() - startTime) / 1000);
    const isCorrect = choice === question.correctAnswer;

    recordAttempt(isCorrect, timeSpent, {
      expression: question.prompt,
      userValue: choice,
      correctValue: question.correctAnswer,
      timeSpent,
      errorCount: isCorrect ? 0 : 1,
      module: 'primes',
    });

    nextQuestion();
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Don't intercept if user is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const k = e.key.toUpperCase();
      if (mode === 'primes') {
        if (k === 'P' || k === '1') handleChoice('PRIME');
        else if (k === 'C' || k === '2') handleChoice('COMPOSITE');
      } else {
        if (k === 'Y' || k === '1') handleChoice('YES');
        else if (k === 'N' || k === '2') handleChoice('NO');
      }

      if (k === 'H') {
        e.preventDefault();
        setShowHint((p) => !p);
      } else if (e.code === 'Space') {
        e.preventDefault();
        nextQuestion();
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [mode, question, handleChoice, nextQuestion]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 p-4">
      <GlassCard className="w-full p-6 md:p-8 flex flex-col items-center gap-6">
        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <SegmentedControl<PrimeMode>
            size="sm"
            value={mode}
            onChange={setMode}
            options={[
              { label: 'Primes 1-100', value: 'primes' },
              { label: 'Divisibility Tests', value: 'divisibility' },
            ]}
          />
          <span className="text-xs font-bold text-zinc-400">Keys: [1 / 2]</span>
        </div>

        {/* Prompt Box */}
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

        {/* Rapid Choice Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {mode === 'primes' ? (
            <>
              <button
                type="button"
                onClick={() => handleChoice('PRIME')}
                className="py-4 px-6 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
              >
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Prime [P / 1]</span>
              </button>

              <button
                type="button"
                onClick={() => handleChoice('COMPOSITE')}
                className="py-4 px-6 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-amber-500/10"
              >
                <Puzzle className="w-5 h-5 text-amber-400" />
                <span>Composite [C / 2]</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleChoice('YES')}
                className="py-4 px-6 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Yes [Y / 1]</span>
              </button>

              <button
                type="button"
                onClick={() => handleChoice('NO')}
                className="py-4 px-6 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-rose-500/10"
              >
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>No [N / 2]</span>
              </button>
            </>
          )}
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
            <p className="text-xs text-zinc-300 leading-relaxed">{question.hintExplanation}</p>
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
            <span>Rule [H]</span>
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
