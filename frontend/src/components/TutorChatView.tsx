import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  Layers, 
  Check, 
  ExternalLink,
  GitBranch
} from 'lucide-react';
import type { TutorMessage, Topic } from '../types';
import { INITIAL_TUTOR_MESSAGES } from '../data/mockData';

interface TutorChatViewProps {
  topics: Topic[];
  activeTopicName?: string;
  onStartQuizForTopic: (topicId: string) => void;
}

export const TutorChatView: React.FC<TutorChatViewProps> = ({
  topics,
  activeTopicName,
  onStartQuizForTopic,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>(INITIAL_TUTOR_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(
    activeTopicName || 'NULL Semantics & Three-Valued Logic (3VL)'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (activeTopicName) {
      setSelectedTopic(activeTopicName);
    }
  }, [activeTopicName]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      // Try connecting to backend API first
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, topic: selectedTopic }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: TutorMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: data.reply || data.content,
          timestamp: 'Just now',
          citations: data.citations || [
            {
              document: 'DBMS_Comprehensive_Core.pdf',
              chapter: 'Chapter 3',
              section: '3.4 Three-Valued Logic',
              page: 78,
              snippet: 'In SQL three-valued logic, any comparison with NULL evaluates to UNKNOWN.',
            },
          ],
          diagramCode: data.diagramCode,
          suggestedPrompts: data.suggestedPrompts || [
            'Test my understanding with a practice question',
            'Explain with a worked example',
          ],
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Backend not running, use intelligent course-grounded simulation
    }

    // Grounded fallback response generator
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyContent = '';
      let citations = [
        {
          document: 'DBMS_Comprehensive_Core.pdf',
          chapter: 'Chapter 3',
          section: '3.4 Three-Valued Logic and Outer Joins',
          page: 78,
          snippet: 'In SQL three-valued logic, logical predicates evaluate to TRUE, FALSE, or UNKNOWN. WHERE clauses retain only rows evaluating strictly to TRUE.',
        },
      ];
      let diagramCode: string | undefined = undefined;
      let suggestedPrompts = [
        'How does NOT(UNKNOWN) evaluate in SQL?',
        'Give me a 2-question quiz on this',
        'Show a Mermaid diagram of this concept',
      ];

      if (lower.includes('null') || lower.includes('3vl') || lower.includes('three-valued')) {
        replyContent = `### NULL Semantics & Three-Valued Logic (3VL)

In SQL databases, **NULL** represents missing, unknown, or inapplicable information—it is **not a value** such as \`0\` or an empty string \`""\`.

Because NULL is unknown, standard equality comparisons fail:
\`\`\`sql
-- WRONG: Always evaluates to UNKNOWN, never matches any rows!
SELECT * FROM Employees WHERE department_id = NULL;

-- CORRECT: Specifically tests for the presence of NULL
SELECT * FROM Employees WHERE department_id IS NULL;
\`\`\`

#### Why \`NOT (UNKNOWN)\` is tricky:
In 3-valued logic:
* \`TRUE AND UNKNOWN\` → **UNKNOWN**
* \`FALSE OR UNKNOWN\` → **UNKNOWN**
* \`NOT (UNKNOWN)\` → **UNKNOWN**

Because a SQL \`WHERE\` clause only retains rows where the predicate is **strictly TRUE**, rows that evaluate to \`UNKNOWN\` are discarded. This is why student models frequently mistake \`NOT (salary > 50000)\` as including NULL salaries!`;
      } else if (lower.includes('join') || lower.includes('outer')) {
        replyContent = `### SQL Joins & Tuple Preservation

SQL Joins combine records from two relations based on a predicate:

1. **INNER JOIN**: Keeps only tuples where the join predicate matches in *both* tables.
2. **LEFT OUTER JOIN**: Keeps *all* tuples from the left relation. If no matching right tuple exists, fills all right-table columns with **NULL**.
3. **FULL OUTER JOIN**: Preserves unmatched tuples from both sides with NULL padding.

\`\`\`sql
SELECT s.student_name, g.course_code, g.grade
FROM Students s
LEFT JOIN Grades g ON s.student_id = g.student_id;
\`\`\`
*(Notice: Freshmen with no grades recorded will have \`g.grade IS NULL\`)*`;
        diagramCode = `flowchart TD
  A[Students Table] --> C{Match on student_id}
  B[Grades Table] --> C
  C -- Match Found --> D[Joined Tuple]
  C -- No Match Left --> E[Student + NULL Grade]`;
      } else if (lower.includes('bcnf') || lower.includes('normal') || lower.includes('3nf')) {
        replyContent = `### Boyce-Codd Normal Form (BCNF)

A relation $R$ is in **BCNF** if and only if for every non-trivial functional dependency $X \\to Y$:
> **$X$ is a Superkey of $R$.**

#### BCNF Decomposition Algorithm:
1. Find a functional dependency $X \\to Y$ that violates BCNF.
2. Compute the attribute closure $X^+$.
3. Decompose $R$ into:
   * $R_1 = X^+$
   * $R_2 = (R - X^+) \\cup X$
4. Check recursively if $R_1$ and $R_2$ are in BCNF.

BCNF guarantees the absence of redundancy due to functional dependencies, but unlike 3NF, may not always preserve all functional dependencies.`;
        diagramCode = `flowchart TD
  R[Relation R with violation X -> Y] --> Compute[Compute Closure X+]
  Compute --> Split1["R1 = (X+)"]
  Compute --> Split2["R2 = (R - X+) U X"]
  Split1 --> Check{"Is in BCNF?"}
  Split2 --> Check`;
      } else {
        replyContent = `I am grounded in your syllabus: **${selectedTopic}** from *DBMS Comprehensive Core*.

Here is how you should structure your study:
1. **Core Definition**: Review the formal mathematical specification.
2. **Key Invariant**: Understand what condition must never be violated.
3. **Common Pitfall**: Focus on typical misconceptions identified by our learner model.

Would you like me to generate a source-grounded diagnostic practice drill or provide a worked code example?`;
      }

      const assistantMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: 'Just now',
        citations,
        diagramCode,
        suggestedPrompts,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/60 to-slate-900/60 border border-purple-500/20 p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5" />
              <span>Course-Grounded Retrieval Augmented Tutor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              AI Tutor Grounded in Your Course Materials
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Answers are backed by syllabus citations from uploaded PDFs, tailored to your BKT mastery level.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-2xl border border-[var(--border-glass)] shrink-0">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.name} className="bg-slate-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)] flex flex-col h-[650px] shadow-2xl overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                }`}>
                  {isUser ? <span className="text-xs font-bold">You</span> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Content */}
                <div className={`space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900/80 border border-[var(--border-glass)] text-slate-100 rounded-tl-none space-y-3'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none whitespace-pre-line">
                      {msg.content}
                    </div>

                    {/* Mermaid Diagram Card if present */}
                    {msg.diagramCode && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 mt-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Generated Process Flowchart</span>
                        </div>
                        <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                          {msg.diagramCode}
                        </pre>
                      </div>
                    )}

                    {/* Source Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-glass)] space-y-2">
                        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-purple-400" />
                          <span>Grounded Source Evidence</span>
                        </div>
                        {msg.citations.map((c, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs space-y-1">
                            <div className="font-semibold text-white text-[11px]">
                              {c.document} — {c.section} (p. {c.page})
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)] italic">
                              "{c.snippet}"
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Prompts */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-[11px] font-medium px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors text-left"
                        >
                          + {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
              <span>Searching course embeddings & generating grounded explanation...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-[var(--border-glass)] flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask about ${selectedTopic} or request a worked example...`}
            className="flex-1 bg-slate-900 text-white text-xs sm:text-sm rounded-2xl px-4 py-3 border border-[var(--border-glass)] focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="btn btn-primary px-4 py-3 rounded-2xl flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
