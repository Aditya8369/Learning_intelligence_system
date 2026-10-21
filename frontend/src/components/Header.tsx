import React from 'react';
import { 
  Brain, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Menu, 
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import type { Topic } from '../types';

interface HeaderProps {
  topics: Topic[];
  activeCourseName: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  topics, 
  activeCourseName,
  isSidebarOpen,
  onToggleSidebar
}) => {
  const totalMastery = topics.reduce((acc, t) => acc + t.estimatedMastery, 0) / (topics.length || 1);
  const weakCount = topics.filter(t => t.estimatedMastery < 0.45).length;
  const masteredCount = topics.filter(t => t.estimatedMastery >= 0.72).length;
  const totalAttempts = topics.reduce((acc, t) => acc + t.attemptsCount, 0);

  return (
    <header className="border-b border-[var(--border-glass)] bg-[var(--bg-sidebar)]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Dedicated Hamburger + Brand and Course Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Dedicated Hamburger Navigation Button */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-2.5 rounded-2xl bg-indigo-950/40 hover:bg-indigo-600/20 text-white border border-indigo-500/30 hover:border-indigo-500/60 transition-all flex items-center gap-2 group shadow-md shadow-indigo-950/40 active:scale-95"
            title={isSidebarOpen ? "Collapse sidebar navigation" : "Expand sidebar navigation"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            ) : (
              <Menu className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-bold tracking-wide text-indigo-200">
              {isSidebarOpen ? 'Hide Nav' : 'Menu'}
            </span>
          </button>

          {/* Brand Logo & Course */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white">PLIS</span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Learning Intelligence
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium text-white/90">{activeCourseName}</span>
                <span className="text-[var(--text-muted)]">•</span>
                <span>CS304 Core Syllabus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Global Learning Metrics Bar */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3.5">
          {/* Average BKT Mastery */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-glass)] shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 pulse-circle" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Avg Mastery (BKT)</div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-1">
                {Math.round(totalMastery * 100)}%
                <span className="text-[10px] font-normal text-indigo-300">P(L)</span>
              </div>
            </div>
          </div>

          {/* Mastered Topics */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400/80">Mastered</div>
              <div className="text-sm font-bold text-emerald-300 font-mono">{masteredCount}/{topics.length}</div>
            </div>
          </div>

          {/* Weak Gaps Requiring Attention */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-400/80">Knowledge Gaps</div>
              <div className="text-sm font-bold text-rose-300 font-mono">{weakCount} Topics</div>
            </div>
          </div>

          {/* Practice Attempts */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
            <Flame className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400/80">Assessments</div>
              <div className="text-sm font-bold text-amber-300 font-mono">{totalAttempts} Attempts</div>
            </div>
          </div>

          {/* AI Grounded Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>RAG Active</span>
          </div>
        </div>

      </div>
    </header>
  );
};
