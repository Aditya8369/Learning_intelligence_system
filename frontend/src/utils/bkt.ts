import { Topic, BktParameters, MasteryStatus, Recommendation } from '../types';

/**
 * Updates topic mastery estimate using standard Bayesian Knowledge Tracing (BKT)
 * 
 * Standard BKT Formula:
 * If student answers correctly:
 *   P(L_t | Correct) = (P(L_t) * (1 - P(S))) / (P(L_t) * (1 - P(S)) + (1 - P(L_t)) * P(G))
 * 
 * If student answers incorrectly:
 *   P(L_t | Incorrect) = (P(L_t) * P(S)) / (P(L_t) * P(S)) + (1 - P(L_t)) * (1 - P(G))
 * 
 * Then account for learning transition during the problem:
 *   P(L_{t+1}) = P(L_t | obs) + (1 - P(L_t | obs)) * P(T)
 */
export function updateBktMastery(
  currentPL: number,
  isCorrect: boolean,
  params: BktParameters
): { newPL: number; posterior: number } {
  const { pT, pG, pS } = params;

  let posterior: number;

  if (isCorrect) {
    const numerator = currentPL * (1 - pS);
    const denominator = numerator + (1 - currentPL) * pG;
    posterior = denominator === 0 ? currentPL : numerator / denominator;
  } else {
    const numerator = currentPL * pS;
    const denominator = numerator + (1 - currentPL) * (1 - pG);
    posterior = denominator === 0 ? currentPL : numerator / denominator;
  }

  // Bound posterior between 0.01 and 0.99
  posterior = Math.max(0.01, Math.min(0.99, posterior));

  // Learning step
  const newPL = posterior + (1 - posterior) * pT;
  const clampedPL = Math.max(0.01, Math.min(0.99, Number(newPL.toFixed(3))));

  return {
    newPL: clampedPL,
    posterior: Number(posterior.toFixed(3)),
  };
}

export function getMasteryStatus(mastery: number): MasteryStatus {
  if (mastery >= 0.72) return 'mastered';
  if (mastery >= 0.45) return 'developing';
  return 'weak';
}

/**
 * Transparent Multi-Factor Recommendation Engine
 * Implements PLAN.md Section 3.2:
 * "Each recommendation should explain why it was selected.
 * Consider low estimated mastery, topic importance, prerequisites, review timing, and recent mistakes."
 */
export function computeRecommendations(topics: Topic[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const topicMap = new Map<string, Topic>();
  topics.forEach(t => topicMap.set(t.id, t));

  for (const topic of topics) {
    const mastery = topic.estimatedMastery;
    const status = getMasteryStatus(mastery);

    // 1. Check prerequisite gap
    const weakPrereqs = topic.prerequisites
      .map(pId => topicMap.get(pId))
      .filter((p): p is Topic => Boolean(p && p.estimatedMastery < 0.60));

    if (weakPrereqs.length > 0 && mastery < 0.70) {
      const blocker = weakPrereqs[0];
      recommendations.push({
        id: `rec-prereq-${topic.id}`,
        topicId: blocker.id,
        topicName: blocker.name,
        title: `Remediate Prerequisite: ${blocker.name}`,
        description: `Your mastery in ${topic.name} is hindered by foundations in ${blocker.name} (${Math.round(blocker.estimatedMastery * 100)}%). Solidify prerequisites before advancing.`,
        type: 'prerequisite_remedy',
        priority: 'high',
        score: 95,
        reason: `Prerequisite dependency blocker: ${blocker.name} must reach >= 65% mastery before ${topic.name} can be mastered reliably.`,
        estimatedTimeMinutes: 10,
        actionText: 'Review Prerequisite with Tutor',
      });
    }

    // 2. High priority weak topic remediation
    if (status === 'weak') {
      const errorContext = topic.errorPatterns.length > 0 
        ? ` Recurring misconception: "${topic.errorPatterns[0]}".`
        : '';

      recommendations.push({
        id: `rec-weak-${topic.id}`,
        topicId: topic.id,
        topicName: topic.name,
        title: `Targeted Concept Review: ${topic.name}`,
        description: `Current estimated mastery is ${Math.round(mastery * 100)}%.${errorContext} Grounded explanations and a 3-question diagnostic will bridge this gap.`,
        type: 'concept_review',
        priority: 'high',
        score: 88 - Math.round(mastery * 30),
        reason: `Low estimated mastery (${Math.round(mastery * 100)}%) with ${topic.attemptsCount} attempts. High return on study investment.`,
        estimatedTimeMinutes: 12,
        actionText: 'Launch Guided Diagnostic',
      });
    }

    // 3. Developing topics ready for assessment
    if (status === 'developing') {
      recommendations.push({
        id: `rec-quiz-${topic.id}`,
        topicId: topic.id,
        topicName: topic.name,
        title: `Progress Practice: ${topic.name}`,
        description: `You're developing solid intuition (${Math.round(mastery * 100)}% mastery). Taking an intermediate quiz will solidify retention and push you to Mastered status.`,
        type: 'targeted_quiz',
        priority: 'medium',
        score: 72,
        reason: `Mastery in active transition zone (${Math.round(mastery * 100)}%). BKT indicates 2 more correct observations will achieve verified mastery.`,
        estimatedTimeMinutes: 8,
        actionText: 'Take 5-Question Quiz',
      });
    }

    // 4. Mastered topics with forgetting curve risk
    if (status === 'mastered') {
      recommendations.push({
        id: `rec-refresher-${topic.id}`,
        topicId: topic.id,
        topicName: topic.name,
        title: `Spaced Retrieval Check: ${topic.name}`,
        description: `You have strong mastery (${Math.round(mastery * 100)}%). A quick 2-question challenge guards against long-term memory decay.`,
        type: 'targeted_quiz',
        priority: 'low',
        score: 45,
        reason: `Spaced repetition guard: reinforce retrieval pathways to maintain high retention over time.`,
        estimatedTimeMinutes: 5,
        actionText: 'Quick 2-Min Refresher',
      });
    }
  }

  // Sort descending by multi-factor score
  return recommendations.sort((a, b) => b.score - a.score);
}
