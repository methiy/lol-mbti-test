<!-- app/components/LoadingTransition.vue -->
<script setup lang="ts">
const emit = defineEmits<{ complete: [] }>()

onMounted(() => {
  setTimeout(() => {
    emit('complete')
  }, 2500)
})
</script>

<template>
  <div class="loading">
    <div class="rune-spinner">
      <svg viewBox="0 0 100 100" class="rune-svg">
        <circle cx="50" cy="50" r="40" class="rune-circle" />
        <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M78 22 L22 78" class="rune-lines" />
      </svg>
    </div>
    <p class="loading-text">符文正在解读你的命运...</p>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--space-xl);
}

.rune-spinner {
  width: 120px;
  height: 120px;
  animation: spin 4s linear infinite;
}

.rune-svg {
  width: 100%;
  height: 100%;
}

.rune-circle {
  fill: none;
  stroke: var(--color-gold);
  stroke-width: 1.5;
  stroke-dasharray: 251;
  stroke-dashoffset: 0;
  animation: pulse 2s ease-in-out infinite;
}

.rune-lines {
  fill: none;
  stroke: var(--color-gold-dark);
  stroke-width: 1;
  opacity: 0.6;
}

.loading-text {
  font-size: 1.2rem;
  color: var(--color-gold);
  letter-spacing: 4px;
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { stroke-opacity: 0.4; }
  50% { stroke-opacity: 1; }
}

@keyframes textPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
