// app/composables/useScoring.ts
import type { DimensionVector, ScaleQuestion, ScenarioQuestion } from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'

/**
 * Calculate dimension scores from quiz answers.
 * Scale questions: 70% weight. Scenario questions: 30% weight.
 */
export function useScoring() {
  function calculateScores(
    scaleAnswers: (number | null)[],
    scenarioAnswers: (number | null)[],
    activeScaleQuestions: ScaleQuestion[],
    activeScenarioQuestions: ScenarioQuestion[],
  ): DimensionVector {
    const scaleScores = calculateScaleScores(scaleAnswers, activeScaleQuestions)
    const scenarioScores = calculateScenarioScores(scenarioAnswers, activeScenarioQuestions)

    const finalScores = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      const scaleVal = scaleScores[dimId] ?? 5.5
      const scenarioVal = scenarioScores[dimId] ?? 5.5
      const merged = scaleVal * 0.7 + scenarioVal * 0.3
      finalScores[dimId] = Math.max(1, Math.min(10, Math.round(merged * 10) / 10))
    }

    return finalScores
  }

  function calculateScaleScores(
    answers: (number | null)[],
    questions: ScaleQuestion[],
  ): DimensionVector {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
    }

    questions.forEach((q, i) => {
      const answer = answers[i]
      if (answer === null) return
      const score = q.reverse ? 6 - answer : answer
      sums[q.dimensionId] += score
      counts[q.dimensionId]++
    })

    const result = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (counts[dimId] === 0) {
        result[dimId] = 5.5
      }
      else {
        const rawSum = sums[dimId]
        const maxSum = counts[dimId] * 5
        const minSum = counts[dimId] * 1
        result[dimId] = ((rawSum - minSum) / (maxSum - minSum)) * 9 + 1
      }
    }

    return result
  }

  function calculateScenarioScores(
    answers: (number | null)[],
    questions: ScenarioQuestion[],
  ): DimensionVector {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
    }

    questions.forEach((q, i) => {
      const answerIdx = answers[i]
      if (answerIdx === null) return
      const option = q.options[answerIdx]
      if (!option) return
      for (const [dimId, weight] of Object.entries(option.weights)) {
        sums[dimId] += weight
        counts[dimId]++
      }
    })

    const result = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (counts[dimId] === 0) {
        result[dimId] = 5.5
      }
      else {
        const avg = sums[dimId] / counts[dimId]
        result[dimId] = Math.max(1, Math.min(10, (avg + 2) / 4 * 9 + 1))
      }
    }

    return result
  }

  return { calculateScores }
}
