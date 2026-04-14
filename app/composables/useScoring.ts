// app/composables/useScoring.ts
import type {
  DimensionEvidence,
  DimensionVector,
  ScaleContribution,
  ScaleQuestion,
  ScenarioContribution,
  ScenarioQuestion,
} from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'

/**
 * Calculate dimension scores from quiz answers.
 * Scale questions: 65% weight. Scenario questions: 35% weight.
 * Includes evidence tracking for result explanation.
 */
export function useScoring() {
  function calculateScores(
    scaleAnswers: (number | null)[],
    scenarioAnswers: (number | null)[],
    activeScaleQuestions: ScaleQuestion[],
    activeScenarioQuestions: ScenarioQuestion[],
  ): DimensionVector {
    const { scores } = calculateScoresWithEvidence(
      scaleAnswers,
      scenarioAnswers,
      activeScaleQuestions,
      activeScenarioQuestions,
    )
    return scores
  }

  function calculateScoresWithEvidence(
    scaleAnswers: (number | null)[],
    scenarioAnswers: (number | null)[],
    activeScaleQuestions: ScaleQuestion[],
    activeScenarioQuestions: ScenarioQuestion[],
  ): { scores: DimensionVector, evidence: DimensionEvidence[] } {
    const scaleResult = calculateScaleScores(scaleAnswers, activeScaleQuestions)
    const scenarioResult = calculateScenarioScores(scenarioAnswers, activeScenarioQuestions)

    const finalScores = {} as DimensionVector
    const evidence: DimensionEvidence[] = []

    for (const dimId of DIMENSION_IDS) {
      const scaleVal = scaleResult.scores[dimId] ?? 5.5
      const scenarioVal = scenarioResult.scores[dimId] ?? 5.5
      const merged = scaleVal * 0.65 + scenarioVal * 0.35
      const finalScore = Math.max(1, Math.min(10, Math.round(merged * 10) / 10))
      finalScores[dimId] = finalScore

      evidence.push({
        dimensionId: dimId,
        finalScore,
        scaleContributions: scaleResult.contributions[dimId] ?? [],
        scenarioContributions: scenarioResult.contributions[dimId] ?? [],
      })
    }

    return { scores: finalScores, evidence }
  }

  function calculateScaleScores(
    answers: (number | null)[],
    questions: ScaleQuestion[],
  ): {
      scores: DimensionVector
      contributions: Record<string, ScaleContribution[]>
    } {
    const weightedSums: Record<string, number> = {}
    const weightCounts: Record<string, number> = {}
    const contributions: Record<string, ScaleContribution[]> = {}

    for (const dimId of DIMENSION_IDS) {
      weightedSums[dimId] = 0
      weightCounts[dimId] = 0
      contributions[dimId] = []
    }

    questions.forEach((q, i) => {
      const answer = answers[i]
      if (answer === null) return

      const weight = q.weight ?? 1.0
      const score = q.reverse ? 6 - answer : answer

      weightedSums[q.dimensionId] += score * weight
      weightCounts[q.dimensionId] += weight

      // Determine direction: score 1-2 = towards_low, 3 = neutral, 4-5 = towards_high
      const direction: ScaleContribution['direction'] =
        score <= 2 ? 'towards_low' : score >= 4 ? 'towards_high' : 'neutral'

      contributions[q.dimensionId].push({
        questionText: q.text,
        answer,
        effectiveScore: score,
        direction,
      })
    })

    const scores = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (weightCounts[dimId] === 0) {
        scores[dimId] = 5.5
      }
      else {
        const weightedAvg = weightedSums[dimId] / weightCounts[dimId]
        // Normalize from 1-5 range to 1-10 range
        scores[dimId] = ((weightedAvg - 1) / 4) * 9 + 1
      }
    }

    return { scores, contributions }
  }

  function calculateScenarioScores(
    answers: (number | null)[],
    questions: ScenarioQuestion[],
  ): {
      scores: DimensionVector
      contributions: Record<string, ScenarioContribution[]>
    } {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}
    const contributions: Record<string, ScenarioContribution[]> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
      contributions[dimId] = []
    }

    questions.forEach((q, i) => {
      const answerIdx = answers[i]
      if (answerIdx === null) return
      const option = q.options[answerIdx]
      if (!option) return
      for (const [dimId, weight] of Object.entries(option.weights)) {
        sums[dimId] += weight
        counts[dimId]++

        contributions[dimId] = contributions[dimId] ?? []
        contributions[dimId].push({
          narrative: q.narrative,
          chosenOption: option.text,
          weight,
          direction: weight > 0 ? 'towards_high' : 'towards_low',
        })
      }
    })

    const scores = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (counts[dimId] === 0) {
        scores[dimId] = 5.5
      }
      else {
        const avg = sums[dimId] / counts[dimId]
        // Normalize from [-2, 2] range to [1, 10] range
        const rawScore = Math.max(1, Math.min(10, (avg + 2) / 4 * 9 + 1))

        // Confidence regression: fewer data points → regress towards midpoint
        const confidence = Math.min(1, counts[dimId] / 3)
        scores[dimId] = rawScore * confidence + 5.5 * (1 - confidence)
      }
    }

    return { scores, contributions }
  }

  return { calculateScores, calculateScoresWithEvidence }
}
