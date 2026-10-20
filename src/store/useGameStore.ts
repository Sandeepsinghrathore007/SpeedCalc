import { create } from 'zustand';
import { ModuleTab, WeakSpotRecord, PlayerRank } from '../types';
import { audioEngine } from '../utils/audioEngine';

export const RANKS: PlayerRank[] = [
  { title: 'Novice Reckoner', level: 1, minXP: 0, maxXP: 250 },
  { title: 'Apprentice Calculator', level: 2, minXP: 250, maxXP: 750 },
  { title: 'Speed Scholar', level: 3, minXP: 750, maxXP: 1800 },
  { title: 'Mental Math Adept', level: 4, minXP: 1800, maxXP: 3500 },
  { title: 'Rapid Arithmetic Master', level: 5, minXP: 3500, maxXP: 6000 },
  { title: 'Grandmaster Reckoner', level: 6, minXP: 6000, maxXP: 12000 },
];

export function getPlayerRank(xp: number): PlayerRank & { progressPct: number } {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    const rank = RANKS[i];
    if (xp >= rank.minXP) {
      const span = rank.maxXP - rank.minXP;
      const progress = Math.min(100, Math.max(0, ((xp - rank.minXP) / span) * 100));
      return { ...rank, progressPct: progress };
    }
  }
  return { ...RANKS[0], progressPct: 0 };
}

interface GameState {
  // Navigation & UI
  activeTab: ModuleTab;
  sidebarOpen: boolean;
  soundEnabled: boolean;
  
  // Modals
  activeModal: 'hint' | 'audit' | 'redrill' | 'shortcuts' | 'profile' | null;
  hintData: {
    heading: string;
    tag: string;
    formula: string;
    explanation: string;
  } | null;

  // Career Metrics
  xp: number;
  streak: number;
  bestStreak: number;
  totalAttempts: number;
  totalErrors: number;
  responseTimes: number[];
  errorLog: WeakSpotRecord[];

  // Session Timer
  timerDuration: number; // in seconds (0 = Stopwatch)
  timerRemaining: number;
  timerElapsed: number;
  isTimerRunning: boolean;

  // Actions
  setActiveTab: (tab: ModuleTab) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleSound: () => void;
  openModal: (modal: 'hint' | 'audit' | 'redrill' | 'shortcuts' | 'profile', hintPayload?: any) => void;
  closeModal: () => void;
  
  // Gamification Actions
  recordAttempt: (isCorrect: boolean, responseTime: number, weakSpotData?: Omit<WeakSpotRecord, 'id' | 'timestamp'>) => void;
  
  // Timer Actions
  setTimerDuration: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  tickTimer: () => void;
  resetTimer: () => void;

  // Reset Progress
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'speedmath_pro_gamestate_v2';

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        xp: parsed.xp || 0,
        streak: parsed.streak || 0,
        bestStreak: parsed.bestStreak || 0,
        totalAttempts: parsed.totalAttempts || 0,
        totalErrors: parsed.totalErrors || 0,
        responseTimes: Array.isArray(parsed.responseTimes) ? parsed.responseTimes : [],
        errorLog: Array.isArray(parsed.errorLog) ? parsed.errorLog : [],
        timerDuration: typeof parsed.timerDuration === 'number' ? parsed.timerDuration : 300,
        timerRemaining: typeof parsed.timerRemaining === 'number' ? parsed.timerRemaining : 300,
        timerElapsed: parsed.timerElapsed || 0,
        activeTab: parsed.activeTab || 'tables',
      };
    }
  } catch (err) {
    console.error('Failed to parse saved game state:', err);
  }
  return null;
}

const initialPersisted = loadInitialState();

