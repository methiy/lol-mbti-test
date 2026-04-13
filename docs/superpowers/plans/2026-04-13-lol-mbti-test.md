# LoL MBTI 性格测试网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 4 single-page personality test website that maps users to LoL regions and champions via 8 custom dimensions, with radar chart visualization, rich text summaries, and shareable result images.

**Architecture:** Nuxt 4 (Vue 3) static site. All quiz data, scoring, and matching logic runs client-side. State managed via Vue composables. Canvas-based radar chart. html2canvas for share image generation.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Canvas API, html2canvas

---

## File Structure

```
app/
├── app.vue                        # Root component — minimal shell, loads NuxtPage
├── pages/
│   └── index.vue                  # Scene manager — switches between 5 scenes via reactive state
├── components/
│   ├── WelcomePage.vue            # Landing page with title + start button
│   ├── ScaleQuestion.vue          # Single scale question (statement + 5 Likert buttons)
│   ├── ScenarioQuestion.vue       # Single scenario question (narrative + 4 option cards)
│   ├── ProgressBar.vue            # Parchment-scroll progress indicator
│   ├── LoadingTransition.vue      # "Runes are reading your fate..." animation
│   ├── ResultPage.vue             # Result page container — scrollable, orchestrates sub-components
│   ├── RadarChart.vue             # 8-axis radar chart (Canvas)
│   ├── DimensionReadings.vue      # 8 dimension interpretation lines
│   ├── HeroCard.vue               # Champion match card (main + secondary)
│   ├── SummaryText.vue            # 4-paragraph personality summary
│   └── ShareCard.vue              # Hidden share image card (750×1334) + download logic
├── composables/
│   ├── useQuiz.ts                 # Quiz state: current index, answers array, scene transitions
│   ├── useScoring.ts              # Scoring: raw → normalized per dimension, weighted merge
│   └── useMatching.ts             # Cosine similarity matching for regions + champions
├── data/
│   ├── dimensions.ts              # 8 dimension definitions (id, name, lowLabel, highLabel)
│   ├── scaleQuestions.ts          # 24 scale questions with dimension + reverse flag
│   ├── scenarioQuestions.ts       # 8 scenario questions with weighted options
│   ├── regions.ts                 # 10 regions with 8D vectors + metadata
│   ├── heroes.ts                  # ~30 heroes with 8D vectors + metadata
│   ├── dimensionTexts.ts         # 8×3 = 24 dimension reading texts
│   └── summaryTemplates.ts        # 4-paragraph summary templates per dimension combo
├── types/
│   └── index.ts                   # All TypeScript interfaces
├── assets/
│   ├── textures/
│   │   └── parchment.png          # Parchment background texture
│   └── icons/                     # Region badge SVGs (10 files)
└── styles/
    └── global.css                 # CSS variables, fonts, base styles
nuxt.config.ts                     # Nuxt config with compatibility date, app head, css
```

---

### Task 1: Project Scaffolding & Nuxt 4 Setup

**Files:**
- Create: `package.json`
- Create: `nuxt.config.ts`
- Create: `tsconfig.json`
- Create: `app/app.vue`
- Create: `app/pages/index.vue`
- Create: `app/styles/global.css`

- [ ] **Step 1: Initialize Nuxt 4 project**

Run:
```bash
cd /data/workspace/mbti-test
npx nuxi@latest init . --force --packageManager npm
```

- [ ] **Step 2: Verify nuxt.config.ts has Nuxt 4 compatibility**

Replace `nuxt.config.ts` with:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  app: {
    head: {
      title: '你属于哪片土地？— LoL 性格测试',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '基于符文大陆世界观的性格测试，发现你的城邦归属和英雄共鸣' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Cinzel:wght@400;600;700&display=swap',
        },
      ],
    },
  },
  css: ['~/styles/global.css'],
})
```

- [ ] **Step 3: Create global CSS with theme variables and base styles**

```css
/* app/styles/global.css */
:root {
  /* Color palette — parchment & gold fantasy theme */
  --color-bg: #1a1410;
  --color-bg-parchment: #2a2118;
  --color-surface: #352a20;
  --color-surface-hover: #3f3228;
  --color-gold: #c9a84c;
  --color-gold-light: #e8d48b;
  --color-gold-dark: #8b7332;
  --color-text: #e8dcc8;
  --color-text-muted: #a89880;
  --color-accent: #8b1a1a;
  --color-accent-light: #b33030;

  /* Typography */
  --font-serif: 'Noto Serif SC', 'Cinzel', Georgia, serif;
  --font-display: 'Cinzel', 'Noto Serif SC', Georgia, serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.4s ease;
  --transition-slow: 0.8s ease;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-serif);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.7;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Parchment noise overlay applied to body via pseudo-element */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(%23n)" opacity="0.06"/></svg>');
  pointer-events: none;
  z-index: 9999;
}

button {
  font-family: var(--font-serif);
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: var(--color-gold);
  text-decoration: none;
}
```

- [ ] **Step 4: Create minimal app.vue**

```vue
<!-- app/app.vue -->
<template>
  <NuxtPage />
</template>
```

- [ ] **Step 5: Create skeleton index.vue with scene management**

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
const scene = ref<'welcome' | 'scale' | 'scenario' | 'loading' | 'result'>('welcome')

function startQuiz() {
  scene.value = 'scale'
}

function onScaleComplete() {
  scene.value = 'scenario'
}

function onScenarioComplete() {
  scene.value = 'loading'
}

function onLoadingComplete() {
  scene.value = 'result'
}

function restart() {
  scene.value = 'welcome'
}
</script>

<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <WelcomePage v-if="scene === 'welcome'" @start="startQuiz" />
      <div v-else-if="scene === 'scale'" key="scale">
        <p>量表题阶段（待实现）</p>
        <button @click="onScaleComplete">跳过</button>
      </div>
      <div v-else-if="scene === 'scenario'" key="scenario">
        <p>情景题阶段（待实现）</p>
        <button @click="onScenarioComplete">跳过</button>
      </div>
      <div v-else-if="scene === 'loading'" key="loading">
        <p>加载中...（待实现）</p>
        <button @click="onLoadingComplete">跳过</button>
      </div>
      <div v-else-if="scene === 'result'" key="result">
        <p>结果页（待实现）</p>
        <button @click="restart">重新测试</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

- [ ] **Step 6: Create WelcomePage placeholder**

```vue
<!-- app/components/WelcomePage.vue -->
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
```

- [ ] **Step 7: Install dependencies and verify dev server starts**

Run:
```bash
cd /data/workspace/mbti-test && npm install && npm run dev -- --host 2>&1 | head -20
```

Expected: Dev server starts on http://localhost:3000 with no errors.

- [ ] **Step 8: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 9: Commit**

```bash
cd /data/workspace/mbti-test
git add -A
git commit -m "feat: scaffold Nuxt 4 project with theme, scene management, welcome page"
```

---

### Task 2: TypeScript Types & Data Definitions

**Files:**
- Create: `app/types/index.ts`
- Create: `app/data/dimensions.ts`
- Create: `app/data/scaleQuestions.ts`
- Create: `app/data/scenarioQuestions.ts`
- Create: `app/data/regions.ts`
- Create: `app/data/heroes.ts`
- Create: `app/data/dimensionTexts.ts`
- Create: `app/data/summaryTemplates.ts`

- [ ] **Step 1: Create type definitions**

```ts
// app/types/index.ts

/** The 8 dimension IDs */
export type DimensionId =
  | 'chaos'      // 秩序⟷混沌
  | 'intuition'  // 理性⟷直觉
  | 'bond'       // 独行⟷羁绊
  | 'conquest'   // 和平⟷征服
  | 'explore'    // 守护⟷探索
  | 'shadow'     // 光明⟷暗影
  | 'agility'    // 坚韧⟷灵巧
  | 'ideal'      // 务实⟷理想

/** 8-dimensional vector: scores 1-10 for each dimension's high end */
export type DimensionVector = Record<DimensionId, number>

export interface Dimension {
  id: DimensionId
  name: string       // e.g. "秩序 ⟷ 混沌"
  lowLabel: string   // e.g. "秩序"
  highLabel: string  // e.g. "混沌"
}

export interface ScaleQuestion {
  id: number
  text: string               // The statement
  dimensionId: DimensionId   // Which dimension this question measures
  reverse: boolean           // true = statement describes low-end, score is inverted
}

export interface ScenarioOption {
  label: string              // "A" | "B" | "C" | "D"
  text: string               // Option description
  weights: Partial<DimensionVector>  // Dimension score adjustments
}

export interface ScenarioQuestion {
  id: number
  narrative: string          // The scenario description
  options: [ScenarioOption, ScenarioOption, ScenarioOption, ScenarioOption]
}

export interface Region {
  id: string
  name: string               // e.g. "德玛西亚"
  nameEn: string             // e.g. "Demacia"
  description: string        // One-line description
  lore: string               // 2-3 sentence lore for summary paragraph 2
  vector: DimensionVector
  badgeColor: string         // Primary color for badge
}

export interface Hero {
  id: string
  name: string               // e.g. "盖伦"
  nameEn: string             // e.g. "Garen"
  title: string              // e.g. "德玛西亚之力"
  regionId: string           // Foreign key to Region.id
  vector: DimensionVector
  description: string        // 2-3 sentences about this champion's personality
  lore: string               // Background story snippet for summary paragraph 3
}

export interface DimensionText {
  dimensionId: DimensionId
  range: 'low' | 'mid' | 'high'  // 1-3, 4-6, 7-10
  text: string
}

export interface SummaryTemplate {
  /** Which paragraph: 1=personality, 2=region, 3=hero, 4=growth */
  paragraph: 1 | 2 | 3 | 4
  /** Which dimension(s) trigger this template */
  condition: {
    dimensionId: DimensionId
    range: 'low' | 'mid' | 'high'
  }
  text: string  // Template with placeholders: {regionName}, {heroName}, {heroTitle}, {dimensionHigh}
}

export interface MatchResult {
  region: Region
  regionSimilarity: number        // 0-1
  topHeroes: {
    hero: Hero
    similarity: number            // 0-1
  }[]
  dimensionScores: DimensionVector
}
```

- [ ] **Step 2: Create dimension definitions**

```ts
// app/data/dimensions.ts
import type { Dimension, DimensionId } from '~/types'

export const DIMENSION_IDS: DimensionId[] = [
  'chaos', 'intuition', 'bond', 'conquest', 'explore', 'shadow', 'agility', 'ideal',
]

export const dimensions: Dimension[] = [
  { id: 'chaos', name: '秩序 ⟷ 混沌', lowLabel: '秩序', highLabel: '混沌' },
  { id: 'intuition', name: '理性 ⟷ 直觉', lowLabel: '理性', highLabel: '直觉' },
  { id: 'bond', name: '独行 ⟷ 羁绊', lowLabel: '独行', highLabel: '羁绊' },
  { id: 'conquest', name: '和平 ⟷ 征服', lowLabel: '和平', highLabel: '征服' },
  { id: 'explore', name: '守护 ⟷ 探索', lowLabel: '守护', highLabel: '探索' },
  { id: 'shadow', name: '光明 ⟷ 暗影', lowLabel: '光明', highLabel: '暗影' },
  { id: 'agility', name: '坚韧 ⟷ 灵巧', lowLabel: '坚韧', highLabel: '灵巧' },
  { id: 'ideal', name: '务实 ⟷ 理想', lowLabel: '务实', highLabel: '理想' },
]
```

- [ ] **Step 3: Create 24 scale questions**

```ts
// app/data/scaleQuestions.ts
import type { ScaleQuestion } from '~/types'

