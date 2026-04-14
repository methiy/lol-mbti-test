import type { ScaleQuestion } from '~/types'

export const scaleQuestions: ScaleQuestion[] = [
  // ===== chaos (秩序⟷混沌) =====
  { id: 1, text: '比起遵守既定规则，我更倾向于按自己的方式行事。', dimensionId: 'chaos', reverse: false, weight: 1.2 },
  { id: 2, text: '我认为社会需要明确的规章制度来维持秩序。', dimensionId: 'chaos', reverse: true, weight: 1.0 },
  { id: 3, text: '如果一条规则不合理，我会毫不犹豫地打破它。', dimensionId: 'chaos', reverse: false, weight: 1.2 },

  // ===== intuition (理性⟷直觉) =====
  { id: 4, text: '做重要决定时，我更相信自己的直觉而非数据分析。', dimensionId: 'intuition', reverse: false, weight: 1.2 },
  { id: 5, text: '面对复杂问题，我倾向于先制定详细的计划再行动。', dimensionId: 'intuition', reverse: true, weight: 1.0 },
  { id: 6, text: '我常常在没有明确理由的情况下就能感知到事情的走向。', dimensionId: 'intuition', reverse: false, weight: 1.1 },

  // ===== bond (独行⟷羁绊) =====
  { id: 7, text: '我宁愿和朋友一起失败，也不愿独自成功。', dimensionId: 'bond', reverse: false, weight: 1.2 },
  { id: 8, text: '独自工作时我的效率最高。', dimensionId: 'bond', reverse: true, weight: 1.0 },
  { id: 9, text: '我认为守护身边的人是最重要的事。', dimensionId: 'bond', reverse: false, weight: 1.1 },

  // ===== conquest (和平⟷征服) =====
  { id: 10, text: '我享受竞争，并且总是想要赢。', dimensionId: 'conquest', reverse: false, weight: 1.2 },
  { id: 11, text: '能用对话解决的冲突，我绝不会诉诸武力。', dimensionId: 'conquest', reverse: true, weight: 1.0 },
  { id: 12, text: '力量是解决问题最直接有效的方式。', dimensionId: 'conquest', reverse: false, weight: 1.1 },

  // ===== explore (守护⟷探索) =====
  { id: 13, text: '我总是对未知的事物充满好奇，渴望去探索。', dimensionId: 'explore', reverse: false, weight: 1.2 },
  { id: 14, text: '我更喜欢待在熟悉的环境中，那让我感到安全。', dimensionId: 'explore', reverse: true, weight: 1.0 },
  { id: 15, text: '即使有风险，新的体验对我来说也值得尝试。', dimensionId: 'explore', reverse: false, weight: 1.1 },

  // ===== shadow (光明⟷暗影) =====
  { id: 16, text: '有时候达到正确的目的需要使用不那么光彩的手段。', dimensionId: 'shadow', reverse: false, weight: 1.2 },
  { id: 17, text: '我坚信做事应该光明磊落，即使这样会更难。', dimensionId: 'shadow', reverse: true, weight: 1.0 },
  { id: 18, text: '真正的高手懂得在暗处布局，不需要让所有人看到。', dimensionId: 'shadow', reverse: false, weight: 1.0 },

  // ===== agility (坚韧⟷灵巧) =====
  { id: 19, text: '面对困难，我会灵活调整策略而非硬撑到底。', dimensionId: 'agility', reverse: false, weight: 1.2 },
  { id: 20, text: '我相信坚持就是胜利，不会轻易改变自己的方向。', dimensionId: 'agility', reverse: true, weight: 1.0 },
  { id: 21, text: '四两拨千金比正面硬刚更聪明。', dimensionId: 'agility', reverse: false, weight: 1.0 },

  // ===== ideal (务实⟷理想) =====
  { id: 22, text: '我常常会为了一个遥远的理想而放弃眼前的利益。', dimensionId: 'ideal', reverse: false, weight: 1.2 },
  { id: 23, text: '比起画饼，我更关心当下能得到什么。', dimensionId: 'ideal', reverse: true, weight: 1.1 },
  { id: 24, text: '我相信信念的力量终将改变现实。', dimensionId: 'ideal', reverse: false, weight: 1.0 },

  // ===== chaos (秩序⟷混沌) — additional =====
  { id: 25, text: '我觉得太多的条条框框会扼杀创造力。', dimensionId: 'chaos', reverse: false, weight: 1.0 },
  { id: 26, text: '在团队中，我更希望有明确的分工和流程。', dimensionId: 'chaos', reverse: true, weight: 0.9 },
  { id: 27, text: '混乱中往往蕴含着最大的机遇。', dimensionId: 'chaos', reverse: false, weight: 0.8 },

  // ===== intuition (理性⟷直觉) — additional =====
  { id: 28, text: '第一印象往往比深思熟虑后的判断更准确。', dimensionId: 'intuition', reverse: false, weight: 1.0 },
  { id: 29, text: '我做决定前会列出所有利弊进行对比。', dimensionId: 'intuition', reverse: true, weight: 0.9 },
  { id: 30, text: '有些事情我说不出原因，但就是知道该怎么做。', dimensionId: 'intuition', reverse: false, weight: 1.0 },

  // ===== bond (独行⟷羁绊) — additional =====
  { id: 31, text: '分享快乐比独自享受更让我满足。', dimensionId: 'bond', reverse: false, weight: 1.0 },
  { id: 32, text: '我不喜欢依赖别人，也不希望别人依赖我。', dimensionId: 'bond', reverse: true, weight: 1.0 },
  { id: 33, text: '为了朋友，我愿意承受很大的个人损失。', dimensionId: 'bond', reverse: false, weight: 0.9 },

  // ===== conquest (和平⟷征服) — additional =====
  { id: 34, text: '退让不是软弱，而是一种智慧。', dimensionId: 'conquest', reverse: true, weight: 0.8 },
  { id: 35, text: '在任何领域，我都想成为最强的那个人。', dimensionId: 'conquest', reverse: false, weight: 1.1 },
  { id: 36, text: '面对挑衅，我倾向于直接回击而非忍让。', dimensionId: 'conquest', reverse: false, weight: 1.0 },

  // ===== explore (守护⟷探索) — additional =====
  { id: 37, text: '旅行时我更喜欢去从未听说过的地方。', dimensionId: 'explore', reverse: false, weight: 1.0 },
  { id: 38, text: '稳定的日常生活比频繁的变化更让我安心。', dimensionId: 'explore', reverse: true, weight: 1.0 },
  { id: 39, text: '我对"为什么"的好奇远超对"是什么"的关注。', dimensionId: 'explore', reverse: false, weight: 0.8 },

  // ===== shadow (光明⟷暗影) — additional =====
  { id: 40, text: '善意的谎言有时比残酷的真相更好。', dimensionId: 'shadow', reverse: false, weight: 0.8 },
  { id: 41, text: '我觉得一个人的行为应该经得起所有人的审视。', dimensionId: 'shadow', reverse: true, weight: 1.0 },
  { id: 42, text: '掌握别人不知道的信息是一种重要的优势。', dimensionId: 'shadow', reverse: false, weight: 1.1 },

  // ===== agility (坚韧⟷灵巧) — additional =====
  { id: 43, text: '遇到走不通的路，我会毫不犹豫地换一条。', dimensionId: 'agility', reverse: false, weight: 1.0 },
  { id: 44, text: '即使所有人都放弃了，我也会继续坚持。', dimensionId: 'agility', reverse: true, weight: 1.0 },
  { id: 45, text: '见招拆招比制定长远计划更适合我。', dimensionId: 'agility', reverse: false, weight: 0.9 },

  // ===== ideal (务实⟷理想) — additional =====
  { id: 46, text: '我经常思考什么样的世界才是理想的世界。', dimensionId: 'ideal', reverse: false, weight: 0.9 },
  { id: 47, text: '梦想再美好，也不如一个靠谱的计划。', dimensionId: 'ideal', reverse: true, weight: 1.0 },
  { id: 48, text: '有些东西比金钱和地位更值得追求。', dimensionId: 'ideal', reverse: false, weight: 0.8 },
]
