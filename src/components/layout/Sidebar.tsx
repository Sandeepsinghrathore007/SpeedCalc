import React from 'react';
import {
  Square,
  Box,
  Percent,
  ShieldCheck,
  Binary,
  X,
  Trash2,
  Grid3X3,
  Zap,
  User,
} from 'lucide-react';
import { useGameStore, getPlayerRank } from '../../store/useGameStore';
import { useGridStore } from '../../store/useGridStore';
import { ModuleTab, OperationType, ArithmeticMode } from '../../types';
import { clsx } from 'clsx';

interface NavItem {
  id: ModuleTab;
  label: string;
  badge: string;
  icon: React.ReactNode;
}

interface ArithmeticNavItem {
  id: 'multiplication' | 'addition' | 'subtraction';
  label: string;
  symbol: string;
  op: OperationType;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    closeSidebar,
    xp,
    streak,
    resetAllProgress,
    openModal,
  } = useGameStore();

  const { arithmeticMode, setArithmeticMode, setOperation } = useGridStore();

  const rankInfo = getPlayerRank(xp);

  const arithmeticItems: ArithmeticNavItem[] = [
    { id: 'multiplication', label: 'Multiplication', symbol: '×', op: 'multiply' },
    { id: 'addition', label: 'Addition', symbol: '+', op: 'add' },
    { id: 'subtraction', label: 'Subtraction', symbol: '−', op: 'subtract' },
  ];

  const otherSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Powers & Fractions',
      items: [
        {
          id: 'squares',
          label: 'Squares 1-40',
          badge: 'Drill',
          icon: <Square className="w-4 h-4" />,
        },
        {
          id: 'cubes',
          label: 'Cubes 1-15',
          badge: 'Drill',
          icon: <Box className="w-4 h-4" />,
        },
        {
          id: 'fractions',
          label: 'Fractions & %',
          badge: 'Drill',
          icon: <Percent className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Number Theory & Logic',
      items: [
        {
          id: 'primes',
          label: 'Primes & Divisibility',
          badge: 'Speed',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          id: 'reasoning',
          label: 'Reasoning (EJOTY)',
          badge: 'Speed',
          icon: <Binary className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleSelectArithmetic = (item: ArithmeticNavItem, mode?: ArithmeticMode) => {
    setActiveTab(item.id);
    setOperation(item.op);
    if (mode) {
      setArithmeticMode(mode);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed lg:static top-0 z-50 lg:z-30 w-72 h-screen bg-[#0a0f0c]/95 lg:bg-[#080d0a]/90 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-500 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#080c0a] rounded-[10px] flex items-center justify-center">
                  <span className="text-emerald-400 font-extrabold text-base leading-none">⚡</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-emerald-300 via-mint-300 to-amber-300 bg-clip-text text-transparent">
                    SpeedMath
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                    PRO
                  </span>
                </div>
                <p className="text-[9px] font-semibold text-zinc-500 tracking-wider uppercase">
                  Mental Calculation Engine
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={closeSidebar}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Dedicated Arithmetic Operations */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 px-3 flex items-center justify-between">
              <span>Arithmetic Operations</span>
              <span className="text-[9px] text-zinc-500 font-mono">Grid & Drill</span>
            </span>

            <div className="flex flex-col gap-1.5">
              {arithmeticItems.map((item) => {
                const isSelected =
                  activeTab === item.id ||
                  (item.id === 'multiplication' && activeTab === 'tables');

                return (
                  <div
                    key={item.id}
                    className={clsx(
                      'rounded-xl border transition-all duration-150 p-2 flex flex-col gap-1.5',
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04]'
                    )}
                  >
                    {/* Main Operation Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectArithmetic(item)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={clsx(
                            'w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-sm',
                            isSelected
                              ? 'bg-emerald-500/25 text-emerald-300'
                              : 'bg-white/[0.06] text-zinc-400'
                          )}
                        >
                          {item.symbol}
                        </div>
                        <span
                          className={clsx(
                            'font-semibold text-xs md:text-sm',
                            isSelected ? 'text-emerald-300 font-bold' : 'text-zinc-300'
                          )}
                        >
                          {item.label}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </button>

                    {/* 2 Sub-options: 10x10 Grid & Flashcard Drill */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/[0.05]">
                      <button
                        type="button"
                        onClick={() => handleSelectArithmetic(item, 'grid')}
                        className={clsx(
                          'flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-bold transition-all',
                          isSelected && arithmeticMode === 'grid'
                            ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                        )}
                      >
                        <Grid3X3 className="w-3 h-3" />
                        <span>10×10 Grid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectArithmetic(item, 'flashcard')}
                        className={clsx(
                          'flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-bold transition-all',
                          isSelected && arithmeticMode === 'flashcard'
                            ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                        )}
                      >
                        <Zap className="w-3 h-3" />
                        <span>Flashcard</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2 & 3: Other Modules */}
          {otherSections.map((sec) => (
            <div key={sec.title} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3">
                {sec.title}
              </span>
              <div className="flex flex-col gap-1">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={clsx(
                        'flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150',
                        isActive
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={clsx(
                            'p-1 rounded-lg',
                            isActive ? 'text-emerald-400 bg-emerald-500/20' : 'text-zinc-400'
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="font-semibold text-xs md:text-sm">{item.label}</span>
                      </div>
                      <span
                        className={clsx(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                          isActive
                            ? 'bg-emerald-400 text-black'
                            : 'bg-white/[0.06] text-zinc-400'
                        )}
                      >
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Profile / XP Career Card */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              openModal('profile');
              closeSidebar();
            }}
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col gap-2 group text-left w-full"
            title="Click to view full Profile & Metrics"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                    Profile & Stats
                    <span className="text-[9px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ↗
                    </span>
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {rankInfo.title}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {streak > 0 && (
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                    🔥 {streak}
                  </span>
                )}
                <span className="text-xs font-extrabold text-amber-400 font-mono">{xp} XP</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${rankInfo.progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>Lvl {rankInfo.level}</span>
              <span>Next: {rankInfo.maxXP} XP</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to reset all XP, streak records, and saved drills?'
                )
              ) {
                resetAllProgress();
              }
            }}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </aside>
    </>
  );
};
