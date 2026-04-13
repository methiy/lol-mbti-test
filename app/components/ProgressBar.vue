<!-- app/components/ProgressBar.vue -->
<script setup lang="ts">
const props = defineProps<{
  current: number
  total: number
  progress: number
  label: string
  answers: readonly (number | null)[]
}>()

const emit = defineEmits<{ goTo: [index: number] }>()

const progressPercent = computed(() => `${props.progress * 100}%`)
</script>

<template>
  <div class="progress-bar">
    <div class="progress-header">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-count">{{ current }} / {{ total }}</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progressPercent }" />
      <div class="progress-dots">
        <button
          v-for="(answer, i) in answers"
          :key="i"
          class="progress-dot"
          :class="{
            answered: answer !== null,
            current: i === current - 1,
          }"
          :title="`第 ${i + 1} 题`"
          @click="emit('goTo', i)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  margin-bottom: var(--space-xl);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.progress-label {
  font-size: 0.85rem;
  color: var(--color-gold);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.progress-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.progress-track {
  position: relative;
  height: 6px;
  background: var(--color-surface);
  border-radius: 3px;
  overflow: visible;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold-dark), var(--color-gold));
  border-radius: 3px;
  transition: width var(--transition-normal);
}

.progress-dots {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-text-muted);
  padding: 0;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.progress-dot:hover {
  transform: scale(1.5);
  border-color: var(--color-gold);
}

.progress-dot.answered {
  background: var(--color-gold);
  border-color: var(--color-gold);
}

.progress-dot.current {
  background: var(--color-gold-light);
  border-color: var(--color-gold-light);
  transform: scale(1.5);
  box-shadow: 0 0 6px rgba(201, 168, 76, 0.5);
}
</style>
