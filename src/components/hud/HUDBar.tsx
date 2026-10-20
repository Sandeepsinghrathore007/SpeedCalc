import React, { useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Target,
  Zap,
  Flame,
  Play,
  Pause,
} from 'lucide-react';
import { useGameStore, getPlayerRank } from '../../store/useGameStore';
import { useGridStore } from '../../store/useGridStore';
import { GlassCard } from '../common/GlassCard';

export const HUDBar: React.FC = () => {
  const {
    timerDuration,
    timerRemaining,
    timerElapsed,
    isTimerRunning,
    startTimer,
    pauseTimer,
    setTimerDuration,
    tickTimer,
    totalAttempts,
    totalErrors,
    responseTimes,
    xp,
    streak,
  } = useGameStore();

  const { solvedCount, totalCells } = useGridStore();

  // Setup interval ticker for session timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, tickTimer]);

  // Format time MM:SS
  const displaySeconds = timerDuration === 0 ? timerElapsed : timerRemaining;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Accuracy calculation
  const accuracy =
    totalAttempts === 0
      ? 100
      : Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100);

  // Average response time
  const avgSpeed =
    responseTimes.length === 0
      ? 0
      : responseTimes.reduce((acc, t) => acc + t, 0) / responseTimes.length;

  const rankInfo = getPlayerRank(xp);

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 md:p-6 pb-2">
      {/* 1. Timer Card */}
      <GlassCard className="p-3.5 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Session Time
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => (isTimerRunning ? pauseTimer() : startTimer())}
              className="p-1 rounded-md hover:bg-white/[0.08] text-emerald-400"
              title={isTimerRunning ? 'Pause Session' : 'Start Session'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-black font-mono tracking-tight text-white">
            {formattedTime}
          </span>
          <select
            value={timerDuration}
            onChange={(e) => setTimerDuration(Number(e.target.value))}
            className="text-[10px] font-semibold bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="180">3 Min</option>
            <option value="300">5 Min</option>
            <option value="600">10 Min</option>
            <option value="0">Stopwatch</option>
          </select>
        </div>

        <span className="text-[10px] text-zinc-500 font-medium">
          {timerDuration === 0 ? 'Stopwatch Elapsed' : 'Countdown Remaining'}
        </span>
      </GlassCard>

      {/* 2. Solved Progress */}
      <GlassCard glow="emerald" className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Grid Solved
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
          <span className="text-xl md:text-2xl font-black text-emerald-400">
            {solvedCount}
          </span>
          <span className="text-xs text-zinc-500 font-semibold">/ {totalCells}</span>
        </div>

        <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (solvedCount / totalCells) * 100)}%` }}
          />
        </div>
      </GlassCard>

      {/* 3. Accuracy Metric */}
      <GlassCard
        glow={accuracy >= 90 ? 'emerald' : accuracy >= 70 ? 'amber' : 'coral'}
        className="p-3.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Accuracy
          </span>
          <Target className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <div className="my-1.5 flex items-baseline gap-2 font-mono">
          <span
            className={`text-xl md:text-2xl font-black ${
              accuracy >= 90
                ? 'text-emerald-400'
                : accuracy >= 75
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {accuracy}%
          </span>
        </div>

        <span className="text-[10px] text-zinc-500 font-medium">
          {totalErrors} error{totalErrors !== 1 ? 's' : ''} recorded
        </span>
      </GlassCard>

      {/* 4. Recall Speed */}
      <GlassCard
        glow={avgSpeed > 0 && avgSpeed < 3.0 ? 'emerald' : 'none'}
        className="p-3.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Recall Speed
          </span>
          <Zap className="w-3.5 h-3.5 text-mint-400" />
        </div>

        <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
          <span className="text-xl md:text-2xl font-black text-white">
            {avgSpeed > 0 ? avgSpeed.toFixed(1) : '0.0'}s
          </span>
          <span className="text-[10px] text-zinc-500">/ cell</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              avgSpeed > 0 && avgSpeed <= 3.0 ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="text-[10px] text-zinc-500 font-medium">Target &lt; 3.0s</span>
        </div>
      </GlassCard>

      {/* 5. Rank & Streak */}
      <GlassCard className="col-span-2 md:col-span-1 p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[120px]">
            {rankInfo.title}
          </span>
          <Flame
            className={`w-3.5 h-3.5 ${
              streak > 0 ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-zinc-600'
            }`}
          />
        </div>

        <div className="my-1.5 flex items-baseline justify-between font-mono">
          <span className="text-xl md:text-2xl font-black text-amber-400">
            {xp} <span className="text-xs font-semibold text-zinc-500">XP</span>
          </span>
          <span className="text-xs font-bold text-rose-400">Streak: {streak}</span>
        </div>

        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${rankInfo.progressPct}%` }}
          />
        </div>
      </GlassCard>
    </section>
  );
};
