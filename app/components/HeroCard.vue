<!-- app/components/HeroCard.vue -->
<script setup lang="ts">
import type { Hero, Region } from '~/types'
import { regions } from '~/data/regions'

defineProps<{
  topHeroes: { hero: Hero, similarity: number }[]
  region: Region
}>()

function similarityPercent(similarity: number): string {
  return `${Math.round(similarity * 100)}%`
}

function getHeroRegion(hero: Hero): Region | undefined {
  return regions.find((r) => r.id === hero.regionId)
}
</script>

<template>
  <div class="hero-card-section">
    <h3 class="section-title">英雄共鸣</h3>

    <!-- Main hero -->
    <div v-if="topHeroes[0]" class="main-hero">
      <div class="hero-badge" :style="{ borderColor: region.badgeColor }">
        <span class="hero-initial">{{ topHeroes[0].hero.name[0] }}</span>
      </div>
      <h4 class="hero-name">{{ topHeroes[0].hero.name }}</h4>
      <p class="hero-title">{{ topHeroes[0].hero.title }}</p>
      <p class="hero-region">{{ getHeroRegion(topHeroes[0].hero)?.name ?? region.name }} · {{ topHeroes[0].hero.nameEn }}</p>
      <div class="match-badge">匹配度 {{ similarityPercent(topHeroes[0].similarity) }}</div>
      <p class="hero-desc">{{ topHeroes[0].hero.description }}</p>
    </div>

    <!-- Secondary heroes -->
    <div class="secondary-heroes">
      <div v-for="item in topHeroes.slice(1)" :key="item.hero.id" class="secondary-hero">
        <div class="secondary-badge">
          <span>{{ item.hero.name[0] }}</span>
        </div>
        <div class="secondary-info">
          <p class="secondary-name">{{ item.hero.name }} · {{ item.hero.title }}</p>
          <p class="secondary-match">匹配度 {{ similarityPercent(item.similarity) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-card-section {
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

.main-hero {
  text-align: center;
  padding: var(--space-xl);
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid rgba(201, 168, 76, 0.2);
  margin-bottom: var(--space-lg);
}

.hero-badge {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--color-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-md);
  background: var(--color-bg);
}

.hero-initial {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-gold);
}

.hero-name {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.hero-title {
  font-size: 0.95rem;
  color: var(--color-gold);
  margin-bottom: var(--space-xs);
}

.hero-region {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.match-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-md);
  background: rgba(201, 168, 76, 0.15);
  border: 1px solid var(--color-gold-dark);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-gold);
  margin-bottom: var(--space-md);
}

.hero-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  max-width: 500px;
  margin: 0 auto;
}

.secondary-heroes {
  display: flex;
  gap: var(--space-md);
}

.secondary-hero {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-surface);
  border-radius: 8px;
}

.secondary-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--color-gold-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  color: var(--color-gold);
  font-family: var(--font-display);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.secondary-info {
  min-width: 0;
}

.secondary-name {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 2px;
}

.secondary-match {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
