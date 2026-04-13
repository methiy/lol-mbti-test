// app/composables/useMatching.ts
import type { DimensionVector, Hero, MatchResult, Region } from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'
import { heroes } from '~/data/heroes'
import { regions } from '~/data/regions'

export function useMatching() {
  function cosineSimilarity(a: DimensionVector, b: DimensionVector): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (const dimId of DIMENSION_IDS) {
      const va = a[dimId]
      const vb = b[dimId]
      dotProduct += va * vb
      normA += va * va
      normB += vb * vb
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    if (denominator === 0) return 0
    return dotProduct / denominator
  }

  function matchRegion(scores: DimensionVector): { region: Region, similarity: number } {
    let bestRegion = regions[0]
    let bestSimilarity = -1

    for (const region of regions) {
      const similarity = cosineSimilarity(scores, region.vector)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestRegion = region
      }
    }

    return { region: bestRegion, similarity: bestSimilarity }
  }

  function matchHeroes(scores: DimensionVector): { hero: Hero, similarity: number }[] {
    const heroScores = heroes.map((hero) => ({
      hero,
      similarity: cosineSimilarity(scores, hero.vector),
    }))

    heroScores.sort((a, b) => b.similarity - a.similarity)
    return heroScores.slice(0, 3)
  }

  function getMatchResult(scores: DimensionVector): MatchResult {
    const { region, similarity: regionSimilarity } = matchRegion(scores)
    const topHeroes = matchHeroes(scores)

    return {
      region,
      regionSimilarity,
      topHeroes,
      dimensionScores: scores,
    }
  }

  return { getMatchResult, cosineSimilarity }
}
