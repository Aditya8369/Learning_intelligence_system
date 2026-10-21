import React, { useState, useEffect } from 'react';
import type { Topic, Recommendation, QuizAttempt, ActiveTab } from './types';
import { INITIAL_TOPICS } from './data/mockData';
import { computeRecommendations } from './utils/bkt';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { RecommendationsView } from './components/RecommendationsView';
import { QuizView } from './components/QuizView';
import { TutorChatView } from './components/TutorChatView';
import { CourseMaterialView } from './components/CourseMaterialView';
import { EvaluationView } from './components/EvaluationView';
import { TopicDetailModal } from './components/TopicDetailModal';

const LOCAL_STORAGE_KEY_TOPICS = 'plis_learner_topics_v1';
const LOCAL_STORAGE_KEY_ATTEMPTS = 'plis_learner_attempts_v1';

export const App: React.FC = () => {
  // 1. Initialize topics from localStorage or fallback to mockData
  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TOPICS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage read error
    }
    return INITIAL_TOPICS;
  });

  // 2. Initialize quiz attempts history
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ATTEMPTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  // 3. Navigation & Contextual Routing State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeTopicForQuiz, setActiveTopicForQuiz] = useState<string | null>(null);
  const [activeTopicForTutor, setActiveTopicForTutor] = useState<string>('NULL Semantics & Three-Valued Logic (3VL)');
  const [selectedTopicForModal, setSelectedTopicForModal] = useState<Topic | null>(null);

  // 4. Save to localStorage when topics change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TOPICS, JSON.stringify(topics));
    } catch (e) {
      console.warn('Could not persist topics to localStorage', e);
    }
  }, [topics]);

  // Save attempts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ATTEMPTS, JSON.stringify(quizAttempts));
    } catch (e) {
      console.warn('Could not persist attempts to localStorage', e);
    }
  }, [quizAttempts]);

  // 5. Dynamic Recommendations generated using current topic mastery & prerequisites
  const recommendations: Recommendation[] = computeRecommendations(topics);

  // Handlers for navigation across the closed learning loop
  const handleStartQuizForTopic = (topicId: string) => {
    setActiveTopicForQuiz(topicId);
    setActiveTab('quiz');
  };

  const handleOpenTutorForTopic = (topicName: string) => {
    setActiveTopicForTutor(topicName);
    setActiveTab('tutor');
  };

  const handleLaunchRecommendation = (rec: Recommendation) => {
    if (rec.type === 'concept_review' || rec.type === 'tutor_deep_dive' || rec.type === 'prerequisite_remedy') {
      handleOpenTutorForTopic(rec.topicName);
    } else {
      handleStartQuizForTopic(rec.topicId);
    }
  };

  const handleSelectTopicModal = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId) || null;
    setSelectedTopicForModal(topic);
  };

  const handleUpdateTopicMastery = (
    topicId: string,
    newPL: number,
    isCorrect: boolean,
    attempt: QuizAttempt
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const attemptsCount = t.attemptsCount + 1;
          const correctCount = isCorrect ? t.correctCount + 1 : t.correctCount;
          // Increase confidence with more sample points
          const confidence = Math.min(0.95, t.confidence + 0.02);

          return {
            ...t,
            estimatedMastery: newPL,
            attemptsCount,
            correctCount,
            confidence,
            lastPracticed: 'Just now',
          };
        }
        return t;
      })
    );

    setQuizAttempts((prev) => [attempt, ...prev]);
  };

  const handleResetData = () => {
    if (window.confirm('Reset student learning profile and diagnostic history to initial state?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY_TOPICS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_ATTEMPTS);
      setTopics(INITIAL_TOPICS);
      setQuizAttempts([]);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* Top Application Header with Dedicated Hamburger Button */}
      <Header 
        topics={topics} 
        activeCourseName="Database Management Systems (CS 340)" 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace: Fluid Full-Width Layout */}
      <div className="flex-1 flex w-full relative">
        
        {/* Navigation Sidebar (Collapsible & Mobile Drawer) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          recommendationsCount={recommendations.length}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Viewport Content Area - Expands Fluidly when Sidebar Collapsed */}
        <main className="flex-1 w-full min-w-0 px-4 sm:px-8 lg:px-12 py-8 overflow-y-auto transition-all duration-300">
          <div className="w-full max-w-[1800px] mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                topics={topics}
                recommendations={recommendations}
                quizAttempts={quizAttempts}
                onSelectTopic={handleSelectTopicModal}
                onLaunchRecommendation={handleLaunchRecommendation}
                onOpenTutorForTopic={handleOpenTutorForTopic}
                onStartQuizForTopic={handleStartQuizForTopic}
              />
            )}

            {activeTab === 'knowledge_graph' && (
              <KnowledgeGraphView
                topics={topics}
                onStartQuizForTopic={handleStartQuizForTopic}
                onOpenTutorForTopic={handleOpenTutorForTopic}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsView
                recommendations={recommendations}
                topics={topics}
                onLaunchRecommendation={handleLaunchRecommendation}
                onOpenTutorForTopic={handleOpenTutorForTopic}
                onStartQuizForTopic={handleStartQuizForTopic}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizView
                topics={topics}
                activeTopicId={activeTopicForQuiz}
                onUpdateTopicMastery={handleUpdateTopicMastery}
                onOpenTutorForTopic={handleOpenTutorForTopic}
              />
            )}

            {activeTab === 'tutor' && (
              <TutorChatView
                topics={topics}
                activeTopicName={activeTopicForTutor}
                onStartQuizForTopic={handleStartQuizForTopic}
              />
            )}

            {activeTab === 'course_notes' && (
              <CourseMaterialView
                topics={topics}
                onOpenTutorForTopic={handleOpenTutorForTopic}
              />
            )}

            {activeTab === 'evaluation' && (
              <EvaluationView />
            )}
          </div>
        </main>
      </div>

      {/* Deep Dive Topic Inspection Modal */}
      {selectedTopicForModal && (
        <TopicDetailModal
          topic={selectedTopicForModal}
          allTopics={topics}
          onClose={() => setSelectedTopicForModal(null)}
          onStartQuiz={handleStartQuizForTopic}
          onOpenTutor={handleOpenTutorForTopic}
          onSelectTopic={handleSelectTopicModal}
        />
      )}
    </div>
  );
};

export default App;
