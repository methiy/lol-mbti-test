<!-- app/components/DimensionReadings.vue -->
<script setup lang="ts">
import type { DimensionVector } from '~/types'
import { dimensions } from '~/data/dimensions'
import { dimensionTexts } from '~/data/dimensionTexts'

const props = defineProps<{ scores: DimensionVector }>()

function getRange(score: number): 'low' | 'mid' | 'high' {
  if (score <= 3.5) return 'low'
  if (score <= 6.5) return 'mid'
  return 'high'
}

const readings = computed(() =>
  dimensions.map((dim) => {
    const score = props.scores[dim.id]
    const range = getRange(score)
    const textEntry = dimensionTexts.find(
      (t) => t.dimensionId === dim.id && t.range === range,
    )
    return {
      dim,
      score,
      text: textEntry?.text ?? '',
    }
  }),
)
</script>

<template>
  <div class="dimension-readings">
    <h3 class="section-title">维度解读</h3>
    <div v-for="reading in readings" :key="reading.dim.id" class="reading-item">
      <div class="reading-header">
        <span class="dim-label">{{ reading.dim.highLabel }}</span>
        <span class="dim-score">{{ reading.score.toFixed(1) }}</span>
        <div class="score-bar">
          <div class="score-fill" :style="{ width: `${reading.score * 10}%` }" />
        </div>
      </div>
      <p class="reading-text">{{ reading.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.dimension-readings {
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

.reading-item {
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--color-surface);
  border-radius: 8px;
  border-left: 3px solid var(--color-gold-dark);
}

.reading-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.dim-label {
  font-weight: 600;
  color: var(--color-gold);
  min-width: 40px;
}

.dim-score {
  font-weight: 700;
  color: var(--color-gold-light);
  min-width: 32px;
  font-size: 0.9rem;
}

.score-bar {
  flex: 1;
  height: 4px;
  background: rgba(168, 152, 128, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold-dark), var(--color-gold));
  border-radius: 2px;
  transition: width 1s ease;
}

.reading-text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}
</style>
