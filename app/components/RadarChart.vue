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
