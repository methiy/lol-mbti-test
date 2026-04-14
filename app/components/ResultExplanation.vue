<!-- app/components/ResultExplanation.vue -->
<script setup lang="ts">
import type { DimensionEvidence } from '~/types'
import { dimensions } from '~/data/dimensions'

const props = defineProps<{ evidence: DimensionEvidence[] }>()

const isExpanded = ref(false)

const ANSWER_LABELS: Record<number, string> = {
  1: '非常不符合',
  2: '比较不符合',
  3: '一般',
  4: '比较符合',
  5: '非常符合',
}

/** Get the display name for a dimension */
function getDimensionName(dimId: string) {
  const dim = dimensions.find((d) => d.id === dimId)
  return dim ? `${dim.lowLabel} ⟷ ${dim.highLabel}` : dimId
}

function getDimensionHighLabel(dimId: string) {
  const dim = dimensions.find((d) => d.id === dimId)
  return dim?.highLabel ?? dimId
}

function getDimensionLowLabel(dimId: string) {
  const dim = dimensions.find((d) => d.id === dimId)
  return dim?.lowLabel ?? dimId
}

/** Get the most influential contributions for a dimension (top 2-3) */
function getKeyContributions(ev: DimensionEvidence) {
  // Sort scale contributions by extremeness (distance from neutral)
  const scaleItems = [...ev.scaleContributions]
    .sort((a, b) => Math.abs(b.effectiveScore - 3) - Math.abs(a.effectiveScore - 3))
    .slice(0, 2)

  // Sort scenario contributions by weight magnitude
  const scenarioItems = [...ev.scenarioContributions]
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 2)

  return { scaleItems, scenarioItems }
}

function getDirectionText(dimId: string, direction: 'towards_high' | 'towards_low' | 'neutral') {
  if (direction === 'neutral') return '中立'
  if (direction === 'towards_high') return `倾向${getDimensionHighLabel(dimId)}`
  return `倾向${getDimensionLowLabel(dimId)}`
}

/** Truncate narrative text */
function truncate(text: string, maxLen = 30) {
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text
}

const sortedEvidence = computed(() => {
  return [...props.evidence].sort((a, b) => {
    // Sort by distance from midpoint (most extreme first)
    return Math.abs(b.finalScore - 5.5) - Math.abs(a.finalScore - 5.5)
  })
})
</script>

<template>
  <div class="result-explanation">
    <button class="toggle-btn" @click="isExpanded = !isExpanded">
      <span class="toggle-icon" :class="{ expanded: isExpanded }">▸</span>
      <span class="toggle-text">为什么是这个结果？</span>
    </button>

    <Transition name="expand">
      <div v-if="isExpanded" class="explanation-content">
        <p class="explanation-intro">
          以下是你的回答如何影响了各维度得分的详细分析：
        </p>

        <div v-for="ev in sortedEvidence" :key="ev.dimensionId" class="dimension-evidence">
          <div class="evidence-header">
            <span class="evidence-dim-name">{{ getDimensionName(ev.dimensionId) }}</span>
            <span class="evidence-score">{{ ev.finalScore.toFixed(1) }}</span>
            <div class="evidence-bar">
              <div class="evidence-fill" :style="{ width: `${ev.finalScore * 10}%` }" />
            </div>
          </div>

          <div class="contributions">
            <!-- Scale question contributions -->
            <div
              v-for="(item, idx) in getKeyContributions(ev).scaleItems"
              :key="`scale-${idx}`"
              class="contribution-item"
            >
              <span class="contribution-type scale-tag">量表</span>
              <div class="contribution-detail">
                <p class="contribution-question">「{{ item.questionText }}」</p>
                <p class="contribution-answer">
                  你选择了
                  <strong>{{ ANSWER_LABELS[item.answer] ?? item.answer }}</strong>
                  <span class="direction-tag" :class="item.direction">
                    {{ getDirectionText(ev.dimensionId, item.direction) }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Scenario question contributions -->
            <div
              v-for="(item, idx) in getKeyContributions(ev).scenarioItems"
              :key="`scenario-${idx}`"
              class="contribution-item"
            >
              <span class="contribution-type scenario-tag">情景</span>
              <div class="contribution-detail">
                <p class="contribution-question">「{{ truncate(item.narrative) }}」</p>
                <p class="contribution-answer">
                  你选择了「{{ item.chosenOption }}」
                  <span class="direction-tag" :class="item.direction">
                    {{ getDirectionText(ev.dimensionId, item.direction) }}
                  </span>
                </p>
              </div>
            </div>

            <p v-if="getKeyContributions(ev).scaleItems.length === 0 && getKeyContributions(ev).scenarioItems.length === 0" class="no-data">
              该维度数据较少，得分基于有限的参考回归到中间值。
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.result-explanation {
  width: 100%;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  border: 1px solid rgba(168, 152, 128, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
}

.toggle-btn:hover {
  border-color: var(--color-gold);
  background: rgba(201, 168, 76, 0.05);
}

.toggle-icon {
  color: var(--color-gold);
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  display: inline-block;
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

.toggle-text {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-gold);
  letter-spacing: 2px;
}

.explanation-content {
  margin-top: var(--space-md);
  overflow: hidden;
}

.explanation-intro {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  padding: 0 var(--space-sm);
}

.dimension-evidence {
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--color-surface);
  border-radius: 8px;
  border-left: 3px solid var(--color-gold-dark);
}

.evidence-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.evidence-dim-name {
  font-weight: 600;
  color: var(--color-gold);
  min-width: 100px;
  font-size: 0.9rem;
}

.evidence-score {
  font-weight: 700;
  color: var(--color-gold-light);
  min-width: 32px;
  font-size: 0.85rem;
}

.evidence-bar {
  flex: 1;
  height: 3px;
  background: rgba(168, 152, 128, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.evidence-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold-dark), var(--color-gold));
  border-radius: 2px;
  transition: width 0.6s ease;
}

.contributions {
  padding-left: var(--space-sm);
}

.contribution-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  padding: var(--space-sm);
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
}

.contribution-type {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  white-space: nowrap;
  margin-top: 2px;
}

.scale-tag {
  background: rgba(106, 142, 107, 0.3);
  color: #8fbf8f;
}

.scenario-tag {
  background: rgba(147, 112, 219, 0.3);
  color: #b89bef;
}

.contribution-detail {
  flex: 1;
  min-width: 0;
}

.contribution-question {
  font-size: 0.85rem;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 2px;
}

.contribution-answer {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.contribution-answer strong {
  color: var(--color-gold-light);
}

.direction-tag {
  display: inline-block;
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 4px;
}

.direction-tag.towards_high {
  background: rgba(201, 168, 76, 0.2);
  color: var(--color-gold);
}

.direction-tag.towards_low {
  background: rgba(106, 142, 180, 0.2);
  color: #7ba8cc;
}

.direction-tag.neutral {
  background: rgba(168, 152, 128, 0.2);
  color: var(--color-text-muted);
}

.no-data {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-style: italic;
  padding: var(--space-sm) 0;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease;
  max-height: 5000px;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}
</style>
