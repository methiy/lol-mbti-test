# 评分算法优化 + 结果解释功能设计

## 概述

优化 mbti-test 项目的评分算法，提高结果准确性和贴切度，并在结果页面添加"为什么你是这个结果"的解释功能。

## 现状问题分析

### 1. 量表题抽样不足
- 题库有 48 题（每维度 6 题），每次只抽 3 题/维度 = 24 题
- 3 题的样本量太小，容易被个别极端回答偏移结果

### 2. 情景题维度覆盖不均
- 每道情景题只影响 2 个维度（通过 weights），8 个维度无法保证均匀覆盖
- 随机抽 8 道情景题，某些维度可能 0 数据点 → 回退到 5.5 中位值

### 3. 情景题归一化公式有偏差
- `(avg + 2) / 4 * 9 + 1` 假设 weight 范围 [-2, 2]
- 实际上单次选择只提供 1-2 个维度的 weight，未覆盖的维度直接 fallback
- 当 count=1 时，单个 weight 值被过度放大

### 4. 无题目区分度权重
- 所有题目权重相同，但有些题目比其他题目更具区分力

### 5. 无结果解释
- 用户只看到分数和匹配结果，不知道"为什么"

---

## 设计方案

### A. 算法优化

#### A1. 增加量表题抽样数量
- **每维度抽 4 题**（从 6 题池中），总共 32 题量表题
- 比之前多 8 题，但显著提高可靠性（Cronbach α 随样本量增加而稳定提升）

#### A2. 添加题目权重（区分度）
- 为每道量表题增加 `weight` 字段（默认 1.0）
- 部分核心/直接的题目权重 1.2，部分间接/模糊的题目权重 0.8
- 评分公式改为加权平均：`weightedSum / weightCount` 替代简单平均

```ts
// ScaleQuestion 新增字段
interface ScaleQuestion {
  id: number
  text: string
  dimensionId: DimensionId
  reverse: boolean
  weight: number  // 新增，默认 1.0
}
```

#### A3. 改进情景题抽样策略 — 维度均衡覆盖
- 分析每道情景题涉及的主维度（weight 绝对值最大的维度）
- 抽题时确保 8 个维度都至少被覆盖 1 次
- 算法：先为每个维度选 1 道覆盖它的情景题（8 道），然后再随机补充 2 道 → 总共 10 道情景题

#### A4. 改进情景题评分归一化
- 问题：当某维度只有 1 个数据点时，归一化结果极端
- 方案：**置信度加权融合**
  - 数据点少时，情景题分数的影响自动降低，向 5.5 中位值回归
  - 具体公式：`confidence = min(1, count / 3)`，情景题最终值 = `rawScore * confidence + 5.5 * (1 - confidence)`

#### A5. 调整量表/情景题权重比
- 当前：量表 70% + 情景 30%
- 优化后：量表 65% + 情景 35%（情景题覆盖更均匀后，可以给更多权重）

### B. 结果解释功能

#### B1. 数据收集 — 答题溯源
在评分过程中，记录每个维度的"得分贡献来源"：

```ts
interface DimensionEvidence {
  dimensionId: DimensionId
  finalScore: number
  scaleContributions: {
    questionText: string
    answer: number          // 1-5 原始回答
    effectiveScore: number  // 归一化后的贡献值
    direction: 'towards_high' | 'towards_low' | 'neutral'
  }[]
  scenarioContributions: {
    narrative: string       // 情景描述（截取前30字）
    chosenOption: string    // 选择的选项文本
    weight: number          // 该选项对此维度的 weight 值
    direction: 'towards_high' | 'towards_low'
  }[]
}
```

#### B2. 解释文案生成
对每个维度，根据 evidence 数据生成简明解释：
- 列出最极端的 2 个回答（最倾向 high 和最倾向 low 的题目）
- 用"你在 XX 题中选择了 YY，这说明你倾向于 ZZ"的格式
- 情景题直接引用场景和选择

#### B3. UI — ResultExplanation 组件
新增一个可折叠的"为什么是这个结果？"区块，放在维度解读之后：

- 默认折叠状态，点击展开
- 按维度分组展示
- 每个维度：分数条 + 关键回答引用（2-3 条）
- 情景题引用格式：「在 XX 场景中，你选择了"YY"」→ 体现了 ZZ 倾向
- 量表题引用格式：「"XX"— 你选择了 非常符合」→ 说明你倾向于 ZZ

视觉风格：
- 与现有 DimensionReadings 的卡片风格保持一致
- 使用与 summary-paragraph 一致的 `color-surface` 背景 + 金色左边框
- 折叠/展开使用 Vue Transition 过渡动画

---

## 实现清单

### 文件变更

1. **`app/types/index.ts`** — 新增 `DimensionEvidence` 类型，ScaleQuestion 增加 `weight` 字段
2. **`app/data/scaleQuestions.ts`** — 为每道题添加 `weight` 值
3. **`app/composables/useScoring.ts`** — 重写评分逻辑：
   - 加权平均量表题评分
   - 情景题置信度回归
   - 调整合并比例 65/35
   - 新增 `calculateScoresWithEvidence()` 返回 evidence 数据
4. **`app/composables/useQuiz.ts`** — 改抽题策略：
   - 量表题每维度 4 题
   - 情景题 10 题 + 维度均衡覆盖逻辑
5. **`app/components/ResultExplanation.vue`** — 新增解释组件
6. **`app/components/ResultPage.vue`** — 集成解释组件
7. **`app/data/scenarioQuestions.ts`** + **`app/data/onepiece/scenarioQuestions.ts`** — 为每道题标记主维度（用于均衡抽题）

### 不变的部分
- 维度定义（8 个维度不变）
- 匹配逻辑（useMatching.ts 不变）
- 已有 UI 组件的样式不变
- 雷达图、英雄卡片等不变

---

## 测试边界

- 全部回答中间值 → 各维度应接近 5.5
- 全部回答极端值 → 各维度应接近 1 或 10
- 情景题某维度 0 覆盖 → 置信度回归确保不出现极端偏移
- 量表题 weight 范围：0.8-1.2，不会过度拉偏
