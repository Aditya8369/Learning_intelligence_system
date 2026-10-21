export type MasteryStatus = 'mastered' | 'developing' | 'weak';

export interface BktParameters {
  pL0: number; // Prior probability of mastery
  pT: number;  // Transition probability (learning rate)
  pG: number;  // Probability of guessing
  pS: number;  // Probability of slipping
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[]; // List of topic IDs
  estimatedMastery: number; // 0.0 - 1.0 (PL)
  confidence: number; // 0.0 - 1.0 based on sample size
  bktParams: BktParameters;
  attemptsCount: number;
  correctCount: number;
  lastPracticed: string;
  errorPatterns: string[];
  courseRef: {
    document: string;
    chapter: string;
    section: string;
    pages: string;
  };
}

export type QuestionDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: QuestionDifficulty;
  questionText: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  optionFeedback: Record<string, string>;
  sourceCitation: {
    document: string;
    section: string;
    page: number;
    quote: string;
  };
}

export interface QuizAttempt {
  id: string;
  questionId: string;
  topicId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: string;
  masteryBefore: number;
  masteryAfter: number;
}

export type RecommendationType = 
  | 'prerequisite_remedy'
  | 'concept_review'
  | 'targeted_quiz'
  | 'tutor_deep_dive'
  | 'notes_reading';

export interface Recommendation {
  id: string;
  topicId: string;
  topicName: string;
  title: string;
  description: string;
  type: RecommendationType;
  priority: 'high' | 'medium' | 'low';
  score: number; // 0 - 100 ranking score
  reason: string; // Transparent explainability
  estimatedTimeMinutes: number;
  actionText: string;
}

export interface SourceCitation {
  document: string;
  chapter: string;
  section: string;
  page: number;
  snippet: string;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: SourceCitation[];
  diagramCode?: string; // Mermaid diagram code
  suggestedPrompts?: string[];
}

export interface CourseDocument {
  id: string;
  title: string;
  filename: string;
  size: string;
  totalPages: number;
  topicsCovered: string[];
  chunksCount: number;
  status: 'indexed' | 'processing';
  summary: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'knowledge_graph'
  | 'recommendations'
  | 'quiz'
  | 'tutor'
  | 'course_notes'
  | 'evaluation';
