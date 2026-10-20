import React from 'react';
import { Menu, User } from 'lucide-react';
import { useGameStore, getPlayerRank } from '../../store/useGameStore';

export const TopHeader: React.FC = () => {
  const { toggleSidebar, openModal, xp, streak } = useGameStore();
  const rank = getPlayerRank(xp);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#070908]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 md:px-6 flex items-center justify-between">
      {/* Left: Hamburger (Mobile) & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          {/* Logo Glyph */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-500 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#080c0a] rounded-[10px] flex items-center justify-center">
              <span className="text-emerald-400 font-extrabold text-lg leading-none">⚡</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-emerald-300 via-mint-300 to-amber-300 bg-clip-text text-transparent">
                SpeedMath
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                PRO
              </span>
            </div>
            <p className="hidden sm:block text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
              Mental Calculation Engine
            </p>
          </div>
        </div>
      </div>

      {/* Right: Clean Profile Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => openModal('profile')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-500/40 transition-all text-xs text-zinc-300 group"
          title="Open Profile, Stats & Settings"
        >
          {streak > 0 && (
            <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px] px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
              🔥 {streak}
            </span>
          )}
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline font-semibold text-zinc-200">
            Lv.{rank.level} Profile
          </span>
        </button>
      </div>
    </header>
  );
};
