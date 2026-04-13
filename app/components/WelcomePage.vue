<script setup lang="ts">
defineEmits<{ start: [] }>()
</script>

<template>
  <div class="welcome">
    <h1>你属于哪片土地？</h1>
    <p class="subtitle">基于符文大陆世界观的性格测试</p>
    <button class="start-btn" @click="$emit('start')">开始测试</button>
    <p class="meta">约 5-8 分钟 · 32 道题</p>
  </div>
</template>

<style scoped>
.welcome {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
}

.welcome h1 {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--color-gold);
  margin-bottom: var(--space-md);
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 1.1rem;
  margin-bottom: var(--space-xl);
}

.start-btn {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold));
  color: var(--color-bg);
  font-size: 1.2rem;
  font-weight: 600;
  padding: var(--space-md) var(--space-xl);
  border-radius: 4px;
  transition: all var(--transition-fast);
  letter-spacing: 2px;
}

.start-btn:hover {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
}

.meta {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-top: var(--space-lg);
}
</style>
