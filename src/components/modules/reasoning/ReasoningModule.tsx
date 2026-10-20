import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { SegmentedControl } from '../../common/SegmentedControl';
import { useGameStore } from '../../../store/useGameStore';
import { OPPOSITE_PAIRS } from '../../../utils/formulas';
import { Lightbulb, FastForward, CheckCircle2 } from 'lucide-react';

type ReasoningMode = 'forward' | 'opposite' | 'reverse';

export const ReasoningModule: React.FC = () => {
  const [mode, setMode] = useState<ReasoningMode>('forward');
  const [question, setQuestion] = useState<{
    prompt: string;
    subtext: string;
    targetVal: string;
    char: string;
    rank: number;
    opp: string;
  } | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState('0.0s');
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { recordAttempt } = useGameStore();

  const nextQuestion = useCallback(() => {
    // pick letter A-Z
    const code = Math.floor(Math.random() * 26) + 65;
    const char = String.fromCharCode(code);
    const rank = code - 64;
    const opp = OPPOSITE_PAIRS[char] || 'Z';

    if (mode === 'forward') {
      setQuestion({
        prompt: `${char} = ?`,
        subtext: 'Type the forward alphabet rank (1-26)',
        targetVal: rank.toString(),
        char,
        rank,
        opp,
      });
    } else if (mode === 'opposite') {
      setQuestion({
        prompt: `${char} ⇄ ?`,
        subtext: 'Type the opposite alphabet letter (Sum = 27)',
        targetVal: opp,
        char,
        rank,
        opp,
      });
    } else {
      // reverse
      const rev = 27 - rank;
      setQuestion({
        prompt: `${char} (Reverse) = ?`,
        subtext: 'Type the reverse alphabet rank (27 − N)',
        targetVal: rev.toString(),
        char,
        rank,
        opp,
      });
    }

    setInputVal('');
    setShowHint(false);
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 50);
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

  const handleSubmit = (valToTest: string) => {
    if (!question) return;
    const clean = valToTest.trim().toUpperCase();
    if (!clean) return;

    const timeSpent = Math.max(0.1, (Date.now() - startTime) / 1000);
    const isCorrect = clean === question.targetVal.toUpperCase();

    recordAttempt(isCorrect, timeSpent, {
      expression: question.prompt,
      userValue: clean,
      correctValue: question.targetVal,
      timeSpent,
      errorCount: isCorrect ? 0 : 1,
      module: 'reasoning',
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
    const nextVal = e.target.value.toUpperCase();
    setInputVal(nextVal);
    if (question && nextVal === question.targetVal.toUpperCase()) {
      handleSubmit(nextVal);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 p-4">
      <GlassCard className="w-full p-6 md:p-8 flex flex-col items-center gap-6">
        {/* Top bar controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <SegmentedControl<ReasoningMode>
            size="sm"
            value={mode}
            onChange={setMode}
            options={[
              { label: 'Forward (P→16)', value: 'forward' },
              { label: 'Opposites (H⇄S)', value: 'opposite' },
              { label: 'Reverse (27−N)', value: 'reverse' },
            ]}
          />

          <span className="text-xs font-bold text-zinc-400">EJOTY: 5, 10, 15, 20, 25</span>
        </div>

        {/* Prompt Equation Box */}
        {question && (
          <div className="w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] relative">
            <span className="text-4xl md:text-6xl font-black font-mono tracking-tight text-white mb-2">
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
            value={inputVal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'opposite' ? 'Letter' : 'Rank'}
            maxLength={3}
            className={`w-full py-3 px-4 text-center text-2xl font-mono font-black bg-white/[0.06] border rounded-xl text-white placeholder-zinc-600 focus:outline-none transition-all uppercase ${
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
                💡 EJOTY Mnemonic & Reverse Law
              </span>
              <span className="text-[10px] text-zinc-400">Shortcut (H)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 font-mono text-xs md:text-sm font-bold text-amber-300">
              E=5, J=10, O=15, T=20, Y=25 | {question.char} is #{question.rank} | Opposite is{' '}
              {question.opp}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Remember: Forward Rank + Reverse Rank = 27. Opposite pairs sum to 27!
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
            <span>EJOTY Trick [H]</span>
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
