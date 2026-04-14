<!-- app/components/ResultPage.vue -->
<script setup lang="ts">
import type { DimensionEvidence, MatchResult, ScaleQuestion, ScenarioQuestion } from '~/types'
import { regions as lolRegions } from '~/data/regions'
import { heroes as lolHeroes } from '~/data/heroes'
import { factions as opFactions } from '~/data/onepiece/factions'
import { characters as opCharacters } from '~/data/onepiece/characters'

const emit = defineEmits<{ restart: [] }>()

const { theme, scaleAnswers, scenarioAnswers, activeScaleQuestions, activeScenarioQuestions } = useQuiz()
const { calculateScoresWithEvidence } = useScoring()
const { getMatchResult } = useMatching()

const activeRegions = computed(() => theme.value === 'lol' ? lolRegions : opFactions)
const activeHeroes = computed(() => theme.value === 'lol' ? lolHeroes : opCharacters)

const scoringResult = computed(() => {
  return calculateScoresWithEvidence(
    scaleAnswers.value as (number | null)[],
    scenarioAnswers.value as (number | null)[],
    activeScaleQuestions.value as ScaleQuestion[],
    activeScenarioQuestions.value as ScenarioQuestion[],
  )
})

const result = computed<MatchResult>(() => {
  const { scores, evidence } = scoringResult.value
  const matchResult = getMatchResult(scores, activeRegions.value, activeHeroes.value)
  return { ...matchResult, evidence }
})

const evidence = computed<DimensionEvidence[]>(() => scoringResult.value.evidence)

const sectionRefs = ref<HTMLElement[]>([])
const visibleSections = ref<Set<number>>(new Set())

function setSectionRef(el: any, index: number) {
  if (el) sectionRefs.value[index] = el
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = sectionRefs.value.indexOf(entry.target as HTMLElement)
        if (entry.isIntersecting && index >= 0) {
          visibleSections.value.add(index)
        }
      })
    },
    { threshold: 0.15 },
  )

  nextTick(() => {
    sectionRefs.value.forEach((el) => {
      if (el) observer.observe(el)
    })
  })

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div class="result-page">
    <!-- Region banner -->
    <section
      :ref="(el) => setSectionRef(el, 0)"
      class="result-section region-banner"
      :class="{ visible: visibleSections.has(0) }"
    >
      <h2 class="region-name">{{ result.region.name }}</h2>
      <p class="region-name-en">{{ result.region.nameEn }}</p>
      <p class="region-desc">{{ result.region.description }}</p>
    </section>

    <!-- Radar chart -->
    <section
      :ref="(el) => setSectionRef(el, 1)"
      class="result-section"
      :class="{ visible: visibleSections.has(1) }"
    >
      <RadarChart :scores="result.dimensionScores" />
    </section>

    <!-- Dimension readings -->
    <section
      :ref="(el) => setSectionRef(el, 2)"
      class="result-section"
      :class="{ visible: visibleSections.has(2) }"
    >
      <DimensionReadings :scores="result.dimensionScores" />
    </section>

    <!-- Result explanation -->
    <section
      :ref="(el) => setSectionRef(el, 3)"
      class="result-section"
      :class="{ visible: visibleSections.has(3) }"
    >
      <ResultExplanation :evidence="evidence" />
    </section>

    <!-- Hero cards -->
    <section
      :ref="(el) => setSectionRef(el, 4)"
      class="result-section"
      :class="{ visible: visibleSections.has(4) }"
    >
      <HeroCard :top-heroes="result.topHeroes" :region="result.region" />
    </section>

    <!-- Summary text -->
    <section
      :ref="(el) => setSectionRef(el, 5)"
      class="result-section"
      :class="{ visible: visibleSections.has(5) }"
    >
      <SummaryText :result="result" />
    </section>

    <!-- Share & restart -->
    <section
      :ref="(el) => setSectionRef(el, 6)"
      class="result-section actions"
      :class="{ visible: visibleSections.has(6) }"
    >
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
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.result-section.visible {
  opacity: 1;
  transform: translateY(0);
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