export const scaleQuestions: ScaleQuestion[] = [
  // ===== chaos (秩序⟷混沌) =====
  { id: 1, text: '比起遵守既定规则，我更倾向于按自己的方式行事。', dimensionId: 'chaos', reverse: false },
  { id: 2, text: '我认为社会需要明确的规章制度来维持秩序。', dimensionId: 'chaos', reverse: true },
  { id: 3, text: '如果一条规则不合理，我会毫不犹豫地打破它。', dimensionId: 'chaos', reverse: false },

  // ===== intuition (理性⟷直觉) =====
  { id: 4, text: '做重要决定时，我更相信自己的直觉而非数据分析。', dimensionId: 'intuition', reverse: false },
  { id: 5, text: '面对复杂问题，我倾向于先制定详细的计划再行动。', dimensionId: 'intuition', reverse: true },
  { id: 6, text: '我常常在没有明确理由的情况下就能感知到事情的走向。', dimensionId: 'intuition', reverse: false },

  // ===== bond (独行⟷羁绊) =====
  { id: 7, text: '我宁愿和朋友一起失败，也不愿独自成功。', dimensionId: 'bond', reverse: false },
  { id: 8, text: '独自工作时我的效率最高。', dimensionId: 'bond', reverse: true },
  { id: 9, text: '我认为守护身边的人是最重要的事。', dimensionId: 'bond', reverse: false },

  // ===== conquest (和平⟷征服) =====
  { id: 10, text: '我享受竞争，并且总是想要赢。', dimensionId: 'conquest', reverse: false },
  { id: 11, text: '能用对话解决的冲突，我绝不会诉诸武力。', dimensionId: 'conquest', reverse: true },
  { id: 12, text: '力量是解决问题最直接有效的方式。', dimensionId: 'conquest', reverse: false },

  // ===== explore (守护⟷探索) =====
  { id: 13, text: '我总是对未知的事物充满好奇，渴望去探索。', dimensionId: 'explore', reverse: false },
  { id: 14, text: '我更喜欢待在熟悉的环境中，那让我感到安全。', dimensionId: 'explore', reverse: true },
  { id: 15, text: '即使有风险，新的体验对我来说也值得尝试。', dimensionId: 'explore', reverse: false },

  // ===== shadow (光明⟷暗影) =====
  { id: 16, text: '有时候达到正确的目的需要使用不那么光彩的手段。', dimensionId: 'shadow', reverse: false },
  { id: 17, text: '我坚信做事应该光明磊落，即使这样会更难。', dimensionId: 'shadow', reverse: true },
  { id: 18, text: '真正的高手懂得在暗处布局，不需要让所有人看到。', dimensionId: 'shadow', reverse: false },

  // ===== agility (坚韧⟷灵巧) =====
  { id: 19, text: '面对困难，我会灵活调整策略而非硬撑到底。', dimensionId: 'agility', reverse: false },
  { id: 20, text: '我相信坚持就是胜利，不会轻易改变自己的方向。', dimensionId: 'agility', reverse: true },
  { id: 21, text: '四两拨千金比正面硬刚更聪明。', dimensionId: 'agility', reverse: false },

  // ===== ideal (务实⟷理想) =====
  { id: 22, text: '我常常会为了一个遥远的理想而放弃眼前的利益。', dimensionId: 'ideal', reverse: false },
  { id: 23, text: '比起画饼，我更关心当下能得到什么。', dimensionId: 'ideal', reverse: true },
  { id: 24, text: '我相信信念的力量终将改变现实。', dimensionId: 'ideal', reverse: false },
]
```

- [ ] **Step 4: Create 8 scenario questions**

```ts
// app/data/scenarioQuestions.ts
import type { ScenarioQuestion } from '~/types'

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 1,
    narrative: '你的船队在比尔吉沃特港外遭遇海雾，前方隐约传来求救声。',
    options: [
      { label: 'A', text: '立刻驶向声源，有人需要帮助。', weights: { bond: 2, conquest: -1 } },
      { label: 'B', text: '先派斥候探查，确认不是陷阱再说。', weights: { intuition: -2, ideal: -1 } },
      { label: 'C', text: '绕道而行，我不会拿船员的命冒险。', weights: { explore: -2, ideal: -1 } },
      { label: 'D', text: '全速冲进去，海雾里说不定有宝藏！', weights: { explore: 2, chaos: 1 } },
    ],
  },
  {
    id: 2,
    narrative: '德玛西亚边境的村庄遭到袭击，你是附近唯一的战士。敌人数量远超你，但村民们正在呼救。',
    options: [
      { label: 'A', text: '毫不犹豫冲上去，哪怕以一敌百。', weights: { conquest: 2, bond: 1 } },
      { label: 'B', text: '先撤退搬救兵，活着才能救更多人。', weights: { intuition: -1, ideal: -1 } },
      { label: 'C', text: '利用地形设置陷阱，以智取胜。', weights: { agility: 2, shadow: 1 } },
      { label: 'D', text: '带领村民一起战斗，团结就是力量。', weights: { bond: 2, chaos: -1 } },
    ],
  },
  {
    id: 3,
    narrative: '你在皮尔特沃夫的实验室里发现了一项禁忌技术，它能带来巨大的力量，但也可能造成灾难。',
    options: [
      { label: 'A', text: '立刻销毁它，有些力量不该存在。', weights: { chaos: -2, ideal: 1 } },
      { label: 'B', text: '秘密研究它，知识本身没有善恶。', weights: { explore: 2, shadow: 1 } },
      { label: 'C', text: '上报给议会，让组织来决定。', weights: { chaos: -1, bond: 1 } },
      { label: 'D', text: '用它来增强自己的力量，机会难得。', weights: { conquest: 2, ideal: -1 } },
    ],
  },
  {
    id: 4,
    narrative: '艾欧尼亚的长老会议上，对于是否应该对诺克萨斯的入侵发起反攻，意见分裂。轮到你发言了。',
    options: [
      { label: 'A', text: '主和——以武止武只会让更多人受苦。', weights: { conquest: -2, ideal: 1 } },
      { label: 'B', text: '主战——必须让入侵者付出代价。', weights: { conquest: 2, chaos: 1 } },
      { label: 'C', text: '提议谈判——找到双方都能接受的方案。', weights: { agility: 1, bond: 1 } },
      { label: 'D', text: '建议暗中行动——表面和谈，背后削弱对方。', weights: { shadow: 2, agility: 1 } },
    ],
  },
  {
    id: 5,
    narrative: '弗雷尔卓德的严冬来临，你的部落粮食不足。邻近部落有充足的储备，但他们拒绝分享。',
    options: [
      { label: 'A', text: '带领战士去夺取——生存是第一法则。', weights: { conquest: 2, chaos: 1 } },
      { label: 'B', text: '用部落的工艺品去交换，互利共赢。', weights: { agility: 1, ideal: -1 } },
      { label: 'C', text: '独自去荒野狩猎，不求任何人。', weights: { bond: -2, explore: 1 } },
      { label: 'D', text: '联合其他弱小部落，一起向他们施压。', weights: { bond: 2, shadow: 1 } },
    ],
  },
  {
    id: 6,
    narrative: '你在暗影岛的废墟中发现一个被封印的灵魂，它声称自己是无辜的，请求你释放它。',
    options: [
      { label: 'A', text: '释放它——每个灵魂都值得自由。', weights: { ideal: 2, chaos: 1 } },
      { label: 'B', text: '不予理会——封印自有它的原因。', weights: { chaos: -1, intuition: -1 } },
      { label: 'C', text: '先调查封印的历史，再做决定。', weights: { explore: 1, intuition: -1 } },
      { label: 'D', text: '与它交易——释放的代价是它为你效力。', weights: { shadow: 2, conquest: 1 } },
    ],
  },
  {
    id: 7,
    narrative: '你成为了一座城邦的领袖，面临第一个决策：如何分配有限的资源。',
    options: [
      { label: 'A', text: '优先发展军事，实力是安全的保障。', weights: { conquest: 2, ideal: -1 } },
      { label: 'B', text: '投资教育和研究，知识才是长远之计。', weights: { ideal: 2, explore: 1 } },
      { label: 'C', text: '平均分配给所有民众，公平最重要。', weights: { bond: 1, chaos: -1 } },
      { label: 'D', text: '建立贸易网络，让财富自然流动。', weights: { agility: 1, explore: 1 } },
    ],
  },
  {
    id: 8,
    narrative: '恕瑞玛的沙漠中，你找到了一件远古神器。传说它能实现一个愿望，但使用者会失去最珍贵的记忆。',
    options: [
      { label: 'A', text: '毫不犹豫使用——为了更伟大的目标，牺牲是值得的。', weights: { ideal: 2, conquest: 1 } },
      { label: 'B', text: '带回去研究它的原理，也许能找到无代价的使用方式。', weights: { explore: 1, intuition: -1 } },
      { label: 'C', text: '重新封印它——这种力量不该被任何人使用。', weights: { chaos: -2, bond: 1 } },
      { label: 'D', text: '卖给出价最高的人，记忆是别人的事。', weights: { shadow: 1, ideal: -2 } },
    ],
  },
]
```

- [ ] **Step 5: Create 10 region data entries**

```ts
// app/data/regions.ts
import type { Region } from '~/types'

