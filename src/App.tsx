import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { Sidebar } from './components/layout/Sidebar';
import { ArithmeticModule } from './components/modules/arithmetic/ArithmeticModule';
import { SquaresModule } from './components/modules/squares/SquaresModule';
import { CubesModule } from './components/modules/cubes/CubesModule';
import { FractionsModule } from './components/modules/fractions/FractionsModule';
import { PrimesModule } from './components/modules/primes/PrimesModule';
import { ReasoningModule } from './components/modules/reasoning/ReasoningModule';
import { HintModal } from './components/modals/HintModal';
import { AuditModal } from './components/modals/AuditModal';
import { RedrillModal } from './components/modals/RedrillModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { MobileNumpad } from './components/layout/MobileNumpad';
import { Menu } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeTab,
    activeModal,
    closeModal,
    openModal,
    isTimerRunning,
    tickTimer,
    toggleSidebar,
    sidebarOpen,
  } = useGameStore();

  // Background ticker for session countdown / stopwatch
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

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        openModal('shortcuts');
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [activeModal, closeModal, openModal]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#070908] text-slate-100 flex font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Mobile Floating Menu Button (only on mobile when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open Navigation Menu"
          className="lg:hidden fixed top-3 left-3 z-30 p-2.5 rounded-xl bg-[#0c1310]/95 border border-white/[0.1] text-zinc-300 hover:text-white backdrop-blur-xl shadow-xl transition-all"
        >
          <Menu className="w-5 h-5 text-emerald-400" />
        </button>
      )}

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Center Content Workspace */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col justify-center items-center p-2 sm:p-4 min-w-0">
        {/* Active Module Screen */}
        <div className="w-full max-w-7xl h-full flex flex-col justify-center items-center mx-auto">
            {(activeTab === 'multiplication' || activeTab === 'tables') && (
              <ArithmeticModule operation="multiply" />
            )}
            {activeTab === 'addition' && (
              <ArithmeticModule operation="add" />
            )}
            {activeTab === 'subtraction' && (
              <ArithmeticModule operation="subtract" />
            )}
            {activeTab === 'squares' && <SquaresModule />}
            {activeTab === 'cubes' && <CubesModule />}
            {activeTab === 'fractions' && <FractionsModule />}
            {activeTab === 'primes' && <PrimesModule />}
            {activeTab === 'reasoning' && <ReasoningModule />}
          </div>
        </main>

      {/* Mobile Touch Numpad Dock */}
      <MobileNumpad />

      {/* Global Modals & Drawers */}
      <ProfileModal />
      <HintModal />
      <AuditModal />
      <RedrillModal />
      <ShortcutsModal />
    </div>
  );
};

export default App;
