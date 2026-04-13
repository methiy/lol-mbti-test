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
