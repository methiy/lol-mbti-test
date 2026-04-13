<script setup lang="ts">
import type { Theme } from '~/composables/useQuiz'

defineEmits<{ start: [theme: Theme] }>()
</script>

<template>
  <div class="welcome">
    <h1>你属于哪片土地？</h1>
    <p class="subtitle">选择你的世界</p>

    <div class="theme-cards">
      <button class="theme-card lol-card" @click="$emit('start', 'lol')">
        <div class="card-icon">⚔️</div>
        <h2 class="card-title">符文大陆</h2>
        <p class="card-subtitle">英雄联盟性格测试</p>
        <p class="card-desc">在瓦洛兰大陆找到你的城邦归属与英雄共鸣</p>
      </button>

      <button class="theme-card op-card" @click="$emit('start', 'onepiece')">
        <div class="card-icon">🏴‍☠️</div>
        <h2 class="card-title">伟大航路</h2>
        <p class="card-subtitle">海贼王性格测试</p>
        <p class="card-desc">在大海上找到你的阵营归属与角色共鸣</p>
      </button>
    </div>

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

.theme-cards {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.theme-card {
  width: 260px;
  padding: var(--space-xl) var(--space-lg);
  border-radius: 12px;
  background: var(--color-surface);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.lol-card {
  border-color: rgba(70, 130, 200, 0.3);
}

.lol-card:hover {
  border-color: rgba(70, 130, 200, 0.7);
  box-shadow: 0 8px 30px rgba(70, 130, 200, 0.15);
}

.op-card {
  border-color: rgba(200, 60, 60, 0.3);
}

.op-card:hover {
  border-color: rgba(200, 60, 60, 0.7);
  box-shadow: 0 8px 30px rgba(200, 60, 60, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-gold);
  margin-bottom: var(--space-xs);
}

.lol-card .card-title {
  color: #6baed6;
}

.op-card .card-title {
  color: #e57373;
}

.card-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.card-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.meta {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-top: var(--space-lg);
}
</style>
