<!-- app/components/SummaryText.vue -->
<script setup lang="ts">
import type { DimensionId, MatchResult } from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'
import { summaryTemplates as lolTemplates } from '~/data/summaryTemplates'
import { summaryTemplates as opTemplates } from '~/data/onepiece/summaryTemplates'

const props = defineProps<{ result: MatchResult }>()

const { theme } = useQuiz()

const activeTemplates = computed(() => theme.value === 'lol' ? lolTemplates : opTemplates)

function getRange(score: number): 'low' | 'mid' | 'high' {
  if (score <= 3.5) return 'low'
  if (score <= 6.5) return 'mid'
  return 'high'
}

function getSortedDimensions(scores: Record<DimensionId, number>, order: 'desc' | 'asc') {
  return [...DIMENSION_IDS].sort((a, b) =>
    order === 'desc' ? scores[b] - scores[a] : scores[a] - scores[b],
  )
}

function fillPlaceholders(text: string): string {
  const region = props.result.region
  const hero = props.result.topHeroes[0]?.hero
  return text
    .replace(/\{regionName\}/g, region?.name ?? '')
    .replace(/\{regionLore\}/g, region?.lore ?? '')
    .replace(/\{heroName\}/g, hero?.name ?? '')
    .replace(/\{heroTitle\}/g, hero?.title ?? '')
    .replace(/\{heroLore\}/g, hero?.lore ?? '')
}

const paragraphs = computed(() => {
  const scores = props.result.dimensionScores
  const topDims = getSortedDimensions(scores, 'desc')
  const bottomDims = getSortedDimensions(scores, 'asc')
  const templates = activeTemplates.value

  // Paragraph 1: Top 2 dimensions
  const p1Parts: string[] = []
  for (const dimId of topDims.slice(0, 2)) {
    const range = getRange(scores[dimId])
    const template = templates.find(
      (t) => t.paragraph === 1 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) p1Parts.push(fillPlaceholders(template.text))
  }

  // Paragraph 2: Best matching region dimension
  let p2 = ''
  for (const dimId of topDims) {
    const range = getRange(scores[dimId])
    const template = templates.find(
      (t) => t.paragraph === 2 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) {
      p2 = fillPlaceholders(template.text)
      break
    }
  }

  // Paragraph 3: Hero resonance based on top dimension
  let p3 = ''
  for (const dimId of topDims) {
    const range = getRange(scores[dimId])
    const template = templates.find(
      (t) => t.paragraph === 3 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) {
      p3 = fillPlaceholders(template.text)
      break
    }
  }

  // Paragraph 4: Growth based on lowest dimension
  let p4 = ''
  for (const dimId of bottomDims) {
    const range = getRange(scores[dimId])
    const template = templates.find(
      (t) => t.paragraph === 4 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) {
      p4 = fillPlaceholders(template.text)
      break
    }
  }

  return [
    { title: '核心人格', text: p1Parts.join('') },
    { title: theme.value === 'lol' ? '城邦归属' : '阵营归属', text: p2 },
    { title: theme.value === 'lol' ? '英雄共鸣' : '角色共鸣', text: p3 },
    { title: '光与影', text: p4 },
  ]
})
</script>

<template>
  <div class="summary-text">
    <h3 class="section-title">命运之书</h3>
    <div v-for="(para, i) in paragraphs" :key="i" class="summary-paragraph">
      <h4 class="para-title">{{ para.title }}</h4>
      <p class="para-text">{{ para.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.summary-text {
  width: 100%;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-gold);
  margin-bottom: var(--space-lg);
  text-align: center;
  letter-spacing: 4px;
}

.summary-paragraph {
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: 8px;
  border-left: 3px solid var(--color-gold-dark);
}

.para-title {
  font-size: 1rem;
  color: var(--color-gold);
  margin-bottom: var(--space-sm);
  letter-spacing: 2px;
}

.para-text {
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--color-text);
}
</style>
