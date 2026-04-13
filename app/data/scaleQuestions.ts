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
