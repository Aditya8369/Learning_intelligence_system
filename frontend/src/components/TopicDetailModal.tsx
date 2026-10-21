import React from 'react';
import { 
  X, 
  Brain, 
  HelpCircle, 
  Bot, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { Topic } from '../types';
import { getMasteryStatus } from '../utils/bkt';

interface TopicDetailModalProps {
  topic: Topic | null;
  allTopics: Topic[];
  onClose: () => void;
  onStartQuiz: (topicId: string) => void;
  onOpenTutor: (topicName: string) => void;
  onSelectTopic: (topicId: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  allTopics,
  onClose,
  onStartQuiz,
  onOpenTutor,
  onSelectTopic
}) => {
  if (!topic) return null;

  const status = getMasteryStatus(topic.estimatedMastery);
  const prereqTopics = topic.prerequisites
    .map(pId => allTopics.find(t => t.id === pId))
    .filter((t): t is Topic => Boolean(t));

  const dependentTopics = allTopics.filter(t => t.prerequisites.includes(topic.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-surface)] border border-indigo-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {topic.category}
            </span>
            <span className={`badge badge-${status}`}>
              {status} ({Math.round(topic.estimatedMastery * 100)}%)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {topic.name}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* BKT Mastery Metric Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)]">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Current P(L)</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {topic.estimatedMastery.toFixed(2)}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Confidence: {Math.round(topic.confidence * 100)}%
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assessment History</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {topic.correctCount}/{topic.attemptsCount}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {topic.attemptsCount > 0 ? `${Math.round((topic.correctCount / topic.attemptsCount) * 100)}% raw accuracy` : 'No attempts yet'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Course Reference</span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              {topic.courseRef.document}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {topic.courseRef.section} ({topic.courseRef.pages})
            </div>
          </div>
        </div>

        {/* Bayesian Parameters breakdown */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Bayesian Knowledge Tracing (BKT) Parameters
            </h4>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Calibrated model</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)]">
              <div className="text-[10px] text-[var(--text-muted)]">Prior P(L₀)</div>
              <div className="font-mono font-bold text-indigo-300 mt-0.5">{topic.bktParams.pL0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)]">
              <div className="text-[10px] text-[var(--text-muted)]">Transit P(T)</div>
              <div className="font-mono font-bold text-emerald-300 mt-0.5">{topic.bktParams.pT}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)]">
              <div className="text-[10px] text-[var(--text-muted)]">Guess P(G)</div>
              <div className="font-mono font-bold text-amber-300 mt-0.5">{topic.bktParams.pG}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)]">
              <div className="text-[10px] text-[var(--text-muted)]">Slip P(S)</div>
              <div className="font-mono font-bold text-rose-300 mt-0.5">{topic.bktParams.pS}</div>
            </div>
          </div>
        </div>

        {/* Identified Error Misconceptions */}
        {topic.errorPatterns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Identified Weaknesses & Misconceptions</span>
            </h4>
            <div className="space-y-1.5">
              {topic.errorPatterns.map((err, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites & Dependencies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Prerequisites</span>
            </h4>
            {prereqTopics.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">No prerequisite dependencies (Foundational topic)</p>
            ) : (
              <div className="space-y-1.5">
                {prereqTopics.map((p) => {
                  const pStatus = getMasteryStatus(p.estimatedMastery);
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectTopic(p.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-[var(--border-glass)] hover:border-indigo-500/40 text-left transition-colors"
                    >
                      <span className="text-xs font-medium text-white truncate">{p.name}</span>
                      <span className={`badge badge-${pStatus} text-[10px]`}>
                        {Math.round(p.estimatedMastery * 100)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              <span>Unlocks Subsequent Topics</span>
            </h4>
            {dependentTopics.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">Advanced terminal topic</p>
            ) : (
              <div className="space-y-1.5">
                {dependentTopics.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onSelectTopic(d.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-[var(--border-glass)] hover:border-indigo-500/40 text-left transition-colors"
                  >
                    <span className="text-xs font-medium text-white truncate">{d.name}</span>
                    <span className="text-[10px] text-indigo-300">Requires this</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onStartQuiz(topic.id);
            }}
            className="w-full sm:flex-1 btn btn-primary py-3 text-sm flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Diagnostic Quiz</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenTutor(topic.name);
            }}
            className="w-full sm:flex-1 btn btn-secondary py-3 text-sm flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Consult Grounded AI Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
