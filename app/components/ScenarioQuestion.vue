<!-- app/components/ScenarioQuestion.vue -->
<script setup lang="ts">
import type { ScenarioQuestion } from '~/types'

defineProps<{
  question: ScenarioQuestion
  answer: number | null
}>()

const emit = defineEmits<{ answer: [optionIndex: number] }>()
</script>

<template>
  <div class="scenario-question">
    <p class="narrative">{{ question.narrative }}</p>
    <div class="options">
      <button
        v-for="(option, idx) in question.options"
        :key="option.label"
        class="option-card"
        :class="{ selected: answer === idx }"
        @click="emit('answer', idx)"
      >
        <span class="option-label">{{ option.label }}</span>
        <span class="option-text">{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scenario-question {
  width: 100%;
  padding: var(--space-xl) 0;
}

.narrative {
  font-size: 1.2rem;
  line-height: 1.9;
  color: var(--color-text);
  text-align: center;
  margin-bottom: var(--space-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 600px;
  margin: 0 auto;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  border: 1px solid transparent;
  border-radius: 8px;
  text-align: left;
  transition: all var(--transition-fast);
  color: var(--color-text);
}

.option-card:hover {
  border-color: var(--color-gold-dark);
  background: var(--color-surface-hover);
  transform: translateX(4px);
}

.option-card.selected {
  border-color: var(--color-gold);
  background: rgba(201, 168, 76, 0.1);
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.2);
  transform: translateX(4px);
}

.option-label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gold);
  min-width: 28px;
  flex-shrink: 0;
}

.option-text {
  font-size: 1rem;
  line-height: 1.6;
}
</style>
