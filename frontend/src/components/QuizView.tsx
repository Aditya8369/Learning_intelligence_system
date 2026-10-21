import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Info,
  ChevronRight,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Topic, Question, QuizAttempt } from '../types';
import { QUESTION_BANK } from '../data/mockData';
import { updateBktMastery, getMasteryStatus } from '../utils/bkt';

interface QuizViewProps {
  topics: Topic[];
  activeTopicId: string | null;
  onUpdateTopicMastery: (topicId: string, newPL: number, isCorrect: boolean, attempt: QuizAttempt) => void;
  onOpenTutorForTopic: (topicName: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  topics,
  activeTopicId,
  onUpdateTopicMastery,
  onOpenTutorForTopic,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    activeTopicId || topics[0]?.id || 'null_semantics'
  );

  const availableQuestions = QUESTION_BANK.filter((q) => q.topicId === selectedTopicId);
  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bktResult, setBktResult] = useState<{
    prior: number;
    posterior: number;
    newPL: number;
    isCorrect: boolean;
  } | null>(null);

  const currentQuestion: Question | undefined = availableQuestions[questionIndex];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion || !currentTopic || isSubmitted) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    const { newPL, posterior } = updateBktMastery(
      currentTopic.estimatedMastery,
      isCorrect,
      currentTopic.bktParams
    );

    const bktData = {
      prior: currentTopic.estimatedMastery,
      posterior,
      newPL,
      isCorrect,
    };
    setBktResult(bktData);
    setIsSubmitted(true);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      questionId: currentQuestion.id,
      topicId: currentTopic.id,
      selectedOptionId,
      isCorrect,
      timestamp: 'Just now',
      masteryBefore: currentTopic.estimatedMastery,
      masteryAfter: newPL,
    };

    onUpdateTopicMastery(currentTopic.id, newPL, isCorrect, attempt);

    // Trigger celebratory confetti if mastery reached high threshold or answered correctly
    if (isCorrect && newPL >= 0.72) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#6366f1', '#10b981', '#ec4899', '#8b5cf6'],
      });
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < availableQuestions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuestionIndex(0);
    }
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setBktResult(null);
  };

  const handleTopicChange = (newTopicId: string) => {
    setSelectedTopicId(newTopicId);
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setBktResult(null);
  };

  const topicStatus = currentTopic ? getMasteryStatus(currentTopic.estimatedMastery) : 'developing';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/50 to-slate-900/60 border border-emerald-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Live Adaptive Assessment & Bayesian Knowledge Tracing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Adaptive Concept Diagnostics
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every question you attempt is evaluated as fresh statistical evidence. The system recalculates your
              belief of mastery <code className="text-indigo-300 font-mono">P(L)</code> using Bayesian Knowledge Tracing.
            </p>
          </div>

          {/* Topic Selector Pill Dropdown */}
          <div className="w-full md:w-auto shrink-0 bg-slate-900/80 p-3 rounded-2xl border border-[var(--border-glass)]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Select Assessment Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full md:w-64 bg-[var(--bg-surface)] text-white text-xs font-semibold rounded-xl px-3 py-2 border border-indigo-500/30 focus:outline-none focus:border-indigo-400"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({Math.round(t.estimatedMastery * 100)}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Assessment Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Question & Options */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuestion ? (
            <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)] p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-glass)] pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-bold font-mono">
                    Question {questionIndex + 1} of {availableQuestions.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">Target Topic:</span>
                  <span className="text-xs font-bold text-white">{currentTopic?.name}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h2>

                {currentQuestion.codeSnippet && (
                  <pre className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-indigo-200 text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectOption = opt.id === currentQuestion.correctOptionId;

                  let optionStyle = 'bg-slate-900/50 hover:bg-slate-900/90 border-[var(--border-glass)] text-white';

                  if (isSelected && !isSubmitted) {
                    optionStyle = 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20';
                  } else if (isSubmitted) {
                    if (isCorrectOption) {
                      optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/20';
                    } else if (isSelected && !isCorrectOption) {
                      optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-100';
                    } else {
                      optionStyle = 'bg-slate-900/20 border-[var(--border-glass)] text-[var(--text-muted)] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 ${optionStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.id}
                      </span>
                      <span className="text-sm font-medium leading-relaxed pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Submit & Next Action Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-glass)]">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOptionId}
                    className="w-full sm:w-auto btn btn-primary px-8 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span>Submit Answer for BKT Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      {bktResult?.isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Correct! Positive evidence logged.</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1.5">
                          <XCircle className="w-5 h-5" />
                          <span>Incorrect. Model identified knowledge gap.</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onOpenTutorForTopic(currentTopic.name)}
                        className="btn btn-secondary text-xs py-2.5 px-3 flex items-center gap-1.5"
                      >
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Ask Tutor About This</span>
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        className="btn btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Post-submission Pedagogical Explanation */}
              {isSubmitted && (
                <div className="space-y-4 pt-4 border-t border-[var(--border-glass)] animate-fade-in">
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-indigo-400" />
                      <span>Pedagogical Explanation</span>
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  {/* Course Source Citation */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-[var(--border-glass)] space-y-2">
                    <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Grounded Course Citation</span>
                    </div>
                    <div className="text-xs text-white font-semibold">
                      {currentQuestion.sourceCitation.document} — {currentQuestion.sourceCitation.section} (Page {currentQuestion.sourceCitation.page})
                    </div>
                    <blockquote className="text-xs text-[var(--text-secondary)] italic border-l-2 border-purple-500/40 pl-3 py-0.5">
                      "{currentQuestion.sourceCitation.quote}"
                    </blockquote>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)]">
              <p className="text-sm text-[var(--text-muted)]">No questions available for this topic.</p>
            </div>
          )}
        </div>

        {/* Right Col: Live BKT Mathematics & Topic State */}
        <div className="space-y-6">
          
          {/* Active Topic Card */}
          <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Topic Mastery Status
              </span>
              <span className={`badge badge-${topicStatus}`}>
                {topicStatus}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-tight">
              {currentTopic?.name}
            </h3>

            {/* Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Estimated Probability P(L):</span>
                <span className="font-mono font-bold text-white">
                  {Math.round(currentTopic.estimatedMastery * 100)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    topicStatus === 'mastered' 
                      ? 'bg-emerald-500' 
                      : topicStatus === 'developing' 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.round(currentTopic.estimatedMastery * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)]">
                <div className="text-[10px] text-[var(--text-muted)]">Attempts</div>
                <div className="font-bold text-white mt-0.5">{currentTopic.attemptsCount}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-glass)]">
                <div className="text-[10px] text-[var(--text-muted)]">Correct</div>
                <div className="font-bold text-emerald-400 mt-0.5">{currentTopic.correctCount}</div>
              </div>
            </div>
          </div>

          {/* Real-time Bayesian Update Breakdown */}
          <div className="rounded-3xl bg-indigo-950/20 border border-indigo-500/30 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Bayesian Engine Mathematics</span>
            </div>

            {bktResult ? (
              <div className="space-y-3 text-xs animate-fade-in">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-indigo-500/20 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Prior Belief P(L_t):</span>
                    <span className="font-mono font-bold text-slate-300">{bktResult.prior.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Evidence:</span>
                    <span className={`font-mono font-bold ${bktResult.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {bktResult.isCorrect ? 'Correct (+)' : 'Incorrect (-)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Posterior P(L_t | obs):</span>
                    <span className="font-mono font-bold text-indigo-300">{bktResult.posterior.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border-glass)] pt-1.5">
                    <span className="text-white font-bold">New Estimate P(L_next):</span>
                    <span className="font-mono font-bold text-emerald-300 text-sm">{bktResult.newPL.toFixed(3)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Formula applied:
                  <code className="block mt-1 p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-indigo-200">
                    {'P(L_next) = posterior + (1 - posterior) * P(T)'}
                  </code>
                </p>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Submit an answer to watch the BKT belief update equation recalculate live. Your recommendation priorities will shift automatically.
              </p>
            )}

            <div className="text-[10px] text-[var(--text-muted)] space-y-1 pt-1">
              <div>Learning rate P(T): {currentTopic.bktParams.pT}</div>
              <div>Guess probability P(G): {currentTopic.bktParams.pG}</div>
              <div>Slip probability P(S): {currentTopic.bktParams.pS}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
