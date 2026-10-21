import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Bot, 
  BookOpen, 
  Layers, 
  Info,
  Clock,
  Filter
} from 'lucide-react';
import type { Recommendation, Topic } from '../types';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  topics: Topic[];
  onLaunchRecommendation: (rec: Recommendation) => void;
  onOpenTutorForTopic: (topicName: string) => void;
  onStartQuizForTopic: (topicId: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  topics,
  onLaunchRecommendation,
  onOpenTutorForTopic,
  onStartQuizForTopic,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredRecs = recommendations.filter((rec) => {
    if (filterType !== 'all' && rec.type !== filterType) return false;
    if (filterPriority !== 'all' && rec.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prerequisite_remedy':
        return <Layers className="w-4 h-4 text-rose-400" />;
      case 'concept_review':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'targeted_quiz':
        return <HelpCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explainable Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Personalized Learning Next Steps
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Rather than following a rigid syllabus or guessing what to study, PLIS dynamically ranks your optimal
            next actions using topic-level mastery gaps, prerequisite blockers, and review timing.
          </p>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-glass)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters:</span>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900/70 text-white text-xs rounded-xl px-3 py-1.5 border border-[var(--border-glass)] focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Action Types</option>
            <option value="prerequisite_remedy">Prerequisite Remedies</option>
            <option value="concept_review">Concept Reviews</option>
            <option value="targeted_quiz">Targeted Quizzes</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900/70 text-white text-xs rounded-xl px-3 py-1.5 border border-[var(--border-glass)] focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="text-xs text-[var(--text-muted)] text-right">
          Showing <span className="text-white font-bold">{filteredRecs.length}</span> actionable recommendations
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)] space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No pending recommendations in this filter</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              You are on top of your current learning objectives! Try adjusting your filter or take an adaptive quiz to generate new diagnostic observations.
            </p>
          </div>
        ) : (
          filteredRecs.map((rec, index) => {
            const topic = topics.find((t) => t.id === rec.topicId);
            return (
              <div
                key={rec.id}
                className="group relative overflow-hidden rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-glass)] hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-300 shadow-lg"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {getTypeIcon(rec.type)}
                        <span className="capitalize">{rec.type.replace('_', ' ')}</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getPriorityBadgeClass(rec.priority)}`}>
                        {rec.priority} Priority
                      </span>

                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        Ranking Score: {rec.score}/100
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] ml-auto sm:ml-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{rec.estimatedTimeMinutes} min</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {rec.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mt-1">
                        {rec.description}
                      </p>
                    </div>

                    {/* Transparent Why Card */}
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 flex items-start gap-2">
                      <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Why selected:</strong> {rec.reason}
                        {topic && (
                          <div className="mt-1 text-[11px] text-indigo-300/80">
                            Current topic mastery: {Math.round(topic.estimatedMastery * 100)}% | Attempts logged: {topic.attemptsCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col shrink-0 gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onLaunchRecommendation(rec)}
                      className="btn btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>{rec.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenTutorForTopic(rec.topicName)}
                      className="btn btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ask AI Tutor</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
