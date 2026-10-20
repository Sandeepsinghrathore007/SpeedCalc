import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Target, X, CheckCircle2 } from 'lucide-react';

export const RedrillModal: React.FC = () => {
  const { activeModal, closeModal, errorLog, recordAttempt } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isError, setIsError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeModal === 'redrill') {
      setCurrentIndex(0);
      setInputVal('');
      setCompleted(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeModal]);

  if (activeModal !== 'redrill') return null;

  const currentItem = errorLog[currentIndex];

  const handleSubmit = (val: string) => {
    if (!currentItem) return;
    const clean = val.trim();
    if (!clean) return;

    const isCorrect = clean.toUpperCase() === currentItem.correctValue.toUpperCase();

    recordAttempt(isCorrect, 1.5);

    if (isCorrect) {
      if (currentIndex + 1 < errorLog.length) {
        setCurrentIndex((prev) => prev + 1);
        setInputVal('');
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setCompleted(true);
      }
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 350);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(inputVal);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputVal(nextVal);
    if (currentItem && nextVal.trim().toUpperCase() === currentItem.correctValue.toUpperCase()) {
      handleSubmit(nextVal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#0c1310] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <span>Targeted Blitz Re-Drill</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completed ? (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">100% Mastery Achieved!</h3>
            <p className="text-xs text-zinc-400 max-w-xs">
              You have successfully corrected all identified weak spots from this session.
            </p>
            <button
              onClick={closeModal}
              className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm active:scale-95 transition-all shadow-none"
            >
              Done & Return
            </button>
          </div>
        ) : currentItem ? (
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-between w-full text-xs font-mono text-zinc-500">
              <span>Mistake #{currentIndex + 1}</span>
              <span>
                {currentIndex + 1} of {errorLog.length}
              </span>
            </div>

            {/* Prompt Box */}
            <div className="w-full py-8 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
              <span className="text-3xl md:text-4xl font-black font-mono text-white">
                {currentItem.expression} = ?
              </span>
            </div>

            {/* Answer Input */}
            <div className="flex items-center gap-3 w-full">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Answer"
                className={`w-full py-3 px-4 text-center text-2xl font-mono font-black bg-white/[0.06] border rounded-xl text-white placeholder-zinc-600 focus:outline-none transition-all ${
                  isError
                    ? 'animate-shake border-rose-500 bg-rose-950/40 text-rose-300'
                    : 'border-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                }`}
              />
              <button
                type="button"
                onClick={() => handleSubmit(inputVal)}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm active:scale-95 transition-all shadow-none"
              >
                Submit
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
