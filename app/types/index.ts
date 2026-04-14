export type DimensionId =
  | 'chaos'
  | 'intuition'
  | 'bond'
  | 'conquest'
  | 'explore'
  | 'shadow'
  | 'agility'
  | 'ideal'

export type DimensionVector = Record<DimensionId, number>

export interface Dimension {
  id: DimensionId
  name: string
  lowLabel: string
  highLabel: string
}

export interface ScaleQuestion {
  id: number
  text: string
  dimensionId: DimensionId
  reverse: boolean
  weight: number
}

export interface ScenarioOption {
  label: string
  text: string
  weights: Partial<DimensionVector>
}

export interface ScenarioQuestion {
  id: number
  narrative: string
  primaryDimension: DimensionId
  options: [ScenarioOption, ScenarioOption, ScenarioOption, ScenarioOption]
}

export interface Region {
  id: string
  name: string
  nameEn: string
  description: string
  lore: string
  vector: DimensionVector
  badgeColor: string
}

export interface Hero {
  id: string
  name: string
  nameEn: string
  title: string
  regionId: string
  vector: DimensionVector
  description: string
  lore: string
}

export interface DimensionText {
  dimensionId: DimensionId
  range: 'low' | 'mid' | 'high'
  text: string
}

export interface SummaryTemplate {
  paragraph: 1 | 2 | 3 | 4
  condition: {
    dimensionId: DimensionId
    range: 'low' | 'mid' | 'high'
  }
  text: string
}

export interface MatchResult {
  region: Region
  regionSimilarity: number
  topHeroes: {
    hero: Hero
    similarity: number
  }[]
  dimensionScores: DimensionVector
  evidence?: DimensionEvidence[]
}

export interface ScaleContribution {
  questionText: string
  answer: number
  effectiveScore: number
  direction: 'towards_high' | 'towards_low' | 'neutral'
}

export interface ScenarioContribution {
  narrative: string
  chosenOption: string
  weight: number
  direction: 'towards_high' | 'towards_low'
}

export interface DimensionEvidence {
  dimensionId: DimensionId
  finalScore: number
  scaleContributions: ScaleContribution[]
  scenarioContributions: ScenarioContribution[]
}