export const regions: Region[] = [
  {
    id: 'demacia',
    name: '德玛西亚',
    nameEn: 'Demacia',
    description: '一个以荣耀与正义为根基的王国，秩序是它不可动摇的信条。',
    lore: '德玛西亚是一个骄傲的军事王国，它的子民信奉法律与正义的力量。在这里，勇气和忠诚是最崇高的美德，每一个德玛西亚人都愿意为守护家园献出一切。',
    vector: { chaos: 2, intuition: 3, bond: 7, conquest: 5, explore: 3, shadow: 2, agility: 3, ideal: 7 },
    badgeColor: '#4a7ab5',
  },
  {
    id: 'noxus',
    name: '诺克萨斯',
    nameEn: 'Noxus',
    description: '力量至上的帝国，只有强者才配书写历史。',
    lore: '诺克萨斯相信力量决定一切。在这个扩张主义帝国中，无论出身如何，只要你够强、够狠、够聪明，就能攀上权力的巅峰。它推崇实力，蔑视弱者的同情。',
    vector: { chaos: 5, intuition: 4, bond: 4, conquest: 9, explore: 5, shadow: 6, agility: 4, ideal: 3 },
    badgeColor: '#8b1a1a',
  },
  {
    id: 'ionia',
    name: '艾欧尼亚',
    nameEn: 'Ionia',
    description: '灵与自然交融的土地，万物和谐共生。',
    lore: '艾欧尼亚是一片与灵魂世界紧密相连的神秘大陆。这里的人们追随自然的节奏，修行冥想，崇尚内心的平静与万物的和谐。但平衡被打破时，他们也会展现出惊人的力量。',
    vector: { chaos: 4, intuition: 8, bond: 6, conquest: 2, explore: 5, shadow: 3, agility: 8, ideal: 8 },
    badgeColor: '#6b8e6b',
  },
  {
    id: 'piltover',
    name: '皮尔特沃夫',
    nameEn: 'Piltover',
    description: '进步之城，科技与创新照亮未来的每一寸道路。',
    lore: '皮尔特沃夫被誉为"进步之城"，是瓦洛兰大陆上最为富裕和先进的城邦。这里聚集了最优秀的发明家和学者，他们相信理性和科学能解决一切问题。',
    vector: { chaos: 3, intuition: 2, bond: 5, conquest: 4, explore: 8, shadow: 3, agility: 5, ideal: 6 },
    badgeColor: '#c9a84c',
  },
  {
    id: 'zaun',
    name: '祖安',
    nameEn: 'Zaun',
    description: '地下城的疯狂与天才只有一线之隔。',
    lore: '祖安是皮尔特沃夫繁华底下的阴暗面，一个被化学废料和狂想浸透的地下城。这里没有规则，只有无尽的创造欲和生存本能。在这里，疯狂就是灵感的别名。',
    vector: { chaos: 9, intuition: 6, bond: 3, conquest: 5, explore: 8, shadow: 8, agility: 7, ideal: 5 },
    badgeColor: '#4a8b5c',
  },
  {
    id: 'freljord',
    name: '弗雷尔卓德',
    nameEn: 'Freljord',
    description: '冰封大地上的生存法则——只有强者能熬过漫长寒冬。',
    lore: '弗雷尔卓德是一片被永冬统治的荒蛮之地。这里的部落为了生存而战，崇拜远古的冰霜之神。坚韧和意志力是活下去的唯一货币，软弱在这里等同于死亡。',
    vector: { chaos: 6, intuition: 5, bond: 4, conquest: 7, explore: 4, shadow: 4, agility: 3, ideal: 4 },
    badgeColor: '#6baed6',
  },
  {
    id: 'bilgewater',
    name: '比尔吉沃特',
    nameEn: 'Bilgewater',
    description: '海盗与赏金猎人的港口，自由是唯一的法律。',
    lore: '比尔吉沃特是一个无法无天的港口城市，海盗、走私贩和赏金猎人在这里寻找财富和自由。没有国王、没有法律，只有机灵的头脑和快刀才能让你活到明天。',
    vector: { chaos: 9, intuition: 6, bond: 3, conquest: 5, explore: 7, shadow: 7, agility: 8, ideal: 3 },
    badgeColor: '#8b6914',
  },
  {
    id: 'shadowisles',
    name: '暗影岛',
    nameEn: 'Shadow Isles',
    description: '亡灵徘徊的诅咒之地，死亡不是终点，只是另一种存在。',
    lore: '暗影岛曾是一个美丽的群岛，但一场灾难将它变成了亡灵的国度。黑雾笼罩着每一寸土地，被困在此的灵魂永远无法安息。这里是绝望、执念和不灭意志的化身。',
    vector: { chaos: 8, intuition: 7, bond: 2, conquest: 4, explore: 4, shadow: 10, agility: 5, ideal: 7 },
    badgeColor: '#2f4f4f',
  },
  {
    id: 'shurima',
    name: '恕瑞玛',
    nameEn: 'Shurima',
    description: '沙漠之下沉睡的远古帝国，荣光终将重现。',
    lore: '恕瑞玛曾是瓦洛兰大陆上最强大的帝国，它的升日之盘赋予皇帝神一般的力量。虽然帝国已经陷落，但它的血脉和信念仍在沙漠中流淌，等待着有朝一日东山再起。',
    vector: { chaos: 3, intuition: 4, bond: 6, conquest: 8, explore: 5, shadow: 4, agility: 3, ideal: 9 },
    badgeColor: '#d4a843',
  },
  {
    id: 'targon',
    name: '巨神峰',
    nameEn: 'Mount Targon',
    description: '连接凡间与星界的圣山，只有最坚定的灵魂才能登顶。',
    lore: '巨神峰是瓦洛兰大陆上最高的山脉，传说它的顶端连接着星界。攀登者需要超凡的意志和纯粹的信念，而那些到达顶峰的人将获得星灵的祝福，成为超越凡人的存在。',
    vector: { chaos: 3, intuition: 7, bond: 5, conquest: 3, explore: 6, shadow: 2, agility: 4, ideal: 10 },
    badgeColor: '#9370db',
  },
]
```

- [ ] **Step 6: Create hero data (~30 heroes, 3 per region)**

```ts
// app/data/heroes.ts
import type { Hero } from '~/types'

