<!-- app/components/ResultPage.vue -->
<script setup lang="ts">
import type { MatchResult } from '~/types'

const emit = defineEmits<{ restart: [] }>()

const { scaleAnswers, scenarioAnswers } = useQuiz()
const { calculateScores } = useScoring()
const { getMatchResult } = useMatching()

const result = computed<MatchResult>(() => {
  const scores = calculateScores(
    scaleAnswers.value as (number | null)[],
    scenarioAnswers.value as (number | null)[],
  )
  return getMatchResult(scores)
})
</script>

<template>
  <div class="result-page">
    <!-- Region banner -->
    <section class="result-section region-banner">
      <h2 class="region-name">{{ result.region.name }}</h2>
      <p class="region-name-en">{{ result.region.nameEn }}</p>
      <p class="region-desc">{{ result.region.description }}</p>
    </section>

    <!-- Radar chart -->
    <section class="result-section">
      <RadarChart :scores="result.dimensionScores" />
    </section>

    <!-- Dimension readings -->
    <section class="result-section">
      <DimensionReadings :scores="result.dimensionScores" />
    </section>

    <!-- Hero cards -->
    <section class="result-section">
      <HeroCard :top-heroes="result.topHeroes" :region="result.region" />
    </section>

    <!-- Summary text -->
    <section class="result-section">
      <SummaryText :result="result" />
    </section>

    <!-- Share & restart -->
    <section class="result-section actions">
      <ShareCard :result="result" />
      <button class="restart-btn" @click="emit('restart')">重新测试</button>
    </section>
  </div>
</template>

<style scoped>
.result-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

.result-section {
  margin-bottom: var(--space-2xl);
}

.region-banner {
  text-align: center;
  padding: var(--space-2xl) 0;
}

.region-name {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--color-gold);
  margin-bottom: var(--space-xs);
}

.region-name-en {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-text-muted);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: var(--space-lg);
}

.region-desc {
  font-size: 1.1rem;
  color: var(--color-text);
  max-width: 500px;
  margin: 0 auto;
}

.actions {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.restart-btn {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-text-muted);
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.restart-btn:hover {
  color: var(--color-gold);
  border-color: var(--color-gold);
}
</style>
