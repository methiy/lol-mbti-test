<!-- app/components/ScaleQuestion.vue -->
<script setup lang="ts">
import type { ScaleQuestion } from '~/types'

defineProps<{
  question: ScaleQuestion
  answer: number | null
}>()

const emit = defineEmits<{ answer: [value: number] }>()

const options = [
  { value: 1, label: '非常不符合', size: 48 },
  { value: 2, label: '比较不符合', size: 40 },
  { value: 3, label: '一般', size: 32 },
  { value: 4, label: '比较符合', size: 40 },
  { value: 5, label: '非常符合', size: 48 },
]
</script>

<template>
  <div class="scale-question">
    <p class="question-text">「{{ question.text }}」</p>
    <div class="options">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="option-btn"
        :class="{ selected: answer === opt.value }"
        :style="{ width: `${opt.size}px`, height: `${opt.size}px` }"
        :title="opt.label"
        @click="emit('answer', opt.value)"
      >
        <span class="option-dot" />
      </button>
    </div>
    <div class="option-labels">
      <span>非常不符合</span>
      <span>非常符合</span>
    </div>
  </div>
</template>

<style scoped>
.scale-question {
  text-align: center;
  width: 100%;
  padding: var(--space-xl) 0;
}

.question-text {
  font-size: 1.3rem;
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: var(--space-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}

.option-btn {
  border-radius: 50%;
  border: 2px solid var(--color-text-muted);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  position: relative;
}

.option-btn:hover {
  border-color: var(--color-gold);
  background: rgba(201, 168, 76, 0.1);
  transform: scale(1.1);
}

.option-btn.selected {
  border-color: var(--color-gold);
  background: rgba(201, 168, 76, 0.2);
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.4);
}

.option-dot {
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: transparent;
  transition: background var(--transition-fast);
}

.option-btn.selected .option-dot {
  background: var(--color-gold);
}

.option-labels {
  display: flex;
  justify-content: space-between;
  max-width: 360px;
  margin: 0 auto;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