export const heroes: Hero[] = [
  // ===== 德玛西亚 =====
  {
    id: 'garen', name: '盖伦', nameEn: 'Garen', title: '德玛西亚之力',
    regionId: 'demacia',
    vector: { chaos: 1, intuition: 2, bond: 8, conquest: 6, explore: 2, shadow: 1, agility: 2, ideal: 8 },
    description: '德玛西亚最坚定的守护者，用大剑和钢铁意志扞卫正义。',
    lore: '盖伦是无畏先锋的统领，他以身作则践行德玛西亚的信条。对他来说，保护弱者和维护秩序不是选择，而是与生俱来的使命。',
  },
  {
    id: 'lux', name: '拉克丝', nameEn: 'Lux', title: '光辉女郎',
    regionId: 'demacia',
    vector: { chaos: 4, intuition: 5, bond: 8, conquest: 2, explore: 6, shadow: 2, agility: 5, ideal: 9 },
    description: '天生拥有光魔法的少女，在秩序与自由之间寻找自己的道路。',
    lore: '拉克丝生于一个禁止魔法的国度，却天赋异禀。她用乐观和善良照亮身边的每一个人，也在暗中用自己的力量帮助那些被迫害的法师。',
  },
  {
    id: 'galio', name: '加里奥', nameEn: 'Galio', title: '正义巨像',
    regionId: 'demacia',
    vector: { chaos: 1, intuition: 3, bond: 9, conquest: 5, explore: 2, shadow: 1, agility: 2, ideal: 7 },
    description: '沉睡的石像巨人，只有在魔法出现时才能苏醒守护家园。',
    lore: '加里奥渴望战斗，因为只有战斗才能让他苏醒。他用巨大的石翼守护德玛西亚，对抗一切魔法威胁。他矛盾地爱着让他苏醒的魔法，又忠于消灭魔法的信条。',
  },

  // ===== 诺克萨斯 =====
  {
    id: 'darius', name: '德莱厄斯', nameEn: 'Darius', title: '诺克萨斯之手',
    regionId: 'noxus',
    vector: { chaos: 4, intuition: 3, bond: 5, conquest: 10, explore: 3, shadow: 5, agility: 2, ideal: 3 },
    description: '铁血统帅，用斧刃诠释力量即正义的诺克萨斯信条。',
    lore: '德莱厄斯从贫民窟中一路斩杀登顶，成为诺克萨斯最令人畏惧的将军。他信奉一个简单的道理：只有强者才配活着，而他，永远是最强的那个。',
  },
  {
    id: 'swain', name: '斯维因', nameEn: 'Swain', title: '诺克萨斯统领',
    regionId: 'noxus',
    vector: { chaos: 4, intuition: 5, bond: 4, conquest: 8, explore: 6, shadow: 8, agility: 7, ideal: 5 },
    description: '策略大师与暗黑权术家，用谋略而非蛮力统治帝国。',
    lore: '斯维因失去了一条手臂，却获得了恶魔之力。他用超凡的智慧和冷酷的算计将诺克萨斯带向新时代，在他的棋局中，每个人都是棋子。',
  },
  {
    id: 'katarina', name: '卡特琳娜', nameEn: 'Katarina', title: '不祥之刃',
    regionId: 'noxus',
    vector: { chaos: 7, intuition: 6, bond: 3, conquest: 8, explore: 5, shadow: 7, agility: 9, ideal: 2 },
    description: '致命的刺客，在刀锋的寒光中寻找自身的价值。',
    lore: '卡特琳娜是诺克萨斯最出色的刺客，快如闪电，狠如毒蛇。她不相信任何人，只相信手中的飞刀。在血与影中，她证明自己不只是父亲的工具。',
  },

  // ===== 艾欧尼亚 =====
  {
    id: 'yasuo', name: '亚索', nameEn: 'Yasuo', title: '疾风剑豪',
    regionId: 'ionia',
    vector: { chaos: 7, intuition: 8, bond: 3, conquest: 4, explore: 7, shadow: 4, agility: 9, ideal: 6 },
    description: '被冤枉的剑客，在流浪中寻找真相与救赎。',
    lore: '亚索背负弑师之名浪迹天涯。风是他唯一的伙伴，剑是他唯一的语言。在漫长的流浪中，他学会了放下执念，让风带走一切不属于自己的重量。',
  },
  {
    id: 'ahri', name: '阿狸', nameEn: 'Ahri', title: '九尾妖狐',
    regionId: 'ionia',
    vector: { chaos: 5, intuition: 9, bond: 5, conquest: 3, explore: 7, shadow: 5, agility: 8, ideal: 7 },
    description: '渴望成为人类的狐灵，在魅惑与真情之间挣扎。',
    lore: '阿狸拥有夺取灵魂的能力，但她内心渴望的是真正的人类情感。她游历四方，体验人间的喜怒哀乐，试图理解什么才是真正的"活着"。',
  },
  {
    id: 'shen', name: '慎', nameEn: 'Shen', title: '暮光之眼',
    regionId: 'ionia',
    vector: { chaos: 2, intuition: 7, bond: 7, conquest: 3, explore: 4, shadow: 4, agility: 6, ideal: 9 },
    description: '维护灵与物质世界平衡的守护者，责任重于一切。',
    lore: '慎是均衡教派的领袖，守护着物质世界与灵魂世界的平衡。他必须将个人情感搁置一旁，以无情的理性做出守护平衡的决定，哪怕这意味着牺牲所爱之人。',
  },

  // ===== 皮尔特沃夫 =====
  {
    id: 'jayce', name: '杰斯', nameEn: 'Jayce', title: '未来守护者',
    regionId: 'piltover',
    vector: { chaos: 3, intuition: 3, bond: 6, conquest: 5, explore: 8, shadow: 2, agility: 5, ideal: 7 },
    description: '天才发明家兼英雄，用科技之锤守护进步之城。',
    lore: '杰斯是皮尔特沃夫最杰出的发明家之一，他创造了能在锤与炮之间切换的海克斯科技武器。他既是科学家也是战士，相信技术进步能让世界变得更好。',
  },
  {
    id: 'caitlyn', name: '凯特琳', nameEn: 'Caitlyn', title: '皮城女警',
    regionId: 'piltover',
    vector: { chaos: 2, intuition: 2, bond: 6, conquest: 4, explore: 7, shadow: 3, agility: 5, ideal: 7 },
    description: '皮尔特沃夫最优秀的执法者，用理性和精准维护正义。',
    lore: '凯特琳是皮尔特沃夫的治安官，以超凡的洞察力和精准的射击闻名。她信奉法律和秩序，但也明白真正的正义有时需要深入黑暗的角落。',
  },
  {
    id: 'heimerdinger', name: '黑默丁格', nameEn: 'Heimerdinger', title: '大发明家',
    regionId: 'piltover',
    vector: { chaos: 3, intuition: 2, bond: 5, conquest: 2, explore: 10, shadow: 2, agility: 6, ideal: 8 },
    description: '约德尔族的天才科学家，对知识的追求永无止境。',
    lore: '黑默丁格是皮尔特沃夫科学院的教授，拥有无穷的好奇心和创造力。他相信科学能解答宇宙的一切奥秘，即使他的实验偶尔会把实验室炸上天。',
  },

  // ===== 祖安 =====
  {
    id: 'jinx', name: '金克丝', nameEn: 'Jinx', title: '暴走萝莉',
    regionId: 'zaun',
    vector: { chaos: 10, intuition: 7, bond: 3, conquest: 6, explore: 8, shadow: 6, agility: 8, ideal: 3 },
    description: '疯狂的破坏艺术家，在爆炸中找到生命的意义。',
    lore: '金克丝是祖安最臭名昭著的罪犯，她对爆炸和混乱有着病态的热爱。没有人知道她为什么要这么做，也许连她自己都不知道——她只知道，看着东西炸飞让她快乐。',
  },
  {
    id: 'ekko', name: '艾克', nameEn: 'Ekko', title: '时间刺客',
    regionId: 'zaun',
    vector: { chaos: 7, intuition: 5, bond: 7, conquest: 4, explore: 9, shadow: 5, agility: 9, ideal: 7 },
    description: '祖安街头的天才少年，用时间回溯守护朋友和家园。',
    lore: '艾克发明了一台能倒转时间的装置。他不是为了征服世界，而是为了保护他在祖安贫民窟的朋友们。他证明了即使在最黑暗的地方，也能诞生最明亮的希望。',
  },
  {
    id: 'singed', name: '辛吉德', nameEn: 'Singed', title: '炼金术士',
    regionId: 'zaun',
    vector: { chaos: 8, intuition: 3, bond: 1, conquest: 5, explore: 9, shadow: 9, agility: 5, ideal: 6 },
    description: '疯狂的炼金术士，为了科学可以牺牲一切，包括道德。',
    lore: '辛吉德是祖安最令人毛骨悚然的科学家。他的实验不受任何伦理束缚，在他眼中，生命不过是化学反应的集合，而他的使命是解开这些反应的终极奥秘。',
  },

  // ===== 弗雷尔卓德 =====
  {
    id: 'ashe', name: '艾希', nameEn: 'Ashe', title: '寒冰射手',
    regionId: 'freljord',
    vector: { chaos: 3, intuition: 5, bond: 7, conquest: 5, explore: 5, shadow: 2, agility: 5, ideal: 8 },
    description: '弗雷尔卓德的女王，梦想统一冰封大地、结束无尽的纷争。',
    lore: '艾希是弗雷尔卓德阿瓦罗萨部落的战母。与其他追求武力的领袖不同，她相信统一和和平才是让人民活下去的唯一出路。她用弓箭和外交同时战斗。',
  },
  {
    id: 'olaf', name: '奥拉夫', nameEn: 'Olaf', title: '狂战士',
    regionId: 'freljord',
    vector: { chaos: 8, intuition: 6, bond: 3, conquest: 9, explore: 5, shadow: 3, agility: 2, ideal: 2 },
    description: '渴望在战斗中光荣赴死的狂战士，却命运般地活了下来。',
    lore: '奥拉夫被预言将在床上老死，这对一个弗雷尔卓德战士来说是最大的耻辱。于是他冲向每一场最危险的战斗，疯狂地寻找光荣战死的机会，但死神总是与他擦肩而过。',
  },
  {
    id: 'braum', name: '布隆', nameEn: 'Braum', title: '弗雷尔卓德之心',
    regionId: 'freljord',
    vector: { chaos: 3, intuition: 5, bond: 10, conquest: 3, explore: 4, shadow: 1, agility: 2, ideal: 6 },
    description: '温暖如阳光的巨人，用门板大盾守护每一个需要帮助的人。',
    lore: '布隆是弗雷尔卓德的传奇英雄，一个拥有巨人力量和孩子般善良心灵的男人。他的存在证明，在最寒冷的土地上，也能拥有最温暖的灵魂。',
  },

  // ===== 比尔吉沃特 =====
  {
    id: 'gangplank', name: '普朗克', nameEn: 'Gangplank', title: '海洋之灾',
    regionId: 'bilgewater',
    vector: { chaos: 8, intuition: 5, bond: 2, conquest: 8, explore: 6, shadow: 8, agility: 6, ideal: 2 },
    description: '比尔吉沃特的暴君船长，用恐惧和橘子统治港口。',
    lore: '普朗克曾是比尔吉沃特不可撼动的统治者，用铁腕和残忍维持着这座混乱港口的"秩序"。即使在失去一切后，他仍在阴影中重建自己的帝国。',
  },
  {
    id: 'missfortune', name: '厄运小姐', nameEn: 'Miss Fortune', title: '赏金猎人',
    regionId: 'bilgewater',
    vector: { chaos: 7, intuition: 5, bond: 4, conquest: 7, explore: 6, shadow: 6, agility: 8, ideal: 4 },
    description: '美丽而致命的赏金猎人，誓要为母报仇。',
    lore: '厄运小姐表面上是比尔吉沃特最迷人的赏金猎人，但她的微笑背后藏着刻骨的仇恨。她一步步精心策划，终将颠覆整个港口的权力格局。',
  },
  {
    id: 'twistedfate', name: '崔斯特', nameEn: 'Twisted Fate', title: '卡牌大师',
    regionId: 'bilgewater',
    vector: { chaos: 8, intuition: 7, bond: 4, conquest: 3, explore: 8, shadow: 7, agility: 9, ideal: 3 },
    description: '浪迹天涯的赌徒和骗子，命运是他手中永远的底牌。',
    lore: '崔斯特是一个天生的赌徒和骗子，能用一副魔法纸牌改变任何人的命运。他只忠于自己，在刀尖上跳舞，在谎言中寻找真相。',
  },

  // ===== 暗影岛 =====
  {
    id: 'thresh', name: '锤石', nameEn: 'Thresh', title: '魂锁典狱长',
    regionId: 'shadowisles',
    vector: { chaos: 7, intuition: 5, bond: 2, conquest: 6, explore: 4, shadow: 10, agility: 7, ideal: 5 },
    description: '以折磨灵魂为乐的典狱长，将痛苦变成了艺术。',
    lore: '锤石不是简单的杀手，他是一个鉴赏家——痛苦和绝望的鉴赏家。他的灯笼里收集着无数灵魂，每一个都在永恒的折磨中尖叫，而他享受着每一声哀嚎。',
  },
  {
    id: 'yorick', name: '约里克', nameEn: 'Yorick', title: '牧魂人',
    regionId: 'shadowisles',
    vector: { chaos: 4, intuition: 6, bond: 5, conquest: 3, explore: 3, shadow: 7, agility: 3, ideal: 9 },
    description: '暗影岛上最后的活人，背负着解放亡灵的使命。',
    lore: '约里克是暗影岛上仅存的有自我意识的存在。他背负着岛上所有亡灵的哀嚎，日复一日地掘墓、安魂，等待着终有一天能解除这片土地的诅咒。',
  },
  {
    id: 'viego', name: '佛耶戈', nameEn: 'Viego', title: '破败之王',
    regionId: 'shadowisles',
    vector: { chaos: 8, intuition: 8, bond: 3, conquest: 7, explore: 5, shadow: 9, agility: 4, ideal: 8 },
    description: '为爱疯狂的破败之王，宁可毁灭世界也要找回她。',
    lore: '佛耶戈曾是一个王国的君主，为了复活死去的王后，他释放了毁灭一切的黑雾。在他的眼中，没有什么比他的爱情更重要——即使这份爱要以整个世界为代价。',
  },

  // ===== 恕瑞玛 =====
  {
    id: 'azir', name: '阿兹尔', nameEn: 'Azir', title: '沙漠皇帝',
    regionId: 'shurima',
    vector: { chaos: 2, intuition: 4, bond: 6, conquest: 8, explore: 5, shadow: 4, agility: 3, ideal: 10 },
    description: '复活的远古皇帝，誓要重建恕瑞玛的昔日荣光。',
    lore: '阿兹尔在沉睡千年后重生，眼前是自己帝国的废墟。但他的意志如同沙漠中的太阳般不可磨灭——恕瑞玛必将再次升起，在他的带领下重返巅峰。',
  },
  {
    id: 'sivir', name: '希维尔', nameEn: 'Sivir', title: '战争女神',
    regionId: 'shurima',
    vector: { chaos: 6, intuition: 5, bond: 3, conquest: 6, explore: 7, shadow: 5, agility: 7, ideal: 3 },
    description: '恕瑞玛沙漠中的雇佣兵，只为金币和自己而战。',
    lore: '希维尔是沙漠中最出色的雇佣兵，她的十字回旋镖从不失手。她不在乎什么帝国复兴，只关心下一单佣金。但命运似乎总是把她拉回恕瑞玛的古老传说中。',
  },
  {
    id: 'nasus', name: '内瑟斯', nameEn: 'Nasus', title: '沙漠死神',
    regionId: 'shurima',
    vector: { chaos: 2, intuition: 4, bond: 5, conquest: 4, explore: 6, shadow: 3, agility: 3, ideal: 9 },
    description: '永生的学者守护者，用知识和耐心守望着恕瑞玛的未来。',
    lore: '内瑟斯是恕瑞玛最古老的飞升者之一，拥有无尽的寿命和深邃的智慧。他选择用永恒的时光积累知识，相信智慧终将指引恕瑞玛走向正确的道路。',
  },

  // ===== 巨神峰 =====
  {
    id: 'leona', name: '蕾欧娜', nameEn: 'Leona', title: '曙光女神',
    regionId: 'targon',
    vector: { chaos: 2, intuition: 5, bond: 8, conquest: 5, explore: 4, shadow: 1, agility: 3, ideal: 9 },
    description: '太阳的化身，用烈日般的信念守护一切。',
    lore: '蕾欧娜是巨神峰烈阳教派的圣骑士，获得了太阳星灵的祝福。她的信念如正午的阳光般炽烈——守护弱者，惩罚邪恶，永不退缩，永不妥协。',
  },
  {
    id: 'diana', name: '黛安娜', nameEn: 'Diana', title: '皎月女神',
    regionId: 'targon',
    vector: { chaos: 6, intuition: 8, bond: 3, conquest: 4, explore: 7, shadow: 5, agility: 7, ideal: 9 },
    description: '月亮的信徒，在被遗忘的真相中寻找属于自己的正义。',
    lore: '黛安娜发现了被烈阳教派刻意隐藏的月之教派真相，这让她成为了异端。她用皎月之刃斩开谎言，证明黑夜的力量与白昼同样神圣。',
  },
  {
    id: 'taric', name: '塔里克', nameEn: 'Taric', title: '宝石骑士',
    regionId: 'targon',
    vector: { chaos: 3, intuition: 6, bond: 8, conquest: 3, explore: 5, shadow: 1, agility: 4, ideal: 10 },
    description: '登顶巨神峰的守护者，以美和爱之名守护万物。',
    lore: '塔里克曾是德玛西亚的骑士，因失职被流放到巨神峰。在攀登中他找到了真正的使命——成为万物之盾。他相信美和爱是宇宙中最强大的力量。',
  },
]
```

- [ ] **Step 7: Create dimension reading texts (24 entries)**

```ts
// app/data/dimensionTexts.ts
import type { DimensionText } from '~/types'