export const useGameStore = create<GameState>((set, get) => ({
  activeTab: initialPersisted?.activeTab || 'tables',
  sidebarOpen: false,
  soundEnabled: audioEngine.isEnabled(),
  activeModal: null,
  hintData: null,

  xp: initialPersisted?.xp || 0,
  streak: initialPersisted?.streak || 0,
  bestStreak: initialPersisted?.bestStreak || 0,
  totalAttempts: initialPersisted?.totalAttempts || 0,
  totalErrors: initialPersisted?.totalErrors || 0,
  responseTimes: initialPersisted?.responseTimes || [],
  errorLog: initialPersisted?.errorLog || [],

  timerDuration: initialPersisted?.timerDuration ?? 300,
  timerRemaining: initialPersisted?.timerRemaining ?? 300,
  timerElapsed: initialPersisted?.timerElapsed || 0,
  isTimerRunning: false,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    get().closeSidebar();
    saveState();
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  toggleSound: () => {
    const next = !get().soundEnabled;
    audioEngine.setSoundEnabled(next);
    set({ soundEnabled: next });
    if (next) audioEngine.playSuccess();
  },

  openModal: (modal, hintPayload) => set({ activeModal: modal, hintData: hintPayload || null }),
  closeModal: () => set({ activeModal: null }),

  recordAttempt: (isCorrect, responseTime, weakSpotData) => {
    const state = get();
    const newTotalAttempts = state.totalAttempts + 1;
    const newResponseTimes = [...state.responseTimes.slice(-199), responseTime];

    if (isCorrect) {
      const newStreak = state.streak + 1;
      const newBestStreak = Math.max(newStreak, state.bestStreak);
      const streakBonus = Math.floor(newStreak / 5) * 5;
      const speedBonus = responseTime < 2.0 ? 10 : responseTime < 3.0 ? 5 : 0;
      const gainedXP = 15 + streakBonus + speedBonus;
      const newXP = state.xp + gainedXP;

      // Check level up
      const oldRank = getPlayerRank(state.xp);
      const newRank = getPlayerRank(newXP);
      if (newRank.level > oldRank.level) {
        audioEngine.playLevelUp();
      } else if (newStreak > 0 && newStreak % 10 === 0) {
        audioEngine.playStreakMilestone();
      } else {
        audioEngine.playSuccess();
      }

      set({
        xp: newXP,
        streak: newStreak,
        bestStreak: newBestStreak,
        totalAttempts: newTotalAttempts,
        responseTimes: newResponseTimes,
      });
    } else {
      audioEngine.playError();
      const newErrors = state.totalErrors + 1;
      let newLog = [...state.errorLog];

      if (weakSpotData) {
        newLog.unshift({
          ...weakSpotData,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now()
        });
        if (newLog.length > 100) newLog = newLog.slice(0, 100);
      }

      set({
        streak: 0,
        totalAttempts: newTotalAttempts,
        totalErrors: newErrors,
        responseTimes: newResponseTimes,
        errorLog: newLog,
      });
    }

    saveState();
  },

  setTimerDuration: (seconds) => {
    set({
      timerDuration: seconds,
      timerRemaining: seconds,
      timerElapsed: 0,
      isTimerRunning: false
    });
    saveState();
  },

  startTimer: () => set({ isTimerRunning: true }),
  pauseTimer: () => set({ isTimerRunning: false }),

  tickTimer: () => {
    const { timerDuration, timerRemaining, timerElapsed, isTimerRunning } = get();
    if (!isTimerRunning) return;

    if (timerDuration === 0) {
      // Stopwatch mode
      set({ timerElapsed: timerElapsed + 1 });
    } else {
      // Countdown mode
      if (timerRemaining > 1) {
        set({
          timerRemaining: timerRemaining - 1,
          timerElapsed: timerElapsed + 1
        });
      } else {
        // Timer Finished
        set({
          timerRemaining: 0,
          timerElapsed: timerElapsed + 1,
          isTimerRunning: false,
          activeModal: 'audit'
        });
        audioEngine.playStreakMilestone();
      }
    }
  },

  resetTimer: () => {
    const duration = get().timerDuration;
    set({
      timerRemaining: duration,
      timerElapsed: 0,
      isTimerRunning: false
    });
  },

  resetAllProgress: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('speedmath_sound');
    set({
      xp: 0,
      streak: 0,
      bestStreak: 0,
      totalAttempts: 0,
      totalErrors: 0,
      responseTimes: [],
      errorLog: [],
      timerRemaining: 300,
      timerElapsed: 0,
      isTimerRunning: false
    });
  }
}));

function saveState() {
  try {
    const s = useGameStore.getState();
    const data = {
      xp: s.xp,
      streak: s.streak,
      bestStreak: s.bestStreak,
      totalAttempts: s.totalAttempts,
      totalErrors: s.totalErrors,
      responseTimes: s.responseTimes.slice(-50),
      errorLog: s.errorLog.slice(0, 50),
      timerDuration: s.timerDuration,
      timerRemaining: s.timerRemaining,
      timerElapsed: s.timerElapsed,
      activeTab: s.activeTab,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}
