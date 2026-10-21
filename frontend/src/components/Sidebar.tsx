import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  Compass, 
  HelpCircle, 
  Bot, 
  FileText, 
  FlaskConical, 
  RefreshCw, 
  ArrowRight,
  X
} from 'lucide-react';
import type { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  recommendationsCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  recommendationsCount,
  isOpen,
  onClose
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Learning Intelligence',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Mastery overview & profile'
    },
    {
      id: 'knowledge_graph' as ActiveTab,
      label: 'Prerequisite Graph',
      icon: GitFork,
      badge: 'BKT Map',
      desc: 'Concept dependency network'
    },
    {
      id: 'recommendations' as ActiveTab,
      label: 'Recommendations',
      icon: Compass,
      badge: recommendationsCount > 0 ? `${recommendationsCount} Next` : null,
      desc: 'Explainable ranked actions'
    },
    {
      id: 'quiz' as ActiveTab,
      label: 'Adaptive Assessments',
      icon: HelpCircle,
      badge: 'Live BKT',
      desc: 'Topic diagnostic quizzes'
    },
    {
      id: 'tutor' as ActiveTab,
      label: 'Grounded AI Tutor',
      icon: Bot,
      badge: 'Citations',
      desc: 'Course-aware explanations'
    },
    {
      id: 'course_notes' as ActiveTab,
      label: 'Course Material & RAG',
      icon: FileText,
      badge: null,
      desc: 'Syllabus & notes chunks'
    },
    {
      id: 'evaluation' as ActiveTab,
      label: 'Academic Evaluation',
      icon: FlaskConical,
      badge: 'Baselines',
      desc: 'Model metrics & research'
    }
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 md:top-[69px] left-0 z-50 md:z-30
        h-screen md:h-[calc(100vh-69px)]
        w-80 md:w-72 lg:w-80
        bg-[var(--bg-sidebar)] border-r border-[var(--border-glass)]
        flex flex-col justify-between shrink-0 shadow-2xl md:shadow-none
        transition-all duration-300 overflow-y-auto
      `}>
        <div className="p-5 space-y-3">
          
          {/* Header on Mobile */}
          <div className="flex items-center justify-between pb-2 md:hidden border-b border-[var(--border-glass)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Navigation Menu
            </span>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:block px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Learning Loop Navigation
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // On mobile, auto close drawer on item selection
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold translate-x-1'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-indigo-400'
                    }`} />
                    <div className="truncate">
                      <div className="text-sm font-semibold leading-tight">{item.label}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate group-hover:text-[var(--text-secondary)]">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* The Closed Learning Loop Widget */}
        <div className="p-5 m-4 rounded-2xl bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-surface-active)] border border-[var(--border-glass)] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>The Learning Loop</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Every quiz submission updates Bayesian mastery estimates, automatically realigning your next best recommendation.
          </p>

          <div className="space-y-2 text-xs pt-1 border-t border-[var(--border-glass)]">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Assess Question</span>
              <ArrowRight className="w-3 h-3 text-indigo-400 ml-auto" />
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Update Topic P(L)</span>
              <ArrowRight className="w-3 h-3 text-indigo-400 ml-auto" />
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Reprioritize Next Action</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