export const dimensionTexts: DimensionText[] = [
  // chaos
  { dimensionId: 'chaos', range: 'low', text: '你是秩序的信徒，相信规则和制度是文明的基石。在混乱面前，你选择成为那个维持秩序的人。' },
  { dimensionId: 'chaos', range: 'mid', text: '你既尊重规则的价值，也理解自由的意义。你不是盲从者，但也不会为了叛逆而叛逆。' },
  { dimensionId: 'chaos', range: 'high', text: '你天生排斥规则的束缚，相信真正的力量来自自由意志。在你眼中，打破常规才是创造新世界的第一步。' },

  // intuition
  { dimensionId: 'intuition', range: 'low', text: '你是理性的化身，相信逻辑和数据胜过一切直觉。每一个决定都经过缜密的推演，不留下任何侥幸的空间。' },
  { dimensionId: 'intuition', range: 'mid', text: '你在理性与直觉之间保持着微妙的平衡，知道何时该相信数据，何时该听从内心的声音。' },
  { dimensionId: 'intuition', range: 'high', text: '你的直觉如同第六感般敏锐，常常在理性无法触及的地方捕捉到真相。你相信，灵感是宇宙给予你的礼物。' },

  // bond
  { dimensionId: 'bond', range: 'low', text: '你是独行者，习惯依靠自己的力量面对一切。孤独不是负担，而是你选择的自由。' },
  { dimensionId: 'bond', range: 'mid', text: '你珍视同伴的存在，但也保留着独处的空间。你明白，真正的力量来自平衡——既能并肩作战，也能独自前行。' },
  { dimensionId: 'bond', range: 'high', text: '羁绊是你最强大的武器。你为同伴而战，为守护而生。在你心中，没有什么比身边的人更重要。' },

  // conquest
  { dimensionId: 'conquest', range: 'low', text: '你是天生的和平使者，相信对话和理解能化解一切冲突。在你眼中，真正的力量不在于征服，而在于包容。' },
  { dimensionId: 'conquest', range: 'mid', text: '你既不畏惧战斗，也不渴望战斗。当和平可以解决问题时，你选择和平；当战斗不可避免时，你绝不退缩。' },
  { dimensionId: 'conquest', range: 'high', text: '你骨子里流淌着征服者的血液，追求力量和胜利是你的本能。你相信强者才有资格定义正义。' },

  // explore
  { dimensionId: 'explore', range: 'low', text: '你是坚定的守护者，保护已有的一切是你最大的使命。稳固的根基比遥远的冒险更有价值。' },
  { dimensionId: 'explore', range: 'mid', text: '你对未知保持着好奇，但也不会贸然抛下手中拥有的一切。你在探索与守护之间找到了属于自己的节奏。' },
  { dimensionId: 'explore', range: 'high', text: '未知是你最大的诱惑，每一片未被探索的土地都在呼唤着你。你相信，停止探索的那一天，才是真正死亡的开始。' },

  // shadow
  { dimensionId: 'shadow', range: 'low', text: '你是光明的守护者，坦荡磊落是你不变的信条。在你的世界里，正义永远在阳光下，不需要任何阴影的手段。' },
  { dimensionId: 'shadow', range: 'mid', text: '你明白世界不是非黑即白的，有时候需要在灰色地带中做出选择。你的底线清晰，但方式灵活。' },
  { dimensionId: 'shadow', range: 'high', text: '你深谙暗影之道，懂得在看不见的地方布局。光明无法照亮所有角落，而你恰恰在那些角落中如鱼得水。' },

  // agility
  { dimensionId: 'agility', range: 'low', text: '你如同磐石般坚定，正面迎接每一个挑战。在你看来，不屈的意志比任何技巧都更可靠。' },
  { dimensionId: 'agility', range: 'mid', text: '你知道何时该硬扛、何时该灵活应变。坚韧与灵巧并非对立，而是你手中两把趁手的武器。' },
  { dimensionId: 'agility', range: 'high', text: '你如同流水般灵动，四两拨千金是你的本能。与其正面硬刚，不如找到最巧妙的角度，一击制胜。' },

  // ideal
  { dimensionId: 'ideal', range: 'low', text: '你是务实主义者，当下的利益和可触摸的成果比遥远的理想更有意义。空谈误事，你更愿意用行动说话。' },
  { dimensionId: 'ideal', range: 'mid', text: '你在理想与现实之间寻找平衡点，既不会为了理想脱离实际，也不会因为务实而放弃心中的信念。' },
  { dimensionId: 'ideal', range: 'high', text: '你是理想主义的化身，心中燃烧着改变世界的火焰。即使全世界都说不可能，你依然相信信念的力量终将照亮前路。' },
]
```

- [ ] **Step 8: Create summary templates**

```ts
// app/data/summaryTemplates.ts
import type { SummaryTemplate } from '~/types'

export const summaryTemplates: SummaryTemplate[] = [
  // ===== Paragraph 1: Core Personality (based on top 2-3 dimensions) =====
  { paragraph: 1, condition: { dimensionId: 'chaos', range: 'high' }, text: '你的灵魂中涌动着不安分的因子，规则对你来说不过是等待被打破的枷锁。' },
  { paragraph: 1, condition: { dimensionId: 'chaos', range: 'low' }, text: '你是秩序的守护者，在混乱的世界中坚守着自己的原则和底线。' },
  { paragraph: 1, condition: { dimensionId: 'intuition', range: 'high' }, text: '你的直觉如同一盏暗夜中的明灯，总能在理性无法触及的地方找到方向。' },
  { paragraph: 1, condition: { dimensionId: 'intuition', range: 'low' }, text: '冷静的分析和缜密的逻辑是你最强大的武器，你从不让感性左右重要的判断。' },
  { paragraph: 1, condition: { dimensionId: 'bond', range: 'high' }, text: '对你而言，身边的人就是你战斗的全部理由，守护他们的笑容比任何荣耀都更有意义。' },
  { paragraph: 1, condition: { dimensionId: 'bond', range: 'low' }, text: '你习惯独自面对世界的挑战，孤独是你选择的力量，而非命运的惩罚。' },
  { paragraph: 1, condition: { dimensionId: 'conquest', range: 'high' }, text: '征服与力量是写在你骨子里的渴望，你天生就是为了战胜一切阻碍而存在。' },
  { paragraph: 1, condition: { dimensionId: 'conquest', range: 'low' }, text: '和平是你心中最崇高的理想，你相信理解与包容终将化解一切纷争。' },
  { paragraph: 1, condition: { dimensionId: 'explore', range: 'high' }, text: '每一片未知的领域都像磁石般吸引着你，探索是你生命中不可或缺的主旋律。' },
  { paragraph: 1, condition: { dimensionId: 'explore', range: 'low' }, text: '你是坚定的守护者，保护所珍视的一切是你不变的使命。' },
  { paragraph: 1, condition: { dimensionId: 'shadow', range: 'high' }, text: '你深谙光与影的辩证关系，懂得在必要时运用暗影的力量达成目标。' },
  { paragraph: 1, condition: { dimensionId: 'shadow', range: 'low' }, text: '光明磊落是你不可动摇的信条，你宁可走更难的路，也不愿在阴影中前行。' },
  { paragraph: 1, condition: { dimensionId: 'agility', range: 'high' }, text: '灵活应变是你的天赋，你如同流水般在障碍之间找到最优雅的通道。' },
  { paragraph: 1, condition: { dimensionId: 'agility', range: 'low' }, text: '你拥有磐石般的坚韧意志，面对任何困难都选择正面迎击、绝不退缩。' },
  { paragraph: 1, condition: { dimensionId: 'ideal', range: 'high' }, text: '心中的理想如同永不熄灭的火焰，即使在最黑暗的时刻也照亮你前行的道路。' },
  { paragraph: 1, condition: { dimensionId: 'ideal', range: 'low' }, text: '你是脚踏实地的务实主义者，眼前的现实比遥远的梦想更值得关注。' },

  // ===== Paragraph 2: Region belonging (generic templates, filled with region lore) =====
  { paragraph: 2, condition: { dimensionId: 'chaos', range: 'high' }, text: '在{regionName}，你的不羁灵魂终于找到了共鸣。这片土地的气质与你如出一辙——{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'chaos', range: 'low' }, text: '{regionName}的秩序与纪律正是你内心所向往的。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'conquest', range: 'high' }, text: '{regionName}的土地上回荡着征服者的号角，而你的血液对此共鸣最为强烈。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'conquest', range: 'low' }, text: '{regionName}给予了你追求和平的空间。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'ideal', range: 'high' }, text: '你对理想的执着让你与{regionName}的信念深深相连。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'ideal', range: 'low' }, text: '{regionName}的务实精神与你不谋而合。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'explore', range: 'high' }, text: '{regionName}满足了你对未知世界的渴望。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'explore', range: 'low' }, text: '在{regionName}，你找到了值得守护的一切。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'shadow', range: 'high' }, text: '{regionName}的暗影之中，你如鱼得水。{regionLore}' },
  { paragraph: 2, condition: { dimensionId: 'shadow', range: 'low' }, text: '{regionName}的光芒与你心中的正义交相辉映。{regionLore}' },

  // ===== Paragraph 3: Hero resonance =====
  { paragraph: 3, condition: { dimensionId: 'chaos', range: 'high' }, text: '如同{heroName}（{heroTitle}）一般，你骨子里流淌着反叛的血液。{heroLore}' },
  { paragraph: 3, condition: { dimensionId: 'chaos', range: 'low' }, text: '你与{heroName}（{heroTitle}）有着相似的坚守——{heroLore}' },
  { paragraph: 3, condition: { dimensionId: 'bond', range: 'high' }, text: '{heroName}（{heroTitle}）同样将羁绊视为力量的源泉。{heroLore}你们在守护所爱之人这件事上，有着完全一致的信念。' },
  { paragraph: 3, condition: { dimensionId: 'bond', range: 'low' }, text: '如同{heroName}（{heroTitle}），你选择了独行的道路。{heroLore}' },
  { paragraph: 3, condition: { dimensionId: 'conquest', range: 'high' }, text: '{heroName}（{heroTitle}）与你共享着征服者的野心。{heroLore}你们都相信，力量是改写命运的唯一语言。' },
  { paragraph: 3, condition: { dimensionId: 'ideal', range: 'high' }, text: '你与{heroName}（{heroTitle}）一样，为了信念可以赌上一切。{heroLore}' },
  { paragraph: 3, condition: { dimensionId: 'agility', range: 'high' }, text: '如同{heroName}（{heroTitle}），你在灵活应变中展现出真正的强大。{heroLore}' },
  { paragraph: 3, condition: { dimensionId: 'shadow', range: 'high' }, text: '{heroName}（{heroTitle}）也是暗影的行者。{heroLore}你们都明白，光明看不到的角落里才藏着真正的力量。' },
  { paragraph: 3, condition: { dimensionId: 'explore', range: 'high' }, text: '{heroName}（{heroTitle}）与你有着同样的探索之心。{heroLore}' },
  { paragraph: 3, condition: { dimensionId: 'intuition', range: 'high' }, text: '你与{heroName}（{heroTitle}）都是直觉的信徒。{heroLore}' },

  // ===== Paragraph 4: Growth (based on lowest dimensions) =====
  { paragraph: 4, condition: { dimensionId: 'chaos', range: 'low' }, text: '或许有一天，你会发现打破规则并非意味着失控——就像有些英雄在背离常规后反而找到了真正的自我。适度的"混沌"可能会为你打开意想不到的大门。' },
  { paragraph: 4, condition: { dimensionId: 'chaos', range: 'high' }, text: '自由的灵魂也需要偶尔的锚点。也许在某个时刻你会发现，某些规则的存在不是为了束缚你，而是为了让你的力量有所依托。' },
  { paragraph: 4, condition: { dimensionId: 'intuition', range: 'low' }, text: '逻辑固然强大，但有些真相藏在数据之外。试着偶尔放下分析的框架，倾听内心那个微弱却真实的声音——它也许会带你到计算永远无法抵达的地方。' },
  { paragraph: 4, condition: { dimensionId: 'intuition', range: 'high' }, text: '直觉虽然灵敏，但理性的验证能让你的判断更加坚实。在关键时刻，慢下来用逻辑检验一下直觉的指引，你会发现两者结合的力量远超任何一方。' },
  { paragraph: 4, condition: { dimensionId: 'bond', range: 'low' }, text: '独行者的强大毋庸置疑，但如同亚索在漫长流浪后终于理解了同伴的意义，打开心扉接纳他人或许不是弱点，而是另一种更深沉的勇气。' },
  { paragraph: 4, condition: { dimensionId: 'bond', range: 'high' }, text: '守护他人是崇高的选择，但别忘了也给自己留一些空间。有时候独处不是孤独，而是让你重新认识自己、积蓄力量的方式。' },
  { paragraph: 4, condition: { dimensionId: 'conquest', range: 'low' }, text: '和平是美好的愿景，但世界并不总是以和平回应和平。学会在必要时展现力量，不是背离信念，而是为信念增添守护的分量。' },
  { paragraph: 4, condition: { dimensionId: 'conquest', range: 'high' }, text: '征服之路虽然荣耀，但最伟大的统帅也懂得何时收剑。真正的力量不只在于赢得每场战斗，更在于知道哪些战斗根本不需要打。' },
  { paragraph: 4, condition: { dimensionId: 'explore', range: 'low' }, text: '守护的决心令人敬佩，但偶尔抬头看看地平线以外的风景，你可能会发现——有些值得守护的东西，恰恰藏在未知的旅途之中。' },
  { paragraph: 4, condition: { dimensionId: 'explore', range: 'high' }, text: '探索者总是渴望前方的风景，但有时回头看看走过的路，你会发现那些被你匆匆路过的地方，其实也值得驻足和珍惜。' },
  { paragraph: 4, condition: { dimensionId: 'shadow', range: 'low' }, text: '光明是伟大的追求，但世界的复杂有时超越了黑白分明的框架。理解灰色地带的存在，不会让你的光芒暗淡——反而会让它更加真实。' },
  { paragraph: 4, condition: { dimensionId: 'shadow', range: 'high' }, text: '暗影中的高手也需要阳光。偶尔走出阴影，坦诚面对自己和他人，你会发现有些力量不需要隐藏也同样强大。' },
  { paragraph: 4, condition: { dimensionId: 'agility', range: 'low' }, text: '坚韧是你的基石，但灵活不是软弱的同义词。如同大树在暴风中弯腰而不折断，适时的变通可以让你的坚持走得更远。' },
  { paragraph: 4, condition: { dimensionId: 'agility', range: 'high' }, text: '灵巧让你游刃有余，但有些时刻需要的不是闪避，而是正面承受。学会在必要时站定脚跟，你会发现自己远比想象中更加坚强。' },
  { paragraph: 4, condition: { dimensionId: 'ideal', range: 'low' }, text: '务实让你走得稳健，但偶尔抬头仰望星空，给自己一个遥远的目标——不是为了脱离现实，而是为脚下的路赋予更深远的意义。' },
  { paragraph: 4, condition: { dimensionId: 'ideal', range: 'high' }, text: '理想是你的翅膀，但翅膀也需要大地的支撑。在追逐星辰的路上，别忘了脚下的泥土——最伟大的梦想，也需要一步一步地实现。' },
]
```

- [ ] **Step 9: Verify build passes with all data files**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 10: Commit**

```bash
cd /data/workspace/mbti-test
git add app/types/ app/data/
git commit -m "feat: add type definitions and all quiz/region/hero/template data"
```

---

### Task 3: Quiz State Management (useQuiz composable)

**Files:**
- Create: `app/composables/useQuiz.ts`
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Create useQuiz composable**

```ts
// app/composables/useQuiz.ts
import { scaleQuestions } from '~/data/scaleQuestions'
import { scenarioQuestions } from '~/data/scenarioQuestions'

