import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  HelpCircle,
  Bot,
  Layers,
  Info
} from 'lucide-react';
import { Topic, Recommendation, QuizAttempt } from '../types';
import { getMasteryStatus } from '../utils/bkt';

interface DashboardViewProps {
  topics: Topic[];
  recommendations: Recommendation[];
  quizAttempts: QuizAttempt[];
  onSelectTopic: (topicId: string) => void;
  onLaunchRecommendation: (rec: Recommendation) => void;
  onOpenTutorForTopic: (topicName: string) => void;
  onStartQuizForTopic: (topicId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  topics,
  recommendations,
  quizAttempts,
  onSelectTopic,
  onLaunchRecommendation,
  onOpenTutorForTopic,
  onStartQuizForTopic,
}) => {
  const topRec = recommendations[0];

  const mastered = topics.filter(t => getMasteryStatus(t.estimatedMastery) === 'mastered');
  const developing = topics.filter(t => getMasteryStatus(t.estimatedMastery) === 'developing');
  const weak = topics.filter(t => getMasteryStatus(t.estimatedMastery) === 'weak');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome & Highest-Priority Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-purple-900/50 border border-indigo-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personalized Learning Intelligence Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back to your <span className="gradient-text">DBMS Learning Loop</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              PLIS tracks your concept-level mastery using Bayesian Knowledge Tracing. Rather than simple test scores,
              your recommendations adapt to foundational gaps, forgetting curves, and syllabus prerequisites.
            </p>
          </div>

          {/* Action Callout */}
          {topRec && (
            <div className="w-full lg:w-96 rounded-2xl bg-[var(--bg-surface)]/90 border border-indigo-500/30 p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                <span>Next Recommended Step</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                  Priority {topRec.score}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{topRec.title}</h2>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                {topRec.description}
              </p>
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200/90 mb-3 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Why:</strong> {topRec.reason}</span>
              </div>
              <button 
                onClick={() => onLaunchRecommendation(topRec)}
                className="w-full btn btn-primary text-xs py-2.5"
              >
                <span>{topRec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tri-Fold Knowledge Status Heatmap */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Learner Knowledge Profile</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Topic-by-topic Bayesian Knowledge Tracing estimates with uncertainty calibration
            </p>
          </div>
          <div className="text-xs text-[var(--text-muted)] font-mono hidden sm:block">
            Model: Sequential BKT with Transition P(T)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Mastered Category */}
          <div className="rounded-2xl bg-[var(--bg-card)] border border-emerald-500/20 p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span className="font-bold text-white text-sm">Mastered Concepts</span>
              </div>
              <span className="badge badge-mastered">{mastered.length} Topics</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Estimated mastery P(L) â‰¥ 72%. Robust retention and low slip risk.
            </p>
            <div className="space-y-2.5">
              {mastered.map(topic => (
                <div 
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-glass)] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span className="truncate pr-2">{topic.name}</span>
                    <span className="text-emerald-400 font-mono font-bold shrink-0">{Math.round(topic.estimatedMastery * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${topic.estimatedMastery * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Developing Category */}
          <div className="rounded-2xl bg-[var(--bg-card)] border border-amber-500/20 p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                <span className="font-bold text-white text-sm">Developing Concepts</span>
              </div>
              <span className="badge badge-developing">{developing.length} Topics</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Estimated mastery 45% - 71%. In active learning transition; practice solidifies retention.
            </p>
            <div className="space-y-2.5">
              {developing.map(topic => (
                <div 
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-glass)] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span className="truncate pr-2">{topic.name}</span>
                    <span className="text-amber-400 font-mono font-bold shrink-0">{Math.round(topic.estimatedMastery * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${topic.estimatedMastery * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Knowledge Gaps */}
          <div className="rounded-2xl bg-[var(--bg-card)] border border-rose-500/20 p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
                <span className="font-bold text-white text-sm">Knowledge Gaps (Action Needed)</span>
              </div>
              <span className="badge badge-weak">{weak.length} Topics</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Estimated mastery &lt; 45%. Persistent error patterns detected; potential prerequisite blockers.
            </p>
            <div className="space-y-2.5">
              {weak.map(topic => (
                <div 
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-rose-500/20 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span className="truncate pr-2">{topic.name}</span>
                    <span className="text-rose-400 font-mono font-bold shrink-0">{Math.round(topic.estimatedMastery * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1.5">
                    <div 
                      className="bg-rose-400 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${topic.estimatedMastery * 100}%` }}
                    />
                  </div>
                  {topic.errorPatterns[0] && (
                    <div className="text-[10px] text-rose-300/80 truncate">
                      âš ï¸� {topic.errorPatterns[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Topics Table with BKT Details */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Syllabus Topics & BKT Diagnostic Parameters</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Click any topic to practice with adaptive quiz or review with course-grounded tutor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const status = getMasteryStatus(topic.estimatedMastery);

            return (
              <div 
                key={topic.id}
                className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)] hover:border-indigo-500/40 transition-all duration-300 group flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        {topic.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                        {topic.name}
                      </h3>
                    </div>
                    <span className={`badge badge-${status} shrink-0`}>
                      {Math.round(topic.estimatedMastery * 100)}% P(L)
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* BKT Parameter Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-mono text-[10px]">
                      Prior P(L₀): {topic.bktParams.pL0}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-mono text-[10px]">
                      Transit P(T): {topic.bktParams.pT}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-mono text-[10px]">
                      Guess P(G): {topic.bktParams.pG}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-mono text-[10px]">
                      Slip P(S): {topic.bktParams.pS}
                    </span>
                  </div>

                  {/* Prerequisites */}
                  {topic.prerequisites.length > 0 && (
                    <div className="text-[11px] text-[var(--text-muted)] mb-3 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-400">Prerequisites:</span>
                      {topic.prerequisites.map(pId => {
                        const pTopic = topics.find(t => t.id === pId);
                        return (
                          <span key={pId} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px]">
                            {pTopic ? pTopic.name : pId}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Error Pattern Callout */}
                  {topic.errorPatterns.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)] text-[11px] text-slate-300 mb-4 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-300">Misconception:</span> {topic.errorPatterns[0]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-glass)] mt-auto">
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last practiced: {topic.lastPracticed}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenTutorForTopic(topic.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Ask course-grounded tutor"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask Tutor</span>
                    </button>
                    <button
                      onClick={() => onStartQuizForTopic(topic.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz Attempts Log */}
      {quizAttempts.length > 0 && (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recent Assessment Telemetry & BKT Updates</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Live Evidence Stream
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-glass)] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Topic</th>
                  <th className="pb-3">Result</th>
                  <th className="pb-3 font-mono">Mastery Before</th>
                  <th className="pb-3 font-mono">Mastery After</th>
                  <th className="pb-3">Î” Shift</th>
                  <th className="pb-3 pr-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-glass)]">
                {quizAttempts.slice(-5).reverse().map((att) => {
                  const topic = topics.find(t => t.id === att.topicId);
                  const diff = att.masteryAfter - att.masteryBefore;
                  return (
                    <tr key={att.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                      <td className="py-2.5 pl-2 font-medium text-white">
                        {topic ? topic.name : att.topicId}
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          att.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {att.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-400">
                        {Math.round(att.masteryBefore * 100)}%
                      </td>
                      <td className="py-2.5 font-mono font-bold text-white">
                        {Math.round(att.masteryAfter * 100)}%
                      </td>
                      <td className="py-2.5 font-mono">
                        <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {diff >= 0 ? `+${Math.round(diff * 100)}%` : `${Math.round(diff * 100)}%`}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-right text-[var(--text-muted)]">
                        {att.timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
