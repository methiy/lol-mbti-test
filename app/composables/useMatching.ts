// app/composables/useMatching.ts
import type { DimensionVector, Hero, MatchResult, Region } from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'

export function useMatching() {
  /**
   * Euclidean distance-based similarity.
   * Returns 0-1 where 1 = identical, 0 = maximum distance.
   * Much better than cosine similarity for positive-valued vectors
   * where all dimensions are in the same 1-10 range.
   */
  function similarity(a: DimensionVector, b: DimensionVector): number {
    let sumSq = 0
    for (const dimId of DIMENSION_IDS) {
      const diff = a[dimId] - b[dimId]
      sumSq += diff * diff
    }
    const dist = Math.sqrt(sumSq)
    // Max possible distance: sqrt(8 * 9^2) = sqrt(648) ≈ 25.46
    const maxDist = Math.sqrt(DIMENSION_IDS.length * 81)
    return 1 - dist / maxDist
  }

  function matchRegion(scores: DimensionVector, regions: Region[]): { region: Region, similarity: number } {
    let bestRegion = regions[0]
    let bestSim = -1

    for (const region of regions) {
      const sim = similarity(scores, region.vector)
      if (sim > bestSim) {
        bestSim = sim
        bestRegion = region
      }
    }

    return { region: bestRegion, similarity: bestSim }
  }

  function getMatchResult(scores: DimensionVector, regions: Region[], heroPool: Hero[]): MatchResult {
    const { region, similarity: regionSimilarity } = matchRegion(scores, regions)

    // Primary hero: must be from the matched region
    const regionHeroes = heroPool
      .filter((h) => h.regionId === region.id)
      .map((hero) => ({ hero, similarity: similarity(scores, hero.vector) }))
      .sort((a, b) => b.similarity - a.similarity)

    const primaryHero = regionHeroes[0]

    // Secondary heroes: from all heroes globally, excluding the primary
    const otherHeroes = heroPool
      .filter((h) => h.id !== primaryHero?.hero.id)
      .map((hero) => ({ hero, similarity: similarity(scores, hero.vector) }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 2)

    const topHeroes = primaryHero ? [primaryHero, ...otherHeroes] : otherHeroes

    return {
      region,
      regionSimilarity,
      topHeroes,
      dimensionScores: scores,
    }
  }

  return { getMatchResult, similarity }
}