export type Scene = 'welcome' | 'scale' | 'scenario' | 'loading' | 'result'

const scene = ref<Scene>('welcome')
const scaleAnswers = ref<(number | null)[]>(new Array(scaleQuestions.length).fill(null))
const scenarioAnswers = ref<(number | null)[]>(new Array(scenarioQuestions.length).fill(null))
const currentScaleIndex = ref(0)
const currentScenarioIndex = ref(0)

export function useQuiz() {
  const totalScaleQuestions = scaleQuestions.length
  const totalScenarioQuestions = scenarioQuestions.length

  const currentScaleQuestion = computed(() => scaleQuestions[currentScaleIndex.value])
  const currentScenarioQuestion = computed(() => scenarioQuestions[currentScenarioIndex.value])

  const scaleProgress = computed(() =>
    scaleAnswers.value.filter((a) => a !== null).length / totalScaleQuestions,
  )
  const scenarioProgress = computed(() =>
    scenarioAnswers.value.filter((a) => a !== null).length / totalScenarioQuestions,
  )

  function startQuiz() {
    scaleAnswers.value = new Array(totalScaleQuestions).fill(null)
    scenarioAnswers.value = new Array(totalScenarioQuestions).fill(null)
    currentScaleIndex.value = 0
    currentScenarioIndex.value = 0
    scene.value = 'scale'
  }

  function answerScale(questionIndex: number, value: number) {
    scaleAnswers.value[questionIndex] = value
    if (questionIndex < totalScaleQuestions - 1) {
      currentScaleIndex.value = questionIndex + 1
    }
    else {
      // Check if all scale questions answered
      const allAnswered = scaleAnswers.value.every((a) => a !== null)
      if (allAnswered) {
        scene.value = 'scenario'
      }
    }
  }

  function answerScenario(questionIndex: number, optionIndex: number) {
    scenarioAnswers.value[questionIndex] = optionIndex
    if (questionIndex < totalScenarioQuestions - 1) {
      currentScenarioIndex.value = questionIndex + 1
    }
    else {
      const allAnswered = scenarioAnswers.value.every((a) => a !== null)
      if (allAnswered) {
        scene.value = 'loading'
      }
    }
  }

  function goToScaleQuestion(index: number) {
    if (index >= 0 && index < totalScaleQuestions) {
      currentScaleIndex.value = index
    }
  }

  function goToScenarioQuestion(index: number) {
    if (index >= 0 && index < totalScenarioQuestions) {
      currentScenarioIndex.value = index
    }
  }

  function showResult() {
    scene.value = 'result'
  }

  function restart() {
    scene.value = 'welcome'
  }

  return {
    scene: readonly(scene),
    scaleAnswers: readonly(scaleAnswers),
    scenarioAnswers: readonly(scenarioAnswers),
    currentScaleIndex: readonly(currentScaleIndex),
    currentScenarioIndex: readonly(currentScenarioIndex),
    currentScaleQuestion,
    currentScenarioQuestion,
    totalScaleQuestions,
    totalScenarioQuestions,
    scaleProgress,
    scenarioProgress,
    startQuiz,
    answerScale,
    answerScenario,
    goToScaleQuestion,
    goToScenarioQuestion,
    showResult,
    restart,
  }
}
```

- [ ] **Step 2: Update index.vue to use useQuiz**

Replace the entire `app/pages/index.vue` with:

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
const {
  scene,
  currentScaleIndex,
  currentScenarioIndex,
  currentScaleQuestion,
  currentScenarioQuestion,
  totalScaleQuestions,
  totalScenarioQuestions,
  scaleAnswers,
  scenarioAnswers,
  scaleProgress,
  scenarioProgress,
  startQuiz,
  answerScale,
  answerScenario,
  goToScaleQuestion,
  goToScenarioQuestion,
  showResult,
  restart,
} = useQuiz()
</script>

<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <WelcomePage v-if="scene === 'welcome'" key="welcome" @start="startQuiz" />

      <div v-else-if="scene === 'scale'" key="scale" class="quiz-scene">
        <ProgressBar
          :current="currentScaleIndex + 1"
          :total="totalScaleQuestions"
          :progress="scaleProgress"
          label="量表题"
          :answers="scaleAnswers"
          @go-to="goToScaleQuestion"
        />
        <Transition name="slide" mode="out-in">
          <ScaleQuestion
            :key="currentScaleQuestion.id"
            :question="currentScaleQuestion"
            :answer="scaleAnswers[currentScaleIndex]"
            @answer="(val: number) => answerScale(currentScaleIndex, val)"
          />
        </Transition>
      </div>

      <div v-else-if="scene === 'scenario'" key="scenario" class="quiz-scene">
        <ProgressBar
          :current="currentScenarioIndex + 1"
          :total="totalScenarioQuestions"
          label="情景题"
          :progress="scenarioProgress"
          :answers="scenarioAnswers"
          @go-to="goToScenarioQuestion"
        />
        <Transition name="slide" mode="out-in">
          <ScenarioQuestion
            :key="currentScenarioQuestion.id"
            :question="currentScenarioQuestion"
            :answer="scenarioAnswers[currentScenarioIndex]"
            @answer="(idx: number) => answerScenario(currentScenarioIndex, idx)"
          />
        </Transition>
      </div>

      <LoadingTransition v-else-if="scene === 'loading'" key="loading" @complete="showResult" />

      <ResultPage v-else-if="scene === 'result'" key="result" @restart="restart" />
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quiz-scene {
  width: 100%;
  max-width: 800px;
  padding: var(--space-lg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

Expected: Build succeeds (placeholder components will be auto-imported once created in next tasks).

- [ ] **Step 4: Commit**

```bash
cd /data/workspace/mbti-test
git add app/composables/useQuiz.ts app/pages/index.vue
git commit -m "feat: add useQuiz composable with full quiz state management"
```

---

### Task 4: Scoring & Matching Composables

**Files:**
- Create: `app/composables/useScoring.ts`
- Create: `app/composables/useMatching.ts`

- [ ] **Step 1: Create useScoring composable**

```ts
// app/composables/useScoring.ts
import type { DimensionId, DimensionVector } from '~/types'
import { scaleQuestions } from '~/data/scaleQuestions'
import { scenarioQuestions } from '~/data/scenarioQuestions'
import { DIMENSION_IDS } from '~/data/dimensions'

/**
 * Calculate dimension scores from quiz answers.
 * Scale questions: 70% weight. Scenario questions: 30% weight.
 */
