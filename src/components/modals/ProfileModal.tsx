import React from 'react';
import {
  X,
  User,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Target,
  Zap,
  Flame,
  Trophy,
  Shield,
  BarChart3,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Keyboard,
} from 'lucide-react';
import { useGameStore, getPlayerRank, RANKS } from '../../store/useGameStore';
import { useGridStore } from '../../store/useGridStore';
import { GlassCard } from '../common/GlassCard';

export const ProfileModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    openModal,
    xp,
    streak,
    bestStreak,
    totalAttempts,
    totalErrors,
    responseTimes,
    timerDuration,
    timerRemaining,
    timerElapsed,
    isTimerRunning,
    startTimer,
    pauseTimer,
    setTimerDuration,
    resetTimer,
    resetAllProgress,
    soundEnabled,
    toggleSound,
  } = useGameStore();

  const { solvedCount, totalCells, regenerateGrid } = useGridStore();

  if (activeModal !== 'profile') return null;

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
  const nextRank = RANKS.find((r) => r.level === rankInfo.level + 1);

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Reset All SpeedMath Progress?\n\nThis will clear your current grid, saved XP, streak, and error audit history. Continue?'
      )
    ) {
      resetAllProgress();
      regenerateGrid();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl bg-[#0c1310] border border-white/[0.12] p-5 sm:p-6 md:p-7 shadow-2xl flex flex-col gap-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080c0a] rounded-[10px] flex items-center justify-center text-emerald-400">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Player Profile &amp; Analytics
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Level {rankInfo.level}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Live calculation diagnostics, session speed, and career mastery
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Close Profile (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Profile Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black/40 to-amber-950/20 border border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-mint-400 to-amber-400 p-0.5 shadow-xl shadow-emerald-500/25 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#070b09] rounded-[14px] flex flex-col items-center justify-center">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Rank</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  Streak: {streak} (Best: {bestStreak})
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {rankInfo.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {xp} Total XP
                </span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-400">
                  {nextRank ? `${nextRank.minXP - xp} XP to ${nextRank.title}` : 'Maximum Rank Reached!'}
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="w-full md:w-64 flex flex-col gap-1.5 shrink-0">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400 font-semibold">Tier Progress</span>
              <span className="text-emerald-400 font-bold">{Math.round(rankInfo.progressPct)}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.08]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${rankInfo.progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>Lvl {rankInfo.level}: {rankInfo.minXP} XP</span>
              <span>Lvl {rankInfo.level + 1}: {rankInfo.maxXP} XP</span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Live Session Metrics &amp; Controls
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            Updated in real-time
          </span>
        </div>

        {/* The 5 Main Screen HUD Cards (Now housed cleanly inside Profile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* 1. SESSION TIME */}
          <GlassCard className="p-4 flex flex-col justify-between relative overflow-hidden group border-white/[0.1]">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Session Time
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => (isTimerRunning ? pauseTimer() : startTimer())}
                  className="p-1 rounded-md hover:bg-white/[0.08] text-emerald-400 transition-colors"
                  title={isTimerRunning ? 'Pause Session' : 'Start Session'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </div>

            <div className="my-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {formattedTime}
              </span>
              <select
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="text-[10px] font-semibold bg-white/[0.08] border border-white/[0.12] rounded px-1.5 py-0.5 text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="180">3 Min</option>
                <option value="300">5 Min</option>
                <option value="600">10 Min</option>
                <option value="0">Stopwatch</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-medium">
                {timerDuration === 0 ? 'Stopwatch Elapsed' : 'Countdown Remaining'}
              </span>
              <button
                type="button"
                onClick={resetTimer}
                className="text-zinc-400 hover:text-white flex items-center gap-0.5 p-0.5 rounded hover:bg-white/[0.06]"
                title="Reset Timer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>

          {/* 2. GRID SOLVED */}
          <GlassCard glow="emerald" className="p-4 flex flex-col justify-between border-white/[0.1]">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Grid Solved
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="my-2.5 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-black text-emerald-400">
                {solvedCount}
              </span>
              <span className="text-xs text-zinc-500 font-semibold">/ {totalCells}</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (solvedCount / totalCells) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-medium text-right">
                {Math.round((solvedCount / totalCells) * 100)}% Completed
              </span>
            </div>
          </GlassCard>

          {/* 3. ACCURACY */}
          <GlassCard
            glow={accuracy >= 90 ? 'emerald' : accuracy >= 70 ? 'amber' : 'coral'}
            className="p-4 flex flex-col justify-between border-white/[0.1]"
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Accuracy
              </span>
              <Target className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <div className="my-2.5 flex items-baseline gap-2 font-mono">
              <span
                className={`text-2xl font-black ${
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

          {/* 4. RECALL SPEED */}
          <GlassCard
            glow={avgSpeed > 0 && avgSpeed < 3.0 ? 'emerald' : 'none'}
            className="p-4 flex flex-col justify-between border-white/[0.1]"
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Recall Speed
              </span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="my-2.5 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-black text-white">
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

          {/* 5. NOVICE RECKONER / RANK & STREAK */}
          <GlassCard className="p-4 flex flex-col justify-between border-white/[0.1]">
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

            <div className="my-2.5 flex items-baseline justify-between font-mono">
              <span className="text-2xl font-black text-amber-400">
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
        </div>

        {/* Career Rank Ladder */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Career Mastery Ranks
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Rank {rankInfo.level} of {RANKS.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {RANKS.map((rank) => {
              const isCurrent = rank.level === rankInfo.level;
              const isUnlocked = xp >= rank.minXP;
              return (
                <div
                  key={rank.level}
                  className={`p-2 rounded-lg border text-center flex flex-col items-center justify-between gap-1 transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
                      : isUnlocked
                      ? 'bg-white/[0.04] border-white/[0.1] text-zinc-300'
                      : 'bg-white/[0.01] border-white/[0.04] text-zinc-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Shield className={`w-3 h-3 ${isCurrent ? 'text-emerald-400' : isUnlocked ? 'text-amber-400' : 'text-zinc-600'}`} />
                    <span className="text-[9px] font-bold font-mono uppercase">Lvl {rank.level}</span>
                  </div>
                  <span className="text-[10px] font-bold leading-tight line-clamp-1">
                    {rank.title}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    {rank.minXP} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick App Controls & Settings (Moved from Top Navbar) */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-zinc-400'
              }`}
              title="Toggle Web Audio Synthesizer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
              <span>Sound Audio: {soundEnabled ? 'Enabled' : 'Muted'}</span>
            </button>

            {/* Keyboard Shortcuts Trigger */}
            <button
              type="button"
              onClick={() => {
                closeModal();
                openModal('shortcuts');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all"
              title="View Keyboard Shortcuts & Hints [?]"
            >
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Shortcuts [?]</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset Session Grid Button */}
            <button
              type="button"
              onClick={handleResetProgress}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-bold text-rose-400 hover:text-rose-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session Progress</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeModal();
                openModal('audit');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Session Mistake Audit</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-none transition-all active:scale-95"
          >
            Back to Matrix Drills
          </button>
        </div>

      </div>
    </div>
  );
};
