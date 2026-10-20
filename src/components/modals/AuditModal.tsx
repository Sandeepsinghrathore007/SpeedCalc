import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useGridStore } from '../../store/useGridStore';
import { BarChart3, X, Copy, Check, RotateCw, Flame } from 'lucide-react';

export const AuditModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    openModal,
    totalAttempts,
    totalErrors,
    responseTimes,
    errorLog,
    streak,
    bestStreak,
    timerElapsed,
    xp,
  } = useGameStore();

  const { solvedCount, totalCells, regenerateGrid } = useGridStore();
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'audit') return null;

  const mins = Math.floor(timerElapsed / 60);
  const secs = timerElapsed % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const accuracy =
    totalAttempts === 0
      ? 100
      : Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100);

  const avgSpeed =
    responseTimes.length === 0
      ? 0
      : responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

  const handleCopy = () => {
    if (errorLog.length === 0) {
      navigator.clipboard.writeText('SpeedMath Pro Session: Perfect 100% accuracy with zero mistakes!');
    } else {
      const text = [
        '=== SpeedMath Pro Error Audit ===',
        `Accuracy: ${accuracy}% | Avg Speed: ${avgSpeed.toFixed(1)}s`,
        'Mistakes & Bottlenecks:',
        ...errorLog.map(
          (e, idx) =>
            `${idx + 1}. ${e.expression} = ${e.correctValue} (You answered: ${e.userValue || 'Skipped'}, Time: ${e.timeSpent.toFixed(1)}s)`
        ),
      ].join('\n');
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    closeModal();
    regenerateGrid();
  };

  const handleStartRedrill = () => {
    if (errorLog.length === 0) {
      alert('Great job! No mistakes were recorded this session.');
      return;
    }
    openModal('redrill');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-[#0c1310] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base md:text-lg">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span>Session Performance & Bottleneck Audit</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Total Time</span>
            <span className="text-xl font-black font-mono text-white mt-1">{formattedTime}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Completion</span>
            <span className="text-xl font-black font-mono text-emerald-400 mt-1">
              {solvedCount} / {totalCells}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Overall Accuracy</span>
            <span
              className={`text-xl font-black font-mono mt-1 ${
                accuracy >= 90
                  ? 'text-emerald-400'
                  : accuracy >= 70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {accuracy}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Avg Recall Speed</span>
            <span className="text-xl font-black font-mono text-white mt-1">
              {avgSpeed > 0 ? avgSpeed.toFixed(1) : '0.0'}s
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Total XP</span>
            <span className="text-xl font-black font-mono text-amber-400 mt-1">+{xp} XP</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Peak Streak</span>
            <span className="text-xl font-black font-mono text-rose-400 mt-1 flex items-center gap-1">
              {bestStreak || streak}
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
            </span>
          </div>
        </div>

        {/* Weak spots table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs md:text-sm font-bold text-zinc-300">
              Weak-Spot Heatmap (Mistakes & Hesitations)
            </h4>
            <span className="text-[11px] font-semibold text-zinc-500 font-mono">
              {errorLog.length} items logged
            </span>
          </div>

          <div className="w-full max-h-48 overflow-y-auto rounded-xl border border-white/[0.08] bg-black/40">
            {errorLog.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                🎉 Flawless session! Zero errors were registered in this drill.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.04] text-zinc-400 border-b border-white/[0.06] sticky top-0">
                  <tr>
                    <th className="p-2.5">Question</th>
                    <th className="p-2.5">Correct</th>
                    <th className="p-2.5">Your Answer</th>
                    <th className="p-2.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {errorLog.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="p-2.5 text-zinc-200 font-bold">{item.expression}</td>
                      <td className="p-2.5 text-emerald-400 font-bold">{item.correctValue}</td>
                      <td className="p-2.5 text-rose-400">{item.userValue || '—'}</td>
                      <td className="p-2.5 text-zinc-400">{item.timeSpent.toFixed(1)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Error Notes'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-zinc-200 hover:text-white transition-all"
            >
              <RotateCw className="w-4 h-4" />
              <span>Restart Matrix</span>
            </button>

            {errorLog.length > 0 && (
              <button
                onClick={handleStartRedrill}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs active:scale-95 transition-all shadow-none"
              >
                <span>Re-drill Mistakes Only</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
