// app/composables/useScoring.ts
import type { DimensionVector } from '~/types'
import { scaleQuestions } from '~/data/scaleQuestions'
import { scenarioQuestions } from '~/data/scenarioQuestions'
import { DIMENSION_IDS } from '~/data/dimensions'

/**
 * Calculate dimension scores from quiz answers.
 * Scale questions: 70% weight. Scenario questions: 30% weight.
 */
export function useScoring() {
  function calculateScores(
    scaleAnswers: (number | null)[],
    scenarioAnswers: (number | null)[],
  ): DimensionVector {
    // 1. Calculate scale scores per dimension (raw: 3-15, normalized: 1-10)
    const scaleScores = calculateScaleScores(scaleAnswers)

    // 2. Calculate scenario scores per dimension (normalized: 1-10)
    const scenarioScores = calculateScenarioScores(scenarioAnswers)

    // 3. Weighted merge: 70% scale + 30% scenario
    const finalScores = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      const scaleVal = scaleScores[dimId] ?? 5.5
      const scenarioVal = scenarioScores[dimId] ?? 5.5
      const merged = scaleVal * 0.7 + scenarioVal * 0.3
      // Clamp to 1-10
      finalScores[dimId] = Math.max(1, Math.min(10, Math.round(merged * 10) / 10))
    }

    return finalScores
  }

  function calculateScaleScores(answers: (number | null)[]): DimensionVector {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
    }

    scaleQuestions.forEach((q, i) => {
      const answer = answers[i]
      if (answer === null) return
      // answer is 1-5; reverse means invert (6 - answer)
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
        // Each dimension has 3 questions, raw sum is 3-15
        // Normalize to 1-10: ((sum - 3) / 12) * 9 + 1
        const rawSum = sums[dimId]
        const maxSum = counts[dimId] * 5
        const minSum = counts[dimId] * 1
        result[dimId] = ((rawSum - minSum) / (maxSum - minSum)) * 9 + 1
      }
    }

    return result
  }

  function calculateScenarioScores(answers: (number | null)[]): DimensionVector {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
    }

    scenarioQuestions.forEach((q, i) => {
      const answerIdx = answers[i]
      if (answerIdx === null) return
      const option = q.options[answerIdx]
      if (!option) return
      for (const [dimId, weight] of Object.entries(option.weights)) {
        sums[dimId] += weight
        counts[dimId]++
      }
    })

    // Normalize scenario scores to 1-10
    // Scenario weights typically range from -2 to +2
    // We treat 0 as neutral (5.5), and scale proportionally
    const result = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (counts[dimId] === 0) {
        result[dimId] = 5.5
      }
      else {
        // Average weight, then map [-2, 2] → [1, 10]
        const avg = sums[dimId] / counts[dimId]
        result[dimId] = Math.max(1, Math.min(10, (avg + 2) / 4 * 9 + 1))
      }
    }

    return result
  }

  return { calculateScores }
}