export function useScoring() {
  function calculateScores(
    scaleAnswers: (number | null)[],
    scenarioAnswers: (number | null)[],
  ): DimensionVector {
    // 1. Calculate scale scores per dimension (raw: 3-15, normalized: 1-10)
    const scaleScores = calculateScaleScores(scaleAnswers)

    // 2. Calculate scenario scores per dimension (normalized: 1-10)
    const scenarioScores = calculateScenarioScores(scenarioAnswers)

    // 3. Weighted merge: 70% scale + 30% scenario
    const finalScores = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      const scaleVal = scaleScores[dimId] ?? 5.5
      const scenarioVal = scenarioScores[dimId] ?? 5.5
      const merged = scaleVal * 0.7 + scenarioVal * 0.3
      // Clamp to 1-10
      finalScores[dimId] = Math.max(1, Math.min(10, Math.round(merged * 10) / 10))
    }

    return finalScores
  }

  function calculateScaleScores(answers: (number | null)[]): DimensionVector {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
    }

    scaleQuestions.forEach((q, i) => {
      const answer = answers[i]
      if (answer === null) return
      // answer is 1-5; reverse means invert (6 - answer)
      const score = q.reverse ? 6 - answer : answer
      sums[q.dimensionId] += score
      counts[q.dimensionId]++
    })

    const result = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (counts[dimId] === 0) {
        result[dimId] = 5.5
      }
      else {
        // Each dimension has 3 questions, raw sum is 3-15
        // Normalize to 1-10: ((sum - 3) / 12) * 9 + 1
        const rawSum = sums[dimId]
        const maxSum = counts[dimId] * 5
        const minSum = counts[dimId] * 1
        result[dimId] = ((rawSum - minSum) / (maxSum - minSum)) * 9 + 1
      }
    }

    return result
  }

  function calculateScenarioScores(answers: (number | null)[]): DimensionVector {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const dimId of DIMENSION_IDS) {
      sums[dimId] = 0
      counts[dimId] = 0
    }

    scenarioQuestions.forEach((q, i) => {
      const answerIdx = answers[i]
      if (answerIdx === null) return
      const option = q.options[answerIdx]
      if (!option) return
      for (const [dimId, weight] of Object.entries(option.weights)) {
        sums[dimId] += weight
        counts[dimId]++
      }
    })

    // Normalize scenario scores to 1-10
    // Scenario weights typically range from -2 to +2
    // We treat 0 as neutral (5.5), and scale proportionally
    const result = {} as DimensionVector
    for (const dimId of DIMENSION_IDS) {
      if (counts[dimId] === 0) {
        result[dimId] = 5.5
      }
      else {
        // Average weight, then map [-2, 2] → [1, 10]
        const avg = sums[dimId] / counts[dimId]
        result[dimId] = Math.max(1, Math.min(10, (avg + 2) / 4 * 9 + 1))
      }
    }

    return result
  }

  return { calculateScores }
}
```

- [ ] **Step 2: Create useMatching composable**

```ts
// app/composables/useMatching.ts
import type { DimensionVector, Hero, MatchResult, Region } from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'
import { heroes } from '~/data/heroes'
import { regions } from '~/data/regions'

export function useMatching() {
  function cosineSimilarity(a: DimensionVector, b: DimensionVector): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (const dimId of DIMENSION_IDS) {
      const va = a[dimId]
      const vb = b[dimId]
      dotProduct += va * vb
      normA += va * va
      normB += vb * vb
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    if (denominator === 0) return 0
    return dotProduct / denominator
  }

  function matchRegion(scores: DimensionVector): { region: Region, similarity: number } {
    let bestRegion = regions[0]
    let bestSimilarity = -1

    for (const region of regions) {
      const similarity = cosineSimilarity(scores, region.vector)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestRegion = region
      }
    }

    return { region: bestRegion, similarity: bestSimilarity }
  }

  function matchHeroes(scores: DimensionVector): { hero: Hero, similarity: number }[] {
    const heroScores = heroes.map((hero) => ({
      hero,
      similarity: cosineSimilarity(scores, hero.vector),
    }))

    heroScores.sort((a, b) => b.similarity - a.similarity)
    return heroScores.slice(0, 3)
  }

  function getMatchResult(scores: DimensionVector): MatchResult {
    const { region, similarity: regionSimilarity } = matchRegion(scores)
    const topHeroes = matchHeroes(scores)

    return {
      region,
      regionSimilarity,
      topHeroes,
      dimensionScores: scores,
    }
  }

  return { getMatchResult, cosineSimilarity }
}
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /data/workspace/mbti-test
git add app/composables/useScoring.ts app/composables/useMatching.ts
git commit -m "feat: add scoring and matching composables with cosine similarity"
```

---

### Task 5: Quiz UI Components (ProgressBar, ScaleQuestion, ScenarioQuestion)

**Files:**
- Create: `app/components/ProgressBar.vue`
- Create: `app/components/ScaleQuestion.vue`
- Create: `app/components/ScenarioQuestion.vue`

- [ ] **Step 1: Create ProgressBar component**

```vue
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
```

- [ ] **Step 2: Create ScaleQuestion component**

```vue
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
```

- [ ] **Step 3: Create ScenarioQuestion component**

```vue
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
```

- [ ] **Step 4: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /data/workspace/mbti-test
git add app/components/ProgressBar.vue app/components/ScaleQuestion.vue app/components/ScenarioQuestion.vue
git commit -m "feat: add quiz UI components (ProgressBar, ScaleQuestion, ScenarioQuestion)"
```

---

### Task 6: Loading Transition & Result Page Shell

**Files:**
- Create: `app/components/LoadingTransition.vue`
- Create: `app/components/ResultPage.vue`

- [ ] **Step 1: Create LoadingTransition component**

```vue
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
```

- [ ] **Step 2: Create ResultPage component**

```vue
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
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /data/workspace/mbti-test
git add app/components/LoadingTransition.vue app/components/ResultPage.vue
git commit -m "feat: add loading transition and result page shell"
```

---

### Task 7: Radar Chart Component (Canvas)

**Files:**
- Create: `app/components/RadarChart.vue`

- [ ] **Step 1: Create RadarChart component**

```vue
<!-- app/components/RadarChart.vue -->
<script setup lang="ts">
import type { DimensionVector } from '~/types'
import { dimensions } from '~/data/dimensions'

const props = defineProps<{ scores: DimensionVector }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationProgress = ref(0)
let animationId: number | null = null

const SIZE = 500
const CENTER = SIZE / 2
const RADIUS = SIZE * 0.38
const RINGS = [0.333, 0.666, 1.0]

function getPoint(index: number, value: number, maxRadius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2
  const r = (value / 10) * maxRadius
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = SIZE * dpr
  canvas.height = SIZE * dpr
  canvas.style.width = `${SIZE}px`
  canvas.style.height = `${SIZE}px`
  ctx.scale(dpr, dpr)

  ctx.clearRect(0, 0, SIZE, SIZE)

  // Draw concentric rings
  for (const ring of RINGS) {
    ctx.beginPath()
    for (let i = 0; i <= 8; i++) {
      const [x, y] = getPoint(i % 8, ring * 10, RADIUS)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(168, 152, 128, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Draw axis lines
  for (let i = 0; i < 8; i++) {
    const [x, y] = getPoint(i, 10, RADIUS)
    ctx.beginPath()
    ctx.moveTo(CENTER, CENTER)
    ctx.lineTo(x, y)
    ctx.strokeStyle = 'rgba(168, 152, 128, 0.15)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Draw data polygon (animated)
  const progress = animationProgress.value
  ctx.beginPath()
  dimensions.forEach((dim, i) => {
    const score = props.scores[dim.id] * progress
    const [x, y] = getPoint(i, score, RADIUS)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(201, 168, 76, 0.15)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.8)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw data points
  dimensions.forEach((dim, i) => {
    const score = props.scores[dim.id] * progress
    const [x, y] = getPoint(i, score, RADIUS)
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#c9a84c'
    ctx.fill()
  })

  // Draw labels
  ctx.font = '14px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  dimensions.forEach((dim, i) => {
    const [x, y] = getPoint(i, 11.5, RADIUS)
    ctx.fillStyle = '#a89880'
    ctx.fillText(dim.highLabel, x, y)

    // Score value
    const score = props.scores[dim.id]
    const [sx, sy] = getPoint(i, 13, RADIUS)
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#c9a84c'
    ctx.fillText(score.toFixed(1), sx, sy)
    ctx.font = '14px "Noto Serif SC", serif'
  })
}

function animate() {
  const start = performance.now()
  const duration = 1500

  function step(time: number) {
    const elapsed = time - start
    animationProgress.value = Math.min(1, elapsed / duration)
    draw()
    if (animationProgress.value < 1) {
      animationId = requestAnimationFrame(step)
    }
  }

  animationId = requestAnimationFrame(step)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div class="radar-chart">
    <canvas ref="canvasRef" class="radar-canvas" />
  </div>
</template>

<style scoped>
.radar-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-lg) 0;
}

.radar-canvas {
  max-width: 100%;
  height: auto;
}
</style>
```

- [ ] **Step 2: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /data/workspace/mbti-test
git add app/components/RadarChart.vue
git commit -m "feat: add canvas-based radar chart with animation"
```

---

### Task 8: DimensionReadings & HeroCard & SummaryText Components

**Files:**
- Create: `app/components/DimensionReadings.vue`
- Create: `app/components/HeroCard.vue`
- Create: `app/components/SummaryText.vue`

- [ ] **Step 1: Create DimensionReadings component**

```vue
<!-- app/components/DimensionReadings.vue -->
<script setup lang="ts">
import type { DimensionVector } from '~/types'
import { dimensions } from '~/data/dimensions'
import { dimensionTexts } from '~/data/dimensionTexts'

const props = defineProps<{ scores: DimensionVector }>()

function getRange(score: number): 'low' | 'mid' | 'high' {
  if (score <= 3.5) return 'low'
  if (score <= 6.5) return 'mid'
  return 'high'
}

const readings = computed(() =>
  dimensions.map((dim) => {
    const score = props.scores[dim.id]
    const range = getRange(score)
    const textEntry = dimensionTexts.find(
      (t) => t.dimensionId === dim.id && t.range === range,
    )
    return {
      dim,
      score,
      text: textEntry?.text ?? '',
    }
  }),
)
</script>

<template>
  <div class="dimension-readings">
    <h3 class="section-title">维度解读</h3>
    <div v-for="reading in readings" :key="reading.dim.id" class="reading-item">
      <div class="reading-header">
        <span class="dim-label">{{ reading.dim.highLabel }}</span>
        <span class="dim-score">{{ reading.score.toFixed(1) }}</span>
        <div class="score-bar">
          <div class="score-fill" :style="{ width: `${reading.score * 10}%` }" />
        </div>
      </div>
      <p class="reading-text">{{ reading.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.dimension-readings {
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

.reading-item {
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--color-surface);
  border-radius: 8px;
  border-left: 3px solid var(--color-gold-dark);
}

.reading-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.dim-label {
  font-weight: 600;
  color: var(--color-gold);
  min-width: 40px;
}

.dim-score {
  font-weight: 700;
  color: var(--color-gold-light);
  min-width: 32px;
  font-size: 0.9rem;
}

.score-bar {
  flex: 1;
  height: 4px;
  background: rgba(168, 152, 128, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold-dark), var(--color-gold));
  border-radius: 2px;
  transition: width 1s ease;
}

.reading-text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}
</style>
```

- [ ] **Step 2: Create HeroCard component**

```vue
<!-- app/components/HeroCard.vue -->
<script setup lang="ts">
import type { Hero, Region } from '~/types'

defineProps<{
  topHeroes: { hero: Hero, similarity: number }[]
  region: Region
}>()

