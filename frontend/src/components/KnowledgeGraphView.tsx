import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  HelpCircle, 
  Bot, 
  BookOpen,
  ShieldAlert
} from 'lucide-react';
import { Topic } from '../types';
import { getMasteryStatus } from '../utils/bkt';

interface KnowledgeGraphViewProps {
  topics: Topic[];
  onStartQuizForTopic: (topicId: string) => void;
  onOpenTutorForTopic: (topicName: string) => void;
}

interface GraphNodeLayout {
  topicId: string;
  x: number;
  y: number;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  topics,
  onStartQuizForTopic,
  onOpenTutorForTopic,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('null_semantics');

  // Defined coordinate layout for DBMS concept graph (Width 900, Height 500)
  const nodePositions: Record<string, { x: number; y: number; level: number }> = {
    'relational_algebra': { x: 120, y: 150, level: 1 },
    'sql_basics': { x: 340, y: 150, level: 2 },
    'null_semantics': { x: 560, y: 80, level: 3 },
    'sql_joins': { x: 560, y: 220, level: 3 },
    'normalization_1_3nf': { x: 340, y: 360, level: 2 },
    'bcnf': { x: 560, y: 360, level: 3 },
    'indexing_btree': { x: 780, y: 220, level: 4 },
    'acid_transactions': { x: 780, y: 360, level: 4 },
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  // Map of prerequisites and dependents
  const topicMap = new Map<string, Topic>();
  topics.forEach(t => topicMap.set(t.id, t));

  const prereqTopics = (selectedTopic?.prerequisites || [])
    .map(id => topicMap.get(id))
    .filter((t): t is Topic => Boolean(t));

  const dependentTopics = topics.filter(t => t.prerequisites.includes(selectedTopic?.id || ''));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GitFork className="w-6 h-6 text-indigo-400" />
            <span>Prerequisite Dependency Graph</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Visual map of concept prerequisites and live BKT mastery propagation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs bg-[var(--bg-surface)] px-4 py-2 rounded-xl border border-[var(--border-glass)]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Mastered (â‰¥72%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-300">Developing (45-71%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="text-slate-300">Knowledge Gap (&lt;45%)</span>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-950/80 border border-[var(--border-glass)] p-6 relative overflow-hidden backdrop-blur-xl min-h-[520px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <svg viewBox="0 0 920 480" className="w-full h-full max-h-[500px] select-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="28"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#6366f1" opacity="0.6" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="8"
                refX="28"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#a855f7" />
              </marker>
            </defs>

            {/* Render Prerequisite Connector Edges */}
            {topics.map(targetTopic => {
              const targetPos = nodePositions[targetTopic.id];
              if (!targetPos) return null;

              return targetTopic.prerequisites.map(prereqId => {
                const sourcePos = nodePositions[prereqId];
                if (!sourcePos) return null;

                const isConnectedToSelected = 
                  targetTopic.id === selectedTopicId || prereqId === selectedTopicId;

                return (
                  <g key={`${prereqId}-${targetTopic.id}`}>
                    <path
                      d={`M ${sourcePos.x} ${sourcePos.y} C ${(sourcePos.x + targetPos.x) / 2} ${sourcePos.y}, ${(sourcePos.x + targetPos.x) / 2} ${targetPos.y}, ${targetPos.x} ${targetPos.y}`}
                      fill="none"
                      stroke={isConnectedToSelected ? '#818cf8' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      strokeDasharray={isConnectedToSelected ? 'none' : '4 4'}
                      markerEnd={isConnectedToSelected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              });
            })}

            {/* Render Topic Nodes */}
            {topics.map(topic => {
              const pos = nodePositions[topic.id];
              if (!pos) return null;

              const status = getMasteryStatus(topic.estimatedMastery);
              const isSelected = topic.id === selectedTopicId;

              const statusStyles = {
                mastered: { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.4)', text: '#34d399' },
                developing: { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
                weak: { fill: '#f43f5e', ring: 'rgba(244, 63, 94, 0.4)', text: '#fb7185' }
              }[status];

              return (
                <g 
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className="cursor-pointer group"
                >
                  {/* Selection Outer Glow Ring */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="36"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '8s' }}
                    />
                  )}

                  {/* Node Outer Halo */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="26"
                    fill="#1e293b"
                    stroke={isSelected ? '#6366f1' : statusStyles.fill}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />

                  {/* Inner Status Indicator */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={statusStyles.fill}
                    opacity="0.85"
                  />

                  {/* Percentage in center */}
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9px"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {Math.round(topic.estimatedMastery * 100)}%
                  </text>

                  {/* Node Label Below */}
                  <text
                    x={pos.x}
                    y={pos.y + 46}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="11px"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {topic.name.length > 24 ? topic.name.slice(0, 22) + '...' : topic.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Topic Inspector Drawer */}
        <div className="lg:col-span-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-glass)] p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Topic Diagnostic Inspector
              </span>
              <span className={`badge badge-${getMasteryStatus(selectedTopic.estimatedMastery)}`}>
                {Math.round(selectedTopic.estimatedMastery * 100)}% Mastery
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 leading-tight">
              {selectedTopic.name}
            </h2>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              {selectedTopic.description}
            </p>

            {/* BKT Math Metrics */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-glass)] space-y-2 mb-4">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bayesian Learner Parameters</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[var(--text-muted)] block text-[10px]">Prior P(Lâ‚€)</span>
                  <span className="text-white font-bold">{selectedTopic.bktParams.pL0}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[var(--text-muted)] block text-[10px]">Learn Rate P(T)</span>
                  <span className="text-indigo-400 font-bold">{selectedTopic.bktParams.pT}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[var(--text-muted)] block text-[10px]">Guess P(G)</span>
                  <span className="text-slate-300 font-bold">{selectedTopic.bktParams.pG}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[var(--text-muted)] block text-[10px]">Slip P(S)</span>
                  <span className="text-rose-400 font-bold">{selectedTopic.bktParams.pS}</span>
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] pt-1 flex items-center justify-between">
                <span>Confidence Calibration:</span>
                <span className="text-slate-300 font-mono font-bold">
                  {Math.round(selectedTopic.confidence * 100)}% ({selectedTopic.attemptsCount} attempts)
                </span>
              </div>
            </div>

            {/* Prerequisite Chain Status */}
            <div className="space-y-3 mb-4">
              <div className="text-xs font-semibold text-slate-300">
                Prerequisite Foundations:
              </div>
              {prereqTopics.length === 0 ? (
                <div className="text-xs text-[var(--text-muted)] italic">
                  Root foundational concept. No prior prerequisites required.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {prereqTopics.map(p => {
                    const pStatus = getMasteryStatus(p.estimatedMastery);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedTopicId(p.id)}
                        className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-glass)] cursor-pointer text-xs"
                      >
                        <span className="text-slate-200">{p.name}</span>
                        <span className={`badge badge-${pStatus} text-[10px] py-0 px-1.5`}>
                          {Math.round(p.estimatedMastery * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Course Document Citation */}
            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200/90 mb-4 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-indigo-300">{selectedTopic.courseRef.document}</span>
                <span className="text-[11px] text-indigo-300/70">
                  {selectedTopic.courseRef.chapter} â€¢ {selectedTopic.courseRef.section} ({selectedTopic.courseRef.pages})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-[var(--border-glass)]">
            <button
              onClick={() => onStartQuizForTopic(selectedTopic.id)}
              className="w-full btn btn-primary text-xs py-2.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take Diagnostic Quiz on {selectedTopic.name.slice(0, 16)}...</span>
            </button>
            <button
              onClick={() => onOpenTutorForTopic(selectedTopic.name)}
              className="w-full btn btn-secondary text-xs py-2.5"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask Course-Grounded AI Tutor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