function similarityPercent(similarity: number): string {
  return `${Math.round(similarity * 100)}%`
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
      <p class="hero-region">{{ region.name }} · {{ topHeroes[0].hero.nameEn }}</p>
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
```

- [ ] **Step 3: Create SummaryText component**

```vue
<!-- app/components/SummaryText.vue -->
<script setup lang="ts">
import type { DimensionId, MatchResult } from '~/types'
import { DIMENSION_IDS } from '~/data/dimensions'
import { summaryTemplates } from '~/data/summaryTemplates'

const props = defineProps<{ result: MatchResult }>()

function getRange(score: number): 'low' | 'mid' | 'high' {
  if (score <= 3.5) return 'low'
  if (score <= 6.5) return 'mid'
  return 'high'
}

function getSortedDimensions(scores: Record<DimensionId, number>, order: 'desc' | 'asc') {
  return [...DIMENSION_IDS].sort((a, b) =>
    order === 'desc' ? scores[b] - scores[a] : scores[a] - scores[b],
  )
}

function fillPlaceholders(text: string): string {
  const region = props.result.region
  const hero = props.result.topHeroes[0]?.hero
  return text
    .replace(/\{regionName\}/g, region?.name ?? '')
    .replace(/\{regionLore\}/g, region?.lore ?? '')
    .replace(/\{heroName\}/g, hero?.name ?? '')
    .replace(/\{heroTitle\}/g, hero?.title ?? '')
    .replace(/\{heroLore\}/g, hero?.lore ?? '')
}

const paragraphs = computed(() => {
  const scores = props.result.dimensionScores
  const topDims = getSortedDimensions(scores, 'desc')
  const bottomDims = getSortedDimensions(scores, 'asc')

  // Paragraph 1: Top 2 dimensions
  const p1Parts: string[] = []
  for (const dimId of topDims.slice(0, 2)) {
    const range = getRange(scores[dimId])
    const template = summaryTemplates.find(
      (t) => t.paragraph === 1 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) p1Parts.push(fillPlaceholders(template.text))
  }

  // Paragraph 2: Best matching region dimension
  let p2 = ''
  for (const dimId of topDims) {
    const range = getRange(scores[dimId])
    const template = summaryTemplates.find(
      (t) => t.paragraph === 2 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) {
      p2 = fillPlaceholders(template.text)
      break
    }
  }

  // Paragraph 3: Hero resonance based on top dimension
  let p3 = ''
  for (const dimId of topDims) {
    const range = getRange(scores[dimId])
    const template = summaryTemplates.find(
      (t) => t.paragraph === 3 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) {
      p3 = fillPlaceholders(template.text)
      break
    }
  }

  // Paragraph 4: Growth based on lowest dimension
  let p4 = ''
  for (const dimId of bottomDims) {
    const range = getRange(scores[dimId])
    const template = summaryTemplates.find(
      (t) => t.paragraph === 4 && t.condition.dimensionId === dimId && t.condition.range === range,
    )
    if (template) {
      p4 = fillPlaceholders(template.text)
      break
    }
  }

  return [
    { title: '核心人格', text: p1Parts.join('') },
    { title: '城邦归属', text: p2 },
    { title: '英雄共鸣', text: p3 },
    { title: '光与影', text: p4 },
  ]
})
</script>

<template>
  <div class="summary-text">
    <h3 class="section-title">命运之书</h3>
    <div v-for="(para, i) in paragraphs" :key="i" class="summary-paragraph">
      <h4 class="para-title">{{ para.title }}</h4>
      <p class="para-text">{{ para.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.summary-text {
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

.summary-paragraph {
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: 8px;
  border-left: 3px solid var(--color-gold-dark);
}

.para-title {
  font-size: 1rem;
  color: var(--color-gold);
  margin-bottom: var(--space-sm);
  letter-spacing: 2px;
}

.para-text {
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--color-text);
}
</style>
```

- [ ] **Step 4: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /data/workspace/mbti-test
git add app/components/DimensionReadings.vue app/components/HeroCard.vue app/components/SummaryText.vue
git commit -m "feat: add dimension readings, hero card, and summary text components"
```

---

### Task 9: Share Card & Image Download

**Files:**
- Create: `app/components/ShareCard.vue`

- [ ] **Step 1: Install html2canvas**

Run:
```bash
cd /data/workspace/mbti-test && npm install html2canvas
```

- [ ] **Step 2: Create ShareCard component**

```vue
<!-- app/components/ShareCard.vue -->
<script setup lang="ts">
import type { MatchResult } from '~/types'
import { dimensions } from '~/data/dimensions'

const props = defineProps<{ result: MatchResult }>()

const shareCardRef = ref<HTMLDivElement | null>(null)
const isGenerating = ref(false)

async function downloadImage() {
  if (!shareCardRef.value || isGenerating.value) return

  isGenerating.value = true
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(shareCardRef.value, {
      width: 750,
      height: 1334,
      scale: 1,
      backgroundColor: '#1a1410',
      useCORS: true,
    })

    const link = document.createElement('a')
    link.download = `lol-personality-${props.result.region.nameEn.toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  catch (err) {
    console.error('Failed to generate share image:', err)
  }
  finally {
    isGenerating.value = false
  }
}

// Mini radar chart drawing on a canvas inside the share card
const miniCanvasRef = ref<HTMLCanvasElement | null>(null)

function drawMiniRadar() {
  const canvas = miniCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = 280
  const center = size / 2
  const radius = size * 0.38

  canvas.width = size
  canvas.height = size

  // Rings
  for (const ring of [0.333, 0.666, 1.0]) {
    ctx.beginPath()
    for (let i = 0; i <= 8; i++) {
      const angle = (Math.PI * 2 * (i % 8)) / 8 - Math.PI / 2
      const r = ring * radius
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(168, 152, 128, 0.25)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Data polygon
  ctx.beginPath()
  dimensions.forEach((dim, i) => {
    const score = props.result.dimensionScores[dim.id]
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2
    const r = (score / 10) * radius
    const x = center + r * Math.cos(angle)
    const y = center + r * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(201, 168, 76, 0.2)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.8)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Labels
  ctx.font = '12px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  dimensions.forEach((dim, i) => {
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2
    const labelR = radius + 20
    const x = center + labelR * Math.cos(angle)
    const y = center + labelR * Math.sin(angle)
    ctx.fillStyle = '#a89880'
    ctx.fillText(dim.highLabel, x, y)
  })
}

onMounted(() => {
  nextTick(() => drawMiniRadar())
})

const heroName = computed(() => props.result.topHeroes[0]?.hero.name ?? '')
const heroTitle = computed(() => props.result.topHeroes[0]?.hero.title ?? '')
const matchPercent = computed(() =>
  props.result.topHeroes[0]
    ? `${Math.round(props.result.topHeroes[0].similarity * 100)}%`
    : '',
)
</script>

<template>
  <div>
    <button class="download-btn" :disabled="isGenerating" @click="downloadImage">
      {{ isGenerating ? '生成中...' : '保存结果图片' }}
    </button>

    <!-- Hidden share card for html2canvas capture -->
    <div class="share-card-wrapper">
      <div ref="shareCardRef" class="share-card">
        <div class="share-header">
          <p class="share-site-title">你属于哪片土地？</p>
          <div class="share-divider" />
        </div>

        <div class="share-region">
          <p class="share-region-name">{{ result.region.name }}</p>
          <p class="share-region-en">{{ result.region.nameEn }}</p>
        </div>

        <div class="share-radar">
          <canvas ref="miniCanvasRef" class="mini-radar-canvas" />
        </div>

        <div class="share-hero">
          <p class="share-hero-name">{{ heroName }} · {{ heroTitle }}</p>
          <p class="share-hero-match">匹配度 {{ matchPercent }}</p>
        </div>

        <div class="share-summary">
          <p>{{ result.region.description }}</p>
        </div>

        <div class="share-footer">
          <div class="share-divider" />
          <p class="share-cta">来测测你属于哪片土地</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-btn {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold));
  color: var(--color-bg);
  font-size: 1rem;
  font-weight: 600;
  padding: var(--space-md) var(--space-xl);
  border-radius: 4px;
  transition: all var(--transition-fast);
  letter-spacing: 2px;
}

.download-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Hidden share card — positioned off-screen for html2canvas */
.share-card-wrapper {
  position: fixed;
  left: -9999px;
  top: 0;
}

.share-card {
  width: 750px;
  height: 1334px;
  background: #1a1410;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 60px 50px;
  font-family: 'Noto Serif SC', serif;
  color: #e8dcc8;
}

.share-header {
  text-align: center;
}

.share-site-title {
  font-size: 28px;
  color: #c9a84c;
  letter-spacing: 6px;
}

.share-divider {
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  margin: 20px auto;
}

.share-region {
  text-align: center;
}

.share-region-name {
  font-size: 42px;
  color: #c9a84c;
  margin-bottom: 8px;
}

.share-region-en {
  font-size: 16px;
  color: #a89880;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.share-radar {
  display: flex;
  justify-content: center;
}

.mini-radar-canvas {
  width: 280px;
  height: 280px;
}

.share-hero {
  text-align: center;
}

.share-hero-name {
  font-size: 24px;
  color: #e8dcc8;
  margin-bottom: 8px;
}

.share-hero-match {
  font-size: 16px;
  color: #c9a84c;
}

.share-summary {
  text-align: center;
  padding: 0 30px;
  font-size: 18px;
  line-height: 1.8;
  color: #a89880;
}

.share-footer {
  text-align: center;
}

.share-cta {
  font-size: 16px;
  color: #a89880;
  letter-spacing: 2px;
}
</style>
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /data/workspace/mbti-test
git add app/components/ShareCard.vue package.json package-lock.json
git commit -m "feat: add share card with html2canvas image download"
```

---

### Task 10: Scroll Animations & Mobile Responsive

**Files:**
- Modify: `app/components/ResultPage.vue`
- Modify: `app/styles/global.css`

- [ ] **Step 1: Add scroll-reveal animation to ResultPage**

Replace the `<template>` section of `app/components/ResultPage.vue` — wrap each section with a scroll-reveal `<div>`:

Add this script logic at the top of `<script setup>`:

```ts
// Add to existing script setup in ResultPage.vue, after the result computed:
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
```

Update each `<section>` in the template to use:

```vue
<section
  :ref="(el) => setSectionRef(el, 0)"
  class="result-section region-banner"
  :class="{ visible: visibleSections.has(0) }"
>
```

(Repeat for indices 1-5 for each section.)

Add this CSS to the `<style scoped>`:

```css
.result-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.result-section.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Add mobile responsive styles to global.css**

Append to `app/styles/global.css`:

```css
/* Mobile responsive */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }

  .quiz-scene {
    padding: var(--space-md);
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }
}
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /data/workspace/mbti-test
git add app/components/ResultPage.vue app/styles/global.css
git commit -m "feat: add scroll-reveal animations and mobile responsive styles"
```

---

### Task 11: Final Integration & Smoke Test

**Files:**
- All files reviewed for integration

- [ ] **Step 1: Run full build**

Run:
```bash
cd /data/workspace/mbti-test && npm run build
```

Expected: Build completes with zero errors.

- [ ] **Step 2: Start dev server and verify all 5 scenes work**

Run:
```bash
cd /data/workspace/mbti-test && npm run dev
```

Manually verify:
1. Welcome page shows title and start button
2. Clicking start shows scale questions with progress bar
3. After 24 scale questions, transitions to scenario questions
4. After 8 scenario questions, shows loading animation
5. Result page shows: region banner → radar chart → dimension readings → hero cards → summary → share button

- [ ] **Step 3: Run nuxt generate for static output**

Run:
```bash
cd /data/workspace/mbti-test && npm run generate
```

Expected: Static files generated in `.output/public/`.

- [ ] **Step 4: Final commit**

```bash
cd /data/workspace/mbti-test
git add -A
git commit -m "feat: complete LoL MBTI personality test website v1.0"
```
